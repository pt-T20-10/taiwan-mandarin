import {useEffect,useRef,useState} from 'react';
import {api,speech,storage} from '../adapters/local';
import {SentencePractice} from './SentencePractice';
import {emptySentenceState,packSentences,unpackSentences} from '../core/sentenceReview';
import type {SentenceState} from '../core/sentenceReview';
import {useApp} from '../context';

// Reports keep the learner's unfinished draft/history; content is pulled afresh.
// Ordered CAS writes also preserve pending events across navigation and restart.
const writes=new Set<Promise<unknown>>();
export function DesktopSentenceReview({unitId}:{unitId:string}){
 const {content,refresh}=useApp(),[state,setState]=useState<SentenceState>(),[error,setError]=useState('');
 const latest=useRef<SentenceState|undefined>(undefined),version=useRef(0),chain=useRef(Promise.resolve()),alive=useRef(true);
 const id='sentence-review:v1:'+unitId;
 useEffect(()=>{alive.current=true;void(async()=>{try{
  await Promise.allSettled([...writes]);
  const loaded=await storage.load(),row=loaded.objects.reports[id];version.current=row?.version||0;
  const saved:SentenceState=row&&!row.deleted?(row.data.format==='sentence-review-store-v1'?unpackSentences(row.data):row.data):emptySentenceState();
  const data=await api('/sentence-review/pull',{known_ids:[]});
  const next={...saved,entries:data.entries,revision:data.revision,exposure:data.exposure||[]};latest.current=next;if(alive.current)setState(next);
 }catch(e){if(alive.current)setError((e as Error).message);}})();return()=>{alive.current=false;speech.stop();};},[id]);
 function change(update:(s:SentenceState)=>SentenceState){
  const task=chain.current.then(async()=>{
   if(!latest.current)throw Error('Chưa tải dữ liệu ôn câu.');
   const next=update(latest.current);
   const result=await storage.put({collection:'reports',id,expected_version:version.current,data:packSentences({...next,entries:[]})});
   version.current=result.version;latest.current=next;if(alive.current)setState(next);
  });chain.current=task.catch(()=>{});writes.add(task);void task.finally(()=>writes.delete(task)).catch(()=>{});return task;
 }
 const syncing=useRef(false);
 async function sync(){if(syncing.current)return;syncing.current=true;try{
  await chain.current;
  while(latest.current?.pending.length){
   const batch=latest.current.pending.slice(0,200),result=await api('/sentence-review/events',{events:batch});
   const accepted=new Set(result.accepted as string[]);if(!batch.some(e=>accepted.has(e.id)))throw Error('Kết quả chưa được xác nhận.');
   await change(s=>({...s,pending:s.pending.filter(e=>!accepted.has(e.id))}));
  }await refresh();
 }catch(e){if(alive.current)setError((e as Error).message);}finally{syncing.current=false;}}
 return <><a href="#learn">← Lộ trình</a>{error&&<p role="alert">{error}</p>}{state?<SentencePractice learnOnly state={state} units={content.units.map(u=>({id:u.id,title:u.title}))} initialUnit={unitId} change={change} play={(_,text)=>speech.speak(text)} available={()=>true} onSync={()=>void sync()}/>:<p>Đang tải ngân hàng ôn câu…</p>}</>;
}
