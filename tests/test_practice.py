import asyncio,copy,json,uuid
import hashlib
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend import db,practice
from backend.ai import ai
from backend.content import bundled,PracticeSet,canonical,envelope

@pytest.fixture
def client(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path)
    async def voices():ai.voices=[]
    monkeypatch.setattr(ai,'discover_voices',voices)
    practice.jobs.clear();ai.active.clear()
    with TestClient(app,headers={'X-Mandarin-Client':'local-ui'}) as c:yield c

def test_all_practice_counts_references_and_unique_variants():
    c=bundled()['content'];assert c['version']==7
    assert sum(len(u['practice_sets']) for u in c['units'])==216
    assert sum(len(p['items']) for u in c['units'] for p in u['practice_sets'])==1620
    for u in c['units']:
        for skill in practice.KINDS:
            packets=[p for p in u['practice_sets'] if p['skill']==skill]
            assert len(packets)==3
            assert len({json.dumps(p['items'],ensure_ascii=False) for p in packets})==3
            for packet in packets:
                PracticeSet.model_validate(packet)
                assert len({s['hanzi'] for s in packet['passage']})==8
                for q in packet['items']:
                    assert q['explanation'] and q['answers']
                    if q['kind'].startswith('cloze'):assert q['prompt'].count('___')==1

def test_session_and_history_creation_is_atomic_and_ai_events_unscored(client):
    packet=bundled()['content']['units'][0]['practice_sets'][0]
    session={'scope':'skills','unit_id':'tw.greetings','skill':packet['skill'],'packet':packet,'run':'test','index':0,'phase':'exercise','answers':[]}
    mutations=[dict(collection='sessions',id='skills:test',expected_version=0,data=session),dict(collection='reports',id='skills-history:tw.greetings:reading',expected_version=1,data={'kind':'skills-history','runs':[]})]
    assert client.post('/api/practice/sessions',json={'mutations':mutations}).status_code==409
    assert 'skills:test' not in client.get('/api/state').json()['objects']['sessions']
    mutations[1]['expected_version']=0
    assert client.post('/api/practice/sessions',json={'mutations':mutations}).status_code==200
    event=dict(id='ai-event',action_key='ai-event',kind='practice',skill='reading',item_id='ai.q1',source='ai',correct=True,timestamp='2026-09-29T00:00:00Z')
    assert client.post('/api/events',json={'event':event}).status_code==200
    assert client.get('/api/state').json()['events'][0]['correct'] is None

def test_ai_practice_validates_batches_and_can_cancel(client,monkeypatch):
    packet=copy.deepcopy(bundled()['content']['units'][0]['practice_sets'][0]);answers=[]
    for i in range(0,8,2):answers.append({'passage':[{k:t[k] for k in ('hanzi','pinyin','vi')} for t in packet['passage'][i:i+2]]})
    for i in range(0,10,2):answers.append({'items':packet['items'][i:i+2]})
    # Real fixture contains repeated cloze prompt prefix but distinct full prompts.
    async def completion(prompt,max_tokens,schema=None):return answers.pop(0)
    monkeypatch.setattr(practice,'completion',completion)
    body={'unit_id':'tw.greetings','skill':'reading','request_id':'test-generated'}
    assert client.post('/api/ai/practice',json=body).status_code==200
    for _ in range(30):
        job=client.get('/api/ai/practice/test-generated').json()
        if job['status']!='running':break
    assert job['status']=='done',job
    assert job['packet']['source']=='ai' and len(job['packet']['items'])==10
    async def wait(*args):await asyncio.sleep(60)
    monkeypatch.setattr(practice,'completion',wait)
    body['request_id']='cancel-me';client.post('/api/ai/practice',json=body)
    assert client.post('/api/ai/practice',json={**body,'request_id':'blocked'}).status_code==409
    monkeypatch.setattr(ai,'stop',lambda:None)
    assert client.post('/api/ai/cancel/cancel-me').json()['cancelled']
    assert client.get('/api/ai/practice/cancel-me').json()['status']=='cancelled'
    assert client.post('/api/ai/practice',json={**body,'prompt':'arbitrary'}).status_code==422

def test_ai_invalid_result_is_not_published(client,monkeypatch):
    async def broken(*args):return {'passage':[{'hanzi':'错','pinyin':'错','vi':''}]}
    monkeypatch.setattr(practice,'completion',broken)
    client.post('/api/ai/practice',json={'unit_id':'tw.food','skill':'reading','request_id':'broken'})
    for _ in range(30):
        job=client.get('/api/ai/practice/broken').json()
        if job['status']!='running':break
    assert job['status']=='error' and 'packet' not in job

def v6_projection():
    baseline=json.loads((Path(__file__).parent/'fixtures/v6-units.json').read_text())
    content=copy.deepcopy(bundled()['content']);content['version']=6
    for unit in content['units']:
        old=baseline[unit['id']];unit.pop('practice_sets');unit['dialogue']=unit['dialogue'][:old['dialogue_count']]
        for lesson in unit['lessons']:
            assert lesson.pop('legacy_exercise_ids')==old['lesson_ids'][lesson['id']]
            lesson['exercises']=[e for e in lesson['exercises'] if e['id'] in old['lesson_ids'][lesson['id']]]
        assert hashlib.sha256(canonical(unit)).hexdigest()==old['sha256']
    return content

def test_all_v6_content_and_upgrade_preserve_inflight_retry_and_completed(client):
    legacy=v6_projection();package=envelope(legacy)
    backup=client.get('/api/backup').json();backup['packages']=[{'id':'foundation-tw','version':6,'payload':json.dumps(package)}]
    assert client.post('/api/restore',json=backup).status_code==200
    lessons=legacy['units'][0]['lessons']
    for lesson,phase in zip(lessons,['exercise','summary','exercise','summary']):
        s={'index':len(lesson['exercises']),'phase':phase,'answers':[],'run':lesson['id'],'retry':[lesson['exercises'][0]['id']] if phase=='exercise' else [],'draft':'舊的回答','assisted':True}
        assert client.post('/api/objects',json=dict(collection='sessions',id=lesson['id'],expected_version=0,data=s)).status_code==200
    before=client.get('/api/state').json()
    assert client.post('/api/packages',json=bundled()).status_code==200
    assert client.get('/api/state').json()==before
    assert client.get('/api/content').json()['version']==7

def test_duplicate_practice_submission_is_idempotent(client):
    packet=bundled()['content']['units'][0]['practice_sets'][0]
    s={'scope':'skills','unit_id':'tw.greetings','skill':'reading','packet':packet,'run':'once','phase':'exercise','index':0,'answers':[]}
    mutation=dict(collection='sessions',id='skills:once',expected_version=0,data=s)
    assert client.post('/api/objects',json=mutation).status_code==200
    q=packet['items'][0]
    event=dict(id='first',action_key='skills:once:'+q['id'],kind='practice',skill='reading',item_id=q['id'],source='authored',correct=True,answer=q['answers'][0],timestamp='2026-09-29T00:00:00Z')
    mutation.update(expected_version=1,data={**s,'index':1,'answers':[{'id':q['id'],'answer':q['answers'][0],'correct':True,'assisted':False}]})
    assert client.post('/api/events',json={'event':event,'mutation':mutation}).status_code==200
    event['id']='second'
    assert client.post('/api/events',json={'event':event,'mutation':mutation}).status_code==200
    state=client.get('/api/state').json()
    assert len(state['events'])==1 and state['objects']['sessions']['skills:once']['version']==2
