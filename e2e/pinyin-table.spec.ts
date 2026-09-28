import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const recordings=JSON.parse(fs.readFileSync('public/learning/pinyin/recordings.json','utf8'));

test('bảng Pinyin: hover hiện bốn thanh, chỉ click mới phát MP3 thật, replay và thiếu bản thu',async({page})=>{
 const external:string[]=[],tts:string[]=[];
 await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.hostname!=='127.0.0.1'){external.push(url.href);return r.abort();}if(url.pathname==='/api/ai/tts')tts.push(url.href);return r.continue();});
 await page.addInitScript(()=>{const Real=window.Audio;(window as any).__audio=[];window.Audio=new Proxy(Real,{construct(Target,args){const a=new Target(...args as []);(window as any).__audio.push(a);return a;}});});
 await page.goto('/#pronunciation');const lab=page.locator('.pinyin-lab');
 await expect(lab.getByRole('button',{name:/^Chọn âm /})).toHaveCount(406);
 await expect(lab.getByRole('table')).toHaveCount(1);await expect(lab.locator('.spelling-steps')).toHaveCount(0);
 await page.getByLabel('Tìm âm Pinyin').fill('ba');await page.getByLabel('Tìm âm Pinyin').fill('');
 await page.getByRole('button',{name:'Chọn âm ba',exact:true}).hover();
 const popup=page.getByRole('group',{name:'Bốn thanh của ba'});await expect(popup.getByRole('button')).toHaveCount(4);
 expect(await page.evaluate(()=>(window as any).__audio.length)).toBe(0);
 for(const [name,file] of [['Nghe bā · thanh 1','ba1.mp3'],['Nghe bā · thanh 1','ba1.mp3'],['Nghe bà · thanh 4','ba4.mp3']]){
  await page.getByRole('button',{name:'Chọn âm ba',exact:true}).hover();await page.getByRole('button',{name,exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>(window as any).__audio.at(-1)?.currentTime||0)).toBeGreaterThan(0);
  expect(await page.evaluate(()=>(window as any).__audio.at(-1).src)).toContain(file);
 }
 await page.getByRole('button',{name:'Dừng âm mẫu'}).click();expect(await page.evaluate(()=>(window as any).__audio.at(-1).paused)).toBe(true);
 const [missing,tone]=recordings.missing[0].split(':');await page.getByRole('button',{name:'Chọn âm '+missing,exact:true}).hover();
 await expect(page.getByRole('group',{name:'Bốn thanh của '+missing}).getByRole('button').nth(Number(tone)-1)).toBeDisabled();
 await expect(lab).not.toContainText('Chưa có ví dụ Hán tự');expect(tts).toEqual([]);expect(external).toEqual([]);
 await page.screenshot({path:'test-results/pinyin-table-desktop.png',fullPage:false});
});

test.describe('mobile cảm ứng',()=>{
test.use({hasTouch:true,isMobile:true});
test('bảng Pinyin: chạm trên mobile, bàn phím, đóng popup và không tràn trang',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/#pronunciation');
 const cell=page.getByRole('button',{name:'Chọn âm nü',exact:true});await cell.tap();
 let popup=page.getByRole('group',{name:'Bốn thanh của nü'});await expect(popup).toBeVisible();
 const rect=await popup.boundingBox();expect(rect!.x).toBeGreaterThanOrEqual(0);expect(rect!.x+rect!.width).toBeLessThanOrEqual(390);
 await popup.getByRole('button',{name:'Nghe nǚ · thanh 3'}).tap();await expect(page.locator('.pinyin-lab').getByRole('status')).toContainText('nǚ');
 await page.keyboard.press('Escape');await expect(popup).toHaveCount(0);await expect(cell).toBeFocused();
 await cell.press('ArrowDown');await expect(popup).toBeVisible();await expect(popup.getByRole('button').first()).toBeFocused();
 await page.keyboard.press('Enter');await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.pinyin-lab').screenshot({path:'test-results/pinyin-table-mobile.png'});
 await expect(page.locator('.pronunciation-group')).toHaveCount(6);
});
});

test('bảng Pinyin: đổi thanh/dừng/điều hướng hủy audio cũ và bỏ lỗi muộn',async({page})=>{
 await page.addInitScript(()=>{
  const w=window as any;w.__audio=[];
  w.Audio=class {paused=false;onended:any=null;onerror:any=null;lateError:any;constructor(public src:string){w.__audio.push(this);}play(){this.lateError=this.onerror;return Promise.resolve();}pause(){this.paused=true;}};
 });
 await page.goto('/#pronunciation');
 const ba=page.getByRole('button',{name:'Chọn âm ba',exact:true});await ba.click();
 await page.getByRole('button',{name:'Nghe bā · thanh 1'}).click();await page.getByRole('button',{name:'Nghe bá · thanh 2'}).click();
 expect(await page.evaluate(()=>(window as any).__audio[0].paused)).toBe(true);
 await page.evaluate(()=>(window as any).__audio[0].lateError());await expect(page.locator('.pinyin-lab').getByRole('alert')).toHaveCount(0);
 await expect(page.locator('.pinyin-lab').getByRole('status')).toContainText('Đang nghe: bá');
 await page.getByRole('button',{name:'Dừng âm mẫu'}).click();expect(await page.evaluate(()=>(window as any).__audio[1].paused)).toBe(true);
 await ba.click();await page.getByRole('button',{name:'Nghe bǎ · thanh 3'}).click();await page.evaluate(()=>(window as any).__audio.at(-1).lateError());
 await expect(page.locator('.pinyin-lab').getByRole('alert')).toContainText('Không phát được bản thu');
 await page.getByRole('button',{name:'Nghe bà · thanh 4'}).click();await expect(page.locator('.pinyin-lab').getByRole('alert')).toHaveCount(0);
 await page.getByRole('button',{name:'Học',exact:true}).click();expect(await page.evaluate(()=>(window as any).__audio.at(-1).paused)).toBe(true);
 await page.evaluate(()=>(window as any).__audio.at(-1).lateError());await expect(page.getByRole('alert')).toHaveCount(0);await expect(page.locator('.pinyin-tone-popup')).toHaveCount(0);
});
