import {it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import {basicVerbs,separableVerbs,verbTopicUnit,verbsFor} from './verbs';
import {verbLessons,verbLessonUnit} from './verbLessons';
import {practiceGrade,practiceSession} from './practice';
import {classifierUnit} from './classifiers';
import {execFileSync} from 'node:child_process';
it('validates six lessons and topic banks, accepted forms and stable session snapshots',()=>{
 expect(basicVerbs).toHaveLength(20);expect(separableVerbs).toHaveLength(36);expect(new Set(separableVerbs.map(v=>v.id)).size).toBe(36);
 expect(separableVerbs.filter(v=>v.stage==='core')).toHaveLength(24);expect(verbLessons).toHaveLength(6);
 const units=[...verbLessons.map(l=>verbLessonUnit(l.id)),...['all',...pack.content.units.map(u=>u.id)].map(id=>verbTopicUnit(id,id))];
 for(const u of pack.content.units)expect(verbsFor(u.id).length).toBeGreaterThan(0);
 const seen=new Set<string>();for(const unit of units)for(const p of unit.practice_sets!){
  expect(p.items).toHaveLength(6);const s=practiceSession(unit.id,p,1);expect(JSON.parse(JSON.stringify(s)).packet).toEqual(s.packet);
  for(const q of p.items){expect(seen.has(q.id)).toBe(false);seen.add(q.id);expect(q.answers.length).toBeGreaterThan(0);
   if(q.kind==='choice'){expect(new Set(q.choices).size).toBe(q.choices.length);expect(q.choices).toContain(q.answers[0]);}
   if(q.kind==='cloze-input')for(const a of q.answers)expect(practiceGrade(q,a)).toBe(true);
  }
 }
 const all=verbTopicUnit('all','All').practice_sets!.filter(p=>p.skill==='reading');expect(all.flatMap(p=>p.items)).toHaveLength(36);
 // Validate the actual TS packets against Python's persistence contract too.
 const packets=[...units,...['all',...pack.content.units.map(u=>u.id)].map(id=>classifierUnit(id,id))].flatMap(u=>u.practice_sets!);
 execFileSync('.venv/Scripts/python.exe',['-c',"import json,sys; from backend.content import SupplementalPracticeSet,PracticeSet; packets=json.load(sys.stdin); [SupplementalPracticeSet.model_validate(p) for p in packets]; p=packets[0];\nfor model,value in [(PracticeSet,p),(SupplementalPracticeSet,dict(p,source='ai'))]:\n try: model.model_validate(value)\n except ValueError: pass\n else: raise AssertionError('Strict v7/AI boundary was weakened')"],{input:JSON.stringify(packets),encoding:'utf8'});
});
