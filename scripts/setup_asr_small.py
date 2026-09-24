"""Download one multilingual ASR candidate within the shared 10 GB budget.

Does not change the selected model; benchmark it before selection.
"""
import json
import urllib.request
from setup_models import ROOT,REVISIONS,download

def main():
    revision=REVISIONS['ggerganov/whisper.cpp']
    with urllib.request.urlopen(f'https://huggingface.co/api/models/ggerganov/whisper.cpp/tree/{revision}',timeout=12) as response:
        entry=next(f for f in json.load(response) if f['path']=='ggml-small.bin')
    record={'name':entry['path'],'bytes':entry['size'],'sha256':entry['lfs']['oid'],'repository':'ggerganov/whisper.cpp','revision':revision}
    print(json.dumps(record),flush=True)
    download(f'https://huggingface.co/ggerganov/whisper.cpp/resolve/{revision}/ggml-small.bin',ROOT/'models/ggml-small.bin',record['sha256'],record['bytes'])
    path=ROOT/'docs/MODELS.json';records=json.loads(path.read_text(encoding='utf-8'))
    records=[r for r in records if r['name']!=record['name']]+[record]
    path.write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')

if __name__=='__main__':main()
