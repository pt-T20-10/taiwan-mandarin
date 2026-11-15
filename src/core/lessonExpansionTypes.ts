 import type {TextItem} from './types';

export type ExpansionQuestion={
 id:string;kind:'choice'|'input'|'listening'|'translate_vi'|'translate_zh';prompt:string;choices:string[];
 answers:string[];solution:TextItem;explanation:string;
};
export type ExpansionBlock={title:string;rule:string;examples:TextItem[]};
export type ExpansionLesson={
 id:string;unit_id:string;revision:1;title:string;objective:string;prerequisite:string;
 vocabulary:TextItem[];blocks:ExpansionBlock[];pitfall:string;
 references:{source:string;focus:string}[];questions:ExpansionQuestion[];
};
export const expansionSources:Record<string,{title:string;url:string}>={
 n1:{title:'NAER · Ngữ pháp nền tảng: mục 1–20',url:'https://coct.naer.edu.tw/grammar.jsp'},
 n2:{title:'NAER · Ngữ pháp nền tảng: mục 21–40',url:'https://coct.naer.edu.tw/grammar.jsp?page=2'},
 n3:{title:'NAER · Ngữ pháp nền tảng: mục 41–60',url:'https://coct.naer.edu.tw/grammar.jsp?page=3'},
 n4:{title:'NAER · Ngữ pháp nền tảng: mục 61–80',url:'https://coct.naer.edu.tw/grammar.jsp?page=4'},
 n5:{title:'NAER · Ngữ pháp nền tảng: mục 81–100',url:'https://coct.naer.edu.tw/grammar.jsp?page=5'},
 n6:{title:'NAER · Ngữ pháp nền tảng: mục 101–120',url:'https://coct.naer.edu.tw/grammar.jsp?page=6'},
 week:{title:'Bộ Giáo dục Đài Loan · 星期',url:'https://dict.concised.moe.edu.tw/dictView.jsp?ID=28118'},
 mtc:{title:'NTNU · Nguyên tắc biên soạn 當代中文課程',url:'https://mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/1.pdf'},
 syllabus:{title:'NTNU · Đối chiếu chủ đề và ngữ pháp các giáo trình',url:'https://mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/4.pdf'},
 who:{title:'Bộ Giáo dục Đài Loan · 誰',url:'https://dict.concised.moe.edu.tw/dictView.jsp?ID=34016'},
 two:{title:'Bộ Giáo dục Đài Loan · 兩',url:'https://dict.concised.moe.edu.tw/dictView.jsp?ID=14994'},
 sequence:{title:'Bộ Giáo dục Đài Loan · 再',url:'https://dict.revised.moe.edu.tw/dictView.jsp?ID=9505'},
 ocac:{title:'OCAC · Thiết kế 來！學華語',url:'https://newhuayuworld.ccdntech.com/Ebook/Ebook/LearnMandarin'},
};
// Authored triples and answers, never machine-generated Mandarin/Pinyin.
export const t=(hanzi:string,pinyin:string,vi:string):TextItem=>({hanzi,pinyin,vi});
export const block=(title:string,rule:string,...examples:TextItem[]):ExpansionBlock=>({title,rule,examples});
type QuestionDraft=Omit<ExpansionQuestion,'id'>;
export const choose=(prompt:string,choices:string[],answer:string,solution:TextItem,explanation:string):QuestionDraft=>({kind:'choice',prompt,choices,answers:[answer],solution,explanation});
export const input=(prompt:string,answers:string[],solution:TextItem,explanation:string):QuestionDraft=>({kind:'input',prompt,choices:[],answers,solution,explanation});
export const listen=(solution:TextItem,choices:string[],answer:string,explanation:string):QuestionDraft=>({kind:'listening',prompt:'Nghe cả cụm/câu rồi chọn nghĩa phù hợp.',choices,answers:[answer],solution,explanation});
export function lesson(unit:string,key:string,title:string,objective:string,prerequisite:string,vocabulary:TextItem[],blocks:ExpansionBlock[],pitfall:string,references:ExpansionLesson['references'],questions:QuestionDraft[]):ExpansionLesson{
 const id=`expansion:v1:${unit}:${key}`;
 return {id,unit_id:'tw.'+unit,revision:1,title,objective,prerequisite,vocabulary,blocks,pitfall,references,questions:questions.map((q,i)=>({...q,id:`${id}:q${i+1}`}))};
}
