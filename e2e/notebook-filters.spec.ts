import {test,expect} from '@playwright/test';
import {createEmptyCard} from 'ts-fsrs';
test('notebook marks existing cards, filters by direction, persists additions and preserves schedules',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBe(true);
 const content=await(await request.get('/api/content')).json(),word=content.units[0].words[0],next=content.units[0].words[1];
 const existing={word,word_id:'imported-word',direction:'recognize',schedule:createEmptyCard(),deck:'TEST',tags:[],suspended:true,source:'TEST'};
 expect((await request.post('/api/objects',{headers,data:{collection:'cards',id:'imported-test',expected_version:0,data:existing}})).ok()).toBe(true);
 const before=(await(await request.get('/api/state')).json()).objects.cards['imported-test'];
 await page.goto('/#notebook');
 const first=page.locator(`[data-word-id="${word.id}"]`),second=page.locator(`[data-word-id="${next.id}"]`);
 await expect(first.getByRole('button',{name:'✓ Đã thêm',exact:true})).toBeDisabled();
 await second.getByRole('button',{name:'＋ Thêm thẻ',exact:true}).click();await expect(second.getByRole('button',{name:'✓ Đã thêm',exact:true})).toBeDisabled();
 await page.reload();await expect(second.getByRole('button',{name:'✓ Đã thêm',exact:true})).toBeDisabled();
 await page.getByRole('combobox',{name:'Trạng thái thẻ',exact:true}).selectOption('added');await expect(page.locator('.notebook-word')).toHaveCount(2);
 await page.getByRole('combobox',{name:'Trạng thái thẻ',exact:true}).selectOption('missing');await expect(first).toHaveCount(0);await expect(second).toHaveCount(0);
 await page.getByRole('combobox',{name:'Hướng thẻ',exact:true}).selectOption('produce');await page.getByRole('combobox',{name:'Trạng thái thẻ',exact:true}).selectOption('added');await expect(page.locator('.notebook-word')).toHaveCount(0);
 await page.getByRole('combobox',{name:'Trạng thái thẻ',exact:true}).selectOption('all');await page.getByLabel('Tra từ',{exact:true}).fill(word.hanzi);
 await expect(first.getByText('Đã có 1 hướng khác',{exact:true})).toBeVisible();await first.getByRole('button',{name:'＋ Thêm thẻ',exact:true}).click();await expect(first.getByRole('button',{name:'✓ Đã thêm',exact:true})).toBeDisabled();
 const after=(await(await request.get('/api/state')).json()).objects.cards;
 expect(Object.values(after).filter((o:any)=>!o.deleted)).toHaveLength(3);expect(after['imported-test']).toEqual(before);
});
test('search and filter controls align on desktop and fit narrow screens across sections',async({page})=>{
 for(const route of ['notebook','grammar','grammar/verbs/topic/all/guide','learn/classifiers/tw.food','learn','settings','skills/tw.greetings/writing','chat']){
  await page.setViewportSize({width:1440,height:1000});await page.goto('/#'+route);await expect(page.locator('main h1').first()).toBeVisible();
  if(route==='notebook'){
   const boxes=await page.locator('.notebook-filters input,.notebook-filters select').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {y:r.y,height:r.height};}));
   expect(boxes).toHaveLength(3);expect(Math.max(...boxes.map(b=>b.y))-Math.min(...boxes.map(b=>b.y))).toBeLessThan(1);expect(boxes.every(b=>b.height===44)).toBe(true);
   await page.screenshot({path:'test-results/notebook-filters-desktop.png'});
  }
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' '+width).toBe(true);
   expect(await page.locator('main input:not([type=checkbox]):not([type=file]):not([type=range]),main select').evaluateAll(nodes=>nodes.filter(n=>n.getClientRects().length).every(n=>{const r=n.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.height>=44;})),route+' controls '+width).toBe(true);
  }
 }
});
