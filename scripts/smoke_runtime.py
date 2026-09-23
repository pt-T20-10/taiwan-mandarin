"""Exercise real local cancellation/restart without storing learner data."""
import asyncio
import json
import time
from pathlib import Path
import httpx

async def main():
    result = {'kind': 'Real local runtime cancellation and recovery; synthetic prompt'}
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765', headers={'X-Mandarin-Client':'local-ui'}, timeout=180, trust_env=False) as client:
        (await client.post('/api/ai/unload')).raise_for_status()
        task = asyncio.create_task(client.post('/api/ai/chat', json={'request_id':'smoke-cancel', 'messages':[{'role':'user','content':'你好，你今天想做什麼？'}]}))
        await asyncio.sleep(1)
        start = time.perf_counter()
        cancel = await client.post('/api/ai/cancel/smoke-cancel')
        response = await task
        result['cancel'] = {'response':cancel.json(), 'chat_status':response.status_code, 'seconds':round(time.perf_counter()-start,3)}
        assert cancel.json()['cancelled'] and response.status_code == 409
        assert not (await client.get('/api/status')).json()['llm_running']
        start = time.perf_counter()
        reply = await client.post('/api/ai/chat',json={'request_id':'smoke-recovery','messages':[{'role':'user','content':'你好，你叫什麼名字？'}]})
        result['recovery'] = {'status':reply.status_code,'seconds':round(time.perf_counter()-start,3),'response':reply.json()}
        reply.raise_for_status()
        assert 'quality_warnings' in reply.json()
        (await client.post('/api/ai/unload')).raise_for_status()
        result['unloaded'] = not (await client.get('/api/status')).json()['llm_running']
        assert result['unloaded']
    Path('docs/benchmark-runtime-recovery.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__ == '__main__':
    asyncio.run(main())
