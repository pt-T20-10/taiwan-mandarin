"""Package licensed outlines, author missing compositions and audit MOE order.

MOE paths are read only for comparison, never distributed. AnimCJK geometry
retains APL attribution, including reordered/composed derivatives.
"""
from pathlib import Path
import json,re,xml.etree.ElementTree as ET,math
from setup_learning_assets import ROOT,CACHE,OUT,dump,REV
def records(name):return {r['character']:r for r in map(json.loads,(CACHE/name).read_text(encoding='utf-8').splitlines())}
def valid_ids(value):
    """Validate prefix IDS arity, including nested two/three-part operators."""
    if not value:return True
    pending=1
    for char in value:
        if pending==0:return False
        pending-=1
        if char in '⿲⿳':pending+=3
        elif char in '⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻':pending+=2
    return pending==0

def main():
    hant=records('graphicsZhHant.txt');hans=records('graphicsZhHans.txt');ja=records('graphicsJa.txt');dictionary={**records('dictionaryJa.txt'),**records('dictionaryZhHans.txt'),**records('dictionaryZhHant.txt')}
    def geometry(c):
        g=ja[c] if c=='邀' else hant.get(c) or hans.get(c) or ja.get(c)
        if not g:raise ValueError(c)
        return [{'outline':p,'median':m,'matrix':[1,0,0,-1,0,900]} for p,m in zip(g['strokes'],g['medians'])]
    def component(c,box):
        strokes=geometry(c);points=[p for s in strokes for p in s['median']];xs=[p[0] for p in points];ys=[900-p[1] for p in points]
        x,y,w,h=box;sx=w/(max(xs)-min(xs));sy=h/(max(ys)-min(ys));tx=x-min(xs)*sx;ty=y-min(ys)*sy
        for s in strokes:s['matrix']=[sx,0,0,-sy,tx,ty+900*sy]
        return strokes
    composed={
      '廁':[('广',(90,80,800,790)),('貝',(260,280,330,600)),('刂',(700,260,180,630))],
      '廚':[('广',(90,80,800,790)),('壴',(260,260,340,620)),('寸',(640,260,250,620))],
      '灣':[('氵',(80,120,130,750)),('糸',(310,120,130,390)),('言',(500,70,160,440)),('糸',(730,120,140,390)),('弓',(340,590,510,330))],
      '碼':[('石',(70,260,310,490)),('馬',(470,100,440,780))],
      '嚨':[('口',(80,320,210,330)),('龍',(360,90,570,800))],
      '圾':[('土',(70,240,240,570)),('及',(370,100,560,780))],
    }
    extra={
      '吃':('口','⿰口乞'),'址':('土','⿰土止'),'宿':('宀','⿱宀佰'),'寄':('宀','⿱宀奇'),'局':('尸','⿸尸⿹𠃌口'),
      '廁':('广','⿸广則'),'廚':('广','⿸广尌'),'悠':('心','⿱攸心'),'戶':('戶',''),'捷':('手','⿰扌疌'),'授':('手','⿰扌受'),
      '浴':('水','⿰氵谷'),'灣':('水','⿰氵⿱䜌弓'),'研':('石','⿰石开'),'碼':('石','⿰石馬'),'究':('穴','⿱穴九'),
      '窗':('穴','⿱穴囱'),'素':('糸','⿱龶糸'),'臺':('至','⿱吉⿱冖至'),'舍':('舌','⿱亼古'),'袋':('衣','⿱代衣'),'踏':('足','⿰𧾷沓'),'辣':('辛','⿰辛束')}
    pack=json.loads((ROOT/'content/foundation.pack.json').read_text(encoding='utf-8'))['content'];chars=sorted(set(''.join(w['hanzi'] for u in pack['units'] for w in u['words'])))
    extra['嚨']=('口','⿰口龍')
    extra['衣']=('衣','⿱亠𧘇')
    extra.update({'嚴':('口','⿱吅⿸厂敢'),'擾':('手','⿰扌憂'),'櫃':('木','⿰木匱'),'簽':('竹','⿱⺮僉'),'絡':('糸','⿰糹各'),'覽':('見','⿱監見'),'訊':('言','⿰言卂'),'診':('言','⿰言㐱')})
    report=[];index={}
    previous={r['character']:r for r in json.loads((ROOT/'docs/character-audit.json').read_text(encoding='utf-8'))}
    def actual(stroke):
        a,b,c,d,e,f=stroke['matrix'];return [(a*x+c*y+e,b*x+d*y+f) for x,y in stroke['median']]
    def norm(strokes):
        points=[p for s in strokes for p in s];xs=[p[0] for p in points];ys=[p[1] for p in points];return [[((x-min(xs))/(max(xs)-min(xs) or 1),(y-min(ys))/(max(ys)-min(ys) or 1)) for x,y in s] for s in strokes]
    def features(p):return [p[0],p[-1],(sum(x for x,y in p)/len(p),sum(y for x,y in p)/len(p))]
    for char in chars:
        target=OUT/f'characters/{ord(char)}.json'
        if target.exists() and char in previous and '2026-09-25' in target.read_text(encoding='utf-8'):
            row=json.loads(target.read_text(encoding='utf-8'))
            index[char]={'path':f'/learning/characters/{ord(char)}.json','radical':row['radical'],'decomposition':row['decomposition']}
            report.append(previous[char]);continue
        source=(CACHE/f'moe/{ord(char)}.html').read_text(encoding='utf-8');match=re.search(r'xml\['+str(ord(char))+r'\]=("(?:\\.|[^"\\])*")',source)
        root=ET.fromstring(json.loads(match[1]));reference=[[(float(p.attrib['x']),float(p.attrib['y'])) for p in stroke.find('Track')] for stroke in root.findall('Stroke')]
        strokes=[s for c,box in composed[char] for s in component(c,box)] if char in composed else geometry(char)
        if char=='覽':
            # Japanese 臣 has seven strokes; replace that component with six-stroke
            # Chinese 臣. Keep the other licensed strokes in the same coordinates.
            strokes=component('臣',(125,90,340,340))+strokes[7:]
        # Shape matching proposes a stroke permutation. Audit records retain
        # scores; this is a structural comparison, not a human calligraphy review.
        expected=norm(reference);observed=norm([actual(s) for s in strokes]);order=[];scores=[];available=set(range(len(strokes)))
        if len(expected)==len(observed):
            for p in expected:
                cost=lambda j:sum(math.dist(a,b) for a,b in zip(features(p),features(observed[j])))
                j=min(available,key=cost);scores.append(round(cost(j),3));order.append(j);available.remove(j)
            # Explicitly inspected exceptions. Greedy proximity can confuse two
            # nearby horizontal strokes; it must never silently reorder assets.
            overrides={'房':[0,3,1,2,4,5,6,7], '關':list(range(16))+[17,18,16], '灣':[0,1,2]+list(range(9,16))+list(range(3,9))+list(range(16,25)),
                       # Explicit median/order inspection against the MOE reference,
                       # 2026-09-27. 邀 retains source order: greedy misassigned 辶.
                       '嚴':list(range(12))+[15,12,13,14,16,17,18,19],
                       '惜':[0,2,1]+list(range(3,11)),
                       '感':list(range(6))+[9,10,11,12,6,7,8],
                       '聯':[0,1,5,2,3,4]+list(range(6,17)),
                       '訊':list(range(7))+[9,7,8]}
            order=overrides.get(char,list(range(len(strokes))))
            scores=[round(sum(math.dist(a,b) for a,b in zip(features(expected[i]),features(observed[j]))),3) for i,j in enumerate(order)]
            strokes=[strokes[j] for j in order]
        d=dictionary.get(char,{});radical,decomposition=extra.get(char,(d.get('radical',''),d.get('decomposition','')))
        if char=='常':decomposition='⿱龸吊' # Upstream ternary operator had only two operands.
        assert valid_ids(decomposition),(char,decomposition)
        moe_radical=re.search(r'<meta name="Description" content="[^,]+,\d+ 畫,([^部]+)部',source)[1]
        if char in extra:assert radical==moe_radical,(char,radical,moe_radical)
        radical=moe_radical
        row={'character':char,'radical':radical,'decomposition':decomposition,'strokes':strokes,'source':f'https://github.com/parsimonhi/animCJK/tree/{REV}', 'reference':f'https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID={ord(char)}','license':'Arphic Public License; dictionary LGPL-3.0','variant':'Taiwan' if char in hant else 'project-adapted','verification':'Đã so số nét và đường đi với MOE bằng công cụ; chưa duyệt dáng chữ','expected_count':len(reference)}
        row['copyright']='Arphic Technology Co., Ltd. ©1999; AnimCJK FM&SH ©2016–2026'
        row['modification']='2026-09-27: converted to JSON/matrix coordinates; '+('composed from '+', '.join(c for c,_ in composed[char]) if char in composed else 'original outlines retained from '+('graphicsZhHant' if char in hant else 'graphicsZhHans' if char in hans else 'graphicsJa'))+('; stroke order override' if char in ('房','關','灣','嚴','惜','感','聯','訊') else '')+'. Derivative outlines remain under APL; no warranty.'
        row['structure_source']='project visual IDS; radical checked against MOE' if char in extra else f'AnimCJK dictionary at {REV}'
        if char=='研':row['structure_source']+='; https://dict.variants.moe.edu.tw/dictView.jsp?ID=30267 (right component 开, four strokes)'
        if char=='常':row['structure_source']+='; project corrected IDS arity to ⿱龸吊'
        row['structure_verification']='Cấu tạo trực quan để nhận hình, chưa thẩm định chuyên môn; không phải giải thích từ nguyên.'
        if char=='覽':row['modification']+=' Replaced first seven strokes (Japanese 臣) with six-stroke Chinese 臣.'
        if char=='邀':row['modification']='2026-09-27: graphicsJa outlines retained (four-stroke 辶), APL derivative; no warranty.'
        dump(OUT/f'characters/{ord(char)}.json',row);index[char]={'path':f'/learning/characters/{ord(char)}.json','radical':radical,'decomposition':decomposition}
        report.append({'character':char,'model_count':len(strokes),'moe_count':len(reference),'order':order,'max_cost':max(scores,default=99),'variant':row['variant'],'moe_radical':moe_radical,'structure_source':row['structure_source']})
    dump(OUT/'characters/index.json',index);dump(ROOT/'docs/character-audit.json',report)
    print('Characters:',len(index),'Count mismatches:',[r for r in report if r['model_count']!=r['moe_count']])
    print('High comparison costs:',[(r['character'],r['max_cost']) for r in report if r['max_cost']>.9])
if __name__=='__main__':main()
