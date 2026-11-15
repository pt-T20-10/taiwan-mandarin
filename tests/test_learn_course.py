import copy,json
import pytest
from backend import db,learn_course as course

def test_old_content_cannot_resume_but_is_not_deleted(tmp_path,monkeypatch):
 monkeypatch.setattr(db,'DATA',tmp_path);db.init()
 old={'scope':'learn-course','epoch':'preview','content_version':1,'phase':'exercise','draft':'keep my draft'}
 with db.connect() as conn:
  conn.execute('INSERT INTO objects VALUES(?,?,?,?,?)',('sessions','old-content',1,json.dumps(old),0))
 before=copy.deepcopy(db.get_state())
 with db.connect() as conn:
  with pytest.raises(db.Conflict,match='Nội dung câu đã được sửa'):course.guard_write(conn,'sessions','old-content',old)
 assert db.get_state()==before

def test_reset_is_scoped_atomic_idempotent_and_preserves_cards(tmp_path,monkeypatch):
 monkeypatch.setattr(db,'DATA',tmp_path);db.init()
 with db.connect() as conn:
  for collection,id,data in [
   ('cards','saved-card',{'direction':'recognize','tags':[],'word':{'hanzi':'你好','pinyin':'nǐ hǎo','vi':'xin chào'},'schedule':{'due':'2030-01-01',**{k:0 for k in ('stability','difficulty','reps','lapses','state','scheduled_days','elapsed_days','learning_steps')}},'suspended':False}),
   ('sessions','tw.greetings.lesson.1',{'phase':'summary','index':0,'answers':[]}),
   ('sessions','skills-test',{'scope':'skills','phase':'summary','index':0,'answers':[]}),
   ('sessions','grammar-test',{'scope':'grammar','phase':'summary','index':0,'answers':[]}),
   ('reports','learned-word:test',{'kind':'learned-word','learned':True,'word':{'hanzi':'朋友'}}),
   ('reports','sentence-review:v1:tw.greetings',{'run':{'draft':'old'}}),
   ('settings','speech',{'voice':'auto'}),('notes','note',{'text':'keep'})]:
   # Seed a legacy database snapshot, including sessions from older schemas.
   conn.execute('INSERT INTO objects VALUES(?,?,?,?,?)',(collection,id,1,json.dumps(data,ensure_ascii=False),0))
 before=copy.deepcopy(db.get_state());preview=course.reset();assert preview['dry_run']
 assert db.get_state()==before
 report=course.reset(True);assert report['objects_reset']==3
 backup=json.loads(open(report['backup'],encoding='utf8').read());assert 'metadata' in backup
 after=db.get_state();assert after['objects']['cards']==before['objects']['cards']
 for collection,id in [('sessions','skills-test'),('sessions','grammar-test'),('settings','speech'),('notes','note')]:assert after['objects'][collection][id]==before['objects'][collection][id]
 assert course.reset(True)['already_applied'];assert db.get_state()==after
 assert course.knowledge(after,report['epoch'])['words']==[]
 with db.connect() as conn:
  with pytest.raises(db.Conflict):db.put_object(conn,'sessions','tw.greetings.lesson.1',2,{'phase':'summary','index':0,'answers':[]})
  with pytest.raises(db.Conflict):db.put_object(conn,'reports','learned-word:new',0,{'kind':'learned-word','learned':True})
  db.put_object(conn,'reports','learned-word:new',0,{'kind':'learned-word','learned':True,'epoch':report['epoch'],'word':{'hanzi':'你好'}})
 assert course.knowledge(db.get_state(),report['epoch'])['words']==['你好']

def test_completed_course_only_grants_current_epoch_words_not_flashcards(tmp_path,monkeypatch):
 monkeypatch.setattr(db,'DATA',tmp_path);db.init();epoch=course.reset(True)['epoch']
 lesson=course.catalog()['units'][0]['lessons'][0]
 state=db.get_state()
 def row(d):return {'deleted':False,'data':d,'version':1}
 state['objects']['sessions']['old']=row({'scope':'learn-course','epoch':'old','phase':'summary','lesson_id':lesson['id']})
 assert course.knowledge(state,epoch)['words']==[]
 state['objects']['sessions']['new']=row({'scope':'learn-course','epoch':epoch,'phase':'summary','lesson_id':lesson['id'],'answers':[{'result':'skipped'}]})
 assert set(course.knowledge(state,epoch)['words'])=={w['hanzi'] for w in lesson['words']}
 state['objects']['sessions']['new']['data']['phase']='exercise'
 assert course.knowledge(state,epoch)['words']==[]
