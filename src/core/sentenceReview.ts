import type {TextItem} from './types';
import {learnChoices} from './learnChoices';

export type SentenceWord=TextItem&{audio_key:string};
export type SentenceEntry=TextItem&{
 id:string;unit_id:string;group:string;context:string;gap:string;options:string[];
 words:SentenceWord[];segments:{start:number;end:number;word:number}[];
 audio_key:string;required_words:string[];required_grammar:string[];new_words?:string[];
};
export type SentenceMode='gap'|'choice'|'assemble'|'to_vi'|'to_zh';
export type SentenceTask={id:string;entry:SentenceEntry;mode:SentenceMode;choices:string[];tokens:string[]};
export type SentenceAnswer={task_id:string;sentence_id:string;group:string;answer:string;result:'correct'|'incorrect'|'compare'|'skipped';assisted:boolean;revisit:boolean};
export type SentenceRun={id:string;unit_id:string;created_at:string;tasks:SentenceTask[];index:number;draft:string;selected_tokens?:number[];assisted:boolean;answers:SentenceAnswer[];submitted:boolean;finished:boolean};
export type SentenceEvent=SentenceAnswer&{id:string;run_id:string;unit_id:string;timestamp:string;duration_ms:number;mode:SentenceMode;feedback?:boolean};
export type SentenceExposure={sentence_id:string;run_id:string;timestamp:string;result:SentenceAnswer['result'];revisit:boolean};
export type SentenceState={entries:SentenceEntry[];revision:string;run?:SentenceRun;history:SentenceRun[];pending:SentenceEvent[];prepared:SentenceRun[];exposure?:SentenceExposure[]};
export const emptySentenceState=():SentenceState=>({entries:[],revision:'',history:[],pending:[],prepared:[]});
export const norm=(text:string)=>text.normalize('NFC').toLowerCase().replace(/[\s\p{P}]/gu,'');
const mix=<T,>(items:T[],random:()=>number)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function sentenceRound(entries:SentenceEntry[],unit:string,size:10|15,history:SentenceRun[],random=Math.random,exposure:SentenceExposure[]=[],learnOnly=false):SentenceRun{
 const modes:SentenceMode[]=size===10?['gap','choice','assemble','to_vi','to_zh','gap','choice','assemble','to_vi','to_zh']:['gap','choice','assemble','to_vi','gap','choice','to_zh','assemble','gap','choice','to_vi','assemble','gap','choice','to_zh'];
 const recent=new Set(history.slice(-2).flatMap(r=>r.tasks.map(t=>t.entry.id)));
 const used=new Set(history.flatMap(r=>r.tasks.map(t=>t.entry.id)));
 const weak=new Set(history.flatMap(r=>r.answers.filter(a=>a.result==='incorrect'||a.revisit).map(a=>a.sentence_id)));
 const recentRuns=[...new Set([...exposure].sort((a,b)=>b.timestamp.localeCompare(a.timestamp)).map(e=>e.run_id))].slice(0,2);
 for(const e of exposure){used.add(e.sentence_id);if(recentRuns.includes(e.run_id))recent.add(e.sentence_id);if(e.result==='incorrect'||e.revisit)weak.add(e.sentence_id);}
 const rank=(e:SentenceEntry)=>recent.has(e.id)?3:!used.has(e.id)?0:weak.has(e.id)?1:2;
 const candidates=mix(entries.filter(e=>e.unit_id===unit),random).sort((a,b)=>rank(a)-rank(b));
 const tasks:SentenceTask[]=[],groups=new Map<string,number>();
 for(const e of candidates){
  if(tasks.length===size)break;
  if((groups.get(e.group)||0)>=2||tasks.some(t=>norm(t.entry.hanzi)===norm(e.hanzi)))continue;
  // Avoid exact answers appearing in another task's text or answer options.
  if(tasks.some(t=>t.entry.hanzi.includes(e.hanzi)||e.hanzi.includes(t.entry.hanzi)))continue;
  const mode=learnOnly?(['gap','choice','to_vi','to_zh'] as SentenceMode[])[tasks.length%4]:modes[tasks.length];
  if(learnOnly&&mode==='to_zh'&&e.new_words?.length)continue;
  if(mode==='choice'&&e.options.length<2)continue;
  if((mode==='gap'||mode==='choice')&&(!e.gap||!e.hanzi.includes(e.gap)))continue;
  const tokens=e.segments.map(s=>e.hanzi.slice(s.start,s.end));
  if(mode==='assemble'&&tokens.join('')!==e.hanzi.replace(/[\p{P}\s]/gu,''))continue;
  tasks.push({id:e.id+':'+mode,entry:e,mode,choices:mix(learnOnly?learnChoices(e.options,e.gap):e.options,random),tokens:mix(tokens,random)});
  groups.set(e.group,(groups.get(e.group)||0)+1);
 }
 return {id:crypto.randomUUID(),unit_id:unit,created_at:new Date().toISOString(),tasks,index:0,draft:'',assisted:false,answers:[],submitted:false,finished:false};
}
export function assessSentence(task:SentenceTask,answer:string,skip=false):SentenceAnswer['result']{
 if(skip)return 'skipped';
 const expected=task.mode==='to_vi'?task.entry.vi:task.mode==='gap'||task.mode==='choice'?task.entry.gap:task.entry.hanzi;
 if(norm(answer)===norm(expected))return 'correct';
 return task.mode==='to_vi'||task.mode==='to_zh'?'compare':'incorrect';
}
export function answerSentence(run:SentenceRun,skip=false):{run:SentenceRun;event:SentenceEvent}{
 if(run.finished||run.submitted||!run.tasks[run.index]||(!skip&&!run.draft.trim()))throw Error('Câu chưa sẵn sàng để nộp.');
 const q=run.tasks[run.index];
 const answer:SentenceAnswer={task_id:q.id,sentence_id:q.entry.id,group:q.entry.group,answer:skip?'':run.draft,result:assessSentence(q,run.draft,skip),assisted:run.assisted,revisit:false};
 return {run:{...run,submitted:true,answers:[...run.answers,answer]},event:{...answer,id:crypto.randomUUID(),run_id:run.id,unit_id:run.unit_id,timestamp:new Date().toISOString(),duration_ms:0,mode:q.mode}};
}
export function nextSentence(run:SentenceRun):SentenceRun{
 if(!run.submitted)throw Error('Hãy nộp hoặc bỏ qua trước.');
 const index=run.index+1;return {...run,index,draft:'',selected_tokens:[],assisted:false,submitted:false,finished:index>=run.tasks.length};
}
export function sentenceAudioKeys(s:SentenceState){return [...new Set([...(s.run&&!s.run.finished?[s.run]:[]),...s.prepared].flatMap(r=>r.tasks.flatMap(t=>[t.entry.audio_key,...t.entry.words.map(w=>w.audio_key)])))];}

type StoredTask=Omit<SentenceTask,'entry'>&{entry:string};
type StoredRun=Omit<SentenceRun,'tasks'>&{tasks:StoredTask[]};
export type SentenceStore={format:'sentence-review-store-v1';dictionary:Record<string,SentenceEntry>;value:Omit<SentenceState,'entries'|'run'|'history'|'prepared'>&{entries:string[];run?:StoredRun;history:StoredRun[];prepared:StoredRun[]}};
export function packSentences(s:SentenceState):SentenceStore{
 const dictionary:Record<string,SentenceEntry>={};
 const entry=(e:SentenceEntry)=>{dictionary[e.id]=e;return e.id;};
 const run=(r:SentenceRun):StoredRun=>({...r,tasks:r.tasks.map(t=>({...t,entry:entry(t.entry)}))});
 return {format:'sentence-review-store-v1',dictionary,value:{...s,entries:s.entries.map(entry),run:s.run?run(s.run):undefined,history:s.history.map(run),prepared:s.prepared.map(run)}};
}
export function unpackSentences(s:SentenceStore):SentenceState{
 if(s.format!=='sentence-review-store-v1')throw Error('Phiên bản dữ liệu ôn câu chưa được hỗ trợ.');
 const entry=(id:string)=>{const e=s.dictionary[id];if(!e)throw Error('Thiếu bản câu đã lưu; không tự xóa lịch sử.');return e;};
 const run=(r:StoredRun):SentenceRun=>({...r,tasks:r.tasks.map(t=>({...t,entry:entry(t.entry)}))});
 return {...s.value,entries:s.value.entries.map(entry),run:s.value.run?run(s.value.run):undefined,history:s.value.history.map(run),prepared:s.value.prepared.map(run)};
}
