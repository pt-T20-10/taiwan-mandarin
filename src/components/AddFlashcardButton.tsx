import {useRef,useState} from 'react';
import {useApp} from '../context';
import type {TextItem} from '../core/types';
import {newSchedule,normalizeHanzi,normalizePinyin} from '../core/learning';
export function AddFlashcardButton({word}:{word:TextItem}){
 const {state,content,put,notify}=useApp(),[busy,setBusy]=useState(false),lock=useRef(false);
 const same=(w:TextItem)=>normalizeHanzi(w.hanzi)===normalizeHanzi(word.hanzi)&&normalizePinyin(w.pinyin)===normalizePinyin(word.pinyin);
 const existing=Object.values(state.objects.cards).find(r=>!r.deleted&&r.data.direction==='recognize'&&same(r.data.word));
 async function add(){
  if(lock.current||existing)return;lock.current=true;setBusy(true);
  try{
   const known=content.units.flatMap(u=>u.words).find(same),unit=content.units.find(u=>known?u.words.some(w=>w.id===known.id):location.hash.includes(u.id));
   const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(normalizeHanzi(word.hanzi)+'\0'+normalizePinyin(word.pinyin))))).map(b=>b.toString(16).padStart(2,'0')).join('');
   const wordId=known?.id||'lookup:'+hash,id=wordId+':recognize',old=state.objects.cards[id];
   await put({collection:'cards',id,expected_version:old?.version||0,data:{word:{hanzi:word.hanzi,pinyin:word.pinyin,vi:word.vi},word_id:wordId,direction:'recognize',schedule:old?.data.schedule||newSchedule(),deck:unit?.title||'Từ bổ sung',tags:known?[]:['Từ bổ sung'],suspended:false,source:known?.verification||'draft'}});
   notify('Đã thêm vào flashcard. Đồng bộ trên điện thoại để tải từ và audio.');
  }catch(e){notify((e as Error).message);}finally{lock.current=false;setBusy(false);}
 }
 return <button type="button" disabled={busy||!!existing} onClick={()=>void add()}>{existing?(existing.data.suspended?'Đã có flashcard · tạm ngưng':'Đã thêm vào flashcard'):busy?'Đang thêm…':'+ Thêm vào flashcard'}</button>;
}
