import uuid
from fastapi.testclient import TestClient
from backend import db
from backend.app import app,ChatRequest

HEADERS={'X-Mandarin-Client':'local-ui'}
def test_written_batch_transaction_and_idempotent_submission(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path)
    run=str(uuid.uuid4());sid='written:'+run;rid='written-history:tw.greetings:sentences'
    packet={'id':'test-batch','mode':'sentences','items':[{'id':f'q{i}'} for i in range(5)]}
    data={'scope':'written-batch','run':run,'unit_id':'tw.greetings','mode':'sentences','phase':'exercise','index':0,'answers':[],'packet':packet}
    session={'collection':'sessions','id':sid,'expected_version':0,'data':data}
    report={'collection':'reports','id':rid,'expected_version':0,'data':{'kind':'written-history','runs':[run]}}
    with TestClient(app) as client:
        assert client.post('/api/practice/sessions',json={'mutations':[session,report]},headers=HEADERS).status_code==200
        other=str(uuid.uuid4());duplicate={**session,'id':'written:'+other,'data':{**data,'run':other}}
        assert client.post('/api/practice/sessions',json={'mutations':[duplicate,report]},headers=HEADERS).status_code==409
        assert 'written:'+other not in client.get('/api/state').json()['objects']['sessions']
        event={'id':str(uuid.uuid4()),'action_key':'written-submit:'+run,'kind':'writing','skill':'writing','item_id':sid,'correct':None,'assisted':False,'answer':'{}','duration_ms':0,'algorithm':'','timestamp':'2026-10-17T00:00:00Z','category':''}
        mutation={**session,'expected_version':1,'data':{**data,'phase':'summary','index':5}}
        for _ in range(2):assert client.post('/api/events',json={'event':event,'mutation':mutation},headers=HEADERS).status_code==200
        state=client.get('/api/state').json();assert state['objects']['sessions'][sid]['version']==2
        assert len([e for e in state['events'] if e['action_key']==event['action_key']])==1
    assert ChatRequest(messages=[{'role':'user','content':'{}'}],mode='sentence-review',request_id='test').mode=='sentence-review'
