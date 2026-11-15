import {useEffect,useRef,useState} from 'react';
import {answerSentence,nextSentence,sentenceRound} from '../core/sentenceReview';
import type {SentenceEntry,SentenceState,SentenceWord} from '../core/sentenceReview';
import '../sentence-review.css';
import {useActiveTimer} from '../core/useActiveTimer';

export type SentencePracticeProps={state:SentenceState;units:{id:string;title:string}[];change:(update:(s:SentenceState)=>SentenceState)=>Promise<void>;play:(key:string,text:string)=>Promise<void>;available:(key:string)=>boolean;onSync:()=>void;initialUnit?:string;learnOnly?:boolean};
export function SentencePractice({state,units,change,play,available,onSync,initialUnit,learnOnly=false}:SentencePracticeProps){
 const [unit,setUnit]=useState(initialUnit||state.run?.unit_id||units[0]?.id||''),[size,setSize]=useState<10|15>(15),[busy,setBusy]=useState(false),[error,setError]=useState(''),[word,setWord]=useState<SentenceWord|null>(null),[hint,setHint]=useState(false),[draft,setDraft]=useState(state.run?.draft||'');
 const queue=useRef(Promise.resolve()),failed=useRef(false),lock=useRef(false),mounted=useRef(true);
 const run=state.run,q=run?.tasks[run.index],answer=run?.answers[run.index];
 const timer=useActiveTimer(!!run&&!run.finished&&!run.submitted&&!busy);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 useEffect(()=>{setDraft(run?.draft||'');setHint(false);setWord(null);},[run?.id,run?.index]);
 async function act(fn:()=>Promise<void>){if(lock.current)return;lock.current=true;setBusy(true);try{await queue.current;if(failed.current)throw Error('Bản nháp chưa lưu. Sao chép nội dung trước khi mở lại.');await fn();}catch(e){setError((e as Error).message);}finally{lock.current=false;if(mounted.current)setBusy(false);}}
 function writeDraft(value:string){setDraft(value);queue.current=queue.current.then(async()=>{if(failed.current)return;await change(s=>s.run?{...s,run:{...s.run,draft:value}}:s);}).catch(e=>{failed.current=true;if(mounted.current)setError(e.message);});}
 async function help(w?:SentenceWord){await act(async()=>{await change(s=>s.run&&!s.run.submitted?{...s,run:{...s.run,assisted:true}}:s);if(w)setWord(w);else setHint(true);});}
 function text(entry:SentenceEntry,masked=false){
  let offset=0;const parts=[];
  const gapAt=masked?entry.hanzi.indexOf(entry.gap):-1;
  for(const segment of entry.segments){
   if(segment.start>offset)parts.push(entry.hanzi.slice(offset,segment.start));
   if(masked&&segment.start>=gapAt&&segment.end<=gapAt+entry.gap.length){if(segment.start===gapAt)parts.push(<span key={segment.start}>___</span>);}
   else parts.push(<button type="button" className="sentence-token" key={segment.start} disabled={busy} onClick={()=>void help(entry.words[segment.word])}>{entry.hanzi.slice(segment.start,segment.end)}</button>);
   offset=segment.end;
  }
  parts.push(entry.hanzi.slice(offset));return <span lang="zh-TW">{parts}</span>;
 }
 async function begin(){await act(async()=>{await change(s=>{
  const history=s.run?[...s.history.filter(r=>r.id!==s.run!.id),s.run]:s.history;
  const valid=new Set(s.entries.map(e=>e.id));
  const options=new Map(s.entries.map(e=>[e.id,new Set(e.options)]));
  const reusable=(r:NonNullable<SentenceState['run']>)=>r.unit_id===unit&&r.tasks.length===size&&r.tasks.every(t=>(!learnOnly||t.mode!=='assemble')&&valid.has(t.entry.id)&&(t.mode!=='choice'||t.choices.every(c=>options.get(t.entry.id)?.has(c)))&&!(s.exposure||[]).some(e=>e.sentence_id===t.entry.id&&e.timestamp>r.created_at));
  const ready=s.prepared.find(reusable);
  const fresh=ready?{...ready,created_at:new Date().toISOString()}:sentenceRound(s.entries,unit,size,history,Math.random,s.exposure,learnOnly);
  if(!fresh.tasks.length)throw Error('Chưa có câu phù hợp để tạo bộ này.');
  const prepared=s.prepared.filter(r=>r.id!==fresh.id&&reusable(r)).slice(0,3);
  let rolling=[...history,fresh,...prepared];
  while(prepared.length<3){const next=sentenceRound(s.entries,unit,size,rolling,Math.random,s.exposure,learnOnly);if(!next.tasks.length)break;prepared.push(next);rolling.push(next);}
  return {...s,history,run:fresh,prepared};
 });onSync();});}
 const send=(skip=false)=>act(async()=>{const duration=timer.consume();await change(s=>{if(!s.run)return s;const result=answerSentence({...s.run,draft},skip);return {...s,run:result.run,pending:[...s.pending,{...result.event,duration_ms:duration}]};});});
 return <section className="sentence-practice">
  <h1>Ôn câu</h1><p>Luyện câu mới với điền từ, chọn từ và dịch. Bản dịch khác mẫu được giữ để đối chiếu.</p>
  {error&&<p role="alert">{error}</p>}
  <details open={!run||run.finished}><summary>Chọn chủ đề và lượt ôn</summary><label>Chủ đề<select aria-label="Chủ đề" value={unit} onChange={e=>setUnit(e.target.value)}>{units.map(u=><option key={u.id} value={u.id}>{u.title} · {state.entries.filter(e=>e.unit_id===u.id).length} câu</option>)}</select></label><label>Số câu<select aria-label="Số câu" value={size} onChange={e=>setSize(Number(e.target.value) as 10|15)}><option value={10}>10 câu</option><option value={15}>15 câu</option></select></label><button disabled={busy||failed.current} onClick={()=>void begin()}>Bắt đầu lượt mới</button></details>
  {!state.entries.length&&<p>Chưa có câu để luyện. Hãy tải lại hoặc đồng bộ dữ liệu.</p>}
  {run&&run.tasks.length<size&&<p>Lượt này có {run.tasks.length} câu đủ điều kiện; không chèn câu trùng để đủ số.</p>}
  {run?.finished?<div><h2>Đã hoàn thành lượt ôn</h2><p>{run.answers.filter(a=>a.result==='correct'&&!a.assisted).length} đúng độc lập · {run.answers.filter(a=>a.result==='compare').length} cần đối chiếu · {run.answers.filter(a=>a.assisted).length} có trợ giúp.</p><button onClick={()=>void begin()} disabled={busy}>Bộ tiếp theo</button></div>:run&&q?<article>
   <p>Câu {run.index+1}/{run.tasks.length}</p>
   <h2>{q.mode==='gap'?'Điền từ còn thiếu':q.mode==='choice'?'Chọn từ vào chỗ trống':q.mode==='assemble'?'Ghép câu tiếng Trung':q.mode==='to_vi'?'Dịch sang tiếng Việt':'Dịch sang tiếng Trung'}</h2>
   {q.mode==='to_vi'?<p className="sentence-line">{text(q.entry)}</p>:<p>{q.entry.vi}</p>}
   {(q.mode==='gap'||q.mode==='choice')&&<p className="sentence-line">{text(q.entry,true)}</p>}
   {run.submitted?<div className="sentence-feedback"><h3>{answer?.result==='correct'?'Đúng rồi':answer?.result==='incorrect'?'Cùng xem lại':answer?.result==='compare'?'Cần đối chiếu':'Đã bỏ qua'}</h3><p>Bạn trả lời: {answer?.answer||'—'}</p><p className="sentence-line">{text(q.entry)}</p><p>{q.entry.pinyin}</p><p>{q.entry.vi}</p><button disabled={!available(q.entry.audio_key)} onClick={()=>void play(q.entry.audio_key,q.entry.hanzi).catch(e=>setError(e.message))}>Nghe câu</button>
   {answer?.result==='compare'&&<p>Có thể có cách dịch khác đúng. Đáp án mẫu không phải cách diễn đạt duy nhất.</p>}
   <label><input type="checkbox" checked={answer?.revisit||false} disabled={busy} onChange={e=>{const revisit=e.target.checked;void act(()=>change(s=>s.run?{...s,run:{...s.run,answers:s.run.answers.map((a,i)=>i===s.run!.index?{...a,revisit}:a)},pending:[...s.pending,{...s.run.answers[s.run.index],revisit,feedback:true,id:crypto.randomUUID(),run_id:s.run.id,unit_id:s.run.unit_id,timestamp:new Date().toISOString(),duration_ms:0,mode:s.run.tasks[s.run.index].mode}]}:s));}}/> Tôi muốn ôn lại câu này</label>
   <button disabled={busy} onClick={()=>void act(async()=>{await change(s=>s.run?{...s,run:nextSentence(s.run)}:s);onSync();})}>Tiếp tục</button></div>:<>
    {q.mode==='choice'?<div className="sentence-choices">{q.choices.map(c=><button key={c} disabled={busy} className={draft===c?'selected':''} onClick={()=>writeDraft(c)}>{c}</button>)}</div>:q.mode==='assemble'?<><p aria-label="Câu đã ghép">{run.draft||'…'}</p><div className="sentence-choices">{q.tokens.map((t,i)=><button key={i} disabled={busy||run.selected_tokens?.includes(i)} onClick={()=>void act(async()=>{await change(s=>{if(!s.run)return s;return {...s,run:{...s.run,draft:s.run.draft+t,selected_tokens:[...(s.run.selected_tokens||[]),i]}};});setDraft(run.draft+t);})}>{t}</button>)}</div><button onClick={()=>void act(async()=>{await change(s=>s.run?{...s,run:{...s.run,draft:'',selected_tokens:[]}}:s);setDraft('');})}>Xếp lại</button></>:<label>Câu trả lời<textarea aria-label="Câu trả lời" value={draft} disabled={busy} onChange={e=>writeDraft(e.target.value)} autoComplete="off"/></label>}
    <p>{run.assisted?'Đã dùng trợ giúp':'Bản nháp được lưu trên thiết bị.'}</p>
    <div className="actions"><button disabled={busy||!draft.trim()||failed.current} onClick={()=>void send()}>Kiểm tra</button><button disabled={busy||failed.current} onClick={()=>void send(true)}>Bỏ qua</button><button disabled={busy||failed.current} onClick={()=>void help()}>Gợi ý</button></div>
    {hint&&<aside><p>{text(q.entry)}</p><p>{q.entry.pinyin}</p><p>{q.entry.vi}</p><button disabled={!available(q.entry.audio_key)} onClick={()=>void play(q.entry.audio_key,q.entry.hanzi).catch(e=>setError(e.message))}>Nghe gợi ý</button></aside>}
   </>}
   {!available(q.entry.audio_key)&&<small>Audio câu chưa tải. Bạn vẫn có thể luyện chữ.</small>}
  </article>:null}
  {!learnOnly&&<details><summary>Lượt đã lưu · {state.history.length}</summary>{state.history.slice().reverse().map(r=><p key={r.id}><button disabled={busy} onClick={()=>void act(()=>change(s=>({...s,history:[...s.history.filter(h=>h.id!==r.id),...(s.run?[s.run]:[])],run:r})))}>{new Date(r.created_at).toLocaleString('vi-VN')} · {r.finished?'Đã hoàn thành':`${r.index}/${r.tasks.length}`}</button></p>)}</details>}
  {word&&<div className="sentence-word-sheet" role="dialog" aria-label="Tra từ"><button onClick={()=>setWord(null)}>Đóng</button><h3 lang="zh-TW">{word.hanzi}</h3><p>{word.pinyin}</p><p>{word.vi}</p><button disabled={!available(word.audio_key)} onClick={()=>void play(word.audio_key,word.hanzi).catch(e=>setError(e.message))}>Nghe từ</button>{!available(word.audio_key)&&<small>Chưa tải audio từ này.</small>}</div>}
 </section>;
}
