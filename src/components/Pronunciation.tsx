import {useEffect,useState} from 'react';
import {useApp} from '../context';
import {pronunciationCases,pronunciationGroups} from '../core/pronunciation';
import {Recorder} from './common';
import {ConnectedAudio,type ConnectedClip} from './ConnectedAudio';
import {SpeechControls} from './SpeechControls';
import {speech} from '../adapters/local';
import {PinyinLab} from './PinyinLab';

export function Pronunciation(){
  const {notify}=useApp();const [transcript,setTranscript]=useState('');
  const [clips,setClips]=useState<Record<string,ConnectedClip>>({});
  useEffect(()=>{const controller=new AbortController();fetch('/api/pronunciation/audio',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Không tải được danh sách bản đọc liền.');return r.json();}).then(data=>setClips(data.clips||{})).catch(e=>{if(!controller.signal.aborted)notify(e.message);});return()=>{controller.abort();speech.stop();};},[]);
  return <><span className="eyebrow">NGHE CẢ CỤM, NÓI THEO NGỮ CẢNH</span><h1>Phát âm trong lời nói</h1><p>Thanh điệu không chỉ là âm đọc của từng chữ đứng riêng. Khi nói liền, cần chú ý biến điệu, thanh nhẹ, trọng âm và chỗ ngắt; độ dài còn thay đổi theo người nói và nhịp câu.</p>
    <p className="notice">Bảng Pinyin dùng bản thu âm tiết riêng. Phần đọc liền có bản tổng hợp nguyên cụm/câu bằng BreezyVoice để thử và đối chiếu với Windows; chưa chứng nhận chất lượng biến điệu. Không dùng transcript ASR để chấm thanh điệu.</p>
    <PinyinLab/><SpeechControls/><button onClick={()=>speech.stop()}>Dừng audio</button>
    <h2>Quy tắc đọc liền</h2><div className="pronunciation-groups">{pronunciationGroups.map(group=><details className="panel pronunciation-group" key={group.id}><summary><strong>{group.title}</strong><span>{group.summary}</span><small>{group.cases.length} ví dụ · bấm để mở</small></summary>{pronunciationCases.filter(item=>group.cases.includes(item.id)).map(item=>{return <section className="pronunciation-case" key={item.id}>
      <h3>{item.title}</h3><small>Phiên âm cơ sở / từ điển</small><div className="layers"><div className="hanzi" lang="zh-TW">{item.hanzi}</div><div className="pinyin">{item.pinyin}</div><div className="vi">{item.vi}</div></div>
      <p><strong>Khi nói liền: </strong>{item.spoken}</p><p lang="zh-TW">{item.context}</p>
      <ConnectedAudio id={item.id} phrase={item.hanzi} context={item.context} clips={clips}/>
    </section>;})}</details>)}</div><section className="panel"><h2>Tự nói và đối chiếu</h2><Recorder onTranscript={setTranscript} onError={notify}/><label>Transcript để xem và sửa<textarea value={transcript} onChange={e=>setTranscript(e.target.value)}/></label><p>Ưu tiên nghe bản ghi của chính bạn. Nhận dạng sai có thể do model, tiếng ồn hoặc nhiều yếu tố khác; không suy ra phát âm sai từ transcript.</p></section>
    <details><summary>Nguồn và phạm vi ghi chú</summary><p>Ghi chú do dự án soạn dựa trên quy tắc đọc liền, không phải giáo viên duyệt âm thanh. Chưa xử lý hết chuỗi nhiều thanh 3 hoặc mọi trường hợp chữ đa âm.</p><p>MOE — quy tắc 一／不 và thanh nhẹ: https://dict.concised.moe.edu.tw/page.jsp?ID=55&amp;la=0&amp;powerMode=0</p><p>Tham khảo nghiên cứu thanh điệu Hoa ngữ, Đại học Chính trị Đài Loan: https://ah.lib.nccu.edu.tw/bitstream/140.119/152670/1/101401.pdf</p></details>
  </>;
}
