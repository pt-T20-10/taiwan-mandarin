import {test,expect} from '@playwright/test';

test('speaking entry points and recording stay hidden, including old speaking links',async({page,request})=>{
 for(const route of ['skills/tw.greetings/speaking','learn/classifiers/tw.food/speaking','grammar/verbs/topic/all/speaking','chat','settings','learn/tw.greetings.lesson.1']){
  await page.goto('/#'+route);
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('a[href$="/speaking"]')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Nói',exact:true})).toHaveCount(0);
  await expect(page.locator('.recorder')).toHaveCount(0);
 }
 const content=await(await request.get('/api/content')).json();
 const lesson=content.units[0].lessons.find((l:any)=>l.exercises.some((e:any)=>e.kind==='speaking'));
 if(!lesson)throw new Error('Expected a lesson with a speaking exercise');
 const index=lesson.exercises.findIndex((e:any)=>e.kind==='speaking');
 const data={index,phase:'exercise',run:crypto.randomUUID(),answers:[],exercise_ids:lesson.exercises.map((e:any)=>e.id),draft:'TEST saved speaking draft'};
 const state=await(await request.get('/api/state')).json();
 expect((await request.post('/api/objects',{headers:{'X-Mandarin-Client':'local-ui'},data:{collection:'sessions',id:lesson.id,expected_version:state.objects.sessions[lesson.id]?.version||0,data}})).ok()).toBe(true);
 await page.goto('/#learn/'+lesson.id);await page.reload();
 await expect(page.getByRole('heading',{name:'Luyện nói tạm ẩn'})).toBeVisible();
 await expect(page.locator('.recorder')).toHaveCount(0);
 await page.getByRole('button',{name:'Tiếp tục bài học',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Luyện nói tạm ẩn'})).toHaveCount(0);
 const after=(await(await request.get('/api/state')).json()).objects.sessions[lesson.id].data;
 expect(after.paused_speaking[0].draft).toBe(data.draft);
 expect(after.answers).toEqual([]);
});
