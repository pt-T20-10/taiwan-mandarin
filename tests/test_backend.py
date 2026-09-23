import copy
import json
import uuid
import io
import wave
import pytest
from fastapi.testclient import TestClient
from backend import db
from backend.app import app
from backend.content import bundled, envelope, validate_package
from backend.ai import ai

HEADERS={'X-Mandarin-Client':'local-ui'}

@pytest.fixture
def client(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path)
    async def no_voices(): ai.voices=[]
    monkeypatch.setattr(ai,'discover_voices',no_voices)
    with TestClient(app,headers=HEADERS) as c:
        yield c

def mutation(version=0,text='ghi chú'):
    return dict(collection='notes',id='personal',expected_version=version,data={'text':text})

def event(action='lesson:test:1'):
    return dict(id=str(uuid.uuid4()),action_key=action,kind='answer',skill='writing',item_id='word',correct=False,assisted=False,answer='学',duration_ms=1000,algorithm='closed-v1',timestamp='2026-09-23T00:00:00Z',category='chữ')

def test_content_integrity_and_references():
    package=bundled();c=validate_package(package)
    assert len(c['units'])>=1
    bad=copy.deepcopy(package);bad['content']['title']='tampered'
    with pytest.raises(ValueError):validate_package(bad)
    bad=copy.deepcopy(c);bad['units'][0]['lessons'][0]['word_ids']=['missing']
    with pytest.raises(ValueError):validate_package(envelope(bad))
    bad=copy.deepcopy(c);bad['units'][0]['lessons'][0]['exercises'][0]['stimulus']['vi']='mismatched'
    with pytest.raises(ValueError):validate_package(envelope(bad))
    bad=copy.deepcopy(c);bad['units'][0]['words'][0]['pinyin']='ni3 hao3'
    with pytest.raises(ValueError):validate_package(envelope(bad))

def test_event_idempotency_atomic_conflict(client):
    e=event();body={'event':e,'mutation':mutation()}
    assert client.post('/api/events',json=body).status_code==200
    assert client.post('/api/events',json=body).json()['duplicate']
    # A second tab with the same logical action must not add another event.
    body['event']=event()
    assert client.post('/api/events',json=body).json()['duplicate']
    assert len(client.get('/api/state').json()['events'])==1
    response=client.post('/api/events',json={'event':event('other'),'mutation':mutation()})
    assert response.status_code==409
    assert len(client.get('/api/state').json()['events'])==1
    assert client.get('/api/state').json()['objects']['notes']['personal']['version']==1
    different=event();different.update(answer='other',correct=True)
    assert client.post('/api/events',json={'event':different}).status_code==409

def test_backup_restore_and_restart(client):
    client.post('/api/objects',json=mutation())
    client.post('/api/events',json={'event':event()})
    backup=client.get('/api/backup').json()
    client.post('/api/objects',json=mutation(1,'new'))
    assert client.post('/api/restore',json=backup).status_code==200
    db.init()
    s=client.get('/api/state').json()
    assert s['objects']['notes']['personal']['data']['text']=='ghi chú'
    assert len(s['events'])==1
    assert (db.DATA/'before-restore.json').exists()
    assert client.post('/api/objects',json=mutation(2,'stale tab')).status_code==409

def test_bad_restore_rolls_back(client):
    client.post('/api/objects',json=mutation())
    backup=client.get('/api/backup').json()
    backup['objects'].append(backup['objects'][0])
    assert client.post('/api/restore',json=backup).status_code==422
    assert client.get('/api/state').json()['objects']['notes']['personal']['data']['text']=='ghi chú'

def test_update_keeps_progress_and_rejects_bad_package(client):
    client.post('/api/objects',json=mutation())
    p=bundled();p['content']['version']+=1;p=envelope(p['content'])
    assert client.post('/api/packages',json=p).status_code==200
    assert client.get('/api/state').json()['objects']['notes']['personal']['version']==1
    assert client.post('/api/packages',json=p).status_code==409
    p['manifest']['sha256']='bad'
    assert client.post('/api/packages',json=p).status_code==422
    assert client.get('/api/content').json()['version']==bundled()['content']['version']+1

def test_no_remote_mutation_and_no_missing_voice_fallback(client):
    assert client.post('/api/objects',json=mutation(),headers={'origin':'https://evil.example'}).status_code==403
    assert client.get('/api/state',headers={'host':'evil.example'}).status_code==403
    assert client.post('/api/ai/tts',json={'text':'你好'}).status_code==503
    assert client.post('/api/events',json={'event':{**event(),'duration_ms':-1}}).status_code==422

def test_tombstone_and_conflict(client):
    m=mutation();assert client.post('/api/objects',json=m).status_code==200
    m.update(expected_version=1,deleted=True)
    assert client.post('/api/objects',json=m).status_code==200
    assert client.get('/api/state').json()['objects']['notes']['personal']['deleted']
    assert client.post('/api/objects',json=m).status_code==409

def test_silence_has_no_hallucinated_transcript(client):
    buf=io.BytesIO()
    with wave.open(buf,'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(16000);w.writeframes(b'\0\0'*16000)
    response=client.post('/api/ai/asr',content=buf.getvalue(),headers={'Content-Type':'audio/wav'})
    assert response.status_code==200
    assert response.json()['text']==''
    assert 'im lặng' in response.json()['notice']

def test_corrupted_wav_reports_validation_error(client):
    response=client.post('/api/ai/asr',content=b'RIFF\x00\x00\x00\x00WAVE',headers={'Content-Type':'audio/wav'})
    assert response.status_code==422
    assert 'WAV' in response.json()['detail']

def test_bulk_import_atomic_and_invalid_backup_rejected(client):
    card={'word':{'hanzi':'你好','pinyin':'nǐ hǎo','vi':'xin chào'},'direction':'recognize','tags':[],
          'schedule':{'due':'2026-09-23T00:00:00Z','stability':0,'difficulty':0,'reps':0,'lapses':0,'state':0,'scheduled_days':0,'elapsed_days':0,'learning_steps':0}}
    good={'collection':'cards','id':'one','expected_version':0,'data':card}
    bad={**good,'id':'two','data':{**card,'direction':'unknown'}}
    assert client.post('/api/objects/import',json={'mutations':[good,bad]}).status_code==422
    assert client.get('/api/state').json()['objects']['cards']=={}
    assert client.post('/api/objects/import',json={'mutations':[good]}).status_code==200
    backup=client.get('/api/backup').json()
    backup['objects'][0]['payload']='{}'
    assert client.post('/api/restore',json=backup).status_code==422
    assert len(client.get('/api/state').json()['objects']['cards'])==1

def test_package_cannot_remove_stable_ids(client):
    p=bundled()['content'];p['version']+=1;p['units']=p['units'][:-1]
    assert client.post('/api/packages',json=envelope(p)).status_code==422
    assert len(client.get('/api/content').json()['units'])==12
