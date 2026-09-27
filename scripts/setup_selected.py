"""Reproduce the selected 4B/CUDA candidate; the CPU baseline stays available."""
import json
from setup_models import ROOT, REVISIONS, download, get_json, runtime

def main():
    records=[]
    records.append(runtime('llama.cpp','b11120','llama-b11120-bin-win-cpu-x64.zip','llama'))
    records.append(runtime('llama.cpp','b11120','llama-b11120-bin-win-cuda-12.4-x64.zip','llama-cuda'))
    records.append(runtime('llama.cpp','b11120','cudart-llama-bin-win-cuda-12.4-x64.zip','llama-cuda'))
    records.append(runtime('whisper.cpp','v1.9.2','whisper-bin-x64.zip','whisper'))
    for repo,filename in [('Qwen/Qwen3-4B-GGUF','Qwen3-4B-Q4_K_M.gguf'),('ggerganov/whisper.cpp','ggml-base.bin'),('ggerganov/whisper.cpp','ggml-small.bin')]:
        revision=REVISIONS[repo]
        file=next(f for f in get_json(f'https://huggingface.co/api/models/{repo}/tree/{revision}') if f['path']==filename)
        download(f'https://huggingface.co/{repo}/resolve/{revision}/{filename}',ROOT/'models'/filename,file['lfs']['oid'],file['size'])
        records.append({'repository':repo,'file':filename,'bytes':file['size'],'sha256':file['lfs']['oid']})
    (ROOT/'models/selected-installed.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
    if not (ROOT/'models/active.json').exists():
        (ROOT/'models/active.json').write_text(json.dumps({'model':'Qwen3-4B-Q4_K_M.gguf','runtime':'cpu','asr_model':'ggml-small.bin'}),encoding='utf-8')
    print('Selected candidate installed. If CUDA fails, select CPU in the application. Language quality remains experimental.')

if __name__=='__main__':main()
