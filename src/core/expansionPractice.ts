import authored from './expansion-application.json';
import type {ExpansionLesson,ExpansionQuestion} from './lessonExpansionTypes';
import type {TextItem} from './types';
import {learnChoices} from './learnChoices';

// Separate editorial bank. Never pad a lesson by turning its examples into tests.
export function expandPractice(lesson:ExpansionLesson):ExpansionLesson{
 const packet=(authored as Record<string,{questions:ExpansionQuestion[];vocabulary:TextItem[]}>)[lesson.id];
 if(!packet||packet.questions.length!==10)throw Error('Thiếu bộ vận dụng riêng: '+lesson.id);
 const vocabulary=[...lesson.vocabulary,...packet.vocabulary].filter((w,i,all)=>all.findIndex(x=>x.hanzi===w.hanzi)===i);
 const questions=packet.questions.map((q,i):ExpansionQuestion=>{
  const mode=i%4,translation=mode===2||mode===3;
  if(translation)return {...q,id:q.id+':v4',kind:mode===2?'translate_vi':'translate_zh',prompt:mode===2?`Dịch sang tiếng Việt: ${q.solution.hanzi}`:`Dịch sang tiếng Trung: ${q.solution.vi}`,choices:[],answers:[mode===2?q.solution.vi:q.solution.hanzi]};
  if(q.kind==='input'){
   const choices=q.choices.length?learnChoices(q.choices,q.answers[0]):[];
   return {...q,id:q.id+':v4',prompt:mode===1&&choices.length>1?q.prompt.replace('Điền phần còn thiếu','Chọn từ còn thiếu'):q.prompt,kind:mode===1&&choices.length>1?'choice':'input',choices:mode===1&&choices.length>1?choices:[]};
  }
  return {...q,id:q.id+':v4',kind:'translate_zh',prompt:`Dịch sang tiếng Trung: ${q.solution.vi}`,choices:[],answers:[q.solution.hanzi]};
 });
 return {...lesson,vocabulary,questions};
}
