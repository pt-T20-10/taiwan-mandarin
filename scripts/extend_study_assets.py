"""Add licensed cached Hant/Hans character geometry required by study lookup.

Never overwrite existing audited outlines. Do not substitute Japanese shapes.
New assets retain explicit source/verification metadata; no quality certification.
"""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'data/learning-source';OUT=ROOT/'public/learning/characters'
REV='ec5e17cca76c87587790bcbce5ea0b4d4fb753d6'
def records(name):return {r['character']:r for r in map(json.loads,(CACHE/name).read_text(encoding='utf-8').splitlines())}
def main():
 lookup=json.loads((ROOT/'src/core/study-lookup.json').read_text(encoding='utf-8'))
 chars=set(''.join(w['hanzi'] for w in lookup['words']))
 hant,hans=records('graphicsZhHant.txt'),records('graphicsZhHans.txt')
 dictionary={**records('dictionaryZhHans.txt'),**records('dictionaryZhHant.txt')}
 index=json.loads((OUT/'index.json').read_text(encoding='utf-8'));added=[];missing=[]
 for char in sorted(chars):
  if not re.fullmatch('[\u3400-\u9fff]',char) or char in index:continue
  graphics=hant.get(char) or hans.get(char)
  if not graphics:missing.append(char);continue
  d=dictionary.get(char,{})
  row={'character':char,'radical':d.get('radical',''),'decomposition':d.get('decomposition',''),
       'strokes':[{'outline':p,'median':m,'matrix':[1,0,0,-1,0,900]} for p,m in zip(graphics['strokes'],graphics['medians'])],
       'source':f'https://github.com/parsimonhi/animCJK/tree/{REV}','reference':f'https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID={ord(char)}',
       'license':'Arphic Public License; dictionary LGPL-3.0','variant':'Hant-source' if char in hant else 'Hans-source',
       'verification':'Mẫu từ nguồn có giấy phép; chưa đối chiếu MOE/duyệt chuyên môn trong đợt v8.',
       'copyright':'Arphic Technology Co., Ltd. ©1999; AnimCJK FM&SH ©2016–2026',
       'modification':'2026-10-15: JSON/matrix conversion only; source outlines/order retained; APL derivative, no warranty.'}
  (OUT/f'{ord(char)}.json').write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
  index[char]={'path':f'/learning/characters/{ord(char)}.json','radical':row['radical'],'decomposition':row['decomposition']};added.append({'character':char,'variant':row['variant']})
 (OUT/'index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 report=ROOT/'docs/v8-assets.json'
 previous=json.loads(report.read_text(encoding='utf-8'))['added'] if report.exists() else []
 additions={row['character']:row for row in [*previous,*added]}
 report.write_text(json.dumps({'added':list(additions.values()),'missing':missing,'note':'New source geometry, not professionally reviewed.'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print('Added',len(added),'Missing',missing)
if __name__=='__main__':main()
