import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {App as Lifecycle} from '@capacitor/app';
import {native,emptyState,shuffle,withCards,reviewGroups,startReview,upgradeReview} from './bridge';
import type {State,Pair,Seen} from './bridge';
import './style.css';

function App(){
 const [state,setState]=useState<State>(),[pair,setPair]=useState<Pair|null>(null),[back,setBack]=useState(false),[settings,setSettings]=useState(false),[message,setMessage]=useState(''),[syncing,setSyncing]=useState(false),[saving,setSaving]=useState(false),[manual,setManual]=useState(''),[audio,setAudio]=useState<string[]>([]),[progress,setProgress]=useState('');
 const current=useRef<State>(emptyState()),pairRef=useRef<Pair|null>(null),writes=useRef(Promise.resolve()),syncLock=useRef(false),actionLock=useRef(false),generation=useRef(0),started=useRef(Date.now()),live=useRef(true);
 const active=useRef(true),resumeSync=useRef(false);
 const card=state?.cards.find(c=>c.id===state.queue[0]);
 const groups=reviewGroups(state?.cards||[]),group=groups.find(g=>g.id===state?.review?.group)||groups[0];
 function note(e:unknown){if(live.current)setMessage(e instanceof Error?e.message:String(e));}
 function commit(change:(s:State)=>State){
  const task=writes.current.then(async()=>{const next=change(current.current);await native.save({state:next});current.current=next;if(live.current)setState(next);});
  writes.current=task.catch(()=>{});return task;
 }
 async function storePair(p:Pair){await native.setPair({pair:p});pairRef.current=p;setPair(p);}
 async function request(path:string,body?:object,config?:Pair){return (await native.request({path,method:body?'POST':'GET',body,pair:config})).data;}
 async function sync(showError=false){
  if(syncLock.current||!pairRef.current||!active.current)return;syncLock.current=true;const ticket=generation.current;setSyncing(true);setMessage('');
  try{
   if(!(await native.wifi()).wifi){setProgress('Đang ôn offline. Kết nối Wi-Fi cùng PC để đồng bộ.');return;}
   let manifest;
   try{manifest=await request('/v1/cards');}catch(original){
    const found=await native.discover({pcId:pairRef.current.pc_id});if(!found.address)throw original;
    const candidate={...pairRef.current,address:found.address};manifest=await request('/v1/cards',undefined,candidate);await storePair(candidate);
   }
   if(manifest.protocol!==1||manifest.pc_id!==pairRef.current.pc_id||!Array.isArray(manifest.cards))throw new Error('Dữ liệu không khớp máy tính đã ghép cặp.');
   if(current.current.pc_id&&current.current.pc_id!==manifest.pc_id)throw new Error('Bộ thẻ offline thuộc PC khác. Không trộn dữ liệu.');
   await commit(s=>({...withCards(s,manifest.cards,manifest.revision),pc_id:manifest.pc_id}));
   // Each acknowledged ID is removed only after the PC transaction commits.
   // Reviews added while this request runs stay in the durable outbox.
   while(current.current.pending.length&&ticket===generation.current){
    const batch=current.current.pending.slice(0,200),response=await request('/v1/events',{events:batch});
    const accepted=new Set(response.accepted as string[]);
    if(!batch.some(e=>accepted.has(e.id)))throw new Error('PC chưa xác nhận lượt ôn. Dữ liệu vẫn được giữ trên điện thoại.');
    await commit(s=>({...s,pending:s.pending.filter(e=>!accepted.has(e.id))}));
   }
   if(ticket!==generation.current)return;
   await commit(s=>({...s,lastDataSync:new Date().toISOString()}));
   const keys=[...new Set(current.current.cards.map(c=>c.audio_key))],cached=(await native.audioStatus({keys})).keys;
   setAudio(cached);let ready=new Set(cached);
   for(const key of keys){
    if(ticket!==generation.current)break;
    if(!ready.has(key)){setProgress(`Đang tải giọng Yating · ${ready.size}/${keys.length}`);await native.downloadAudio({key});ready.add(key);setAudio([...ready]);}
   }
   if(ticket===generation.current){await native.pruneAudio({keys});await commit(s=>({...s,lastSync:new Date().toISOString()}));setProgress(keys.length?'Sẵn sàng ôn offline · audio '+ready.size+'/'+keys.length:'PC chưa có thẻ hoạt động.');}
  }catch(e){if(showError)note(e);setProgress('Chưa tải đủ dữ liệu/audio: '+(e instanceof Error?e.message:String(e))+'. Thẻ và lượt ôn đã lưu vẫn được giữ.');}
  finally{
   syncLock.current=false;if(live.current)setSyncing(false);
   // A resume can arrive while the cancelled request is still releasing its
   // lock. Replay that request after cleanup instead of silently dropping it.
   const retry=resumeSync.current&&active.current&&live.current;resumeSync.current=false;
   if(retry)void sync(showError);
  }
 }
 useEffect(()=>{
  live.current=true;
  void (async()=>{try{
   const saved=await native.load();current.current=upgradeReview(saved.state||emptyState());await native.save({state:current.current});setState(current.current);
   try{pairRef.current=(await native.getPair()).pair||null;}catch(e){note(e);pairRef.current=null;}
   setPair(pairRef.current);
   setAudio((await native.audioStatus({keys:current.current.cards.map(c=>c.audio_key)})).keys);
   if(pairRef.current)void sync();else setSettings(true);
  }catch(e){note(e);setState(emptyState());}})();
  const lifecycle=Lifecycle.addListener('appStateChange',({isActive})=>{active.current=isActive;if(isActive){if(syncLock.current)resumeSync.current=true;else void sync();}else{generation.current++;void native.stopAudio();}});
  let wasWifi=false;
  const timer=setInterval(()=>void native.wifi().then(n=>{if(n.wifi&&!wasWifi)void sync();wasWifi=n.wifi;}).catch(()=>{}),15000);
  return()=>{live.current=false;generation.current++;clearInterval(timer);void lifecycle.then(l=>l.remove());void native.stopAudio();};
 },[]);
 useEffect(()=>{setBack(false);started.current=Date.now();void native.stopAudio().catch(()=>{});},[card?.id]);
 async function connect(raw:string){
  if(syncLock.current)return;syncLock.current=true;setSyncing(true);setMessage('');
  try{
   const config=JSON.parse(raw) as Pair;
   if(config.protocol!==1||!config.pc_id||!config.secret||!/^https:\/\//.test(config.address)||!/^\w{64}$/.test(config.fingerprint))throw new Error('QR không phải mã kết nối Đảo nhỏ hợp lệ.');
   if((pairRef.current&&pairRef.current.pc_id!==config.pc_id)||(current.current.pc_id&&current.current.pc_id!==config.pc_id))throw new Error('Bản này dùng một máy tính. Hãy đồng bộ lượt ôn về PC cũ trước; không gửi lịch sử sang PC khác.');
   const pending=await request('/v1/pair',{secret:config.secret,name:'Android · Đảo nhỏ'},config);
   setProgress('Hãy bấm Cho phép thiết bị trên máy tính…');
   let approved=false;
   for(let i=0;i<150&&live.current;i++){
    await new Promise(resolve=>setTimeout(resolve,2000));
    const result=await request('/v1/pair/status',pending,config);
    if(result.approved){
     const {secret,...safe}=config;await storePair({...safe,token:result.token,device_id:result.device_id});approved=true;break;
    }
   }
   if(!approved)throw new Error('Chưa được xác nhận. Tạo QR mới trên PC để thử lại.');
   setManual('');setSettings(false);setProgress('Đã ghép cặp. Đang lấy bộ thẻ…');
  }catch(e){note(e);}finally{syncLock.current=false;setSyncing(false);}
  if(pairRef.current)void sync();
 }
 async function scan(){try{const {CapacitorBarcodeScanner,CapacitorBarcodeScannerTypeHint,CapacitorBarcodeScannerAndroidScanningLibrary}=await import('@capacitor/barcode-scanner');const result=await CapacitorBarcodeScanner.scanBarcode({hint:CapacitorBarcodeScannerTypeHint.QR_CODE,scanInstructions:'Quét QR ở Cài đặt → Đồng bộ điện thoại trên PC',android:{scanningLibrary:CapacitorBarcodeScannerAndroidScanningLibrary.ZXING}});if(result.ScanResult)await connect(result.ScanResult);}catch(e){note(e);}}
 async function next(){
  if(!back||!card||actionLock.current)return;actionLock.current=true;setSaving(true);void native.stopAudio();
  let complete=false;
  try{
   const seen:Seen={id:crypto.randomUUID(),word_id:card.id,card_ids:card.card_ids,timestamp:new Date().toISOString(),duration_ms:Math.min(86400000,Math.max(0,Date.now()-started.current))};
   await commit(s=>{
    const remaining=s.queue.slice(1);complete=!remaining.length;
    return {...s,pending:[...s.pending,seen],queue:remaining,done:s.done+1,review:s.review?{...s.review,finished:complete}:s.review};
   });setBack(false);started.current=Date.now();if(complete)void sync();
  }catch(e){note(e);}finally{actionLock.current=false;setSaving(false);}
 }
 async function mix(){if(actionLock.current)return;actionLock.current=true;setSaving(true);try{await commit(s=>({...s,queue:s.queue.length?[s.queue[0],...shuffle(s.queue.slice(1))]:[]}));}catch(e){note(e);}finally{actionLock.current=false;setSaving(false);}}
 async function begin(groupId=state?.review?.group||'all',size=state?.review?.size??20){if(actionLock.current)return;actionLock.current=true;setSaving(true);try{await native.stopAudio();await commit(s=>startReview(s,groupId,size));setBack(false);}catch(e){note(e);}finally{actionLock.current=false;setSaving(false);}}
 return <main><header><span>島 <b>đảo nhỏ</b></span><button aria-label={settings?'Về ôn thẻ':'Đồng bộ và cài đặt'} onClick={()=>setSettings(!settings)}>{settings?'Ôn thẻ':'☰'}</button></header>{message&&<div className="message" role="status">{message}<button onClick={()=>setMessage('')} aria-label="Đóng thông báo">×</button></div>}
 {!settings&&!!state?.cards.length&&<details className="review-filters"><summary>Bộ ôn · {group.label} · {state.review?.size===0?'cả nhóm':(state.review?.size??20)+' từ/lượt'}</summary><label>Nhóm từ<select aria-label="Nhóm từ" disabled={saving} value={group.id} onChange={e=>void begin(e.target.value,state.review?.size??20)}>{groups.map(g=><option key={g.id} value={g.id}>{g.label} ({g.ids.length} từ)</option>)}</select></label><label>Số từ mỗi lượt<select aria-label="Số từ mỗi lượt" disabled={saving} value={state.review?.size??20} onChange={e=>void begin(group.id,Number(e.target.value))}>{[20,30,40,0].map(n=><option key={n} value={n}>{n?n+' từ':'Cả nhóm'}</option>)}</select></label><button disabled={saving} onClick={()=>void begin()}>Bộ mới</button>{state.cards.length<20&&<small>Hiện chỉ có {state.cards.length} từ; thêm thẻ để có nhóm từ 20 trở lên.</small>}</details>}
 {settings?<section><h1>Kết nối máy tính</h1><p>{pair?'Đã ghép cặp. Mở ứng dụng PC và dùng cùng Wi-Fi để đồng bộ.':'Mở Cài đặt → Đồng bộ điện thoại trên PC rồi tạo QR.'}</p><div className="actions"><button disabled={syncing} onClick={()=>void scan()}>Quét QR ghép cặp</button><button disabled={syncing||!pair} onClick={()=>void sync(true)}>Đồng bộ ngay</button></div><details><summary>Nhập thông tin kết nối thủ công</summary><textarea aria-label="Thông tin ghép cặp" placeholder="Dán toàn bộ thông tin từ PC" value={manual} onChange={e=>setManual(e.target.value)}/><button disabled={syncing||!manual.trim()} onClick={()=>void connect(manual)}>Kết nối</button></details><p>{progress||'Một giọng đọc: Microsoft Yating.'}</p><small>{state?.lastSync?'Đồng bộ đủ thẻ/audio gần nhất: '+new Date(state.lastSync).toLocaleString('vi-VN'):'Chưa đồng bộ.'}<br/>{state?.cards.length||0} từ · {state?.pending.length||0} lượt chưa gửi · audio {new Set(audio).size}/{new Set(state?.cards.map(c=>c.audio_key)).size}</small></section>:
 !state?<section><p>Đang mở thẻ…</p></section>:!card&&state.review?.finished&&state.cards.length>0?<section><h1>Đã xong lượt ôn</h1><p>{state.done} từ đã ôn. Bạn có thể dừng ở đây hoặc lấy bộ tiếp theo.</p><button disabled={saving} onClick={()=>void begin()}>Bộ tiếp theo</button></section>:!card?<section><h1>Chưa có thẻ</h1><p>Kết nối máy tính để tải flashcard. Sau đó bạn có thể ôn cả khi máy tính tắt.</p><button onClick={()=>setSettings(true)}>Kết nối máy tính</button></section>:<><div className="toolbar"><small>Lượt {state.cycle} · {state.done+1}/{state.done+state.queue.length}</small><button disabled={saving} onClick={()=>void mix()}>⤨ Trộn</button></div><article className="flashcard"><div className="hanzi" lang="zh-TW">{card.hanzi}</div>{back?<><p className="pinyin">{card.pinyin}</p><div className="meaning">{card.meanings.map(v=><p key={v}>{v}</p>)}</div><button className="listen" disabled={!audio.includes(card.audio_key)} onClick={()=>void native.play({key:card.audio_key}).catch(note)}>◖)) Nghe</button><button className="primary" disabled={saving} onClick={()=>void next()}>Tiếp →</button></>:<button className="primary" onClick={()=>setBack(true)}>Lật thẻ</button>}</article><footer>{syncing?'Đang đồng bộ · bạn vẫn có thể ôn':state.pending.length?`${state.pending.length} lượt đã lưu trên máy, chờ đồng bộ`:state.cards.every(c=>audio.includes(c.audio_key))?'Sẵn sàng ôn offline · giọng Yating':`Đã có thẻ · audio ${new Set(audio).size}/${new Set(state.cards.map(c=>c.audio_key)).size} · mở ☰ để đồng bộ audio`}{progress&&syncing&&<small>{progress}</small>}</footer></>}
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
