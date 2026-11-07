import {isRetiredTopicReviewItem} from '../core/topicReview';
import {FlashcardReview} from './FlashcardReview';
import {MistakeRepair} from './MistakeRepair';
import {useState} from 'react';
import {useApp} from '../context';

export function Review(){
  const {state,content}=useApp();const [tab,setTab]=useState('cards');
  const [mistakeTab,setMistakeTab]=useState('pending');
  const mistakes=state.events.filter(e=>e.correct===false&&!isRetiredTopicReviewItem(e.item_id)&&e.source!=='ai'&&e.kind!=='mistake-repair');
  const groups=Object.values(mistakes.reduce<Record<string,typeof mistakes>>((acc,e)=>{(acc[e.item_id]??=[]).push(e);return acc;},{}));
  const resolved=(group:typeof mistakes)=>state.objects.reports['mistake:'+group[0].item_id]?.data.last_error_id===group.at(-1)?.id;
  const pendingGroups=groups.filter(g=>!resolved(g));
  const packets=[...content.units.flatMap(u=>u.practice_sets||[]),...Object.values(state.objects.sessions).filter(s=>s.data.packet?.source==='authored').map(s=>s.data.packet)];
  const allExercises=[...Object.values(state.objects.sessions).filter(s=>!s.deleted&&s.data.scope==='topic-review').flatMap(s=>s.data.packet.items),...Object.values(state.objects.sessions).flatMap(s=>s.data.exercise_snapshot||[]),...(content.retired_exercises||[]),...content.units.flatMap(u=>[...(u.practice_sets||[]).flatMap(p=>p.items),...u.lessons.flatMap(l=>l.exercises),...u.grammar.flatMap(g=>g.exercises||[])]),...Object.values(state.objects.sessions).filter(s=>!s.deleted&&s.data.scope==='skills'&&s.data.packet?.source==='authored').flatMap(s=>s.data.packet.items)];
  return <><span className="eyebrow">NHỚ LÂU, HỌC NHẸ NHÀNG</span><h1>Ôn tập của bạn</h1><p><a href="#skills/tw.greetings/sentences">Luyện viết câu Việt → Hán tự từ các chủ đề đã học →</a></p><div className="tabs"><button className={tab==='cards'?'active':''} onClick={()=>setTab('cards')}>Flashcard</button><button className={tab==='mistakes'?'active':''} onClick={()=>setTab('mistakes')}>Sổ lỗi sai ({pendingGroups.length})</button></div>{tab==='mistakes'?<div className="stack"><div className="tabs"><button onClick={()=>setMistakeTab('pending')}>Cần sửa ({pendingGroups.length})</button><button onClick={()=>setMistakeTab('resolved')}>Đã sửa ({groups.length-pendingGroups.length})</button></div>{groups.filter(g=>resolved(g)===(mistakeTab==='resolved')).reverse().map(g=><MistakeRepair packet={packets.find(p=>p.items.some((q:{id:string})=>q.id===g[0].item_id))} key={g[0].item_id} ex={allExercises.find(x=>x.id===g[0].item_id)} events={g} resolved={resolved(g)}/>)}{mistakeTab==='pending'&&!pendingGroups.length&&<p>Không còn lỗi cần sửa.</p>}</div>:<FlashcardReview/>}</>;
}
