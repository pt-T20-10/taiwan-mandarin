import {StudyText} from './StudyText';
import {useState} from 'react';
import type {TextItem} from '../core/types';
import {Speak} from './common';
import {useApp} from '../context';

// Opt-in controls: existing lesson answer-hiding behavior is unchanged elsewhere.
export function PracticeText({items,onReveal,audio=true,disabled=false,lookup=false,showInitially=false,allowedLayers=['pinyin','vi']}:{items:TextItem[];lookup?:boolean;showInitially?:boolean;allowedLayers?:('pinyin'|'vi')[];onReveal?:()=>Promise<boolean>;audio?:boolean;disabled?:boolean}){
 const {notify}=useApp();const [visible,setVisible]=useState<Record<string,boolean>>(()=>showInitially?Object.fromEntries(items.flatMap((_,i)=>allowedLayers.map(l=>[`${i}:${l}`,true]))):{}),[busy,setBusy]=useState(false);
 async function toggle(layer:'pinyin'|'vi',index?:number){
  if(disabled||busy)return;
  const keys=index===undefined?items.map((_,i)=>`${i}:${layer}`):[`${index}:${layer}`],show=keys.some(k=>!visible[k]);
  setBusy(true);try{if(show&&onReveal&&!await onReveal())return;setVisible(v=>({...v,...Object.fromEntries(keys.map(k=>[k,show]))}));}catch(e){notify((e as Error).message);}finally{setBusy(false);}
 }
 return <div className="practice-text">{items.length>1&&<div className="actions">{allowedLayers.map(layer=><button key={layer} disabled={busy||disabled} onClick={()=>void toggle(layer)}>{items.every((_,i)=>visible[`${i}:${layer}`])?'Ẩn':'Hiện'} {layer==='pinyin'?'Pinyin':'tiếng Việt'} cả đoạn</button>)}</div>}{items.map((item,i)=><div className="dialogue-line" key={i}><div className="layers">{item.speaker&&<strong>{item.speaker}: </strong>}<div className="hanzi text-with-audio" lang="zh-TW">{lookup?<StudyText text={item.hanzi} onReveal={onReveal} disabled={disabled}/>:item.hanzi}{audio&&<Speak text={item.hanzi} label={`Nghe câu ${i+1}`} onError={notify}/>}</div>{allowedLayers.map(layer=><div key={layer}><button className="reveal" aria-pressed={!!visible[`${i}:${layer}`]} disabled={busy||disabled} onClick={()=>void toggle(layer,i)}>{visible[`${i}:${layer}`]?'Ẩn':'Hiện'} {layer==='pinyin'?'Pinyin':'tiếng Việt'}</button>{visible[`${i}:${layer}`]&&<p className={layer}>{item[layer]}</p>}</div>)}</div></div>)}</div>;
}
