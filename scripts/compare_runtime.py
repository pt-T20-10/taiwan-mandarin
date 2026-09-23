import json
import subprocess
import time
import argparse
from pathlib import Path
import httpx
import psutil

ROOT=Path(__file__).resolve().parents[1]
SYSTEM='''你是台灣朋友「小島」，陪越南學習者聊天。請直接回答對方的問題或接續話題，不要重複、翻譯、改寫使用者原句。回覆只用一到兩句自然的台灣繁體中文。
輸出 JSON：hanzi 是你自己的回答；pinyin 是這個回答的漢語拼音（聲調符號）；vi 是這個回答的越南文翻譯；feedback 通常是空字串，只在對方真的有語法錯誤時，用越南文簡短說明。不要無故糾正。/no_think'''
EXAMPLE=[{'role':'user','content':'你好，我是越南人。你叫什麼名字？'},{'role':'assistant','content':json.dumps({'hanzi':'你好！我叫小島。很高興認識你！','pinyin':'Nǐ hǎo! Wǒ jiào Xiǎodǎo. Hěn gāoxìng rènshì nǐ!','vi':'Chào bạn! Tôi tên Tiểu Đảo. Rất vui được biết bạn!','feedback':''},ensure_ascii=False)}]
PROMPTS=['我要一杯熱茶，謝謝。','我家有四個人。你呢？','老師您好，我想跟您討論報告。','我不有錢。','明天下午三點方便嗎？']

def run():
    parser=argparse.ArgumentParser();parser.add_argument('--large',action='store_true');args=parser.parse_args()
    all_results=[]
    model='Qwen3-4B-Q4_K_M.gguf' if args.large else 'Qwen3-1.7B-Q4_K_M.gguf'
    destination=ROOT/'docs'/('benchmark-4b-comparison.json' if args.large else 'benchmark-runtime-comparison.json')
    for folder,ngl in [('llama','0'),('llama-cuda','99')]:
        log=(ROOT/'data'/f'{folder}-compare.log').open('wb')
        started=time.perf_counter();proc=subprocess.Popen([str(ROOT/'runtime'/folder/'llama-server.exe'),'-m',str(ROOT/'models'/model),'--host','127.0.0.1','--port','8768','-c','4096','-ngl',ngl,'-t','6','--parallel','1','--jinja','--reasoning-budget','0'],stdout=log,stderr=log,creationflags=subprocess.CREATE_NO_WINDOW)
        try:
            with httpx.Client(base_url='http://127.0.0.1:8768',timeout=120,trust_env=False) as client:
                ready=False
                for _ in range(120):
                    if proc.poll() is not None:raise RuntimeError(f'{folder} exited: {proc.returncode}')
                    try:
                        if client.get('/health',timeout=1).is_success:ready=True;break
                    except httpx.HTTPError:pass
                    time.sleep(.25)
                if not ready:raise RuntimeError('Runtime did not become ready within startup timeout')
                load_ms=round((time.perf_counter()-started)*1000)
                for prompt in PROMPTS:
                    start=time.perf_counter();r=client.post('/v1/chat/completions',json={'messages':[{'role':'system','content':SYSTEM},*EXAMPLE,{'role':'user','content':prompt}],'temperature':.3,'max_tokens':350,'chat_template_kwargs':{'enable_thinking':False},'response_format':{'type':'json_object'}})
                    gpu=subprocess.run(['nvidia-smi','--query-gpu=memory.used,utilization.gpu','--format=csv,noheader,nounits'],capture_output=True,text=True,creationflags=subprocess.CREATE_NO_WINDOW)
                    row={'runtime':folder,'model':model,'load_ms':load_ms,'total_ms':round((time.perf_counter()-start)*1000),'rss_bytes_after_request':psutil.Process(proc.pid).memory_info().rss,'gpu_memory_MiB_and_util_percent_after_request':gpu.stdout.strip(),'prompt':prompt,'status':r.status_code,'response':r.json()}
                    all_results.append(row);print(folder,row['total_ms'],r.status_code,flush=True)
                    destination.write_text(json.dumps({'system':SYSTEM,'samples':all_results},ensure_ascii=False,indent=2),encoding='utf-8')
        except Exception as error:
            all_results.append({'runtime':folder,'error':str(error)})
            destination.write_text(json.dumps({'system':SYSTEM,'samples':all_results},ensure_ascii=False,indent=2),encoding='utf-8')
            print(folder,str(error),flush=True)
        finally:
            proc.terminate()
            try:proc.wait(timeout=10)
            except subprocess.TimeoutExpired:proc.kill();proc.wait()
            log.close()

if __name__=='__main__':run()
