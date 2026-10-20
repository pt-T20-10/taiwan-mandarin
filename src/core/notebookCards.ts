import type {Flashcard,Stored,Word} from './types';
import {normalizeHanzi,normalizePinyin} from './learning';

export function addedCardDirections(word:Pick<Word,'id'|'hanzi'|'pinyin'>,cards:Record<string,Stored<Flashcard>>){
 const directions=new Set<Flashcard['direction']>();
 for(const row of Object.values(cards)){
  if(row.deleted)continue;
  const card=row.data;
  if(card.word_id===word.id||(normalizeHanzi(card.word.hanzi)===normalizeHanzi(word.hanzi)&&normalizePinyin(card.word.pinyin)===normalizePinyin(word.pinyin)))directions.add(card.direction);
 }
 return directions;
}
