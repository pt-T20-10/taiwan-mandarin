import {useState} from 'react';
import {useApp} from '../context';
import type {Session} from '../core/types';
export function SessionUpdate({id,session,exerciseIds}:{id:string;session:Session;exerciseIds:string[]}){
 const {state,put,notify}=useApp(),[busy,setBusy]=useState(false);
 async function start(){setBusy(true);try{const archive='archive:'+id+':'+session.run;if(!state.objects.sessions[archive])await put({collection:'sessions',id:archive,expected_version:0,data:{...session,archived:true}});await put({collection:'sessions',id,expected_version:state.objects.sessions[id]?.version||0,data:{...session,phase:'intro',run:crypto.randomUUID(),index:0,answers:[],retry:[],draft:'',assisted:false,answer_hint:false,exercise_ids:exerciseIds,content_version:8}});location.reload();}catch(e){notify((e as Error).message);}finally{setBusy(false);}}
 return <section className="panel"><h2>Bài luyện đã được cập nhật</h2><p>Phiên cũ và đáp án đã làm được giữ trong lịch sử. Phiên mới dùng bài luyện theo tình huống.</p><button disabled={busy} onClick={()=>void start()}>Bắt đầu phiên mới</button></section>;
}
