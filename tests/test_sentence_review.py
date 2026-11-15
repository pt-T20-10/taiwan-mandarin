import copy
import uuid
from collections import Counter
from fastapi.testclient import TestClient
from backend import db,sentence_review as sr,mobile_sync
from backend.mobile_sync import lan_app

def test_catalog_delta_knowledge_and_retries(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path);db.init()
    monkeypatch.setattr(mobile_sync.manager,'auth',lambda request:'TEST-phone')
    original=copy.deepcopy(db.get_state()['objects'])
    with TestClient(lan_app) as client:
        assert client.post('/v2/sentences',json={}).json()['entries']==[]
        entry=sr.catalog()['entries'][0]
        monkeypatch.setattr(sr,'knowledge',lambda state:(set(entry['required_words']),set(entry['required_grammar'])))
        fresh=client.post('/v2/sentences',json={}).json()
        assert entry['id'] in fresh['allowed_ids'] and 'lessonIds' not in fresh['knowledge']
        delta=client.post('/v2/sentences',json={'known_ids':fresh['allowed_ids']}).json()
        assert delta['entries']==[] and delta['removed']==[]
        monkeypatch.setattr(sr,'knowledge',lambda state:(set(),set()))
        removed=client.post('/v2/sentences',json={'known_ids':fresh['allowed_ids']}).json()
        assert set(removed['removed'])==set(fresh['allowed_ids'])
        event=dict(id=str(uuid.uuid4()),run_id=str(uuid.uuid4()),task_id=entry['id']+':gap',sentence_id=entry['id'],unit_id=entry['unit_id'],group=entry['group'],answer=entry['gap'],result='correct',mode='gap',assisted=False,revisit=False,timestamp='2026-11-09T01:00:00Z',duration_ms=0)
        assert client.post('/v2/sentence-events',json={'events':[event]}).json()['accepted']==[event['id']]
        assert client.post('/v2/sentence-events',json={'events':[event]}).status_code==200
        assert client.post('/v2/sentence-events',json={'events':[{**event,'duration_ms':1}]}).status_code==409
        assert client.post('/v2/sentence-events',json={'events':[{**event,'answer':'conflict'}]}).status_code==422
        assert len(db.get_state()['events'])==1 and db.get_state()['events'][0]['correct'] is None
        assert db.get_state()['objects']==original
        assert client.post('/v2/sentence-events',json={'events':[{**event,'id':str(uuid.uuid4()),'sentence_id':'missing'}]}).status_code==422

def test_every_topic_and_audio_allowlist():
    entries=sr.catalog()['entries'];counts=Counter(e['unit_id'] for e in entries)
    assert len(counts)==18 and min(counts.values())>=60
    assert sr.audio_text('bad/path') is None
    assert sr.audio_text(entries[0]['audio_key'])==entries[0]['hanzi']
