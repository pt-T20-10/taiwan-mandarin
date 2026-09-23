"""Pilot fixed Traditional transcript context on ten previously measured clips.

No learner data and no reference answer injected into the recognizer prompt.
"""
import asyncio
import json
import re
import subprocess
import tempfile
from pathlib import Path
import httpx
from benchmark_audio import pcm16k,edit_distance

async def main():
    original=json.loads(Path('docs/benchmark-audio-synthetic.json').read_text(encoding='utf-8'))
    report={'kind':'Exploratory ten-clip synthetic pilot, selected after baseline; not held-out human validation',
            'prompt':'以下是臺灣華語的繁體中文逐字稿。','samples':[]}
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8765',headers={'X-Mandarin-Client':'local-ui'},timeout=120,trust_env=False) as client:
        for index in (1,2,6,11,17,22,23,34,38,40):
            baseline=original['samples'][index-1]
            audio=await client.post('/api/ai/tts',json={'text':baseline['text']});audio.raise_for_status()
            wav,_,_=pcm16k(audio.content)
            with tempfile.TemporaryDirectory(prefix='asr-pilot-') as directory:
                folder=Path(directory);(folder/'test.wav').write_bytes(wav)
                subprocess.run([str(Path('runtime/whisper/whisper-cli.exe').resolve()),'-m',str(Path('models/ggml-base.bin').resolve()),'-f',str(folder/'test.wav'),'-l','zh','-t','6','-nt','-otxt','-of',str(folder/'out'),'--prompt',report['prompt']],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,creationflags=subprocess.CREATE_NO_WINDOW)
                transcript=(folder/'out.txt').read_text(encoding='utf-8').strip()
            clean=lambda s:re.sub(r'[^\u3400-\u9fff0-9]','',s)
            row={'index':index,'text':baseline['text'],'baseline':baseline['asr']['text'],'candidate':transcript,'baseline_edits':baseline['character_edits'],'candidate_edits':edit_distance(clean(baseline['text']),clean(transcript))}
            report['samples'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
    report['baseline_total_edits']=sum(s['baseline_edits'] for s in report['samples'])
    report['candidate_total_edits']=sum(s['candidate_edits'] for s in report['samples'])
    Path('docs/benchmark-asr-prompt-pilot.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':asyncio.run(main())
