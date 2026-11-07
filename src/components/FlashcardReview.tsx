import {useEffect,useRef,useState} from 'react';
import type {Grade} from 'ts-fsrs';
import {useApp} from '../context';
import type {Flashcard,Stored} from '../core/types';
import {normalizeHanzi,normalizePinyin,eventFor,ignoreShortcut,review} from '../core/learning';
import {reviewGroups,reviewRound,shuffleReview} from '../core/reviewSets';
import {LayerText,Speak} from './common';
type Packet={group:string;size:number;ids:string[];used:Record<string,string[]>;done:number;total:number;run:string};
const reportId='flashcard-review:v1';
export function FlashcardReview(){
 const {state,event,put,notify,layers}=useApp();
 const active=Object.entries(state.objects.cards).filter(([,r])=>!r.deleted&&!r.data.suspended) as [string,Stored<Flashcard>][];
 const key=(c:Flashcard)=>normalizeHanzi(c.word.hanzi)+'|'+normalizePinyin(c.word.pinyin);
 const words=new Map<string,{id:string;hanzi:string;pinyin:string;decks:string[];cardId:string}>();
 for(const [id,r] of [...active].sort(([a],[b])=>a<b?-1:1)){
  const k=key(r.data),old=words.get(k);
  if(old){if(!old.decks.includes(r.data.deck))old.decks.push(r.data.deck);if(r.data.direction==='recognize')old.cardId=id;}
  else words.set(k,{id:k,hanzi:r.data.word.hanzi,pinyin:r.data.word.pinyin,decks:[r.data.deck],cardId:id});
 }
 const groups=reviewGroups([...words.values()]);
 function create(group:string,size:number,old?:Packet):Packet{
  const scope=groups.find(g=>g.id===group)||groups[0],round=reviewRound(scope.ids,size,old?.used[scope.id]||[]);
  return {group:scope.id,size,ids:round.ids,used:{...old?.used,[scope.id]:round.used},done:0,total:round.ids.length,run:crypto.randomUUID()};
 }
 const record=state.objects.reports[reportId];
 const [packet,setPacket]=useState<Packet>(()=>record&&!record.deleted?record.data:create('all',20));
 const [mode,setMode]=useState<'free'|'due'>('free'),[dueIds,setDueIds]=useState<string[]>([]),[dueDone,setDueDone]=useState<string[]>([]),[revealed,setRevealed]=useState(false),[typed,setTyped]=useState(''),[busy,setBusy]=useState(false);
 const pending=useRef(false);
 const group=groups.find(g=>g.id===packet.group)||groups[0];
 const freeKey=packet.ids.find(id=>words.has(id));
 const id=mode==='free'?words.get(freeKey||'')?.cardId:dueIds.find(id=>!dueDone.includes(id)&&state.objects.cards[id]&&!state.objects.cards[id].deleted&&!state.objects.cards[id].data.suspended);
 const obj=id?state.objects.cards[id] as Stored<Flashcard>:undefined,card=obj?.data;
 function reset(){setRevealed(false);setTyped('');}
 function dueQueue(groupId=packet.group,size=packet.size){const scope=new Set((groups.find(g=>g.id===groupId)||groups[0]).ids);return active.filter(([,r])=>scope.has(key(r.data))&&new Date(r.data.schedule.due).getTime()<=Date.now()).sort(([,a],[,b])=>new Date(a.data.schedule.due).getTime()-new Date(b.data.schedule.due).getTime()).slice(0,size||undefined).map(([id])=>id);}
 async function begin(groupId=packet.group,size=packet.size){if(pending.current)return;pending.current=true;setBusy(true);try{const next=create(groupId,size,packet);await put({collection:'reports',id:reportId,expected_version:record?.version||0,data:next});setPacket(next);setDueIds(dueQueue(next.group,next.size));setDueDone([]);reset();}catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}}
 async function next(rating?:Grade){
  if(!id||!obj||!card||!revealed||pending.current)return;pending.current=true;setBusy(true);
  try{
   if(mode==='free'){
    const remaining=packet.ids.filter(k=>k!==freeKey),next={...packet,ids:remaining,done:packet.done+1};
    await event(eventFor(id,'vocabulary',{kind:'practice',correct:null,action_key:`free-review:${packet.run}:${freeKey}`,answer:'[đã lật và xem thẻ]'}),{collection:'reports',id:reportId,expected_version:record?.version||0,data:next});setPacket(next);
   }else{
    const result=review(card.schedule,rating!,mode);
    await event(eventFor(id,'vocabulary',{kind:'review',action_key:`review:${id}:${obj.version}`,rating,algorithm:'ts-fsrs@5.4.2;retention=.9;fuzz=false',answer:typed}),{collection:'cards',id,expected_version:obj.version,data:{...card,schedule:result.card}});setDueDone(d=>[...d,id]);
   }
   reset();
  }catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}
 }
 async function reveal(){
  if(pending.current)return;pending.current=true;setBusy(true);
  try{if(mode==='free')await put({collection:'reports',id:reportId,expected_version:record?.version||0,data:packet});setRevealed(true);}catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}
 }
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(ignoreShortcut(e.target,e.isComposing)||!card)return;if(e.code==='Space'){e.preventDefault();void reveal();}if(revealed&&mode==='free'&&e.key==='Enter'){e.preventDefault();void next();}if(revealed&&mode==='due'&&['1','2','3','4'].includes(e.key))void next(Number(e.key) as Grade);};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);});
 return <><div className="segmented"><button disabled={busy} className={mode==='free'?'active':''} onClick={()=>{setMode('free');reset();}}>Luyện tự do</button><button disabled={busy} className={mode==='due'?'active':''} onClick={()=>{setDueIds(dueQueue());setDueDone([]);setMode('due');reset();}}>Đến hạn · FSRS</button></div>
 <div className="filter-bar"><label>Nhóm từ<select disabled={busy} value={group.id} onChange={e=>void begin(e.target.value,packet.size)}>{groups.map(g=><option key={g.id} value={g.id}>{g.label} ({g.ids.length} từ)</option>)}</select></label><label>Số từ mỗi lượt<select disabled={busy} value={packet.size} onChange={e=>void begin(packet.group,Number(e.target.value))}>{[20,30,40,0].map(n=><option key={n} value={n}>{n?n+' từ':'Cả nhóm'}</option>)}</select></label><button disabled={busy||!words.size} onClick={()=>void begin()}>Bộ mới</button><button disabled={busy||!card} onClick={async()=>{if(pending.current)return;if(mode==='due'){setDueIds([id!,...shuffleReview(dueIds.filter(x=>x!==id&&!dueDone.includes(x)))]);return;}pending.current=true;setBusy(true);try{const next={...packet,ids:[freeKey!,...shuffleReview(packet.ids.filter(k=>k!==freeKey&&words.has(k)))]};await put({collection:'reports',id:reportId,expected_version:record?.version||0,data:next});setPacket(next);}catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}}}>Trộn</button></div>
 {words.size>0&&words.size<20&&<p className="notice">Sổ thẻ hiện chỉ có {words.size} từ; thêm từ để tạo nhóm từ 20 trở lên.</p>}
 <p>{mode==='free'?`${packet.done}/${packet.total} từ trong lượt · bộ đang ôn được lưu để tiếp tục. Không đổi lịch FSRS.`:`${dueDone.length}/${dueIds.length} thẻ trong lượt đến hạn. Chỉ lấy thẻ thực sự đến hạn; nếu ít hơn 20, chọn Luyện tự do để ôn một bộ lớn hơn.`}</p>
 {!card?<section className="panel summary"><h2>{words.size?'Đã xong lượt ôn':'Chưa có thẻ'}</h2><p>{words.size?'Bạn có thể dừng ở đây hoặc lấy bộ tiếp theo.':'Thêm từ vào flashcard khi đang học.'}</p><button className="primary" disabled={busy||!words.size} onClick={()=>void begin()}>Bộ tiếp theo</button></section>:<section className="panel flashcard"><span className="eyebrow">{card.deck} · {mode==='free'?'HÁN TỰ → NGHĨA':card.direction}</span>{!revealed?<><div className="card-question">{mode==='free'||card.direction==='recognize'?<span lang="zh-TW">{card.word.hanzi}</span>:card.direction==='audio'?<Speak text={card.word.hanzi} onError={notify}/>:['cloze','situation'].includes(card.direction)?card.cue:card.word.vi}</div>{mode==='due'&&['write','produce','cloze','situation'].includes(card.direction)&&<textarea aria-label="Thử nhớ câu trả lời" value={typed} onChange={e=>setTyped(e.target.value)}/>}<button className="primary" disabled={busy} onClick={()=>void reveal()}>Lật thẻ</button></>:<><LayerText item={card.word} layers={layers} force/>{mode==='free'?<button className="primary" disabled={busy} onClick={()=>void next()}>Tiếp →</button>:<div className="ratings">{(['Quên','Khó','Nhớ','Dễ'] as const).map((label,i)=><button key={label} disabled={busy} onClick={()=>void next((i+1) as Grade)}>{label}</button>)}</div>}</>}</section>}</>;
}
