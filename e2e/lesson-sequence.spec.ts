import {test,expect} from '@playwright/test';
test('lesson dialogue, linked practice, interleaved review, reload and legacy session',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBe(true);
 const content=await(await request.get('/api/content')).json(),food=content.units.find((u:any)=>u.id==='tw.food'),id=food.lessons[2].id;
 for(const key of ['tw.food.lesson.1','tw.food.lesson.2','tw.greetings.lesson.1'])expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:key,expected_version:0,data:{phase:'summary',index:6,run:'TEST old',answers:[]}}})).ok()).toBe(true);
 const legacyId='tw.transport.lesson.3',legacy={phase:'exercise',index:0,run:'TEST legacy',answers:[],draft:'TEST kept',exercise_ids:content.units[4].lessons[2].legacy_exercise_ids};
 expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:legacyId,expected_version:0,data:legacy}})).ok()).toBe(true);
 await page.goto('/#learn/'+id);
 const dialogue=page.locator('section').filter({has:page.getByRole('heading',{name:'Một cuộc trò chuyện ngắn'})});
 await expect(dialogue).toContainText('晚餐要吃什麼');await expect(dialogue).toContainText('我要看菜單');
 await expect(dialogue).toContainText('Người A');await expect(dialogue).not.toContainText('你好，我要一碗麵');
 await page.getByRole('button',{name:'Bắt đầu luyện tập →',exact:true}).click();
 let saved=(await(await request.get('/api/state')).json()).objects.sessions[id].data;
 expect(saved.exercise_ids).toHaveLength(13);expect(Object.keys(saved.review_labels)).toHaveLength(3);
 const frozen=saved.exercise_snapshot;
 await page.reload();expect((await(await request.get('/api/state')).json()).objects.sessions[id].data.exercise_snapshot).toEqual(frozen);
 for(let index=0;index<frozen.length;index++){
  const q=frozen[index];
  if(q.kind==='cloze')await expect(page.getByText(q.stimulus.hanzi,{exact:true})).toHaveCount(0);
  if(q.choices.length)await page.locator('.choices').getByRole('button',{name:q.answers[0],exact:true}).click();
  else await page.getByRole('textbox',{name:'Câu trả lời',exact:true}).fill(q.answers[0]);
  if(index===1){await page.getByRole('button',{name:'Lưu & tạm dừng',exact:true}).click();await expect(page).toHaveURL(/#learn$/);await page.goto('/#learn/'+id);await expect(page.getByRole('textbox',{name:'Câu trả lời',exact:true})).toHaveValue(q.answers[0]);}
  await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Đúng rồi!',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Bạn đã đi hết bài học'})).toBeVisible();
 saved=(await(await request.get('/api/state')).json()).objects.sessions[id].data;expect(saved.answers).toHaveLength(13);
 await page.goto('/#learn/'+legacyId);await expect(page.getByRole('textbox',{name:'Câu trả lời',exact:true})).toHaveValue('TEST kept');
 expect((await(await request.get('/api/state')).json()).objects.sessions[legacyId].data).toEqual(legacy);
 await page.setViewportSize({width:390,height:844});await page.goto('/#learn/tw.food.lesson.4');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
