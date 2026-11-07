import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import type {AppState,Content} from './types';
import {createTopicReview,topicReviewPool,topicReviewReady,isCurrentTopicReview,isRetiredTopicReviewItem} from './topicReview';
import {reviewVerbCases} from './topicReviewScenes';
import {topicLanguageId} from './topicLanguage';
it('unlocks completed topics and creates fixed 15-item rounds without future vocabulary or repeats',()=>{
 const content=pack.content as unknown as Content;
 const state={objects:{sessions:{},reports:{},cards:{}},events:[]} as unknown as AppState;
 const errors:string[]=[];
 for(const u of content.units){
  expect(topicReviewReady(content,state,u)).toBe(false);
  for(const l of u.lessons)state.objects.sessions[l.id]={version:1,deleted:false,data:{phase:'summary'}};
  state.objects.sessions[topicLanguageId(u.id)]={version:1,deleted:false,data:{scope:'topic-language',unit_id:u.id,revision:2,phase:'summary',completed_at:'TEST'}};
  const pool=topicReviewPool(content,state,u);
  for(const profile of pool.profiles){
   expect(profile.facts).toHaveLength(4);
   expect(reviewVerbCases[u.id.replace('tw.','')].map(v=>v.text)).toContainEqual(profile.facts[3].text);
   expect(profile.facts[3].text.hanzi).not.toMatch(/^(我|你|他)見面。$/);
   if(profile.id==='afternoon-five')expect(profile.facts[0].text.hanzi).toContain('到五點');
   if(profile.id==='afternoon-four')expect(profile.facts[0].text.hanzi).toContain('到四點');
  }
  for(const g of pool.groups)for(const f of g)expect(f.text.hanzi).toContain(f.gap);
  if(pool.profiles.length<3){errors.push(u.id+' missing: '+pool.missing.join('、'));continue;}
  const a=createTopicReview(content,state,u,[],()=>.4),b=createTopicReview(content,state,u,[a],()=>.4);
  expect(isCurrentTopicReview(a.packet)).toBe(true);
  expect(a.packet.scene_ids).toHaveLength(3);expect(new Set(a.packet.scene_ids).size).toBe(3);
  expect(a.packet.items).toHaveLength(15);expect(new Set(a.packet.items.map(q=>q.id)).size).toBe(15);
  expect(b.packet.id).not.toBe(a.packet.id);
  expect(b.packet.passage).not.toEqual(a.packet.passage);
  expect(a.packet.items.filter(q=>q.kind==='writing')).toHaveLength(3);
  for(const q of a.packet.items){expect(q.answers.length).toBeGreaterThan(0);if(q.choices.length)expect(q.choices).toContain(q.answers[0]);if(q.kind==='cloze')expect(q.prompt).toContain('___');}
 }
 expect(errors).toEqual([]);
 expect(isRetiredTopicReviewItem('topic-review:v1:tw.greetings:old:read:0')).toBe(true);
 expect(isRetiredTopicReviewItem('topic-review:v2:tw.greetings:new:read:0')).toBe(false);
});
