import {test,expect} from '@playwright/test';
import fs from 'node:fs';
import {strokeModels,type Stroke} from '../src/core/strokes';
test.beforeEach(async({request})=>{
 const backup=await (await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 const pack=JSON.parse(fs.readFileSync('content/foundation.pack.json','utf8'));backup.packages=[{id:pack.content.id,version:pack.content.version,payload:JSON.stringify(pack)}];
 await request.post('/api/restore',{headers:{'X-Mandarin-Client':'local-ui'},data:backup});
});
test('36 câu đầu vào, kết thúc và làm lại không mất trạng thái',async({page,request})=>{
 const content=await(await request.get('/api/content')).json();expect(content.units).toHaveLength(12);
 await page.goto('/#placement');await page.getByRole('button',{name:'Bắt đầu kiểm tra',exact:true}).click();
 for(let i=0;i<36;i++)await page.getByRole('button',{name:'Chưa biết / bỏ qua',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Gợi ý vị trí bắt đầu'})).toBeVisible();
 expect((await(await request.get('/api/state')).json()).objects.placement.latest.data.answers).toHaveLength(36);
 await page.getByRole('button',{name:'Làm lại kiểm tra'}).click();await page.getByRole('button',{name:'Bắt đầu kiểm tra',exact:true}).click();await expect(page.getByText('Câu 1/36',{exact:true})).toBeVisible();
});
test('nhập/xuất thẻ JSON và lịch ôn tự do không đổi',async({page,request})=>{
 await page.goto('/#notebook');await page.getByRole('button',{name:'Thẻ cá nhân',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles({name:'cards.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schema:1,cards:[{id:'test-card',word:{hanzi:'你好',pinyin:'nǐ hǎo',vi:'xin chào'},direction:'produce',deck:'Test',tags:['cá nhân']}]}))});
 await expect(page.getByRole('status')).toContainText('Đã nhập');const before=(await(await request.get('/api/state')).json()).objects.cards['test-card'];
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON'}).click();expect((await download).suggestedFilename()).toBe('dao-nho-cards.json');
 await page.getByRole('button',{name:'Ôn tập',exact:true}).click();await page.getByRole('button',{name:'Luyện tự do',exact:true}).click();await expect(page.locator('.flashcard')).not.toContainText('nǐ hǎo');await page.getByRole('button',{name:'Lật thẻ'}).click();await page.getByRole('button',{name:'4 Dễ',exact:true}).click();
 const after=(await(await request.get('/api/state')).json()).objects.cards['test-card'];expect(after).toEqual(before);
});
test('học bài, không lộ đáp án, lưu lại sau reload, IME không gửi sớm',async({page,request})=>{
 await page.goto('/');await page.getByRole('button',{name:'1 Khám phá từ mới'}).first().click();await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();
 await expect(page.locator('.question-hanzi')).toHaveText('你好');await expect(page.locator('.exercise')).not.toContainText('nǐ hǎo');
 const content=await(await request.get('/api/content')).json();const ex=content.units[0].lessons[0].exercises;
 for(let i=0;i<5;i++){await page.getByRole('button',{name:ex[i].answers[0],exact:true}).click();await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await expect(page.getByText('Đúng rồi!',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();}
 const input=page.getByRole('textbox',{name:'Câu trả lời'});await input.fill('ni3 hao3');await input.dispatchEvent('compositionstart');await input.press('Enter');await expect(page.getByText('Đúng rồi!',{exact:true})).not.toBeVisible();await input.dispatchEvent('compositionend');await input.fill('ni3 hao3');await page.getByRole('button',{name:'Lưu & tạm dừng'}).click();await page.reload();await page.getByRole('button',{name:'Tiếp tục bài đang học'}).click();await expect(page.getByRole('textbox',{name:'Câu trả lời'})).toHaveValue('ni3 hao3');await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();await expect(page.getByText('Bạn đã đi hết bài học')).toBeVisible();await page.getByRole('button',{name:'Thêm từ vào ôn tập'}).click();await expect.poll(async()=>Object.keys((await(await request.get('/api/state')).json()).objects.cards).length).toBe(5);
 await page.reload();await page.getByRole('button',{name:'Ôn tập',exact:false}).first().click();await page.getByRole('button',{name:'Lật thẻ'}).click();await page.getByRole('button',{name:'3 Nhớ',exact:true}).click();await expect.poll(async()=>(await(await request.get('/api/state')).json()).events.filter((e:any)=>e.kind==='review').length).toBe(1);
});
for(let unitIndex=0;unitIndex<12;unitIndex++)test(`đơn vị ${unitIndex+1}: bài đóng, nghe bỏ qua, nói/viết mở, tổng kết`,async({page,request})=>{
 const content=await(await request.get('/api/content')).json();
 for(const lesson of content.units[unitIndex].lessons){
  await page.goto('/');await page.getByRole('button',{name:new RegExp(lesson.title.replace('&','&'))}).nth(unitIndex).click();await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();
  for(const ex of lesson.exercises){
    if(['listening','dictation'].includes(ex.kind)){await page.getByRole('button',{name:'Bỏ qua câu này'}).click();}
    else{if(ex.choices.length)await page.getByRole('button',{name:ex.answers[0],exact:true}).click();else await page.locator('.exercise textarea').fill(ex.kind==='writing'?'我是越南人。':ex.answers[0]);await page.getByRole('button',{name:['speaking','writing'].includes(ex.kind)?'Lưu bài luyện':'Kiểm tra',exact:true}).click();}
    await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();
  }
  await expect(page.getByText('Bạn đã đi hết bài học')).toBeVisible();
 }
 const state=await(await request.get('/api/state')).json();expect(Object.values(state.objects.sessions).filter((s:any)=>s.data.phase==='summary')).toHaveLength(4);expect(state.events.filter((e:any)=>e.skill==='listening').every((e:any)=>e.correct===null)).toBe(true);
});
test('không gọi mạng ngoài máy khi học; các màn hình và mobile không tràn',async({page})=>{
 const external:string[]=[];await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname!=='127.0.0.1'&&url.protocol!=='blob:'){external.push(url.href);return route.abort();}return route.continue();});
 await page.goto('/');for(const name of ['Luyện kỹ năng','Sổ tay','Thống kê','Cài đặt']){await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('main h1')).toBeVisible();}
 await page.getByRole('button',{name:'Học',exact:true}).click();await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(external).toEqual([]);
});
test('ghi chú bền vững và tình huống thiếu giọng TEST có thông báo',async({page})=>{
 await page.addInitScript(()=>{window.speechSynthesis.getVoices=()=>[];});
 await page.route('**/api/ai/tts',route=>route.fulfill({status:503,json:{detail:'TEST: chưa có giọng zh-TW local'}}));
 await page.goto('/#notebook');await page.getByRole('button',{name:'Ghi chú',exact:true}).click();await page.getByLabel('Ghi chú học tập').fill('明天見 — hẹn gặp ngày mai');await page.getByRole('button',{name:'Lưu ghi chú',exact:true}).click();await expect(page.getByRole('status')).toContainText('Đã lưu');await page.reload();await page.getByRole('button',{name:'Ghi chú',exact:true}).click();await expect(page.getByLabel('Ghi chú học tập')).toHaveValue('明天見 — hẹn gặp ngày mai');await page.getByRole('button',{name:'Cài đặt',exact:true}).click();await page.getByRole('button',{name:'◖)) Nghe',exact:true}).click();await expect(page.getByRole('status')).toContainText('zh-TW');
});
test('hai tab cùng câu không tạo lượt học trùng',async({page,context,request})=>{
 await page.goto('/');await page.getByRole('button',{name:'1 Khám phá từ mới'}).first().click();await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();
 const other=await context.newPage();await other.goto('/');await other.getByRole('button',{name:'Tiếp tục bài đang học'}).click();
 for(const p of [page,other]){await p.getByRole('button',{name:'xin chào',exact:true}).click();await p.getByRole('button',{name:'Kiểm tra',exact:true}).click();await expect(p.getByText('Đúng rồi!',{exact:true})).toBeVisible();}
 expect((await(await request.get('/api/state')).json()).events).toHaveLength(1);
});
test('luồng micro mô phỏng TEST: sửa transcript trước gửi, chat và lưu',async({page,context})=>{
 // Test-only browser media device and clearly labelled ASR/LLM fixtures; no production mock.
 await context.grantPermissions(['microphone']);let sent='';
 await page.route('**/api/ai/asr',r=>r.fulfill({json:{text:'[TEST] 你好',elapsed_ms:1,notice:'TEST fixture; not microphone benchmark'}}));
 await page.route('**/api/ai/chat',r=>{sent=r.request().postDataJSON().messages.at(-1).content;return r.fulfill({json:{hanzi:'[TEST] 你好！',pinyin:'nǐ hǎo',vi:'[TEST] xin chào',feedback:'TEST fixture',elapsed_ms:1,generated:true}});});
 await page.goto('/#chat');await page.getByLabel('Đọc câu trả lời').uncheck();await page.getByRole('button',{name:'● Ghi âm',exact:true}).click();await expect(page.getByRole('button',{name:/Dừng ghi/})).toBeVisible();await page.waitForTimeout(500);await page.getByRole('button',{name:/Dừng ghi/}).click();await page.getByRole('button',{name:'Nhận dạng local',exact:true}).click();await expect(page.getByLabel('Transcript / tin nhắn')).toHaveValue('[TEST] 你好');expect(sent).toBe('');await page.getByLabel('Transcript / tin nhắn').fill('[TEST] 你好，我是安。');await page.getByRole('button',{name:'Gửi câu →',exact:true}).click();await expect(page.locator('.bubble.assistant')).toContainText('[TEST] 你好！');expect(sent).toBe('[TEST] 你好，我是安。');await page.reload();await expect(page.locator('.bubble.assistant')).toContainText('[TEST] 你好！');
});
test('luyện nét bằng chuột: sai hướng không ghi, đổi chủ đề và lưu đúng chữ đã chọn',async({page,request})=>{
 await page.goto('/#skills');await page.getByRole('button',{name:'Viết chữ',exact:true}).click();
 const canvas=page.getByLabel('Ô luyện nét');
 async function draw(stroke:Stroke){
  const box=(await canvas.boundingBox())!;
  const x=(v:number)=>box.x+v*box.width/300,y=(v:number)=>box.y+v*box.height/300;
  await page.mouse.move(x(stroke[0][0]),y(stroke[0][1]));await page.mouse.down();
  for(const p of stroke.slice(1))await page.mouse.move(x(p[0]),y(p[1]),{steps:8});
  await page.mouse.up();
 }
 await draw([[255,150],[45,150]]);await expect(page.getByText(/Nét 1 chưa khớp/)).toBeVisible();
 expect((await(await request.get('/api/state')).json()).events).toHaveLength(0);
 await page.getByLabel('Chủ đề').selectOption('tw.information');await expect(page.getByRole('combobox',{name:'Chữ',exact:true})).toHaveValue('月');
 await page.getByRole('combobox',{name:'Chữ',exact:true}).selectOption('口');
 for(const stroke of strokeModels['口'])await draw(stroke);
 await expect(page.getByText('Đủ nét và đúng hướng theo mẫu. Không phải điểm thư pháp.')).toBeVisible();
 await expect.poll(async()=>(await(await request.get('/api/state')).json()).events.filter((e:any)=>e.kind==='stroke').map((e:any)=>e.item_id)).toEqual(['口']);
 await page.getByRole('combobox',{name:'Gợi ý',exact:true}).selectOption('memory');
 await expect(page.locator('.writing-pad svg path')).toHaveCount(1);
 await page.getByRole('button',{name:'Xem thứ tự nét',exact:true}).click();
 await expect(page.locator('.writing-pad svg path[stroke="#d88145"]')).toHaveCount(1);
 await page.screenshot({path:'test-results/handwriting.png'});
});
test('giọng Windows local thật tạo WAV cho câu mới, chặn mạng ngoài browser',async({page,request})=>{
 const status=await(await request.get('/api/status')).json();
 test.skip(!status.tts_voices.length,'Máy không có voice zh-TW native; không giả audio');
 await page.addInitScript(()=>{
  window.speechSynthesis.getVoices=()=>[];
  const original=URL.createObjectURL.bind(URL);
  URL.createObjectURL=blob=>{(window as any).__testTtsBlob=blob;return original(blob);};
  const NativeAudio=window.Audio;
  window.Audio=class extends NativeAudio{constructor(src?:string){super(src);(window as any).__testAudio=this;}};
 });
 const external:string[]=[];
 await page.route('**/*',route=>{const url=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(url.hostname)&&url.protocol!=='blob:'){external.push(url.href);return route.abort();}return route.continue();});
 await page.goto('/#settings');await page.getByLabel('Câu thử mới').fill('今天下午四點二十三分，我想在圖書館看書。');
 const response=page.waitForResponse(r=>r.url().endsWith('/api/ai/tts'));
 await page.getByRole('button',{name:'◖)) Nghe',exact:true}).click();const audio=await response;
 expect(audio.status()).toBe(200);
 await expect.poll(()=>page.evaluate(()=>(window as any).__testTtsBlob?.size||0)).toBeGreaterThan(10000);
 expect(await page.evaluate(async()=>String.fromCharCode(...new Uint8Array(await (window as any).__testTtsBlob.slice(0,4).arrayBuffer())))).toBe('RIFF');
 await expect.poll(()=>page.evaluate(()=>(window as any).__testAudio?.currentTime||0)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Dừng audio',exact:true}).click();expect(await page.evaluate(()=>(window as any).__testAudio.paused)).toBe(true);expect(external).toEqual([]);
});
test('nghe cạnh Hán tự/Pinyin gửi nguyên cụm; giữ kín đáp án và lưu cấu hình giọng',async({page,request})=>{
 // TEST speech API captures the exact utterance; it does not claim natural audio.
 await page.addInitScript(()=>{
  const voices=[{voiceURI:'TEST-a',name:'TEST Hanhan',lang:'zh-TW',localService:true},{voiceURI:'TEST-b',name:'TEST Yating',lang:'zh-TW',localService:true}];
  window.speechSynthesis.getVoices=()=>voices as SpeechSynthesisVoice[];
  (window as any).SpeechSynthesisUtterance=class {voice:unknown;lang='';rate=1;onend=(_event:Event)=>{};constructor(public text:string){}};
  (window as any).__utterances=[];
  window.speechSynthesis.speak=utterance=>{(window as any).__utterances.push({text:utterance.text,rate:utterance.rate,voice:utterance.voice?.voiceURI});setTimeout(()=>utterance.onend?.(new Event('end') as SpeechSynthesisEvent),0);};
 });
 await page.goto('/#settings');await page.getByRole('combobox',{name:'Giọng zh-TW local',exact:true}).selectOption('browser:TEST-b');
 await expect.poll(async()=>(await(await request.get('/api/state')).json()).objects.settings.speech.data.voice).toBe('browser:TEST-b');
 await page.goto('/');await page.getByRole('button',{name:'1 Khám phá từ mới'}).first().click();
 const word=page.locator('.word').first();await word.getByRole('button',{name:'Nghe Hán tự',exact:true}).click();
 await word.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();await word.getByRole('button',{name:'Nghe Pinyin',exact:true}).click();
 expect(await page.evaluate(()=>(window as any).__utterances)).toEqual([{text:'你好',rate:1,voice:'TEST-b'},{text:'你好',rate:1,voice:'TEST-b'}]);
 await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();await page.getByRole('button',{name:'Nghe câu hỏi'}).click();
 await expect(page.locator('.exercise')).not.toContainText('nǐ hǎo');
 expect((await(await request.get('/api/state')).json()).events).toHaveLength(0);
 await page.screenshot({path:'test-results/exercise-audio.png'});
 await page.goto('/#pronunciation');await expect(page.locator('.pronunciation-case')).toHaveCount(11);
 await page.getByRole('combobox',{name:'Nhịp đọc',exact:true}).selectOption('slow');
 await expect.poll(async()=>(await(await request.get('/api/state')).json()).objects.settings.speech.data.pace).toBe('slow');
 await page.getByRole('button',{name:'Nghe trong câu: grouping',exact:true}).click();
 expect(await page.evaluate(()=>(window as any).__utterances.at(-1))).toEqual({text:'我是越南人，我是留學生。',rate:.85,voice:'TEST-b'});
 await page.getByLabel('Nhận xét: grouping',{exact:true}).selectOption('choppy');
 await expect.poll(async()=>Object.values((await(await request.get('/api/state')).json()).objects.reports).filter((r:any)=>r.data.kind==='pronunciation-listening').length).toBe(1);
 await page.reload();await expect(page.getByText('1 nhận xét của bạn với cấu hình này')).toBeVisible();
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/pronunciation-mobile.png',fullPage:true});
});
test('chọn ASR cập nhật thông tin model, fixture TEST không đổi cấu hình máy thật',async({page,request})=>{
 const status=await(await request.get('/api/status')).json();status.config.asr_model='ggml-small.bin';status.available_asr_models=['ggml-base.bin','ggml-small.bin'];
 await page.route('**/api/status',r=>r.fulfill({json:status}));
 await page.route('**/api/ai/asr/config',r=>{status.config.asr_model=r.request().postDataJSON().model;status.asr='Whisper base đa ngôn ngữ (CPU)';return r.fulfill({json:status});});
 await page.goto('/#settings');await page.getByRole('combobox',{name:'Model nhận dạng',exact:true}).selectOption('ggml-base.bin');
 await expect(page.getByText('Whisper base đa ngôn ngữ (CPU)',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByRole('combobox',{name:'Model nhận dạng',exact:true})).toHaveValue('ggml-base.bin');
});
