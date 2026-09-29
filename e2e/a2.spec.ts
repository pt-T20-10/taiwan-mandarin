import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const headers={'X-Mandarin-Client':'local-ui'};
test.beforeEach(async({request})=>{
 const backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 const pack=JSON.parse(fs.readFileSync('content/foundation.pack.json','utf8'));backup.packages=[{id:pack.content.id,version:pack.content.version,payload:JSON.stringify(pack)}];await request.post('/api/restore',{headers,data:backup});
});
test('12 mục A2: đủ bài luyện, lưu/gợi ý/sổ lỗi; không tạo thẻ hay hoàn thành lô B2',async({page,request})=>{
 test.setTimeout(90000);
 const c=await(await request.get('/api/content')).json(),grammars=c.units.slice(12).flatMap((u:any)=>u.grammar);
 await page.goto('/#grammar');await page.getByLabel('Mức học / cấp nguồn').selectOption('A2 · đời sống');await expect(page.locator('.unit-grid article')).toHaveCount(12);
 for(const [index,g] of grammars.entries()){
  await page.goto('/#grammar/'+g.id);await expect(page.locator('.grammar-example')).toHaveCount(3);await page.getByRole('button',{name:'Luyện ngữ pháp (4 câu)'}).click();
  for(const [i,ex] of g.exercises.entries()){
   if(index===0&&i===1){await page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'}).fill('TEST A2 draft');await page.getByRole('button',{name:'Gợi ý ngữ pháp'}).click();await page.getByRole('button',{name:'Lưu & tạm dừng'}).click();await expect(page).toHaveURL(/#grammar$/);await page.goto('/#grammar/'+g.id);await expect(page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'})).toHaveValue('TEST A2 draft');await expect(page.locator('.hint')).toBeVisible();}
   if(ex.choices.length)await page.getByRole('button',{name:index===0?ex.choices.find((s:string)=>s!==ex.answers[0]):ex.answers[0],exact:true}).click();
   else await page.getByRole('textbox',{name:'Câu trả lời ngữ pháp'}).fill(ex.answers[0]);
   await page.getByRole('button',{name:'Kiểm tra ngữ pháp',exact:true}).click();await page.getByRole('button',{name:'Tiếp tục ngữ pháp →'}).click();
  }
  await expect(page.getByText('Đã đi hết bài luyện ngữ pháp')).toBeVisible();
 }
 const state=await(await request.get('/api/state')).json();expect(state.events).toHaveLength(48);expect(state.events.filter((e:any)=>e.assisted)).toHaveLength(1);expect(Object.keys(state.objects.cards)).toHaveLength(0);
 await page.goto('/#review');await page.getByRole('button',{name:/Sổ lỗi sai/}).click();await expect(page.getByRole('heading',{name:grammars[0].exercises[0].prompt,exact:true})).toBeVisible();
 expect(c.grammar_roadmap.every((r:any)=>r.status==='planned')).toBe(true);
});
test('A2 trên mobile: nét chữ mới, tìm kiếm, chọn chủ đề và thống kê chưa học',async({page,request})=>{
 const c=await(await request.get('/api/content')).json(),u=c.units[12];await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});const requests:string[]=[];page.on('request',r=>{if(!['127.0.0.1','localhost'].includes(new URL(r.url()).hostname))requests.push(r.url());});
 await page.goto('/#learn/'+u.lessons[0].id);const word=page.getByRole('complementary',{name:'Nét chữ 身體',exact:true});await expect(word.getByRole('img')).toHaveAttribute('aria-label',/身/);await word.getByRole('button',{name:'體',exact:true}).click();await expect(word.getByRole('img')).toHaveAttribute('aria-label',/體/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/a2-mobile.png',fullPage:true});
 await page.goto('/#grammar');await page.getByLabel('Tìm ngữ pháp',{exact:true}).fill('得');await expect(page.locator('.unit-grid article').filter({hasText:'Cần phải'})).toHaveCount(1);
 await page.goto('/#learn');await expect(page.getByText('0/72 bài đã học')).toBeVisible();expect((await(await request.get('/api/state')).json()).events).toHaveLength(0);expect(requests).toEqual([]);
});
test('tiếp tục bản nháp đầu vào v5 trong lộ trình v6 và kết thúc sớm',async({page,request})=>{
 const c=await(await request.get('/api/content')).json();
 const answers=c.units.slice(0,11).flatMap((u:any)=>['vocabulary','grammar','reading'].map(skill=>({unit:u.id,correct:null,skill})));
 await request.post('/api/objects',{headers,data:{collection:'placement',id:'draft',expected_version:0,data:{index:33,answers}}});
 await page.goto('/#placement');await expect(page.getByText('Câu 34/54',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Chưa biết / bỏ qua',exact:true}).click();await expect(page.getByText('Câu 35/54',{exact:true})).toBeVisible();await page.reload();await expect(page.getByText('Câu 35/54',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Kết thúc sớm',exact:true}).click();await expect(page.getByRole('heading',{name:'Gợi ý vị trí bắt đầu'})).toBeVisible();
 const state=await(await request.get('/api/state')).json();expect(state.objects.placement.latest.data.answers.slice(0,33)).toEqual(answers);expect(state.objects.placement.latest.data.answers).toHaveLength(34);expect(state.objects.placement.latest.data.skipped).toEqual([]);expect(Object.keys(state.objects.cards)).toHaveLength(0);
});
