import copy,json,uuid
from fastapi.testclient import TestClient
from backend import db
from backend.app import app
from backend.content import bundled,envelope,validate_package

HEADERS={'X-Mandarin-Client':'local-ui'}

def test_v8_archived_ids_and_atomic_repair(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path)
    package=bundled();validate_package(package)
    content=package['content'];assert content['version']==8
    retired={e['id']:e for e in content['retired_exercises']};assert len(retired)>=36
    old=copy.deepcopy(content);old['version']=7;old.pop('retired_exercises')
    for u in old['units']:
        for container in [*u['grammar'],*u['lessons']]:
            container['exercises']=[retired.get(e['id'].removesuffix('.v8'),e) for e in container['exercises']]
    validate_package(envelope(old))
    with TestClient(app) as client:
        with db.connect() as conn:conn.execute('UPDATE packages SET version=7,payload=?',(json.dumps(envelope(old)),))
        before=client.get('/api/state').json()
        assert client.post('/api/packages',json=package,headers=HEADERS).status_code==200
        assert client.get('/api/state').json()==before
        event={'id':str(uuid.uuid4()),'action_key':'repair-test','kind':'mistake-repair','skill':'sound','item_id':'old-test','correct':True,'assisted':False,'answer':'líng','duration_ms':0,'algorithm':'','timestamp':'2026-10-15T00:00:00Z','category':''}
        mutation={'collection':'reports','id':'mistake:old-test','expected_version':0,'data':{'kind':'mistake-resolution','last_error_id':'old-event'}}
        # Same endpoint/payload as the storage adapter.
        payload={'event':event,'mutation':mutation}
        assert client.post('/api/events',json=payload,headers=HEADERS).status_code==200
        assert client.post('/api/events',json=payload,headers=HEADERS).status_code==200
        after=client.get('/api/state').json()
        assert len(after['events'])==len(before['events'])+1
        assert after['objects']['reports']['mistake:old-test']['version']==1
