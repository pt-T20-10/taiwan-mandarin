// Original teaching geometry. Order/direction compared with MOE on 2026-09-23.
// These are not copied font outlines or MOE animation assets.
export type Point = [number, number];
export type Stroke = Point[];
export const strokeModels: Record<string, Stroke[]> = {
  '一': [[[45,150],[255,150]]],
  '二': [[[65,100],[235,100]],[[45,210],[255,210]]],
  '三': [[[65,75],[235,75]],[[85,145],[215,145]],[[45,225],[255,225]]],
  '十': [[[50,140],[250,140]],[[150,45],[150,255]]],
  '人': [[[145,50],[125,130],[90,195],[40,245]],[[130,130],[180,200],[255,245]]],
  '大': [[[60,130],[240,130]],[[145,45],[140,135],[105,205],[40,255]],[[145,140],[190,210],[255,255]]],
  '小': [[[150,40],[150,245],[115,220]],[[90,120],[50,195]],[[210,120],[250,195]]],
  '日': [[[85,60],[85,250]],[[85,65],[215,65],[215,250],[185,225]],[[90,150],[205,150]],[[90,235],[205,235]]],
  '月': [[[100,45],[100,135],[85,205],[55,255]],[[105,50],[220,50],[220,255],[180,225]],[[105,115],[210,115]],[[100,175],[210,175]]],
  '口': [[[65,75],[80,235]],[[70,80],[235,80],[215,235]],[[85,225],[220,225]]],
  '上': [[[145,45],[145,230]],[[150,130],[225,130]],[[40,240],[260,240]]],
  '下': [[[40,65],[260,65]],[[145,70],[145,255]],[[165,135],[230,175]]],
};
export const strokeSource = (character:string) => `https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=${character.codePointAt(0)}`;
const distance = (a:Point,b:Point) => Math.hypot(a[0]-b[0],a[1]-b[1]);
const length = (p:Stroke) => p.slice(1).reduce((sum,point,i)=>sum+distance(p[i],point),0);

function resample(path:Stroke, count=32):Stroke {
  const total=length(path), output:Stroke=[path[0]];
  let segment=1, covered=0;
  for(let i=1;i<count;i++){
    const target=total*i/(count-1);
    while(segment<path.length-1 && covered+distance(path[segment-1],path[segment])<target){
      covered+=distance(path[segment-1],path[segment]);segment++;
    }
    const a=path[segment-1],b=path[segment],size=distance(a,b),t=size?(target-covered)/size:0;
    output.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);
  }
  return output;
}

/** Direction-sensitive discrete Frechet comparison handles bends, not just axes. */
export function matchesStroke(input:Stroke, expected:Stroke):boolean {
  if(input.length<2||input.some(p=>p.some(v=>!Number.isFinite(v))))return false;
  const drawnLength=length(input),targetLength=length(expected);
  if(drawnLength<targetLength*.6||drawnLength>targetLength*1.8)return false;
  if(distance(input[0],expected[0])>28||distance(input.at(-1)!,expected.at(-1)!)>28)return false;
  const a=resample(input),b=resample(expected),cost:number[][]=[];
  for(let i=0;i<a.length;i++){
    cost[i]=[];
    for(let j=0;j<b.length;j++){
      const previous=i===0&&j===0?0:Math.min(i?cost[i-1][j]:Infinity,j?cost[i][j-1]:Infinity,i&&j?cost[i-1][j-1]:Infinity);
      cost[i][j]=Math.max(distance(a[i],b[j]),previous);
    }
  }
  return cost.at(-1)!.at(-1)!<=28;
}
