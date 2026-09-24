"""Paired no-prompt base/small comparison on identical synthetic WAVs.

Exploratory cases include known failures. No human speech accuracy claim.
"""
import asyncio
import json
import re
import statistics
import subprocess
import tempfile
import time
from pathlib import Path
import httpx
import psutil
from benchmark_audio import pcm16k,edit_distance

SENTENCES=['我是越南人，我是留學生。','我來自越南，現在在臺灣念書。','我想去圖書館借書。','請問，郵局在哪裡？',
           '星期三下午三點半在捷運站見。','這杯珍珠奶茶要半糖少冰。','我想買兩個蘋果。','請重新說一次今天的重點。',
           '今天九月二十三日，我想去郵局寄信。','你好，你叫什麼名字？','我今天沒有課，想在家休息。','請問，這裡可以用信用卡嗎？']

async def main():
    report={'kind':'Exploratory paired synthetic speech comparison, includes known failures; not human microphone benchmark','prompt':None,'samples':[],'complete':False}
    destination=Path('docs/benchmark-asr-models.json')
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=120,trust_env=False) as client:
        for sentence in SENTENCES:
            response=await client.post('/api/ai/tts',json={'text':sentence,'rate':0});response.raise_for_status();wav,duration,_=pcm16k(response.content)
            row={'reference':sentence,'duration_seconds':round(duration,3),'models':{}}
            with tempfile.TemporaryDirectory(prefix='asr-comparison-') as temp:
                folder=Path(temp);(folder/'input.wav').write_bytes(wav)
                for model in ('base','small'):
                    command=[str(Path('runtime/whisper/whisper-cli.exe').resolve()),'-m',str(Path(f'models/ggml-{model}.bin').resolve()),'-f',str(folder/'input.wav'),'-l','zh','-t','6','-nt','-otxt','-of',str(folder/'result')]
                    start=time.perf_counter();peak=0
                    with (folder/'stderr.txt').open('wb') as log:
                        process=subprocess.Popen(command,stdout=subprocess.DEVNULL,stderr=log,creationflags=subprocess.CREATE_NO_WINDOW)
                        try:
                            while process.poll() is None:
                                try:peak=max(peak,psutil.Process(process.pid).memory_info().rss)
                                except psutil.Error:pass
                                if time.perf_counter()-start>90:raise TimeoutError('ASR trial exceeded 90 seconds')
                                await asyncio.sleep(.05)
                            if process.returncode:raise RuntimeError((folder/'stderr.txt').read_text(errors='replace')[-1000:])
                        finally:
                            if process.poll() is None:process.kill();process.wait()
                    transcript=(folder/'result.txt').read_text(encoding='utf-8').strip()
                    clean=lambda s:re.sub(r'[^\u3400-\u9fff0-9]','',s)
                    row['models'][model]={'text':transcript,'elapsed_ms':round((time.perf_counter()-start)*1000),'peak_rss_bytes':peak,'edits':edit_distance(clean(sentence),clean(transcript)),'characters':len(clean(sentence))}
            report['samples'].append(row);destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(row,ensure_ascii=False),flush=True)
    report['summary']={model:{'median_ms':statistics.median(row['models'][model]['elapsed_ms'] for row in report['samples']),
                              'cer':sum(row['models'][model]['edits'] for row in report['samples'])/sum(row['models'][model]['characters'] for row in report['samples']),
                              'peak_rss_bytes':max(row['models'][model]['peak_rss_bytes'] for row in report['samples'])} for model in ('base','small')}
    report['complete']=True;destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report['summary']),flush=True)

if __name__=='__main__':asyncio.run(main())
