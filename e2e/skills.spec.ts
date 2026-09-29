import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const pack=JSON.parse(fs.readFileSync('content/foundation.pack.json','utf8')),unit=pack.content.units[0],headers={'X-Mandarin-Client':'local-ui'};
test.beforeEach(async({request})=>{const b=await(await request.get('/api/backup')).json();b.objects=[];b.events=[];b.packages=[{id:pack.content.id,version:7,payload:JSON.stringify(pack)}];expect((await request.post('/api/restore',{headers,data:b})).ok()).toBe(true);});
async function inject(request:any,skill:string,index=0){
 const packet=unit.practice_sets.find((p:any)=>p.skill===skill),run='TEST-'+skill;
 const data={scope:'skills',unit_id:unit.id,skill,packet,run,index,phase:'exercise',answers:[],draft:'',assisted:false,cycle:1,created_at:'2026-09-29T00:00:00Z'};
 expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:'skills:'+run,expected_version:0,data}})).ok()).toBe(true);return data;
}
test('Đọc: bật/tắt trợ giúp, bản nháp qua reload, điền từ không lộ và giữ lịch ôn',async({page,request})=>{
 const seed=await inject(request,'reading');await page.goto('/#skills/'+unit.id+'/reading');
 const lab=page.locator('.skill-practice'),question=page.locator('.practice-question');
 await expect(question.locator('.pinyin')).toHaveCount(0);await expect(question.locator('.vi')).toHaveCount(0);
 await question.getByRole('button',{name:'Hiện Pinyin',exact:true}).first().click();await expect(question.locator('.pinyin')).toHaveCount(1);
 await question.getByRole('button',{name:'Ẩn Pinyin',exact:true}).first().click();await expect(question.locator('.pinyin')).toHaveCount(0);
 await question.getByRole('button',{name:'Hiện tiếng Việt cả đoạn'}).click();await expect(question.locator('.vi')).toHaveCount(8);
 await question.getByRole('button',{name:'Ẩn tiếng Việt cả đoạn'}).click();await expect(question.locator('.vi')).toHaveCount(0);await expect(question.locator('.hint')).toHaveCount(0);
 await question.getByRole('button',{name:seed.packet.items[0].answers[0],exact:true}).click();await expect(lab.getByRole('status')).toHaveText('Đã lưu.');await page.reload();
 await expect(question.locator('.choices .selected')).toHaveText(seed.packet.items[0].answers[0]);await question.getByRole('button',{name:'Kiểm tra',exact:true}).click();await lab.getByRole('button',{name:'Tiếp tục →',exact:true}).click();
 for(let i=1;i<6;i++){await question.getByRole('button',{name:'Bỏ qua câu này'}).click();await lab.getByRole('button',{name:'Tiếp tục →',exact:true}).click();}
 await expect(question.locator('.practice-text')).toHaveCount(0);await expect(question.getByRole('button',{name:/Nghe/})).toHaveCount(0);
 for(let i=6;i<10;i++){const q=seed.packet.items[i];if(q.choices.length)await question.getByRole('button',{name:q.answers[0],exact:true}).click();else await question.getByRole('textbox').fill(q.answers[0]);await question.getByRole('button',{name:'Kiểm tra',exact:true}).click();await lab.getByRole('button',{name:'Tiếp tục →',exact:true}).click();}
 await expect(lab.getByText('Đã hoàn thành bộ luyện')).toBeVisible();const state=await(await request.get('/api/state')).json();expect(state.events).toHaveLength(10);expect(state.events[0].assisted).toBe(true);expect(Object.keys(state.objects.cards)).toHaveLength(0);
});
test('Bộ mới: ba bộ không lặp, lưu bài đang dở, resume và mobile',async({page,request})=>{
 await page.goto('/#skills/'+unit.id+'/writing');const lab=page.locator('.skill-practice');
 const ids:string[]=[];for(let i=0;i<4;i++){
  await lab.getByRole('button',{name:'Bộ đề mới',exact:true}).click();await expect(lab.getByRole('button',{name:'Bộ đề mới',exact:true})).toBeEnabled();
  await lab.getByRole('textbox').fill('Bản nháp '+i);await expect(lab.getByRole('status')).toHaveText('Đã lưu.');
  const state=await(await request.get('/api/state')).json(),sessions=Object.values(state.objects.sessions).map((s:any)=>s.data).sort((a:any,b:any)=>a.created_at.localeCompare(b.created_at)) as any[];ids.push(sessions.at(-1).packet.id);
 }
 expect(new Set(ids.slice(0,3)).size).toBe(3);expect(ids[3]).not.toBe(ids[2]);await expect(lab).toContainText('bắt đầu vòng mới');
 await page.getByRole('button',{name:'Đọc',exact:true}).click();await page.getByRole('button',{name:'Viết diễn đạt',exact:true}).click();await expect(lab.getByRole('textbox')).toHaveValue('Bản nháp 3');
 await page.reload();await expect(lab.getByRole('textbox')).toHaveValue('Bản nháp 3');await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await lab.screenshot({path:'test-results/skills-mobile.png'});
 await lab.getByRole('button',{name:'Lưu bài viết',exact:true}).click();await lab.getByRole('button',{name:'Tiếp tục →',exact:true}).click();await lab.getByRole('textbox').fill('這是我的練習。');await lab.getByRole('button',{name:'Lưu bài viết',exact:true}).click();await lab.getByRole('button',{name:'Tiếp tục →',exact:true}).click();await expect(lab).toContainText('Đã hoàn thành bộ luyện');
 const state=await(await request.get('/api/state')).json();expect(state.events.every((e:any)=>e.correct===null)).toBe(true);expect(Object.values(state.objects.sessions).filter((s:any)=>s.data.phase!=='summary')).toHaveLength(3);
 await lab.getByText(/Bài đang dở và lịch sử/).click();await lab.locator('details button').last().click();await expect(lab.getByRole('textbox')).toHaveValue('Bản nháp 0');
});
test('Nghe/Nói: transcript là trợ giúp, câu mẫu bật/tắt, tự xác nhận và bỏ qua',async({page,request})=>{
 const listening=await inject(request,'listening');await inject(request,'speaking');await page.goto('/#skills/'+unit.id+'/listening');const lab=page.locator('.skill-practice');await expect(lab.locator('.practice-text')).toHaveCount(0);
 await lab.getByRole('button',{name:'Hiện transcript',exact:true}).click();await expect(lab.locator('.practice-text')).toBeVisible();await lab.getByRole('button',{name:'Ẩn transcript',exact:true}).click();await expect(lab.locator('.practice-text')).toHaveCount(0);
 for(const q of listening.packet.items){if(q.choices.length)await lab.getByRole('button',{name:q.answers[0],exact:true}).click();else await lab.getByRole('textbox').fill(q.answers[0]);await lab.getByRole('button',{name:'Kiểm tra',exact:true}).click();await lab.getByRole('button',{name:'Tiếp tục →'}).click();}
 await expect(lab).toContainText('Đã hoàn thành bộ luyện');
 await page.getByRole('button',{name:'Nói',exact:true}).click();await expect(lab.locator('.pinyin')).toHaveCount(0);await lab.getByRole('button',{name:'Hiện tiếng Việt',exact:true}).click();await lab.getByRole('button',{name:'Ẩn tiếng Việt',exact:true}).click();
 await lab.getByRole('button',{name:'Tôi đã luyện câu này'}).click();await lab.getByRole('button',{name:'Tiếp tục →'}).click();for(let i=1;i<8;i++){await lab.getByRole('button',{name:'Bỏ qua câu này'}).click();await lab.getByRole('button',{name:'Tiếp tục →'}).click();}
 await expect(lab).toContainText('Đã hoàn thành bộ luyện');const state=await(await request.get('/api/state')).json();expect(state.events).toHaveLength(18);expect(state.events.filter((e:any)=>e.skill==='speaking').every((e:any)=>e.correct===null)).toBe(true);
});
test('AI: bộ hoàn chỉnh mới được mở, điểm tách riêng, lỗi giữ bộ cũ và điều hướng hủy',async({page,request})=>{
 const seed=await inject(request,'reading');const packet={...seed.packet,id:'ai.TEST',source:'ai',title:'TEST bộ AI'};
 await page.route('**/api/ai/practice',r=>r.fulfill({json:{status:'running'}}));await page.route('**/api/ai/practice/*',r=>r.fulfill({json:{status:'done',packet}}));
 await page.goto('/#skills/'+unit.id+'/reading');const lab=page.locator('.skill-practice');await lab.getByRole('button',{name:'Tạo đề bằng AI'}).click();await expect(lab).toContainText('TEST bộ AI');await expect(lab).toContainText('Chưa kiểm chứng');
 const state=await(await request.get('/api/state')).json();const aiSession=(Object.values(state.objects.sessions) as any[]).find(s=>s.data.packet.source==='ai').data;const q=aiSession.packet.items[0];
 if(q.choices.length)await lab.getByRole('button',{name:q.answers[0],exact:true}).click();else await lab.getByRole('textbox').fill(q.answers[0]);await lab.getByRole('button',{name:'Kiểm tra',exact:true}).click();
 const event=(await(await request.get('/api/state')).json()).events[0];expect(event.source).toBe('ai');expect(event.correct).toBeNull();
 await lab.getByRole('button',{name:'Tiếp tục →'}).click();await page.route('**/api/ai/practice/*',r=>r.fulfill({json:{status:'error',error:'TEST đề không hợp lệ'}}));await lab.getByRole('button',{name:'Tạo đề bằng AI'}).click();await expect(page.getByText('TEST đề không hợp lệ',{exact:true})).toBeVisible();await expect(lab).toContainText('TEST bộ AI');
 await page.route('**/api/ai/practice/*',r=>r.fulfill({json:{status:'running',progress:'TEST đang tạo'}}));let cancelled=0;await page.route('**/api/ai/cancel/*',r=>{cancelled++;return r.fulfill({json:{cancelled:true}});});
 await lab.getByRole('button',{name:'Tạo đề bằng AI'}).click();await expect(lab).toContainText('TEST đang tạo');await page.getByRole('button',{name:'Thống kê',exact:true}).click();await expect.poll(()=>cancelled).toBeGreaterThan(0);await expect(page.locator('main')).toContainText('1 lượt luyện đề AI');
});
test('v6 đang dở dùng sáu câu cũ; học lại mở mười câu v7 và giữ hoàn thành',async({page,request})=>{
 const lesson=unit.lessons[0];await request.post('/api/objects',{headers,data:{collection:'sessions',id:lesson.id,expected_version:0,data:{phase:'exercise',index:5,answers:[],run:'v6',draft:lesson.exercises[5].answers[0],retry:[]}}});
 await page.goto('/#learn/'+lesson.id);await expect(page.locator('.exercise .section-title')).toContainText('6/6');await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();await expect(page.getByText('Bạn đã đi hết bài học')).toBeVisible();await page.reload();await expect(page.getByText('Bạn đã đi hết bài học')).toBeVisible();
 await page.getByRole('button',{name:'Học lại',exact:true}).click();await page.getByRole('button',{name:'Bắt đầu luyện tập'}).click();await expect(page.locator('.exercise .section-title')).toContainText('1/10');
});
