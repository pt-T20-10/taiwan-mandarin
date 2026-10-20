import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import lookup from '../core/study-lookup.json';
import type {TextItem} from '../core/types';
import {useApp} from '../context';
import {CharacterStudy} from './CharacterStudy';
import {speech} from '../adapters/local';
import {LearnedWordButton} from './LearnedWordButton';
type Span={start:number;end:number;word:TextItem};
const sentences:Record<string,Span[]>=lookup.sentences;
export const studyWords:TextItem[]=lookup.words;

export function StudyCard({word}:{word:TextItem}){
 const {notify}=useApp();
 return <article className="study-card"><div><h3 lang="zh-TW">{word.hanzi}</h3><p className="pinyin">{word.pinyin}</p><p>{word.vi}</p><div className="actions"><button onClick={()=>void speech.speak(word.hanzi).catch(e=>notify(e.message))}>Nghe từ</button><LearnedWordButton word={word}/></div></div><CharacterStudy key={word.hanzi} text={word.hanzi}/></article>;
}
function WordDialog({word,onClose,supplemental}:{word:TextItem;onClose:()=>void;supplemental:boolean}){
 const dialog=useRef<HTMLDialogElement>(null),{content}=useApp();
 const route=decodeURIComponent(location.hash),unit=content.units.find(u=>route.includes(u.id)),lesson=unit?.lessons.find(l=>route.includes(l.id));
 const focus=unit?unit.words.filter(w=>!lesson||lesson.word_ids.includes(w.id)):content.units.flatMap(u=>u.words);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();return()=>{speech.stop();previous?.focus();};},[]);
 return createPortal(<dialog ref={dialog} className="word-dialog" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><button className="dialog-close" onClick={onClose}>Đóng thẻ từ ×</button>{supplemental&&!focus.some(w=>w.hanzi===word.hanzi)&&<p className="tag">Từ bổ sung</p>}<StudyCard word={word}/></dialog>,document.body);
}
export function StudyText({text,onReveal,disabled=false}:{text:string;onReveal?:()=>Promise<boolean>;disabled?:boolean}){
 const [selected,setSelected]=useState<TextItem|null>(null),[busy,setBusy]=useState(false),generation=useRef(0);
 useEffect(()=>{generation.current++;setSelected(null);return()=>{generation.current++;};},[text]);
 const spans=sentences[text]||[];let offset=0;const parts:React.ReactNode[]=[];
 async function open(word:TextItem){if(busy||disabled)return;const current=generation.current;setBusy(true);try{if(onReveal&&!await onReveal())return;if(current===generation.current)setSelected(word);}finally{setBusy(false);}}
 for(const span of spans){if(span.start>offset)parts.push(text.slice(offset,span.start));parts.push(<button type="button" className="word-token" key={span.start} disabled={disabled||busy} onClick={()=>void open(span.word)} aria-label={'Tra từ '+span.word.hanzi}>{text.slice(span.start,span.end)}</button>);offset=span.end;}
 parts.push(text.slice(offset));
 return <><span className="study-text">{parts}</span>{selected&&<WordDialog word={selected} onClose={()=>setSelected(null)} supplemental/>}</>;
}

export function FocusWords({texts,limit=8}:{texts:string[];limit?:number}){
 const seen=new Set<string>();const words=texts.flatMap(text=>(sentences[text]||[]).map(s=>s.word)).filter(w=>{if(seen.has(w.hanzi))return false;seen.add(w.hanzi);return true;}).slice(0,limit);
 return <div className="study-card-grid">{words.map(w=><StudyCard key={w.hanzi} word={w}/>)}</div>;
}
