import {useEffect,useRef,useState} from 'react';
import type {Layers,TextItem} from '../core/types';
import {encodeWav,recognition,speech} from '../adapters/local';
import {useApp} from '../context';

export function LayerText({item,layers,newWord,force=false}:{item:TextItem;layers:Layers;newWord?:boolean;force?:boolean}){
  const {state,notify}=useApp();
  const isNew=newWord??!Object.values(state.objects.cards).some(c=>!c.deleted&&c.data.word.hanzi===item.hanzi&&c.data.schedule.reps>0);
  const [revealed,setRevealed]=useState<Record<string,boolean>>({});
  useEffect(()=>setRevealed({}),[item.hanzi]);
  return <div className="layers">{(['hanzi','pinyin','vi'] as const).map(key=>{
    const mode=force?'show':layers[key];if(mode==='hide'||(mode==='new'&&!isNew)||!item[key])return null;
    const visible=mode==='show'||mode==='new'||revealed[key];
    return visible?<div key={key} className={key+' text-with-audio'} lang={key==='hanzi'?'zh-TW':undefined}><span>{item[key]}</span>{key!=='vi'&&item.hanzi&&<Speak text={item.hanzi} label={'Nghe '+(key==='hanzi'?'Hán tự':'Pinyin')} onError={notify}/>}</div>:<button className="reveal" key={key} onClick={()=>setRevealed({...revealed,[key]:true})}>Hiện {key==='hanzi'?'Hán tự':key==='pinyin'?'Pinyin':'nghĩa Việt'}</button>;
  })}</div>;
}
export function Speak({text,onError,label}:{text:string;onError:(s:string)=>void;label?:string}){return <button type="button" className="icon-button" aria-label={label} title="Nghe cả từ/cụm/câu bằng giọng Đài Loan local" onClick={()=>speech.speak(text).catch(e=>onError(e.message))}>◖)) <span>Nghe</span></button>;}
export function Scratchpad(){
  const canvas=useRef<HTMLCanvasElement>(null),down=useRef(false),last=useRef([0,0]);
  function point(e:React.PointerEvent){const r=e.currentTarget.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*300/r.height];}
  return <div><div className="writing-pad"><svg viewBox="0 0 300 300" aria-hidden="true"><path d="M150 0V300M0 150H300" stroke="#dddcc9" strokeDasharray="5 5"/></svg><canvas ref={canvas} width={300} height={300} aria-label="Viết chữ từ trí nhớ" onPointerDown={e=>{down.current=true;last.current=point(e);e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!down.current)return;const p=point(e),c=canvas.current!.getContext('2d')!;c.strokeStyle='#245f50';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(...last.current as [number,number]);c.lineTo(...p as [number,number]);c.stroke();last.current=p;}} onPointerUp={()=>down.current=false} onPointerCancel={()=>down.current=false}/></div><button onClick={()=>canvas.current?.getContext('2d')?.clearRect(0,0,300,300)}>Xóa bảng viết</button><small>Tự viết trước khi lật thẻ rồi đối chiếu; bảng nháp không chấm thư pháp và không lưu ảnh.</small></div>;
}
export function Recorder({onTranscript,onError}:{onTranscript:(s:string)=>void;onError:(s:string)=>void}){
  const [recording,setRecording]=useState(false),[busy,setBusy]=useState(false),[url,setUrl]=useState(''),[blob,setBlob]=useState<Blob|null>(null),[seconds,setSeconds]=useState(0);
  const [asrNote,setAsrNote]=useState('');const abort=useRef<AbortController|null>(null);
  const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),mounted=useRef(true);
  function stop(){if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(timer.current)clearInterval(timer.current);setRecording(false);}
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;abort.current?.abort();if(recorder.current?.state==='recording')recorder.current.stop();stream.current?.getTracks().forEach(t=>t.stop());if(timer.current)clearInterval(timer.current);};},[]);
  useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);},[url]);
  async function start(){try{speech.stop();stream.current=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});if(!mounted.current){stream.current.getTracks().forEach(t=>t.stop());return;}
    const r=new MediaRecorder(stream.current);recorder.current=r;const chunks:BlobPart[]=[];r.ondataavailable=e=>chunks.push(e.data);r.onstop=()=>{if(!mounted.current)return;const b=new Blob(chunks,{type:r.mimeType});setBlob(b);setUrl(URL.createObjectURL(b));};r.start();setSeconds(0);setRecording(true);let count=0;timer.current=setInterval(()=>{count++;setSeconds(count);if(count>=60)stop();},1000);
  }catch(e){stream.current?.getTracks().forEach(t=>t.stop());onError('Không mở được micro. Cấp quyền micro cho localhost trong trình duyệt/Windows, hoặc tiếp tục gõ chữ. '+(e as Error).message);}}
  async function transcribe(){if(!blob)return;setBusy(true);setAsrNote('');abort.current=new AbortController();try{const result=await recognition.transcribe(await encodeWav(blob),abort.current.signal);if(mounted.current){onTranscript(result.text);setAsrNote(result.notice+` (${(result.elapsed_ms/1000).toFixed(1)} giây)`);}}catch(e){if((e as Error).name==='AbortError'){if(mounted.current)setAsrNote('Đã hủy nhận dạng.');}else if(mounted.current)onError((e as Error).message);}finally{if(mounted.current)setBusy(false);}}
  return <div className="recorder"><div className="actions"><button onClick={recording?stop:start} disabled={busy} className={recording?'danger':''}>{recording?`■ Dừng ghi (${seconds}s)`:'● Ghi âm'}</button><button disabled={!blob||busy||recording} onClick={transcribe}>{busy?'Đang nhận dạng…':'Nhận dạng local'}</button>{busy&&<button onClick={()=>abort.current?.abort()}>Hủy nhận dạng</button>}</div>{url&&<audio controls src={url}/>}<small>Ghi tối đa 60 giây. Nghe lại, nhận dạng rồi sửa transcript trước khi gửi. Không lưu bản ghi lâu dài.</small>{asrNote&&<p role="status">{asrNote}</p>}</div>;
}

export {Handwriting} from './Handwriting';
