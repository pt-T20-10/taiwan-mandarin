"""Compile separate application tasks; never derive tasks from lesson examples."""
import hashlib
import json
import re
import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from content.expansion_application_authoring import FRAMES,SLOTS

FOCUS={
 'greetings:introduce':['叫','也是'],'greetings:polite':['嗎','不是'],
 'food:order':['外帶','內用'],'food:preferences':['不要加糖','少冰'],
 'shopping:prices':['一共','現金'],'shopping:compare':['一點','的'],
 'transport:journey':['多久','先'],'family:people':['跟','也'],
 'family:age':['歲','做什麼工作'],'home:location':['在','有'],
 'home:describe':['很','幫我'],'schedule:availability':['有空','改成'],
 'information:confirm':['對嗎','再說一次'],
 'classroom:understand':['不懂','再解釋一次'],'classroom:instructions':['先','交'],
 'daily:routine':['有時候','然後'],'daily:now-already':['正在','已經'],
 'campus:meeting':['見面','收到'],'health:clinic':['掛號','吃'],
 'renting:costs':['不包括','管理費'],'renting:repairs':['壞了','修理'],
 'services:send':['運費','領'],'services:forms':['簽名','影印'],
 'worklife:reschedule':['請假','改到'],'worklife:progress':['還沒完成','已經'],
 'travel:experience-weather':['沒去過','如果'],
 'social:invite':['要不要','沒辦法'],'social:choices':['還是','比較'],
}

def build():
    lessons={};normalize=lambda s:re.sub(r'[^\u3400-\u9fff〇]','',s)
    examples=set()
    for name in ('Numbers','Everyday','Study','Life'):
        source=(ROOT/f'src/core/lessonExpansion{name}.ts').read_text(encoding='utf-8')
        examples.update(normalize(t) for t in re.findall(r"t\('([^']*)'",source))
    for row in FRAMES.splitlines():
        unit,key,slot,h,p,v=row.split('|');identity=f'expansion:v1:{unit}:{key}'
        record=lessons.setdefault(identity,{'questions':[],'vocabulary':[]})
        count=0
        for word in SLOTS[slot]:
            if count==5:break
            text={k:frame.replace('{0}',word[k]) for k,frame in zip(('hanzi','pinyin','vi'),(h,p,v))}
            if normalize(text['hanzi']) in examples:continue
            if any(q['solution']['hanzi']==text['hanzi'] for q in record['questions']):continue
            index=len(record['questions']);kind='input' if index%3 else 'choice'
            target=next((t for t in FOCUS.get(unit+':'+key,[]) if t in h),word['hanzi']) if count in (0,4) else word['hanzi']
            answers=[target]
            if target==word['hanzi'] and unit=='numbers' and key=='hundreds':
                answers=list(dict.fromkeys([word['hanzi'],word['hanzi'].replace('兩百','二百')]))
            prompt='Điền phần còn thiếu để diễn đạt: '+text['vi']+' — '+text['hanzi'].replace(target,'___',1)
            if target!=word['hanzi']:kind='input'
            # Only alternatives from the SAME semantic slot can fill this gap.
            choices=[w['hanzi'] for w in SLOTS[slot]][:5] if target==word['hanzi'] else []
            if target=='不是':choices=['不是','是','也是','都是']
            if kind=='choice' and answers[0] not in choices:choices[-1]=answers[0]
            if kind=='choice':answers=answers[:1]
            if count==2:
                kind='choice' if index<5 else 'listening'
                prompt=('Chọn nghĩa đúng của câu mới: '+text['hanzi']) if kind=='choice' else 'Nghe câu mới và chọn thông tin đúng.'
                choices=[v.replace('{0}',w['vi']) for w in SLOTS[slot]][:5]
                if text['vi'] not in choices:choices[-1]=text['vi']
                answers=[text['vi']]
            q=dict(kind=kind,prompt=prompt,choices=choices,answers=answers,solution=text,explanation='Đối chiếu vị trí và ý nghĩa trong câu hoàn chỉnh. Câu được biên soạn riêng để vận dụng quy tắc.')
            q['id']=identity+':qapp2:'+hashlib.sha256(json.dumps(q,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:16]
            record['questions'].append(q)
            if unit!='numbers' and word not in record['vocabulary']:record['vocabulary'].append(word)
            count+=1
        if count!=5:raise ValueError(f'Thiếu câu khác mẫu: {identity} / {slot} ({count})')
    assert len(lessons)==40
    assert all(len(r['questions'])==10 for r in lessons.values())
    for record in lessons.values():
        first,second=record['questions'][:5],record['questions'][5:]
        record['questions']=[q for pair in zip(first,second) for q in pair]
    (ROOT/'src/core/expansion-application.json').write_text(json.dumps(lessons,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
    print('40 lessons / 400 application tasks, excluded all old examples and solutions')
if __name__=='__main__':build()
