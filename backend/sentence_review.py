"""Versioned, offline sentence data and durable practice events. No AI calls."""
import hashlib
import json
import re
import unicodedata
from functools import lru_cache
from uuid import UUID
from datetime import timezone
from typing import Literal
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field, AwareDatetime
from . import db
from .content import ROOT

@lru_cache(maxsize=1)
def catalog():
    return json.loads((ROOT/'content/sentence-review.json').read_text(encoding='utf-8'))

@lru_cache(maxsize=1)
def lexicon():
    words=json.loads((ROOT/'src/core/study-lookup.json').read_text(encoding='utf-8'))['words']
    words+=json.loads((ROOT/'content/sentence-review-words.json').read_text(encoding='utf-8'))
    return sorted({w['hanzi'] for w in words},key=len,reverse=True)

def tokens(text):
    result=[];at=0
    while at<len(text):
        if not re.match(r'[\u3400-\u9fff〇]',text[at]):at+=1;continue
        word=next((w for w in lexicon() if text.startswith(w,at)),text[at])
        result.append(word);at+=len(word)
    return result

def knowledge(state):
    words=set();grammar=set()
    features=json.loads((ROOT/'content/sentence-review-features.json').read_text(encoding='utf-8'))
    def taught(text):
        if not isinstance(text,str):return
        words.update(tokens(text))
        # These characters inside lexical words do not demonstrate the grammar.
        grammar_text=re.sub(r'記得|覺得|得到|獲得|難得|難過|經過|通過|過去|過來|過年|比較|比賽|比例|才能|人才|才藝|離開', '', text)
        grammar.update(name for name,markers in features if all(m in grammar_text for m in markers))
    objects=state['objects']
    for collection in ('cards','reports'):
        for row in objects[collection].values():
            if row['deleted']:continue
            d=row['data']
            if collection=='cards' and not d.get('suspended'):words.add(d.get('word',{}).get('hanzi',''))
            if collection=='reports' and d.get('kind')=='learned-word' and d.get('learned') is True:words.add(d.get('word',{}).get('hanzi',''))
    pack=json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
    dialogues=json.loads((ROOT/'src/core/lesson-dialogues.json').read_text(encoding='utf-8'))
    for unit in pack['units']:
        for lesson in unit['lessons']:
            row=objects['sessions'].get(lesson['id'],{})
            if row.get('deleted') or row.get('data',{}).get('phase')!='summary' or row.get('data',{}).get('archived'):continue
            words.update(w['hanzi'] for w in unit['words'] if w['id'] in lesson['word_ids'])
            for text in dialogues.get(lesson['id'],[]):taught(text['hanzi'])
            for g in unit['grammar']:
                if g['id'] in lesson['grammar_ids']:
                    for text in g.get('examples',[]):taught(text['hanzi'])
    for row in objects['sessions'].values():
        d=row['data']
        if row['deleted'] or d.get('archived') or d.get('phase')!='summary':continue
        if d.get('scope')=='grammar':
            for unit in pack['units']:
                for g in unit['grammar']:
                    if g['id']==d.get('grammar_id'):
                        for text in g.get('examples',[]):taught(text['hanzi'])
        if d.get('scope')=='lesson-expansion':
            for word in d.get('packet',{}).get('vocabulary',[]):words.add(word['hanzi'])
            for block in d.get('packet',{}).get('blocks',[]):
                for text in block.get('examples',[]):taught(text['hanzi'])
        if d.get('scope')=='topic-language':
            correct={a['id'] for a in d.get('answers',[]) if a.get('correct') is True}
            for q in d.get('items',[]):
                if q.get('id') in correct:
                    for text in q.get('examples',[]):taught(text['hanzi'])
    words.discard('')
    return words,grammar

class Pull(BaseModel):
    model_config=ConfigDict(extra='forbid')
    known_ids:list[str]=Field(default_factory=list,max_length=10000)

def manifest(body:Pull, relaxed=False):
    state=db.get_state();words,grammar=knowledge(state)
    entries=[{**e,'options':[option for option in e['options'] if option==e['gap'] or option in words or set(tokens(option))<=words]} for e in catalog()['entries'] if set(e['required_words'])<=words and set(e['required_grammar'])<=grammar]
    if relaxed:
        entries=[{**e,'new_words':sorted(set(e['required_words'])-words)} for e in catalog()['entries'] if
                 len(set(e['required_words'])-words)<=1 and
                 len(set(e['required_words'])&words)/max(1,len(set(e['required_words'])))>=.8 and
                 set(e['required_grammar'])<=grammar]
    ids={e['id'] for e in entries};known=set(body.known_ids)
    revision=hashlib.sha256(json.dumps([sorted(ids),sorted(words),sorted(grammar)],ensure_ascii=False).encode()).hexdigest()
    exposure={}
    for event in sorted(state['events'],key=lambda e:e.get('timestamp','')):
        value=event.get('sentence_review')
        if value:exposure[value['sentence_id']]={k:value[k] for k in ('sentence_id','run_id','timestamp','result','revisit')}
    return {'protocol':2,'pc_id':state['device_id'],'revision':revision,'units':catalog()['units'],'exposure':list(exposure.values()),
            'entries':[e for e in entries if e['id'] not in known], 'removed':sorted(known-ids),
            'options':{e['id']:e['options'] for e in entries},
            'allowed_ids':sorted(ids),'knowledge':{'words':sorted(words),'grammar':sorted(grammar)}}

class ReviewEvent(BaseModel):
    model_config=ConfigDict(extra='forbid')
    id:UUID
    run_id:UUID
    task_id:str=Field(max_length=200)
    sentence_id:str=Field(max_length=100)
    unit_id:str=Field(max_length=80)
    group:str=Field(max_length=120)
    answer:str=Field(max_length=4000)
    result:Literal['correct','incorrect','compare','skipped']
    mode:Literal['gap','choice','assemble','to_vi','to_zh']
    assisted:bool
    revisit:bool=False
    feedback:bool=False
    timestamp:AwareDatetime
    duration_ms:int=Field(ge=0,le=86400000)

class Push(BaseModel):
    model_config=ConfigDict(extra='forbid')
    events:list[ReviewEvent]=Field(max_length=200)

def push(body:Push,device:str):
    accepted=[];bank={e['id']:e for e in catalog()['entries']+catalog().get('retired_entries',[])}
    with db.connect() as conn:
        conn.execute('BEGIN IMMEDIATE')
        for item in body.events:
            e=bank.get(item.sentence_id)
            if not e or e['unit_id']!=item.unit_id or e['group']!=item.group or item.task_id!=item.sentence_id+':'+item.mode:
                raise HTTPException(422,'Câu ôn không thuộc ngân hàng đã phát hành.')
            normalize=lambda s:''.join(c for c in unicodedata.normalize('NFC',s).lower() if not c.isspace() and not unicodedata.category(c).startswith('P'))
            if item.result!='skipped':
                expected=e['vi'] if item.mode=='to_vi' else e['gap'] if item.mode in ('gap','choice') else e['hanzi']
                verdict='correct' if normalize(item.answer)==normalize(expected) else 'compare' if item.mode in ('to_vi','to_zh') else 'incorrect'
                if verdict!=item.result:raise HTTPException(422,'Kết quả không khớp đáp án của phiên bản câu.')
            value=item.model_dump(mode='json');identity=str(item.id)
            action='sentence-review:'+device+':'+str(item.run_id)+':'+item.task_id+(':feedback:'+identity if item.feedback else '')
            event={'id':identity,'action_key':action,'kind':'practice','skill':'writing' if item.mode in ('to_zh','to_vi','assemble') else 'grammar',
                'item_id':item.task_id,'correct':None,'assisted':item.assisted,'answer':item.answer,'duration_ms':item.duration_ms,
                'algorithm':'sentence-review-v1','timestamp':item.timestamp.astimezone(timezone.utc).isoformat(),'category':'','source':'authored',
                'origin':'android' if device!='desktop' else 'desktop','sentence_review':value}
            old=conn.execute('SELECT payload FROM events WHERE id=? OR action_key=?',(identity,action)).fetchone()
            if old:
                if json.loads(old['payload'])!=event:raise HTTPException(409,'Lượt ôn đã có nội dung khác. Giữ hàng chờ để đối chiếu.')
            else:conn.execute('INSERT INTO events VALUES(?,?,?,?,?)',(identity,action,device,db.now(),json.dumps(event,ensure_ascii=False)))
            accepted.append(identity)
    return {'accepted':accepted}

def audio_text(key):
    # Only packaged texts; never expose arbitrary synthesis or paths over LAN.
    for e in catalog()['entries']+catalog().get('retired_entries',[]):
        if e['audio_key']==key:return e['hanzi']
        for word in e['words']:
            if word['audio_key']==key:return word['hanzi']
    return None
