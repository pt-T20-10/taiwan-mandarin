import {topicLanguageItems} from '../src/core/topicLanguage';
import {test,expect} from '@playwright/test';

test('topic links, introductions and supplementary banks stay scoped to the selected topic',async({page,request})=>{
 const content=await(await request.get('/api/content')).json();
 await page.goto('/#learn');
 for(const unit of content.units){
  const card=page.locator('.unit-card').filter({has:page.getByRole('heading',{name:unit.title,exact:true})});
  const hasNew=topicLanguageItems(content,unit.id).length>0;
  await expect(card.locator('[data-topic-language]')).toHaveCount(hasNew?1:0);
 }
 for(const topic of [
  {id:'tw.numbers',verbs:['sleep','work','class','meeting','leave','run'],classifiers:['cup','book','ticket']},
  {id:'tw.food',verbs:['treat','queue','help','chat','work','part-time'],classifiers:['cup','bottle','bowl','meal']},
  {id:'tw.transport',verbs:['queue','school','work','meet','move','help'],classifiers:['ticket','car']},
 ]){
  const unit=content.units.find((u:any)=>u.id===topic.id);
  await page.goto('/#grammar/verbs/topic/'+topic.id);
  await expect(page).toHaveURL(new RegExp('#grammar/verbs/topic/'+topic.id+'$'));
  await expect(page.getByRole('heading',{name:'Động từ · '+unit.title,exact:true})).toBeVisible();
  await expect(page.getByLabel('Chủ đề động từ')).toHaveValue(topic.id);
  await expect(page.locator('a[href^="#grammar/verbs/lesson/"]')).toHaveCount(0);
  expect(await page.locator('[data-verb-id]').evaluateAll(rows=>rows.map(r=>r.getAttribute('data-verb-id')))).toEqual(topic.verbs);
  await page.goto('/#learn/classifiers/'+topic.id);
  await expect(page.getByRole('heading',{name:'Lượng từ · '+unit.title,exact:true})).toBeVisible();
  await expect(page.getByLabel('Chủ đề lượng từ')).toHaveValue(topic.id);
  expect(await page.locator('[data-classifier-id]').evaluateAll(rows=>rows.map(r=>r.getAttribute('data-classifier-id')))).toEqual(topic.classifiers);
  const known=page.locator('section').filter({has:page.getByRole('heading',{name:'Từ cần biết',exact:true})});
  await expect(known.locator('.study-card')).toHaveCount(topic.classifiers.length);
 }
 // Changing topic resets the previous topic's search and updates the introduction too.
 await page.getByLabel('Tìm lượng từ, ví dụ hoặc nghĩa').fill('no-match');
 await page.getByLabel('Chủ đề lượng từ').selectOption('tw.food');
 await expect(page.getByLabel('Tìm lượng từ, ví dụ hoặc nghĩa')).toHaveValue('');
 await expect(page.locator('[data-classifier-id]')).toHaveCount(4);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
