import {describe,it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {expansionLessons,expansionsFor,newExpansionRun,submitExpansion,advanceExpansion,expansionSessionId,expansionDone,gradeExpansion} from './lessonExpansion';
import {expansionSources} from './lessonExpansionTypes';
import {numberLessons} from './lessonExpansionNumbers';
import {writingKnowledge} from './learnedWriting';
import {sentenceBank} from './writtenPractice';
import type {AppState,Content} from './types';
const content=JSON.parse(readFileSync('content/foundation.pack.json','utf8')).content as Content;
const empty=():AppState=>({device_id:'test',objects:{sessions:{},cards:{},notes:{},settings:{},placement:{},chats:{},reports:{}},events:[]});

describe('authored expansion curriculum',()=>{
 it('covers all topics and roundtrips every complete snapshot through the actual backend validator',()=>{
  expect(new Set(expansionLessons.map(l=>l.unit_id))).toEqual(new Set(content.units.map(u=>u.id)));
  expect(expansionLessons).toHaveLength(40);
  expect(new Set(expansionLessons.map(l=>l.id)).size).toBe(40);
  const snapshots=[];
  for(const l of expansionLessons){
   expect(l.questions).toHaveLength(10);
   expect(new Set(l.questions.map(q=>q.id)).size).toBe(10);
   expect(l.blocks.length).toBeGreaterThanOrEqual(2);
   expect(l.references.every(r=>!!expansionSources[r.source])).toBe(true);
   for(const text of [...l.vocabulary,...l.blocks.flatMap(b=>b.examples),...l.questions.map(q=>q.solution)]){
    expect(text.hanzi.trim()).not.toBe('');expect(text.pinyin.trim()).not.toBe('');expect(text.vi.trim()).not.toBe('');
   }
   let run=newExpansionRun(l);snapshots.push(structuredClone(run));run.phase='exercise';
   for(const q of l.questions){
    expect(q.choices.length===0||q.answers.every(a=>q.choices.includes(a))).toBe(true);
    run=submitExpansion(run,q.answers[0]);snapshots.push(structuredClone(run));run=advanceExpansion(run);snapshots.push(structuredClone(run));
   }
   expect(run.phase).toBe('summary');
  }
  const output=execFileSync('.venv/Scripts/python.exe',['-c','import json,sys; from backend.db import validate_object; rows=json.load(sys.stdin); [validate_object("sessions", r) for r in rows]; print(len(rows))'],{input:JSON.stringify(snapshots),encoding:'utf8'});
  expect(Number(output.trim())).toBe(snapshots.length);
 });
 it('distinguishes place value, Taiwan weekdays, calendar dates and elapsed time',()=>{
  const numbers=numberLessons;expect(numbers).toHaveLength(6);
  const byKey=(key:string)=>numbers.find(l=>l.id.endsWith(':'+key))!;
  expect(gradeExpansion(byKey('tens').questions[0],'十二')).toBe(false);
  expect(gradeExpansion(byKey('hundreds').questions[1],'二百三十')).toBe(true);
  expect(gradeExpansion(byKey('hundreds').questions[1],'兩百三')).toBe(false);
  expect(gradeExpansion(byKey('clock').questions[2],'兩點八分')).toBe(true);
  expect(gradeExpansion(byKey('clock').questions[2],'兩個小時')).toBe(false);
  expect(gradeExpansion(byKey('calendar').questions[0],'星期三')).toBe(false);
  expect(gradeExpansion(byKey('calendar').questions[1],'八月二十一日')).toBe(true);
  expect(byKey('calendar').vocabulary.find(v=>v.hanzi==='星期')?.pinyin).toBe('xīngqí');
  expect(byKey('relative').vocabulary.filter(v=>['上個月','這個月','下個月'].includes(v.hanzi))).toHaveLength(3);
 });
 it('preserves old lessons, snapshots and retake history; only completed correct practice supplies writing evidence',()=>{
  const state=empty(),lesson=expansionLessons.find(l=>l.id.endsWith('family:age'))!;
  state.objects.sessions[content.units[0].lessons[0].id]={version:4,deleted:false,data:{phase:'summary',answers:[]}};
  const old=JSON.stringify(state.objects.sessions);
  let run=newExpansionRun(lesson);run.phase='exercise';
  const id=expansionSessionId(run);state.objects.sessions[id]={version:1,deleted:false,data:run};
  const target=run.packet.questions[0].solution.hanzi;
  expect(writingKnowledge(content,state).sentences.has(target.replace(/[。？]/g,''))).toBe(false);
  for(const q of run.packet.questions){run=advanceExpansion(submitExpansion(run,q.answers[0]));}
  state.objects.sessions[id].data=run;
  expect(expansionDone(state,lesson.id)).toBe(true);
  expect(writingKnowledge(content,state).sentences.has(target.replace(/[。？]/g,''))).toBe(true);
  const retake=newExpansionRun(lesson);state.objects.sessions[expansionSessionId(retake)]={version:1,deleted:false,data:retake};
  expect(expansionDone(state,lesson.id)).toBe(true);expect(run.answers).toHaveLength(10);
  delete state.objects.sessions[id];delete state.objects.sessions[expansionSessionId(retake)];
  expect(JSON.stringify(state.objects.sessions)).toBe(old);
  expect(state.objects.cards).toEqual({});
  expect(sentenceBank(content.units).some(q=>q.id.includes('expansion:v1:'))).toBe(true);
  expect(()=>submitExpansion({...run,phase:'exercise',submitted:true},'x')).toThrow();
 });
 it('keeps a saved short packet intact while new runs receive ten questions',()=>{
  const lesson=expansionLessons[0];
  let old=newExpansionRun({...lesson,questions:lesson.questions.slice(0,3)});
  old.phase='exercise';
  for(const q of old.packet.questions)old=advanceExpansion(submitExpansion(old,q.answers[0]));
  expect(old.phase).toBe('summary');expect(old.packet.questions).toHaveLength(3);
  expect(newExpansionRun(lesson).packet.questions).toHaveLength(10);
 });
});
