import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {toneMark,type Syllable} from '../core/pinyin';
import {playPinyinRecording,speech} from '../adapters/local';

const rows=['','b','p','m','f','d','t','n','l','g','k','h','z','c','s','zh','ch','sh','r','j','q','x'];
const columns='a o e -i er ai ei ao ou an en ang eng ong i ia iao ie iou ian in iang ing iong u ua uo uai uei uan uen uang ueng ü üe üan ün'.split(' ');
const headings:Record<string,string>={'-i':'i',iou:'iu',uei:'ui',uen:'un',ueng:'ueng'};
type Recordings={recordings:Record<string,Record<string,{path:string}>>;available:number;missing:string[]};
type Popup={base:string;left:number;top:number};

export function PinyinLab(){
 const [catalog,setCatalog]=useState<Syllable[]>([]),[data,setData]=useState<Recordings>(),[query,setQuery]=useState(''),[popup,setPopup]=useState<Popup|null>(null);
 const [error,setError]=useState(''),[last,setLast]=useState(''),[playing,setPlaying]=useState(false);
 const ticket=useRef(0),leave=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),anchor=useRef<HTMLButtonElement|null>(null);
 function keepOpen(){clearTimeout(leave.current);}
 function close(){keepOpen();setPopup(null);}
 function show(base:string,button:HTMLButtonElement){
  keepOpen();anchor.current=button;const r=button.getBoundingClientRect();
  setPopup({base,left:Math.max(8,Math.min(r.right+4,innerWidth-148)),top:Math.max(8,Math.min(r.top,innerHeight-208))});
 }
 useEffect(()=>{
  const controller=new AbortController();
  Promise.all(['/learning/pinyin/catalog.json','/learning/pinyin/recordings.json'].map(async url=>{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error('Chưa mở được bảng âm thanh local.');return r.json();})).then(([grid,audio])=>{if(!controller.signal.aborted){setCatalog(grid);setData(audio);}}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
  const dismiss=(e:PointerEvent)=>{if(!(e.target as Element).closest('.pinyin-cell-button, .pinyin-tone-popup'))close();};
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){close();anchor.current?.focus();}};
  const scroll=()=>close();
  document.addEventListener('pointerdown',dismiss);document.addEventListener('keydown',escape);window.addEventListener('resize',scroll);
  return()=>{controller.abort();ticket.current++;speech.stop();keepOpen();document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);window.removeEventListener('resize',scroll);};
 },[]);
 function stop(){ticket.current++;speech.stop();setPlaying(false);setError('');}
 async function play(base:string,tone:number){
  stop();const id=ticket.current,sample=data?.recordings[base]?.[tone];if(!sample)return;
  setLast(toneMark(base,tone));setPlaying(true);
  try{await playPinyinRecording(sample.path);}catch(e){if(id===ticket.current)setError((e as Error).message);}finally{if(id===ticket.current)setPlaying(false);}
 }
 const search=query.trim().toLowerCase().replaceAll('u:','ü').replaceAll('v','ü');
 return <section className="panel pinyin-lab"><span className="eyebrow">BẢNG ÂM PINYIN</span><h2>Ghép âm Pinyin</h2>
 <p>Rê chuột hoặc chạm vào một ô, rồi chọn thanh để nghe. Bấm lại thanh để nghe lại.</p>
 <div className="pinyin-table-tools"><label>Tìm âm Pinyin<input value={query} onChange={e=>{setQuery(e.target.value);close();}} placeholder="Ví dụ: ba, nü, ju…"/></label><button onClick={stop}>Dừng âm mẫu</button><span role="status">{last?`${playing?'Đang nghe':'Âm đã chọn'}: ${last}`:''}</span></div>
 {error&&<p role="alert" className="notice">{error}</p>}
 {!data?(!error&&<p>Đang mở bảng âm thanh…</p>):<div className="pinyin-matrix-scroll" role="region" aria-label="Bảng âm Pinyin" tabIndex={0} onScroll={close}>
 <table className="pinyin-matrix"><thead><tr><th scope="col" aria-label="Âm đầu / vần"/>{columns.map(f=><th scope="col" key={f}>{headings[f]||f}</th>)}</tr></thead>
 <tbody>{rows.map(initial=><tr key={initial}><th scope="row">{initial||'∅'}</th>{columns.map(final=>{
  const s=catalog.find(s=>s.initial===initial&&s.final===final),visible=s&&s.base.includes(search);
  return <td key={final}>{visible&&<button className="pinyin-cell-button" aria-label={'Chọn âm '+s.base} aria-expanded={popup?.base===s.base} aria-controls={popup?.base===s.base?'pinyin-tone-popup':undefined} onMouseEnter={e=>show(s.base,e.currentTarget)} onMouseLeave={()=>{leave.current=setTimeout(()=>setPopup(null),160);}} onClick={e=>show(s.base,e.currentTarget)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();show(s.base,e.currentTarget);setTimeout(()=>document.querySelector<HTMLButtonElement>('#pinyin-tone-popup button:not(:disabled)')?.focus(),0);}}}>{s.base}</button>}</td>;
 })}</tr>)}</tbody></table></div>}
 {data&&!catalog.some(s=>s.base.includes(search))&&<p>Không tìm thấy âm này. Thử nhập không dấu thanh.</p>}
 <small className="pinyin-recording-note">Âm thu sẵn · Quan thoại phổ thông, chưa xác minh giọng Đài Loan. Kéo ngang để xem hết bảng.</small>
 <details><summary>Nguồn bản thu</summary><p>{data?.available||0}/1624 tổ hợp có bản thu; {data?.missing.length||0} tổ hợp chưa có bản thu. Bản thu để luyện âm và thanh, không khẳng định mọi tổ hợp đều là từ có nghĩa. Chưa nghe duyệt toàn bộ.</p><p>davinfifield/mp3-chinese-pinyin-sound · Unlicense. Các ví dụ từ/câu bên dưới vẫn dùng giọng zh-TW đã chọn.</p><a href="/learning/licenses/pinyin-unlicense.txt" target="_blank" rel="noreferrer">Giấy phép bản thu</a></details>
 {popup&&data&&createPortal(<div id="pinyin-tone-popup" className="pinyin-tone-popup" role="group" aria-label={'Bốn thanh của '+popup.base} style={{left:popup.left,top:popup.top}} onMouseEnter={keepOpen} onMouseLeave={()=>{leave.current=setTimeout(()=>setPopup(null),160);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))close();}}>{[1,2,3,4].map(t=>{
  const available=!!data.recordings[popup.base]?.[t];return <button key={t} disabled={!available} aria-label={`Nghe ${toneMark(popup.base,t)} · thanh ${t}`} title={available?`Thanh ${t}`:'Chưa có bản thu'} onClick={()=>void play(popup.base,t)}><span>{toneMark(popup.base,t)}</span><small>{available?`Thanh ${t}`:'Chưa có'}</small></button>;
 })}</div>,document.body)}
 </section>;
}
