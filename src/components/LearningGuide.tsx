import type {TextItem} from '../core/types';
import {StudyCard,StudyText} from './StudyText';
import {PracticeText} from './PracticeText';

export function LearningGuide({purpose,words,notes,examples}:{purpose:string;words:TextItem[];notes:string[];examples:TextItem[]}){
 return <><section className="panel"><h2>Dùng khi nào</h2><p><StudyText text={purpose}/></p></section><section className="panel"><h2>Từ cần biết</h2><div className="study-card-grid">{words.map(w=><StudyCard key={w.hanzi} word={w}/>)}</div></section><section className="panel"><h2>Cách dùng</h2>{notes.map(n=><p key={n}><StudyText text={n}/></p>)}</section><section className="panel"><h2>Ví dụ</h2><PracticeText lookup showInitially items={examples}/></section><h2>Luyện thực tế</h2></>;
}
