import {expect,it} from 'vitest';
import {sentenceBank,sentenceSet,readingSets,matchesWritten,type WrittenRun} from './writtenPractice';
import pack from '../../content/foundation.pack.json';
import type {Unit} from './types';
it('exhausts sentence bank before repeating and accepts authored variants without deleting Hanzi',()=>{
 const units=pack.content.units as Unit[],pool=sentenceBank(units.slice(0,2));expect(pool.length).toBeGreaterThan(20);
 const history:WrittenRun[]=[];const seen=new Set<string>();
 while(seen.size<pool.length){const choice=sentenceSet(pool,8,history,()=>.3);expect(choice.packet.items.length).toBeGreaterThanOrEqual(5);
  for(const item of choice.packet.items){if(seen.size<pool.length)expect(seen.has(item.id)).toBe(false);seen.add(item.id);}
  history.push({mode:'sentences',cycle:choice.cycle,packet:choice.packet} as WrittenRun);
 }
 const item={id:'variant',prompt:'Tôi tên Tiểu An.',answers:['我叫小安。'],choices:[],explanation:''};
 expect(matchesWritten(item,'我的名字是小安')).toBe(true);expect(matchesWritten(item,'我叫小明')).toBe(false);
});
it('provides three distinct greeting passages and ten grounded questions each, with explicit dialogue roles',()=>{
 const packets=readingSets(pack.content.units[0] as Unit);expect(packets).toHaveLength(3);
 expect(packets.some(p=>p.format==='prose')).toBe(true);
 for(const p of packets){expect(p.items).toHaveLength(10);expect(p.items.filter(q=>!q.choices.length).length).toBeGreaterThanOrEqual(5);
  expect(new Set(p.items.map(q=>q.id)).size).toBe(10);
  for(const q of p.items){expect(q.answers.length).toBeGreaterThan(0);expect(q.evidence?.every(i=>i>=0&&i<p.passage.length)).toBe(true);if(q.choices.length)expect(q.choices).toContain(q.answers[0]);}
  if(p.format==='dialogue')expect(p.passage.every(t=>t.speaker&&t.role)).toBe(true);
 }
});
