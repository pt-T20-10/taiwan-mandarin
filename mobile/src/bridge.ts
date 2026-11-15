import {registerPlugin} from '@capacitor/core';
import {reviewGroups,reviewRound} from '../../src/core/reviewSets';
import type {SentenceState} from '../../src/core/sentenceReview';
import {packSentences,unpackSentences} from '../../src/core/sentenceReview';
export {reviewGroups};
export type Pair={protocol:number;pc_id:string;address:string;fingerprint:string;secret?:string;token?:string;device_id?:string};
export type Card={id:string;hanzi:string;pinyin:string;meanings:string[];card_ids:string[];decks:string[];audio_key:string};
export type Seen={id:string;word_id:string;card_ids:string[];timestamp:string;duration_ms:number};
export type State={sentences?:SentenceState;sentenceUnits?:{id:string;title:string}[];review?:{group:string;size:number;total:number;finished:boolean;used:Record<string,string[]>};pc_id?:string;cards:Card[];queue:string[];done:number;cycle:number;pending:Seen[];revision?:string;lastDataSync?:string;lastSync?:string};
export const emptyState=():State=>({cards:[],queue:[],done:0,cycle:1,pending:[]});
const bridge=registerPlugin<{
 load():Promise<{state:State|null}>;save(data:{state:State}):Promise<void>;
 getPair():Promise<{pair:Pair|null}>;setPair(data:{pair:Pair}):Promise<void>;
 request(data:{path:string;method?:string;body?:object;pair?:Pair}):Promise<{data:any}>;
 audioStatus(data:{keys:string[]}):Promise<{keys:string[];bytes?:Record<string,number>}>;
 downloadAudio(data:{key:string;budgetBytes?:number;exemptKeys?:string[]}):Promise<void>;pruneAudio(data:{keys:string[]}):Promise<void>;
 play(data:{key:string}):Promise<void>;stopAudio():Promise<void>;
 wifi():Promise<{wifi:boolean}>;discover(data:{pcId:string}):Promise<{address?:string}>;
}>('ReviewBridge');
export const native={
 async load(){const result=await bridge.load();const s=result.state as (State&{sentence_store?:ReturnType<typeof packSentences>})|null;
  if(s?.sentence_store){const {sentence_store,...rest}=s;return {state:{...rest,sentences:unpackSentences(sentence_store)}};}return result;},
 async save({state}:{state:State}){if(!state.sentences)return bridge.save({state});const {sentences,...rest}=state;
  return bridge.save({state:{...rest,sentence_store:packSentences(sentences)} as State});},
 // Capacitor exposes methods through a proxy; spreading it does not enumerate
 // native methods. Keep explicit forwarding for all existing bridge operations.
 getPair:bridge.getPair,setPair:bridge.setPair,request:bridge.request,audioStatus:bridge.audioStatus,
 downloadAudio:bridge.downloadAudio,pruneAudio:bridge.pruneAudio,play:bridge.play,stopAudio:bridge.stopAudio,wifi:bridge.wifi,discover:bridge.discover,
};
export function shuffle<T>(rows:T[]){const result=[...rows];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function newQueue(cards:Card[],last?:string){const ids=shuffle(cards.map(c=>c.id));if(ids.length>1&&ids[0]===last)[ids[0],ids[1]]=[ids[1],ids[0]];return ids;}
export function withCards(s:State,cards:Card[],revision:string):State{
 const remaining=s.queue.filter(id=>cards.some(c=>c.id===id));
 if(s.review&&!s.review.total&&!s.cards.length&&cards.length)return startReview({...s,cards,revision},s.review.group,s.review.size);
 if(s.review)return {...s,cards,revision,queue:remaining,review:{...s.review,finished:s.review.finished||(!remaining.length&&s.queue.length>0)}};
 return {...s,cards,revision,queue:remaining.length?remaining:newQueue(cards),done:remaining.length?s.done:0};
}
export function startReview(s:State,group='all',size=20):State{
 const groups=reviewGroups(s.cards),scope=groups.find(g=>g.id===group)||groups[0];
 const selected=reviewRound(scope.ids,size,s.review?.used[scope.id]||[]);
 return {...s,queue:selected.ids,done:0,cycle:s.review?s.cycle+1:s.cycle,review:{group:scope.id,size,total:selected.ids.length,finished:false,used:{...s.review?.used,[scope.id]:selected.used}}};
}
export function upgradeReview(s:State):State{
 if(s.review)return s;
 const limit=Math.min(20,s.cards.length),valid=new Set(s.cards.map(c=>c.id));
 const queue=[...new Set(s.queue.filter(id=>valid.has(id)))].slice(0,limit);
 queue.push(...shuffle(s.cards.map(c=>c.id).filter(id=>!queue.includes(id))).slice(0,limit-queue.length));
 return {...s,queue,done:0,review:{group:'all',size:20,total:queue.length,finished:false,used:{all:queue}}};
}
