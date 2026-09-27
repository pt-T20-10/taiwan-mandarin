"""Smoke the retained 4B on CPU/CUDA without changing user configuration/state."""
import asyncio,json,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT))
from backend.ai import LocalAI

async def main():
    rows=[]
    for runtime in ('cpu','cuda'):
        adapter=LocalAI();adapter.config.update(model='Qwen3-4B-Q4_K_M.gguf',runtime=runtime)
        start=time.perf_counter()
        try:
            result=await adapter.chat([{'role':'user','content':'你好，我想練習中文。'}],'chat','smoke-v6-'+runtime)
            rows.append({'runtime':runtime,'elapsed_ms':round((time.perf_counter()-start)*1000),'result':result})
            print(runtime,rows[-1]['elapsed_ms'],'ms',flush=True)
        finally:adapter.stop()
    (ROOT/'docs/benchmark-v6-4b-smoke.json').write_text(json.dumps({'note':'Two synthetic smoke requests, not language quality certification','samples':rows},ensure_ascii=False,indent=2),encoding='utf-8')
if __name__=='__main__':asyncio.run(main())
