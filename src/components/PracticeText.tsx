import {useState} from 'react';
import type {TextItem} from '../core/types';
import {Speak} from './common';
import {useApp} from '../context';

// Opt-in controls: existing lesson answer-hiding behavior is unchanged elsewhere.
export function PracticeText({items,onReveal,audio=true,disabled=false}:{items:TextItem[];onReveal?:()=>Promise<boolean>;audio?:boolean;disabled?:boolean}){
 const {notify}=useApp();const [visible,setVisible]=useState<Record<string,boolean>>({}),[busy,setBusy]=useState(false);
 async function toggle(layer:'pinyin'|'vi',index?:number){
  if(disabled||busy)return;
  const keys=index===undefined?items.map((_,i)=>`${i}:${layer}`):[`${index}:${layer}`],show=keys.some(k=>!visible[k]);
  setBusy(true);try{if(show&&onReveal&&!await onReveal())return;setVisible(v=>({...v,...Object.fromEntries(keys.map(k=>[k,show]))}));}catch(e){notify((e as Error).message);}finally{setBusy(false);}
 }
 return <div className="practice-text">{items.length>1&&<div className="actions">{(['pinyin','vi'] as const).map(layer=><button key={layer} disabled={busy||disabled} onClick={()=>void toggle(layer)}>{items.every((_,i)=>visible[`${i}:${layer}`])?'Ẩn':'Hiện'} {layer==='pinyin'?'Pinyin':'tiếng Việt'} cả đoạn</button>)}</div>}{items.map((item,i)=><div className="dialogue-line" key={i}><div className="layers"><div className="hanzi text-with-audio" lang="zh-TW">{item.hanzi}{audio&&<Speak text={item.hanzi} label={`Nghe câu ${i+1}`} onError={notify}/>}</div>{(['pinyin','vi'] as const).map(layer=><div key={layer}><button className="reveal" aria-pressed={!!visible[`${i}:${layer}`]} disabled={busy||disabled} onClick={()=>void toggle(layer,i)}>{visible[`${i}:${layer}`]?'Ẩn':'Hiện'} {layer==='pinyin'?'Pinyin':'tiếng Việt'}</button>{visible[`${i}:${layer}`]&&<p className={layer}>{item[layer]}</p>}</div>)}</div></div>)}</div>;
}
