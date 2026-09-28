import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs';
const headers={'X-Mandarin-Client':'local-ui'};
async function pinyinSpeechFixture(page:Page,finish=true){
 await page.addInitScript(finish=>{
  const w=window as any;w.__spoken=[];w.__cancelled=0;
  window.speechSynthesis.getVoices=()=>[{voiceURI:'TEST-pinyin',lang:'zh-TW',localService:true}] as SpeechSynthesisVoice[];
  w.SpeechSynthesisUtterance=class {rate=1;constructor(public text:string){}};
  window.speechSynthesis.cancel=()=>{w.__cancelled++;};
  window.speechSynthesis.speak=u=>{w.__spoken.push(u);if(finish)setTimeout(()=>u.onend?.({} as SpeechSynthesisEvent),0);};
 },finish);
}
test.beforeEach(async({request})=>{const backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];const pack=JSON.parse(fs.readFileSync('content/foundation.pack.json','utf8'));backup.packages=[{id:pack.content.id,version:pack.content.version,payload:JSON.stringify(pack)}];await request.post('/api/restore',{headers,data:backup});});
test('chuyển bài, cuối chủ đề, cuối lộ trình; reload và Back giữ đúng bài',async({page,request})=>{
 const c=await(await request.get('/api/content')).json();const all=c.units.flatMap((u:any)=>u.lessons);const run='TEST-ROUTES';
 for(const [index,phase] of [[0,'summary'],[1,'exercise'],[3,'summary'],[71,'summary']] as const)await request.post('/api/objects',{headers,data:{collection:'sessions',id:all[index].id,expected_version:0,data:{index:phase==='exercise'?2:0,phase,run,answers:[],draft:phase==='exercise'?'TEST draft':''}}});
 await page.goto('/#learn/'+all[0].id);await page.getByRole('button',{name:/Bài tiếp theo/}).click();await expect(page).toHaveURL(new RegExp(all[1].id));await expect(page.getByRole('textbox',{name:'Câu trả lời',exact:true})).toHaveValue('TEST draft');await page.reload();await expect(page.getByRole('textbox',{name:'Câu trả lời',exact:true})).toHaveValue('TEST draft');await page.goBack();await expect(page.getByText('Bạn đã đi hết bài học')).toBeVisible();
 await page.goto('/#learn/'+all[3].id);await page.getByRole('button',{name:/Sang chủ đề tiếp theo/}).click();await expect(page).toHaveURL(new RegExp(all[4].id));await expect(page.getByRole('button',{name:'Bắt đầu luyện tập'})).toBeVisible();
 await page.goto('/#learn/'+all[71].id);await expect(page.getByRole('link',{name:/đi hết lộ trình/})).toBeVisible();expect((await(await request.get('/api/state')).json()).events).toHaveLength(0);
});
test('nét cạnh từ, từng chữ, giảm chuyển động và không lộ bộ thủ trước đáp án',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});const blocked:string[]=[];await page.route('**/*',r=>{if(new URL(r.request().url()).hostname!=='127.0.0.1'){blocked.push(r.request().url());return r.abort();}return r.continue();});
 const c=await(await request.get('/api/content')).json();const l=c.units[0].lessons[0];await page.goto('/#learn/'+l.id);const word=page.getByRole('complementary',{name:'Nét chữ 你好',exact:true});await expect(word.getByRole('img')).toHaveAttribute('aria-label',/你/);await expect(word.getByRole('button',{name:'Tạm dừng',exact:true})).toHaveCount(0);await word.getByRole('button',{name:'好',exact:true}).click();await expect(word.getByRole('img')).toHaveAttribute('aria-label',/好/);await word.getByRole('button',{name:'Nét kế'}).click();await expect(word).toContainText('1/6 nét');await page.screenshot({path:'test-results/word-strokes.png',fullPage:false});
 await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();await expect(page.locator('.exercise .character-study')).toBeVisible();await expect(page.locator('.exercise')).not.toContainText('Bộ thủ tra cứu');await page.getByRole('button',{name:'Xem gợi ý'}).click();await expect(page.locator('.exercise')).toContainText('Bộ thủ tra cứu');await page.getByRole('button',{name:l.exercises[0].answers[0],exact:true}).click();await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await expect(page.getByText('Đúng rồi!',{exact:true})).toBeVisible();expect((await(await request.get('/api/state')).json()).events[0].assisted).toBe(true);expect(blocked).toEqual([]);
});
test('grid 406 âm: nghe đúng Hanzi, đổi thanh, phát lại, tìm kiếm và mobile',async({page,request})=>{
 await pinyinSpeechFixture(page);
 await request.post('/api/objects',{headers,data:{collection:'settings',id:'speech',expected_version:0,data:{voice:'browser:TEST-pinyin',pace:'slow'}}});
 await page.goto('/#pronunciation');await expect(page.getByRole('button',{name:/^Chọn âm /})).toHaveCount(406);
 const spoken=()=>page.evaluate(()=>(window as any).__spoken.map((u:any)=>u.text));
 expect(await spoken()).toEqual([]);
 await page.getByLabel('Tìm âm Pinyin').fill('ba');await page.getByLabel('Tìm âm Pinyin').fill('');expect(await spoken()).toEqual([]);
 await page.getByRole('button',{name:'Chọn âm ba',exact:true}).click();
 await expect.poll(spoken).toEqual(['八']);
 expect(await page.evaluate(()=>(window as any).__spoken[0].rate)).toBe(.85);
 expect(await page.evaluate(()=>(window as any).__spoken[0].voice.voiceURI)).toBe('TEST-pinyin');
 await page.getByRole('button',{name:'Thanh 3 · bǎ',exact:true}).click();
 await page.getByRole('button',{name:'Thanh 3 · bǎ',exact:true}).click();
 await page.getByRole('button',{name:'Nghe lại ví dụ',exact:true}).click();
 await expect.poll(spoken).toEqual(['八','把','把','把']);
 await expect(page.locator('.pinyin-lab select')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Nghe đánh vần',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Chọn âm nü',exact:true}).click();await page.getByRole('button',{name:/Thanh 3 · nǚ/}).click();await expect(page.locator('.syllable-result')).toHaveText('nǚ');
 await expect.poll(async()=>(await spoken()).at(-1)).toBe('女');
 await page.getByLabel('Nghe ngay khi chọn').uncheck();const count=(await spoken()).length;
 await page.getByRole('button',{name:'Chọn âm ju',exact:true}).click();await expect(page.locator('.pinyin-result')).toContainText('j + ü');
 await page.getByRole('button',{name:'Thanh nhẹ',exact:true}).click();await expect(page.locator('.pinyin-result')).toContainText('Thanh nhẹ');
 await page.getByLabel('Tìm âm Pinyin').fill('nv');await expect(page.getByRole('button',{name:/^Chọn âm /})).toHaveCount(2);
 expect((await spoken()).length).toBe(count);
 await expect(page.locator('.pronunciation-group')).toHaveCount(6);const bu=page.locator('.pronunciation-group').filter({has:page.locator('summary strong',{hasText:'不 · bù'})});await bu.locator('summary').click();await expect(bu.locator('.pronunciation-case')).toHaveCount(2);await expect(bu.getByRole('button',{name:'Nghe trong câu: bu-fourth'})).toBeVisible();
 await bu.getByRole('button',{name:'Nghe trong câu: bu-fourth'}).click();expect((await spoken()).length).toBe(count+1);
 const yi=page.locator('.pronunciation-group').filter({has:page.locator('summary strong',{hasText:'一 · yī'})});await yi.locator('summary').click();await expect(yi.locator('.pronunciation-case')).toHaveCount(4);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.pinyin-lab').screenshot({path:'test-results/pinyin-mobile.png'});
});

test('Pinyin: thiếu ví dụ, thanh nhẹ, lỗi và hủy lượt cũ khi đổi/dừng/rời trang',async({page})=>{
 await pinyinSpeechFixture(page,false);await page.goto('/#pronunciation');
 const lab=page.locator('.pinyin-lab');
 await page.getByRole('button',{name:'Chọn âm ba',exact:true}).click();
 await page.getByRole('button',{name:'Thanh 3 · bǎ',exact:true}).click();
 await page.evaluate(()=>{const w=window as any;w.__spoken[0].onerror({error:'TEST-stale'});});
 await expect(lab.getByRole('status')).toHaveText('Đang phát ví dụ…');await expect(lab.getByRole('alert')).toHaveCount(0);
 await page.getByRole('button',{name:'Dừng nghe Pinyin'}).click();
 await page.evaluate(()=>{(window as any).__spoken[1].onerror({error:'TEST-stopped'});});
 await expect(lab.getByRole('status')).toContainText('Đã dừng');await expect(lab.getByRole('alert')).toHaveCount(0);
 await page.getByRole('button',{name:'Thanh 2 · bá',exact:true}).click();
 await expect(lab).toContainText('Đây là thiếu dữ liệu');await expect(lab.getByRole('button',{name:'Nghe lại ví dụ'})).toBeDisabled();
 expect(await page.evaluate(()=>(window as any).__spoken.length)).toBe(2);
 await expect(page.getByRole('button',{name:'Thanh 2 · bá',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Thanh nhẹ',exact:true}).click();await expect(lab.locator('.pinyin-example')).toContainText('Phát cả cụm');
 expect(await page.evaluate(()=>(window as any).__spoken.at(-1).text)).toBe('爸爸');
 await page.evaluate(()=>(window as any).__spoken.at(-1).onerror({error:'TEST-device'}));await expect(lab.getByRole('alert')).toContainText('TEST-device');
 await page.getByRole('button',{name:'Nghe lại ví dụ'}).click();await expect(lab.getByRole('alert')).toHaveCount(0);
 const cancelled=await page.evaluate(()=>(window as any).__cancelled);
 await page.getByRole('button',{name:'Học',exact:true}).click();expect(await page.evaluate(()=>(window as any).__cancelled)).toBeGreaterThan(cancelled);
 await page.evaluate(()=>(window as any).__spoken.at(-1).onerror({error:'TEST-unmounted'}));await expect(page.getByText(/TEST-unmounted/)).toHaveCount(0);
 await page.route('**/api/ai/tts',r=>r.fulfill({status:503,contentType:'application/json',body:JSON.stringify({detail:'TEST: thiếu giọng zh-TW local'})}));
 await page.evaluate(()=>{window.speechSynthesis.getVoices=()=>[];});
 await page.getByRole('button',{name:'Phát âm',exact:true}).click();await page.getByRole('button',{name:'Chọn âm ba',exact:true}).click();
 await expect(page.locator('.pinyin-lab').getByRole('alert')).toContainText('thiếu giọng zh-TW');
});

test('Pinyin Windows zh-TW thật phát ba ví dụ, gồm ü và thanh nhẹ theo cụm',async({page,request})=>{
 const status=await(await request.get('/api/status')).json();test.skip(!status.tts_voices.length,'Không có giọng Windows zh-TW local');
 await request.post('/api/objects',{headers,data:{collection:'settings',id:'speech',expected_version:0,data:{voice:'native:'+status.tts_voices[0],pace:'slow'}}});
 await page.addInitScript(()=>{const Real=window.Audio;window.Audio=new Proxy(Real,{construct(Target,args){const a=new Target(...args as []);(window as any).__pinyinAudio=a;return a;}});});
 await page.goto('/#pronunciation');
 for(const [button,text] of [['Chọn âm ba','八'],['Thanh nhẹ','爸爸'],['Thanh 3 · nǚ','女']]){
  if(text==='女')await page.getByRole('button',{name:'Chọn âm nü',exact:true}).click();
  const response=page.waitForResponse(r=>r.url().endsWith('/api/ai/tts'));
  await page.getByRole('button',{name:button,exact:true}).click();const wav=await response;
  expect(wav.status()).toBe(200);expect(wav.request().postDataJSON()).toMatchObject({text,voice:status.tts_voices[0],rate:-2});
  await expect.poll(()=>page.evaluate(()=>(window as any).__pinyinAudio?.currentTime||0)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Dừng nghe Pinyin'}).click();expect(await page.evaluate(()=>(window as any).__pinyinAudio.paused)).toBe(true);
  await page.evaluate(()=>{(window as any).__pinyinAudio=null;});
 }
});

test('ngữ pháp: bài riêng, lưu tiếp tục, gợi ý, sổ lỗi và số bài học không bị tăng',async({page,request})=>{
 const c=await(await request.get('/api/content')).json();const g=c.units[0].grammar[0];await page.goto('/#grammar/'+g.id);await expect(page.locator('.grammar-example')).toHaveCount(3);await page.getByRole('button',{name:'Luyện ngữ pháp (4 câu)'}).click();
 const first=g.exercises[0];await page.getByRole('button',{name:first.choices.find((x:string)=>x!==first.answers[0]),exact:true}).click();await page.getByRole('button',{name:'Kiểm tra ngữ pháp',exact:true}).click();await expect(page.getByText('Cùng xem lại nhé')).toBeVisible();await page.getByRole('button',{name:'Tiếp tục ngữ pháp →'}).click();await page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'}).fill('TEST draft');await page.getByRole('button',{name:'Lưu & tạm dừng'}).click();await expect(page).toHaveURL(/#grammar$/);await page.goto('/#grammar/'+g.id);await expect(page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'})).toHaveValue('TEST draft');
 for(const ex of g.exercises.slice(1)){if(ex===g.exercises[1]){await page.getByRole('button',{name:'Gợi ý ngữ pháp'}).click();await expect(page.locator('.hint')).toBeVisible();await page.reload();await expect(page.locator('.hint')).toBeVisible();}await page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'}).fill(ex.answers[0]);await page.getByRole('button',{name:'Kiểm tra ngữ pháp',exact:true}).click();await page.getByRole('button',{name:'Tiếp tục ngữ pháp →'}).click();}
 await expect(page.getByText('Đã đi hết bài luyện ngữ pháp')).toBeVisible();await page.reload();await expect(page.getByText('Đã đi hết bài luyện ngữ pháp')).toBeVisible();const state=await(await request.get('/api/state')).json();expect(state.events).toHaveLength(4);expect(state.events.filter((e:any)=>e.assisted)).toHaveLength(1);expect(Object.keys(state.objects.cards)).toHaveLength(0);
 await page.goto('/#learn');await expect(page.getByText('0/72 bài đã học')).toBeVisible();await page.goto('/#review');await page.getByRole('button',{name:/Sổ lỗi sai/}).click();await expect(page.getByRole('heading',{name:first.prompt,exact:true})).toBeVisible();await page.goto('/#grammar');await page.getByLabel('Tiến độ ngữ pháp').selectOption('done');await expect(page.locator('.unit-grid article')).toHaveCount(1);await page.screenshot({path:'test-results/grammar-desktop.png'});
});
test('danh mục TBCL phân biệt bài đã soạn và tham chiếu chưa có bài',async({page})=>{
 await page.goto('/#grammar');await page.getByRole('button',{name:'Xem danh mục tham chiếu TBCL'}).click();await expect(page.locator('.roadmap-item')).toHaveCount(24);await expect(page.getByText(/496 kết quả tham chiếu/)).toBeVisible();await page.getByRole('button',{name:'Trang sau',exact:true}).click();await expect(page.getByText('2/21',{exact:true})).toBeVisible();await page.getByLabel('Mức học / cấp nguồn').selectOption('第5級');await expect(page.locator('.roadmap-item').first()).toContainText('第5級');await page.getByLabel('Tìm ngữ pháp',{exact:true}).fill('không tồn tại TEST');await expect(page.locator('.roadmap-item')).toHaveCount(0);
});

test('tiên quyết và lô ngữ pháp lọc theo nhóm, giữ cấp nguồn và dùng được trên mobile offline',async({page,request})=>{
 const c=await(await request.get('/api/content')).json();const blocked:string[]=[];
 await page.route('**/*',r=>{if(new URL(r.request().url()).hostname!=='127.0.0.1'){blocked.push(r.request().url());return r.abort();}return r.continue();});
 const g=c.units.flatMap((u:any)=>u.grammar).find((g:any)=>g.prerequisites.length);
 await page.goto('/#grammar/'+g.id);const prerequisite=page.getByRole('complementary',{name:'Kiến thức tiên quyết'});await prerequisite.getByRole('link').first().click();await expect(page).toHaveURL(new RegExp(g.prerequisites[0]));
 await page.goto('/#grammar');await page.getByLabel('Tiến độ ngữ pháp').selectOption('planned');
 const group='Thời–thể và bổ ngữ';await page.getByLabel('Nhóm kiến thức').selectOption(group);
 const expected=c.grammar_roadmap.filter((r:any)=>r.group===group);await expect(page.getByRole('status').filter({hasText:'kết quả tham chiếu'})).toContainText(expected.length+' kết quả');
 for(const text of await page.locator('.roadmap-item').allTextContents())expect(text).toContain(group);
 const batch=c.grammar_batches.find((b:any)=>b.group===group);await page.getByLabel('Lô biên soạn').selectOption(batch.id);
 await expect(page.locator('.roadmap-item')).toHaveCount(c.grammar_roadmap.filter((r:any)=>r.batch_id===batch.id).length);
 await expect(page.locator('.roadmap-batch')).toHaveCount(1);await page.locator('.roadmap-batch .actions button').first().click();
 await expect(page.getByLabel('Lô biên soạn')).toHaveValue(batch.prerequisites[0]);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/grammar-roadmap-mobile.png',fullPage:true});expect(blocked).toEqual([]);
 expect((await(await request.get('/api/state')).json()).events).toHaveLength(0);
});
