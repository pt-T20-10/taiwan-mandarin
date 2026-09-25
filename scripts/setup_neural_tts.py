"""Explicit installation of the optional offline comparison voice. No global changes."""
import argparse,hashlib,json,shutil,subprocess,tarfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BUDGET=10_000_000_000
ASSETS=[
 ('https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.13.8/sherpa-onnx-v1.13.8-win-x64-shared-MD-Release.tar.bz2',20494724,'3e971a04b2e0ba4dfa53d381a006367ce8c9f5f09b4ae00043e9845c2baded22','runtime/sherpa-tts'),
 ('https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_1.tar.bz2',364816464,'a3f4c73d043860e3fd2e5b06f36795eb81de0fc8e8de6df703245edddd87dbad','models/kokoro-v1.1-zh'),
]
def used():return sum(p.stat().st_size for folder in ('models','runtime','data','public','dist','content') for p in (ROOT/folder).rglob('*') if p.is_file())
def sha(path):
    with path.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--download',action='store_true');args=parser.parse_args()
    if not args.download:raise SystemExit('Use --download to explicitly install Kokoro v1.1 Chinese comparison voice.')
    records=[]
    for url,size,digest,target in ASSETS:
        archive=ROOT/'runtime/downloads'/url.rsplit('/',1)[1];archive.parent.mkdir(parents=True,exist_ok=True)
        if not archive.exists() or sha(archive)!=digest:
            if used()+size+50_000_000>BUDGET or shutil.disk_usage(ROOT).free<size+100_000_000:raise RuntimeError('Insufficient 10 GB budget or disk space')
            temp=archive.with_suffix(archive.suffix+'.part')
            subprocess.run(['curl.exe','--fail','--location','--silent','--show-error','--retry','2','--output',str(temp),url],check=True)
            assert temp.stat().st_size==size and sha(temp)==digest,'Download checksum mismatch'
            temp.replace(archive)
        destination=(ROOT/target).resolve();destination.mkdir(parents=True,exist_ok=True)
        with tarfile.open(archive,'r:bz2') as tar:
            members=[]
            for member in tar.getmembers():
                parts=Path(member.name).parts[1:]
                if not member.isfile() or not parts:continue
                if target.startswith('runtime/') and not (member.name.endswith('.dll') or Path(member.name).name=='sherpa-onnx-offline-tts.exe' or 'license' in member.name.lower()):continue
                path=(destination/Path(*parts)).resolve()
                if not path.is_relative_to(destination):raise ValueError('Unsafe archive path')
                members.append((member,path))
            extra=sum(max(0,m.size-(p.stat().st_size if p.exists() else 0)) for m,p in members)
            if used()+extra+50_000_000>BUDGET or shutil.disk_usage(ROOT).free<extra+50_000_000:raise RuntimeError('Extracted assets exceed 10 GB budget or free disk space')
            for member,path in members:
                path.parent.mkdir(parents=True,exist_ok=True)
                with tar.extractfile(member) as source,path.open('wb') as output:shutil.copyfileobj(source,output)
        records.append({'url':url,'archive_sha256':digest,'files':[{'path':p.relative_to(ROOT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)} for _,p in members]})
        print('Installed',target,'bytes',sum(p.stat().st_size for _,p in members),flush=True)
    (ROOT/'models/kokoro-installed.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
    print('Managed bytes:',used(),flush=True)
if __name__=='__main__':main()
