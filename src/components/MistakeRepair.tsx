import {QuestionReading} from './QuestionReading';
import {useRef,useState} from 'react';
import {useApp} from '../context';
import {eventFor,grade} from '../core/learning';
import {practiceGrade} from '../core/practice';
import type {Exercise,PracticeItem,LearningEvent,PracticeSet} from '../core/types';
import {Speak} from './common';

export function MistakeRepair({ex,packet,events,resolved}:{ex?:Exercise|PracticeItem;packet?:PracticeSet;events:LearningEvent[];resolved:boolean}){
 const {state,event,notify}=useApp(),last=events.at(-1)!;
 const [open,setOpen]=useState(false),[answer,setAnswer]=useState(''),[help,setHelp]=useState(false),[result,setResult]=useState(''),[busy,setBusy]=useState(false);
 const [showAnswerHelp,setShowAnswerHelp]=useState(false);
 const pending=useRef(false),attempt=useRef(crypto.randomUUID()),reportId='mistake:'+last.item_id;
 function begin(){setOpen(true);setAnswer('');setHelp(false);setShowAnswerHelp(false);setResult('');attempt.current=crypto.randomUUID();}
 async function submit(){
  if(!ex||!answer.trim()||pending.current)return;pending.current=true;setBusy(true);
  const correct='skill' in ex?grade(ex,answer):practiceGrade(ex,answer);
  try{
   const completed=correct===true&&!help;
   await event(eventFor(last.item_id,last.skill,{kind:'mistake-repair',action_key:'repair:'+attempt.current,answer,correct,assisted:help}),completed?{collection:'reports',id:reportId,expected_version:state.objects.reports[reportId]?.version||0,data:{kind:'mistake-resolution',last_error_id:last.id,resolved_at:new Date().toISOString()}}:undefined);
   setResult(completed?'Đã sửa. Lỗi được chuyển sang Đã sửa.':correct?'Đúng với trợ giúp. Bắt đầu lượt mới để thử nhớ lại.':'Chưa đúng. Xem giải thích rồi thử lượt mới.');
  }catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}
 }
 return <section className="panel"><span className="tag">{last.category||'Cần xem lại'} · {events.length} lần sai</span><h3>{ex?.prompt||last.item_id}</h3>{ex&&<QuestionReading resetKey={attempt.current} text={ex.prompt} candidates={ex.stimulus?[ex.stimulus]:[]} disabled={busy} onReveal={open&&!result?async()=>{setHelp(true);return true;}:undefined}/>}<p>Bạn trả lời gần nhất: {last.answer}</p>
 {open&&ex?<>{packet&&!ex.kind.startsWith('cloze')&&ex.kind!=='dictation'&&(packet.skill==='listening'?<Speak text={packet.passage.map(s=>s.hanzi).join(' ')} onError={notify}/>:<p>{packet.passage.map(s=>s.hanzi).join(' ')}</p>)}<p>{!ex.kind.startsWith('cloze')&&ex.stimulus&&['listening','dictation'].includes(ex.kind)?<Speak text={ex.stimulus.hanzi} onError={notify}/>:ex.kind.startsWith('cloze')||['hanzi','order'].includes(ex.kind)?null:ex.stimulus?.hanzi}</p>{ex.choices.length?<div className="choices">{ex.choices.map(c=><div className="choice-with-reading" key={c}><button disabled={busy||!!result} className={answer===c?'selected':''} onClick={()=>setAnswer(c)}>{c}</button><QuestionReading resetKey={attempt.current} text={c} candidates={ex.stimulus?[ex.stimulus]:[]} disabled={busy} onReveal={result?undefined:async()=>{setHelp(true);return true;}}/></div>)}</div>:<label>Thử sửa câu trả lời<input disabled={busy||!!result} value={answer} onChange={e=>setAnswer(e.target.value)}/></label>}<div className="actions"><button disabled={busy||!answer.trim()||!!result} onClick={()=>void submit()}>Kiểm tra bản sửa</button><button onClick={()=>{setHelp(true);setShowAnswerHelp(true);}}>Xem giải thích và đáp án</button></div>{showAnswerHelp&&<div><p>{ex.answers.join(' / ')} — {ex.explanation}</p><QuestionReading text={ex.answers.join(" / ")} candidates={ex.stimulus?[ex.stimulus]:[]}/><QuestionReading text={ex.explanation} candidates={ex.stimulus?[ex.stimulus]:[]}/></div>}{result&&<p role="status">{result}</p>}{result&&!resolved&&<button onClick={begin}>Bắt đầu lượt mới</button>}</>:<><button disabled={!ex} onClick={begin}>{resolved?'Luyện lại':'Luyện sửa'}</button>{!ex&&<p>Chưa tìm thấy nội dung gốc; lịch sử lỗi vẫn được giữ.</p>}</>}
 <small>{new Date(last.timestamp).toLocaleString('vi-VN')}</small></section>;
}
