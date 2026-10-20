import {normalizeHanzi} from './learning';
import type {Stored,TextItem} from './types';

export function learnedWordId(hanzi:string){return 'learned-word:'+Array.from(normalizeHanzi(hanzi)).map(c=>c.codePointAt(0)!.toString(16)).join('-');}
export function isMarkedLearned(id:string,row:Stored|undefined){
 const word=row?.data.word as TextItem|undefined;
 return !!row&&!row.deleted&&row.data.kind==='learned-word'&&row.data.learned===true&&typeof word?.hanzi==='string'&&!!normalizeHanzi(word.hanzi)&&learnedWordId(word.hanzi)===id;
}
