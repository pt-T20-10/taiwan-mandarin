import asyncio
import json
import os
import sqlite3
from contextlib import asynccontextmanager
from typing import Literal
from urllib.parse import urlparse
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from . import db
from .ai import ai
from .content import ROOT, validate_package

shutdown_callback = None
asr_lock = asyncio.Lock()

@asynccontextmanager
async def lifespan(app):
    db.init()
    await ai.discover_voices()
    yield
    ai.stop()

app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None)

@app.middleware('http')
async def local_only(request: Request, call_next):
    host = request.headers.get('host', '').split(':')[0]
    if host not in ('127.0.0.1', 'localhost', 'testserver'):
        return JSONResponse({'detail': 'Chỉ cho phép localhost'}, status_code=403)
    origin = request.headers.get('origin')
    if request.method not in ('GET', 'HEAD', 'OPTIONS'):
        if origin and origin not in (f'http://{request.headers.get("host")}', 'http://127.0.0.1:5173', 'http://localhost:5173'):
            return JSONResponse({'detail': 'Origin không được phép'}, status_code=403)
        if request.headers.get('x-mandarin-client') != 'local-ui':
            return JSONResponse({'detail': 'Thiếu header ứng dụng'}, status_code=403)
    if int(request.headers.get('content-length', '0')) > 25_000_000:
        return JSONResponse({'detail': 'Dữ liệu quá lớn'}, status_code=413)
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'no-referrer'
    response.headers['Content-Security-Policy'] = "default-src 'self'; connect-src 'self'; img-src 'self' data:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; frame-ancestors 'none'"
    if request.url.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response

@app.exception_handler(db.Conflict)
async def conflict_handler(request, exc):
    return JSONResponse({'detail': str(exc)}, status_code=409)

@app.exception_handler(ValueError)
async def value_handler(request, exc):
    return JSONResponse({'detail': str(exc)}, status_code=422)

@app.get('/api/health')
def health():
    return {'app': 'taiwan-mandarin', 'version': '0.1.0', 'schema': 1}

@app.get('/api/state')
def state():
    return db.get_state()

@app.get('/api/content')
def content():
    with db.connect() as conn:
        return json.loads(conn.execute("SELECT payload FROM packages WHERE id='foundation-tw'").fetchone()[0])['content']

class Mutation(BaseModel):
    collection: Literal['sessions','cards','notes','settings','placement','chats','reports']
    id: str = Field(min_length=1, max_length=200)
    expected_version: int = Field(ge=0)
    data: dict
    deleted: bool = False

@app.post('/api/objects')
def put_object(body: Mutation):
    if len(json.dumps(body.data)) > 1_000_000:
        raise HTTPException(413, 'Bản ghi quá lớn')
    with db.connect() as conn:
        conn.execute('BEGIN IMMEDIATE')
        version = db.put_object(conn, **body.model_dump())
        return {'version': version}

class BulkObjects(BaseModel):
    mutations: list[Mutation] = Field(min_length=1, max_length=2000)

@app.post('/api/objects/import')
def import_objects(body: BulkObjects):
    if any(m.collection != 'cards' for m in body.mutations):
        raise HTTPException(422, 'Nhập hàng loạt chỉ hỗ trợ thẻ')
    with db.connect() as conn:
        conn.execute('BEGIN IMMEDIATE')
        for m in body.mutations:
            db.put_object(conn, **m.model_dump())
    return {'imported':len(body.mutations)}

class LearningEvent(BaseModel):
    id: str = Field(min_length=1, max_length=100)
    action_key: str = Field(min_length=1, max_length=300)
    kind: Literal['answer','review','practice','speaking','writing','stroke']
    skill: str = Field(max_length=40)
    item_id: str = Field(max_length=200)
    correct: bool | None = None
    assisted: bool = False
    answer: str = Field(default='', max_length=5000)
    duration_ms: int = Field(default=0, ge=0, le=300000)
    algorithm: str = 'closed-v1'
    timestamp: str
    category: str = ''
    rating: int | None = Field(default=None, ge=1, le=4)

class EventRequest(BaseModel):
    event: LearningEvent
    mutation: Mutation | None = None

@app.post('/api/events')
def event(body: EventRequest):
    return db.save_event(body.event.model_dump(), body.mutation.model_dump() if body.mutation else None)

@app.get('/api/backup')
def backup():
    with db.connect() as conn:
        return JSONResponse(db.snapshot(conn), headers={'Content-Disposition':'attachment; filename="dao-nho-backup.json"'})

@app.post('/api/restore')
def restore(payload: dict):
    try:
        return db.restore(payload)
    except (KeyError, TypeError, sqlite3.Error) as exc:
        raise HTTPException(422, 'Bản sao lưu không hợp lệ; dữ liệu hiện tại được giữ nguyên') from exc

@app.post('/api/packages')
def install_package(package: dict):
    try:
        c = validate_package(package)
    except (KeyError, TypeError) as exc:
        raise HTTPException(422, 'Gói không hợp lệ') from exc
    with db.connect() as conn:
        conn.execute('BEGIN IMMEDIATE')
        old = conn.execute('SELECT version,payload FROM packages WHERE id=?', (c['id'],)).fetchone()
        if old and c['version'] <= old['version']:
            raise HTTPException(409, 'Chỉ cài phiên bản mới hơn')
        if old:
            previous=json.loads(old['payload'])['content']
            def ids(content):
                result=set()
                for u in content['units']:
                    result.add(u['id'])
                    for kind in ('words','grammar','lessons'):
                        result.update(x['id'] for x in u[kind])
                    for lesson in u['lessons']:result.update(x['id'] for x in lesson['exercises'])
                    for grammar in u['grammar']:result.update(x['id'] for x in grammar.get('exercises',[]))
                return result
            if not ids(previous) <= ids(c):
                raise HTTPException(422,'Gói cập nhật làm mất ID cũ; cần migration nội dung riêng')
        if old:
            (db.DATA / 'previous-package.json').write_text(old['payload'], encoding='utf-8')
        conn.execute('INSERT INTO packages VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET version=excluded.version,payload=excluded.payload', (c['id'], c['version'], json.dumps(package, ensure_ascii=False)))
    return {'version': c['version']}

@app.get('/api/status')
def status():
    sizes = {}
    for folder in ('models', 'runtime', 'data', 'dist', 'content', 'public'):
        sizes[folder] = sum(f.stat().st_size for f in (ROOT / folder).rglob('*') if f.is_file()) if (ROOT / folder).exists() else 0
    return {**ai.status(), 'sizes': sizes, 'budget_bytes': 10_000_000_000}

class AIConfig(BaseModel):
    model: Literal['Qwen3-1.7B-Q4_K_M.gguf','Qwen3-4B-Q4_K_M.gguf']
    runtime: Literal['cpu','cuda']

@app.post('/api/ai/config')
async def ai_config(body: AIConfig):
    if ai.active:
        raise HTTPException(409,'Hãy hủy hoặc chờ lượt AI đang chạy')
    folder='llama-cuda' if body.runtime=='cuda' else 'llama'
    if not (ROOT/'models'/body.model).exists() or not (ROOT/'runtime'/folder/'llama-server.exe').exists():
        raise HTTPException(422,'Model/runtime chưa cài đủ')
    ai.stop();ai.config.update(body.model_dump())
    (ROOT/'models/active.json').write_text(json.dumps(ai.config),encoding='utf-8')
    return ai.status()

class ASRConfig(BaseModel):
    model: Literal['ggml-base.bin','ggml-small.bin']

@app.post('/api/ai/asr/config')
async def asr_config(body: ASRConfig):
    if asr_lock.locked():
        raise HTTPException(409,'Hãy chờ hoặc hủy nhận dạng đang chạy trước khi đổi model')
    if not (ROOT/'models'/body.model).exists():
        raise HTTPException(422,'Model ASR chưa được cài')
    ai.config['asr_model']=body.model
    (ROOT/'models/active.json').write_text(json.dumps(ai.config),encoding='utf-8')
    return ai.status()

class Message(BaseModel):
    role: Literal['user', 'assistant']
    content: str = Field(min_length=1, max_length=3000)

class ChatRequest(BaseModel):
    messages: list[Message] = Field(min_length=1, max_length=24)
    mode: Literal['chat', 'feedback'] = 'chat'
    request_id: str = Field(min_length=1, max_length=100)

@app.post('/api/ai/chat')
async def chat(body: ChatRequest):
    if ai.active:
        raise HTTPException(409, 'AI đang xử lý một lượt; hãy chờ hoặc hủy lượt trước')
    task = asyncio.create_task(ai.chat([m.model_dump() for m in body.messages], body.mode, body.request_id))
    ai.active[body.request_id] = task
    try:
        return await task
    except asyncio.CancelledError:
        raise HTTPException(409, 'Đã hủy tạo câu')
    except (RuntimeError, Exception) as exc:
        raise HTTPException(503, str(exc))
    finally:
        ai.active.pop(body.request_id, None)

@app.post('/api/ai/cancel/{request_id}')
async def cancel(request_id: str):
    task = ai.active.get(request_id)
    if task:
        task.cancel()
        ai.stop()
    return {'cancelled': bool(task)}

@app.post('/api/ai/unload')
async def unload():
    for task in list(ai.active.values()):
        task.cancel()
    ai.stop()
    return {'stopped': True}

@app.post('/api/ai/asr')
async def asr(request: Request):
    if asr_lock.locked():
        raise HTTPException(409,'Đang nhận dạng một bản ghi khác. Hãy chờ hoặc hủy lượt đó.')
    try:
        audio=await request.body()
        async with asr_lock:
            task=asyncio.create_task(ai.transcribe(audio))
            try:
                while not task.done():
                    if await request.is_disconnected():
                        task.cancel()
                        try:await task
                        except asyncio.CancelledError:pass
                        raise HTTPException(499,'Đã hủy nhận dạng')
                    await asyncio.sleep(.1)
                return await task
            finally:
                if not task.done():task.cancel()
    except RuntimeError as exc:
        raise HTTPException(503, str(exc))

class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1200)
    voice: str | None = Field(default=None, max_length=200)
    rate: int = Field(default=0, ge=-2, le=1)

@app.post('/api/ai/tts')
async def tts(body: TTSRequest):
    try:
        return Response(await ai.synthesize(body.text, body.voice, body.rate), media_type='audio/wav')
    except RuntimeError as exc:
        raise HTTPException(503, str(exc))

@app.post('/api/shutdown')
async def shutdown():
    ai.stop()
    if shutdown_callback:
        asyncio.get_running_loop().call_later(.5, shutdown_callback)
    return {'stopped': True}

if (ROOT / 'dist').exists():
    app.mount('/', StaticFiles(directory=ROOT / 'dist', html=True), name='web')
