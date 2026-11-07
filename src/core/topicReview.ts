import type {AppState,Content,Exercise,TextItem,Unit} from './types';
import {topicReviewFrames} from './topicReviewBank';
import {topicLanguage,topicLanguageDone,topicLanguageItems} from './topicLanguage';
import {examplesFor} from './classifiers';
import {reviewScenes,reviewVerbCases,reviewWritingPairs} from './topicReviewScenes';
import {lessonDialogue} from './lessonSequence';
import {normalizeHanzi} from './learning';
import {shuffled} from './practice';
import {writingKnowledge,missingWritingWords} from './learnedWriting';
import lookup from './study-lookup.json';

export type TopicReviewQuestion=Exercise&{needs_passage?:boolean};
export type TopicReviewPacket={id:string;source:'authored';revision?:number;scene_ids?:string[];title:string;passage:TextItem[];items:TopicReviewQuestion[]};
export type TopicReviewRun={scope:'topic-review';unit_id:string;run:string;created_at:string;cycle:number;phase:'exercise'|'summary';index:number;packet:TopicReviewPacket;draft:string;assisted:boolean;answer_hint?:boolean;passage_assisted?:boolean;answers:{id:string;answer:string;correct:boolean|null;assisted:boolean;skipped:boolean}[]};
export const topicReviewRoute=(id:string)=>'learn/topic-review/'+id;
export function topicReviewReady(content:Content,state:AppState,unit:Unit){return unit.lessons.every(l=>{const r=state.objects.sessions[l.id];return r&&!r.deleted&&!r.data.archived&&r.data.phase==='summary';})&&(!topicLanguageItems(content,unit.id).length||topicLanguageDone(state,unit.id));}
type Fact={text:TextItem;focus:TextItem;gap:string;ask:string;key?:string;accepted?:string[]};
export const isCurrentTopicReview=(packet:TopicReviewPacket|undefined)=>packet?.revision===2&&packet.id.startsWith('topic-review:v2:');
export const isRetiredTopicReviewItem=(id:string)=>id.startsWith('topic-review:v1:');
const fill=(line:TextItem,value:TextItem):TextItem=>({hanzi:line.hanzi.replace('{0}',value.hanzi),pinyin:line.pinyin.replace('{0}',value.pinyin),vi:line.vi.replace('{0}',value.vi)});
const lexicon=[...new Set(lookup.words.map(w=>w.hanzi))].sort((a,b)=>b.length-a.length);
// Completed introductions also supply their connective words. Never grant an
// entire future topic, or all supplemental advanced-verb examples, by position.
export function topicReviewKnowledge(content:Content,state:AppState){
 const k=writingKnowledge(content,state);
 function seen(text:string){for(let at=0;at<text.length;){if(!/[\u3400-\u9fff]/.test(text[at])){at++;continue;}const word=lexicon.find(w=>text.startsWith(w,at))||text[at];k.words.add(normalizeHanzi(word));at+=word.length;}}
 for(const u of content.units){
  for(const l of u.lessons){const r=state.objects.sessions[l.id];if(!r||r.deleted||r.data.archived||r.data.phase!=='summary')continue;
   lessonDialogue(l).forEach(t=>seen(t.hanzi));u.grammar.filter(g=>l.grammar_ids.includes(g.id)).forEach(g=>(g.examples||[]).forEach(t=>seen(t.hanzi)));
  }
  if(topicLanguageDone(state,u.id))topicLanguageItems(content,u.id).forEach(q=>{q.words.forEach(t=>seen(t.hanzi));q.examples.forEach(t=>seen(t.hanzi));});
 }
 return k;
}
export function topicReviewFacts(content:Content,unit:Unit):Fact[][]{
 const frames=topicReviewFrames[unit.id]||[],bank=topicLanguage(content,unit.id);
 const facts:Fact[][]=frames.map(f=>f.values.map(v=>({text:fill(f.line,v),focus:v,gap:v.hanzi,ask:f.ask,key:`${frames.indexOf(f)}.${f.values.indexOf(v)}`})).filter((v,i,all)=>all.findIndex(t=>t.text.hanzi===v.text.hanzi)===i));
 // Review only the introductory verb, never auto-expand to separable patterns.
 const measures=examplesFor(unit.id);
 const classifierFacts=measures.flatMap(e=>[['一','yī','một'],['兩','liǎng','hai']].map(([h,p,v])=>{
  const phrase={hanzi:e.phrase.hanzi.replace(/^[一兩三四五六七八九十]+/,h),pinyin:e.phrase.pinyin.replace(/^\S+/,p),vi:e.phrase.vi.replace(/^(một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)/,v)};
  return {key:`2:${e.id}:${h==='一'?1:2}`,text:{hanzi:e.hanzi.replace(e.phrase.hanzi,phrase.hanzi),pinyin:e.pinyin.replace(new RegExp(e.phrase.pinyin,'i'),phrase.pinyin),vi:e.vi.replace(e.phrase.vi,phrase.vi)},focus:phrase,gap:e.measure,accepted:e.accepted,ask:'Cụm số lượng nào được nhắc đến?'};
 }));
 const verbFacts=(reviewVerbCases[unit.id.replace('tw.','')]||[]).map(example=>{
  const verb=bank.verbs.find(v=>v.id===example.verb);
  if(!verb)throw Error('Thiếu động từ nhập môn cho câu đã biên soạn: '+example.id);
  return {key:'3:'+example.id,text:example.text,focus:example.text,gap:verb.hanzi,ask:'Câu cuối diễn đạt điều gì?'};
 });
 if(classifierFacts.length)facts.push(classifierFacts);
 if(verbFacts.length)facts.push(verbFacts);
 return facts.map((g,i)=>i===2?g.map(f=>classifierContext(unit.id,f)):g);
}
function classifierContext(unit:string,f:Fact):Fact{
 // Explicit sentence frames retain their noun and deictic referents. The only
 // varying slot here is the registered quantity one/two of the same noun.
 const id=f.key!.split(':')[1],two=f.key!.endsWith(':2'),n=two?'兩':'一',p=two?'liǎng':'yī',v=two?'hai':'một';
 const sentence=(hanzi:string,pinyin:string,vi:string,focus=f.focus,gap=f.gap)=>({...f,text:{hanzi,pinyin,vi},focus,gap});
 if(unit==='tw.greetings'&&id==='teacher')return sentence(`我有${n}位老師。`,`Wǒ yǒu ${p} wèi lǎoshī.`,`Tôi có ${v} thầy/cô.`);
 if(unit==='tw.transport'&&id==='car')return sentence(`車站前面有${n}輛車。`,`Chēzhàn qiánmiàn yǒu ${p} liàng chē.`,`Phía trước nhà ga có ${v} chiếc xe.`);
 if(['tw.home','tw.renting'].includes(unit)&&id==='chair')return sentence(`房間裡有${n}把椅子。`,`Fángjiān lǐ yǒu ${p} bǎ yǐzi.`,`Trong phòng có ${v} chiếc ghế.`);
 if(unit==='tw.information'&&id==='shop')return sentence(`附近有${n}家商店。`,`Fùjìn yǒu ${p} jiā shāngdiàn.`,`Gần đây có ${v} cửa hàng.`);
 if(unit==='tw.information'&&id==='teacher')return sentence(`我想問${n}位老師。`,`Wǒ xiǎng wèn ${p} wèi lǎoshī.`,`Tôi muốn hỏi ${v} thầy/cô.`);
 if(['tw.classroom','tw.campus'].includes(unit)&&id==='book')return sentence(`我有${n}本書。`,`Wǒ yǒu ${p} běn shū.`,`Tôi có ${v} quyển sách.`);
 if(unit==='tw.services'&&id==='letter')return sentence(`我有${n}封信。`,`Wǒ yǒu ${p} fēng xìn.`,`Tôi có ${v} lá thư.`);
 if(unit==='tw.health'&&id==='bottle')return sentence(`我有${n}瓶水。`,`Wǒ yǒu ${p} píng shuǐ.`,`Tôi có ${v} chai nước.`);
 if(unit==='tw.worklife'&&id==='people')return sentence(`我有${n}個同事。`,`Wǒ yǒu ${p} ge tóngshì.`,`Tôi có ${v} đồng nghiệp.`,{hanzi:n+'個同事',pinyin:p+' ge tóngshì',vi:v+' đồng nghiệp'});
 if(unit==='tw.travel'&&id==='room')return sentence(`我需要${n}間房間。`,`Wǒ xūyào ${p} jiān fángjiān.`,`Tôi cần ${v} căn phòng.`);
 return f;
}
export function topicReviewPool(content:Content,state:AppState,unit:Unit){
 const knowledge=topicReviewKnowledge(content,state),all=topicReviewFacts(content,unit);
 if(unit.id==='tw.food')all[2].push({key:'2:rice-bowl:1',text:{hanzi:'我要一碗飯。',pinyin:'Wǒ yào yī wǎn fàn.',vi:'Tôi muốn một bát cơm.'},focus:{hanzi:'一碗飯',pinyin:'yī wǎn fàn',vi:'một bát cơm'},gap:'碗',ask:'Cụm số lượng nào được nhắc đến?'});
 const missing=[...new Set(all.flat().flatMap(f=>missingWritingWords(f.text.hanzi,knowledge)))];
 const groups=all.map((facts,i)=>facts.map((f,j)=>({...f,key:f.key||`${i}.${j}`,accepted:f.accepted?.filter(a=>!missingWritingWords(a,knowledge).length)})).filter(f=>!missingWritingWords(f.text.hanzi,knowledge).length));
 const byKey=new Map(groups.flat().map(f=>[f.key,f]));
 const profiles=(reviewScenes[unit.id.replace('tw.','')]||[]).flatMap(scene=>{
  const keys=[`0.${scene.first}`,`1.${scene.second}`,`2:${scene.classifier}:${scene.quantity}`,'3:'+scene.verb];
  const facts=keys.map(key=>byKey.get(key));return facts.every(Boolean)?[{id:scene.id,facts:facts as Fact[]}]:[];
 });
 const approved=new Set(profiles.flatMap(p=>p.facts.map(f=>f.key)));
 return {groups:groups.map(g=>g.filter(f=>approved.has(f.key))),missing,profiles};
}
export function createTopicReview(content:Content,state:AppState,unit:Unit,history:TopicReviewRun[],random=Math.random):TopicReviewRun{
 if(!topicReviewReady(content,state,unit))throw Error('Hoàn thành các phần học của chủ đề trước khi mở lượt ôn.');
 const {groups,missing,profiles}=topicReviewPool(content,state,unit);
 if(profiles.length<3)throw Error('Chưa đủ tình huống đã biên soạn chỉ dùng từ đã học. Từ cần đối chiếu: '+missing.join('、'));
 const past=history.filter(h=>isCurrentTopicReview(h.packet));
 let cycle=Math.max(1,...past.map(h=>h.cycle));const used=new Set(past.filter(h=>h.cycle===cycle).map(h=>h.packet.id));
 const candidates=profiles.flatMap((a,i)=>profiles.filter(b=>b.id!==a.id).map(b=>{
  const c=profiles[(i+1)%profiles.length].id!==b.id?profiles[(i+1)%profiles.length]:profiles[(i+2)%profiles.length];
  return {id:`topic-review:v2:${unit.id}:${a.id}:${b.id}:${c.id}`,a,b,c};
 }));
 let available=candidates.filter(p=>!used.has(p.id));
 if(!available.length){cycle++;available=candidates.filter(p=>p.id!==past.at(-1)?.packet.id);if(!available.length)available=candidates;}
 const selected=shuffled(available,random)[0],pid=selected.id,a=selected.a.facts,b=selected.b.facts,c=selected.c.facts;
 const passage=[...a.map(f=>({...f.text,speaker:'Người A'})),...b.map(f=>({...f.text,speaker:'Người B'}))];
 const items:TopicReviewQuestion[]=[];
 const add=(tag:string,kind:string,prompt:string,answers:string[],choices:string[],stimulus:TextItem|null,explanation:string,needs_passage=false)=>items.push({id:pid+':'+tag,kind,prompt,answers,choices:shuffled([...new Set(choices)],random),stimulus,explanation,needs_passage,word_id:null,skill:needs_passage?'reading':kind==='writing'?'writing':'grammar',tokens:[]});
 for(let i=0;i<4;i++){
  const who=i%2?'B':'A',fact=(who==='A'?a:b)[i];
  add('read:'+i,'choice',`Theo phần của Người ${who}, ${fact.ask.toLocaleLowerCase()}`,[fact.focus.vi],[...groups[i].map(f=>f.focus.vi),...a.filter((_,j)=>j!==i).map(f=>f.text.vi)],fact.text,`Căn cứ câu ${i+1+(who==='B'?4:0)}: ${fact.text.hanzi} (${fact.text.pinyin}) — ${fact.text.vi}`,true);
 }
 for(let i=0;i<2;i++){
  const actor=random()<.5?'A':'B',own=actor==='A'?a:b,other=actor==='A'?b:a,x=i*2,y=x+1;
  const pair=(first:Fact,second:Fact)=>first.focus.vi+'; '+second.focus.vi;
  const answer=pair(own[x],own[y]);
  const sample={hanzi:own[x].text.hanzi+own[y].text.hanzi,pinyin:own[x].text.pinyin+' '+own[y].text.pinyin,vi:own[x].text.vi+' '+own[y].text.vi};
  add('compare:'+i,'choice',`Chọn phương án khớp đồng thời hai thông tin trong câu ${x+1} và ${y+1} của Người ${actor}.`,[answer],[answer,pair(other[x],other[y]),pair(own[x],other[y]),pair(other[x],own[y])],sample,`Người ${actor}: ${sample.hanzi} (${sample.pinyin}) — ${sample.vi}`,true);
 }
 for(let i=0;i<4;i++){
  const fact=c[i],gaps=[...new Set(groups[i].flatMap(f=>f.accepted?.length?f.accepted:[f.gap]))],accepted=fact.accepted?.length?fact.accepted:[fact.gap];
  add('fill:'+i,'cloze',`Tình huống mới: ${fact.text.vi}\nĐiền phần thiếu: ${fact.text.hanzi.replace(fact.gap,'___')}`,accepted,i===2&&gaps.length>1?gaps:[],fact.text,`${fact.text.hanzi} (${fact.text.pinyin}) — ${fact.text.vi}`+(accepted.length>1?' Cũng chấp nhận '+accepted.filter(a=>a!==fact.gap).join(' / ')+' trong ngữ cảnh này.':''));
 }
 for(let i=0;i<3;i++){
  const [xi,yi]=reviewWritingPairs[unit.id.replace('tw.','')][i],x=c[xi],y=c[yi],sample={hanzi:x.text.hanzi+y.text.hanzi,pinyin:x.text.pinyin+' '+y.text.pinyin,vi:x.text.vi+' '+y.text.vi};
  add('write:'+i,'writing',`Viết hai câu diễn đạt tình huống: ${sample.vi}`,[sample.hanzi],[],sample,'Hai câu thuộc cùng một tình huống đã biên soạn. Cách diễn đạt khác cần đối chiếu ngữ cảnh, không tự kết luận sai.');
 }
 for(let i=0;i<2;i++){
  const fact=c[i];add('situation:'+i,'choice',`Chọn cách nói phù hợp yêu cầu mới: ${fact.text.vi}`,[fact.text.hanzi],groups[i].map(f=>f.text.hanzi),fact.text,`${fact.text.hanzi} (${fact.text.pinyin}) — ${fact.text.vi}`);
 }
 return {scope:'topic-review',unit_id:unit.id,run:crypto.randomUUID(),created_at:new Date().toISOString(),cycle,phase:'exercise',index:0,packet:{id:pid,source:'authored',revision:2,scene_ids:[selected.a.id,selected.b.id,selected.c.id],title:unit.title+' · Ôn vận dụng',passage,items:shuffled(items,random)},draft:'',assisted:false,answers:[]};
}
