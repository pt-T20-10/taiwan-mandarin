import {useMemo,useState,type ReactNode} from 'react';
import {useApp} from '../context';
import type {Flashcard,Word} from '../core/types';
import {addedCardDirections} from '../core/notebookCards';
import {LayerText} from './common';

export function NotebookDictionary({direction,directionSelect,adding,onAdd}:{direction:Flashcard['direction'];directionSelect:ReactNode;adding:Set<string>;onAdd:(w:Word)=>Promise<void>}){
 const {content,state,layers}=useApp(),[search,setSearch]=useState(''),[filter,setFilter]=useState('all');
 const entries=useMemo(()=>content.units.flatMap(u=>u.words).map(word=>({word,directions:addedCardDirections(word,state.objects.cards)})),[content,state.objects.cards]);
 const matching=entries.filter(({word:w})=>(w.hanzi+w.pinyin+w.vi).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const filtered=matching.filter(e=>filter==='all'||e.directions.has(direction)===(filter==='added'));
 const addedCount=matching.filter(e=>e.directions.has(direction)).length;
 return <><div className="filter-bar notebook-filters" aria-label="Tìm và lọc từ trong Sổ tay"><label>Tìm từ<input type="search" placeholder="Tìm chữ, Pinyin hoặc nghĩa Việt" aria-label="Tra từ" value={search} onChange={e=>setSearch(e.target.value)}/></label>{directionSelect}<label>Trạng thái thẻ<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tất cả</option><option value="added">Đã thêm</option><option value="missing">Chưa thêm</option></select></label></div>
 <p className="filter-summary">{filtered.length}/{matching.length} từ phù hợp · {addedCount} đã thêm, {matching.length-addedCount} chưa thêm theo hướng thẻ đang chọn.</p>
 <small>Dấu Đã thêm và bộ lọc được tính theo hướng thẻ đang chọn. Thẻ đang tạm ngưng vẫn được tính là đã thêm.</small>
 <div className="word-grid notebook-words">{filtered.map(({word:w,directions})=>{
  const added=directions.has(direction),pending=adding.has(w.id+':'+direction);
  return <article className={'panel notebook-word'+(added?' card-added':'')} data-word-id={w.id} key={w.id}>
   <LayerText item={w} layers={layers}/>
   <div className="actions"><button disabled={added||pending} onClick={()=>void onAdd(w)}>{added?'✓ Đã thêm':pending?'Đang thêm…':'＋ Thêm thẻ'}</button></div>
   {directions.size>0&&<span className="tag card-added-tag">{added?'Đã có hướng đang chọn':`Đã có ${directions.size} hướng khác`}</span>}
   <small className="word-verification">{w.verification==='draft'?'Bản nháp chưa đối chiếu':w.verification}</small>
   {w.note&&<details><summary>Ghi chú nguồn</summary><p>{w.note}</p><small>{w.source}</small></details>}
  </article>;
 })}</div>{!filtered.length&&<div className="empty"><p>Không có từ phù hợp với tìm kiếm và bộ lọc hiện tại.</p><button onClick={()=>{setSearch('');setFilter('all');}}>Xóa tìm kiếm và bộ lọc</button></div>}</>;
}
