import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import {choosePacket,practiceSession,lessonItems,practiceGrade,practiceAudio} from './practice';
import type {Unit,PracticeSession} from './types';
const unit=pack.content.units[0] as Unit;
it('three complete packets per skill, stable shuffle and no repeat until exhausted',()=>{
 for(const skill of ['reading','listening','speaking','writing']){
  const packets=unit.practice_sets!.filter(p=>p.skill===skill),history:PracticeSession[]=[];
  for(let i=0;i<4;i++){const chosen=choosePacket(packets,history,()=>.4);history.push(practiceSession(unit.id,chosen.packet,chosen.cycle));}
  expect(new Set(history.slice(0,3).map(h=>h.packet.id)).size).toBe(3);expect(history[3].cycle).toBe(2);expect(history[3].packet.id).not.toBe(history[2].packet.id);
  const roundtrip=JSON.parse(JSON.stringify(history[0]));expect(roundtrip.packet.items).toEqual(history[0].packet.items);expect(roundtrip.packet.passage).toEqual(packets.find(p=>p.id===roundtrip.packet.id)!.passage);
 }
});
it('legacy runs retain old queue and retries, fresh runs have ten questions',()=>{
 const lesson=unit.lessons[0],legacy={index:2,phase:'exercise' as const,run:'old',answers:[],retry:[lesson.exercises[0].id]};
 expect(lessonItems(lesson,legacy,true).map(e=>e.id)).toEqual(lesson.legacy_exercise_ids);expect(lessonItems(lesson,legacy)).toHaveLength(10);
 expect(lessonItems(lesson,{...legacy,exercise_ids:lesson.legacy_exercise_ids})).toHaveLength(6);
});
it('all authored packet answers grade, open work stays unscored',()=>{
 for(const unit of pack.content.units as Unit[])for(const packet of unit.practice_sets!)for(const q of packet.items){
  for(const a of q.answers)expect(practiceGrade(q,a)).toBe(['read-aloud','respond','write'].includes(q.kind)?null:true);
  if(q.kind.startsWith('cloze'))expect(q.prompt.match(/___/g)).toHaveLength(1);
 }
});
it('cloze audio hides answers while dictation retains the spoken sentence',()=>{
 for(const packet of unit.practice_sets!.filter(p=>p.skill==='listening'))for(const q of packet.items){
  if(q.kind.startsWith('cloze'))for(const a of q.answers)expect(practiceAudio(packet,q)).not.toContain(a);
  if(q.kind==='dictation')expect(practiceAudio(packet,q)).toBe(q.stimulus!.hanzi);
 }
 const q=unit.practice_sets![0].items.find(q=>q.kind==='cloze-input')!;
 expect(practiceGrade(q,'同学')).toBe(false);
});
