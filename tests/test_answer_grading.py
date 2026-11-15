import asyncio,json
import pytest
from backend import answer_grading as g

def request(**kw):
 return g.GradeRequest(mode='to_vi',answer='Bạn là thầy giáo à?',reference='Bạn là giáo viên phải không?',sentence='你是老師嗎？',meaning='Bạn là giáo viên phải không?',request_id='test',**kw)

def test_exact_answer_does_not_need_model(monkeypatch):
 async def unavailable():raise AssertionError('Should not load model')
 monkeypatch.setattr(g.ai,'start',unavailable)
 body=request();body.answer='Bạn là giáo viên phải không!'
 assert asyncio.run(g.evaluate(body))['grader']=='reference'

@pytest.mark.parametrize('verdict,expected',[('correct',True),('incorrect',False),('uncertain',None),('yes',None)])
def test_model_verdict_is_strict_and_failures_never_become_incorrect(monkeypatch,verdict,expected):
 async def start():pass
 monkeypatch.setattr(g.ai,'start',start)
 class Response:
  def raise_for_status(self):pass
  def json(self):return {'choices':[{'message':{'content':json.dumps({'verdict':verdict,'feedback':'Giải thích cụ thể.'})}}]}
 class Client:
  def __init__(self,**kw):assert kw['trust_env'] is False
  async def __aenter__(self):return self
  async def __aexit__(self,*args):pass
  async def post(self,url,json):
   assert url.startswith('http://127.0.0.1:8766/')
   assert 'untrusted' in json['messages'][0]['content']
   return Response()
 monkeypatch.setattr(g.httpx,'AsyncClient',Client)
 if expected is None:
  with pytest.raises(RuntimeError):asyncio.run(g.evaluate(request()))
 else:assert asyncio.run(g.evaluate(request()))['correct'] is expected
