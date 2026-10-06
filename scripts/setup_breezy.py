"""Explicit optional download into a separate runtime; never alters the app venv."""
import hashlib,json,sys,urllib.request,zipfile,io
from pathlib import Path
from setup_models import ROOT,download

REV='d592c9d3e8927a0f53f68616387060dcd32a05ea'
urllib.request.install_opener(urllib.request.build_opener(urllib.request.ProxyHandler({})))

def source_archive(repo,revision,target,expected):
    with urllib.request.urlopen(f'https://codeload.github.com/{repo}/zip/{revision}',timeout=120) as r:raw=r.read()
    if hashlib.sha256(raw).hexdigest()!=expected:raise ValueError('Source archive SHA-256 mismatch')
    target.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        for entry in z.infolist():
            relative=Path(*Path(entry.filename).parts[1:]);dest=(target/relative).resolve()
            if not dest.is_relative_to(target.resolve()):raise ValueError('Archive path escapes runtime')
            if entry.is_dir():dest.mkdir(parents=True,exist_ok=True)
            else:dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(z.read(entry))
    return hashlib.sha256(raw).hexdigest()

def main():
    lock=json.loads((ROOT/'docs/BREEZY-MODELS.json').read_text(encoding='utf-8'))
    source_archive('mtkresearch/BreezyVoice',lock['source_revision'],ROOT/'runtime/breezy/source',lock['source_archive_sha256'])
    revision=lock['model_revision']
    for row in lock['files']:
        target=ROOT/'models/breezyvoice'/row['file']
        download(f'https://huggingface.co/MediaTek-Research/BreezyVoice/resolve/{revision}/'+row['file'],target,row['sha256'],row['bytes'])
    (ROOT/'data').mkdir(exist_ok=True)
    (ROOT/'data/breezy-install.json').write_text(json.dumps(lock,indent=2),encoding='utf-8')
    print('Model downloaded. Runtime dependencies installed separately; no voice setting changed.',flush=True)

if __name__=='__main__':main()
