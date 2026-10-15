import {it,expect} from 'vitest';
import {writingPaths,strokeFeedback} from './writing';
import asset from '../../public/learning/characters/22909.json';
import lookup from './study-lookup.json';
import pack from '../../content/foundation.pack.json';
it('covers dialogue/grammar words, preserves text offsets, and reads contextual 得',()=>{
 const sentences:Record<string,{start:number;end:number;word:{hanzi:string;pinyin:string;vi:string}}[]>=lookup.sentences;
 for(const text of pack.content.units.flatMap(u=>[...u.dialogue,...u.grammar.flatMap(g=>g.examples)])){
  const spans=sentences[text.hanzi]||[],covered=new Set(spans.flatMap(s=>Array.from({length:s.end-s.start},(_,i)=>s.start+i)));
  Array.from(text.hanzi).forEach((c,i)=>{if(/\p{Script=Han}/u.test(c))expect(covered.has(i),text.hanzi+' '+c).toBe(true);});
  for(const s of spans)expect(text.hanzi.slice(s.start,s.end)).toBe(s.word.hanzi);
 }
 expect(sentences['我明天得上早班。'].find(s=>s.word.hanzi==='得')?.word.pinyin).toBe('děi');
});
it('transforms source medians and rejects reversed/misplaced strokes',()=>{
 const paths=writingPaths(asset);expect(paths).toHaveLength(6);
 for(const path of paths){expect(strokeFeedback(path,path)).toBe('');expect(strokeFeedback([...path].reverse(),path)).not.toBe('');expect(strokeFeedback(path.map(([x,y])=>[x+100,y+100]),path)).not.toBe('');}
});
