import type {TextItem,Unit,PracticeItem,Session} from './types';
import {normalizeHanzi} from './learning';
import {shuffled} from './practice';
import {examplesFor} from './classifiers';
import {verbsFor} from './verbs';
import {greetingReadings} from './greetingReadings';

export type WrittenItem={id:string;prompt:string;answers:string[];choices:string[];explanation:string;sample?:TextItem;evidence?:number[];requiredGrammar?:string;requiresPracticedForm?:boolean};
export type ReadingLine=TextItem&{speaker?:string;role?:'female'|'male'};
export type WrittenSet={id:string;title:string;mode:'sentences'|'reading';format?:'dialogue'|'prose';passage:ReadingLine[];items:WrittenItem[]};
export type WrittenRun={scope:'written-batch';run:string;unit_id:string;mode:WrittenSet['mode'];created_at:string;cycle:number;packet:WrittenSet;phase:'exercise'|'summary';index:number;answers:Session['answers'];drafts:Record<string,string>;help:Record<string,boolean>;revealed:Record<string,boolean>;reviews:Record<string,string>;voices:Record<string,string>;source_ids?:string[]};
export function sentenceBank(units:Unit[]):WrittenItem[]{
 const rows:WrittenItem[]=[];const seen=new Set<string>();
 for(const unit of units){
  const add=(id:string,t:TextItem,note:string,requirements:Partial<WrittenItem>={})=>{const key=normalizeHanzi(t.hanzi);if(!key||seen.has(key)||!t.vi)return;seen.add(key);rows.push({id:'sentence:v1:'+id,prompt:t.vi,answers:[t.hanzi],choices:[],explanation:note,sample:{hanzi:t.hanzi,pinyin:t.pinyin,vi:t.vi},...requirements});};
  unit.grammar.forEach(g=>(g.examples||[]).forEach((t,i)=>add(g.id+':'+i,t,g.explanation,{requiredGrammar:g.id})));
  unit.dialogue.forEach((t,i)=>add(unit.id+':dialogue:'+i,t,'Câu trong hội thoại '+unit.title+'. Chú ý cách xưng hô và ngữ cảnh.'));
  examplesFor(unit.id).forEach(t=>add('classifier:'+t.id,t,t.use));
  verbsFor(unit.id).forEach(v=>{add('verb:'+v.id+':whole',v.whole,v.note);add('verb:'+v.id+':split',v.split,v.note,{requiresPracticedForm:true});});
  if(unit.id==='tw.greetings')for(const [hanzi,pinyin,vi] of [
   ['你好！','Nǐ hǎo!','Xin chào!'],['您好！','Nín hǎo!','Xin chào (kính trọng)!'],['早安！','Zǎo ān!','Chào buổi sáng!'],['晚安！','Wǎn ān!','Chúc ngủ ngon!'],['再見！','Zàijiàn!','Tạm biệt!'],['謝謝！','Xièxie!','Cảm ơn!'],['謝謝你！','Xièxie nǐ!','Cảm ơn bạn!'],['不客氣。','Bú kèqi.','Không có gì (đáp lời cảm ơn).'],['對不起。','Duìbuqǐ.','Xin lỗi.'],['沒關係。','Méi guānxi.','Không sao.'],
  ])add('greetings:basic:'+Array.from(normalizeHanzi(hanzi)).map(c=>c.codePointAt(0)).join('-'),{hanzi,pinyin,vi},'Lời chào hoặc câu giao tiếp ngắn từ các từ đã học.');
 }
 return rows;
}
// Variants are authored, not inferred by deleting arbitrary Hanzi or changing word order.
const alternatives:Record<string,string[]>={
 '你好，我是越南人。':['你好，我是越南人。','你好，我來自越南。'],
 '我叫小安。':['我叫小安。','我的名字是小安。'],
 '你好！我叫安。':['你好！我叫安。','你好，我的名字是安。'],
 '你叫什麼名字？':['你叫什麼名字？','你的名字是什麼？','你叫什麼？'],
 '我叫安。':['我叫安。','我的名字是安。'],
 '我是學生。':['我是學生。','我是一名學生。'],
 '我想看書。':['我想看書。','我想讀書。'],
 '我明天跟朋友見面。':['我明天跟朋友見面。','明天我跟朋友見面。','我明天和朋友見面。'],
 '我要兩杯茶。':['我要兩杯茶。','我想要兩杯茶。'],
 '我要一杯茶，謝謝。':['我要一杯茶，謝謝。','我想要一杯茶，謝謝。','請給我一杯茶，謝謝。'],
 '你好，我要一碗麵。':['你好，我要一碗麵。','你好，我想要一碗麵。','你好，請給我一碗麵。'],
 '我沒有哥哥。':['我沒有哥哥。','我沒哥哥。'],
 '我明天跟老師見面。':['我明天跟老師見面。','明天我跟老師見面。','我明天和老師見面。'],
 '我有兩個朋友。':['我有兩個朋友。','我有兩位朋友。'],
 '謝謝。':['謝謝。','謝謝你。'],
 '再見。':['再見。','再會。'],
};
export function acceptedSentences(item:WrittenItem){return [...new Set([...item.answers,...item.answers.flatMap(a=>alternatives[a]||[])])];}
export function matchesWritten(item:WrittenItem,answer:string){return acceptedSentences(item).some(a=>normalizeHanzi(a)===normalizeHanzi(answer));}
export function sentenceSet(pool:WrittenItem[],count:number,history:WrittenRun[],random=Math.random){
 const relevant=history.filter(r=>r.mode==='sentences');let cycle=Math.max(1,...relevant.map(r=>r.cycle));
 let used=new Set(relevant.filter(r=>r.cycle===cycle).flatMap(r=>r.packet.items.map(q=>q.id)));
 let available=pool.filter(q=>!used.has(q.id));
 if(!available.length){cycle++;used=new Set();available=pool;}
 // Exhaust remaining questions first, then fill a short tail from the next cycle.
 let items=shuffled(available,random).slice(0,count);
 if(items.length<5&&pool.length>=5){cycle++;const ids=new Set(items.map(q=>q.id));items=[...items,...shuffled(pool.filter(q=>!ids.has(q.id)),random).slice(0,count-items.length)];}
 return {cycle,packet:{id:'sentences:v1:'+crypto.randomUUID(),title:'Viết câu từ kiến thức đã học',mode:'sentences' as const,passage:[],items}};
}
export function writtenAssisted(run:WrittenRun,id:string){return !!run.help[id]||(run.mode==='reading'&&Object.keys(run.help).some(key=>run.help[key]&&(key.startsWith('passage:')||key.startsWith('translation:'))));}
export function readingSets(unit:Unit):WrittenSet[]{
 if(unit.id==='tw.greetings')return greetingReadings;
 return (unit.practice_sets||[]).filter(p=>p.skill==='reading').map(p=>({id:p.id+':batch-v1',title:p.title,mode:'reading',format:'prose',passage:p.passage,
  items:p.items.map((q:PracticeItem)=>({id:q.id+':batch-v1',prompt:q.prompt,answers:q.answers,choices:q.choices,explanation:q.explanation,evidence:q.evidence_index===null?[]:[q.evidence_index]}))}));
}
export function readingSet(unit:Unit,history:WrittenRun[]){
 const packets=readingSets(unit),past=history.filter(r=>r.mode==='reading'&&packets.some(p=>p.id===r.packet.id));let cycle=Math.max(1,...past.map(r=>r.cycle));
 const used=new Set(past.filter(r=>r.cycle===cycle).map(r=>r.packet.id));let available=packets.filter(p=>!used.has(p.id));if(!available.length){cycle++;available=packets;}
 const packet=shuffled(available)[0];if(!packet)throw Error('Chủ đề chưa có bộ đọc.');
 return {cycle,packet:{...packet,items:shuffled(packet.items).map(q=>({...q,choices:shuffled(q.choices)}))}};
}
