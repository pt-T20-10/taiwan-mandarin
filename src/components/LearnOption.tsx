import {useEffect,useState} from 'react';
import {speech} from '../adapters/local';
import {useApp} from '../context';
import {questionReading} from '../core/questionReading';
import type {TextItem} from '../core/types';

// Only answer options use this interaction; prompt/example reading stays explicit.
export function LearnOption({text,selected,disabled,candidates=[],onChoose,onReveal}:{text:string;selected:boolean;disabled?:boolean;candidates?:TextItem[];onChoose:()=>void;onReveal?:()=>void}){
 const {notify}=useApp(),[open,setOpen]=useState(false),[entered,setEntered]=useState(false),reading=questionReading(text,candidates);
 useEffect(()=>{if(entered&&!disabled&&reading){setOpen(true);onReveal?.();}},[entered,disabled,text]);
 return <div className="learn-option" onMouseEnter={()=>setEntered(true)} onMouseLeave={()=>{setEntered(false);setOpen(false);}}>
  <button type="button" disabled={disabled} className={selected?'selected':''} aria-pressed={selected} onFocus={()=>setEntered(true)} onBlur={()=>{setEntered(false);setOpen(false);}} onClick={()=>{onChoose();if(reading){setOpen(true);void speech.speak(reading.audio).catch(e=>notify(e.message));}}}>{text}</button>
  {reading&&open&&<span className="option-pinyin" role="tooltip">{reading.pinyin}</span>}
 </div>;
}
