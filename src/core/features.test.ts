import {describe,it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import samples from '../../public/learning/pinyin/catalog.json';
import {followingLesson,lessonAt,lessonRoute,orderedLessons} from './routes';
import {spellingSteps,toneMark,type Syllable,initials,finals} from './pinyin';
import {grade} from './learning';
import type {Content} from './types';
const content=pack.content as Content;
const catalog=samples as Syllable[];
describe('lesson navigation',()=>{
 it('routes are stable across unit boundaries, including completed/partial sessions',()=>{
  const all=orderedLessons(content);expect(all).toHaveLength(48);
  expect(lessonAt(content,lessonRoute(all[0].lesson.id))?.lesson.id).toBe(all[0].lesson.id);
  expect(followingLesson(content,all[3].lesson.id)?.unit.id).toBe(all[4].unit.id);
  expect(followingLesson(content,all[47].lesson.id)).toBeUndefined();expect(lessonAt(content,'learn/invalid')).toBeUndefined();
 });
});
describe('Pinyin and packaged examples',()=>{
 it('places tones on priority vowels and preserves ü',()=>{
  expect(toneMark('liu',3)).toBe('liǔ');expect(toneMark('gui',4)).toBe('guì');expect(toneMark('lüe',4)).toBe('lüè');expect(toneMark('nü',3)).toBe('nǚ');expect(toneMark('shui',3)).toBe('shuǐ');expect(toneMark('ou',2)).toBe('óu');expect(toneMark('zhi',0)).toBe('zhi');
 });
 it('restores contracted finals, zero initials and j/q/x ü',()=>{
  for(const [base,i,f] of [['you','','iou'],['wei','','uei'],['yun','','ün'],['ju','j','ü'],['qun','q','ün'],['liu','l','iou'],['zhi','zh','-i'],['zi','z','-i']])expect(catalog.find(s=>s.base===base)).toMatchObject({initial:i,final:f});
  expect(catalog.some(s=>s.initial==='b'&&s.final==='ü')).toBe(false);expect(catalog.some(s=>s.base==='shong')).toBe(false);
 });
 it('uses recorded whole syllables after MOE components and no i for apical vowels',()=>{
  const steps=spellingSteps(catalog.find(s=>s.base==='ba')!,1);expect(steps.map(s=>s.path)).toEqual(['/learning/pinyin/moe/F1.WAV','/learning/pinyin/moe/F22.WAV','/learning/pinyin/syllables/ba1.mp3']);
  expect(spellingSteps(catalog.find(s=>s.base==='zhi')!,1).map(s=>s.label)).toEqual(['zh','zhī']);expect(spellingSteps(catalog.find(s=>s.base==='ba')!,0)).toEqual([]);
 });
 it('every teaching syllable has one visible cell',()=>{
  const keys=catalog.map(s=>s.initial+':'+s.final);expect(new Set(keys).size).toBe(keys.length);
  for(const s of catalog){expect(initials).toContain(s.initial);expect(finals).toContain(s.final);}
 });
});
describe('content completeness',()=>{
 it('24 grammar entries have three distinct examples and all authored answers grade correctly',()=>{
  const grammars=content.units.flatMap(u=>u.grammar);expect(grammars).toHaveLength(24);
  for(const g of grammars){expect(new Set(g.examples?.map(e=>e.hanzi)).size,g.id).toBeGreaterThanOrEqual(3);expect(g.exercises).toHaveLength(4);for(const ex of g.exercises!){expect(ex.grammar_id).toBe(g.id);for(const answer of ex.answers)expect(grade(ex,answer),ex.id).toBe(true);}}
  expect(content.grammar_roadmap).toHaveLength(496);
 });
});
