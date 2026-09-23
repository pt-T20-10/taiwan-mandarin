"""Real native zh-TW synthesis -> real Whisper; synthetic speech, not microphone.

No recordings retained. Latency is complete WAV/inference, not first audible sound.
"""
import asyncio
import argparse
import io
import json
import math
import re
import statistics
import time
import wave
from array import array
from pathlib import Path
import httpx
from benchmark import PROMPTS

EXTRA = ['銀行在學校旁邊。','我喜歡聽音樂，也喜歡旅行。','這個孩子長大了。','請重新說一次今天的重點。',
         '這條路的長度大約是兩公里。','他跑得很快，可是今天沒有跑步。','我買了三本書和兩杯茶。',
         '星期三下午三點半在捷運站見。','這杯珍珠奶茶要半糖少冰。','今天九月二十三日，我想去郵局寄信。']

def pcm16k(data):
    with wave.open(io.BytesIO(data),'rb') as source:
        channels=source.getnchannels();rate=source.getframerate()
        assert source.getsampwidth()==2
        samples=array('h',source.readframes(source.getnframes()))
    mono=[sum(samples[i:i+channels])/channels for i in range(0,len(samples),channels)]
    output=array('h')
    for i in range(math.ceil(len(mono)*16000/rate)):
        position=min(i*rate/16000,len(mono)-1);left=int(position);weight=position-left
        output.append(round(mono[left]*(1-weight)+mono[min(left+1,len(mono)-1)]*weight))
    result=io.BytesIO()
    with wave.open(result,'wb') as target:
        target.setnchannels(1);target.setsampwidth(2);target.setframerate(16000);target.writeframes(output.tobytes())
    return result.getvalue(),len(mono)/rate,rate

def edit_distance(a,b):
    row=list(range(len(b)+1))
    for i,x in enumerate(a,1):
        new=[i]
        for j,y in enumerate(b,1):new.append(min(new[-1]+1,row[j]+1,row[j-1]+(x!=y)))
        row=new
    return row[-1]

async def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',default='benchmark-audio-synthetic.json');parser.add_argument('--asr-prompt',default='none');args=parser.parse_args()
    report={'kind':'Native Hanhan zh-TW TTS -> Whisper base; 40 synthetic clips, NOT human microphone or auditory review',
            'offline_scope':'Loopback API and Windows installed voice; Windows network was not physically disconnected',
            'asr_prompt':args.asr_prompt,'complete':False,'samples':[]}
    destination=Path('docs')/Path(args.output).name
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=120,trust_env=False) as client:
        report['voices']=(await client.get('/api/status')).json()['tts_voices']
        if not report['voices']:raise RuntimeError('No native voice. Restart service after installing Windows speech.')
        for i,text in enumerate([*PROMPTS,*EXTRA]):
            start=time.perf_counter();response=await client.post('/api/ai/tts',json={'text':text});response.raise_for_status()
            tts_ms=round((time.perf_counter()-start)*1000)
            audio,duration,rate=pcm16k(response.content)
            start=time.perf_counter();transcript=await client.post('/api/ai/asr',content=audio,headers={'Content-Type':'audio/wav'});transcript.raise_for_status()
            asr_ms=round((time.perf_counter()-start)*1000);result=transcript.json()
            clean=lambda s:re.sub(r'[^\u3400-\u9fff0-9]','',s)
            reference=clean(text);recognized=clean(result['text'])
            report['samples'].append({'index':i+1,'text':text,'tts_ms':tts_ms,'duration_seconds':round(duration,3),'native_sample_rate':rate,'asr_ms':asr_ms,'asr':result,'character_edits':edit_distance(reference,recognized),'reference_characters':len(reference)})
            destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
            print(f'{i+1}/40 TTS {tts_ms}ms ASR {asr_ms}ms: {result["text"]}',flush=True)
    report['complete']=True
    report['summary']={'tts_median_ms':statistics.median(s['tts_ms'] for s in report['samples']),
                       'asr_median_ms':statistics.median(s['asr_ms'] for s in report['samples']),
                       'raw_character_error_rate':sum(s['character_edits'] for s in report['samples'])/sum(s['reference_characters'] for s in report['samples']),
                       'quality':'Traditional/Simplified/numeral differences count as errors; no pronunciation rating; no subjective listening performed'}
    destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report['summary'],ensure_ascii=False),flush=True)

if __name__=='__main__':asyncio.run(main())
