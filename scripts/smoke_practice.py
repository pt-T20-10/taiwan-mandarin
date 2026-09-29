"""Explicit real-model smoke, no learning writes or configuration changes."""
import asyncio
import json
import sys
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from backend import practice
from backend.ai import LocalAI
from backend.content import bundled

async def main():
    results=[]
    for runtime,skill in [('cpu','writing'),('cuda','reading')]:
        adapter=LocalAI();adapter.config['runtime']=runtime
        practice.ai=adapter
        body=practice.PracticeRequest(unit_id='tw.food',skill=skill,request_id='smoke-v7-'+runtime)
        unit=next(u for u in bundled()['content']['units'] if u['id']==body.unit_id)
        job={};start=time.perf_counter();row={'runtime':runtime,'skill':skill}
        print('START',runtime,skill,flush=True)
        task=asyncio.create_task(practice.generate(body,unit,job))
        last=''
        try:
            while not task.done():
                if job.get('progress')!=last:
                    last=job.get('progress');print(runtime,last,flush=True)
                await asyncio.sleep(1)
            row['packet']=await task;row['status']='valid-structure-unverified-language'
        except Exception as e:
            row['status']='rejected';row['error']=str(e)
        finally:
            adapter.stop()
        row['seconds']=round(time.perf_counter()-start,2)
        results.append(row)
        print(runtime,row['status'],row.get('error',''),row['seconds'],flush=True)
        (ROOT/'data/practice-smoke-v7.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':asyncio.run(main())
