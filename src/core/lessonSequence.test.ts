import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import lookup from './study-lookup.json';
import type {AppState,Content,Session} from './types';
import {lessonDialogue,lessonPractice,newLessonSession} from './lessonSequence';
import {lessonItems} from './practice';
const content=pack.content as Content;
const state=()=>({objects:{sessions:{},cards:{},reports:{},notes:{},settings:{},placement:{},chats:{}},events:[],device_id:'TEST'}) as AppState;
it('all 72 lessons cover their own five words in a distinct dialogue and ten linked questions',()=>{
 const ids=new Set<string>(),texts=new Set<string>();
 for(const u of content.units)for(const l of u.lessons){
  const lines=lessonDialogue(l),text=lines.map(s=>s.hanzi).join('');
  expect(texts.has(text)).toBe(false);texts.add(text);
  for(const w of u.words.filter(w=>l.word_ids.includes(w.id)))expect(text).toContain(w.hanzi);
  for(const line of lines){
   const spans=(lookup.sentences as Record<string,{start:number;end:number}[]>)[line.hanzi]||[];
   for(let i=0;i<line.hanzi.length;i++)if(/\p{Script=Han}/u.test(line.hanzi[i]))expect(spans.some(s=>s.start<=i&&s.end>i),line.hanzi).toBe(true);
  }
  const items=lessonPractice(u,l);expect(items).toHaveLength(10);
  for(const q of items){expect(ids.has(q.id)).toBe(false);ids.add(q.id);expect(l.word_ids).toContain(q.word_id);
   if(q.choices.length)expect(q.choices).toContain(q.answers[0]);
   if(q.kind==='cloze'){expect(q.prompt).toContain('___');expect(q.prompt).not.toContain(q.answers[0]);}
  }
 }
 expect(texts.size).toBe(72);
});
it('interleaves only earlier completed lessons and freezes questions, retries and legacy order',()=>{
 const s=state(),food=content.units[2],lesson=food.lessons[2];
 expect(newLessonSession(content,s,food,lesson).exercise_ids).toHaveLength(10);
 for(const l of [food.lessons[0],food.lessons[1],content.units[0].lessons[0],content.units[5].lessons[0]])s.objects.sessions[l.id]={version:1,deleted:false,data:{phase:'summary',answers:[]}};
 const session=newLessonSession(content,s,food,lesson,()=>.4);expect(session.exercise_ids).toHaveLength(13);
 expect(Object.keys(session.review_labels||{})).toHaveLength(3);
 expect(session.exercise_ids?.some(id=>id.startsWith('tw.family'))).toBe(false);
 const reload=JSON.parse(JSON.stringify(session)) as Session;
 expect(lessonItems(lesson,reload)).toEqual(session.exercise_snapshot);
 const legacy={phase:'exercise',index:2,run:'legacy',answers:[],exercise_ids:lesson.legacy_exercise_ids} as Session;
 expect(lessonItems(lesson,legacy).map(q=>q.id)).toEqual(lesson.legacy_exercise_ids);
 expect(lessonItems(lesson,{...reload,retry:[reload.exercise_ids![2]]}).find(q=>q.id===reload.exercise_ids![2])).toBeDefined();
});
