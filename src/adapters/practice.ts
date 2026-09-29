import {api,chatModel} from './local';
import type {PracticeSet,PracticeSkill} from '../core/types';
export async function generatePractice(unit_id:string,skill:PracticeSkill,request_id:string,onProgress:(text:string)=>void,active=()=>true):Promise<PracticeSet>{
 await api('/ai/practice',{unit_id,skill,request_id});
 const started=Date.now();
 while(Date.now()-started<15*60*1000){
  if(!active()){await chatModel.cancel(request_id);throw Error('Đã hủy tạo đề.');}
  const job=await api<{status:string;progress?:string;packet?:PracticeSet;error?:string}>('/ai/practice/'+request_id);
  onProgress(job.progress||'Đang tạo đề…');
  if(job.status==='done'&&job.packet)return job.packet;
  if(job.status==='error'||job.status==='cancelled')throw Error(job.error||'Đã dừng tạo đề.');
  await new Promise(r=>setTimeout(r,700));
 }
 await chatModel.cancel(request_id);throw Error('Tạo đề quá thời gian; bộ đang học được giữ nguyên.');
}
