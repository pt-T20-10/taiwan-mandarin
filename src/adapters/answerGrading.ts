import {api} from './local';
export type AnswerGrade={correct:boolean;feedback:string;grader:'reference'|'local-ai'};
export function gradeAnswer(input:{mode:'to_vi'|'to_zh'|'gap';answer:string;reference:string;meaning:string;sentence:string;template?:string}){
 return api<AnswerGrade>('/learn/grade',{...input,request_id:crypto.randomUUID()});
}
