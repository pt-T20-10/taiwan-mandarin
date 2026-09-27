import {useEffect,useRef,useState} from 'react';
import {useApp} from '../context';
import {api,speech,configureSpeech,previewSpeech,type SpeechPreferences} from '../adapters/local';
import type {Status} from '../core/types';

export function SpeechControls(){
 const {state,put,notify}=useApp();const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[native,setNative]=useState<string[]>([]),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false),[playing,setPlaying]=useState(false);
 const [sentence,setSentence]=useState('你好，我是越南人，現在在臺灣學中文。很高興認識你！');const request=useRef(0);
 const saved=state.objects.settings.speech;const choice:SpeechPreferences={voice:saved?.data.voice||'auto',pace:saved?.data.pace||'normal'};
 useEffect(()=>{const update=()=>setVoices(window.speechSynthesis?.getVoices().filter(v=>v.lang.toLowerCase()==='zh-tw'&&v.localService)||[]);update();window.speechSynthesis?.addEventListener('voiceschanged',update);
 api<Status>('/status').then(s=>{setNative(s.tts_voices);setLoaded(true);}).catch(e=>notify(e.message));return()=>{request.current++;speech.stop();window.speechSynthesis?.removeEventListener('voiceschanged',update);};},[]);
 function stop(){request.current++;speech.stop();setPlaying(false);}
 async function save(next:SpeechPreferences){stop();setBusy(true);try{await put({collection:'settings',id:'speech',expected_version:saved?.version||0,data:next});configureSpeech(next);}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 async function listen(){const ticket=++request.current;setPlaying(true);try{await previewSpeech(sentence,choice);}catch(e){if(ticket===request.current)notify((e as Error).message);}finally{if(ticket===request.current)setPlaying(false);}}
 const available=['auto',...voices.map(v=>'browser:'+v.voiceURI),...native.map(v=>'native:'+v)];
 return <section className="panel speech-controls"><h2>Giọng đọc và nhịp nói</h2>{saved?.data.migration_notice&&<p className="notice">{saved.data.migration_notice}</p>}<div className="form-grid"><label>Giọng đọc offline<select aria-label="Giọng đọc offline" disabled={busy} value={choice.voice} onChange={e=>void save({...choice,voice:e.target.value})}>
 <option value="auto">Tự chọn giọng Đài Loan local có sẵn</option>{voices.map(v=><option key={v.voiceURI} value={'browser:'+v.voiceURI}>{v.name} · trình duyệt</option>)}{native.map(v=><option key={v} value={'native:'+v}>{v} · Windows</option>)}{!available.includes(choice.voice)&&<option value={choice.voice}>{loaded?'Giọng đã lưu không còn; hãy chọn lại':'Giọng đã lưu · đang kiểm tra…'}</option>}</select></label>
 <label>Nhịp đọc<select aria-label="Nhịp đọc" disabled={busy} value={choice.pace} onChange={e=>void save({...choice,pace:e.target.value as SpeechPreferences['pace']})}><option value="normal">Tốc độ thường</option><option value="slow">Chậm để nghe kỹ</option><option value="brisk">Nhanh nhẹ</option></select></label></div>
 {loaded&&!voices.length&&!native.length&&<p className="notice">Chưa có giọng zh-TW local. Cài Text-to-speech cho Chinese (Traditional, Taiwan) trong Windows rồi mở lại ứng dụng. Bạn có thể bỏ qua câu nghe; ứng dụng không thay bằng giọng vùng khác.</p>}
 <p>Giọng zh-TW đã chọn dùng cho các nút nghe từ, câu, ngữ pháp và hội thoại. Grid Pinyin hiện hướng dẫn bằng chữ, chưa có âm mẫu đánh vần.</p>
 <label>Câu so sánh giọng<input maxLength={1200} value={sentence} onChange={e=>{stop();setSentence(e.target.value);}}/></label><div className="actions"><button disabled={busy||!sentence.trim()} onClick={()=>void listen()}>Nghe giọng đang chọn</button><button onClick={stop}>Dừng nghe thử</button></div>
 <p role="status" aria-label="Trạng thái nghe thử" aria-live="polite">{playing?'Đang chuẩn bị / phát câu… Có thể đổi giọng hoặc dừng.':''}</p><details><summary>Giọng Windows và giới hạn chất lượng</summary><p>Gói Chinese (Traditional, Taiwan) cung cấp giọng zh-TW offline. Giọng nhận nguyên câu Hán tự, nhưng có thể sai chữ đa âm, biến điệu hoặc chưa tự nhiên; đổi tốc độ không tự sửa phát âm. Chưa có nghe duyệt chuyên môn.</p><a href="#pronunciation">Đối chiếu các quy tắc đọc liền →</a></details></section>;
}
