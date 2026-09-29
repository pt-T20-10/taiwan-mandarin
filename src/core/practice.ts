import type {Lesson,Session,PracticeSet,PracticeSession} from './types';
import {normalizeHanzi} from './learning';
export function shuffled<T>(items:T[],random= Math.random):T[]{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function lessonItems(lesson:Lesson,session:Session,legacy=false){
 const ids=session.exercise_ids||(legacy?lesson.legacy_exercise_ids:undefined)||lesson.exercises.map(e=>e.id);
 return ids.map(id=>lesson.exercises.find(e=>e.id===id)).filter(e=>!!e);
}
export function choosePacket(packets:PracticeSet[],history:PracticeSession[],random=Math.random){
 const authored=history.filter(h=>h.packet.source==='authored'&&packets.some(p=>p.id===h.packet.id));
 let cycle=Math.max(1,...authored.map(h=>h.cycle));const used=new Set(authored.filter(h=>h.cycle===cycle).map(h=>h.packet.id));
 let available=packets.filter(p=>!used.has(p.id));if(!available.length){cycle++;available=packets.filter(p=>p.id!==authored.at(-1)?.packet.id);if(!available.length)available=packets;}
 return {packet:shuffled(available,random)[0],cycle};
}
export function practiceSession(unit:string,packet:PracticeSet,cycle:number):PracticeSession{
 return {scope:'skills',unit_id:unit,skill:packet.skill,packet:{...packet,items:shuffled(packet.items).map(q=>({...q,choices:shuffled(q.choices)}))},created_at:new Date().toISOString(),cycle,run:crypto.randomUUID(),phase:'exercise',index:0,answers:[],draft:'',assisted:false};
}
export function practiceGrade(q:PracticeSet['items'][number],answer:string){return ['read-aloud','respond','write'].includes(q.kind)?null:q.answers.some(a=>normalizeHanzi(a)===normalizeHanzi(answer));}
export function practiceAudio(packet:PracticeSet,q:PracticeSet['items'][number]){
 if(q.kind==='dictation')return q.stimulus!.hanzi;
 let text=packet.passage.map(s=>s.hanzi).join(' ');
 if(q.kind.startsWith('cloze'))for(const answer of q.answers)text=text.split(answer).join('，');
 return text;
}
