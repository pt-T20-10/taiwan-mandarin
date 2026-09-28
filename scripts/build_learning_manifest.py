"""Regenerate hashes after rebuilding learning assets; never downloads anything."""
import hashlib
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public/learning'

def build():
    files=[]
    for path in sorted(ASSETS.rglob('*')):
        if not path.is_file() or path.name=='manifest.json':continue
        data=path.read_bytes()
        files.append({'path':path.relative_to(ASSETS).as_posix(),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
    manifest={'schema':1,'date':'2026-09-28','source_notes':'See ATTRIBUTION.md and sources.json; per-file licenses apply.',
              'bytes':sum(f['bytes'] for f in files),'files':files}
    (ASSETS/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Learning assets: {len(files)} files, {manifest["bytes"]} bytes')

if __name__=='__main__':build()
