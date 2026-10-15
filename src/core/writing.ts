import {matchesStroke,type Point,type Stroke} from './strokes';
export type StrokeAsset={character:string;strokes:{outline:string;median:number[][];matrix:number[]}[]};
export function writingPaths(asset:StrokeAsset):Stroke[]{return asset.strokes.map(s=>{const [a,b,c,d,e,f]=s.matrix;return s.median.map(([x,y]):Point=>[(a*x+c*y+e)*300/1024,(b*x+d*y+f)*300/1024]);});}
export function strokeFeedback(input:Stroke,expected:Stroke):string{
 if(input.length<2)return 'Hãy kéo bút theo nét, không chỉ chấm một điểm.';
 const dist=(a:Point,b:Point)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 const size=Math.max(...expected.map(p=>p[0]))-Math.min(...expected.map(p=>p[0]))+Math.max(...expected.map(p=>p[1]))-Math.min(...expected.map(p=>p[1]));
 const tolerance=Math.max(10,Math.min(24,size*.16));
 if(dist(input[0],expected.at(-1)!)<dist(input[0],expected[0])&&dist(input.at(-1)!,expected[0])<dist(input.at(-1)!,expected.at(-1)!)&&dist(input[0],expected.at(-1)!)<tolerance)return 'Nét đang đi ngược hướng. Bắt đầu ở chấm tròn.';
 if(dist(input[0],expected[0])>tolerance)return 'Điểm bắt đầu chưa khớp vị trí nét kế tiếp.';
 const scale=28/tolerance,adapt=(p:Stroke)=>p.map(([x,y]):Point=>[x*scale,y*scale]);
 return matchesStroke(adapt(input),adapt(expected))?'':'Hình hoặc điểm kết thúc chưa khớp. Hãy đi theo nét mẫu.';
}
