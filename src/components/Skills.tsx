import {useEffect,useRef,useState} from 'react';
import {useApp} from '../context';
import {Handwriting,Recorder,Speak} from './common';
import {PracticeText} from './PracticeText';
import {eventFor} from '../core/learning';
import {choosePacket,practiceGrade,practiceSession,practiceAudio} from '../core/practice';
import type {PracticeSession,PracticeSet,PracticeSkill,Unit} from '../core/types';
import {api,chatModel,speech,storage} from '../adapters/local';
import {generatePractice} from '../adapters/practice';

const pendingSaves=new Set<Promise<unknown>>();
function tracked<T>(operation:Promise<T>):Promise<T>{const task=operation.finally(()=>pendingSaves.delete(task));pendingSaves.add(task);return task;}

const labels:Record<string,string>={listening:'Nghe',speaking:'Nói',reading:'Đọc',writing:'Viết diễn đạt',stroke:'Viết chữ'};
export function Skills({route='skills'}:{route?:string}){
 const {content,event,notify}=useApp();const parts=route.split('/'),unit=content.units.find(u=>u.id===parts[1])||content.units[0],skill=parts[2] in labels?parts[2]:'reading';
 function navigate(u:string,s:string){speech.stop();location.hash=`skills/${u}/${s}`;}
 return <><h1>Luyện kỹ năng</h1><p><a href="#pronunciation">Phát âm, biến điệu và nhịp câu →</a></p><div className="tabs">{Object.entries(labels).map(([key,label])=><button key={key} className={skill===key?'active':''} onClick={()=>navigate(unit.id,key)}>{label}</button>)}</div><label>Chủ đề<select value={unit.id} onChange={e=>navigate(e.target.value,skill)}>{content.units.map(u=><option value={u.id} key={u.id}>{u.title}</option>)}</select></label>{skill==='stroke'?<Handwriting initial={unit.character} onComplete={character=>event(eventFor(character,'writing',{kind:'stroke'})).catch(e=>notify(e.message))}/>:<SkillPractice key={unit.id+skill} unit={unit} skill={skill as PracticeSkill}/>}</>;
}

function SkillPractice({unit,skill}:{unit:Unit;skill:PracticeSkill}){
 const {state,refresh,notify}=useApp();
 const matches=(s:PracticeSession)=>s.scope==='skills'&&s.unit_id===unit.id&&s.skill===skill;
 const saved=Object.values(state.objects.sessions).filter(o=>!o.deleted&&matches(o.data)).map(o=>o.data as PracticeSession).sort((a,b)=>a.created_at.localeCompare(b.created_at));
 const [session,setSession]=useState<PracticeSession|undefined>(saved.filter(s=>s.phase!=='summary').at(-1));
 const current=useRef(session),version=useRef(session?state.objects.sessions['skills:'+session.run]?.version||0:0),chain=useRef(Promise.resolve()),pending=useRef(0),blocked=useRef(false),mounted=useRef(true),locked=useRef(true);
 const [saving,setSaving]=useState(false),[busy,setBusy]=useState(true),[feedback,setFeedback]=useState<{answer:string;correct:boolean|null;ex:PracticeSet['items'][number]}|null>(null),[showTranscript,setShowTranscript]=useState(false),[hint,setHint]=useState(false),[aiFeedback,setAIFeedback]=useState(''),[progress,setProgress]=useState('');
 const generation=useRef<string|null>(null),feedbackRequest=useRef<string|null>(null);
 function cancelAI(){const id=generation.current;generation.current=null;if(id)void chatModel.cancel(id).catch(()=>{});if(mounted.current){setProgress('');setBusy(false);locked.current=false;}}
 useEffect(()=>{mounted.current=true;
  void (async()=>{try{
   await Promise.allSettled([...pendingSaves]);const fresh=await storage.load();if(!mounted.current)return;
   const rows=Object.values(fresh.objects.sessions).filter(o=>!o.deleted&&matches(o.data)).sort((a,b)=>a.data.created_at.localeCompare(b.data.created_at));
   const row=rows.filter(o=>o.data.phase!=='summary').at(-1)||rows.at(-1);
   version.current=row?.version||0;current.current=row?.data;setSession(row?.data);await refresh();
  }catch(e){if(mounted.current){blocked.current=true;notify((e as Error).message);}}finally{if(mounted.current){setBusy(false);locked.current=false;}}})();
  const prevent=(e:BeforeUnloadEvent)=>{if(pending.current){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',prevent);return()=>{mounted.current=false;cancelAI();if(feedbackRequest.current)void chatModel.cancel(feedbackRequest.current).catch(()=>{});speech.stop();window.removeEventListener('beforeunload',prevent);};},[]);
 function update(next:PracticeSession){current.current=next;setSession(next);}
 function persist(next:PracticeSession){
  update(next);pending.current++;setSaving(true);
  const task=tracked(chain.current.then(async()=>{if(blocked.current)throw Error('Chưa lưu được bản nháp. Hãy tải lại sau khi sao chép nội dung.');const result=await storage.put({collection:'sessions',id:'skills:'+next.run,expected_version:version.current,data:next});version.current=result.version;}));
  chain.current=task.catch(e=>{blocked.current=true;if(mounted.current)notify((e as Error).message);}).finally(()=>{pending.current--;if(mounted.current)setSaving(pending.current>0);});return task;
 }
 async function flush(){await chain.current;if(blocked.current)throw Error('Bản nháp chưa lưu được; giữ nội dung hiện tại để sao chép.');}
 async function assist(){const s=current.current;if(!s)return false;try{await persist({...s,assisted:true});return true;}catch{return false;}}
 async function install(packet:PracticeSet,cycle:number){
  await flush();
  const fresh=await storage.load(),rid=`skills-history:${unit.id}:${skill}`,record=fresh.objects.reports[rid];
  if(packet.source==='authored'){
   const selection=choosePacket((unit.practice_sets||[]).filter(p=>p.skill===skill),Object.values(fresh.objects.sessions).filter(o=>!o.deleted&&matches(o.data)).map(o=>o.data as PracticeSession));
   packet=selection.packet;cycle=selection.cycle;
  }
  const next=practiceSession(unit.id,packet,cycle);
  const history=record?.data.runs||[];
  // History and session are written together; concurrent tabs must retry on conflict.
  await tracked(api('/practice/sessions',{mutations:[{collection:'sessions',id:'skills:'+next.run,expected_version:0,data:next},{collection:'reports',id:rid,expected_version:record?.version||0,data:{kind:'skills-history',runs:[...history,{run:next.run,packet_id:packet.id,source:packet.source,cycle}],...(packet.source==='ai'?{last_ai_packet:packet}:{})}}]}));
  if(!mounted.current)return;version.current=1;blocked.current=false;update(next);setFeedback(null);setHint(false);setShowTranscript(false);setAIFeedback('');speech.stop();await refresh();
 }
 async function newSet(){if(locked.current)return;locked.current=true;setBusy(true);try{
  await flush();const fresh=await storage.load();const history=Object.values(fresh.objects.sessions).filter(o=>!o.deleted&&matches(o.data)).map(o=>o.data as PracticeSession);
  const choice=choosePacket((unit.practice_sets||[]).filter(p=>p.skill===skill),history);if(!choice.packet)throw Error('Chưa có ngân hàng v7. Hãy cập nhật gói nội dung.');await install(choice.packet,choice.cycle);
 }catch(e){notify((e as Error).message);}finally{if(mounted.current){setBusy(false);locked.current=false;}}}
 async function createAI(){if(locked.current)return;locked.current=true;setBusy(true);const id=crypto.randomUUID();generation.current=id;
  try{await flush();if(generation.current!==id)return;const packet=await generatePractice(unit.id,skill,id,message=>{if(mounted.current&&generation.current===id)setProgress(message);},()=>mounted.current&&generation.current===id);if(mounted.current&&generation.current===id)await install(packet,0);}
  catch(e){if(mounted.current&&generation.current===id)notify((e as Error).message);}finally{if(generation.current===id){generation.current=null;if(mounted.current){setBusy(false);setProgress('');locked.current=false;}}}
 }
 async function resume(s:PracticeSession){if(locked.current)return;locked.current=true;setBusy(true);try{await flush();const fresh=await storage.load();const row=fresh.objects.sessions['skills:'+s.run];version.current=row.version;update(row.data);setFeedback(null);setHint(false);setShowTranscript(false);setAIFeedback('');speech.stop();}catch(e){notify((e as Error).message);}finally{setBusy(false);locked.current=false;}}
 async function submit(skip=false){const s=current.current;if(!s||locked.current)return;const q=s.packet.items[s.index];if(!q)return;if(!skip&&!s.draft?.trim()&&skill!=='speaking')return;locked.current=true;setBusy(true);
  try{await flush();const answer=skip?'[bỏ qua]':s.draft||'[tự xác nhận đã luyện nói]',correct=skip?null:practiceGrade(q,answer);
   const next:PracticeSession={...s,index:s.index+1,phase:s.index+1===s.packet.items.length?'summary':'exercise',answers:[...s.answers,{id:q.id,answer,correct,assisted:!!s.assisted,skipped:skip}],draft:'',assisted:false};
   await tracked(storage.event(eventFor(q.id,skill,{action_key:`skills:${s.run}:${q.id}`,kind:'practice',answer,source:s.packet.source,correct:s.packet.source==='ai'?null:correct,assisted:!!s.assisted,category:correct===false&&s.packet.source==='authored'?'Luyện '+labels[skill]:''}),{collection:'sessions',id:'skills:'+s.run,expected_version:version.current,data:next}));
   version.current++;update(next);setFeedback({ex:q,answer,correct});setHint(false);setShowTranscript(false);setAIFeedback('');speech.stop();await refresh();
  }catch(e){notify((e as Error).message);}finally{if(mounted.current){setBusy(false);locked.current=false;}}
 }
 async function feedbackAI(){const s=current.current;if(!s?.draft||locked.current)return;locked.current=true;setBusy(true);const id=crypto.randomUUID();feedbackRequest.current=id;try{await assist();const r=await chatModel.reply([{role:'user',content:s.draft}],id,'feedback');if(mounted.current)setAIFeedback(r.hanzi+'\n'+r.vi+'\n'+r.feedback);}catch(e){if(mounted.current)notify((e as Error).message);}finally{feedbackRequest.current=null;if(mounted.current){setBusy(false);locked.current=false;}}}
 const q=session?.packet.items[session.index],isClosed=skill==='reading'||skill==='listening',hiddenPassage=q?.kind.startsWith('cloze')||q?.kind==='dictation';
 return <section className="panel skill-practice"><h2>Luyện {labels[skill].toLowerCase()} theo chủ đề</h2><p>{isClosed?'Trả lời hoặc bỏ qua từng câu, rồi xem tổng kết.':'Luyện từng mục và tự đối chiếu; không tự chấm phát âm hoặc bài viết.'} Bản nháp được tự lưu.</p><div className="actions"><button disabled={busy||blocked.current} onClick={()=>void newSet()}>Bộ đề mới</button><button disabled={busy||blocked.current} onClick={()=>void createAI()}>Tạo đề bằng AI</button>{generation.current&&<button onClick={cancelAI}>Hủy tạo đề</button>}<button onClick={()=>speech.stop()}>Dừng audio</button></div>{progress&&<p role="status">{progress}</p>}<small role="status">{saving?'Đang lưu bản nháp…':blocked.current?'Chưa lưu được bản nháp.':'Đã lưu.'}</small>
 {saved.length>0&&<details><summary>Bài đang dở và lịch sử ({saved.length})</summary><div className="actions">{[...saved].reverse().map(s=><button disabled={busy} key={s.run} onClick={()=>void resume(s)}>{s.packet.title} · {s.packet.source==='ai'?'AI · ':''}{s.phase==='summary'?'Đã xong':`${s.index}/${s.packet.items.length}`} · {new Date(s.created_at).toLocaleString('vi-VN')}</button>)}</div></details>}
 {!session?<p>Chọn “Bộ đề mới” để bắt đầu. Có ba bộ soạn sẵn cho mỗi kỹ năng.</p>:<><h3>{session.packet.title}</h3><p>{session.packet.source==='ai'?'AI tạo · Chưa kiểm chứng · Không tính vào điểm bài soạn sẵn.':`Bộ soạn sẵn · vòng ôn ${session.cycle}${session.cycle>1?' · Đã hết ngân hàng, bắt đầu vòng mới.':''} · Nội dung bản nháp, chưa giáo viên duyệt.`}</p>
 {feedback?<div className="feedback"><h3>{feedback.correct===null?'Đã ghi nhận':feedback.correct?'Đáp án khớp':'Cùng đối chiếu'}</h3><p>Bạn trả lời: {feedback.answer}</p><p>{isClosed?'Đáp án':'Câu tham khảo'}: {feedback.ex.answers.join(' / ')}</p><p>{feedback.ex.explanation}</p>{feedback.ex.stimulus&&<PracticeText key={'answer'+feedback.ex.id} items={[feedback.ex.stimulus]}/>}<button onClick={()=>setFeedback(null)}>Tiếp tục →</button></div>:session.phase==='summary'?<div className="summary"><h3>Đã hoàn thành bộ luyện</h3><p>{!isClosed?`${session.answers.filter(a=>!a.skipped).length} lượt đã luyện · ${session.answers.filter(a=>a.skipped).length} bỏ qua.`:<>{session.answers.filter(a=>a.correct===true&&!a.assisted&&!a.skipped).length} đúng độc lập · {session.answers.filter(a=>a.assisted).length} có trợ giúp · {session.answers.filter(a=>a.skipped).length} bỏ qua.</>}</p><p>{session.packet.source==='ai'?'Kết quả đối chiếu với đáp án AI, chưa kiểm chứng.':!isClosed?'Nói/viết không có điểm đúng sai tự động.':'Điểm này chỉ thuộc bộ luyện, không đổi lịch flashcard.'}</p></div>:q&&<div className="practice-question" key={session.run+q.id}><p>Câu {session.index+1}/{session.packet.items.length}</p><h3>{q.prompt}</h3>
 {skill==='reading'&&!hiddenPassage&&<PracticeText key={session.run+q.id} items={session.packet.passage} onReveal={assist} disabled={busy}/>}
 {skill==='listening'&&<><Speak text={practiceAudio(session.packet,q)} label="Nghe đề bài" onError={notify}/>{!hiddenPassage&&<button disabled={busy} onClick={async()=>{if(!showTranscript&&!await assist())return;setShowTranscript(!showTranscript);}}>{showTranscript?'Ẩn':'Hiện'} transcript</button>}{showTranscript&&!hiddenPassage&&<PracticeText items={session.packet.passage} onReveal={assist} disabled={busy}/>}</>}
 {q.kind==='read-aloud'&&q.stimulus&&<PracticeText items={[q.stimulus]} onReveal={assist} disabled={busy}/>}
 {skill==='speaking'&&<Recorder key={q.id} onTranscript={value=>{if(current.current?.index===session.index)void persist({...current.current,draft:value}).catch(()=>{});}} onError={notify}/>}
 {q.choices.length>0?<div className="choices">{q.choices.map(choice=><button disabled={busy} key={choice} className={session.draft===choice?'selected':''} onClick={()=>void persist({...current.current!,draft:choice}).catch(()=>{})}>{choice}</button>)}</div>:<label>{skill==='speaking'?'Transcript / câu trả lời để đối chiếu':'Câu trả lời'}<textarea disabled={busy} value={session.draft||''} rows={skill==='writing'?6:3} onChange={e=>void persist({...current.current!,draft:e.target.value}).catch(()=>{})}/></label>}
 {hint&&<div className="hint">{q.answers.join(' / ')}{q.stimulus&&<PracticeText items={[q.stimulus]}/>}</div>}
 <div className="actions"><button className="primary" disabled={busy||(!session.draft?.trim()&&skill!=='speaking')} onClick={()=>void submit()}>{isClosed?'Kiểm tra':skill==='speaking'?'Tôi đã luyện câu này':'Lưu bài viết'}</button><button disabled={busy} onClick={()=>void submit(true)}>Bỏ qua câu này</button>{skill!=='writing'&&<button disabled={busy} onClick={async()=>{if(await assist())setHint(!hint);}}>{hint?'Ẩn gợi ý':'Xem gợi ý / câu mẫu'}</button>}{skill==='writing'&&<button disabled={busy||!session.draft?.trim()} onClick={()=>void feedbackAI()}>Góp ý câu bằng AI local</button>}</div>{aiFeedback&&<p className="notice pre-wrap">AI tạo, cần đối chiếu: {aiFeedback}</p>}
 </div>}</>}
 </section>;
}
