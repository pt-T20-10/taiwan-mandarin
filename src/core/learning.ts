import {createEmptyCard, fsrs, type CardInput, type Grade} from 'ts-fsrs';
import type {Exercise, LearningEvent} from './types';

const toneMarks:Record<string,string[]>={a:['a','ā','á','ǎ','à'],e:['e','ē','é','ě','è'],i:['i','ī','í','ǐ','ì'],o:['o','ō','ó','ǒ','ò'],u:['u','ū','ú','ǔ','ù'],ü:['ü','ǖ','ǘ','ǚ','ǜ']};
export function normalizeHanzi(input:string){return input.normalize('NFC').replace(/[\s，。！？、,.!?；;：:“”「」『』"'（）()]/gu,'');}
export function normalizePinyin(input:string){
  const s=input.normalize('NFC').toLowerCase().replace(/u:/g,'ü').replace(/v/g,'ü');
  const accented=s.replace(/([a-zü]+)([0-5])/g,(_,syllable:string,tone:string)=>{
    const t=Number(tone)%5;if(!t)return syllable;
    let at=syllable.indexOf('a');if(at<0)at=syllable.indexOf('e');if(at<0&&syllable.includes('ou'))at=syllable.indexOf('o');
    if(at<0){for(let i=syllable.length-1;i>=0;i--)if(toneMarks[syllable[i]]){at=i;break;}}
    return at<0?syllable+tone:syllable.slice(0,at)+toneMarks[syllable[at]][t]+syllable.slice(at+1);
  });
  return accented.replace(/[\s'’.,!?，。！？·-]/g,'');
}
export function grade(ex:Exercise, answer:string):boolean|null{
  if(ex.kind==='writing'||ex.kind==='speaking')return null;
  const norm=ex.kind==='pinyin'?normalizePinyin:normalizeHanzi;
  return ex.answers.some(a=>norm(a)===norm(answer));
}
export function canSubmitKey(e:{key:string;isComposing?:boolean;keyCode?:number}, composing=false){return e.key==='Enter'&&!e.isComposing&&!composing&&e.keyCode!==229;}
export function ignoreShortcut(target:EventTarget|null, composing:boolean){
  return composing || (target instanceof HTMLElement && (target.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(target.tagName)));
}
export const scheduler=fsrs({request_retention:.9,enable_fuzz:false,maximum_interval:36500});
export function newSchedule(now=new Date()){return createEmptyCard(now);}
export function review(schedule:CardInput, rating:Grade, mode:'due'|'free', now=new Date()){
  if(mode==='free')return {card:schedule,log:null};
  if(new Date(schedule.due).getTime()>now.getTime())throw new Error('Thẻ chưa đến hạn; hãy chuyển sang luyện tự do.');
  return scheduler.next(schedule, now, rating);
}
export function eventFor(item_id:string, skill:string, extra:Partial<LearningEvent>={}):LearningEvent{
  const id=crypto.randomUUID();
  return {id,action_key:id,kind:'answer',skill,item_id,correct:null,assisted:false,answer:'',duration_ms:0,algorithm:'closed-v1',timestamp:new Date().toISOString(),category:'',...extra};
}
export function errorCategory(ex:Exercise){return ex.kind==='pinyin'?'âm/thanh':ex.skill==='grammar'?'ngữ pháp':ex.kind==='meaning'?'nghĩa':'chữ / cần xem lại';}
