import {useEffect,useState} from 'react';
import {useApp} from '../context';
import {api} from '../adapters/local';
import type {Status} from '../core/types';

export function ASRControls({onChanged}:{onChanged?:()=>void}){
  const {notify}=useApp();const [status,setStatus]=useState<Status|null>(null),[busy,setBusy]=useState(false);
  useEffect(()=>{api<Status>('/status').then(setStatus).catch(e=>notify(e.message));},[]);
  async function change(model:string){setBusy(true);try{setStatus(await api<Status>('/ai/asr/config',{model}));onChanged?.();notify('Đã chọn model nhận dạng cho lần ghi tiếp theo.');}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
  return <section className="panel"><h2>Nhận dạng lời nói local</h2><label>Model nhận dạng<select aria-label="Model nhận dạng" disabled={!status||busy} value={status?.config.asr_model||'ggml-base.bin'} onChange={e=>void change(e.target.value)}>{status?.available_asr_models?.map(model=><option key={model} value={model}>{model==='ggml-small.bin'?'Whisper small · xử lý lâu hơn':'Whisper base · xử lý nhanh hơn'}</option>)}</select></label><p>Nhận dạng nguyên lời bạn nói, không thêm câu gợi dẫn hay đáp án bài học vào model. Transcript vẫn có thể sai chữ hoặc lẫn Giản thể; hãy xem và sửa trước khi gửi.</p><small>Base và small chạy CPU. Kết quả tốt hơn trên âm tổng hợp chưa bảo đảm tốt hơn với mọi micro, giọng nói hoặc môi trường.</small></section>;
}
