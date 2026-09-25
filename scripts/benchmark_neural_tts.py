"""Synthetic local TTS regression. No microphone/subjective quality conclusions."""
import asyncio,io,json,math,sys,time,wave
from array import array
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.ai import LocalAI
from benchmark_audio import pcm16k

TEXTS=['你好，我是越南人，現在在臺灣學中文。很高興認識你！',
       '我不是老師，也不喝咖啡。我想買一杯茶，明天一起去，好嗎？',
       '銀行在學校旁邊。我喜歡聽音樂，也喜歡旅行。今天是2026年9月25日。']

async def main():
    adapter=LocalAI();await adapter.discover_voices()
    voices=[*['neural:kokoro-zf001','neural:kokoro-zf002','neural:kokoro-zm009'],*adapter.voices[:1]]
    report={'kind':'Synthetic TTS only; not human listening, pronunciation scoring or microphone evaluation',
            'complete':False,'threads':4,'neural':'Kokoro v1.1 zh FP32 / sherpa-onnx 1.13.8 CPU',
            'asr_model':adapter.config['asr_model'],'samples':[]}
    destination=Path('docs/benchmark-neural-tts.json')
    for voice in voices:
        for index,text in enumerate(TEXTS):
            start=time.perf_counter();data=await adapter.synthesize(text,voice);elapsed=round((time.perf_counter()-start)*1000)
            with wave.open(io.BytesIO(data),'rb') as wav:
                samples=array('h',wav.readframes(wav.getnframes()));rate=wav.getframerate()
                duration=wav.getnframes()/rate
            row={'voice':voice,'text':text,'tts_ms':elapsed,'duration_seconds':round(duration,3),
                 'sample_rate':rate,'rms':round(math.sqrt(sum(x*x for x in samples)/len(samples))),
                 'peak':max(map(abs,samples))}
            if index==0:
                audio,_,_=pcm16k(data);row['asr_regression_only']=await adapter.transcribe(audio)
                start=time.perf_counter();assert await adapter.synthesize(text,voice)==data
                row['cached_ms']=round((time.perf_counter()-start)*1000,2)
            report['samples'].append(row);destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
            print(voice,index+1,elapsed,'ms',row.get('asr_regression_only',{}).get('text',''),flush=True)
    report['complete']=True;destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':asyncio.run(main())
