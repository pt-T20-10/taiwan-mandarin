import type {TextItem,AppState} from './types';
import {shuffled} from './practice';
export type CourseText=TextItem&{id:string;words:string[];grammar:string[];example_only:boolean;lesson_index:number|null};
export type CourseLesson={id:string;title:string;unit_id:string;index:number;level:number;question_count:number;extra_limit:number;words:TextItem[];examples:CourseText[];sentences:CourseText[];grammar:string[];introduced_grammar?:string[];patterns:{title:string;explanation:string}[];review?:boolean};
export type Course={id:string;version:number;epoch:string;verification:string;units:{id:string;title:string;description:string;lessons:CourseLesson[]}[];dictionary:TextItem[];knowledge:{words:string[];grammar:string[]}};
export type CourseTask={id:string;mode:'word'|'gap'|'listen'|'to_zh'|'to_vi';entry:TextItem&{id?:string;words?:string[]};gap:string;answer:string;choices:string[];support:TextItem[]};
export type CourseAnswer={id:string;answer:string;result:'correct'|'incorrect'|'compare'|'skipped';assisted:boolean;feedback?:string;grader?:string};
export type CourseRun={scope:'learn-course';content_version?:number;epoch:string;lesson_id:string;unit_id:string;run:string;created_at:string;phase:'exercise'|'summary';tasks:CourseTask[];index:number;draft:string;assisted:boolean;submitted:boolean;answers:CourseAnswer[];review:boolean};
export const courseSessionId=(r:CourseRun)=>r.lesson_id+':run:'+r.run;
export const courseRuns=(state:AppState,lesson:string,epoch:string)=>Object.entries(state.objects.sessions).filter(([,r])=>!r.deleted&&r.data.scope==='learn-course'&&r.data.epoch===epoch&&r.data.lesson_id===lesson).map(([id,r])=>({id,...r,data:r.data as CourseRun})).sort((a,b)=>b.data.created_at.localeCompare(a.data.created_at));
export function reviewLesson(unit:Course['units'][number]):CourseLesson{
 const unique=<T,>(items:T[],key:(t:T)=>string)=>[...new Map(items.map(t=>[key(t),t])).values()];
 return {id:'learn-course-v1:'+unit.id.split('.')[1]+':review',unit_id:unit.id,index:5,title:'Ôn chủ đề · '+unit.title,level:15,question_count:20,extra_limit:3,words:unique(unit.lessons.flatMap(l=>l.words),w=>w.hanzi),examples:[],sentences:unique(unit.lessons.flatMap(l=>l.sentences),e=>e.id),grammar:[...new Set(unit.lessons.flatMap(l=>l.grammar))],patterns:[],review:true};
}
const normalize=(s:string)=>s.normalize('NFC').toLowerCase().replace(/[\s\p{P}]/gu,'');
export function courseGrade(task:CourseTask,answer:string,skip=false):CourseAnswer['result']{
 if(skip)return 'skipped';if(normalize(answer)===normalize(task.answer))return 'correct';
 return (task.mode==='to_vi'||task.mode==='to_zh')&&!task.choices.length?'compare':'incorrect';
}
export function newCourseRun(course:Course,lesson:CourseLesson,history:CourseRun[]=[],random=Math.random):CourseRun{
 const known=new Set([...course.knowledge.words,...(!lesson.review?lesson.words.map(w=>w.hanzi):[])]),focus=new Set(lesson.words.map(w=>w.hanzi));
 const grammar=new Set([...course.knowledge.grammar,...(!lesson.review?lesson.introduced_grammar||[]:[])]);
 const recent=new Set(history.slice(0,2).flatMap(r=>r.tasks.map(q=>q.entry.hanzi)));
 const lexicon=new Map(course.dictionary.map(w=>[w.hanzi,w]));
 const candidates=shuffled(lesson.sentences.filter(e=>e.grammar.every(g=>grammar.has(g))&&e.words.some(w=>focus.has(w))&&e.words.filter(w=>!known.has(w)).length<=lesson.extra_limit&&e.words.filter(w=>known.has(w)).length*3>=e.words.length*2),random).sort((a,b)=>Number(recent.has(a.hanzi))-Number(recent.has(b.hanzi)));
 const tasks:CourseTask[]=[],used=new Set<string>();
 const count=lesson.question_count/5;
 const options=(answer:string,others:string[])=>shuffled([answer,...shuffled([...new Set(others)].filter(x=>x!==answer),random).slice(0,3)],random);
 const words=shuffled(lesson.words.filter(w=>known.has(w.hanzi)),random);
 if(words.length<count)throw Error('Chưa đủ từ đã học. Hãy hoàn thành các bài trong chủ đề trước.');
 for(let i=0;i<count;i++){
  const w=words[i];tasks.push({id:'word:'+w.hanzi,mode:'word',entry:w,gap:'',answer:w.vi,choices:options(w.vi,lesson.words.map(x=>x.vi)),support:[]});
 }
 for(let i=0;i<count;i++)for(const mode of ['gap','listen','to_zh','to_vi'] as const){
  const entry=candidates.find(e=>!used.has(normalize(e.hanzi))&&e.words.some(w=>focus.has(w)&&e.hanzi.includes(w)));
  if(!entry)throw Error('Chưa đủ câu phù hợp với vốn từ hiện tại. Hãy học các bài trước hoặc đánh dấu những từ bạn đã biết; không thay câu bằng bài dịch từ.');
  used.add(normalize(entry.hanzi));
  const gap=entry.words.filter(w=>focus.has(w)&&entry.hanzi.includes(w)).sort((a,b)=>b.length-a.length)[0];
  const answer=mode==='to_vi'?entry.vi:mode==='to_zh'?entry.hanzi:gap;
  let choices:string[]=[];
  if(mode==='listen')choices=options(gap,lesson.words.map(w=>w.hanzi));
  if(mode==='to_zh'&&i%2===0)choices=options(answer,candidates.filter(e=>e.hanzi!==answer&&normalize(e.vi)!==normalize(entry.vi)&&!used.has(normalize(e.hanzi))).map(e=>e.hanzi));
  // Sentence distractors must never become later questions in this round.
  if(mode==='to_zh')choices.forEach(c=>used.add(normalize(c)));
  tasks.push({id:entry.id+':'+mode,mode,entry,gap,answer,choices,support:entry.words.filter(w=>!known.has(w)).map(w=>lexicon.get(w)!).filter(Boolean)});
 }
 return {scope:'learn-course',content_version:course.version,epoch:course.epoch,lesson_id:lesson.id,unit_id:lesson.unit_id,run:crypto.randomUUID(),created_at:new Date().toISOString(),phase:'exercise',tasks,index:0,draft:'',assisted:false,submitted:false,answers:[],review:!!lesson.review};
}
