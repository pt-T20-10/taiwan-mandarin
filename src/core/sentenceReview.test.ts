import {describe,it,expect} from 'vitest';
import bank from '../../content/sentence-review.json';
import {sentenceRound,assessSentence,answerSentence,nextSentence,emptySentenceState,sentenceAudioKeys,packSentences,unpackSentences} from './sentenceReview';
import type {SentenceEntry} from './sentenceReview';
const entries=bank.entries as SentenceEntry[];
describe('offline sentence practice',()=>{
 it('covers every topic with distinct texts and complete word spans',()=>{
  for(const unit of bank.units){const rows=entries.filter(e=>e.unit_id===unit.id);
   expect(rows.length).toBeGreaterThanOrEqual(60);expect(new Set(rows.map(e=>e.hanzi)).size).toBe(rows.length);
   expect(new Set(rows.map(e=>e.group)).size).toBeGreaterThanOrEqual(8);
   for(const e of rows){expect(e.options).toContain(e.gap);expect(e.hanzi).toContain(e.gap);
    for(let i=0;i<e.hanzi.length;i++)if(/\p{Script=Han}/u.test(e.hanzi[i]))expect(e.segments.some(s=>s.start<=i&&s.end>i),e.hanzi).toBe(true);
    for(const s of e.segments){expect(e.words[s.word].hanzi).toBe(e.hanzi.slice(s.start,s.end));expect(e.words[s.word].pinyin).toBeTruthy();}
   }
  }
 });
 it('mixes tasks without repeating sentences, groups or recent rounds when possible',()=>{
  const one=sentenceRound(entries,'tw.food',15,[],()=>.37);expect(one.tasks).toHaveLength(15);
  expect(one.tasks.filter(t=>t.mode==='gap')).toHaveLength(4);expect(one.tasks.filter(t=>t.mode==='choice')).toHaveLength(4);
  const two=sentenceRound(entries,'tw.food',15,[one],()=>.53),three=sentenceRound(entries,'tw.food',15,[one,two],()=>.61);
  expect(new Set([...one.tasks,...two.tasks,...three.tasks].map(t=>t.entry.id)).size).toBe(45);
  for(const run of [one,two,three])for(const group of new Set(run.tasks.map(t=>t.entry.group)))expect(run.tasks.filter(t=>t.entry.group===group).length).toBeLessThanOrEqual(2);
  expect(sentenceRound(entries.slice(0,3),'tw.greetings',15,[]).tasks.length).toBeLessThan(15);
 });
 it('keeps translations undecided, persists hints and prevents duplicate submission',()=>{
  let run=sentenceRound(entries,'tw.numbers',10,[]);
  expect(assessSentence(run.tasks.find(t=>t.mode==='to_vi')!,'Một cách dịch khác')).toBe('compare');
  run={...run,draft:run.tasks[0].entry.gap,assisted:true};
  const result=answerSentence(run);expect(result.event.assisted).toBe(true);expect(result.event.result).toBe('correct');
  expect(()=>answerSentence(result.run)).toThrow();
  run=nextSentence(JSON.parse(JSON.stringify(result.run)));expect(run.index).toBe(1);expect(run.assisted).toBe(false);
  const keys=sentenceAudioKeys({...emptySentenceState(),run,prepared:[sentenceRound(entries,'tw.food',10,[])]});
  expect(keys).toContain(run.tasks[0].entry.audio_key);expect(new Set(keys).size).toBe(keys.length);
 });
 it('stores one copy of a sentence across history and unfinished runs',()=>{
  const run=sentenceRound(entries,'tw.food',10,[]),state={...emptySentenceState(),entries,run,history:[run],prepared:[run]};
  const packed=packSentences(state);expect(Object.keys(packed.dictionary)).toHaveLength(entries.length);
  expect(unpackSentences(JSON.parse(JSON.stringify(packed)))).toEqual(state);
 });
});
