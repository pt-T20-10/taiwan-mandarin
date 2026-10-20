import {expect,it} from 'vitest';
import {addedCardDirections} from './notebookCards';
import type {Flashcard,Stored} from './types';
it('recognizes imported/suspended cards by word and direction, skips deleted cards and distinguishes readings',()=>{
 const word={id:'word.greeting',hanzi:'你好',pinyin:'nǐ hǎo'};
 const row=(direction:string,deleted=false,suspended=false)=>({version:1,deleted,data:{word:{hanzi:'你好',pinyin:'ni3 hao3',vi:'xin chào'},word_id:'custom',direction,suspended}} as Stored<Flashcard>);
 expect([...addedCardDirections(word,{imported:row('recognize',false,true),produce:row('produce'),deleted:row('audio',true)})]).toEqual(['recognize','produce']);
 expect(addedCardDirections({id:'hang',hanzi:'行',pinyin:'háng'},{other:{...row('recognize'),data:{...row('recognize').data,word:{hanzi:'行',pinyin:'xíng',vi:'đi'}}}}).size).toBe(0);
});
