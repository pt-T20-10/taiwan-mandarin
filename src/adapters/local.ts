import type {Storage, ContentStore, ChatModel, SpeechRecognition, SpeechSynthesis} from './contracts';
export async function api<T=any>(path:string, body?:unknown, method?:string):Promise<T>{
  const response=await fetch('/api'+path,{method:method||(body===undefined?'GET':'POST'),headers:{'Content-Type':'application/json','X-Mandarin-Client':'local-ui'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.ok){let message='Không kết nối được dịch vụ local';try{const j=await response.json();message=typeof j.detail==='string'?j.detail:JSON.stringify(j.detail);}catch{}throw new Error(message);}
  return response.json();
}
export const storage:Storage={load:()=>api('/state'),put:m=>api('/objects',m),event:(event,mutation)=>api('/events',{event,mutation})};
export const contentStore:ContentStore={load:()=>api('/content'),install:p=>api('/packages',p)};
export const chatModel:ChatModel={reply:(turns,request_id,mode)=>api('/ai/chat',{messages:turns.slice(-12).map(({role,content})=>({role,content})),request_id,mode}),cancel:id=>api('/ai/cancel/'+encodeURIComponent(id),{})};
export const recognition:SpeechRecognition={async transcribe(wav,signal){const response=await fetch('/api/ai/asr',{method:'POST',headers:{'Content-Type':'audio/wav','X-Mandarin-Client':'local-ui'},body:wav,signal});if(!response.ok)throw new Error((await response.json()).detail);return response.json();}};
let audio:HTMLAudioElement|null=null;let audioUrl:string|null=null;let generation=0;
let finishSpeech:(()=>void)|null=null;
let pendingAudio:AbortController|null=null;
export const speech:SpeechSynthesis={
  stop(){generation++;finishSpeech?.();finishSpeech=null;pendingAudio?.abort();pendingAudio=null;window.speechSynthesis?.cancel();if(audio){audio.pause();audio=null;}if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null;}},
  async speak(text){speech.stop();const ticket=generation;
    const voice=window.speechSynthesis?.getVoices().find(v=>v.lang.toLowerCase()==='zh-tw'&&v.localService);
    if(voice){await new Promise<void>((resolve,reject)=>{const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang='zh-TW';utterance.rate=.85;
      const finish=()=>{if(ticket===generation)finishSpeech=null;resolve();};finishSpeech=finish;
      utterance.onend=finish;utterance.onerror=e=>{if(ticket!==generation){resolve();return;}finishSpeech=null;reject(new Error('Giọng zh-TW không đọc được: '+e.error+'. Hãy kiểm tra thiết bị và giọng Windows.'));};
      window.speechSynthesis.speak(utterance);});return;}
    const controller=new AbortController();pendingAudio=controller;
    let r:Response;
    try{r=await fetch('/api/ai/tts',{method:'POST',headers:{'Content-Type':'application/json','X-Mandarin-Client':'local-ui'},body:JSON.stringify({text}),signal:controller.signal});}
    catch(error){if(controller.signal.aborted)return;throw error;}
    finally{if(pendingAudio===controller)pendingAudio=null;}
    if(ticket!==generation)return;
    if(!r.ok)throw new Error((await r.json()).detail);
    const blob=await r.blob();if(ticket!==generation)return;
    audioUrl=URL.createObjectURL(blob);audio=new Audio(audioUrl);await audio.play();
  }
};
export function downloadJSON(value:unknown,name:string){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function encodeWav(blob:Blob):Promise<Blob>{
  const context=new AudioContext();let buffer:AudioBuffer;
  try{buffer=await context.decodeAudioData(await blob.arrayBuffer());}finally{await context.close();}
  const offline=new OfflineAudioContext(1,Math.ceil(buffer.duration*16000),16000);const source=offline.createBufferSource();source.buffer=buffer;source.connect(offline.destination);source.start();
  const pcm=(await offline.startRendering()).getChannelData(0);const data=new ArrayBuffer(44+pcm.length*2);const view=new DataView(data);
  const str=(at:number,s:string)=>[...s].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0)));
  str(0,'RIFF');view.setUint32(4,36+pcm.length*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,pcm.length*2,true);
  pcm.forEach((v,i)=>view.setInt16(44+i*2,Math.max(-1,Math.min(1,v))*(v<0?32768:32767),true));return new Blob([data],{type:'audio/wav'});
}
