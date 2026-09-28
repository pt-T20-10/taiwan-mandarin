import {describe,it,expect} from 'vitest';
import pack from '../../content/foundation.pack.json';
import samples from '../../public/learning/pinyin/catalog.json';
import listening from '../../public/learning/pinyin/examples.json';
import coverage from '../../docs/pinyin-coverage.json';
import {followingLesson,lessonAt,lessonRoute,orderedLessons} from './routes';
import {spellingSteps,toneMark,type Syllable,initials,finals} from './pinyin';
import {grade} from './learning';
import type {Content} from './types';
const content=pack.content as Content;
const catalog=samples as Syllable[];
describe('lesson navigation',()=>{
 it('routes are stable across unit boundaries, including completed/partial sessions',()=>{
  const all=orderedLessons(content);expect(all).toHaveLength(72);
  expect(lessonAt(content,lessonRoute(all[0].lesson.id))?.lesson.id).toBe(all[0].lesson.id);
  expect(followingLesson(content,all[3].lesson.id)?.unit.id).toBe(all[4].unit.id);
  expect(followingLesson(content,all[71].lesson.id)).toBeUndefined();expect(lessonAt(content,'learn/invalid')).toBeUndefined();
 });
});
describe('Pinyin and packaged examples',()=>{
 it('validates all Hanzi mappings and accounts for every catalog/tone combination',()=>{
  const keys=catalog.flatMap(s=>[0,1,2,3,4].map(t=>`${s.base}:${t}`));
  const examples=Object.entries(listening.examples);
  expect(new Set([...examples.map(([k])=>k),...coverage.unavailable_keys]).size).toBe(keys.length);
  expect(examples.length+coverage.unavailable_keys.length).toBe(keys.length);
  expect(examples.length).toBe(listening.coverage.mapped);
  for(const [key,e] of examples){
   expect(keys).toContain(key);expect(key).toBe(`${e.base}:${e.tone}`);
   const parts=e.pinyin.split(' ');expect(parts[e.target_index]).toBe(toneMark(e.base,e.tone));
   expect(parts.length).toBe(Array.from(e.hanzi).length);expect(e.hanzi).toMatch(/^[\u4e00-\u9fff]+$/);
   expect(e.source.url).toContain('https://bcoct.naer.edu.tw/');expect(e.source.name).toBeTruthy();
   expect(e.pinyin.replaceAll(' ','')).toBe(e.source.reading.replace(/[\s’'\-]/g,''));
   expect(e.dictionary_status).toBe('verified');expect(e.listening_status).toBe('not-reviewed');
   if(e.tone===0)expect(e.kind).toBe('phrase');
  }
 });
 it('places tones on priority vowels and preserves ü',()=>{
  expect(toneMark('liu',3)).toBe('liǔ');expect(toneMark('gui',4)).toBe('guì');expect(toneMark('lüe',4)).toBe('lüè');expect(toneMark('nü',3)).toBe('nǚ');expect(toneMark('shui',3)).toBe('shuǐ');expect(toneMark('ou',2)).toBe('óu');expect(toneMark('zhi',0)).toBe('zhi');
 });
 it('restores contracted finals, zero initials and j/q/x ü',()=>{
  for(const [base,i,f] of [['you','','iou'],['wei','','uei'],['yun','','ün'],['ju','j','ü'],['qun','q','ün'],['liu','l','iou'],['zhi','zh','-i'],['zi','z','-i']])expect(catalog.find(s=>s.base===base)).toMatchObject({initial:i,final:f});
  expect(catalog.some(s=>s.initial==='b'&&s.final==='ü')).toBe(false);expect(catalog.some(s=>s.base==='shong')).toBe(false);
 });
 it('shows spelling text without pretending Latin TTS is a recorded syllable',()=>{
  const steps=spellingSteps(catalog.find(s=>s.base==='ba')!,1);expect(steps).toEqual(['b','a','bā']);
  expect(spellingSteps(catalog.find(s=>s.base==='zhi')!,1)).toEqual(['zh','zhī']);expect(spellingSteps(catalog.find(s=>s.base==='ba')!,0)).toEqual(['b','a','ba']);
 });
 it('every teaching syllable has one visible cell',()=>{
  const keys=catalog.map(s=>s.initial+':'+s.final);expect(new Set(keys).size).toBe(keys.length);
  for(const s of catalog){expect(initials).toContain(s.initial);expect(finals).toContain(s.final);}
 });
});
describe('content completeness',()=>{
 it('36 grammar entries have three distinct examples and all authored answers grade correctly',()=>{
  const grammars=content.units.flatMap(u=>u.grammar);expect(grammars).toHaveLength(36);
  for(const g of grammars){expect(new Set(g.examples?.map(e=>e.hanzi)).size,g.id).toBeGreaterThanOrEqual(3);expect(g.exercises).toHaveLength(4);for(const ex of g.exercises!){expect(ex.grammar_id).toBe(g.id);for(const answer of ex.answers)expect(grade(ex,answer),ex.id).toBe(true);}}
  expect(content.grammar_roadmap).toHaveLength(496);
 });
});
