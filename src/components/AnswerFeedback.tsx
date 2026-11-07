import {useApp} from '../context';
import type {TextItem} from '../core/types';
import {questionReading} from '../core/questionReading';
import {studyWords} from './StudyText';
import {Speak} from './common';

const compact=(s:string)=>s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const hasHan=(s:string)=>/[\u3400-\u9fff]/.test(s);
/** Post-submit only: one answer, always-visible reading/meaning, one listen action. */
export function AnswerFeedback({answers,explanation='',candidates=[],wordId,userAnswer}:{answers:string[];explanation?:string;candidates?:TextItem[];wordId?:string|null;userAnswer?:string}){
 const {content,notify}=useApp();
 const words=content.units.flatMap(u=>u.words),pool=[...candidates,...words,...studyWords];
 const rows=answers.map(answer=>{
  const match=pool.find(t=>compact(t.hanzi)===compact(answer))||(!hasHan(answer)?words.find(w=>w.id===wordId)||pool.find(t=>compact(t.pinyin)===compact(answer)||compact(t.vi)===compact(answer)):undefined);
  const hanzi=match?.hanzi||answer,reading=hasHan(hanzi)?questionReading(hanzi,match?[match]:candidates):null;
  return {answer,hanzi,pinyin:match?.pinyin||reading?.pinyin,vi:match?.vi};
 }).filter((r,i,all)=>all.findIndex(t=>compact(t.hanzi)===compact(r.hanzi))===i);
 const redundant=rows.some(r=>[r.answer,r.vi||'',`${r.hanzi} ${r.vi||''}`,`${r.hanzi} ${r.pinyin||''} ${r.vi||''}`].some(t=>t&&compact(t)===compact(explanation)));
 // Authored explanations already combine the sentence/word, reading and
 // translation. Prefer that single line instead of rebuilding a second card.
 const useExplanation=hasHan(explanation)&&rows.some(r=>hasHan(r.hanzi)&&compact(explanation).includes(compact(r.hanzi))&&(!r.pinyin||compact(explanation).includes(compact(r.pinyin))));
 const context=useExplanation?candidates.find(t=>compact(explanation).includes(compact(t.hanzi))&&rows.some(r=>compact(t.hanzi).includes(compact(r.hanzi)))):undefined;
 const audio=context?.hanzi||rows.filter(r=>hasHan(r.hanzi)).map(r=>r.hanzi).join('，');
 const lines=useExplanation?[explanation]:rows.map(r=>`${r.hanzi}${r.pinyin?' ('+r.pinyin+')':''}${r.vi?': '+r.vi:''}`);
 return <div className="answer-feedback">{userAnswer&&<p>Bạn trả lời: {userAnswer}</p>}{lines.map((line,i)=><p key={i}>{line}{i===0&&audio&&<> <Speak text={audio} onError={notify}/></>}</p>)}{!useExplanation&&explanation&&!redundant&&<p>{explanation}</p>}</div>;
}
