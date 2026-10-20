import type {AppState,Content,Unit} from './types';
import type {WrittenItem} from './writtenPractice';
import {sentenceBank} from './writtenPractice';
import {normalizeHanzi} from './learning';
import lookup from './study-lookup.json';
import {isMarkedLearned} from './learnedWords';

export type WritingKnowledge={words:Set<string>;grammar:Set<string>;sentences:Set<string>;lessonIds:string[];cardIds:string[];markedWordIds:string[]};
const lexicon=[...new Set(lookup.words.map(w=>normalizeHanzi(w.hanzi)).filter(Boolean))].sort((a,b)=>b.length-a.length);
const tokenCache=new WeakMap<WritingKnowledge,string[]>();
export function writingKnowledge(content:Content,state:AppState):WritingKnowledge{
 const result:WritingKnowledge={words:new Set(),grammar:new Set(),sentences:new Set(),lessonIds:[],cardIds:[],markedWordIds:[]};
 const addWord=(value:unknown)=>{if(typeof value==='string'&&value.trim())result.words.add(normalizeHanzi(value));};
 const addSentence=(value:unknown)=>{if(typeof value==='string'&&/\p{Script=Han}/u.test(value))result.sentences.add(normalizeHanzi(value));};
 const words=content.units.flatMap(u=>u.words);
 for(const [id,row] of Object.entries(state.objects.reports))if(isMarkedLearned(id,row)){
  addWord(row.data.word.hanzi);result.markedWordIds.push(id);
 }
 for(const [id,row] of Object.entries(state.objects.cards)){
  if(row.deleted||row.data.suspended)continue;
  addWord(row.data.word?.hanzi);addWord(words.find(w=>w.id===row.data.word_id)?.hanzi);result.cardIds.push(id);
 }
 for(const unit of content.units)for(const lesson of unit.lessons){
  const record=state.objects.sessions[lesson.id];if(!record||record.deleted||record.data.phase!=='summary'||record.data.archived)continue;
  result.lessonIds.push(lesson.id);
  lesson.word_ids.forEach(id=>addWord(unit.words.find(w=>w.id===id)?.hanzi));
  lesson.grammar_ids.forEach(id=>result.grammar.add(id));
  // Only the actual completed exercise list is evidence, including legacy snapshots.
  const ids:string[]=record.data.exercise_ids||lesson.legacy_exercise_ids||lesson.exercises.map(e=>e.id);
  const questions=[...lesson.exercises,...(content.retired_exercises||[])];
  for(const id of ids){const ex=questions.find(q=>q.id===id);if(ex?.stimulus)addSentence(ex.stimulus.hanzi);}
 }
 for(const row of Object.values(state.objects.sessions)){
  const s=row.data;if(row.deleted||s.archived||s.phase!=='summary')continue;
  if(s.scope==='grammar'&&typeof s.grammar_id==='string')result.grammar.add(s.grammar_id);
  if(s.scope==='skills'&&s.packet?.source==='authored'&&/^(verbs|classifiers):/.test(s.unit_id||'')){
   // A completed supplemental packet proves its actual phrases, not the entire topic bank.
   for(const line of s.packet.passage||[])addSentence(line.hanzi);
   for(const q of s.packet.items||[]){addSentence(q.stimulus?.hanzi);for(const a of q.answers||[])addSentence(a);}
  }
 }
 for(const g of content.units.flatMap(u=>u.grammar))if(result.grammar.has(g.id)){
  // Teach the markers in the learned pattern, never every noun from its examples.
  for(const marker of (g.pattern||'').match(/[\u3400-\u9fff]+/g)||[])addWord(marker);
 }
 return result;
}
export function missingWritingWords(text:string,knowledge:WritingKnowledge):string[]{
 if(knowledge.words.has(normalizeHanzi(text))||knowledge.sentences.has(normalizeHanzi(text)))return [];
 let keys=tokenCache.get(knowledge);if(!keys){keys=[...new Set([...lexicon,...knowledge.words])].sort((a,b)=>b.length-a.length);tokenCache.set(knowledge,keys);}const missing=new Set<string>();
 for(let i=0;i<text.length;){
  if(/[\s\p{P}\p{Z}]/u.test(text[i])){i++;continue;}
  const word=keys.find(w=>text.startsWith(w,i));
  if(word){if(!knowledge.words.has(word))missing.add(word);i+=word.length;}
  else{missing.add(text[i]);i++;}
 }
 return [...missing];
}
export function canWriteSentence(item:WrittenItem,knowledge:WritingKnowledge){
 if(!item.sample)return false;
 const text=item.sample.hanzi;
 if(missingWritingWords(text,knowledge).length)return false;
 if(knowledge.sentences.has(normalizeHanzi(text))||knowledge.words.has(normalizeHanzi(text)))return true;
 const grammar=item.requiredGrammar||item.id.match(/^sentence:v1:(tw\.[a-z]+\.g\.[a-z0-9.-]+):\d+$/)?.[1];
 if(grammar&&!knowledge.grammar.has(grammar))return false;
 if(item.requiresPracticedForm||/^sentence:v1:verb:.*:split$/.test(item.id))return false;
 return true;
}
export function learnedSentenceBank(units:Unit[],knowledge:WritingKnowledge){return sentenceBank(units).filter(q=>canWriteSentence(q,knowledge));}
