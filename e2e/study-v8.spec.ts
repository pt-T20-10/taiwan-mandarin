import {test,expect} from '@playwright/test';
test('tra từ trong hội thoại, xem nét và đóng thẻ trên mobile',async({page})=>{
 await page.goto('/#learn/tw.transport.lesson.1');
 const cards=page.locator('.study-card-grid > .study-card');await expect(cards).toHaveCount(5);
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});
  expect(await cards.evaluateAll(nodes=>nodes.every(node=>{
   const r=node.getBoundingClientRect(),parent=node.parentElement!.getBoundingClientRect();
   return r.left>=parent.left-1&&r.right<=parent.right+1&&Array.from(node.children).every(child=>child.getBoundingClientRect().right<=r.right+1);
  }))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/#learn/tw.food.lesson.1');
 const word=page.getByRole('button',{name:'Tra từ 碗',exact:true}).first();
 await word.click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();await expect(dialog.locator('.pinyin')).toHaveText('wǎn');
 await expect(dialog.locator('.character-study')).toBeVisible();
 const marked=dialog.getByRole('button',{name:'Đã học ✓ · Bỏ đánh dấu',exact:true});
 if(await marked.count())await marked.click();
 const before=(await(await page.request.get('/api/state')).json());
 await dialog.getByRole('button',{name:'Đánh dấu đã học',exact:true}).click();await expect(marked).toHaveAttribute('aria-pressed','true');
 await dialog.getByRole('button',{name:'Đóng thẻ từ ×'}).click();await page.reload();
 await page.getByRole('button',{name:'Tra từ 碗',exact:true}).first().click();await expect(marked).toHaveAttribute('aria-pressed','true');
 const after=await(await page.request.get('/api/state')).json();
 expect(after.objects.cards).toEqual(before.objects.cards);expect(after.objects.sessions).toEqual(before.objects.sessions);expect(after.events).toEqual(before.events);
 await marked.click();await expect(dialog.getByRole('button',{name:'Đánh dấu đã học',exact:true})).toHaveAttribute('aria-pressed','false');
 await expect(dialog.getByRole('button',{name:'Luyện viết từ này'})).toHaveCount(0);
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await dialog.getByRole('button',{name:'Đóng thẻ từ ×'}).click();await expect(dialog).toHaveCount(0);
 await page.goto('/#learn/tw.numbers.lesson.3');
 await page.getByRole('button',{name:'Tra từ 號',exact:true}).first().click();
 await expect(dialog.locator('.character-parts')).toContainText('phải: 虎');
 await expect(dialog.locator('.character-parts')).toContainText('hổ · con hổ');
 await expect(dialog.locator('.character-parts')).not.toContainText('phải /');
 await expect(dialog.locator('.character-explanation > p').first()).toContainText('虍 — hổ');
 await dialog.getByRole('button',{name:'Đóng thẻ từ ×'}).click();
 await page.goto('/#skills/tw.food/stroke');
 await expect(page.getByRole('button',{name:'Viết chữ',exact:true})).toHaveCount(0);
 await expect(page.locator('.writing-surface,canvas')).toHaveCount(0);
});
test('gộp lỗi, sửa độc lập, tải lại và mở lại khi sai lần nữa',async({page,request})=>{
 const content=await(await request.get('/api/content')).json();
 const ex=content.units[0].lessons[0].exercises.find((e:any)=>e.kind==='pinyin');
 const wrong=async()=>{const id=crypto.randomUUID();const response=await request.post('/api/events',{headers:{'X-Mandarin-Client':'local-ui'},data:{event:{id,action_key:id,kind:'practice',skill:ex.skill,item_id:ex.id,answer:'wrong',correct:false,assisted:false,duration_ms:0,algorithm:'',timestamp:new Date().toISOString(),category:'v8-e2e'}}});expect(response.ok()).toBe(true);};
 await wrong();await wrong();await page.goto('/#review');
 await page.getByRole('button',{name:/Sổ lỗi sai/}).click();
 const card=page.locator('section.panel').filter({has:page.getByRole('heading',{name:ex.prompt,exact:true})});
 await card.getByRole('button',{name:'Luyện sửa',exact:true}).click();
 await card.getByLabel('Thử sửa câu trả lời').fill(ex.answers[0]);
 await card.getByRole('button',{name:'Kiểm tra bản sửa'}).click();await expect(card).toHaveCount(0);
 await page.reload();await page.getByRole('button',{name:/Sổ lỗi sai/}).click();await expect(card).toHaveCount(0);
 await page.getByRole('button',{name:/^Đã sửa/}).click();await expect(card).toHaveCount(1);
 await wrong();await page.reload();await page.getByRole('button',{name:/Sổ lỗi sai/}).click();await expect(card).toHaveCount(1);
});
