import {examplesFor} from './classifiers';
import {verbsFor} from './verbs';
import type {AppState,Content,TextItem} from './types';
import {beginnerVerbs,beginnerVerbsFor} from './beginnerVerbs';

export const topicLanguageId=(unitId:string,revision=2)=>`topic-language:v${revision}:`+unitId;
export const topicLanguageRoute=(unitId:string)=>'learn/topic-language/'+unitId;
export const topicLanguageDone=(state:AppState,unitId:string)=>[1,2].some(revision=>{
 const row=state.objects.sessions[topicLanguageId(unitId,revision)];
 return row&&!row.deleted&&(row.data.phase==='summary'||!!row.data.completed_at);
});

// First introduction follows the fixed curriculum order, never a search/filter
// order or the learner's completion order. A new noun does not make 張 new again.
function legacyTopicLanguage(content:Content,unitId:string){
 const seenMeasures=new Map<string,string>(),seenVerbs=new Map<string,string>();
 for(const unit of content.units){
  const classifiers=examplesFor(unit.id).map(example=>({example,first:seenMeasures.get(example.measure)||unit.id}));
  const verbs=verbsFor(unit.id).map(verb=>({verb,first:seenVerbs.get(verb.id)||unit.id}));
  for(const {example} of classifiers)if(!seenMeasures.has(example.measure))seenMeasures.set(example.measure,unit.id);
  for(const {verb} of verbs)if(!seenVerbs.has(verb.id))seenVerbs.set(verb.id,unit.id);
  if(unit.id===unitId)return {
   classifiers:classifiers.filter(e=>e.first===unit.id).map(e=>e.example),
   verbs:verbs.filter(e=>e.first===unit.id).map(e=>e.verb),
   reviewClassifiers:classifiers.filter(e=>e.first!==unit.id),reviewVerbs:verbs.filter(e=>e.first!==unit.id),
  };
 }
 return {classifiers:[],verbs:[],reviewClassifiers:[],reviewVerbs:[]};
}
export function topicLanguage(content:Content,unitId:string,revision=2){
 const legacy=legacyTopicLanguage(content,unitId);if(revision===1)return legacy;
 const index=content.units.findIndex(u=>u.id===unitId);
 const verbs=beginnerVerbsFor(unitId).map(v=>({...v,note:'Học nguyên từ trong câu ngắn. Chưa cần học dạng tách hoặc câu chỉ thời lượng ở phần nhập môn.'}));
 const reviewVerbs=verbsFor(unitId).flatMap(verb=>{
  const first=beginnerVerbs.find(v=>v.id===verb.id)?.topic;
  return first&&content.units.findIndex(u=>u.id===first)<index?[{verb,first}]:[];
 });
 return {...legacy,verbs,reviewVerbs};
}
export type TopicLanguageItem={id:string;prompt:string;answer:string;answers:string[];words:TextItem[];examples:TextItem[];note:string};
export function topicLanguageItems(content:Content,unitId:string,revision=2):TopicLanguageItem[]{
 const bank=topicLanguage(content,unitId,revision);
 return [
  ...bank.classifiers.map(e=>({id:'classifier:'+e.id,prompt:`Điền lượng từ để nói “${e.vi}”: ${e.hanzi.replace(e.measure,'___')}`,answer:e.measure,answers:e.accepted,words:[{hanzi:e.measure,pinyin:e.reading,vi:e.use},e.phrase],examples:[{hanzi:e.hanzi,pinyin:e.pinyin,vi:e.vi}],note:`${e.measure} (${e.reading}): ${e.use}. ${e.phrase.hanzi} — ${e.phrase.vi}.`+(e.accepted.length>1?` Cũng chấp nhận ${e.accepted.filter(a=>a!==e.measure).join(' / ')} trong câu này.`:'')})),
  ...bank.verbs.map(v=>({id:'verb:'+v.id+(revision===1?'':':intro-v2'),prompt:`Điền động từ để nói “${v.whole.vi}”: ${v.whole.hanzi.replace(v.hanzi,'___')}`,answer:v.hanzi,answers:[v.hanzi],words:[{hanzi:v.hanzi,pinyin:v.pinyin,vi:v.vi}],examples:revision===1?[v.whole,v.split]:[v.whole],note:v.note})),
 ];
}
