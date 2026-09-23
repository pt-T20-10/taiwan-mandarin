"""Explicit online setup. All inference remains local. Downloads resume safely."""
import hashlib
import json
import shutil
import subprocess
import sys
import time
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
REVISIONS={'Qwen/Qwen3-1.7B-GGUF':'90862c4b9d2787eaed51d12237eafdfe7c5f6077','Qwen/Qwen3-4B-GGUF':'bc640142c66e1fdd12af0bd68f40445458f3869b','ggerganov/whisper.cpp':'5359861c739e955e79d9a303bcbc70fb988958b1'}

def get_json(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.load(r)

def download(url, path, expected=None, size=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and (not size or path.stat().st_size == size):
        if not expected or hashlib.file_digest(path.open('rb'), 'sha256').hexdigest() == expected:
            print('Already verified:', path.name, flush=True)
            return
    part = path.with_suffix(path.suffix + '.part')
    additional=max(0,size-(part.stat().st_size if part.exists() else 0)) if size else 0
    managed=sum(f.stat().st_size for folder in ('models','runtime','data','dist','content') for f in (ROOT/folder).rglob('*') if f.is_file())
    if size and managed+additional>10_000_000_000:
        raise RuntimeError('Download would exceed the 10 GB managed budget. Remove unused project download caches/models first.')
    if size and shutil.disk_usage(ROOT).free<additional+500_000_000:
        raise RuntimeError('Not enough free disk space for safe download')
    for attempt in range(4):
        try:
            offset = part.stat().st_size if part.exists() else 0
            req = urllib.request.Request(url, headers={'Range': f'bytes={offset}-'} if offset else {})
            with urllib.request.urlopen(req, timeout=120) as response:
                append = offset > 0 and response.status == 206
                with part.open('ab' if append else 'wb') as output:
                    shutil.copyfileobj(response, output, 1024 * 1024)
            if size and part.stat().st_size != size:
                raise ValueError('Size mismatch')
            digest = hashlib.file_digest(part.open('rb'), 'sha256').hexdigest()
            if expected and digest != expected:
                part.unlink()
                raise ValueError('SHA-256 mismatch')
            part.replace(path)
            print(json.dumps({'file': path.name, 'bytes': path.stat().st_size, 'sha256': digest}), flush=True)
            return
        except Exception as e:
            print(f'Attempt {attempt+1}: {e}', flush=True)
            if attempt == 3:
                raise
            time.sleep(2)

def runtime(repo, tag, filename, folder):
    meta = get_json(f'https://api.github.com/repos/ggml-org/{repo}/releases/tags/{tag}')
    asset = next(a for a in meta['assets'] if a['name'] == filename)
    dest = ROOT / 'runtime' / folder
    archive = ROOT / 'runtime/downloads' / filename
    digest = asset.get('digest', '') or ''
    lock_path=ROOT/'docs/MODELS.json'
    locks={entry['name']:entry['sha256'] for entry in json.loads(lock_path.read_text(encoding='utf-8'))} if lock_path.exists() else {}
    expected=locks.get(filename,digest.removeprefix('sha256:') or None)
    download(asset['browser_download_url'], archive, expected, asset['size'])
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive) as z:
        for member in z.infolist():
            if member.is_dir():
                continue
            # Binaries are flattened intentionally; never trust archive paths.
            target = dest / Path(member.filename).name
            with z.open(member) as src, target.open('wb') as out:
                shutil.copyfileobj(src, out)
    return {'repository': repo, 'tag': tag, 'asset': asset['name'], 'sha256': hashlib.file_digest(archive.open('rb'), 'sha256').hexdigest()}

def main():
    # CPU baseline first: avoids a driver/toolkit change and leaves VRAM free.
    records = []
    records.append(runtime('llama.cpp', 'b11120', 'llama-b11120-bin-win-cpu-x64.zip', 'llama'))
    records.append(runtime('whisper.cpp', 'v1.9.2', 'whisper-bin-x64.zip', 'whisper'))
    files = get_json('https://huggingface.co/api/models/ggerganov/whisper.cpp/tree/'+REVISIONS['ggerganov/whisper.cpp'])
    base = next(f for f in files if f['path'] == 'ggml-base.bin')
    download('https://huggingface.co/ggerganov/whisper.cpp/resolve/'+REVISIONS['ggerganov/whisper.cpp']+'/ggml-base.bin', ROOT / 'models/ggml-base.bin', base['lfs']['oid'], base['size'])
    qfiles = get_json('https://huggingface.co/api/models/Qwen/Qwen3-1.7B-GGUF/tree/'+REVISIONS['Qwen/Qwen3-1.7B-GGUF'])
    q = next(f for f in qfiles if f['path'] == 'Qwen3-1.7B-Q8_0.gguf')
    source = ROOT / 'models/Qwen3-1.7B-Q8_0.gguf'
    dest = ROOT / 'models/Qwen3-1.7B-Q4_K_M.gguf'
    download('https://huggingface.co/Qwen/Qwen3-1.7B-GGUF/resolve/'+REVISIONS['Qwen/Qwen3-1.7B-GGUF']+'/Qwen3-1.7B-Q8_0.gguf', source, q['lfs']['oid'], q['size'])
    if not dest.exists():
        subprocess.run([str(ROOT / 'runtime/llama/llama-quantize.exe'), '--allow-requantize', str(source), str(dest), 'Q4_K_M', '6'], check=True, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
    records += [{'model': 'Qwen3-1.7B-Q4_K_M', 'source': 'official Qwen Q8_0', 'source_sha256': q['lfs']['oid'], 'sha256': hashlib.file_digest(dest.open('rb'), 'sha256').hexdigest(), 'bytes': dest.stat().st_size, 'note': 'Requantized from Q8_0; quality needs evaluation'}, {'model':'Whisper base multilingual','sha256':base['lfs']['oid'],'bytes':base['size']}]
    (ROOT / 'models/installed.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
    print('Setup complete. Q8 source retained for reproducibility; under 10 GB budget.', flush=True)

if __name__ == '__main__':
    main()
