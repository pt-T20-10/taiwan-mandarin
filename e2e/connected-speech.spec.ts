import {test,expect} from '@playwright/test';

test('bản đọc liền riêng: lưu đúng bản audio, dừng khi đổi trang, mobile',async({page,request})=>{
 await page.route('**/api/pronunciation/audio',r=>r.fulfill({json:{clips:{'third-third-phrase':{url:'/api/pronunciation/audio/TEST-phrase',sha256:'TEST-phrase-hash',status:'experimental'},'third-third-context':{url:'/api/pronunciation/audio/TEST-context',sha256:'TEST-context-hash',status:'experimental'}}}}));
 await page.addInitScript(()=>{
  const w=window as any;w.__audio=[];w.__speech=[];
  w.Audio=class {paused=false;onended:any=null;onerror:any=null;constructor(public src:string){w.__audio.push(this);}play(){setTimeout(()=>this.onended?.(),30);return Promise.resolve();}pause(){this.paused=true;}};
  window.speechSynthesis.speak=u=>w.__speech.push(u.text);
 });
 await page.goto('/#pronunciation');
 await page.locator('.pronunciation-group > summary').filter({hasText:'Thanh 3'}).click();
 const sample=page.locator('.pronunciation-case').first();
 await expect(sample.getByLabel('Nhận xét: third-third',{exact:true})).toBeDisabled();
 await sample.getByRole('button',{name:'Nghe câu mới',exact:true}).click();
 await sample.getByLabel('Nhận xét: third-third',{exact:true}).selectOption('uncertain');
 await expect.poll(async()=>Object.values((await(await request.get('/api/state')).json()).objects.reports).some((r:any)=>r.data.sample==='third-third'&&r.data.hash==='TEST-context-hash'&&r.data.variant==='context'&&r.data.voice==='breezyvoice-experimental')).toBe(true);
 expect(await page.evaluate(()=>(window as any).__speech)).toEqual([]);
 await page.reload();await page.locator('.pronunciation-group > summary').filter({hasText:'Thanh 3'}).click();
 await expect(sample.getByText('nhận xét của bạn cho ví dụ này;', {exact:false})).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.evaluate(()=>{(window as any).Audio.prototype.play=function(){return Promise.resolve();};});
 await sample.getByRole('button',{name:'Nghe cụm mới',exact:true}).click();
 await page.getByRole('button',{name:'Học',exact:true}).click();
 expect(await page.evaluate(()=>(window as any).__audio.at(-1).paused)).toBe(true);
});

test('thiếu hoặc lỗi bản thử không tự gọi Windows',async({page})=>{
 await page.route('**/api/pronunciation/audio',r=>r.fulfill({json:{clips:{}}}));
 await page.goto('/#pronunciation');await page.locator('.pronunciation-group > summary').filter({hasText:'Thanh 3'}).click();
 await expect(page.locator('.pronunciation-case').first().getByRole('button',{name:'Nghe câu mới',exact:true})).toBeDisabled();
 await page.route('**/api/pronunciation/audio',r=>r.fulfill({json:{clips:{'third-third-context':{url:'/api/pronunciation/audio/TEST-bad',sha256:'TEST',status:'experimental'}}}}));
 await page.addInitScript(()=>{const w=window as any;w.__speech=[];window.speechSynthesis.speak=u=>w.__speech.push(u.text);w.Audio=class {onerror:any;onended:any;play(){setTimeout(()=>this.onerror?.(),10);return Promise.resolve();}pause(){}};});
 await page.reload();await page.locator('.pronunciation-group > summary').filter({hasText:'Thanh 3'}).click();
 const sample=page.locator('.pronunciation-case').first();await sample.getByRole('button',{name:'Nghe câu mới',exact:true}).click();
 await expect(page.locator('.toast')).toContainText('Không phát được bản thu');
 expect(await page.evaluate(()=>(window as any).__speech)).toEqual([]);
 await expect(sample.getByLabel('Nhận xét: third-third',{exact:true})).toBeDisabled();
});
