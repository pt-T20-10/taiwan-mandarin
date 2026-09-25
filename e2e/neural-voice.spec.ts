import {test,expect} from '@playwright/test';
import {execFileSync} from 'node:child_process';
const headers={'X-Mandarin-Client':'local-ui'};
function synthesisProcesses(text:string){
 const encoded=Buffer.from(text).toString('base64');
 const code=`import psutil,base64; text=base64.b64decode('${encoded}').decode(); print(sum(1 for p in psutil.process_iter(['name','cmdline'],ad_value=[]) if p.info['name']=='sherpa-onnx-offline-tts.exe' and p.info['cmdline'] and p.info['cmdline'][-1]==text))`;
 return Number(execFileSync('.venv/Scripts/python.exe',['-c',code],{encoding:'utf8',windowsHide:true}));
}
test('Kokoro thật offline: nghe thử không đổi giọng lưu, chọn áp dụng và reload',async({page,request})=>{
 const status=await(await request.get('/api/status')).json();test.skip(!status.neural_voices?.length,'Chưa cài bộ giọng neural; không giả audio');
 const backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];await request.post('/api/restore',{headers,data:backup});
 await page.addInitScript(()=>{const Real=window.Audio;window.Audio=new Proxy(Real,{construct(Target,args){const audio=new Target(...args as []);(window as any).__audio=audio;return audio;}});});
 const external:string[]=[];await page.route('**/*',r=>{if(new URL(r.request().url()).hostname!=='127.0.0.1'){external.push(r.request().url());return r.abort();}return r.continue();});
 await page.goto('/#settings');
 const long='今天下午我想去圖書館學習中文，然後和朋友一起吃晚餐。'.repeat(8);await page.getByLabel('Câu so sánh giọng').fill(long);await page.getByRole('button',{name:'Nghe thử Kokoro · nữ 002',exact:true}).click();
 await expect.poll(()=>synthesisProcesses(long),{timeout:10000}).toBe(1);await page.getByRole('button',{name:'Dừng nghe thử'}).click();await expect.poll(()=>synthesisProcesses(long),{timeout:5000}).toBe(0);
 await page.getByLabel('Câu so sánh giọng').fill('你好，明天下午一起去圖書館，好嗎？');
 const response=page.waitForResponse(r=>r.url().endsWith('/api/ai/tts'));await page.getByRole('button',{name:'Nghe thử Kokoro · nữ 001',exact:true}).click();const wav=await response;expect(wav.status()).toBe(200);expect(wav.request().postDataJSON().voice).toBe('neural:kokoro-zf001');
 await expect.poll(()=>page.evaluate(()=>(window as any).__audio?.currentTime||0)).toBeGreaterThan(0);
 expect((await(await request.get('/api/state')).json()).objects.settings.speech).toBeUndefined();await page.getByRole('button',{name:'Dừng nghe thử'}).click();expect(await page.evaluate(()=>(window as any).__audio.paused)).toBe(true);
 await page.getByRole('button',{name:'Dùng Kokoro · nữ 001',exact:true}).click();await expect(page.getByLabel('Giọng đọc offline',{exact:true})).toHaveValue('neural:kokoro-zf001');
 await expect.poll(async()=>(await(await request.get('/api/state')).json()).objects.settings.speech?.data.voice).toBe('neural:kokoro-zf001');await page.reload();await expect(page.getByLabel('Giọng đọc offline',{exact:true})).toHaveValue('neural:kokoro-zf001');await expect(page.locator('.speech-controls .notice')).toContainText('chưa xác minh giọng Đài Loan');
 await expect(page.locator('.voice-comparison article')).toHaveCount(3);await expect(page.getByLabel('Giọng đọc offline',{exact:true}).locator('option:checked')).toContainText('Kokoro · nữ 001');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.speech-controls').screenshot({path:'test-results/neural-voices-mobile.png'});expect(external).toEqual([]);
});
