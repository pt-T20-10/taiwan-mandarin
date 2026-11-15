"""Compile reviewed, bounded sentence frames into shared offline data."""
import hashlib
import json
import re
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from content.sentence_review_authoring import FRAMES, SLOTS

def key(text):
    return hashlib.sha256(('yating-v1\0' + text).encode()).hexdigest()

def build():
    lookup = json.loads((ROOT/'src/core/study-lookup.json').read_text(encoding='utf-8'))
    pack = json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
    features=json.loads((ROOT/'content/sentence-review-features.json').read_text(encoding='utf-8'))
    normalize=lambda s:re.sub(r'[^\u3400-\u9fff〇]', '',s)
    introductions=set()
    for lines in json.loads((ROOT/'src/core/lesson-dialogues.json').read_text(encoding='utf-8')).values():
        introductions.update(normalize(t['hanzi']) for t in lines)
    for unit in pack['units']:
        introductions.update(normalize(t['hanzi']) for g in unit['grammar'] for t in g.get('examples',[]))
    for name in ('Numbers','Everyday','Study','Life'):
        source=(ROOT/f'src/core/lessonExpansion{name}.ts').read_text(encoding='utf-8')
        # Exclude every authored triple, conservatively including old exercises.
        introductions.update(normalize(t) for t in re.findall(r"t\('([^']*)'",source))
    words = {w['hanzi']: {k:w[k] for k in ('hanzi','pinyin','vi')} for w in lookup['words']}
    extra = ROOT/'content/sentence-review-words.json'
    if extra.exists():
        words.update({w['hanzi']:w for w in json.loads(extra.read_text(encoding='utf-8'))})
    missing=set()
    def segment(text, bank):
        order=sorted(bank, key=len, reverse=True); spans=[]; at=0
        while at<len(text):
            if not re.match(r'[\u3400-\u9fff〇]',text[at]):at+=1;continue
            word=next((w for w in order if text.startswith(w,at)),None)
            if not word:missing.add(text[at]);print('Uncovered:',text[at],text);at+=1;continue
            spans.append((at,at+len(word),bank[word]));at+=len(word)
        return spans
    entries=[]
    for row in FRAMES.splitlines():
        unit,slot,group,h,p,v=row.split('|')
        for value in SLOTS[slot]:
            text={k:frame.replace('{0}',value[k]) for k,frame in zip(('hanzi','pinyin','vi'),(h,p,v))}
            # Pinyin already authored per phrase; capitalization only.
            text['pinyin']=text['pinyin'][0].upper()+text['pinyin'][1:]
            text['vi']=text['vi'][0].upper()+text['vi'][1:]
            if normalize(text['hanzi']) in introductions:continue
            before,after=h.split('{0}')
            req=[w['hanzi'] for part in (before,value['hanzi'],after) for _,_,w in segment(part,words)]
            spans=segment(before,words)+[(len(before),len(before)+len(value['hanzi']),value)]
            offset=len(before)+len(value['hanzi'])
            spans += [(a+offset,b+offset,w) for a,b,w in segment(after,words)]
            dictionary=[];segments=[]
            for start,end,w in spans:
                if w not in dictionary:dictionary.append(w)
                segments.append(dict(start=start,end=end,word=dictionary.index(w)))
            identity=hashlib.sha256(json.dumps([unit,group,text,value],ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:20]
            entry=dict(**text,id='sentence:v1:'+identity,unit_id='tw.'+unit,group=unit+':'+group,
                context='Diễn đạt thông tin phù hợp với tình huống.',gap=value['hanzi'],options=[w['hanzi'] for w in SLOTS[slot]],
                words=[dict(**w,audio_key=key(w['hanzi'])) for w in dictionary],segments=segments,
                audio_key=key(text['hanzi']),required_words=sorted(set(req)),required_grammar=[name for name,markers in features if all(m in text['hanzi'] for m in markers)])
            entry['id']='sentence:v1:'+hashlib.sha256(json.dumps(entry,ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:20]
            entries.append(entry)
    if missing:
        print('Missing dictionary characters:', ''.join(sorted(missing)))
        raise SystemExit(1)
    target=ROOT/'content/sentence-review.json'
    previous=json.loads(target.read_text(encoding='utf-8')) if target.exists() else {}
    active={e['id'] for e in entries}
    retired={e['id']:e for e in previous.get('retired_entries',[])+previous.get('entries',[]) if e['id'] not in active}
    output={'version':1,'units':[{k:u[k] for k in ('id','title')} for u in pack['units']],'entries':entries,'retired_entries':list(retired.values())}
    (ROOT/'content/sentence-review.json').write_text(json.dumps(output,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
    cues=dict(line.split('\t',1) for line in (ROOT/'content/lesson-use-cues.tsv').read_text(encoding='utf-8').splitlines() if line.strip())
    contexts={}
    for unit in pack['units']:
        for word in unit['words']:
            if word['hanzi'] in cues:contexts[word['id']]=cues[word['hanzi']];continue
            matches=[e for e in entries if word['hanzi'] in e['hanzi']]
            if not matches:raise ValueError('Missing situation: '+word['hanzi'])
            match=min(matches,key=lambda e:(e['unit_id']!=unit['id'],len(e['hanzi'])))
            contexts[word['id']]=f'Tình huống: {match["vi"]} Viết từ đã học có nghĩa “{word["vi"]}” để dùng trong tình huống này.'
    (ROOT/'src/core/lesson-use-cues.json').write_text(json.dumps(contexts,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    print(f'{len(entries)} sentences / {len(output["units"])} topics')

if __name__=='__main__':build()
