import {LearningGuide} from './LearningGuide';
import {classifierGuide} from '../core/classifierGuide';
import {StudyCard,StudyText} from './StudyText';
import {useState} from 'react';
import {useApp} from '../context';
import {classifierExamples,classifierUnit,examplesFor} from '../core/classifiers';
import {newSchedule} from '../core/learning';
import type {PracticeSkill} from '../core/types';
import {PracticeText} from './PracticeText';
import {SkillPractice} from './Skills';

export function Classifiers({route}:{route:string}){
 const {content,state,put,notify}=useApp();const parts=route.split('/');
 const topic=content.units.some(u=>u.id===parts[2])?parts[2]:'all';
 const skill=['reading','listening','speaking','writing'].includes(parts[3])?parts[3] as PracticeSkill:null;
 const [search,setSearch]=useState(''),[busy,setBusy]=useState(false);
 const title=content.units.find(u=>u.id===topic)?.title||'Nhập môn và tổng hợp';
 const done=state.objects.reports['classifiers:intro']?.data.completed;
 function navigate(t:string,s=skill||'guide'){location.hash=`learn/classifiers/${t}/${s}`;}
 async function addCard(id:string){const e=classifierExamples.find(e=>e.id===id)!;setBusy(true);try{await put({collection:'cards',id:'classifiers:'+id,expected_version:0,data:{word:e.phrase,word_id:'classifiers:'+id,direction:'recognize',schedule:newSchedule(),deck:'Lượng từ theo cụm',tags:['Lượng từ'],suspended:false,source:'authored-draft'}});notify('Đã thêm cả cụm vào thẻ ôn tập.');}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 return <><a href="#learn">← Mục Học</a><h1>Lượng từ trong đời sống</h1><p>Học theo cụm, chọn lượng từ theo vật và ý muốn nói. Bài bổ sung có tiến độ riêng.</p>
 <LearningGuide purpose={classifierGuide.purpose} words={classifierExamples.filter(e=>['cup','book','ticket'].includes(e.id)).map(e=>e.phrase)} notes={classifierGuide.notes} examples={classifierExamples.filter(e=>['cup','book','ticket'].includes(e.id))}/>
 <label>Chủ đề lượng từ<select value={topic} onChange={e=>navigate(e.target.value)}><option value="all">Nhập môn và tổng hợp</option>{content.units.map(u=><option key={u.id} value={u.id}>{u.title}</option>)}</select></label>
 <div className="tabs"><button className={!skill?'active':''} onClick={()=>navigate(topic,'guide')}>Tra cứu</button>{(['listening','speaking','reading','writing'] as const).map((s,i)=><button key={s} className={skill===s?'active':''} onClick={()=>navigate(topic,s)}>{['Nghe','Nói','Đọc','Viết'][i]}</button>)}</div>
 {skill?<SkillPractice key={topic+skill} unit={classifierUnit(topic,title)} skill={skill} allowAI={false}/>:<><label>Tìm lượng từ, ví dụ hoặc nghĩa<input value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="unit-grid">{examplesFor(topic).filter(e=>(e.measure+e.reading+e.use+e.phrase.hanzi+e.phrase.vi).toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(e=><article className="panel" key={e.id}><h2 lang="zh-TW">{e.measure} <small>{e.reading}</small></h2><p><StudyText text={e.use}/></p><StudyCard word={e.phrase}/><PracticeText lookup showInitially key={topic+e.id} items={[e]}/>{e.accepted.length>1&&<p>Trong ví dụ này cũng có thể dùng {e.accepted.filter(a=>a!==e.measure).join(' / ')}; sắc thái có thể khác.</p>}<button disabled={busy||!!state.objects.cards['classifiers:'+e.id]} onClick={()=>void addCard(e.id)}>{state.objects.cards['classifiers:'+e.id]?'Đã có thẻ cụm này':'Thêm cụm vào thẻ ôn'}</button></article>)}</div></>}
 <details><summary>Nguồn và phạm vi</summary><p>Ví dụ và bài tập do dự án biên soạn, chưa giáo viên duyệt. Ngân hàng bổ sung gồm 22 cụm, mở theo 18 chủ đề; chưa bao phủ mọi lượng từ hoặc mọi cách kết hợp.</p><p><a href="https://www.huayuworld.org" target="_blank" rel="noreferrer">僑委會 · 全球華文網</a> — tài liệu dạy lượng từ theo đồ vật và ngữ cảnh. <a href="https://dict.concised.moe.edu.tw/" target="_blank" rel="noreferrer">Từ điển MOE Đài Loan</a> để đối chiếu thêm cách dùng.</p></details>
 </>;
}
