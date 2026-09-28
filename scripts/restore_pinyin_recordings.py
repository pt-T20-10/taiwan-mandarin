"""Restore only whole-syllable recordings from the reviewed Git checkpoint.
No MOE component audio, model, curriculum or user data is restored.
"""
import hashlib, io, json, subprocess, zipfile
from pathlib import Path
from setup_learning_assets import ROOT, OUT, dump

CHECKPOINT = '9198c81'

def main():
    old = json.loads(subprocess.check_output(['git','show',f'{CHECKPOINT}:public/learning/pinyin/catalog.json'],cwd=ROOT))
    grid = json.loads((OUT/'pinyin/catalog.json').read_text(encoding='utf-8'))
    assert {r['base'] for r in old} == {r['base'] for r in grid}
    recordings = {r['base']:{t:s for t,s in r['tones'].items() if s} for r in old}
    paths = {s['path'].removeprefix('/learning/'):s for tones in recordings.values() for s in tones.values()}
    used = sum(p.stat().st_size for folder in ('models','runtime','data','public','dist','content') for p in (ROOT/folder).rglob('*') if p.is_file())
    assert used + 2*sum(s['bytes'] for s in paths.values()) < 10_000_000_000
    archive = subprocess.check_output(['git','archive','--format=zip',CHECKPOINT,'public/learning/pinyin/syllables'],cwd=ROOT)
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        for path, sample in paths.items():
            assert path.startswith('pinyin/syllables/') and '..' not in path
            data = z.read('public/learning/'+path)
            assert len(data)==sample['bytes'] and hashlib.sha256(data).hexdigest()==sample['sha256']
            target = OUT/path
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(data)
    missing = [f'{r["base"]}:{t}' for r in grid for t in range(1,5) if str(t) not in recordings[r['base']]]
    dump(OUT/'pinyin/recordings.json',dict(recordings=recordings,available=len(paths),missing=missing,checkpoint=CHECKPOINT))
    sources=json.loads((OUT/'sources.json').read_text(encoding='utf-8'))
    sources['pinyin_mode']='table; whole-syllable recordings; four tones'
    sources['pinyin_recordings']=dict(checkpoint=CHECKPOINT,asset='pinyin/recordings.json',source='davinfifield/mp3-chinese-pinyin-sound',license='Unlicense',available=len(paths),missing=len(missing))
    dump(OUT/'sources.json',sources)
    print(f'Restored {len(paths)} recordings, {sum(s["bytes"] for s in paths.values())} bytes; {len(missing)} missing combinations.')

if __name__=='__main__': main()
