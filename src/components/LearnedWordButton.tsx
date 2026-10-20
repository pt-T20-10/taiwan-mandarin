import {useRef,useState} from 'react';
import {useApp} from '../context';
import {isMarkedLearned,learnedWordId} from '../core/learnedWords';
import type {TextItem} from '../core/types';

export function LearnedWordButton({word}:{word:TextItem}){
 const {state,put,notify}=useApp(),id=learnedWordId(word.hanzi),row=state.objects.reports[id],learned=isMarkedLearned(id,row);
 const pending=useRef(false),[busy,setBusy]=useState(false);
 async function toggle(){if(pending.current)return;pending.current=true;setBusy(true);try{
  await put({collection:'reports',id,expected_version:row?.version||0,data:{kind:'learned-word',learned:!learned,word:{hanzi:word.hanzi,pinyin:word.pinyin,vi:word.vi},source:'word-card',context:location.hash,updated_at:new Date().toISOString()}});
 }catch(e){notify((e as Error).message);}finally{pending.current=false;setBusy(false);}}
 return <button type="button" aria-pressed={learned} disabled={busy} onClick={()=>void toggle()} title={learned?'Bỏ đánh dấu tự học cho từ này. Nếu từ có trong flashcard hoặc bài đã hoàn thành, nguồn đó vẫn được giữ.':'Ghi nhận đã học đúng từ này để dùng làm nguồn cho bài ôn tập, chưa cần hoàn thành bài hay thêm flashcard.'}>{busy?'Đang lưu…':learned?'Đã học ✓ · Bỏ đánh dấu':'Đánh dấu đã học'}</button>;
}
