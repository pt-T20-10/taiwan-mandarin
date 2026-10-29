import {useRef,useState} from 'react';
import {useApp} from '../context';
import {speech} from '../adapters/local';
import {questionReading} from '../core/questionReading';
import type {TextItem} from '../core/types';

type Props={text:string;candidates?:TextItem[];disabled?:boolean;onReveal?:()=>Promise<boolean>;resetKey?:string};
// Companion controls remain outside answer buttons, so listening never selects
// an option. Only the visible text is supplied to the reading lookup and TTS.
export function QuestionReading(props:Props){return <ReadingControls key={(props.resetKey||'')+props.text} {...props}/>;}
function ReadingControls({text,candidates,disabled,onReveal}:Props){
 const {notify}=useApp(),[visible,setVisible]=useState(false),[busy,setBusy]=useState(false),pending=useRef(false);
 const reading=questionReading(text,candidates);
 if(!reading)return null;
 async function open(play=false){
  if(disabled||pending.current)return;pending.current=true;setBusy(true);
  try{if(onReveal&&!await onReveal())return;if(play)await speech.speak(reading!.audio);else setVisible(true);}
  catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}
 }
 return <div className="question-reading" data-reading-text={text}><div className="reading-controls" title={onReveal?'Mở Pinyin hoặc nghe đọc được ghi nhận là trợ giúp.':undefined}><button type="button" className="reveal" disabled={disabled||busy} aria-pressed={visible} onClick={()=>visible?setVisible(false):void open()}>{visible?'Ẩn Pinyin':'Hiện Pinyin'}</button><button type="button" className="icon-button" disabled={disabled||busy} aria-label="Nghe Hán tự" onClick={()=>void open(true)}>◖)) Nghe</button></div>{visible&&<p className="pinyin" lang="zh-Latn">{reading.pinyin}</p>}</div>;
}
