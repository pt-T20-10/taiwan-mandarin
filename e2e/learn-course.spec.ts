import {test,expect} from '@playwright/test';
test('PC course shows 90 lessons and completes a real sentence round with compact controls',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBe(true);
 await page.setViewportSize({width:1536,height:1000});
 let gradeFailure=true;
 await page.route('**/api/learn/grade',r=>{
  if(gradeFailure){gradeFailure=false;return r.fulfill({status:503,json:{detail:'TEST: model tạm bận, thử lại.'}});}
  const b=r.request().postDataJSON();
  return r.fulfill({json:{correct:b.answer!=='Bản dịch khác',feedback:b.answer==='Bản dịch khác'?'Câu này chưa diễn đạt nội dung đề.':'Cách diễn đạt phù hợp.',grader:'local-ai'}});
 });
 await page.addInitScript(()=>{Object.defineProperty(window.speechSynthesis,'getVoices',{value:()=>[]});});
 const spoken:string[]=[];
 // A short silent WAV verifies playback/control flow, not voice quality.
 const wav=Buffer.alloc(1644);wav.write('RIFF');wav.writeUInt32LE(1636,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(1600,40);
 await page.route('**/api/ai/tts',r=>{spoken.push(r.request().postDataJSON().text);return r.fulfill({status:200,contentType:'audio/wav',body:wav});});
 await page.goto('/#learn');await expect(page.locator('.lesson-list button')).toHaveCount(90);
 const cards=page.locator('.course-overview .unit-card');
 const first=await cards.nth(0).boundingBox(),second=await cards.nth(1).boundingBox();
 expect(second!.y).toBe(first!.y);expect(second!.x).toBeGreaterThan(first!.x);
 await page.screenshot({path:'data/learn-course-overview-v2.png',fullPage:true});
 await page.locator('.lesson-list button').first().click();
 await expect(page.locator('.lesson-vocabulary .study-card')).toHaveCount(7);
 await expect(page.locator('.lesson-vocabulary').getByRole('button',{name:'Đánh dấu'})).toHaveCount(0);
 await expect(page.locator('.lesson-vocabulary .stroke-controls')).toHaveCount(0);
 await page.locator('.lesson-vocabulary .study-card').filter({has:page.getByRole('heading',{name:'你好',exact:true})}).getByRole('button',{name:'好',exact:true}).click();
 const parts=page.locator('.lesson-vocabulary .study-card').filter({has:page.getByRole('heading',{name:'你好',exact:true})}).locator('.character-study p');
 await expect(parts).toContainText('女');await expect(parts).toContainText('子');
 await page.screenshot({path:'data/learn-course-intro.png',fullPage:true});
 await page.getByRole('button',{name:'Bắt đầu · 15 câu'}).click();
 await expect(page.locator('.choices .learn-option')).toHaveCount(4);
 const read=async()=>{const s=await(await request.get('/api/state')).json();return Object.values(s.objects.sessions).find((r:any)=>!r.deleted&&r.data.scope==='learn-course') as any;};
 let kinds=new Set<string>();
 for(let i=0;i<15;i++){
  const row=await read(),q=row.data.tasks[i];kinds.add(q.mode);
  if(i===0){await expect(page.locator('.choices .learn-option')).toHaveCount(4);await expect(page.locator('.choices').getByRole('button',{name:'Nghe Hán tự'})).toHaveCount(0);
   const sizes=await page.evaluate(()=>['.exercise>h2','.course-prompt .word-token','.choices button'].map(s=>parseFloat(getComputedStyle(document.querySelector(s)!).fontSize)));
   expect(sizes[1]).toBeGreaterThan(sizes[0]);expect(sizes[2]).toBeGreaterThan(sizes[0]);
   await page.screenshot({path:'data/learn-course-exercise-v2.png',fullPage:true});
  }
  if(q.mode==='listen'){
   await page.getByRole('button',{name:'🔊 Nghe câu',exact:true}).click();
   await expect(page.getByText('Đã nghe',{exact:true})).toBeVisible();expect(spoken).toContain(q.entry.hanzi);
   await page.locator('.choices').getByRole('button',{name:q.answer,exact:true}).click();
   await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
  }
  else {
   if(q.choices.length){
    if(q.mode==='to_zh'){await page.locator('.choices').getByRole('button',{name:q.answer,exact:true}).hover();await expect(page.locator('.option-pinyin').first()).toBeVisible();}
    await page.locator('.choices').getByRole('button',{name:q.answer,exact:true}).click();
   }else{
    await page.getByRole('textbox',{name:'Câu trả lời'}).fill(q.mode==='to_vi'?'Bản dịch khác':q.answer);
    if(q.mode==='gap'){await page.reload();await expect(page.getByRole('textbox',{name:'Câu trả lời'})).toHaveValue(q.answer);}
   }
   await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
   if(!q.choices.length&&i===3){await expect(page.getByRole('alert')).toContainText('TEST: model');await expect(page.getByRole('textbox',{name:'Câu trả lời'})).toHaveValue(q.answer);await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();}
  }
  await expect(page.locator(q.mode==='to_vi'?'.grade-incorrect':'.grade-correct')).toBeVisible();
  if(i===3)await page.screenshot({path:'data/learn-grade-correct.png',fullPage:true});
  if(q.mode==='to_vi'){await page.reload();await expect(page.locator('.grade-incorrect')).toContainText('Câu này chưa diễn đạt nội dung đề.');if(i===6)await page.screenshot({path:'data/learn-grade-incorrect.png',fullPage:true});}
  await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
 }
 expect(kinds.size).toBe(5);await expect(page.getByRole('heading',{name:'Đã hoàn thành bài'})).toBeVisible();
 const course=await(await request.get('/api/learn/course')).json();expect(course.knowledge.words).toEqual(expect.arrayContaining(course.units[0].lessons[0].words.map((w:any)=>w.hanzi)));
 await page.screenshot({path:'data/learn-course-summary.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const state=await(await request.get('/api/state')).json();expect(Object.keys(state.objects.cards)).toHaveLength(0);
});
