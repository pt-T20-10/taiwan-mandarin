"""Explicit, cached preparation of local learning assets. No runtime downloads."""
from pathlib import Path
import concurrent.futures as futures
import hashlib, html, io, json, re, subprocess, urllib.request, zipfile

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'data/learning-source';OUT=ROOT/'public/learning'
REV='ec5e17cca76c87587790bcbce5ea0b4d4fb753d6'
PINREV='aa25ecce7b7fb02757b2c2b8e3c01aa975812edc'
def fetch(url,name):
    p=CACHE/name;p.parent.mkdir(parents=True,exist_ok=True)
    if not p.exists():
        temp=p.with_suffix(p.suffix+'.part')
        subprocess.run(['curl.exe','--fail','--silent','--show-error','--location','--retry','2','--max-time','90','--output',str(temp),url],check=True)
        temp.replace(p)
    return p.read_bytes()
def dump(path,data):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def main():
    CACHE.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
    used=sum(p.stat().st_size for folder in ('models','runtime','data','public','dist','content') for p in (ROOT/folder).rglob('*') if p.is_file())
    if used+300_000_000>10_000_000_000:raise RuntimeError('Không đủ ngân sách 10 GB cho tài sản học')
    # Download pinned text data once instead of hundreds of individual SVGs.
    for name in ('graphicsZhHant.txt','dictionaryZhHant.txt','graphicsZhHans.txt','dictionaryZhHans.txt'):
        fetch(f'https://raw.githubusercontent.com/parsimonhi/animCJK/{REV}/{name}',name)
    for name in ('COPYING.txt','APL/english/ARPHICPL.TXT','LGPL.txt','Unihan/License-Unihan.txt'):
        data=fetch(f'https://raw.githubusercontent.com/parsimonhi/animCJK/{REV}/licenses/{name}','licenses/'+name)
        p=OUT/'licenses/animcjk'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
    (OUT/'licenses/animcjk/GPL-3.0.txt').write_bytes(fetch('https://www.gnu.org/licenses/gpl-3.0.txt','licenses/GPL-3.0.txt'))
    pack=json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
    chars=sorted(set(''.join(w['hanzi'] for u in pack['units'] for w in u['words'])))
    def reference(c):
        fetch(f'https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID={ord(c)}',f'moe/{ord(c)}.html')
    with futures.ThreadPoolExecutor(max_workers=6) as pool:
        for i,_ in enumerate(pool.map(reference,chars),1):
            if i%30==0:print(f'MOE references {i}/{len(chars)}',flush=True)
    # Only grammar identifiers, labels and levels; no copied example sentences.
    rows=[]
    for page in range(1,11):
        url=f'https://bcoct.naer.edu.tw/standsys/querygrammars.php?q=&num=50&page={page}&deng_ji=all'
        s=fetch(url,f'tbcl/{page}.html').decode('utf-8')
        clean=lambda value:html.unescape(re.sub('<[^>]+>','',value)).strip()
        for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',s,re.S|re.I):
            cells=re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S|re.I)
            if len(cells)==5 and clean(cells[0]).isdigit():
                n=int(clean(cells[0]));rows.append({'id':f'tbcl.{n:03d}','title':clean(cells[1]),'tbcl_level':clean(cells[3]),'source':url,'status':'planned','batch':(n-1)//24+1})
    assert len(rows)==496 and len({r['id'] for r in rows})==496,len(rows)
    dump(ROOT/'content/grammar-roadmap.json',rows)
    print('TBCL catalog 496 references',flush=True)
    url='https://language.moe.gov.tw/001/Upload/files/SITE_CONTENT/M0001/deploy/bopomofo_materials_20170213.zip'
    z=zipfile.ZipFile(io.BytesIO(fetch(url,'bopomofo.zip')))
    for name in z.namelist():
        if re.fullmatch(r'audio/F\d+\.WAV',name):
            p=OUT/'pinyin/moe'/Path(name).name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))
    (OUT/'licenses/moe-bopomofo.txt').write_bytes(z.read('license.txt'))
    z=zipfile.ZipFile(io.BytesIO(fetch(f'https://codeload.github.com/davinfifield/mp3-chinese-pinyin-sound/zip/{PINREV}','pinyin.zip')))
    audio={}
    for name in z.namelist():
        if '/mp3/' in name and name.endswith('.mp3'):
            basename=Path(name).name;p=OUT/'pinyin/syllables'/basename;p.parent.mkdir(parents=True,exist_ok=True);data=z.read(name);p.write_bytes(data)
            audio[basename[:-4]]={'path':'/learning/pinyin/syllables/'+basename,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'source':'davinfifield/mp3-chinese-pinyin-sound','accent':'Quan thoại phổ thông; chưa xác minh vùng giọng','verification':'file-checked; chưa nghe duyệt'}
        if name.endswith('/LICENSE'):(OUT/'licenses/pinyin-unlicense.txt').write_bytes(z.read(name))
    dump(OUT/'pinyin/audio.json',audio)
    dump(OUT/'sources.json',{'animcjk_revision':REV,'pinyin_revision':PINREV,'moe_audio_source':url,'syllable_files':len(audio),'grammar_references':len(rows),'download_sha256':{p.relative_to(CACHE).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in CACHE.rglob('*') if p.is_file()}})
    print(f'Prepared {len(audio)} syllable files, 37 MOE components',flush=True)
if __name__=='__main__':main()
