import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import type {Content,AppState} from './types';
import {topicLanguage,topicLanguageId,topicLanguageItems} from './topicLanguage';
import {writingKnowledge,learnedSentenceBank} from './learnedWriting';
import {additionalVerbs,beginnerVerbs} from './beginnerVerbs';

const content=pack.content as Content;
it('introduces each measure and verb once in curriculum order, with real contextual blanks',()=>{
 const measures=new Set<string>(),verbs=new Set<string>();let chapters=0;
 for(const u of content.units){
  const bank=topicLanguage(content,u.id),items=topicLanguageItems(content,u.id);if(items.length)chapters++;
  expect(bank.verbs.length).toBeLessThanOrEqual(2);
  if(content.units.indexOf(u)<6)expect(bank.verbs).toHaveLength(1);
  for(const q of items.filter(q=>q.id.startsWith('verb:'))){expect(q.examples).toHaveLength(1);expect(q.examples[0].hanzi.length).toBeLessThanOrEqual(8);}
  for(const c of bank.classifiers){expect(measures.has(c.measure)).toBe(false);measures.add(c.measure);}
  for(const v of bank.verbs){expect(verbs.has(v.id)).toBe(false);verbs.add(v.id);}
  for(const r of [...bank.reviewClassifiers,...bank.reviewVerbs])expect(content.units.findIndex(x=>x.id===r.first)).toBeLessThan(content.units.indexOf(u));
  expect(items.every(q=>q.prompt.includes('___')&&q.answers.includes(q.answer)&&q.words.length>0)).toBe(true);
 }
 expect(chapters).toBe(18);
 expect(topicLanguage(content,'tw.food').classifiers.map(e=>e.measure)).not.toContain('杯');
 expect(additionalVerbs).toHaveLength(15);expect(beginnerVerbs).toHaveLength(21);
 expect(topicLanguage(content,'tw.greetings',1).verbs).toHaveLength(6);
 console.log(`Part 5: ${chapters} topics, ${measures.size} measures, ${verbs.size} verbs`);
});
it('grants only correct items after completion, retains them during retry and never unlocks unrelated grammar',()=>{
 const state:AppState={device_id:'test',objects:{sessions:{},cards:{},notes:{},settings:{},placement:{},chats:{},reports:{}},events:[]};
 const unit=content.units[0],id=topicLanguageId(unit.id),items=topicLanguageItems(content,unit.id);
 const data={scope:'topic-language',unit_id:unit.id,revision:2,phase:'exercise',items,answers:items.map((q,i)=>({id:q.id,correct:i===0}))};
 state.objects.sessions[id]={version:1,deleted:false,data};
 expect(writingKnowledge(content,state).words.size).toBe(0);
 data.phase='summary';let known=writingKnowledge(content,state);
 expect(known.words.has(items[0].answer)).toBe(true);expect(known.words.has(items[1].answer)).toBe(false);expect(known.grammar.size).toBe(0);
 expect(learnedSentenceBank(content.units,known).some(q=>q.sample?.hanzi===items[0].examples[0].hanzi)).toBe(true);
 state.objects.sessions[id].data={...data,phase:'intro',answers:[],completed_at:new Date().toISOString(),learned_item_ids:[items[0].id]};
 known=writingKnowledge(content,state);expect(known.words.has(items[0].answer)).toBe(true);
 const legacyItems=topicLanguageItems(content,unit.id,1);
 state.objects.sessions[topicLanguageId(unit.id,1)]={version:1,deleted:false,data:{scope:'topic-language',unit_id:unit.id,revision:1,phase:'summary',items:legacyItems,answers:[{id:'verb:help',correct:true}]}};
 known=writingKnowledge(content,state);expect(known.words.has('幫忙')).toBe(true);
 expect(known.sentences.has('請幫我一個忙')).toBe(true);
});
