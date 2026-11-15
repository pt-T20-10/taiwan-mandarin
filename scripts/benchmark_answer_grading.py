"""Small live local-model check; does not save learner progress."""
import json,time,urllib.request,uuid
from pathlib import Path
cases=[
 ('vi-paraphrase','to_vi','Bạn là thầy giáo à?','Bạn là giáo viên phải không?','你是老師嗎？','Bạn là giáo viên phải không?','',True),
 ('vi-negation','to_vi','Tôi là giáo viên.','Tôi không phải giáo viên.','我不是老師。','Tôi không phải giáo viên.','',False),
 ('zh-paraphrase','to_zh','我想喝茶。','我要喝茶。','我要喝茶。','Tôi muốn uống trà.','',True),
 ('zh-number','to_zh','我要三杯茶。','我要兩杯茶。','我要兩杯茶。','Tôi muốn hai cốc trà.','',False),
 ('gap-synonym','gap','想','要','我要喝水。','Tôi muốn uống nước.','我___喝水。',True),
 ('gap-wrong','gap','不','要','我要喝水。','Tôi muốn uống nước.','我___喝水。',False),
]
results=[]
for name,mode,answer,reference,sentence,meaning,template,expected in cases:
 body=dict(mode=mode,answer=answer,reference=reference,sentence=sentence,meaning=meaning,template=template,request_id=str(uuid.uuid4()))
 start=time.monotonic()
 try:
  req=urllib.request.Request('http://127.0.0.1:8765/api/learn/grade',data=json.dumps(body).encode(),headers={'Content-Type':'application/json','X-Mandarin-Client':'local-ui'})
  result=json.load(urllib.request.urlopen(req,timeout=160))
 except Exception as exc:result={'error':str(exc)}
 results.append({'case':name,'expected':expected,'seconds':round(time.monotonic()-start,2),**result})
 print(json.dumps(results[-1],ensure_ascii=False),flush=True)
Path('data/answer-grading-live.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
