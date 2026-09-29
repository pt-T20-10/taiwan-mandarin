import copy,hashlib,json
from pathlib import Path
from backend import db
from backend.content import bundled,envelope,canonical


def test_v6_counts_identity_and_unique_new_vocabulary():
    c=bundled()['content'];assert c['version']==7 and len(c['units'])==18
    expected=json.loads((Path(__file__).parent/'fixtures/v5-identity.json').read_text())
    for unit in c['units'][:12]:
        old=copy.deepcopy(unit);old.pop('practice_sets');old['dialogue']=old['dialogue'][:3]
        for lesson in old['lessons']:
            ids=lesson.pop('legacy_exercise_ids');lesson['exercises']=[e for e in lesson['exercises'] if e['id'] in ids]
        assert hashlib.sha256(canonical(old)).hexdigest()==expected[unit['id']]
    assert sum(len(u['lessons']) for u in c['units'])==72
    words=[w for u in c['units'] for w in u['words']];assert len(words)==360
    old={w['hanzi'] for u in c['units'][:12] for w in u['words']}
    new=[w['hanzi'] for u in c['units'][12:] for w in u['words']]
    assert len(new)==len(set(new))==120 and not old.intersection(new)
    assert sum(len(l['exercises']) for u in c['units'] for l in u['lessons'])==720
    assert sum(len(g['exercises']) for u in c['units'] for g in u['grammar'])==144
    for u in c['units'][12:]:
        assert len(u['dialogue'])>=6 and u['writing_prompt']
        assert len(u['lessons'])==4 and len(u['words'])==20 and len(u['grammar'])==2
        assert sum(len(l['exercises']) for l in u['lessons'])==40


def test_all_294_old_character_assets_are_byte_preserved():
    root=Path(__file__).resolve().parents[1]
    hashes=json.loads((Path(__file__).parent/'fixtures/v5-character-hashes.json').read_text(encoding='utf-8'))
    assert len(hashes)==294
    for char,digest in hashes.items():
        assert hashlib.sha256((root/f'public/learning/characters/{ord(char)}.json').read_bytes()).hexdigest()==digest,char


def test_v5_to_v6_upgrade_preserves_sessions_cards_events_and_settings(tmp_path,monkeypatch):
    monkeypatch.setattr(db,'DATA',tmp_path);db.init()
    legacy=copy.deepcopy(bundled()['content']);legacy['units']=legacy['units'][:12];legacy['version']=5
    with db.connect() as connection:
        connection.execute('UPDATE packages SET version=5,payload=?',(json.dumps(envelope(legacy),ensure_ascii=False),))
        db.put_object(connection,'sessions','tw.greetings.lesson.1',0,{'phase':'exercise','index':2,'answers':[],'draft':'保留'})
        db.put_object(connection,'settings','speech',0,{'voice':'auto','pace':'slow'})
        db.put_object(connection,'cards','old-card',0,{'word':legacy['units'][0]['words'][0],'direction':'recognize','tags':['old'],'schedule':{'due':'2026-10-01T00:00:00Z','stability':4,'difficulty':5,'reps':2,'lapses':0,'state':2,'scheduled_days':4,'elapsed_days':1,'learning_steps':0}})
    db.save_event({'id':'old-event','action_key':'old-answer','kind':'answer','skill':'vocabulary','item_id':'old','correct':True,'assisted':False,'answer':'你好','algorithm':'closed-v1'})
    before=db.get_state()
    from backend.app import install_package
    install_package(bundled())
    assert db.get_state()==before
    with db.connect() as connection:assert connection.execute('SELECT version FROM packages').fetchone()[0]==7
