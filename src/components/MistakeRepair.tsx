import {useRef,useState} from 'react';
import {useApp} from '../context';
import {eventFor,grade} from '../core/learning';
import {practiceGrade} from '../core/practice';
import type {Exercise,PracticeItem,LearningEvent,PracticeSet} from '../core/types';
import {Speak} from './common';

export function MistakeRepair({ex,packet,events,resolved}:{ex?:Exercise|PracticeItem;packet?:PracticeSet;events:LearningEvent[];resolved:boolean}){
 const {state,event,notify}=useApp(),last=events.at(-1)!;
 const [open,setOpen]=useState(false),[answer,setAnswer]=useState(''),[help,setHelp]=useState(false),[result,setResult]=useState(''),[busy,setBusy]=useState(false);
 const pending=useRef(false),attempt=useRef(crypto.randomUUID()),reportId='mistake:'+last.item_id;
 function begin(){setOpen(true);setAnswer('');setHelp(false);setResult('');attempt.current=crypto.randomUUID();}
 async function submit(){
  if(!ex||!answer.trim()||pending.current)return;pending.current=true;setBusy(true);
  const correct='skill' in ex?grade(ex,answer):practiceGrade(ex,answer);
  try{
   const completed=correct===true&&!help;
   await event(eventFor(last.item_id,last.skill,{kind:'mistake-repair',action_key:'repair:'+attempt.current,answer,correct,assisted:help}),completed?{collection:'reports',id:reportId,expected_version:state.objects.reports[reportId]?.version||0,data:{kind:'mistake-resolution',last_error_id:last.id,resolved_at:new Date().toISOString()}}:undefined);
   setResult(completed?'Đã sửa. Lỗi được chuyển sang Đã sửa.':correct?'Đúng với trợ giúp. Bắt đầu lượt mới để thử nhớ lại.':'Chưa đúng. Xem giải thích rồi thử lượt mới.');
  }catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}
 }
 return <section className="panel"><span className="tag">{last.category||'Cần xem lại'} · {events.length} lần sai</span><h3>{ex?.prompt||last.item_id}</h3><p>Bạn trả lời gần nhất: {last.answer}</p>
 {open&&ex?<>{packet&&!ex.kind.startsWith('cloze')&&ex.kind!=='dictation'&&(packet.skill==='listening'?<Speak text={packet.passage.map(s=>s.hanzi).join(' ')} onError={notify}/>:<p>{packet.passage.map(s=>s.hanzi).join(' ')}</p>)}<p>{!ex.kind.startsWith('cloze')&&ex.stimulus&&['listening','dictation'].includes(ex.kind)?<Speak text={ex.stimulus.hanzi} onError={notify}/>:ex.kind.startsWith('cloze')?null:ex.stimulus?.hanzi}</p>{ex.choices.length?<div className="choices">{ex.choices.map(c=><button disabled={busy||!!result} key={c} className={answer===c?'selected':''} onClick={()=>setAnswer(c)}>{c}</button>)}</div>:<label>Thử sửa câu trả lời<input disabled={busy||!!result} value={answer} onChange={e=>setAnswer(e.target.value)}/></label>}<div className="actions"><button disabled={busy||!answer.trim()||!!result} onClick={()=>void submit()}>Kiểm tra bản sửa</button><button onClick={()=>setHelp(true)}>Xem giải thích và đáp án</button></div>{help&&<p>{ex.answers.join(' / ')} — {ex.explanation}</p>}{result&&<p role="status">{result}</p>}{result&&!resolved&&<button onClick={begin}>Bắt đầu lượt mới</button>}</>:<><button disabled={!ex} onClick={begin}>{resolved?'Luyện lại':'Luyện sửa'}</button>{!ex&&<p>Chưa tìm thấy nội dung gốc; lịch sử lỗi vẫn được giữ.</p>}</>}
 <small>{new Date(last.timestamp).toLocaleString('vi-VN')}</small></section>;
}
