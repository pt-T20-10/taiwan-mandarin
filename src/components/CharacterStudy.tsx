import {useEffect,useId,useState,useRef} from 'react';
import {structureParts} from '../core/characterStructure';
import radicalUnits from '../core/radical-learning-units.json';
const radicalNames:Record<string,string>=radicalUnits.radicalNames;
const preservedNames:Record<string,string>=radicalUnits.preservedComponents;

type Stroke={outline:string;median:number[][];matrix:number[]};
type CharacterData={character:string;radical:string;decomposition:string;strokes:Stroke[];source:string;reference:string;verification:string;variant:string;copyright?:string;modification?:string;structure_verification?:string};
const descriptions:Record<string,string>={'⿰':'trái – phải','⿱':'trên – dưới','⿲':'trái – giữa – phải','⿳':'trên – giữa – dưới','⿴':'bao kín','⿵':'bao phía trên','⿶':'bao phía dưới','⿷':'bao phía trái','⿸':'bao phía trên/trái','⿹':'bao phía trên/phải','⿺':'bao phía dưới/trái','⿻':'đan xen'};

const componentNames:Record<string,string>={'𠃌':'nét gập có móc','䜌':'(糸 – 言 – 糸)','𧾷':'dạng bên trái của 足','龶':'ba nét ngang với nét dọc xuyên','龸':'phần trên của 尚','亼':'(人 trên 一)','尌':'(壴 trái, 寸 phải)'};
function decompositionDescription(value:string){return Array.from(value).map(c=>descriptions[c]?`[${descriptions[c]}]`:componentNames[c]||c).join(' ');}
function componentLabel(char:string){
 if(preservedNames[char])return preservedNames[char];
 if(char==='⺈')return 'dạng thành phần của 刀 (đao); khác 冖 (mịch)';
 if(char==='冖')return 'bộ mịch · che phủ';
 return radicalNames[char]?`bộ ${radicalNames[char]}`:componentNames[char]||'thành phần chưa có tên Việt trong dữ liệu';
}

export function CharacterStudy({text,explain=true,compact=false}:{text:string;explain?:boolean;compact?:boolean}){
 const chars=Array.from(text).filter(c=>/\p{Script=Han}/u.test(c));const [selected,setSelected]=useState(0),[data,setData]=useState<CharacterData|null>(null),[error,setError]=useState(''),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[slow,setSlow]=useState(false);const uid=useId().replace(/:/g,'');
 const char=chars[selected]||chars[0];
 const host=useRef<HTMLElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting));if(host.current)observer.observe(host.current);return()=>observer.disconnect();},[]);
 const finished=!!data&&progress>=data.strokes.length;
 useEffect(()=>{setSelected(0);},[text]);
 useEffect(()=>{if(!char)return;const controller=new AbortController();setData(null);setError('');setProgress(0);setPlaying(false);
  fetch(`/learning/characters/${char.codePointAt(0)}.json`,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Chưa có mẫu nét cho chữ này.');return r.json();}).then(d=>{if(controller.signal.aborted)return;setData(d);setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return()=>controller.abort();},[char]);
 useEffect(()=>{if(!playing||!visible||!data||finished)return;let frame=0,previous=performance.now();const tick=(now:number)=>{const delta=(now-previous)/(slow?1800:1000);previous=now;setProgress(p=>Math.min(data.strokes.length,p+delta));frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing,visible,data,slow,finished]);
 useEffect(()=>{if(!playing||!visible||!finished)return;const timer=window.setTimeout(()=>setProgress(0),2500);return()=>window.clearTimeout(timer);},[playing,visible,finished,data]);
 if(!char)return null;
 return <aside ref={host} className={'character-study '+(compact?'compact':'')} aria-label={'Nét chữ '+text}>
  {chars.length>1&&<div className="character-tabs" role="group" aria-label="Chọn chữ trong từ">{chars.map((c,i)=><button key={i} aria-pressed={i===selected} onClick={()=>setSelected(i)} lang="zh-TW">{c}</button>)}</div>}
  <div className="stroke-stage">{data?<svg viewBox="0 0 1024 1024" role="img" aria-label={`Thứ tự ${data.strokes.length} nét chữ ${char}`}><path d="M512 0V1024M0 512H1024" stroke="#dddcc9" strokeDasharray="14 14"/>
   {data.strokes.map((s,i)=><g key={i} transform={'matrix('+s.matrix.join(' ')+')'}><defs><clipPath id={`${uid}-${i}`}><path d={s.outline}/></clipPath></defs><path d={s.outline} fill={i<Math.floor(progress)?'#245f50':'#e2e7dc'}/>{i===Math.floor(progress)&&<path clipPath={`url(#${uid}-${i})`} d={'M'+s.median.map(p=>p.join(',')).join(' L')} fill="none" stroke="#d88145" strokeWidth="140" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-Math.min(1,(progress-i)/.8)}/>}</g>)}
  </svg>:<p>{error||'Đang mở mẫu nét…'}</p>}</div>
  {data&&<><small>{Math.min(Math.ceil(progress),data.strokes.length)}/{data.strokes.length} nét · {char}</small><div className="actions stroke-controls"><button onClick={()=>setPlaying(!playing)}>{playing?'Tạm dừng':'Phát tiếp'}</button><button onClick={()=>{setPlaying(false);setProgress(p=>Math.min(data.strokes.length,Math.floor(p)+1));}}>Nét kế</button><label><input type="checkbox" checked={slow} onChange={e=>setSlow(e.target.checked)}/> Chậm</label></div>
  {explain&&<div className="character-explanation"><p><strong>Bộ thủ tra cứu:</strong> <span lang="zh-TW">{data.radical}</span>{radicalNames[data.radical]?' — '+radicalNames[data.radical]:''}</p><p><strong>Cấu tạo hình chữ:</strong> {data.decomposition?decompositionDescription(data.decomposition):'Chữ đơn thể; không tách thêm trong mẫu này.'}</p>{data.decomposition&&<div><strong>Các thành phần:</strong><ul className="character-parts">{structureParts(data.decomposition,data.character).map((part,i)=><li key={i}><span>{part.position}: </span><span lang="zh-TW">{part.character}</span> — {componentLabel(part.character)}</li>)}</ul></div>}</div>}
</>}
 </aside>;
}
