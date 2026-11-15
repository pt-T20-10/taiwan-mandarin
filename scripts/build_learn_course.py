"""Build the independent PC course; fail rather than pad sentence exercises."""
import hashlib,json,re,sys
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from content.learn_course_authoring import OUTLINE,WORD_GROUPS,FIRST_WORDS,EXTRA_WORDS,FIRST_EXAMPLES,FIRST_FRAMES,FIRST_SUBJECTS,FIRST_ROLES
from content.learn_course_frames import FAMILIES,SLOTS,RULES,FEATURES
from content.learn_course_editorial import MEANINGS,exclusion,revise,COURTESY,ADDITIONS

def norm(s):return re.sub(r'[\W_]+','',s)
def triple(t):return {k:t[k] for k in ('hanzi','pinyin','vi')}
def build():
 pack=json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
 lookup=json.loads((ROOT/'src/core/study-lookup.json').read_text(encoding='utf-8'))
 words={w['hanzi']:triple(w) for w in lookup['words']}
 for w in json.loads((ROOT/'content/sentence-review-words.json').read_text(encoding='utf-8')):words[w['hanzi']]=triple(w)
 for line in (EXTRA_WORDS.strip()+'\n'+(ROOT/'content/learn-course-words.tsv').read_text(encoding='utf-8')).splitlines():
  h,p,v=line.split('|');words[h]={'hanzi':h,'pinyin':p,'vi':v}
 keys=sorted(words,key=len,reverse=True)
 def tokenize(text):
  result=[];i=0
  while i<len(text):
   if not re.match(r'[\u3400-\u9fff〇]',text[i]):i+=1;continue
   word=next((w for w in keys if text.startswith(w,i)),None)
   if not word:return None
   result.append(word);i+=len(word)
  return result
 raw=json.loads((ROOT/'content/sentence-review.json').read_text(encoding='utf-8'))['entries']
 extra=json.loads((ROOT/'src/core/expansion-application.json').read_text(encoding='utf-8'))
 features=json.loads((ROOT/'content/sentence-review-features.json').read_text(encoding='utf-8'))
 units=[];known=set();known_grammar=set();diagnostics=[];rejected=[]
 for unit in pack['units']:
  short=unit['id'].split('.')[-1];titles,size=OUTLINE[short];pool={}
  def add(t,example=False,lesson_index=None):
   if not all(t.get(k) for k in ('hanzi','pinyin','vi')):return
   reason=exclusion(t['hanzi'])
   if reason:rejected.append({'topic':short,'hanzi':t['hanzi'],'reason':reason});return
   t=revise(t)
   tokens=tokenize(t['hanzi'])
   if not tokens or len(t['hanzi'])>45:return
   e={**triple(t),'words':list(dict.fromkeys(tokens)),'grammar':[n for n,m in features if all(x in t['hanzi'] for x in m)],'example_only':example,'lesson_index':lesson_index}
   e['id']='learn-text:'+hashlib.sha256(json.dumps(e,ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:20]
   pool[norm(e['hanzi'])]=e
  for e in raw:
   if e['unit_id']==unit['id']:add(e)
  for packet in extra.values():
   if f':{short}:' in packet['questions'][0]['id']:
    for q in packet['questions']:add(q['solution'])
  for p in unit.get('practice_sets',[]):
   for t in p['passage']:add(t)
  for old in unit['lessons']:
   for q in old['exercises']:
    if q.get('stimulus'):add(q['stimulus'])
  for g in unit['grammar']:
   for t in g.get('examples',[]):add(t)
  for li,(family,slot_text) in enumerate(SLOTS[short]):
   if family=='courtesy':
    for ci,line in enumerate(COURTESY.splitlines()):add(dict(zip(('hanzi','pinyin','vi'),line.split('|'))),ci<2,li)
    continue
   for slot in slot_text.split():
    if slot not in words:raise ValueError('Missing word '+slot)
    w=words[slot];meaning=MEANINGS.get(slot,w['vi'].split(';')[0].split(' (')[0])
    if family=='information' and slot=='電話':meaning='số điện thoại'
    hanzi_slot=slot;pinyin_slot=w['pinyin']
    if family=='information' and slot in {'合約','報告','電子郵件','建議','訊息','記錄','資料','作業','議題','決定','計畫','任務','問題','意見','選擇'}:
     hanzi_slot+='的內容';pinyin_slot+=' de nèiróng';meaning='nội dung '+meaning
    if family=='information' and slot in {'會議','考試','學期'}:
     hanzi_slot+='的時間';pinyin_slot+=' de shíjiān';meaning='thời gian '+meaning
    for fi,(h,p,v) in enumerate(FAMILIES[family]):
     add({'hanzi':h.format(x=hanzi_slot),'pinyin':p.format(p=pinyin_slot),'vi':v.format(v=meaning,v_cap=meaning[0].upper()+meaning[1:])},fi<2,li)
  if short=='greetings':
   for s,sp,sv in FIRST_SUBJECTS:
    for r,rp,rv in FIRST_ROLES:
     for h,p,v in FIRST_FRAMES:add({'hanzi':h.format(s=s,r=r),'pinyin':p.format(sp=sp,rp=rp),'vi':v.format(sv=sv,svl=sv.lower(),rv=rv)})
   for h,p,v in FIRST_EXAMPLES:add({'hanzi':h,'pinyin':p,'vi':v})
  for line in ADDITIONS.get(short,'').splitlines():add(dict(zip(('hanzi','pinyin','vi'),line.split('|'))))
  frequency=Counter(w for e in pool.values() for w in e['words'])
  base=[w['hanzi'] for w in unit['words']];used=set();lessons=[]
  # Teaching words are selected from actual topic sentences, never unrelated
  # dictionary entries. Base topic words retain priority in five explicit groups.
  for index,title in enumerate(titles.split('|')):
   focus=FIRST_WORDS[index*size:(index+1)*size] if short=='greetings' else WORD_GROUPS[short][index].split()
   for w in focus:
    if w not in words:raise ValueError('Missing word '+w)
   if len(focus)!=size:raise ValueError(f'Vocabulary deficit {short}/{index+1}')
   used.update(focus);allowed=known|set(focus);limit=2 if size==7 else 3
   family=SLOTS[short][index][0];taught_grammar=known_grammar|set(FEATURES[family])
   eligible=[e for e in pool.values() if set(e['words'])&set(focus) and len(set(e['words'])-allowed)<=limit and len(set(e['words'])&allowed)*3>=len(set(e['words']))*2 and set(e['grammar'])<=taught_grammar]
   eligible.sort(key=lambda e:(len(set(e['words'])-allowed),len(e['hanzi']),e['id']))
   examples=[e for e in eligible if e['example_only'] and e['lesson_index']==index][:4]
   examples+=(e for e in eligible if e not in examples and len(examples)<4)
   examples=examples[:4]
   if short=='greetings' and index==0:examples=[pool[norm(h)] for h,p,v in FIRST_EXAMPLES]
   practice=[e for e in eligible if e not in examples and not e['example_only']]
   question_count={7:15,10:20,15:25}[size]
   required=question_count//5*4*2
   diagnostics.append({'lesson':f'{short}/{index+1}','words':focus,'sentences':len(practice),'required':required})
   rules=RULES[family]
   if short=='greetings' and index==0:rules=[('我／你 + 是 + vai trò','是 nối người với vai trò, ví dụ học sinh hoặc giáo viên. Không thêm 很 trước 是.'),('Câu + 嗎','Thêm 嗎 cuối câu để hỏi có phải hay không. 也 đứng trước 是 để nói cũng là.')]
   if short=='greetings' and index==1:rules=[('叫 + tên','叫 giới thiệu tên; 你叫什麼名字？ dùng để hỏi tên.'),('Người + 的 + danh từ','的 nối người với tên/đồ vật. 他 và 她 đều đọc tā nhưng khác chữ.')]
   lessons.append({'id':f'learn-course-v1:{short}:{index+1}','title':title,'unit_id':unit['id'],'index':index,'level':size,'question_count':question_count,'extra_limit':limit,
    'words':[words[w] for w in focus],'examples':examples,'sentences':practice,'introduced_grammar':FEATURES[family],'grammar':sorted(set(FEATURES[family])|{g for e in examples+practice for g in e['grammar']}),
    'patterns':[{'title':title,'explanation':explanation} for title,explanation in rules]})
   known.update(focus)
   known_grammar.update(FEATURES[family])
  units.append({'id':unit['id'],'title':unit['title'],'description':unit['description'],'lessons':lessons})
 introductions={norm(e['hanzi']) for u in units for l in u['lessons'] for e in l['examples']}
 for u in units:
  for l in u['lessons']:
   l['sentences']=[e for e in l['sentences'] if norm(e['hanzi']) not in introductions]
   next(d for d in diagnostics if d['lesson']==u['id'].split('.')[1]+'/'+str(l['index']+1))['sentences']=len(l['sentences'])
 output={'version':2,'id':'learn-course-v1','verification':'draft','units':units,'dictionary':list(words.values())}
 deficits=[d for d in diagnostics if d['sentences']<d['required']]
 audit=ROOT/'data/learn-course-content-audit.json';audit.parent.mkdir(exist_ok=True);audit.write_text(json.dumps(diagnostics,ensure_ascii=False,indent=2),encoding='utf-8')
 (ROOT/'data/learn-course-editorial-exclusions.json').write_text(json.dumps(rejected,ensure_ascii=False,indent=2),encoding='utf-8')
 if deficits:
  print(json.dumps(deficits,ensure_ascii=False,indent=1));raise SystemExit('Course not published: insufficient sentence pools')
 target=ROOT/'content/learn-course.json';target.write_text(json.dumps(output,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
 print(f'{len(units)} topics / {sum(len(u["lessons"]) for u in units)} lessons; content checks passed')
if __name__=='__main__':build()
