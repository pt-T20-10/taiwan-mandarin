import type {AppState,Session} from './types';
import type {ExpansionLesson,ExpansionQuestion} from './lessonExpansionTypes';
import {normalizeHanzi} from './learning';
import {numberLessons} from './lessonExpansionNumbers';
import {everydayLessons} from './lessonExpansionEveryday';
import {studyLessons} from './lessonExpansionStudy';
import {lifeLessons} from './lessonExpansionLife';
import {expandPractice} from './expansionPractice';
import {shuffled} from './practice';

export const expansionLessons:ExpansionLesson[]=[...everydayLessons,...numberLessons,...studyLessons,...lifeLessons].map(expandPractice);
export const expansionsFor=(unitId:string)=>expansionLessons.filter(l=>l.unit_id===unitId);
export const expansionRoute=(lesson:ExpansionLesson)=>`learn/expansion/${lesson.unit_id}/${lesson.id.split(':').at(-1)}`;
export const expansionAt=(route:string)=>expansionLessons.find(l=>expansionRoute(l)===route.split('/').slice(0,4).join('/'));
export type ExpansionRun={
 epoch?:string;
 scope:'lesson-expansion';lesson_id:string;unit_id:string;run:string;created_at:string;
 packet:ExpansionLesson;phase:Session['phase'];index:number;answers:Session['answers'];
 draft:string;assisted:boolean;submitted:boolean;completed_at?:string;
};
export function expansionHistory(state:AppState,lessonId:string){
 return Object.entries(state.objects.sessions).filter(([,r])=>!r.deleted&&!r.data.archived&&r.data.scope==='lesson-expansion'&&r.data.lesson_id===lessonId)
  .map(([id,r])=>({id,version:r.version,data:r.data as ExpansionRun}))
  .sort((a,b)=>b.data.created_at.localeCompare(a.data.created_at)||b.id.localeCompare(a.id));
}
export const expansionDone=(state:AppState,id:string)=>expansionHistory(state,id).some(r=>r.data.phase==='summary');
export function newExpansionRun(lesson:ExpansionLesson):ExpansionRun{
 const packet=structuredClone(lesson);packet.questions=packet.questions.map(q=>({...q,choices:shuffled(q.choices)}));
 return {scope:'lesson-expansion',lesson_id:lesson.id,unit_id:lesson.unit_id,run:crypto.randomUUID(),created_at:new Date().toISOString(),packet,phase:'intro',index:0,answers:[],draft:'',assisted:false,submitted:false};
}
export const expansionSessionId=(run:ExpansionRun)=>`${run.lesson_id}:run:${run.run}`;
// These are closed tasks with explicit meanings/slots, not free composition.
export function gradeExpansion(question:ExpansionQuestion,answer:string){const match=question.answers.some(a=>normalizeHanzi(a)===normalizeHanzi(answer));return !match&&question.kind.startsWith('translate_')?null:match;}
export function submitExpansion(run:ExpansionRun,answer:string,skip=false):ExpansionRun{
 if(run.phase!=='exercise'||run.submitted||(!answer.trim()&&!skip))throw Error('Câu chưa sẵn sàng để nộp.');
 const q=run.packet.questions[run.index];if(!q)throw Error('Không tìm thấy câu trong bài đã lưu.');
 return {...run,draft:answer,submitted:true,answers:[...run.answers,{id:q.id,answer:skip?'[bỏ qua]':answer,correct:skip?null:gradeExpansion(q,answer),assisted:run.assisted,skipped:skip}]};
}
export function advanceExpansion(run:ExpansionRun):ExpansionRun{
 if(!run.submitted)throw Error('Hãy nộp hoặc bỏ qua câu trước khi tiếp tục.');
 const index=run.index+1,done=index===run.packet.questions.length;
 return {...run,index,phase:done?'summary':'exercise',...(done?{completed_at:new Date().toISOString()}:{}),draft:'',assisted:false,submitted:false};
}
