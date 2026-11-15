"""PC-only course, current-epoch knowledge, and explicit one-shot reset."""
import hashlib,json,re,uuid
from functools import lru_cache
from pathlib import Path
from . import db
from .content import ROOT

RESET_KEY='learn-course-v1-reset'
@lru_cache(maxsize=1)
def catalog():return json.loads((ROOT/'content/learn-course.json').read_text(encoding='utf-8'))
def epoch(conn):
 row=conn.execute('SELECT value FROM meta WHERE key=?',(RESET_KEY,)).fetchone()
 return json.loads(row[0])['epoch'] if row else 'preview'
def knowledge(state,current_epoch):
 words=set();grammar=set()
 lessons={l['id']:l for u in catalog()['units'] for l in u['lessons']}
 for row in state['objects']['sessions'].values():
  d=row['data']
  if row['deleted'] or d.get('epoch')!=current_epoch or d.get('phase')!='summary':continue
  if d.get('scope')=='lesson-expansion':
   words.update(w['hanzi'] for w in d.get('packet',{}).get('vocabulary',[]) if isinstance(w,dict) and isinstance(w.get('hanzi'),str));continue
  if d.get('scope')!='learn-course':continue
  l=lessons.get(d.get('lesson_id'))
  if l:words.update(w['hanzi'] for w in l['words']);grammar.update(l['grammar'])
 for row in state['objects']['reports'].values():
  d=row['data']
  if not row['deleted'] and d.get('kind')=='learned-word' and d.get('learned') is True and d.get('epoch')==current_epoch:words.add(d.get('word',{}).get('hanzi',''))
 return {'words':sorted(words-{''}),'grammar':sorted(grammar)}
def payload():
 with db.connect() as conn:current=epoch(conn)
 return {**catalog(),'epoch':current,'knowledge':knowledge(db.get_state(),current)}

def lesson_map():
 result={l['id']:l for u in catalog()['units'] for l in u['lessons']}
 for u in catalog()['units']:
  result['learn-course-v1:'+u['id'].split('.')[1]+':review']={'question_count':20,'words':list({w['hanzi']:w for l in u['lessons'] for w in l['words']}.values()),'sentences':list({e['id']:e for l in u['lessons'] for e in l['sentences']}.values())}
 return result

def is_learn_object(collection,id,data):
 if collection=='reports':return data.get('kind')=='learned-word' or id.startswith(('sentence-review:','lesson-archive:','learn-course:'))
 if collection!='sessions':return False
 return (data.get('scope') in ('lesson-expansion','topic-language','topic-review','learn-course') or
         bool(re.match(r'^tw\.[^.]+\.lesson\.\d+',id)) or id.startswith(('expansion:','topic-language:','topic-review:','learn-course-v1:')))

def guard_write(conn,collection,id,data):
 current=epoch(conn)
 if data.get('scope')=='learn-course':
  if data.get('epoch')!=current:raise db.Conflict('Lượt thuộc mốc học cũ. Tải lại trang Học.')
  if data.get('content_version')!=catalog()['version']:raise db.Conflict('Nội dung câu đã được sửa. Tải lại trang và bắt đầu lượt mới; dữ liệu cũ vẫn được giữ.')
  validate_run(data)
 elif current!='preview' and is_learn_object(collection,id,data):
  if data.get('epoch')!=current:raise db.Conflict('Dữ liệu Học đã reset. Tải lại trang trước khi lưu.')

def validate_run(d):
 l=lesson_map().get(d.get('lesson_id'))
 if not l or d.get('phase') not in ('exercise','summary'):raise ValueError('Bài học không hợp lệ')
 tasks=d.get('tasks',[]);answers=d.get('answers',[]);index=d.get('index')
 if len(tasks)!=l['question_count'] or type(index)is not int or not 0<=index<=len(tasks):raise ValueError('Bộ câu hỏi/vị trí không hợp lệ')
 if len({q.get('id') for q in tasks})!=len(tasks):raise ValueError('Trùng câu hỏi')
 if len(answers)!=index+int(bool(d.get('submitted'))):raise ValueError('Lịch sử không khớp vị trí')
 if d['phase']=='summary' and (index!=len(tasks) or d.get('submitted')):raise ValueError('Chưa đi hết bài')
 allowed={e['id']:e for e in l['sentences']};vocab={w['hanzi']:w for w in l['words']}
 for q in tasks:
  if q.get('mode') not in ('word','gap','listen','to_zh','to_vi'):raise ValueError('Loại câu không hợp lệ')
  e=q.get('entry',{})
  source=vocab.get(e.get('hanzi')) if q['mode']=='word' else allowed.get(e.get('id'))
  if not source or any(e.get(k)!=source[k] for k in ('hanzi','pinyin','vi')):raise ValueError('Câu không thuộc ngân hàng bài')
  if len(q.get('choices',[]))>4:raise ValueError('Quá nhiều lựa chọn')
 for i,a in enumerate(answers):
  if a.get('id')!=tasks[i]['id'] or a.get('result') not in ('correct','incorrect','compare','skipped'):raise ValueError('Kết quả không hợp lệ')

def reset(apply=False):
 with db.connect() as conn:
  conn.execute('BEGIN IMMEDIATE')
  done=conn.execute('SELECT value FROM meta WHERE key=?',(RESET_KEY,)).fetchone()
  if done:return {**json.loads(done[0]),'already_applied':True}
  rows=[dict(r) for r in conn.execute('SELECT * FROM objects')]
  selected=[r for r in rows if is_learn_object(r['collection'],r['id'],json.loads(r['payload']))]
  preserved=[r for r in rows if r not in selected]
  digest=lambda data:hashlib.sha256(json.dumps(data,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
  report={'epoch':str(uuid.uuid4()),'objects_reset':len(selected),'preserved_hash':digest(preserved),'cards_hash':digest([r for r in rows if r['collection']=='cards']),'created_at':db.now()}
  if not apply:return {**report,'dry_run':True}
  folder=db.DATA/'backups';folder.mkdir(parents=True,exist_ok=True)
  backup=folder/('before-learn-course-'+report['epoch']+'.json')
  saved={**db.snapshot(conn),'metadata':{r['key']:r['value'] for r in conn.execute('SELECT key,value FROM meta')}}
  with backup.open('x',encoding='utf-8') as f:json.dump(saved,f,ensure_ascii=False,indent=2)
  report['backup']=str(backup.resolve())
  for r in selected:conn.execute('UPDATE objects SET deleted=1,version=version+1 WHERE collection=? AND id=?',(r['collection'],r['id']))
  # Historical events remain in the backup/database but cannot grant new-epoch
  # knowledge. New PC views only count their own epoch and course namespace.
  after=[dict(r) for r in conn.execute('SELECT * FROM objects') if not is_learn_object(r['collection'],r['id'],json.loads(r['payload']))]
  if digest(after)!=report['preserved_hash']:raise RuntimeError('Dữ liệu ngoài Học thay đổi; rollback')
  conn.execute('INSERT INTO meta(key,value) VALUES(?,?)',(RESET_KEY,json.dumps(report,ensure_ascii=False)))
  (folder/('learn-course-reset-'+report['epoch']+'.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
  return report

def routes(app):
 @app.get('/api/learn/course')
 def get_course():return payload()
 @app.get('/api/learn/epoch')
 def get_epoch():
  with db.connect() as conn:return {'epoch':epoch(conn)}
