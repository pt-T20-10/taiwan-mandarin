import {test,expect} from '@playwright/test';
import {topicLanguageId,topicLanguageItems} from '../src/core/topicLanguage';
test('question, choice and answer Pinyin toggles do not select or expose a missing answer',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBe(true);
 const content=await(await request.get('/api/content')).json(),lesson=content.units[2].lessons[1],q=lesson.exercises.find((e:any)=>e.id.endsWith('extra9'));
 const extraId=topicLanguageId(content.units[0].id),extra=topicLanguageItems(content,content.units[0].id)[0];
 for(const [id,data] of [[lesson.id,{phase:'exercise',run:'TEST question reading',index:0,answers:[],exercise_ids:[q.id]}],[extraId,{scope:'topic-language',unit_id:content.units[0].id,revision:2,run:'TEST topic reading',phase:'exercise',index:0,answers:[],items:[extra]}]]){
  expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id,expected_version:0,data}})).ok()).toBe(true);
 }
 await page.addInitScript(()=>{window.speechSynthesis.getVoices=()=>[];});
 let spoken='';await page.route('**/api/ai/tts',async route=>{spoken=route.request().postDataJSON().text;await route.fulfill({status:503,json:{detail:'TEST audio request captured'}});});
 await page.goto('/#learn/'+lesson.id);
 const question=page.locator('.exercise>.question-reading');
 await question.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();
 await expect(question.locator('.pinyin')).toContainText('wǒmen yào qù');
 await expect(question.locator('.pinyin')).toContainText('___');
 await expect(question.locator('.pinyin')).not.toContainText('miàn');
 await question.getByRole('button',{name:'Ẩn Pinyin',exact:true}).click();await expect(question.locator('.pinyin')).toHaveCount(0);
 const choice=page.locator('.choice-with-reading').filter({has:page.getByRole('button',{name:'麵店',exact:true})});
 await choice.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();await expect(choice.locator('.pinyin')).toContainText('miàn');
 await choice.getByRole('button',{name:'Nghe Hán tự',exact:true}).click();await expect.poll(()=>spoken).toBe('麵店');
 await expect(page.locator('.choices button.selected')).toHaveCount(0);
 await page.reload();await expect(question.locator('.pinyin')).toHaveCount(0);
 expect((await(await request.get('/api/state')).json()).objects.sessions[lesson.id].data.assisted).toBe(true);
 await page.locator('.choices').getByRole('button',{name:'麵店',exact:true}).click();await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
 const answer=page.locator('.feedback>.question-reading').first();
 await answer.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();await expect(answer.locator('.pinyin')).toContainText('miàn');
 await answer.getByRole('button',{name:'Ẩn Pinyin',exact:true}).click();await expect(answer.locator('.pinyin')).toHaveCount(0);
 const saved=(await(await request.get('/api/state')).json()).objects.sessions[lesson.id].data;expect(saved.answers[0].assisted).toBe(true);
 await page.goto('/#learn/topic-language/'+content.units[0].id);
 const topic=page.locator('.panel>.question-reading').first();
 await topic.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();
 await expect(page.getByText(extra.answer,{exact:true})).toHaveCount(0);
 expect((await(await request.get('/api/state')).json()).objects.sessions[extraId].data.assisted).toBe(true);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
