import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import {classifierUnit,examplesFor} from './classifiers';
import {practiceGrade,practiceSession} from './practice';

it('covers all topics with valid choices, blanks and persisted supplemental packets',()=>{
 const ids=new Set<string>();
 for(const topic of [{id:'all',title:'Nhập môn'},...pack.content.units]){
  expect(examplesFor(topic.id).length).toBeGreaterThan(1);
  const unit=classifierUnit(topic.id,topic.title);
  expect(unit.practice_sets).toHaveLength(4);
  for(const packet of unit.practice_sets!){
   const saved=JSON.parse(JSON.stringify(practiceSession(unit.id,packet,1)));
   expect(saved.unit_id).toBe('classifiers:'+topic.id);
   for(const q of packet.items){
    expect(ids.has(q.id)).toBe(false);ids.add(q.id);
    expect(q.answers.length).toBeGreaterThan(0);
    if(q.kind==='choice')for(const a of q.answers)expect(q.choices).toContain(a);
    if(q.kind==='cloze-input'){expect(q.prompt).toContain('＿＿');for(const a of q.answers)expect(practiceGrade(q,a)).toBe(true);expect(practiceGrade(q,'錯')).toBe(false);}
   }
  }
 }
});
