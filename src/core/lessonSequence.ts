import dialogues from './lesson-dialogues.json';
import type {AppState,Content,Exercise,Lesson,Session,TextItem,Unit} from './types';
import {shuffled} from './practice';

// Supplement revision is separate from the installed foundation package. Existing
// sessions continue to resolve their original exercise IDs without a migration.
export const lessonDialogue=(lesson:Lesson):TextItem[]=>
 (dialogues as Record<string,TextItem[]>)[lesson.id]||[];

export function lessonPractice(unit:Unit,lesson:Lesson):Exercise[]{
 const words=unit.words.filter(w=>lesson.word_ids.includes(w.id)),passage=lessonDialogue(lesson);
 if(!passage.length)return lesson.exercises;
 return words.flatMap((w,i)=>{
  const base={choices:[],tokens:[],word_id:w.id,skill:'vocabulary',stimulus:null,explanation:`${w.hanzi} (${w.pinyin}): ${w.vi}.`} satisfies Partial<Exercise>;
  const recall:Exercise={...base,id:`${lesson.id}:linked-v1:word:${i}`,kind:i%2?'hanzi':'meaning',
   prompt:i%2?`Viết từ vừa học: ${w.vi}`:'Chọn nghĩa của từ vừa học.',
   stimulus:w,answers:[i%2?w.hanzi:w.vi],choices:i%2?[]:[...new Set(words.map(x=>x.vi))]};
  const line=passage.find(s=>s.hanzi.includes(w.hanzi))!;
  const context:Exercise={...base,id:`${lesson.id}:linked-v1:use:${i}`,kind:i===3?'listening':i===4?'reading':'cloze',
   prompt:i===3?'Nghe câu trong cuộc trò chuyện, chọn nghĩa phù hợp.':i===4?'Đọc câu vừa học, chọn nghĩa phù hợp.':`Điền từ vừa học (${w.vi}): ${line.hanzi.split(w.hanzi).join('___')}`,
   stimulus:line,answers:[i>=3?line.vi:w.hanzi],choices:i>=3?[...new Set(passage.map(s=>s.vi))]:[],
   skill:i===3?'listening':i===4?'reading':'grammar',explanation:`${line.hanzi} — ${line.vi} ${w.hanzi} (${w.pinyin}): ${w.vi}.`};
  return [recall,context];
 });
}

export function newLessonSession(content:Content,state:AppState,unit:Unit,lesson:Lesson,random=Math.random):Session{
 const all=content.units.flatMap(u=>u.lessons.map(l=>({unit:u,lesson:l})));
 const position=all.findIndex(x=>x.lesson.id===lesson.id);
 const previous=all.slice(0,position).filter(x=>{const r=state.objects.sessions[x.lesson.id];return r&&!r.deleted&&!r.data.archived&&r.data.phase==='summary';});
 const recent=previous.filter(x=>x.unit.id===unit.id).slice(-2).reverse();
 const older=shuffled(previous.filter(x=>x.unit.id!==unit.id),random);
 const reviews:Exercise[]=[],labels:Record<string,string>={};
 // Pick only questions actually present in a completed session. For legacy
 // sessions constrain review to that lesson's focus words (old fillers used future words).
 for(const x of [...recent,...older]){
  if(reviews.length>=3)break;
  if(x.unit.id!==unit.id&&reviews.some(e=>labels[e.id].startsWith('Ôn chủ đề cũ')))continue;
  const s=state.objects.sessions[x.lesson.id].data as Session;
  const bank=s.exercise_snapshot||x.lesson.exercises;
  const ids=s.exercise_ids||x.lesson.legacy_exercise_ids||x.lesson.exercises.map(q=>q.id);
  const eligible=bank.filter(q=>ids.includes(q.id)&&!s.review_labels?.[q.id]&&q.word_id&&x.lesson.word_ids.includes(q.word_id)&&
   (s.exercise_snapshot||['meaning','hanzi','pinyin'].includes(q.kind))&&!['speaking','writing'].includes(q.kind));
  const q=shuffled(eligible,random)[0];if(!q||reviews.some(e=>e.id===q.id))continue;
  reviews.push(q);labels[q.id]=`${x.unit.id===unit.id?'Ôn bài gần đây':'Ôn chủ đề cũ'} · ${x.unit.title} · ${x.lesson.title}`;
 }
 const items=lessonPractice(unit,lesson).flatMap((q,i)=>[q,...(i%3===2&&reviews.length?[reviews.shift()!]:[])]);
 items.push(...reviews);
 const snapshot=items.map(q=>({...q,choices:shuffled(q.choices,random)}));
 return {phase:'intro',index:0,answers:[],run:crypto.randomUUID(),exercise_ids:snapshot.map(q=>q.id),exercise_snapshot:snapshot,review_labels:labels,sequence_revision:1};
}
