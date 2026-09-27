import {useEffect,useState} from 'react';
import {useApp} from '../context';
import {initials,spellingSteps,toneMark,type Syllable} from '../core/pinyin';
import {speech} from '../adapters/local';
import {LayerText,Speak} from './common';

export function PinyinLab(){
 const {content,notify}=useApp();const [catalog,setCatalog]=useState<Syllable[]>([]),[chosen,setChosen]=useState('ba'),[tone,setTone]=useState(1),[query,setQuery]=useState(''),[error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();fetch('/learning/pinyin/catalog.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Chưa có bảng Pinyin local.');return r.json();}).then(setCatalog).catch(e=>{if(!controller.signal.aborted)setError(e.message);});return()=>{controller.abort();speech.stop();};},[]);
 const selected=catalog.find(x=>x.base===chosen)||catalog[0],spelling=selected?toneMark(selected.base,tone):'';
 const example=content.units.flatMap(u=>u.words).find(w=>w.pinyin.toLowerCase()===spelling&&Array.from(w.hanzi).length===1);
 const search=query.trim().toLowerCase().replaceAll('v','ü').replaceAll('u:','ü');
 if(error)return <p className="notice">{error}</p>;
 if(!selected)return <p>Đang mở bảng ghép âm…</p>;
 return <section className="panel pinyin-lab"><span className="eyebrow">THANH MẪU · VẬN MẪU · THANH ĐIỆU</span><h2>Ghép âm Pinyin</h2><p>Bấm ô âm tiết rồi chọn thanh để xem cách viết và cách ghép. Bảng hiện chỉ hướng dẫn bằng chữ; chưa có nghe âm tiết hoặc đánh vần.</p>
 <label>Tìm âm Pinyin<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ví dụ: ba, nü, ju…"/></label>
 <div className="pinyin-workbench"><div className="pinyin-grid-scroll" role="region" aria-label="Bảng chọn âm Pinyin" tabIndex={0}>{initials.map(i=>{const rows=catalog.filter(s=>s.initial===i&&s.base.includes(search));return rows.length>0&&<div className="pinyin-grid-row" key={i}><strong className="pinyin-initial">{i||'∅'}</strong><div className="pinyin-syllables">{rows.map(s=><button key={s.base} aria-label={'Chọn âm '+s.base} aria-pressed={chosen===s.base} onClick={()=>{speech.stop();setChosen(s.base);}}>{s.base}</button>)}</div></div>;})}{!catalog.some(s=>s.base.includes(search))&&<p>Không có âm phù hợp. Thử bỏ dấu thanh; dùng v hoặc ü để tìm ü.</p>}</div>
 <div className="pinyin-result"><div className="tabs" aria-label="Chọn thanh điệu">{[1,2,3,4,0].map(t=><button key={t} aria-pressed={tone===t} onClick={()=>{speech.stop();setTone(t);}}>{t?`Thanh ${t} · ${toneMark(selected.base,t)}`:'Thanh nhẹ'}</button>)}</div>
 <strong className="syllable-result">{spelling}</strong>{tone===0?<p>Thanh nhẹ phụ thuộc âm trước và ngữ cảnh. Ví dụ: 名字 · míngzi; 桌子 · zhuōzi. Xem nhóm quy tắc thanh nhẹ bên dưới.</p>:<><p>{selected.initial||'∅'} + {selected.final} + thanh {tone} → {spelling}</p><div className="spelling-steps">{spellingSteps(selected,tone).join(' → ')}</div></>}
 {example?<div className="pinyin-example"><small>Ví dụ Hán tự trong gói; nút nghe đọc từ này bằng giọng zh-TW, không phải âm mẫu đã duyệt.</small><LayerText item={example} layers={{hanzi:'show',pinyin:'show',vi:'show'}}/><Speak text={example.hanzi} label="Nghe ví dụ Hán tự" onError={notify}/></div>:<small>Chưa gắn ví dụ Hán tự cho cách đọc này. Không dùng TTS đọc ký hiệu Latin thay âm mẫu.</small>}
 </div></div><details><summary>Quy tắc ghép bằng chữ</summary><p>∅ là âm đầu rỗng; y/w là quy ước chính tả. ü bỏ hai chấm sau j/q/x và trong yu. iou/uei/uen rút gọn thành iu/ui/un sau thanh mẫu.</p><p>Các phần hiển thị giúp phân tích cách viết, không phải hướng dẫn nối âm cơ học. ian/in/ing/ong có thay đổi khi đọc liền. -i trong zhi/chi/shi/ri/zi/ci/si khác i trong yi.</p><p>Đã bỏ các bản thu Pinyin theo lựa chọn của bạn. Các ví dụ từ/câu và quy tắc bên dưới dùng Windows zh-TW; chất lượng đọc cần đối chiếu.</p></details></section>;
}
