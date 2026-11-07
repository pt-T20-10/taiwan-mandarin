import {it,expect} from 'vitest';
import {emptyState,withCards,newQueue,upgradeReview,startReview} from './bridge';
import type {Card} from './bridge';
it('keeps durable pending reviews and current queue while accepting PC deletions and additions',()=>{
 const a={id:'a'} as Card,b={id:'b'} as Card,c={id:'c'} as Card;
 const state={...emptyState(),cards:[a,b],queue:['a','b'],pending:[{id:'seen',word_id:'a',card_ids:['original'],timestamp:'2026-10-29T00:00:00Z',duration_ms:1}]};
 const next=withCards(state,[a,c],'2');expect(next.queue).toEqual(['a']);expect(next.pending).toEqual(state.pending);
 expect(new Set(newQueue([a,b,c]))).toEqual(new Set(['a','b','c']));expect(newQueue([a,b],'a')[0]).not.toBe('a');
 expect(withCards(next,[],'3').queue).toEqual([]);expect(withCards(next,[],'3').pending).toEqual(state.pending);
});
it('starts the first synced packet, preserves it on sync and stops after a batch',()=>{
 const cards=Array.from({length:65},(_,i)=>({id:String(i),hanzi:String(i),pinyin:'',decks:['TEST']} as Card));
 const first=withCards(upgradeReview(emptyState()),cards,'1');
 expect(first.queue).toHaveLength(20);
 expect(withCards(first,cards,'2').queue).toEqual(first.queue);
 const finished={...first,queue:[],done:20,review:{...first.review!,finished:true}};
 expect(withCards(finished,cards,'3').queue).toEqual([]);
 const next=startReview(finished);
 expect(next.queue).toHaveLength(20);expect(next.queue.some(id=>first.queue.includes(id))).toBe(false);
});
