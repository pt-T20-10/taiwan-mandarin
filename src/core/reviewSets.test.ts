import {it,expect} from 'vitest';
import {reviewGroups,reviewRound} from './reviewSets';
it('balances topic groups above 20 words and covers unseen words before cycling',()=>{
 for(const count of [0,7,20,39,40,59,98,101]){
  const words=Array.from({length:count},(_,i)=>({id:String(i),hanzi:String(i),pinyin:'',decks:['Topic '+Math.floor(i/9)]}));
  const groups=reviewGroups(words);
  expect(groups[0].ids).toHaveLength(count);
  for(const g of groups.slice(1))expect(g.ids.length).toBeGreaterThanOrEqual(20);
  if(groups.length>1)expect(new Set(groups.slice(1).flatMap(g=>g.ids)).size).toBe(count);
 }
 const pool=Array.from({length:45},(_,i)=>String(i));
 const a=reviewRound(pool,20),b=reviewRound(pool,20,a.used),c=reviewRound(pool,20,b.used);
 expect(a.ids.filter(id=>b.ids.includes(id))).toHaveLength(0);
 expect(new Set([...a.ids,...b.ids,...c.ids]).size).toBe(45);
 expect(new Set(c.ids).size).toBe(20);
 expect(reviewRound(pool,0).ids).toHaveLength(45);
});
