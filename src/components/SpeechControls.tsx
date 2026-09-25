import {useEffect,useRef,useState} from 'react';
import {useApp} from '../context';
import {api,speech,configureSpeech,previewSpeech,type SpeechPreferences} from '../adapters/local';
import type {Status} from '../core/types';

export function SpeechControls(){
  const {state,put,notify}=useApp();const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[native,setNative]=useState<string[]>([]),[neural,setNeural]=useState<NonNullable<Status['neural_voices']>>([]),[busy,setBusy]=useState(false);
  const [sentence,setSentence]=useState('你好，我是越南人，現在在臺灣學中文。很高興認識你！'),[playing,setPlaying]=useState(''),[loaded,setLoaded]=useState(false);const request=useRef(0);
  const saved=state.objects.settings.speech;const choice:SpeechPreferences={voice:saved?.data.voice||'auto',pace:saved?.data.pace||'normal'};
  useEffect(()=>{const update=()=>setVoices(window.speechSynthesis?.getVoices().filter(v=>v.lang.toLowerCase()==='zh-tw'&&v.localService)||[]);
    update();window.speechSynthesis?.addEventListener('voiceschanged',update);api<Status>('/status').then(s=>{setNative(s.tts_voices);setNeural(s.neural_voices||[]);setLoaded(true);}).catch(e=>notify(e.message));
    return()=>{request.current++;speech.stop();window.speechSynthesis?.removeEventListener('voiceschanged',update);};},[]);
  function stop(){request.current++;speech.stop();setPlaying('');}
  async function save(next:SpeechPreferences){stop();setBusy(true);try{await put({collection:'settings',id:'speech',expected_version:saved?.version||0,data:next});configureSpeech(next);}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
  async function listen(voice:string){const ticket=++request.current;setPlaying(voice);try{await previewSpeech(sentence,{voice,pace:choice.pace});}catch(e){if(ticket===request.current)notify((e as Error).message);}finally{if(ticket===request.current)setPlaying('');}}
  const available=['auto',...voices.map(v=>'browser:'+v.voiceURI),...native.map(v=>'native:'+v),...neural.map(v=>v.id)];
  return <section className="panel speech-controls"><h2>Giọng đọc và nhịp nói</h2><div className="form-grid">
    <label>Giọng đọc offline<select aria-label="Giọng đọc offline" disabled={busy} value={choice.voice} onChange={e=>void save({...choice,voice:e.target.value})}>
      <option value="auto">Tự chọn giọng Đài Loan local có sẵn</option><optgroup label="Đài Loan · giọng Windows">{voices.map(v=><option key={v.voiceURI} value={'browser:'+v.voiceURI}>{v.name} · trình duyệt</option>)}{native.map(v=><option key={v} value={'native:'+v}>{v} · Windows</option>)}</optgroup>{neural.length>0&&<optgroup label="Neural · Quan thoại phổ thông">{neural.map(v=><option key={v.id} value={v.id}>{v.label} · Quan thoại phổ thông</option>)}</optgroup>}{!available.includes(choice.voice)&&<option value={choice.voice}>{loaded?'Giọng đã lưu không có trên máy này':'Giọng đã lưu · đang kiểm tra…'}</option>}
    </select></label><label>Nhịp đọc<select aria-label="Nhịp đọc" disabled={busy} value={choice.pace} onChange={e=>void save({...choice,pace:e.target.value as SpeechPreferences['pace']})}><option value="normal">Tốc độ thường</option><option value="slow">Chậm để nghe kỹ</option><option value="brisk">Nhanh nhẹ</option></select></label>
    </div><p>Giọng đã chọn dùng cho các nút nghe từ, câu, ngữ pháp và hội thoại. Âm mẫu Pinyin vẫn là bản thu riêng.</p>
    {choice.voice.startsWith('neural:')&&<p className="notice">Kokoro là giọng neural Quan thoại phổ thông, chưa xác minh giọng Đài Loan. Có thể sai chữ đa âm, biến điệu hoặc cách đọc địa phương.</p>}
    <label>Câu so sánh giọng<input maxLength={1200} value={sentence} onChange={e=>{stop();setSentence(e.target.value);}}/></label>
    <div className="actions"><button disabled={!sentence.trim()} onClick={()=>void listen(choice.voice)}>Nghe giọng đang chọn</button><button onClick={stop}>Dừng nghe thử</button></div>
    {neural.length>0&&<><h3>Nghe thử giọng neural</h3><p>Cùng câu, cùng nhịp đọc. Bấm nghe thử trước; chọn “Dùng giọng này” khi muốn lưu cho mọi nút nghe.</p><div className="voice-comparison">{neural.map(v=><article key={v.id}><strong>{v.label}</strong><small>{v.accent}</small><div className="actions"><button aria-label={'Nghe thử '+v.label} disabled={!sentence.trim()} onClick={()=>void listen(v.id)}>◖)) Nghe thử</button><button aria-label={'Dùng '+v.label} disabled={busy||choice.voice===v.id} onClick={()=>void save({...choice,voice:v.id})}>{choice.voice===v.id?'Đang dùng':'Dùng giọng này'}</button></div></article>)}</div></>}
    <p role="status" aria-label="Trạng thái nghe thử" aria-live="polite">{playing?'Đang chuẩn bị / phát câu… Có thể bấm giọng khác hoặc dừng.':''}</p>
    <details><summary>Giọng Windows và giới hạn chất lượng</summary><p>Gói Chinese (Traditional, Taiwan) trong Windows cung cấp giọng zh-TW offline. Cài gói ngôn ngữ không tự nâng các giọng Hanhan, Yating, Zhiwei thành giọng neural tự nhiên hơn.</p><p>Mọi giọng đều nhận cả cụm/câu Hán tự để giữ ngữ cảnh. Đổi tốc độ không tự sửa biến điệu. Giọng neural cần vài giây để tạo câu lần đầu; câu nghe lại được giữ tạm trong RAM. Chưa có đánh giá nghe chuyên môn cho các giọng.</p><a href="#pronunciation">Luyện và đối chiếu biến điệu, thanh nhẹ, nhịp câu →</a></details>
  </section>;
}
