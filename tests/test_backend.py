import copy
import json
import uuid
import io
import wave
import hashlib
import math
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from backend import db
from backend.app import app
from backend.content import bundled, envelope, validate_package
from backend.ai import ai

HEADERS={'X-Mandarin-Client':'local-ui'}

def test_packaged_characters_and_visual_pinyin_are_complete():
    root=Path(__file__).resolve().parents[1];content=bundled()['content']
    manifest=json.loads((root/'public/learning/manifest.json').read_text(encoding='utf-8'))
    actual={p.relative_to(root/'public/learning').as_posix() for p in (root/'public/learning').rglob('*') if p.is_file() and p.name!='manifest.json'}
    assert actual=={f['path'] for f in manifest['files']}
    for file in manifest['files']:
        data=(root/'public/learning'/file['path']).read_bytes()
        assert len(data)==file['bytes'] and hashlib.sha256(data).hexdigest()==file['sha256']
    characters=set(''.join(w['hanzi'] for u in content['units'] for w in u['words']))
    assert len(characters)==424
    for char in characters:
        data=json.loads((root/f'public/learning/characters/{ord(char)}.json').read_text(encoding='utf-8'))
        assert data['character']==char and data['radical']
        assert len(data['strokes'])==data['expected_count']
        pending=1
        for part in data['decomposition']:
            assert pending>0,(char,data['decomposition'])
            pending-=1
            pending+=3 if part in '⿲⿳' else 2 if part in '⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻' else 0
        assert not data['decomposition'] or pending==0,(char,data['decomposition'])
        assert data['copyright'] and '2026-09-' in data['modification']
        for stroke in data['strokes']:
            assert stroke['outline'] and len(stroke['median'])>1
            assert all(math.isfinite(v) for v in stroke['matrix'])
    catalog=json.loads((root/'public/learning/pinyin/catalog.json').read_text(encoding='utf-8'))
    assert len(catalog)==406
    assert all(set(row)=={'base','initial','final'} for row in catalog)
    assert not list((root/'public/learning/pinyin').rglob('*.WAV'))
    assert not list((root/'public/learning/pinyin').rglob('*.mp3'))

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

def test_v4_package_compatibility_and_grammar_upgrade_preserves_learning(client):
    current=bundled();legacy=copy.deepcopy(current['content']);legacy['version']=4;legacy.pop('grammar_roadmap',None);legacy.pop('grammar_batches',None)
    for unit in legacy['units']:
        for grammar in unit['grammar']:
            for key in ('title','pattern','restrictions','common_mistake','examples','exercises','status','group','level','prerequisites','references'):grammar.pop(key,None)
        for lesson in unit['lessons']:
            for ex in lesson['exercises']:ex.pop('grammar_id',None)
    old=envelope(legacy);validate_package(old)
    backup=client.get('/api/backup').json();backup['packages']=[{'id':'foundation-tw','version':4,'payload':json.dumps(old,ensure_ascii=False)}]
    assert client.post('/api/restore',json=backup).status_code==200
    session={'collection':'sessions','id':legacy['units'][0]['lessons'][0]['id'],'expected_version':0,'data':{'index':2,'phase':'exercise','draft':'保留','answers':[],'run':'test'}}
    assert client.post('/api/objects',json=session).status_code==200
    assert client.post('/api/events',json={'event':event('upgrade-test')}).status_code==200
    before=client.get('/api/state').json()
    assert client.post('/api/packages',json=current).status_code==200
    after=client.get('/api/state').json();assert before==after
    assert len(client.get('/api/content').json()['units'][0]['grammar'][0]['exercises'])==4
    grammar_session={**session,'id':'grammar:'+legacy['units'][0]['grammar'][0]['id'],'data':{'scope':'grammar','phase':'exercise','index':1,'draft':'是','answers':[],'run':'test-grammar'}}
    assert client.post('/api/objects',json=grammar_session).status_code==200
    saved=client.get('/api/backup').json();assert client.post('/api/restore',json=saved).status_code==200
    assert client.get('/api/state').json()['objects']['sessions'][grammar_session['id']]['data']['draft']=='是'

def test_ready_grammar_requires_examples_and_valid_links():
    payload=copy.deepcopy(bundled()['content']);payload['units'][0]['grammar'][0]['examples']=[]
    with pytest.raises(ValueError):validate_package(envelope(payload))
    payload=copy.deepcopy(bundled()['content']);payload['units'][0]['grammar'][0]['exercises'][0]['grammar_id']='missing'
    with pytest.raises(ValueError):validate_package(envelope(payload))

def test_prerequisites_and_roadmap_reject_cycles_and_wrong_groups():
    payload=copy.deepcopy(bundled()['content'])
    first,second=payload['units'][0]['grammar']
    first['prerequisites']=[second['id']];second['prerequisites']=[first['id']]
    with pytest.raises(ValueError,match='vòng lặp'):validate_package(envelope(payload))
    payload=copy.deepcopy(bundled()['content'])
    payload['grammar_batches'][0]['prerequisites']=[payload['grammar_batches'][-1]['id']]
    with pytest.raises(ValueError,match='vòng lặp'):validate_package(envelope(payload))
    payload=copy.deepcopy(bundled()['content']);payload['grammar_roadmap'][0]['group']='wrong'
    with pytest.raises(ValueError):validate_package(envelope(payload))

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

def test_asr_never_seeds_user_transcript_with_fixed_prompt(client,tmp_path,monkeypatch):
    # TEST subprocess only: regression for the reported prompt echo. This does
    # not certify recognition of the user's unavailable recording.
    executable=tmp_path/'whisper.exe';model=tmp_path/'base.bin'
    executable.touch();model.touch()
    monkeypatch.setattr(ai,'paths',lambda:(executable,model,executable,model))
    arguments=[]
    class Process:
        returncode=0
        async def communicate(self):return b'',b''
    async def spawn(*args,**kwargs):
        arguments.extend(args)
        Path(args[args.index('-of')+1]+'.txt').write_text('TEST 我是越南人',encoding='utf-8')
        return Process()
    monkeypatch.setattr('backend.ai.asyncio.create_subprocess_exec',spawn)
    buffer=io.BytesIO()
    with wave.open(buffer,'wb') as wav:
        wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(16000);wav.writeframes(b'\xf4\x01\x0c\xfe'*8000)
    response=client.post('/api/ai/asr',content=buffer.getvalue(),headers={'Content-Type':'audio/wav'})
    assert response.status_code==200
    assert response.json()['text']=='TEST 我是越南人'
    assert '--prompt' not in arguments and '--carry-initial-prompt' not in arguments
    assert not any('逐字稿' in value or '我是越南人' in value for value in arguments)

def test_native_voice_selection_and_rate_are_validated(client,monkeypatch):
    monkeypatch.setattr(ai,'voices',['TEST zh-TW'])
    assert client.post('/api/ai/tts',json={'text':'你好','voice':'unknown'}).status_code==422
    assert client.post('/api/ai/tts',json={'text':'你好','rate':8}).status_code==422

def test_asr_model_selection_is_persisted_without_changing_llm(client,tmp_path,monkeypatch):
    monkeypatch.setattr('backend.app.ROOT',tmp_path)
    monkeypatch.setattr(ai,'config',{'model':'Qwen3-4B-Q4_K_M.gguf','runtime':'cuda','asr_model':'ggml-base.bin'})
    (tmp_path/'models').mkdir();(tmp_path/'models/ggml-small.bin').touch()
    assert client.post('/api/ai/asr/config',json={'model':'../../outside.bin'}).status_code==422
    assert client.post('/api/ai/asr/config',json={'model':'ggml-base.bin'}).status_code==422
    assert client.post('/api/ai/asr/config',json={'model':'ggml-small.bin'}).status_code==200
    saved=json.loads((tmp_path/'models/active.json').read_text())
    assert saved=={'model':'Qwen3-4B-Q4_K_M.gguf','runtime':'cuda','asr_model':'ggml-small.bin'}

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
    assert len(client.get('/api/content').json()['units'])==18
