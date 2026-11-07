import {test,expect} from '@playwright/test';
import {readFile,stat} from 'node:fs/promises';
import {resolve,basename} from 'node:path';

test('mobile screen keeps offline reviews and shuffle order, then syncs without a rating',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route('**/mobile-test',route=>route.fulfill({path:resolve('dist-mobile/index.html'),contentType:'text/html'}));
 await page.route('**/assets/*',async route=>{
  const file=resolve('dist-mobile/assets',basename(new URL(route.request().url()).pathname));
  try{await stat(file);await route.fulfill({path:file,contentType:file.endsWith('.js')?'text/javascript':'text/css'});}catch{await route.continue();}
 });
 await page.addInitScript(()=>{
  const w=window as any;
  const words=[['你好','nǐ hǎo','xin chào'],['謝謝','xièxie','cảm ơn'],['麵','miàn','mì']];
  const cards=words.map(([hanzi,pinyin,vi],i)=>({id:String(i),hanzi,pinyin,meanings:[vi],card_ids:['pc-'+i],decks:['TEST'],audio_key:String(i).repeat(64)}));
  if(!localStorage.getItem('test-state'))localStorage.setItem('test-state',JSON.stringify({cards,queue:['0','1','2'],done:0,cycle:1,pending:[]}));
  if(!localStorage.getItem('test-initialized')){localStorage.setItem('test-offline','1');localStorage.setItem('test-initialized','1');}
  w.androidBridge={};
  w.Capacitor={PluginHeaders:[{name:'ReviewBridge',methods:['load','save','getPair','setPair','request','audioStatus','downloadAudio','pruneAudio','play','stopAudio','wifi','discover'].map(name=>({name,rtype:'promise'}))},{name:'App',methods:[{name:'addListener',rtype:'callback'},{name:'removeListener',rtype:'promise'}]}],
   nativeCallback:(plugin:string,method:string,options:any,callback:any)=>{if(plugin==='App'&&method==='addListener')w.testLifecycle=callback;return Promise.resolve('TEST callback');},
   nativePromise:async(plugin:string,method:string,options:any={})=>{
    if(plugin==='App')return {};
    if(method==='load')return {state:JSON.parse(localStorage.getItem('test-state')!)};
    if(method==='save'){localStorage.setItem('test-state',JSON.stringify(options.state));return {};}
    if(method==='getPair')return {pair:{protocol:1,pc_id:'TEST PC',address:'https://192.168.1.2:8766',fingerprint:'a'.repeat(64),token:'TEST token'}};
    if(method==='wifi')return {wifi:localStorage.getItem('test-offline')!=='1'};
    if(method==='audioStatus')return {keys:JSON.parse(localStorage.getItem('test-audio')||JSON.stringify(['0'.repeat(64)]))};
    if(method==='downloadAudio'){
     if(!localStorage.getItem('test-interrupted')){
      localStorage.setItem('test-interrupted','1');w.testLifecycle({isActive:false});w.testLifecycle({isActive:true});
      await new Promise(resolve=>setTimeout(resolve,150));
     }
     const keys=JSON.parse(localStorage.getItem('test-audio')||JSON.stringify(['0'.repeat(64)]));
     if(!keys.includes(options.key))keys.push(options.key);localStorage.setItem('test-audio',JSON.stringify(keys));return {};
    }
    if(method==='play'){w.testPlayed=options.key;return {};}
    if(method==='request'){
     if(options.path==='/v1/cards')return {data:{protocol:1,pc_id:'TEST PC',cards,revision:'1'}};
     if(options.path==='/v1/events'){localStorage.setItem('test-pc-events',JSON.stringify(options.body.events));return {data:{accepted:options.body.events.map((e:any)=>e.id)}};}
    }
    return {};
   }};
 });
 await page.goto('/mobile-test');
 await expect(page.locator('.hanzi')).toHaveText('你好');await expect(page.locator('.meaning')).toHaveCount(0);
 await page.getByRole('button',{name:'Trộn',exact:false}).click();
 const order=await page.evaluate(()=>JSON.parse(localStorage.getItem('test-state')!).queue);
 expect(order[0]).toBe('0');expect(new Set(order).size).toBe(3);
 await page.getByRole('button',{name:'Lật thẻ',exact:true}).click();await expect(page.locator('.meaning')).toContainText('xin chào');
 await page.getByRole('button',{name:'Nghe',exact:false}).click();await expect.poll(()=>page.evaluate(()=>(window as any).testPlayed)).toBe('0'.repeat(64));
 await page.screenshot({path:'data/mobile-review-preview.png'});
 await page.getByRole('button',{name:'Tiếp →',exact:true}).dblclick();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('test-state')!).pending.length)).toBe(1);
 await page.reload();await expect(page.locator('.meaning')).toHaveCount(0);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('test-state')!).queue)).toEqual(order.slice(1));
 await page.getByRole('button',{name:'Đồng bộ và cài đặt'}).click();
 await page.evaluate(()=>localStorage.setItem('test-offline','0'));
 await page.getByRole('button',{name:'Đồng bộ ngay',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('test-state')!).pending.length)).toBe(0);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('test-audio')||'[]').length)).toBe(3);
 await expect.poll(()=>page.evaluate(()=>!!JSON.parse(localStorage.getItem('test-state')!).lastSync)).toBe(true);
 const seen=await page.evaluate(()=>JSON.parse(localStorage.getItem('test-pc-events')!));expect(seen).toHaveLength(1);expect(seen[0]).not.toHaveProperty('rating');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 // Desktop QR controls must POST the selected LAN address, not accidentally
 // issue the generic API helper's default GET.
 let pairingBody:any;
 await page.route('**/api/mobile/status',route=>route.fulfill({json:{enabled:true,addresses:['192.168.1.2'],port:8766,cards:3,voice:'Microsoft Yating',audio_error:'',pending:[],devices:[]}}));
 await page.route('**/api/mobile/pairing',route=>{expect(route.request().method()).toBe('POST');pairingBody=route.request().postDataJSON();return route.fulfill({json:{protocol:1,pc_id:'TEST PC',address:'https://192.168.1.2:8766',fingerprint:'a'.repeat(64),secret:'TEST secret'}});});
 await page.goto('/#settings');
 await page.getByRole('button',{name:'Ghép cặp điện thoại · tạo QR',exact:true}).click();
 await expect(page.getByAltText('Quét QR này bằng Đảo nhỏ – Ôn tập')).toBeVisible();
 expect(pairingBody.address).toBe('192.168.1.2');
});
