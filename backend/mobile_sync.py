"""Flashcard-only LAN service. Desktop endpoints remain loopback-only."""
import asyncio
import base64
import hashlib
import json
import os
import secrets
import socket
import ssl
import subprocess
import threading
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field, ConfigDict, AwareDatetime
from . import db
from .content import ROOT

VOICE = 'Microsoft Yating'
SERVICE_TYPE = '_daonho._tcp.local.'

def digest(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def canon_pinyin(value):
    # Same normalization as the existing learning core (without touching Hanzi).
    marks={'a':'āáǎà','e':'ēéěè','i':'īíǐì','o':'ōóǒò','u':'ūúǔù','ü':'ǖǘǚǜ'}
    import re
    value=unicodedata.normalize('NFC',value).lower().replace('u:','ü').replace('v','ü')
    def tone(m):
        s,t=m[1],int(m[2])%5
        if not t:return s
        at=next((s.index(c) for c in ['a','e'] if c in s),-1)
        if at<0 and 'ou' in s:at=s.index('o')
        if at<0:at=next((i for i in range(len(s)-1,-1,-1) if s[i] in marks),-1)
        return s if at<0 else s[:at]+marks[s[at]][t-1]+s[at+1:]
    return re.sub(r"[\s'’.,!?，。！？·-]",'',re.sub(r'([a-zü]+)([0-5])',tone,value))

def cards_snapshot():
    groups={}
    with db.connect() as conn:
        rows=conn.execute("SELECT id,payload,deleted FROM objects WHERE collection='cards' ORDER BY id").fetchall()
    for row in rows:
        c=json.loads(row['payload'])
        if row['deleted'] or c.get('suspended'):continue
        w=c.get('word',{})
        if not all(isinstance(w.get(k),str) and w[k].strip() for k in ('hanzi','pinyin','vi')):continue
        h=unicodedata.normalize('NFC',w['hanzi']).strip()
        key=digest(h+'\0'+canon_pinyin(w['pinyin']))
        group=groups.setdefault(key,{'id':key,'hanzi':h,'pinyin':w['pinyin'],'meanings':[],
            'card_ids':[],'decks':[],'audio_key':digest('yating-v1\0'+h)})
        group['card_ids'].append(row['id'])
        if w['vi'] not in group['meanings']:group['meanings'].append(w['vi'])
        if c.get('deck') and c['deck'] not in group['decks']:group['decks'].append(c['deck'])
    return sorted(groups.values(),key=lambda c:c['id'])

def local_addresses():
    import ifaddr
    addresses=[]
    for adapter in ifaddr.get_adapters():
        for entry in adapter.ips:
            ip=entry.ip
            if isinstance(ip,str) and not ip.startswith(('127.','169.254.')):addresses.append(ip)
    addresses=sorted(set(addresses))
    # UDP connect chooses the local default-route source without sending packets.
    # Prefer Wi-Fi/Ethernet routing over a lexically first virtual adapter.
    try:
        with socket.socket(socket.AF_INET,socket.SOCK_DGRAM) as route:
            route.connect(('192.0.2.1',9));preferred=route.getsockname()[0]
        if preferred in addresses:addresses.remove(preferred);addresses.insert(0,preferred)
    except OSError:pass
    return addresses or ['127.0.0.1']

def pc_id():
    with db.connect() as conn:return conn.execute("SELECT value FROM meta WHERE key='device_id'").fetchone()[0]

class Seen(BaseModel):
    model_config=ConfigDict(extra='forbid')
    id: UUID
    word_id: str=Field(pattern=r'^[a-f0-9]{64}$')
    timestamp: AwareDatetime
    duration_ms: int=Field(ge=0,le=86_400_000)
    card_ids: list[str]=Field(max_length=100)

class Push(BaseModel):
    events: list[Seen]=Field(max_length=200)

class MobileSync:
    def __init__(self):
        self.server=None;self.thread=None;self.zc=None;self.info=None
        self.lock=threading.RLock();self.audio_lock=threading.Lock()
        self.bootstrap=None;self.pending={};self.audio_error='';self.port=8766

    @property
    def folder(self):return db.DATA/'mobile-sync'

    def backup(self,conn):
        folder=db.DATA/'backups';folder.mkdir(parents=True,exist_ok=True)
        path=folder/('before-mobile-sync-'+str(time.time_ns())+'.json')
        path.write_text(json.dumps(db.snapshot(conn),ensure_ascii=False),encoding='utf-8')

    def devices(self):
        with db.connect() as conn:
            return [(r['id'],r['version'],json.loads(r['payload'])) for r in conn.execute("SELECT id,version,payload FROM objects WHERE collection='reports' AND id LIKE 'mobile-device:%' AND deleted=0")]

    def tls(self):
        self.folder.mkdir(parents=True,exist_ok=True)
        key=self.folder/'server.key';cert=self.folder/'server.crt'
        if not key.exists() or not cert.exists():
            import shutil
            openssl=shutil.which('openssl') or str(Path(os.environ.get('ProgramFiles','C:/Program Files'))/'Git/usr/bin/openssl.exe')
            result=subprocess.run([openssl,'req','-x509','-newkey','rsa:3072','-nodes','-sha256','-days','3650',
                '-subj','/CN=Dao Nho Personal Sync','-keyout',str(key),'-out',str(cert)],capture_output=True,timeout=60,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
            if result.returncode:raise ValueError('Không tạo được chứng chỉ đồng bộ. Cần OpenSSL từ Git for Windows.')
        return cert,key

    def fingerprint(self):
        cert,_=self.tls()
        return hashlib.sha256(ssl.PEM_cert_to_DER_cert(cert.read_text())).hexdigest()

    def start(self):
        if self.server and self.thread and self.thread.is_alive():return
        cert,key=self.tls()
        config=uvicorn.Config(lan_app,host='0.0.0.0',port=self.port,ssl_certfile=str(cert),ssl_keyfile=str(key),log_level='warning',access_log=False)
        self.server=uvicorn.Server(config)
        self.thread=threading.Thread(target=self.server.run,daemon=True,name='mobile-sync')
        self.thread.start()
        for _ in range(100):
            if self.server.started:break
            if not self.thread.is_alive():raise ValueError('Không mở được cổng đồng bộ 8766; có thể đang được dùng.')
            time.sleep(.05)
        if not self.server.started:raise ValueError('Dịch vụ đồng bộ chưa khởi động được.')
        try:
            from zeroconf import Zeroconf,ServiceInfo,IPVersion
            self.zc=Zeroconf(ip_version=IPVersion.V4Only)
            self.info=ServiceInfo(SERVICE_TYPE,'DaoNho-'+pc_id()+'.'+SERVICE_TYPE,
                addresses=[socket.inet_aton(ip) for ip in local_addresses()],port=self.port,
                properties={'pc_id':pc_id(),'protocol':'1'},server='daonho-'+pc_id()+'.local.')
            self.zc.register_service(self.info)
        except Exception:
            # Direct QR/IP pairing is still available if multicast is blocked.
            if self.zc:self.zc.close()
            self.zc=None

    def stop(self):
        if self.server:self.server.should_exit=True
        if self.zc:
            if self.info:self.zc.unregister_service(self.info)
            self.zc.close();self.zc=None
        if self.thread:self.thread.join(timeout=5)
        with self.lock:self.pending.clear();self.bootstrap=None

    def enable(self,enabled):
        if enabled:self.start()
        else:self.stop()
        with db.connect() as conn:
            conn.execute('BEGIN IMMEDIATE')
            row=conn.execute("SELECT version FROM objects WHERE collection='settings' AND id='mobile-sync'").fetchone()
            if not row:self.backup(conn)
            db.put_object(conn,'settings','mobile-sync',row['version'] if row else 0,{'enabled':enabled})
        return self.status()

    def status(self):
        with self.lock:
            self.pending={k:p for k,p in self.pending.items() if p['expires']>time.time()}
            pending=[{'id':k,'name':v['name']} for k,v in self.pending.items() if v['expires']>time.time() and not v.get('approved')]
        return {'enabled':bool(self.server and self.server.started and self.thread and self.thread.is_alive()),
            'port':self.port,'addresses':local_addresses(),'pc_id':pc_id(),'pending':pending,
            'devices':[{'id':k,'name':v.get('name'),'last_sync':v.get('last_sync')} for k,_,v in self.devices()],
            'cards':len(cards_snapshot()),'voice':VOICE,'audio_error':self.audio_error}

    def pairing(self,address=None):
        if not self.server or not self.server.started:raise ValueError('Bật đồng bộ trước khi tạo QR.')
        if address and address not in local_addresses():raise ValueError('Chọn địa chỉ mạng đang có trên PC.')
        payload={'protocol':1,'pc_id':pc_id(),'address':f'https://{address or local_addresses()[0]}:{self.port}',
            'fingerprint':self.fingerprint(),'secret':secrets.token_urlsafe(32)}
        with self.lock:self.bootstrap={**payload,'expires':time.time()+300}
        return payload

    def confirm(self,pending_id,accept):
        with self.lock:
            p=self.pending.get(pending_id)
            if not p or p['expires']<time.time():raise ValueError('Yêu cầu ghép cặp đã hết hạn.')
            if not accept:self.pending.pop(pending_id);return
            if p.get('approved'):return
            with db.connect() as conn:
                conn.execute('BEGIN IMMEDIATE')
                db.put_object(conn,'reports','mobile-device:'+p['device_id'],0,
                    {'name':p['name'],'token_hash':digest(p['token']),'paired_at':db.now()})
            p['approved']=True

    def revoke(self,device_id):
        with db.connect() as conn:
            conn.execute('BEGIN IMMEDIATE')
            row=conn.execute("SELECT version,payload FROM objects WHERE collection='reports' AND id=?",(device_id,)).fetchone()
            if row:db.put_object(conn,'reports',device_id,row['version'],{'revoked':True},True)
        with self.lock:
            self.pending={k:p for k,p in self.pending.items() if 'mobile-device:'+p['device_id']!=device_id}

    def auth(self,request):
        token=request.headers.get('authorization','').removeprefix('Bearer ')
        for key,_,data in self.devices():
            if secrets.compare_digest(data.get('token_hash',''),digest(token)):
                return key.removeprefix('mobile-device:')
        raise HTTPException(401,'Thiết bị chưa ghép cặp hoặc đã bị thu hồi. Quét QR lại trên PC.')

    def audio(self,key):
        card=next((c for c in cards_snapshot() if c['audio_key']==key),None)
        if not card:raise HTTPException(404,'Audio không thuộc bộ thẻ hiện hành.')
        folder=self.folder/'audio';folder.mkdir(parents=True,exist_ok=True)
        path=folder/(key+'.wav')
        with self.audio_lock:
            if not path.exists():
                temp=folder/(key+'.part.wav')
                payload=base64.b64encode(json.dumps({'text':card['hanzi'],'path':str(temp.resolve())},ensure_ascii=False).encode()).decode()
                try:
                    process=subprocess.run(['powershell.exe','-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',str(ROOT/'scripts/Export-Yating.ps1')],input=payload.encode(),capture_output=True,timeout=90,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
                    if process.returncode or not temp.exists() or temp.stat().st_size<44:
                        raise ValueError('Không tạo được audio Microsoft Yating. Kiểm tra giọng Windows OneCore; không tự thay giọng.')
                    if temp.read_bytes()[:4]!=b'RIFF':raise ValueError('Audio Yating không phải WAV hợp lệ.')
                    temp.replace(path);self.audio_error=''
                except Exception as e:
                    temp.unlink(missing_ok=True);self.audio_error=str(e);raise
        return path

manager=MobileSync()
lan_app=FastAPI(docs_url=None,redoc_url=None,openapi_url=None)

@lan_app.middleware('http')
async def limits(request,call_next):
    if int(request.headers.get('content-length','0'))>1_000_000:return JSONResponse({'detail':'Dữ liệu quá lớn'},413)
    response=await call_next(request);response.headers['Cache-Control']='no-store';return response

@lan_app.exception_handler(ValueError)
async def invalid(request,exc):return JSONResponse({'detail':str(exc)},422)

@lan_app.post('/v1/pair')
def pair(body:dict):
    with manager.lock:
        b=manager.bootstrap
        if not b or b['expires']<time.time() or not secrets.compare_digest(str(body.get('secret','')),b['secret']):raise HTTPException(403,'QR không hợp lệ hoặc đã hết hạn.')
        manager.bootstrap=None
        pending_id=secrets.token_hex(16);poll_key=secrets.token_urlsafe(32)
        manager.pending[pending_id]={'device_id':secrets.token_hex(16),'name':str(body.get('name','Android'))[:80],
            'token':secrets.token_urlsafe(32),'poll_hash':digest(poll_key),'expires':time.time()+300,'approved':False}
        return {'pending_id':pending_id,'poll_key':poll_key}

@lan_app.post('/v1/pair/status')
def pair_status(body:dict):
    with manager.lock:
        p=manager.pending.get(body.get('pending_id'))
        if not p or p['expires']<time.time() or not secrets.compare_digest(p['poll_hash'],digest(str(body.get('poll_key','')))):raise HTTPException(403,'Yêu cầu đã hết hạn hoặc bị từ chối.')
        return {'approved':False} if not p['approved'] else {'approved':True,'token':p['token'],'device_id':p['device_id'],'pc_id':pc_id()}

@lan_app.get('/v1/cards')
def manifest(request:Request):
    manager.auth(request);cards=cards_snapshot()
    return {'protocol':1,'pc_id':pc_id(),'voice':VOICE,'cards':cards,'revision':digest(json.dumps(cards,ensure_ascii=False,sort_keys=True))}

@lan_app.get('/v1/audio/{key}')
async def audio(key:str,request:Request):
    manager.auth(request)
    try:path=await asyncio.to_thread(manager.audio,key)
    except HTTPException:raise
    except Exception as e:raise HTTPException(503,str(e))
    return FileResponse(path,media_type='audio/wav',headers={'X-Audio-SHA256':hashlib.sha256(path.read_bytes()).hexdigest()})

@lan_app.post('/v1/events')
def events(body:Push,request:Request):
    device=manager.auth(request);accepted=[]
    with db.connect() as conn:
        conn.execute('BEGIN IMMEDIATE')
        for seen in body.events:
            identity=str(seen.id);action='mobile:'+device+':'+identity
            event={'id':identity,'action_key':action,'kind':'practice','skill':'vocabulary','item_id':'mobile-word:'+seen.word_id,
                'correct':None,'assisted':False,'answer':'[đã lật và xem thẻ]','duration_ms':seen.duration_ms,
                'algorithm':'mobile-free-review-v1','timestamp':seen.timestamp.astimezone(timezone.utc).isoformat(),
                'category':'','source':'authored','origin':'android','card_ids':seen.card_ids}
            old=conn.execute('SELECT payload FROM events WHERE id=? OR action_key=?',(identity,action)).fetchone()
            if old:
                if json.loads(old['payload'])!=event:raise HTTPException(409,'ID lượt ôn đã được dùng cho nội dung khác.')
            else:conn.execute('INSERT INTO events VALUES(?,?,?,?,?)',(identity,action,device,db.now(),json.dumps(event,ensure_ascii=False)))
            accepted.append(identity)
        key='mobile-device:'+device
        row=conn.execute("SELECT version,payload FROM objects WHERE collection='reports' AND id=?",(key,)).fetchone()
        if row:db.put_object(conn,'reports',key,row['version'],{**json.loads(row['payload']),'last_sync':db.now()})
    return {'accepted':accepted}

def desktop_routes(app):
    @app.get('/api/mobile/status')
    def status():return manager.status()
    @app.post('/api/mobile/enable')
    async def enable(body:dict):return await asyncio.to_thread(manager.enable,bool(body.get('enabled')))
    @app.post('/api/mobile/pairing')
    def pairing(body:dict):return manager.pairing(body.get('address'))
    @app.post('/api/mobile/confirm')
    def confirm(body:dict):manager.confirm(str(body.get('id')),body.get('accept') is True);return {'ok':True}
    @app.post('/api/mobile/revoke')
    def revoke(body:dict):manager.revoke(str(body.get('id')));return {'ok':True}

def resume_enabled():
    if os.environ.get('MANDARIN_DATA_DIR'):return
    row=db.get_state()['objects']['settings'].get('mobile-sync')
    if row and not row['deleted'] and row['data'].get('enabled'):
        try:manager.start()
        except Exception as e:manager.audio_error=str(e)
