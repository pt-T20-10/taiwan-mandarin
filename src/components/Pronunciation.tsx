import {useState} from 'react';
import {useApp} from '../context';
import {pronunciationCases,pronunciationGroups} from '../core/pronunciation';
import {LayerText,Recorder,Speak} from './common';
import {SpeechControls} from './SpeechControls';
import {speech} from '../adapters/local';
import {PinyinLab} from './PinyinLab';

export function Pronunciation(){
  const {state,put,notify}=useApp();const [transcript,setTranscript]=useState(''),[busy,setBusy]=useState(false);
  const config=state.objects.settings.speech?.data||{voice:'auto',pace:'normal'};
  async function review(id:string,result:string){setBusy(true);try{await put({collection:'reports',id:crypto.randomUUID(),expected_version:0,data:{kind:'pronunciation-listening',sample:id,result,voice:config.voice,pace:config.pace,reviewer:'learner',timestamp:new Date().toISOString()}});notify('Đã lưu nhận xét nghe của bạn; không phải chứng nhận phát âm.');}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
  return <><span className="eyebrow">NGHE CẢ CỤM, NÓI THEO NGỮ CẢNH</span><h1>Phát âm trong lời nói</h1><p>Thanh điệu không chỉ là âm đọc của từng chữ đứng riêng. Khi nói liền, cần chú ý biến điệu, thanh nhẹ, trọng âm và chỗ ngắt; độ dài còn thay đổi theo người nói và nhịp câu.</p>
    <p className="notice">Bảng Pinyin dùng bản thu âm tiết riêng. Ví dụ từ/câu dùng giọng Windows zh-TW bạn chọn, chưa duyệt về độ tự nhiên/biến điệu. Không dùng transcript ASR để chấm thanh điệu.</p>
    <PinyinLab/><SpeechControls/><button onClick={()=>speech.stop()}>Dừng audio</button>
    <h2>Quy tắc đọc liền</h2><div className="pronunciation-groups">{pronunciationGroups.map(group=><details className="panel pronunciation-group" key={group.id}><summary><strong>{group.title}</strong><span>{group.summary}</span><small>{group.cases.length} ví dụ · bấm để mở</small></summary>{pronunciationCases.filter(item=>group.cases.includes(item.id)).map(item=>{const observations=Object.values(state.objects.reports).filter(r=>!r.deleted&&r.data.kind==='pronunciation-listening'&&r.data.sample===item.id&&r.data.voice===config.voice&&r.data.pace===config.pace);return <section className="pronunciation-case" key={item.id}>
      <h3>{item.title}</h3><small>Phiên âm cơ sở / từ điển</small><LayerText item={item} layers={{hanzi:'show',pinyin:'show',vi:'show'}}/>
      <p><strong>Khi nói liền: </strong>{item.spoken}</p><div className="text-with-audio"><p lang="zh-TW">{item.context}</p><Speak text={item.context} label={'Nghe trong câu: '+item.id} onError={notify}/></div>
      <label>Nhận xét sau khi nghe<select aria-label={'Nhận xét: '+item.id} disabled={busy} value="" onChange={e=>void review(item.id,e.target.value)}><option value="">Chọn nhận xét để lưu</option><option value="natural">Tôi nghe khá liền mạch</option><option value="choppy">Còn rời từng âm</option><option value="reading-error">Nghi sai âm hoặc biến điệu</option><option value="uncertain">Chưa phân biệt được</option></select></label><small>{observations.length?`${observations.length} nhận xét của bạn với cấu hình này`:'Chưa có nhận xét nghe của bạn với cấu hình này'}</small>
    </section>;})}</details>)}</div><section className="panel"><h2>Tự nói và đối chiếu</h2><Recorder onTranscript={setTranscript} onError={notify}/><label>Transcript để xem và sửa<textarea value={transcript} onChange={e=>setTranscript(e.target.value)}/></label><p>Ưu tiên nghe bản ghi của chính bạn. Nhận dạng sai có thể do model, tiếng ồn hoặc nhiều yếu tố khác; không suy ra phát âm sai từ transcript.</p></section>
    <details><summary>Nguồn và phạm vi ghi chú</summary><p>Ghi chú do dự án soạn dựa trên quy tắc đọc liền, không phải giáo viên duyệt âm thanh. Chưa xử lý hết chuỗi nhiều thanh 3 hoặc mọi trường hợp chữ đa âm.</p><p>MOE — quy tắc 一／不 và thanh nhẹ: https://dict.concised.moe.edu.tw/page.jsp?ID=55&amp;la=0&amp;powerMode=0</p><p>Tham khảo nghiên cứu thanh điệu Hoa ngữ, Đại học Chính trị Đài Loan: https://ah.lib.nccu.edu.tw/bitstream/140.119/152670/1/101401.pdf</p></details>
  </>;
}
