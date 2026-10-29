import readings from './question-readings.json';
import type {TextItem} from './types';
const bank:Record<string,string>=readings;
const han=/[\u3400-\u9fff]+/g;
const strip=(text:string)=>text.replace(/[^\u3400-\u9fff]/g,'');
export function questionReading(text:string,candidates:TextItem[]=[]){
 const segments=text.match(/(?:_{2,})?[\u3400-\u9fff]+(?:[，。！？、；：,.!?…\s_]*[\u3400-\u9fff]+)*[，。！？、；：,.!?…_]*/g)||[];
 if(!segments.length)return null;
 let missing=false;
 const pinyin=segments.map(segment=>{
  const authored=candidates.find(t=>strip(t.hanzi)===strip(segment)&&t.pinyin);
  if(authored&&!segment.includes('___'))return authored.pinyin;
  return segment.replace(han,fragment=>{const p=bank[fragment];if(!p)missing=true;return p||'[… chưa có Pinyin …]';});
 }).join(' / ');
 return {pinyin,missing,audio:segments.join('，').replace(/_{2,}/g,'，')};
}
