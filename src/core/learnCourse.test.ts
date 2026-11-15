import {it,expect} from 'vitest';
import data from '../../content/learn-course.json';
import {newCourseRun,courseGrade,reviewLesson} from './learnCourse';
import type {Course} from './learnCourse';
import {structureParts} from './characterStructure';
const course={...data,epoch:'TEST',knowledge:{words:[],grammar:[]}} as Course;
it('90 lessons deliver five balanced modes, sentence majority, bounded words and unique tasks',()=>{
 const c=structuredClone(course),samples=new Set(c.units.flatMap(u=>u.lessons.flatMap(l=>l.examples.map(e=>e.hanzi))));
 let count=0;
 for(const u of c.units)for(const l of u.lessons){
  expect(l.words).toHaveLength(l.level);expect(l.examples.length).toBeGreaterThanOrEqual(4);expect(l.patterns).toHaveLength(2);
  const r=newCourseRun(c,l,[],()=>.37),known=new Set([...c.knowledge.words,...l.words.map(w=>w.hanzi)]);
  expect(r.tasks).toHaveLength(l.question_count);
  for(const mode of ['word','gap','listen','to_zh','to_vi'])expect(r.tasks.filter(q=>q.mode===mode)).toHaveLength(l.question_count/5);
  expect(new Set(r.tasks.filter(q=>q.mode!=='word').map(q=>q.entry.hanzi)).size).toBe(l.question_count*4/5);
  for(const q of r.tasks){
   if(q.mode!=='word'){
    expect(samples.has(q.entry.hanzi)).toBe(false);
    expect(q.entry.words!.filter(w=>!known.has(w)).length).toBeLessThanOrEqual(l.extra_limit);
    expect(q.entry.words!.filter(w=>known.has(w)).length*3).toBeGreaterThanOrEqual(q.entry.words!.length*2);
   }
   if(q.choices.length){expect(q.choices.length).toBeLessThanOrEqual(4);expect(q.choices).toContain(q.answer);}
  }
  const later=newCourseRun(c,l,[r],()=>.63);expect(later.tasks.map(q=>q.entry.hanzi)).not.toEqual(r.tasks.map(q=>q.entry.hanzi));
  c.knowledge.words.push(...l.words.map(w=>w.hanzi));c.knowledge.grammar.push(...l.grammar);count++;
 }
 expect(count).toBe(90);
 const review=reviewLesson(c.units[0]);expect(newCourseRun(c,review).tasks).toHaveLength(20);
});
it('does not fill missing sentences with word translations and does not grade alternate translations wrong',()=>{
 const l=course.units[0].lessons[0];expect(()=>newCourseRun(course,{...l,sentences:[]})).toThrow('Chưa đủ câu');
 const q=newCourseRun(course,l).tasks.find(q=>q.mode==='to_vi')!;expect(courseGrade(q,'Một cách diễn đạt khác')).toBe('compare');
 expect(structureParts('⿰女子','好').map(p=>p.character)).toEqual(['女','子']);
});
it('excludes unsupported role questions and uses context-specific Vietnamese meanings throughout the catalog',()=>{
 const entries=course.units.flatMap(u=>u.lessons.flatMap(l=>[...l.examples,...l.sentences]));
 for(const e of entries){
  expect(e.hanzi).not.toMatch(/(老師|學生|同學)(也)?(不是|是)(學生|老師)/);
  expect(e.hanzi).not.toMatch(/我(也)?是(學生|老師)嗎/);
  if(e.hanzi.includes('您是老師嗎'))expect(e.vi).not.toContain('thầy/cô');
  if(e.hanzi==='我要冰。')expect(e.vi).toBe('Tôi muốn đá.');
  if(e.hanzi==='這是我的太太。')expect(e.vi).toBe('Đây là vợ của tôi.');
 }
 expect(course.version).toBe(2);
});
