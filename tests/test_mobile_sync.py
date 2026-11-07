import copy
import json
import time
import uuid
from fastapi.testclient import TestClient
from backend import db
from backend.mobile_sync import MobileSync,lan_app,cards_snapshot,digest
from backend import mobile_sync

def test_pair_review_retry_and_deletion_preserve_fsrs(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path);db.init()
    manager=MobileSync();monkeypatch.setattr(mobile_sync,'manager',manager)
    word={'hanzi':'你好','pinyin':'nǐ hǎo','vi':'xin chào'}
    schedule={'due':'2026-10-29T00:00:00Z','stability':0,'difficulty':0,'reps':0,'lapses':0,'state':0,'scheduled_days':0,'elapsed_days':0,'learning_steps':0}
    card={'word':word,'word_id':'greeting','schedule':schedule,'direction':'recognize','tags':[],'suspended':False,'deck':'TEST'}
    with db.connect() as conn:
        db.put_object(conn,'cards','a',0,card)
        db.put_object(conn,'cards','b',0,{**card,'direction':'audio','word':{**word,'pinyin':'ni3 hao3'}})
    before=copy.deepcopy(db.get_state()['objects']['cards'])
    cards=cards_snapshot();assert len(cards)==1 and set(cards[0]['card_ids'])=={'a','b'}
    manager.bootstrap={'secret':'TEST secret','expires':time.time()+300}
    with TestClient(lan_app) as client:
        assert client.get('/v1/cards').status_code==401
        pairing=client.post('/v1/pair',json={'secret':'TEST secret','name':'TEST phone'}).json()
        assert client.post('/v1/pair',json={'secret':'TEST secret'}).status_code==403
        assert client.post('/v1/pair/status',json=pairing).json()=={'approved':False}
        manager.confirm(pairing['pending_id'],True)
        paired=client.post('/v1/pair/status',json=pairing).json()
        client.headers['Authorization']='Bearer '+paired['token']
        assert len(client.get('/v1/cards').json()['cards'])==1
        seen={'id':str(uuid.uuid4()),'word_id':cards[0]['id'],'card_ids':['a','b'],'timestamp':'2026-10-29T01:00:00Z','duration_ms':2100}
        assert client.post('/v1/events',json={'events':[seen]}).json()['accepted']==[seen['id']]
        assert client.post('/v1/events',json={'events':[seen]}).status_code==200
        assert client.post('/v1/events',json={'events':[{**seen,'duration_ms':3000}]}).status_code==409
        state=db.get_state();assert len(state['events'])==1
        assert state['objects']['cards']==before
        assert state['events'][0]['correct'] is None and state['events'][0]['kind']=='practice' and 'rating' not in state['events'][0]
        assert client.get('/api/state').status_code==404
        with db.connect() as conn:
            db.put_object(conn,'cards','a',1,card,True)
            db.put_object(conn,'cards','b',1,{**card,'suspended':True})
        assert client.get('/v1/cards').json()['cards']==[]
        assert client.get('/v1/audio/'+'a'*64).status_code==404
        manager.revoke('mobile-device:'+paired['device_id'])
        assert client.get('/v1/cards').status_code==401
