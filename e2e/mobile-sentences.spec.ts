import {test,expect} from '@playwright/test';
import {resolve,basename} from 'node:path';
import {stat} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
const bank=JSON.parse(readFileSync('content/sentence-review.json','utf8'));

test('mobile sentence rounds keep drafts, lookup, translations, assembly and offline outbox',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route('**/mobile-sentences',r=>r.fulfill({path:resolve('dist-mobile/index.html'),contentType:'text/html'}));
 await page.route('**/assets/*',async r=>{const file=resolve('dist-mobile/assets',basename(new URL(r.request().url()).pathname));try{await stat(file);await r.fulfill({path:file,contentType:file.endsWith('.js')?'text/javascript':'text/css'});}catch{await r.continue();}});
 await page.addInitScript(data=>{
  const w=window as any;
  w.readSentenceTest=()=>{const s=JSON.parse(localStorage.getItem('sentence-test')!);if(s.sentence_store){const p=s.sentence_store;
   const run=(r:any)=>({...r,tasks:r.tasks.map((t:any)=>({...t,entry:p.dictionary[t.entry]}))});
   s.sentences={...p.value,entries:p.value.entries.map((id:string)=>p.dictionary[id]),run:p.value.run?run(p.value.run):undefined,history:p.value.history.map(run),prepared:p.value.prepared.map(run)};
  }return s;};
  if(!localStorage.getItem('sentence-test'))localStorage.setItem('sentence-test',JSON.stringify({cards:[],queue:[],done:0,cycle:1,pending:[],sentenceUnits:data.units,sentences:{entries:data.entries,revision:'TEST',history:[],pending:[],prepared:[]}}));
  if(!localStorage.getItem('sentence-online'))localStorage.setItem('sentence-online','no');
  w.Capacitor={isNativePlatform:()=>true,getPlatform:()=> 'android',Plugins:{},PluginHeaders:[{name:'ReviewBridge',methods:['load','save','getPair','setPair','wifi','request','audioStatus','downloadAudio','play','stopAudio','pruneAudio','discover'].map(name=>({name,rtype:'promise'}))},{name:'App',methods:[{name:'addListener',rtype:'callback'},{name:'removeListener',rtype:'promise'}]}],nativeCallback:()=>Promise.resolve('TEST'),nativePromise:async(plugin:string,method:string,opts:any={})=>{
   if(plugin==='App')return {};
   if(method==='load')return {state:JSON.parse(localStorage.getItem('sentence-test')!)};
   if(method==='save'){localStorage.setItem('sentence-test',JSON.stringify(opts.state));return {};}
   if(method==='getPair')return {pair:{protocol:1,pc_id:'TEST PC',token:'test',address:'https://192.168.1.2:8766',fingerprint:'a'.repeat(64)}};
   if(method==='wifi')return {wifi:localStorage.getItem('sentence-online')==='yes'};
   if(method==='audioStatus')return {keys:[],bytes:{}};
   if(method==='downloadAudio')throw Error('TEST: audio unavailable');
   if(method==='request'){
    if(opts.path==='/v1/cards')return {data:{protocol:1,pc_id:'TEST PC',cards:[],revision:'TEST'}};
    if(opts.path==='/v2/sentences')return {data:{protocol:2,pc_id:'TEST PC',entries:[],allowed_ids:data.entries.map(e=>e.id),removed:[],units:data.units,revision:'TEST'}};
    if(opts.path==='/v2/sentence-events'){localStorage.setItem('sentence-accepted',JSON.stringify(opts.body.events));return {data:{accepted:opts.body.events.map((e:any)=>e.id)}};}
   }return {};
  }};
 },bank);
 await page.goto('/mobile-sentences');
 await page.getByRole('button',{name:'Ôn câu',exact:true}).click();
 await page.getByRole('combobox',{name:'Chủ đề',exact:true}).selectOption('tw.food');
 await page.getByRole('combobox',{name:'Số câu',exact:true}).selectOption('10');
 await page.getByRole('button',{name:'Bắt đầu lượt mới'}).click();
 for(let i=0;i<10;i++){
  const q=await page.evaluate(()=>{const s=(window as any).readSentenceTest();return s.sentences.run.tasks[s.sentences.run.index];});
  if(i===0){
   await page.locator('.sentence-line .sentence-token').first().click();
   await expect(page.getByRole('dialog',{name:'Tra từ'})).toBeVisible();
   await expect(page.getByRole('button',{name:'Nghe từ',exact:true})).toBeDisabled();
   await page.getByRole('button',{name:'Đóng',exact:true}).click();
   await page.getByLabel('Câu trả lời',{exact:true}).fill(q.entry.gap);
   await expect.poll(()=>page.evaluate(()=>(window as any).readSentenceTest().sentences.run.draft)).toBe(q.entry.gap);
   await page.reload();await page.getByRole('button',{name:'Ôn câu',exact:true}).click();
   await expect(page.getByLabel('Câu trả lời',{exact:true})).toHaveValue(q.entry.gap);
   await expect(page.getByText('Đã dùng trợ giúp',{exact:true})).toBeVisible();
  }else if(q.mode==='choice')await page.locator('.sentence-choices').getByRole('button',{name:q.entry.gap,exact:true}).click();
  else if(q.mode==='assemble'){
   for(const span of q.entry.segments){const token=q.entry.hanzi.slice(span.start,span.end);await page.locator('.sentence-choices button:enabled').filter({hasText:new RegExp('^'+token+'$')}).first().click();}
  }else await page.getByLabel('Câu trả lời',{exact:true}).fill(q.mode==='to_vi'?'Một bản dịch khác':q.mode==='to_zh'?q.entry.hanzi:q.entry.gap);
  await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
  await expect(page.getByRole('heading',{name:q.mode==='to_vi'?'Cần đối chiếu':'Đúng rồi',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Đã hoàn thành lượt ôn'})).toBeVisible();
 expect(await page.evaluate(()=>(window as any).readSentenceTest().sentences.pending.length)).toBe(10);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'data/mobile-sentence-review.png',fullPage:true});
 await page.evaluate(()=>localStorage.setItem('sentence-online','yes'));
 await page.getByRole('button',{name:'Đồng bộ và cài đặt'}).click();
 await page.getByRole('button',{name:'Đồng bộ ngay',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>(window as any).readSentenceTest().sentences.pending.length)).toBe(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('sentence-accepted')!).length)).toBe(10);
});
