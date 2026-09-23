"""15 minute real local text inference soak. Not a real microphone/voice session."""
import json
import time
import subprocess
from pathlib import Path
import httpx
import psutil
ROOT=Path(__file__).resolve().parents[1]
def run():
    start=time.monotonic();rows=[];turns=[]
    prompts=['你好，我想練習在臺灣點餐。','我想喝熱茶，不要糖。','請問多少錢？','我不吃辣。','謝謝你。明天見！']
    with httpx.Client(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=180,trust_env=False) as client:
        i=0
        try:
            while time.monotonic()-start<900:
                prompt=prompts[i%len(prompts)];turns.append({'role':'user','content':prompt});t=time.monotonic()
                r=client.post('/api/ai/chat',json={'messages':turns[-12:],'request_id':f'soak-{i}'})
                payload=r.json()
                if r.is_success:turns.append({'role':'assistant','content':payload['hanzi']})
                rss=max((p.info['memory_info'].rss for p in psutil.process_iter(['name','memory_info']) if p.info['name']=='llama-server.exe'),default=0)
                gpu=subprocess.run(['nvidia-smi','--query-gpu=memory.used','--format=csv,noheader,nounits'],capture_output=True,text=True,creationflags=subprocess.CREATE_NO_WINDOW).stdout.strip()
                rows.append({'seconds':round(time.monotonic()-start,1),'latency_ms':round((time.monotonic()-t)*1000),'status':r.status_code,'llama_rss_bytes':rss,'whole_gpu_used_MiB':gpu,'response':payload})
                result={'kind':'15 minute scripted text-only soak; no hardware mic/TTS assessment','complete':False,'elapsed_seconds':round(time.monotonic()-start,1),'samples':rows}
                (ROOT/'docs/benchmark-soak.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
                print(i+1,rows[-1]['seconds'],r.status_code,flush=True);i+=1
                if i%5==0:turns=[]
                for _ in range(3):
                    if time.monotonic()-start>=900:break
                    time.sleep(min(10,900-(time.monotonic()-start)))
            result['complete']=True;result['elapsed_seconds']=round(time.monotonic()-start,1)
            (ROOT/'docs/benchmark-soak.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        finally:client.post('/api/ai/unload',json={})
if __name__=='__main__':run()
