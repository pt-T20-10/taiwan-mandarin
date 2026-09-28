import {useEffect,useRef,useState} from 'react';
import {initials,spellingSteps,toneMark,type Syllable,type PinyinExamples} from '../core/pinyin';
import {speech} from '../adapters/local';

export function PinyinLab(){
 const [catalog,setCatalog]=useState<Syllable[]>([]),[data,setData]=useState<PinyinExamples>(),[chosen,setChosen]=useState('ba'),[tone,setTone]=useState(1),[query,setQuery]=useState(''),[loadError,setLoadError]=useState('');
 const [autoplay,setAutoplay]=useState(true),[error,setError]=useState(''),[playing,setPlaying]=useState(false);
 const request=useRef(0);
 useEffect(()=>{
  const controller=new AbortController();
  async function load(){
   const [grid,examples]=await Promise.all(['/learning/pinyin/catalog.json','/learning/pinyin/examples.json'].map(async url=>{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw new Error('Chưa có dữ liệu Pinyin local.');return r.json();}));
   if(!controller.signal.aborted){setCatalog(grid);setData(examples);}
  }
  void load().catch(e=>{if(!controller.signal.aborted)setLoadError(e.message);});
  return()=>{controller.abort();request.current++;speech.stop();};
 },[]);
 function stop(){request.current++;speech.stop();setPlaying(false);setError('');}
 async function play(base:string,nextTone:number){
  stop();const ticket=request.current,example=data?.examples[`${base}:${nextTone}`];
  if(!example)return;
  setPlaying(true);
  try{await speech.speak(example.hanzi);}catch(e){if(ticket===request.current)setError(e instanceof Error?e.message:'Không phát được giọng zh-TW. Hãy thử lại.');}
  finally{if(ticket===request.current)setPlaying(false);}
 }
 function select(base:string,nextTone:number){setChosen(base);setTone(nextTone);if(autoplay)void play(base,nextTone);else stop();}
 const selected=catalog.find(x=>x.base===chosen)||catalog[0],spelling=selected?toneMark(selected.base,tone):'';
 const example=data?.examples[`${chosen}:${tone}`];
 const search=query.trim().toLowerCase().replaceAll('v','ü').replaceAll('u:','ü');
 if(loadError)return <p className="notice" role="alert">{loadError}</p>;
 if(!selected||!data)return <p>Đang mở bảng ghép âm…</p>;
 return <section className="panel pinyin-lab"><span className="eyebrow">THANH MẪU · VẬN MẪU · THANH ĐIỆU</span><h2>Ghép âm Pinyin</h2><p>Bấm ô âm tiết hoặc thanh để nghe ví dụ Hán tự bằng giọng zh-TW đã chọn. Bấm lại để nghe lại. Phần ghép thanh mẫu và vận mẫu chỉ hướng dẫn bằng chữ.</p>
 <label className="inline-check"><input type="checkbox" checked={autoplay} onChange={e=>{setAutoplay(e.target.checked);stop();}}/> Nghe ngay khi chọn</label>
 <label>Tìm âm Pinyin<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ví dụ: ba, nü, ju…"/></label>
 <div className="pinyin-workbench"><div className="pinyin-grid-scroll" role="region" aria-label="Bảng chọn âm Pinyin" tabIndex={0}>{initials.map(i=>{const rows=catalog.filter(s=>s.initial===i&&s.base.includes(search));return rows.length>0&&<div className="pinyin-grid-row" key={i}><strong className="pinyin-initial">{i||'∅'}</strong><div className="pinyin-syllables">{rows.map(s=><button key={s.base} aria-label={'Chọn âm '+s.base} aria-pressed={chosen===s.base} onClick={()=>select(s.base,tone)}>{s.base}</button>)}</div></div>;})}{!catalog.some(s=>s.base.includes(search))&&<p>Không có âm phù hợp. Thử bỏ dấu thanh; dùng v hoặc ü để tìm ü.</p>}</div>
 <div className="pinyin-result"><div className="tabs" aria-label="Chọn thanh điệu">{[1,2,3,4,0].map(t=><button key={t} aria-pressed={tone===t} onClick={()=>select(selected.base,t)}>{t?`Thanh ${t} · ${toneMark(selected.base,t)}`:'Thanh nhẹ'}</button>)}</div>
 <strong className="syllable-result">{spelling}</strong>{tone===0?<p>Thanh nhẹ phụ thuộc âm trước và ngữ cảnh; nghe cả cụm, không phải âm tiết thanh nhẹ riêng lẻ.</p>:<><p>{selected.initial||'∅'} + {selected.final} + thanh {tone} → {spelling}</p><div className="spelling-steps">{spellingSteps(selected,tone).join(' → ')}</div></>}
 {example?<div className="pinyin-example"><p>{example.kind==='phrase'?'Phát cả cụm':'Phát một chữ'} · âm đang chọn ở vị trí {example.target_index+1}</p><strong lang="zh-TW" className="hanzi">{example.hanzi}</strong><p>{example.pinyin}</p><small>Nội dung đọc chính xác: {example.hanzi}. {example.dictionary_status==='verified'?'Đã đối chiếu mục từ/Pinyin với TBCL.':'Chưa đối chiếu từ điển.'} Chưa nghe duyệt giọng TTS. Đọc liền có thể có biến điệu.</small><details><summary>Nguồn ví dụ</summary><p>{example.source.name}</p><a href={example.source.url} target="_blank" rel="noreferrer">Tra mục từ (cần mạng)</a></details></div>:<p className="notice">Chưa có ví dụ Hán tự đã đối chiếu cho {spelling} ({tone?`thanh ${tone}`:'thanh nhẹ'}). Đây là thiếu dữ liệu, không có nghĩa tổ hợp này không tồn tại. Hãy chọn tổ hợp khác; thanh đang chọn vẫn được giữ.</p>}
 <div className="actions"><button disabled={!example} onClick={()=>void play(chosen,tone)}>Nghe lại ví dụ</button><button onClick={stop}>Dừng nghe Pinyin</button></div>
 <p role="status">{playing?'Đang phát ví dụ…':'Đã dừng / sẵn sàng nghe.'}</p>{error&&<p className="notice" role="alert">{error}</p>}
 </div></div><details><summary>Quy tắc ghép bằng chữ và phạm vi ví dụ</summary><p>∅ là âm đầu rỗng; y/w là quy ước chính tả. ü bỏ hai chấm sau j/q/x và trong yu. iou/uei/uen rút gọn thành iu/ui/un sau thanh mẫu.</p><p>Các phần hiển thị giúp phân tích cách viết, không phải hướng dẫn nối âm cơ học. ian/in/ing/ong có thay đổi khi đọc liền. -i trong zhi/chi/shi/ri/zi/ci/si khác i trong yi.</p><p>{data.coverage.mapped}/{data.coverage.combinations} tổ hợp có ví dụ; {data.coverage.unavailable} chưa có ví dụ. Không phải cả 406 × 5 tổ hợp đều có cách đọc riêng lẻ hợp lệ. Không dùng TTS đọc ký hiệu Latin; không có bản thu âm mẫu hay đánh vần bằng âm thanh.</p></details></section>;
}
