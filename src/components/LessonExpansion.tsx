import {useEffect,useRef,useState} from 'react';
import {useApp} from '../context';
import {speech,storage} from '../adapters/local';
import {canSubmitKey,eventFor} from '../core/learning';
import {advanceExpansion,expansionDone,expansionHistory,expansionRoute,expansionSessionId,expansionsFor,newExpansionRun,submitExpansion} from '../core/lessonExpansion';
import type {ExpansionRun} from '../core/lessonExpansion';
import type {ExpansionLesson} from '../core/lessonExpansionTypes';
import type {AppState,TextItem} from '../core/types';
import {StudyCard,StudyText} from './StudyText';
import {Speak} from './common';
import {useActiveTimer} from '../core/useActiveTimer';
import {LearnOption} from './LearnOption';
import {gradeAnswer} from '../adapters/answerGrading';
import '../lesson-expansion.css';

const pendingWrites=new Set<Promise<unknown>>();
function track<T>(promise:Promise<T>){pendingWrites.add(promise);void promise.finally(()=>pendingWrites.delete(promise)).catch(()=>{});return promise;}

function Example({item,words}:{item:TextItem;words:TextItem[]}){
 const {notify}=useApp();
 return <div className="expansion-example"><p lang="zh-TW"><StudyText text={item.hanzi} words={words}/></p><p className="pinyin">{item.pinyin}</p><p>{item.vi}</p><div className="actions"><Speak text={item.hanzi} onError={notify}/></div></div>;
}
export function ExpansionLinks({unitId}:{unitId:string}){
 const {state}=useApp(),lessons=expansionsFor(unitId);
 return <div className="expansion-links"><h4>Quy tắc & vận dụng · {lessons.length} bài</h4>{lessons.map(l=><a key={l.id} href={'#'+expansionRoute(l)}><span aria-label={expansionDone(state,l.id)?'Đã học':'Chưa học'}>{expansionDone(state,l.id)?'✓':'＋'}</span><span>{l.title}</span><b>↗</b></a>)}</div>;
}
export function LessonExpansion({lesson,historyRun,epoch}:{lesson:ExpansionLesson;historyRun?:string;epoch?:string}){
 const [fresh,setFresh]=useState<AppState>(),[error,setError]=useState('');
 useEffect(()=>{let mounted=true;void(async()=>{try{await Promise.allSettled([...pendingWrites]);const state=await storage.load();if(mounted)setFresh(state);}catch(e){if(mounted)setError((e as Error).message);}})();return()=>{mounted=false;};},[]);
 if(error)return <section className="panel"><h1>Chưa tải được lượt học</h1><p>{error}</p><button onClick={()=>location.reload()}>Tải lại</button></section>;
 if(!fresh)return <p>Đang mở bài và bản nháp đã lưu…</p>;
 return <ExpansionSession lesson={lesson} historyRun={historyRun} initialState={fresh} epoch={epoch}/>;
}
function ExpansionSession({lesson,historyRun,initialState,epoch}:{lesson:ExpansionLesson;historyRun?:string;initialState:AppState;epoch?:string}){
 const {content,refresh,notify}=useApp();
 const initialHistory=expansionHistory(initialState,lesson.id);
 const savedRow=historyRun?initialHistory.find(r=>r.data.run===historyRun):initialHistory[0];
 const row=savedRow?.data.packet.questions.every(q=>lesson.questions.some(current=>current.id===q.id))?savedRow:undefined;
 const [session,setSession]=useState<ExpansionRun>(()=>row?.data||({...newExpansionRun(lesson),epoch}));
 const current=useRef(session),version=useRef(row?.version||0),queue=useRef(Promise.resolve()),failed=useRef(false),lock=useRef(false);
 const [busy,setBusy]=useState(false),[saveError,setSaveError]=useState(''),[saveState,setSaveState]=useState(''),[showRule,setShowRule]=useState(false);
 const [heard,setHeard]=useState(false);
 const alive=useRef(true),audioGeneration=useRef(0),timer=useActiveTimer(session.phase==='exercise'&&!session.submitted&&!busy);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;audioGeneration.current++;speech.stop();};},[]);
 const packet={...session.packet,blocks:lesson.blocks},q=packet.questions[session.index],id=expansionSessionId(session);
 const historyMissing=!!historyRun&&!row;
 function update(next:ExpansionRun){current.current=next;if(alive.current)setSession(next);}
 async function write(next:ExpansionRun){
  const result=await track(storage.put({collection:'sessions',id:expansionSessionId(next),expected_version:version.current,data:next}));
  version.current=result.version;
 }
 // Keep every draft in order; after a conflict stop the queue and retain local
 // input. Never retry an old draft against a fresh version from another tab.
 function draft(value:string){
  if(lock.current)return;
  const next={...current.current,draft:value};update(next);setSaveState('Đang lưu…');
  queue.current=queue.current.then(async()=>{if(failed.current)return;await write(next);if(alive.current)setSaveState('Đã lưu trên máy');}).catch((e:Error)=>{failed.current=true;if(alive.current){setSaveError(e.message);setSaveState('Chưa lưu');}});
  track(queue.current);
 }
 function optionHelp(){
  if(current.current.assisted||current.current.submitted||failed.current)return;
  const next={...current.current,assisted:true};update(next);
  queue.current=queue.current.then(async()=>{if(!failed.current)await write(next);}).catch((e:Error)=>{failed.current=true;setSaveError(e.message);});track(queue.current);
 }
 async function act(operation:()=>Promise<void>){
  if(lock.current)return;lock.current=true;setBusy(true);
  try{await queue.current;if(failed.current)throw Error('Bản nháp chưa lưu. Sao chép câu trả lời trước khi tải lại để lấy dữ liệu mới.');await operation();}
  catch(e){const message=(e as Error).message;if(alive.current)setSaveError(message);notify(message);}
  finally{lock.current=false;if(alive.current)setBusy(false);}
 }
 async function save(next:ExpansionRun){await write(next);update(next);await refresh();}
 async function startNew(){await act(async()=>{const fresh=({...newExpansionRun(lesson),epoch});await track(storage.put({collection:'sessions',id:expansionSessionId(fresh),expected_version:0,data:fresh}));await refresh();location.hash=expansionRoute(lesson)+'/'+fresh.run;});}
 async function submit(skip=false){await act(async()=>{
  setSaveError('');
  const s=current.current;if(q.kind==='listening'&&!heard&&!skip)throw Error('Hãy nghe câu trước, hoặc bỏ qua nếu chưa có giọng.');
  const next=submitExpansion(s,s.draft,skip),result=next.answers.at(-1)!;
  if(!skip&&!q.choices.length){
   const graded=await gradeAnswer({mode:q.kind==='translate_vi'?'to_vi':q.kind==='translate_zh'?'to_zh':'gap',answer:s.draft,reference:q.answers[0],meaning:q.solution.vi,sentence:q.solution.hanzi,template:q.kind==='input'?q.prompt.split(' — ').at(-1):''});
   result.correct=graded.correct;result.feedback=graded.feedback;result.grader=graded.grader;
  }
  // Supplemental practice stays out of core lesson scores and FSRS.
  await track(storage.event(eventFor(q.id,q.kind==='listening'?'listening':'grammar',{kind:'practice',correct:null,answer:result.answer,assisted:s.assisted,action_key:`${id}:${s.index}`,duration_ms:timer.consume()}),{collection:'sessions',id,expected_version:version.current,data:next}));
  version.current++;update(next);audioGeneration.current++;speech.stop();await refresh();
 });}
 async function regrade(){await act(async()=>{setSaveError('');const s=current.current,a=s.answers.at(-1)!;
  const graded=await gradeAnswer({mode:q.kind==='translate_vi'?'to_vi':q.kind==='translate_zh'?'to_zh':'gap',answer:a.answer,reference:q.answers[0],meaning:q.solution.vi,sentence:q.solution.hanzi,template:q.kind==='input'?q.prompt.split(' — ').at(-1):''});
  await save({...s,answers:[...s.answers.slice(0,-1),{...a,correct:graded.correct,feedback:graded.feedback,grader:graded.grader}]});
 });}
 async function hint(){audioGeneration.current++;speech.stop();await act(async()=>{await save({...current.current,assisted:true});setShowRule(true);});}
 async function playQuestion(){
  const generation=++audioGeneration.current;
  try{await speech.speak(q.solution.hanzi);if(alive.current&&generation===audioGeneration.current)setHeard(true);}
  catch(e){notify((e as Error).message);}
 }
 const nextLesson=expansionsFor(lesson.unit_id)[expansionsFor(lesson.unit_id).findIndex(l=>l.id===lesson.id)+1];
 const nextUnit=content.units[content.units.findIndex(u=>u.id===lesson.unit_id)+1];
 if(historyMissing)return <section className="panel"><h1>Không tìm thấy lượt học này</h1><a href={'#'+expansionRoute(lesson)}>Mở bài hiện tại →</a></section>;
 return <div className="expansion-page"><div className="breadcrumbs"><a href="#learn">← Lộ trình</a><span>Quy tắc & vận dụng</span></div><h1>{packet.title}</h1><p>{packet.objective}</p>
 {(packet.questions.length!==lesson.questions.length||packet.questions.some((q,i)=>q.id!==lesson.questions[i]?.id))&&<p className="notice">Lượt đã lưu giữ nguyên {packet.questions.length} câu. Bài đã có bộ {lesson.questions.length} câu vận dụng mới, tách khỏi ví dụ. <button disabled={busy||failed.current} onClick={()=>void startNew()}>Bắt đầu lượt 10 câu mới</button></p>}
 {saveError&&<div className="notice" role="alert">{saveError} <button onClick={()=>{navigator.clipboard.writeText(current.current.draft).then(()=>notify('Đã sao chép câu trả lời.'),()=>notify('Hãy chọn và sao chép trực tiếp trong ô trả lời.'));}}>Sao chép câu trả lời</button></div>}
 {session.phase==='intro'?<>
  <p className="notice">Nên biết trước: {packet.prerequisite} Bạn có thể mở bài bất cứ lúc nào.</p>
  <section className="panel"><h2>Từ và cụm cần dùng</h2><div className="study-card-grid">{packet.vocabulary.map(w=><StudyCard key={w.hanzi} word={w} compact markable={false}/>)}</div></section>
  {packet.blocks.map(b=><section className="panel" key={b.title}><h2>{b.title}</h2><p>{b.rule}</p><div className="expansion-examples">{b.examples.map((e,i)=><Example key={i} item={e} words={packet.vocabulary}/>)}</div></section>)}
  <aside className="notice"><strong>Chỗ dễ nhầm:</strong> {packet.pitfall}</aside>
  <p>Pinyin ghi thanh cơ sở của 一 / 不; khi đọc liền có thể biến điệu. Nút Nghe dùng giọng Đài Loan đã chọn trên máy.</p>
  <button className="primary" disabled={busy||failed.current} onClick={()=>void act(()=>save({...current.current,phase:'exercise'}))}>Vận dụng ngay · {packet.questions.length} câu →</button>
 </>:session.phase==='exercise'&&q?<section className="panel exercise">
  <div className="section-title"><h2>{session.submitted?'Đối chiếu':'Vận dụng quy tắc'}</h2><span>{session.index+1}/{packet.questions.length}</span></div><progress value={session.index} max={packet.questions.length}/><h3><StudyText text={q.prompt} words={packet.vocabulary} disabled={busy} onReveal={session.submitted?undefined:async()=>{let ok=false;await act(async()=>{await save({...current.current,assisted:true});ok=true;});return ok;}}/></h3>
  {q.kind==='listening'&&!session.submitted&&<><button onClick={()=>void playQuestion()} disabled={busy}>Nghe câu</button><p><small>{heard?'Đã nghe. Chọn nghĩa phù hợp.':'Nếu thiếu giọng hoặc không nghe được, hãy chọn Bỏ qua; không ghi là đã nghe đúng.'}</small></p></>}
  {session.submitted?<div className={'feedback grade-'+(session.answers.at(-1)?.skipped?'skipped':session.answers.at(-1)?.correct===true?'correct':session.answers.at(-1)?.correct===false?'incorrect':'compare')} role="status"><h3>{session.answers.at(-1)?.skipped?'Đã bỏ qua':session.answers.at(-1)?.correct===true?'Đúng rồi!':session.answers.at(-1)?.correct===false?'Chưa đúng':'Lượt cũ chưa được AI chấm'}</h3>
   {session.answers.at(-1)?.feedback&&<p>{session.answers.at(-1)?.feedback}</p>}
   {!session.answers.at(-1)?.skipped&&session.answers.at(-1)?.correct===null&&<button disabled={busy} onClick={()=>void regrade()}>Chấm bằng AI local</button>}
   <p>Bạn trả lời: {session.answers.at(-1)?.answer}</p><Example item={q.solution} words={packet.vocabulary}/><p>{q.explanation}</p>
   <button className="primary" disabled={busy} onClick={()=>void act(async()=>{await save(advanceExpansion(current.current));setShowRule(false);setHeard(false);audioGeneration.current++;speech.stop();})}>Tiếp tục →</button>
  </div>:<>
   {q.choices.length?<div className="choices">{q.choices.map(c=><LearnOption key={c} text={c} disabled={busy||failed.current} selected={session.draft===c} candidates={[...packet.vocabulary,...packet.questions.map(x=>x.solution)]} onReveal={optionHelp} onChoose={()=>draft(c)}/>)}</div>:<label>Câu trả lời<input value={session.draft} disabled={busy||failed.current} onChange={e=>draft(e.target.value)} onKeyDown={e=>{if(canSubmitKey(e.nativeEvent)){e.preventDefault();void submit();}}} autoComplete="off"/></label>}
   <p aria-live="polite"><small>{saveState}{session.assisted?' · Đã dùng trợ giúp':''}</small></p>
   <div className="actions"><button className="primary" disabled={busy||failed.current||!session.draft.trim()||(q.kind==='listening'&&!heard)} onClick={()=>void submit()}>{busy?'Đang chấm…':'Kiểm tra'}</button><button disabled={busy||failed.current} onClick={()=>void hint()}>Xem lại quy tắc / gợi ý</button><button disabled={busy||failed.current} onClick={()=>void submit(true)}>Bỏ qua</button><button disabled={busy||failed.current} onClick={()=>void act(async()=>{await save(current.current);location.hash='learn';})}>Lưu & tạm dừng</button></div>
   {showRule&&<div className="notice"><p>Trợ giúp đã được ghi nhận, kể cả khi đóng gợi ý.</p>{packet.blocks.map(b=><p key={b.title}><strong>{b.title}:</strong> {b.rule}</p>)}<Example item={q.solution} words={packet.vocabulary}/><p>{q.explanation}</p><button onClick={()=>setShowRule(false)}>Đóng gợi ý</button></div>}
  </>}
 </section>:<section className="panel summary"><h2>Đã đi hết bài vận dụng</h2><p>{session.answers.filter(a=>a.correct&&!a.assisted).length} câu đúng độc lập · {session.answers.filter(a=>a.assisted).length} có trợ giúp · {session.answers.filter(a=>a.skipped).length} bỏ qua.</p><p>Bài ngắn này ghi nhận thực hành, chưa xác nhận thành thạo toàn chủ đề.</p>
  <div className="actions">{nextLesson?<a className="button primary" href={'#'+expansionRoute(nextLesson)}>Bài tiếp theo: {nextLesson.title} →</a>:nextUnit?<a className="button primary" href={'#learn/'+nextUnit.lessons[0].id}>Chủ đề tiếp theo: {nextUnit.title} →</a>:<a className="button primary" href="#review">Chuyển sang ôn tập →</a>}<button disabled={busy} onClick={()=>void act(async()=>{const fresh=({...newExpansionRun(lesson),epoch});await track(storage.put({collection:'sessions',id:expansionSessionId(fresh),expected_version:0,data:fresh}));await refresh();location.hash=expansionRoute(lesson)+'/'+fresh.run;})}>Học lại với lượt mới</button><a className="button" href="#learn">Về lộ trình</a></div>

 </section>}

 </div>;
}
