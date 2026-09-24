"""Real local checks after removing the leaking Whisper prompt.

Synthetic voice is not a substitute for the user's microphone recording or
human listening assessment. No WAV is retained or committed.
"""
import asyncio
import argparse
import io
import json
import time
import wave
from pathlib import Path
import httpx
from benchmark_audio import pcm16k

async def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',default='benchmark-audio-regression.json');args=parser.parse_args()
    report={'kind':'Native TTS and prompt-free Whisper regression; synthetic speech, no human prosody certification','samples':[]}
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=120,trust_env=False) as client:
        status=(await client.get('/api/status')).json();voice=status['tts_voices'][0];report['asr_model']=status['config']['asr_model']
        for text in ['你好。','我今天很忙。','我要一杯茶。','我想買一本書。','請再說一次。','這是第一課。','我不要冰。','我不喝咖啡。','你叫什麼名字？','銀行在學校旁邊。','我是越南人，我是留學生。']:
            start=time.perf_counter();audio=await client.post('/api/ai/tts',json={'text':text,'voice':voice,'rate':0});audio.raise_for_status()
            wav,duration,rate=pcm16k(audio.content)
            row={'text':text,'voice':voice,'native_rate':0,'duration_seconds':round(duration,3),'native_sample_rate':rate,'tts_ms':round((time.perf_counter()-start)*1000)}
            if text=='我是越南人，我是留學生。':
                result=await client.post('/api/ai/asr',content=wav,headers={'Content-Type':'audio/wav'});result.raise_for_status();row['synthetic_asr']=result.json()
            report['samples'].append(row)
            print(json.dumps(row,ensure_ascii=False),flush=True)
        # Exercise explicit slow setting in the native bridge; timing alone does
        # not establish correctness of sandhi or natural phrasing.
        slow=await client.post('/api/ai/tts',json={'text':'我是越南人，我是留學生。','voice':voice,'rate':-2});slow.raise_for_status()
        _,duration,_=pcm16k(slow.content);report['slow_duration_seconds']=round(duration,3)
        silence=io.BytesIO()
        with wave.open(silence,'wb') as file:
            file.setnchannels(1);file.setsampwidth(2);file.setframerate(16000);file.writeframes(b'\x00\x00'*16000)
        result=await client.post('/api/ai/asr',content=silence.getvalue(),headers={'Content-Type':'audio/wav'});result.raise_for_status()
        report['silence']=result.json();assert result.json()['text']==''
    report['complete']=True
    (Path('docs')/Path(args.output).name).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':asyncio.run(main())
