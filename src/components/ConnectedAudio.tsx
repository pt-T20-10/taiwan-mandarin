import {useEffect,useRef,useState} from 'react';
import {playLocalRecording,speech} from '../adapters/local';
import {useApp} from '../context';

export type ConnectedClip={url:string;sha256:string;status:'experimental'};
export function ConnectedAudio({id,phrase,context,clips}:{id:string;phrase:string;context:string;clips:Record<string,ConnectedClip>}){
  const {state,put,notify}=useApp();
  const [heard,setHeard]=useState<{variant:string;voice:string;pace:string;hash?:string}|null>(null);
  const [busy,setBusy]=useState(false);
  const mounted=useRef(true);
  const generation=useRef(0);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++;};},[]);
  const observations=Object.values(state.objects.reports).filter(r=>!r.deleted&&r.data.kind==='pronunciation-listening'&&r.data.sample===id);
  async function listen(variant:'phrase'|'context',candidate:boolean){
    const ticket=++generation.current;
    const clip=clips[`${id}-${variant}`];
    const config=state.objects.settings.speech?.data||{voice:'auto',pace:'normal'};
    try{
      setHeard(null);
      if(candidate)await playLocalRecording(clip.url);else await speech.speak(variant==='phrase'?phrase:context);
      if(mounted.current&&ticket===generation.current)setHeard({variant,voice:candidate?'breezyvoice-experimental':config.voice,pace:candidate?'normal':config.pace,...(candidate?{hash:clip.sha256}:{})});
    }catch(e){if(mounted.current&&ticket===generation.current)notify((e as Error).message);}
  }
  async function review(result:string){
    if(!heard||!result)return;
    setBusy(true);
    try{await put({collection:'reports',id:crypto.randomUUID(),expected_version:0,data:{kind:'pronunciation-listening',sample:id,result,...heard,reviewer:'learner',timestamp:new Date().toISOString()}});notify('Đã lưu nhận xét cho đúng bản audio; không phải chứng nhận phát âm.');}
    catch(e){notify((e as Error).message);}finally{if(mounted.current)setBusy(false);}
  }
  return <div className="connected-audio">
    <p><strong>Bản đọc liền thử nghiệm · BreezyVoice</strong><br/><small>Tổng hợp nguyên cụm/câu, có gợi ý âm đọc cho các trường hợp cần thiết. Chưa được nghe kiểm chứng; nghe và đối chiếu ghi chú trước khi bắt chước.</small></p>
    <div className="actions">{(['phrase','context'] as const).map(variant=><button key={variant} disabled={!clips[`${id}-${variant}`]} onClick={()=>void listen(variant,true)}>{variant==='phrase'?'Nghe cụm mới':'Nghe câu mới'}</button>)}</div>
    {!clips[`${id}-phrase`]&&!clips[`${id}-context`]&&<small>Chưa có bản thử cho ví dụ này. Không tự thay bằng giọng Windows.</small>}
    <details><summary>Đối chiếu với giọng Windows đang chọn</summary><div className="actions"><button onClick={()=>void listen('phrase',false)}>Nghe cụm bằng Windows</button><button onClick={()=>void listen('context',false)}>Nghe câu bằng Windows</button></div></details>
    <label>Nhận xét sau khi nghe{heard&&<small>{heard.voice==='breezyvoice-experimental'?'BreezyVoice thử nghiệm':'Giọng Windows'} · {heard.variant==='phrase'?'cụm':'câu'}</small>}<select aria-label={'Nhận xét: '+id} disabled={busy||!heard} value="" onChange={e=>void review(e.target.value)}><option value="">{heard?'Chọn nhận xét để lưu':'Nghe một bản trước khi nhận xét'}</option><option value="natural">Tôi nghe khá liền mạch</option><option value="choppy">Còn rời từng âm</option><option value="reading-error">Nghi sai âm hoặc biến điệu</option><option value="uncertain">Chưa phân biệt được</option></select></label>
    <small>{observations.length} nhận xét của bạn cho ví dụ này; mỗi nhận xét lưu riêng giọng và bản audio.</small>
  </div>;
}
