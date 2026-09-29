"""Bounded, cancellable local AI practice generation. Never a trusted answer key."""
import asyncio
import json
import re
import time
import httpx
from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from .content import Text, PracticeItem, PracticeSet
from .ai import ai
from . import db

class PracticeRequest(BaseModel):
    model_config=ConfigDict(extra='forbid')
    unit_id: str = Field(max_length=100)
    skill: Literal['reading','listening','speaking','writing']
    request_id: str = Field(pattern=r'^[a-zA-Z0-9-]{1,100}$')

jobs={}
KINDS={'reading':['choice']*6+['cloze-choice']*2+['cloze-input']*2,
       'listening':['choice']*6+['cloze-choice']*2+['dictation']*2,
       'speaking':['read-aloud']*4+['respond']*4,'writing':['write']*2}

def validate_text(t):
    item=Text.model_validate(t)
    if re.search(r'[\u3400-\u9fff0-9]',item.pinyin):raise ValueError('Pinyin AI sai định dạng')
    if re.search(r'[\u3400-\u9fff]',item.vi):raise ValueError('Bản dịch AI còn lẫn Hán tự')
    if re.search(r'[这说学吗国个们车钱书话时对会汉语电见欢边请]',item.hanzi):raise ValueError('Câu AI còn Giản thể')
    if not re.search(r'[\u3400-\u9fff]',item.hanzi):raise ValueError('Thiếu Hán tự')
    if len(item.hanzi)>100 or len(item.pinyin)>400 or len(item.vi)>400:raise ValueError('Câu AI quá dài')
    return item.model_dump()

def object_schema(properties):
    return {'type':'object','properties':properties,'required':list(properties),'additionalProperties':False}

TEXT_SCHEMA=object_schema({'hanzi':{'type':'string','minLength':6,'maxLength':100},
    'pinyin':{'type':'string','maxLength':400},'vi':{'type':'string','maxLength':400}})

def batch_schema(kind=None):
    if kind is None:
        return object_schema({'passage':{'type':'array','minItems':2,'maxItems':2,'items':TEXT_SCHEMA}})
    question=object_schema({
        'kind':{'type':'string','enum':[kind]},'prompt':{'type':'string','maxLength':300},
        'answers':{'type':'array','minItems':1,'maxItems':1,'items':{'type':'string'}},
        'choices':{'type':'array','minItems':3 if kind in ('choice','cloze-choice') else 0,'maxItems':3 if kind in ('choice','cloze-choice') else 0,'items':{'type':'string'}},
        'stimulus':TEXT_SCHEMA if kind in ('dictation','read-aloud','respond') else {'type':'null'},
        'explanation':{'type':'string'},'evidence_index':{'type':'integer','minimum':0,'maximum':7}})
    return object_schema({'items':{'type':'array','minItems':2,'maxItems':2,'items':question}})

async def completion(prompt,max_tokens,schema=None):
    await ai.start()
    instruction=('你編寫台灣華語練習。只使用繁體中文、帶聲調的漢語拼音、越南文說明。'
                 '只輸出指定 JSON，不要 markdown。不要聲稱內容經過教師審核。/no_think')
    async with httpx.AsyncClient(timeout=180,trust_env=False,headers={'Authorization':'Bearer '+ai.key}) as client:
        r=await client.post('http://127.0.0.1:8766/v1/chat/completions',json={'messages':[{'role':'system','content':instruction},{'role':'user','content':prompt}],
            'max_tokens':max_tokens,'temperature':.5,'chat_template_kwargs':{'enable_thinking':False},
            'response_format':{'type':'json_schema','json_schema':{'name':'practice_batch','strict':True,'schema':schema}} if schema else {'type':'json_object'}})
        r.raise_for_status()
    return json.loads(r.json()['choices'][0]['message']['content'])

async def generate(body,unit,job):
    topic=json.dumps({'topic':unit['title'],'words':[{k:w[k] for k in ('hanzi','pinyin','vi')} for w in unit['words'][:10]],'patterns':[g['hanzi'] for g in unit['grammar']]},ensure_ascii=False)
    passage=[]
    for offset in range(0,8,2):
        job['progress']=f'Đang tạo ngữ cảnh: {offset}/8 câu…'
        prompt=topic+'\n創作同一個連貫情境的八句短文。現在只寫第'+str(offset+1)+'和'+str(offset+2)+'句，每句不超過25個漢字。此前句子：'+json.dumps([s['hanzi'] for s in passage],ensure_ascii=False)+'\n格式 {"passage":[{"hanzi":"...","pinyin":"...","vi":"..."}, ...]}。vi 必須是越南文。'
        prompt+='\n必須是完整句子，不是單字清單。每句5到25個漢字並以句號或問號結尾。例如「我想點一碗牛肉麵。」不是「麵」。用詞表僅供參考，不要抄寫詞表。'
        for attempt in range(2):
            try:
                raw=await completion(prompt,1000,batch_schema())
                if not isinstance(raw.get('passage'),list) or len(raw['passage'])!=2:raise ValueError('AI chưa tạo đúng hai câu ngữ cảnh')
                pair=[validate_text(t) for t in raw['passage']]
                for sentence in pair:
                    if len(re.findall(r'[\u3400-\u9fff]',sentence['hanzi']))<4 or sentence['hanzi'][-1] not in '。！？!?':raise ValueError('AI trả từ rời thay vì câu ngữ cảnh')
                if len({t['hanzi'] for t in passage+pair})!=len(passage)+2:raise ValueError('AI lặp câu; cần thông tin mới, không viết lại câu trước')
                passage.extend(pair);break
            except (ValueError,KeyError,TypeError) as e:
                if attempt:raise
                job['progress']=f'Đang sửa ngữ cảnh: {offset}/8 câu…'
                prompt+='\n上次輸出未通過檢查：'+str(e)[:250]+'。請重新寫兩句完整的新句子，推進故事，例如加上人物、時間、地點、價格或下一步。pinyin 只用拉丁字母和聲調符號；vi 只用越南文，不可混入漢字。'
    if len({s['hanzi'] for s in passage})!=8:raise ValueError('AI lặp câu trong đoạn')
    items=[];kinds=KINDS[body.skill]
    for offset in range(0,len(kinds),2):
        job['progress']=f'Đang tạo câu hỏi: {offset}/{len(kinds)}…'
        desired=kinds[offset:offset+2]
        prompt=topic+'\n文章(索引0到7)：'+json.dumps([s['hanzi'] for s in passage],ensure_ascii=False)+'\n只寫兩題，題型依序 '+json.dumps(desired)+'. 已有題目：'+json.dumps([q['prompt'] for q in items],ensure_ascii=False)+'''
格式 {"items":[{"kind":"...","prompt":"越南文題目", "answers":["答案"],"choices":[],"explanation":"越南文解釋及文章證據","evidence_index":0,"stimulus":null}, ...]}。
choice/cloze-choice 要有3個不同選項，只有一個正確答案且必須完全等於某個選項。cloze-choice/cloze-input 的 prompt 必須含一個 ___ 和有空格的中文句子，不要寫完整答案。其他題型 choices 為空陣列。dictation/read-aloud/respond 必須提供 stimulus={hanzi,pinyin,vi} 的整句參考答案；answers 要與 stimulus.hanzi 一致。prompt/explanation/vi 用越南文。read-aloud 是讀句子，respond 是按情境自己回答，write 是寫句子或3–5句短文。不要重複已有題目。'''
        if body.skill=='writing':prompt+='\n第一題只寫一句話，第二題寫3–5句短文。answers 提供完整範文，不能只給一個詞。'
        if desired[0].startswith('cloze'):prompt+='\n填空題答案必須是文章 evidence_index 那一句中只出現一次的中文詞語，不是整句。系統會把答案詞語替換成空格。請選有明確意義的詞語。'
        raw=await completion(prompt,1400,batch_schema(desired[0]))
        if not isinstance(raw.get('items'),list) or len(raw['items'])!=len(desired):raise ValueError('AI trả sai số câu hỏi')
        for i,q in enumerate(raw['items']):
            if q.get('kind')!=desired[i]:raise ValueError('AI trả sai dạng bài')
            q['id']=f'ai.{body.request_id}.q{offset+i+1}'
            if desired[i].startswith('cloze'):
                evidence=q.get('evidence_index');answers=q.get('answers',[])
                if not isinstance(evidence,int) or not 0<=evidence<8 or len(answers)!=1:raise ValueError('Thiếu căn cứ cho chỗ trống AI')
                source=passage[evidence];answer=answers[0]
                if not answer or source['hanzi'].count(answer)!=1 or answer==source['hanzi']:raise ValueError('Đáp án AI không chỉ đúng một vị trí trong câu')
                q['prompt']='Điền từ/cụm phù hợp (nghĩa câu: '+source['vi']+'): '+source['hanzi'].replace(answer,'___',1)
                q['stimulus']=None
            if q.get('stimulus'):q['stimulus']=validate_text(q['stimulus'])
            q=PracticeItem.model_validate(q).model_dump()
            if q['kind'] in ('dictation','read-aloud','respond') and q['stimulus']['hanzi'] not in q['answers']:raise ValueError('Câu mẫu AI không khớp đáp án')
            items.append(q)
    if len({q['prompt'] for q in items})!=len(items):raise ValueError('AI lặp câu hỏi')
    return PracticeSet.model_validate(dict(id='ai.'+body.request_id,title=unit['title']+' · bộ AI',skill=body.skill,source='ai',verification='draft',reference='Qwen3-4B local · Chưa kiểm chứng; không dùng làm đáp án chuẩn.',passage=passage,items=items)).model_dump()

async def run(body,unit,job):
    try:
        job['packet']=await generate(body,unit,job);job['status']='done';job['progress']='Đã tạo đủ bộ đề.'
    except asyncio.CancelledError:
        job['status']='cancelled';job['error']='Đã hủy tạo đề.'
    except Exception as e:
        job['status']='error';job['error']='Chưa tạo được bộ đề hợp lệ. '+str(e)[:350]
    finally:
        ai.active.pop(body.request_id,None);job['updated']=time.monotonic()

def start(body):
    # Keep completed jobs briefly for polling, bounded in memory.
    for key,job in list(jobs.items()):
        if job['status']!='running' and time.monotonic()-job['updated']>600:jobs.pop(key,None)
    if body.request_id in jobs:return jobs[body.request_id]
    if ai.active:raise RuntimeError('AI đang xử lý một lượt; hãy chờ hoặc hủy lượt trước')
    with db.connect() as conn:
        row=conn.execute("SELECT payload FROM packages WHERE id='foundation-tw'").fetchone()
    content=json.loads(row['payload'])['content']
    unit=next((u for u in content['units'] if u['id']==body.unit_id),None)
    if not unit:raise ValueError('Không tìm thấy chủ đề')
    if len(jobs)>=20:
        oldest=next((k for k,j in jobs.items() if j['status']!='running'),None)
        if oldest:jobs.pop(oldest)
    job={'status':'running','progress':'Đang mở model local…','updated':time.monotonic()};jobs[body.request_id]=job
    task=asyncio.create_task(run(body,unit,job));ai.active[body.request_id]=task
    return job
