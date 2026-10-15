"""Compile authored lookup spans offline. No runtime segmentation or model calls."""
import ast,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def build():
 pack=json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content']
 words={w['hanzi']:{k:w[k] for k in ('hanzi','pinyin','vi')} for u in pack['units'] for w in u['words']}
 for line in (ROOT/'content/lookup_extra.tsv').read_text(encoding='utf-8').splitlines():
  if line and not line.startswith('#'):
   h,p,v=line.split('|');words[h]={'hanzi':h,'pinyin':p,'vi':v}
 texts=set();context_pinyin={}
 def collect(value):
  if isinstance(value,dict):
   if all(k in value for k in ('hanzi','pinyin','vi')):context_pinyin[value['hanzi']]=value['pinyin']
   for v in value.values():collect(v)
  elif isinstance(value,list):
   for v in value:collect(v)
  elif isinstance(value,str) and re.search('[\u3400-\u9fff]',value):texts.add(value)
 collect(pack['units'])
 source=(ROOT/'src/core/verbs.ts').read_text(encoding='utf-8')
 rows=ast.literal_eval(re.search(r'const rows=([\s\S]*?\n\]);',source)[1])
 for row in rows:
  _,h,p,v,*_=row;words[h]={'hanzi':h,'pinyin':p,'vi':v}
 basic=ast.literal_eval(re.search(r'export const basicVerbs=(\[[\s\S]*?\])\.map',source)[1])
 for h,p,v,_ in basic:words[h]={'hanzi':h,'pinyin':p,'vi':v}
 for name in ['verbs.ts','classifiers.ts','verbLessons.ts','verbPractical.ts','classifierGuide.ts']:
  source=(ROOT/'src/core'/name).read_text(encoding='utf-8')
  texts.update(re.findall(r"'([^'\n]*[\u3400-\u9fff][^'\n]*)'",source))
 keys=sorted(words,key=len,reverse=True);lookup={};missing={}
 for sentence in sorted(texts):
  spans=[];i=0
  while i<len(sentence):
   if not re.match('[\u3400-\u9fff]',sentence[i]):i+=1;continue
   word=next((w for w in keys if sentence.startswith(w,i)),None)
   if word:
    entry=words[word]
    if word=='得' and 'děi' in context_pinyin.get(sentence,''):entry={**entry,'pinyin':'děi','vi':'phải; cần phải'}
    spans.append({'start':i,'end':i+len(word),'word':entry});i+=len(word)
   else:missing[sentence[i]]=missing.get(sentence[i],0)+1;i+=1
  if spans:lookup[sentence]=spans
 output={'version':8,'words':list(words.values()),'sentences':lookup}
 (ROOT/'src/core/study-lookup.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 (ROOT/'data/lookup-missing.json').write_text(json.dumps(sorted(missing.items(),key=lambda r:-r[1]),ensure_ascii=False,indent=2),encoding='utf-8')
 print('Lookup:',len(words),'words;',len(lookup),'texts;',len(missing),'uncovered characters')

if __name__=='__main__':build()
