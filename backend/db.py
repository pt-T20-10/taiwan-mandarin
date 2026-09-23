import json
import os
import math
import sqlite3
import uuid
from contextlib import contextmanager
from pathlib import Path
from datetime import datetime, timezone
from .content import ROOT, bundled, validate_package

DATA = Path(os.environ.get('MANDARIN_DATA_DIR', ROOT / 'data'))
COLLECTIONS = {'sessions', 'cards', 'notes', 'settings', 'placement', 'chats', 'reports'}

def now():
    return datetime.now(timezone.utc).isoformat()

@contextmanager
def connect():
    DATA.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DATA / 'learning.sqlite3', timeout=20)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

def init():
    with connect() as db:
        db.execute('PRAGMA journal_mode=WAL')
        version = db.execute('PRAGMA user_version').fetchone()[0]
        if version > 1:
            raise RuntimeError('Database mới hơn ứng dụng; không tự hạ schema')
        if version == 0:
            db.executescript('''
                CREATE TABLE meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
                CREATE TABLE objects(collection TEXT NOT NULL, id TEXT NOT NULL, version INTEGER NOT NULL,
                    payload TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(collection,id));
                CREATE TABLE events(id TEXT PRIMARY KEY, action_key TEXT UNIQUE NOT NULL, device_id TEXT NOT NULL,
                    created_at TEXT NOT NULL, payload TEXT NOT NULL);
                CREATE TABLE packages(id TEXT PRIMARY KEY, version INTEGER NOT NULL, payload TEXT NOT NULL);
                PRAGMA user_version=1;
            ''')
            db.execute('INSERT INTO meta VALUES(?,?)', ('device_id', str(uuid.uuid4())))
        package = bundled()
        content = validate_package(package)
        existing = db.execute('SELECT version FROM packages WHERE id=?', (content['id'],)).fetchone()
        if not existing:
            db.execute('INSERT INTO packages VALUES(?,?,?)', (content['id'], content['version'], json.dumps(package, ensure_ascii=False)))

def snapshot(db):
    return {'schema': 1, 'created_at': now(), 'objects': [dict(r) for r in db.execute('SELECT * FROM objects')],
            'events': [dict(r) for r in db.execute('SELECT * FROM events ORDER BY created_at,id')],
            'packages': [dict(r) for r in db.execute('SELECT * FROM packages')]}

def get_state():
    with connect() as db:
        objects = {c: {} for c in COLLECTIONS}
        for row in db.execute('SELECT * FROM objects'):
            objects[row['collection']][row['id']] = {'version': row['version'], 'deleted': bool(row['deleted']), 'data': json.loads(row['payload'])}
        return {'device_id': db.execute("SELECT value FROM meta WHERE key='device_id'").fetchone()[0],
                'objects': objects, 'events': [json.loads(r['payload']) for r in db.execute('SELECT payload FROM events ORDER BY created_at,id')]}

class Conflict(Exception):
    pass

def put_object(db, collection, id, expected_version, data, deleted=False):
    if collection not in COLLECTIONS:
        raise ValueError('Loại dữ liệu không hợp lệ')
    validate_object(collection, data)
    row = db.execute('SELECT version FROM objects WHERE collection=? AND id=?', (collection, id)).fetchone()
    current = row['version'] if row else 0
    if current != expected_version:
        raise Conflict('Dữ liệu đã thay đổi ở tab khác. Tải lại trước khi lưu; bản nháp của bạn vẫn ở ô nhập.')
    db.execute('INSERT INTO objects VALUES(?,?,?,?,?) ON CONFLICT(collection,id) DO UPDATE SET version=excluded.version,payload=excluded.payload,deleted=excluded.deleted',
               (collection, id, current + 1, json.dumps(data, ensure_ascii=False), int(deleted)))
    return current + 1

def validate_object(collection, data):
    if not isinstance(data, dict):
        raise ValueError('Bản ghi phải là đối tượng')
    if collection == 'cards':
        if not isinstance(data.get('word'), dict) or any(not isinstance(data['word'].get(k), str) or not data['word'][k].strip() for k in ('hanzi','pinyin','vi')):
            raise ValueError('Thẻ thiếu Hán tự/Pinyin/nghĩa')
        if data.get('direction') not in ('recognize','produce','audio','write','cloze','situation'):
            raise ValueError('Hướng thẻ không hợp lệ')
        if not isinstance(data.get('schedule'),dict) or not isinstance(data.get('tags'),list):
            raise ValueError('Thẻ thiếu lịch ôn hoặc nhãn')
        s=data['schedule']
        for field in ('due','stability','difficulty','reps','lapses','state','scheduled_days','elapsed_days','learning_steps'):
            if field not in s:raise ValueError('Lịch ôn thiếu '+field)
        for field in ('stability','difficulty','reps','lapses','state','scheduled_days','elapsed_days','learning_steps'):
            value=s[field]
            if not isinstance(value,(int,float)) or not math.isfinite(value) or value<0:raise ValueError('Lịch ôn chứa số không hợp lệ')
        if s['state'] not in (0,1,2,3):raise ValueError('Trạng thái lịch ôn không hợp lệ')
        try:datetime.fromisoformat(str(s['due']).replace('Z','+00:00'))
        except ValueError:raise ValueError('Ngày ôn không hợp lệ')
    if collection == 'sessions' and (data.get('phase') not in ('intro','exercise','summary') or not isinstance(data.get('index'),int) or data['index']<0 or not isinstance(data.get('answers'),list)):
        raise ValueError('Tiến độ bài học không hợp lệ')
    if collection == 'notes' and not isinstance(data.get('text'),str):
        raise ValueError('Ghi chú không hợp lệ')

def save_event(event, mutation=None):
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        existing = db.execute('SELECT payload FROM events WHERE id=? OR action_key=?', (event['id'], event['action_key'])).fetchone()
        if existing:
            old = json.loads(existing['payload'])
            if old['id'] == event['id'] and old != event:
                raise Conflict('ID sự kiện đã được dùng cho nội dung khác')
            fields=('kind','skill','item_id','correct','assisted','answer','rating','algorithm')
            if any(old.get(key)!=event.get(key) for key in fields):
                raise Conflict('Câu/thẻ này đã được trả lời khác ở tab còn lại. Hãy tải lại để xem kết quả đã lưu.')
            return {'duplicate': True}
        if mutation:
            put_object(db, **mutation)
        device = db.execute("SELECT value FROM meta WHERE key='device_id'").fetchone()[0]
        db.execute('INSERT INTO events VALUES(?,?,?,?,?)', (event['id'], event['action_key'], device, now(), json.dumps(event, ensure_ascii=False)))
        return {'duplicate': False}

def restore(payload):
    if payload.get('schema') != 1 or set(payload) != {'schema', 'created_at', 'objects', 'events', 'packages'}:
        raise ValueError('Schema bản sao lưu không hợp lệ')
    if not payload['packages']:
        raise ValueError('Bản sao lưu thiếu nội dung')
    for p in payload['packages']:
        c = validate_package(json.loads(p['payload']))
        if p['id'] != c['id'] or p['version'] != c['version']:
            raise ValueError('Metadata gói không khớp')
    for o in payload['objects']:
        if o['collection'] not in COLLECTIONS or o['version'] < 1 or o['deleted'] not in (0, 1):
            raise ValueError('Bản ghi không hợp lệ')
        if not isinstance(json.loads(o['payload']), dict):
            raise ValueError('Dữ liệu phải là đối tượng')
        validate_object(o['collection'],json.loads(o['payload']))
    for e in payload['events']:
        obj = json.loads(e['payload'])
        if obj['id'] != e['id'] or obj['action_key'] != e['action_key']:
            raise ValueError('Sự kiện không hợp lệ')
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        safety = DATA / 'before-restore.json'
        safety.write_text(json.dumps(snapshot(db), ensure_ascii=False), encoding='utf-8')
        old_versions={(r['collection'],r['id']):r['version'] for r in db.execute('SELECT collection,id,version FROM objects')}
        for table, columns in [('objects', ('collection','id','version','payload','deleted')), ('events', ('id','action_key','device_id','created_at','payload')), ('packages', ('id','version','payload'))]:
            db.execute(f'DELETE FROM {table}')
            for row in payload[table]:
                if table=='objects':
                    # Never reuse a pre-restore revision: open tabs must reload.
                    row={**row,'version':max(row['version'],old_versions.get((row['collection'],row['id']),0))+1}
                db.execute(f'INSERT INTO {table} VALUES({",".join("?" for _ in columns)})', tuple(row[c] for c in columns))
    return {'restored': True, 'safety_copy': 'data/before-restore.json'}
