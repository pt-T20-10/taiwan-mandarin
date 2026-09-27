"""Cache official TBCL search pages; record exact term/readings only, not examples."""
import concurrent.futures,html,json,re,sys,unicodedata
from urllib.parse import quote
from setup_learning_assets import ROOT,fetch,dump
sys.path.insert(0,str(ROOT))
from content.a2 import UNITS

def inspect(row):
    term,pinyin,_=row.split('|')
    url='https://bcoct.naer.edu.tw/standsys/querycorevocab.php?q='+quote(term)+'&num=50&page=1&deng_ji=all'
    source=fetch(url,'vocabulary/'+''.join(f'{ord(c):x}-' for c in term)+'.html').decode('utf-8')
    clean=lambda s:html.unescape(re.sub('<[^>]+>','',s)).strip()
    matches=[]
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>',source,re.S):
        cells=[clean(s) for s in re.findall(r'<td[^>]*>(.*?)</td>',tr,re.S)]
        if len(cells)>=6:
            names=[s.strip() for s in cells[1].split('/')];readings=[s.strip() for s in cells[4].split('/')]
            if term in names:
                i=names.index(term)
                matches.append({'headword':cells[1],'pinyin':readings[i] if len(readings)==len(names) else cells[4],'tbcl_level':cells[2]})
    norm=lambda s:re.sub(r'[\s\-’\']','',unicodedata.normalize('NFC',s)).lower()
    return {'hanzi':term,'authored_pinyin':pinyin,'url':url,'matches':matches,'reading_matches':any(norm(m['pinyin'])==norm(pinyin) for m in matches)}

def main():
    words=[row for u in UNITS for row in u[4].splitlines()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:rows=list(pool.map(inspect,words))
    dump(ROOT/'docs/a2-vocabulary-audit.json',{'date':'2026-09-27','scope':'Exact TBCL headword and Pinyin only; meanings, collocations and lesson prose still project draft. No CEFR equivalence implied.','words':rows})
    print('Exact readings',sum(r['reading_matches'] for r in rows),'/',len(rows))
    print(json.dumps([r for r in rows if not r['reading_matches']],ensure_ascii=False,indent=2))
if __name__=='__main__':main()
