"""Explicit, cached preparation of local learning assets. No runtime downloads."""
from pathlib import Path
import concurrent.futures as futures
import hashlib, html, json, re, subprocess

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'data/learning-source';OUT=ROOT/'public/learning'
REV='ec5e17cca76c87587790bcbce5ea0b4d4fb753d6'
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
    for name in ('graphicsZhHant.txt','dictionaryZhHant.txt','graphicsZhHans.txt','dictionaryZhHans.txt','graphicsJa.txt','dictionaryJa.txt'):
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
    dump(OUT/'sources.json',{'animcjk_revision':REV,'grammar_references':len(rows),'pinyin_mode':'visual-only','download_sha256':{p.relative_to(CACHE).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in CACHE.rglob('*') if p.is_file() and p.suffix!='.zip'}})
    print('Prepared character references; Pinyin is visual-only',flush=True)
if __name__=='__main__':main()
