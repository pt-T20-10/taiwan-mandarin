import {topicLanguage,topicLanguageRoute} from '../core/topicLanguage';
import {skillEnabled} from '../core/features';
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
 const skill=['reading','listening','speaking','writing'].includes(parts[3])&&skillEnabled(parts[3])?parts[3] as PracticeSkill:null;
 const [search,setSearch]=useState(''),[busy,setBusy]=useState(false);
 const title=content.units.find(u=>u.id===topic)?.title||'Nhập môn và tổng hợp';
 const examples=examplesFor(topic),novelty=topicLanguage(content,topic);
 const done=state.objects.reports['classifiers:intro']?.data.completed;
 function navigate(t:string,s=skill||'guide'){location.hash=`learn/classifiers/${t}/${s}`;}
 async function addCard(id:string){const e=classifierExamples.find(e=>e.id===id)!;setBusy(true);try{await put({collection:'cards',id:'classifiers:'+id,expected_version:0,data:{word:e.phrase,word_id:'classifiers:'+id,direction:'recognize',schedule:newSchedule(),deck:'Lượng từ theo cụm',tags:['Lượng từ'],suspended:false,source:'authored-draft'}});notify('Đã thêm cả cụm vào thẻ ôn tập.');}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 return <><a href="#learn">← Mục Học</a><h1>{topic==='all'?'Lượng từ trong đời sống':`Lượng từ · ${title}`}</h1><p>{topic==='all'?'Tra cứu toàn bộ hoặc chọn một chủ đề để học và luyện riêng.':`Chủ đề ${title}: ${examples.length} cụm lượng từ. Các tab luyện bên dưới chỉ dùng các cụm của chủ đề này.`} Bài bổ sung có tiến độ riêng.</p>
 <label>Chủ đề lượng từ<select value={topic} onChange={e=>navigate(e.target.value)}><option value="all">Nhập môn và tổng hợp</option>{content.units.map(u=><option key={u.id} value={u.id}>{u.title}</option>)}</select></label>
 {topic!=='all'&&<p className="notice">{novelty.classifiers.length} lượng từ mới · {novelty.reviewClassifiers.length} cụm ôn lại. Đây là trang tra cứu và luyện thêm. {!!(novelty.classifiers.length+novelty.verbs.length)&&<a href={"#"+topicLanguageRoute(topic)}>Học kiến thức mới trong phần 5 →</a>}</p>}
 {topic==='all'?<section className="panel"><h2>Chọn chủ đề</h2><div className="unit-grid">{content.units.map(u=><article key={u.id}><h3><a href={`#learn/classifiers/${u.id}`}>{u.title}</a></h3><p>{examplesFor(u.id).map(e=>e.phrase.hanzi).join(' · ')}</p></article>)}</div></section>:<p><a href="#learn/classifiers">Xem lượng từ của tất cả chủ đề →</a></p>}
 <div className="tabs"><button className={!skill?'active':''} onClick={()=>navigate(topic,'guide')}>Tra cứu</button>{(['listening','speaking','reading','writing'] as const).map((s,i)=>skillEnabled(s)&&<button key={s} className={skill===s?'active':''} onClick={()=>navigate(topic,s)}>{['Nghe','Nói','Đọc','Viết'][i]}</button>)}</div>
 {!skill&&<LearningGuide key={topic} purpose={topic==='all'?classifierGuide.purpose:`Dùng các cụm ${examples.map(e=>e.phrase.hanzi).join(' / ')} khi nói về chủ đề ${title.toLocaleLowerCase()}. Một cụm có thể được ôn trong nhiều chủ đề.`} words={(topic==='all'?classifierExamples.filter(e=>['cup','book','ticket'].includes(e.id)):examples).map(e=>e.phrase)} notes={topic==='all'?classifierGuide.notes:['Mẫu dùng chung: số lượng + lượng từ + danh từ. Học cả cụm trong Từ cần biết, rồi xem cách dùng trong câu bên dưới.',...examples.map(e=>`${e.measure} (${e.reading}): ${e.use}. ${e.phrase.hanzi} — ${e.phrase.vi}.`)]} examples={topic==='all'?classifierExamples.filter(e=>['cup','book','ticket'].includes(e.id)):examples}/>}
 {skill?<SkillPractice key={topic+skill} unit={classifierUnit(topic,title)} skill={skill} allowAI={false}/>:<><div className="filter-bar"><label>Tìm lượng từ, ví dụ hoặc nghĩa<input value={search} onChange={e=>setSearch(e.target.value)}/></label></div><div className="unit-grid">{examplesFor(topic).filter(e=>(e.measure+e.reading+e.use+e.phrase.hanzi+e.phrase.vi).toLocaleLowerCase().includes(search.toLocaleLowerCase())).map(e=><article className="panel" data-classifier-id={e.id} key={e.id}><p className="tag">{topic==='all'?'Tra cứu':novelty.classifiers.some(x=>x.id===e.id)?'Mới trong phần 5':'Ôn lại · đã giới thiệu trước'}</p><h2 lang="zh-TW">{e.measure} <small>{e.reading}</small></h2><p><StudyText text={e.use}/></p><StudyCard word={e.phrase}/><PracticeText lookup showInitially key={topic+e.id} items={[e]}/>{e.accepted.length>1&&<p>Trong ví dụ này cũng có thể dùng {e.accepted.filter(a=>a!==e.measure).join(' / ')}; sắc thái có thể khác.</p>}<button disabled={busy||!!state.objects.cards['classifiers:'+e.id]} onClick={()=>void addCard(e.id)}>{state.objects.cards['classifiers:'+e.id]?'Đã có thẻ cụm này':'Thêm cụm vào thẻ ôn'}</button></article>)}</div></>}
 <details><summary>Nguồn và phạm vi</summary><p>Ví dụ và bài tập do dự án biên soạn, chưa giáo viên duyệt. Ngân hàng bổ sung gồm 22 cụm, mở theo 18 chủ đề; chưa bao phủ mọi lượng từ hoặc mọi cách kết hợp.</p><p><a href="https://www.huayuworld.org" target="_blank" rel="noreferrer">僑委會 · 全球華文網</a> — tài liệu dạy lượng từ theo đồ vật và ngữ cảnh. <a href="https://dict.concised.moe.edu.tw/" target="_blank" rel="noreferrer">Từ điển MOE Đài Loan</a> để đối chiếu thêm cách dùng.</p></details>
 </>;
}
