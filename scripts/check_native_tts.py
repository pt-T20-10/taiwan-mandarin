"""Real retained Windows TTS and cancellation, without saving synthesized WAV."""
import asyncio,json,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];sys.path.insert(0,str(ROOT))
from backend.ai import LocalAI

async def main():
    adapter=LocalAI();await adapter.discover_voices()
    assert adapter.voices,'No installed native zh-TW voice'
    report={'voices':adapter.voices,'samples':[],'notice':'Technical synthesis/cancellation check; not human listening or pronunciation certification.'}
    for voice in adapter.voices:
        start=time.perf_counter();wav=await adapter.synthesize('我想掛號。垃圾在哪裡？我明天得上早班。',voice)
        assert wav[:4]==b'RIFF';report['samples'].append({'voice':voice,'bytes':len(wav),'ms':round((time.perf_counter()-start)*1000)})
    create=asyncio.create_subprocess_exec;children=[]
    async def spawn(*args,**kwargs):
        proc=await create(*args,**kwargs);children.append(proc);return proc
    asyncio.create_subprocess_exec=spawn
    try:
        task=asyncio.create_task(adapter.synthesize('今天下午我想去圖書館學習中文。'*50))
        while not children:await asyncio.sleep(.01)
        await asyncio.sleep(.1);assert children[0].returncode is None
        task.cancel()
        try:await task
        except asyncio.CancelledError:pass
        assert children[0].returncode is not None
        report['cancelled_child_exit_code']=children[0].returncode
    finally:asyncio.create_subprocess_exec=create
    (ROOT/'docs/benchmark-v6-native-tts.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
