"""Local reproducible technical measurements, not linguistic certification."""
import asyncio
import io
import json
import time
import wave
import sys
import argparse
from pathlib import Path
import httpx
import psutil

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

PROMPTS=[
'你好，我是越南人。你叫什麼名字？','早安！今天你好嗎？','我要一杯熱茶，謝謝。','我不吃辣，可以不要辣嗎？','請問，這個多少錢？',
'我想買兩個蘋果。','請問，捷運站在哪裡？','到臺北車站怎麼走？','我想坐公車去學校。','我家有四個人。',
'我有一個妹妹。你呢？','這個房間有冷氣嗎？','一個月的房租多少錢？','我明天下午有課。','你星期三有空嗎？',
'現在幾點？','請問，郵局在哪裡？','我聽不懂，請再說一次。','這個詞是什麼意思？','我會說一點中文。',
'我已經吃飯了。','你週末喜歡做什麼？','我想去圖書館借書。','老師您好，我想跟您討論報告。','明天下午三點方便嗎？',
'請幫我修改這句：我是很忙。','請幫我修改這句：我不有錢。','我想喝珍珠奶茶，半糖少冰。','我想練習用繁體中文寫電子郵件。','謝謝你，明天見！'
]

async def run():
    parser=argparse.ArgumentParser();parser.add_argument('--output',default='benchmark-chat.json');args=parser.parse_args()
    destination=ROOT/'docs'/Path(args.output).name
    rows=[];peak=0
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=180,trust_env=False) as client:
        await client.post('/api/ai/unload',json={})
        status=(await client.get('/api/status')).json()
        for i,prompt in enumerate(PROMPTS):
            start=time.perf_counter()
            request=asyncio.create_task(client.post('/api/ai/chat',json={'messages':[{'role':'user','content':prompt}],'request_id':f'benchmark-{i}'}))
            local_peak=0
            while not request.done():
                for proc in psutil.process_iter(['name','memory_info']):
                    try:
                        if proc.info['name']=='llama-server.exe':local_peak=max(local_peak,proc.info['memory_info'].rss)
                    except psutil.Error:pass
                await asyncio.sleep(.1)
            response=await request
            row={'index':i,'prompt':prompt,'total_ms':round((time.perf_counter()-start)*1000),'http_status':response.status_code,'peak_llama_rss_bytes':local_peak,'response':response.json()}
            rows.append(row);peak=max(peak,local_peak)
            destination.write_text(json.dumps({'config':status['model']+'; llama b11120, 6 threads, ctx4096; non-streaming','quality':'unreviewed; not certification','samples':rows,'peak_llama_rss_bytes':peak},ensure_ascii=False,indent=2),encoding='utf-8')
            print(f'{i+1}/30 {row["http_status"]} {row["total_ms"]} ms',flush=True)
        # Known synthetic silence: not a real microphone sample or speech quality benchmark.
        buffer=io.BytesIO()
        with wave.open(buffer,'wb') as wav:
            wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(16000);wav.writeframes(b'\0\0'*16000*5)
        start=time.perf_counter();r=await client.post('/api/ai/asr',content=buffer.getvalue(),headers={'Content-Type':'audio/wav'})
        (ROOT/'docs/benchmark-asr-silence-after-fix.json').write_text(json.dumps({'input':'synthetic 5s PCM16 16kHz mono zero samples','elapsed_ms':round((time.perf_counter()-start)*1000),'status':r.status_code,'result':r.json()},ensure_ascii=False,indent=2),encoding='utf-8')
        print('Silence',r.status_code,r.text,flush=True)
        await client.post('/api/ai/unload',json={})

if __name__=='__main__':asyncio.run(run())
