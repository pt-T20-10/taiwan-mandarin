import {useEffect,useState} from 'react';
import {useApp} from '../context';
import {api,speech,type SpeechPreferences} from '../adapters/local';
import type {Status} from '../core/types';

export function SpeechControls(){
  const {state,put,notify}=useApp();const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]),[native,setNative]=useState<string[]>([]),[busy,setBusy]=useState(false);
  const saved=state.objects.settings.speech;const choice:SpeechPreferences={voice:saved?.data.voice||'auto',pace:saved?.data.pace||'normal'};
  useEffect(()=>{const update=()=>setVoices(window.speechSynthesis?.getVoices().filter(v=>v.lang.toLowerCase()==='zh-tw'&&v.localService)||[]);
    update();window.speechSynthesis?.addEventListener('voiceschanged',update);api<Status>('/status').then(s=>setNative(s.tts_voices)).catch(e=>notify(e.message));
    return()=>window.speechSynthesis?.removeEventListener('voiceschanged',update);},[]);
  async function save(next:SpeechPreferences){speech.stop();setBusy(true);try{await put({collection:'settings',id:'speech',expected_version:saved?.version||0,data:next});}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
  const available=['auto',...voices.map(v=>'browser:'+v.voiceURI),...native.map(v=>'native:'+v)];
  return <section className="panel"><h2>Giọng đọc và nhịp nói</h2><div className="form-grid">
    <label>Giọng zh-TW local<select aria-label="Giọng zh-TW local" disabled={busy} value={choice.voice} onChange={e=>void save({...choice,voice:e.target.value})}>
      <option value="auto">Tự chọn giọng local có sẵn</option>{voices.map(v=><option key={v.voiceURI} value={'browser:'+v.voiceURI}>{v.name} · trình duyệt</option>)}{native.map(v=><option key={v} value={'native:'+v}>{v} · Windows</option>)}{!available.includes(choice.voice)&&<option value={choice.voice}>Giọng đã lưu không có ở trình duyệt này</option>}
    </select></label><label>Nhịp đọc<select aria-label="Nhịp đọc" disabled={busy} value={choice.pace} onChange={e=>void save({...choice,pace:e.target.value as SpeechPreferences['pace']})}><option value="normal">Tốc độ thường</option><option value="slow">Chậm để nghe kỹ</option><option value="brisk">Nhanh nhẹ</option></select></label>
    </div><p>Nghe cả từ/cụm/câu để giữ ngữ cảnh. Nút cạnh Pinyin cũng đọc câu Hán tự tương ứng.</p><small>Giọng hệ điều hành có thể đọc rời hoặc sai biến điệu/chữ đa âm. Đổi giọng và nhịp để so sánh; tốc độ chậm không tự sửa thanh điệu. Mức chậm/nhanh có thể khác giữa các giọng.</small><p><a href="#pronunciation">Luyện và kiểm tra biến điệu, thanh nhẹ, nhịp câu →</a></p></section>;
}
