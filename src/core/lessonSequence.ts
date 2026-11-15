import dialogues from './lesson-dialogues.json';
import sentenceBank from '../../content/sentence-review.json';
import type {AppState,Content,Exercise,Lesson,Session,TextItem,Unit} from './types';
import {shuffled} from './practice';
import {learnChoices} from './learnChoices';
import {greetingPrimer} from './lessonPrimer';

// Supplement revision is separate from the installed foundation package. Existing
// sessions continue to resolve their original exercise IDs without a migration.
export const lessonDialogue=(lesson:Lesson):TextItem[]=>
 (dialogues as Record<string,TextItem[]>)[lesson.id]||[];

export function lessonPractice(unit:Unit,lesson:Lesson,knownWords:string[]=[]):Exercise[]{
 const words=unit.words.filter(w=>lesson.word_ids.includes(w.id)),passage=lessonDialogue(lesson);
 if(!passage.length)return lesson.exercises;
 const known=new Set([...knownWords,...words.map(w=>w.hanzi)]);
 const normalized=(s:string)=>s.replace(/[\p{P}\s]/gu,'');
 const entries=[...greetingPrimer,...sentenceBank.entries].filter(e=>e.unit_id===unit.id&&e.required_grammar.length===0&&e.hanzi.length<=18&&
  words.some(w=>e.required_words.includes(w.hanzi))&&e.required_words.filter(w=>!known.has(w)).length<=1&&
  (e.id.startsWith('greeting-primer:')||e.required_words.filter(w=>known.has(w)).length/e.required_words.length>=.8)&&
  !passage.some(p=>normalized(p.hanzi)===normalized(e.hanzi)))
  .sort((a,b)=>a.required_words.filter(w=>!known.has(w)).length-b.required_words.filter(w=>!known.has(w)).length||a.hanzi.length-b.hanzi.length);
 const used=new Set<string>(),extra=new Set<string>();
 return Array.from({length:10},(_,i)=>{
  const w=words[i%words.length],mode=i%4;
  const e=i<5?undefined:entries.find(e=>!used.has(e.id)&&e.required_words.includes(w.hanzi)&&
   (mode!==3||e.required_words.every(w=>known.has(w)))&&
   [...new Set([...extra,...e.required_words.filter(w=>!known.has(w))])].length<=1&&
   (mode>=2||known.has(e.gap)));
  if(!e){
   const choice=i<5,vi=i%2===0;
   return {id:`${lesson.id}:application-v4:word:${i}`,kind:choice?'choice':vi?'translate_vi':'translate_zh',
    prompt:choice?`Chọn từ có nghĩa: ${w.vi}`:vi?`Dịch sang tiếng Việt: ${w.hanzi}`:`Dịch sang tiếng Trung: ${w.vi}`,
    stimulus:w,answers:[choice||!vi?w.hanzi:w.vi],choices:choice?learnChoices(words.map(x=>x.hanzi),w.hanzi):[],tokens:[],word_id:w.id,skill:'vocabulary',
    explanation:`${w.hanzi} (${w.pinyin}): ${w.vi}.`} satisfies Exercise;
  }
  used.add(e.id);e.required_words.filter(w=>!known.has(w)).forEach(w=>extra.add(w));
  const masked=e.hanzi.replace(e.gap,'___');
  return {id:`${lesson.id}:application-v4:sentence:${i}`,kind:mode===0?'cloze':mode===1?'choice':mode===2?'translate_vi':'translate_zh',
   prompt:mode===0?`Điền từ: ${masked} (${e.vi})`:mode===1?`Chọn từ: ${masked} (${e.vi})`:mode===2?`Dịch sang tiếng Việt: ${e.hanzi}`:`Dịch sang tiếng Trung: ${e.vi}`,
   stimulus:e,answers:[mode<2?e.gap:mode===2?e.vi:e.hanzi],choices:mode===1?learnChoices(e.options.filter(w=>known.has(w)),e.gap):[],tokens:[],word_id:w.id,skill:'vocabulary',
   explanation:`${e.hanzi} (${e.pinyin}): ${e.vi}.`} satisfies Exercise;
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
  const eligible=bank.filter(q=>!/:application-v[23]:/.test(q.id)&&ids.includes(q.id)&&!s.review_labels?.[q.id]&&q.word_id&&x.lesson.word_ids.includes(q.word_id)&&
   (s.exercise_snapshot||['meaning','hanzi','pinyin'].includes(q.kind))&&!['speaking','writing'].includes(q.kind));
  const q=shuffled(eligible,random)[0];if(!q||reviews.some(e=>e.id===q.id))continue;
  reviews.push(q);labels[q.id]=`${x.unit.id===unit.id?'Ôn bài gần đây':'Ôn chủ đề cũ'} · ${x.unit.title} · ${x.lesson.title}`;
 }
 const known=previous.flatMap(x=>x.unit.words.filter(w=>x.lesson.word_ids.includes(w.id)).map(w=>w.hanzi));
 const items=lessonPractice(unit,lesson,known).flatMap((q,i)=>[q,...(i%3===2&&reviews.length?[reviews.shift()!]:[])]);
 items.push(...reviews);
 const snapshot=items.map(q=>({...q,choices:shuffled(q.choices,random)}));
 return {phase:'intro',index:0,answers:[],run:crypto.randomUUID(),exercise_ids:snapshot.map(q=>q.id),exercise_snapshot:snapshot,review_labels:labels,sequence_revision:4};
}
