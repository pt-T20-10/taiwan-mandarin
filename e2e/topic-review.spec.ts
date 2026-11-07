import {test,expect} from '@playwright/test';
import {topicLanguageId,topicLanguageItems} from '../src/core/topicLanguage';
test('topic review unlocks after all parts, keeps 15 questions and drafts, finishes and creates fresh context',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBe(true);
 const content=await(await request.get('/api/content')).json(),unit=content.units.find((u:any)=>u.id==='tw.food');
 for(const u of content.units.slice(0,3)){
  for(const l of u.lessons)expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:l.id,expected_version:0,data:{phase:'summary',run:'TEST',index:10,answers:[],sequence_revision:1}}})).ok()).toBe(true);
  if(u.id!==unit.id)expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:topicLanguageId(u.id),expected_version:0,data:{scope:'topic-language',unit_id:u.id,revision:2,phase:'summary',index:1,answers:[]}}})).ok()).toBe(true);
 }
 await page.goto('/#learn');await expect(page.locator('[data-topic-review="tw.food"]')).toHaveCount(0);
 await page.goto('/#learn/topic-review/tw.food');await expect(page.getByText('Hoàn thành toàn bộ các phần học của chủ đề để mở lượt ôn vận dụng.')).toBeVisible();
 expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:topicLanguageId(unit.id),expected_version:0,data:{scope:'topic-language',unit_id:unit.id,revision:2,phase:'summary',index:1,answers:[],learned_item_ids:topicLanguageItems(content,unit.id).map(q=>q.id)}}})).ok()).toBe(true);
 const baseline=(await(await request.get('/api/state')).json()).objects.sessions;
 await page.goto('/#learn');await page.reload();await page.locator('[data-topic-review="tw.food"]').click();
 await page.getByRole('button',{name:'Bắt đầu ôn · 15 câu',exact:true}).click();
 await expect(page.locator('.exercise')).toBeVisible();
 const latest=async()=>Object.values((await(await request.get('/api/state')).json()).objects.sessions).filter((r:any)=>r.data.scope==='topic-review').map((r:any)=>r.data).sort((a:any,b:any)=>a.created_at.localeCompare(b.created_at)).at(-1) as any;
 const initial=await latest();expect(initial.packet.items).toHaveLength(15);
 let checkedHelp=false,checkedWrite=false;
 for(let i=0;i<15;i++){
  const run=await latest(),q=run.packet.items[run.index],exercise=page.locator('.exercise');
  await expect(exercise.getByText(`Câu ${i+1}/15`,{exact:true})).toBeVisible();
  if(q.kind==='cloze'){
   await expect(exercise.locator('.practice-text')).toHaveCount(0);
   await expect(exercise.locator('.answer-feedback')).toHaveCount(0);
   if(!checkedHelp){await exercise.getByRole('button',{name:'Hiện Pinyin',exact:true}).click();await expect(exercise.locator('.hint')).toHaveCount(0);await expect(exercise.locator('.answer-feedback')).toHaveCount(0);checkedHelp=true;}
  }
  const draft=q.kind==='writing'&&!checkedWrite?'我。':q.answers[0];if(q.kind==='writing')checkedWrite=true;
  if(q.choices.length)await exercise.locator('.choices').getByRole('button',{name:draft,exact:true}).click();else await exercise.getByRole('textbox').fill(draft);
  if(i===0){await expect.poll(async()=>(await latest()).draft).toBe(draft);await page.reload();await expect(page.locator('.exercise')).toBeVisible();expect((await latest()).packet).toEqual(initial.packet);if(!q.choices.length)await expect(page.getByRole('textbox')).toHaveValue(draft);}
  await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await expect(page.locator('.feedback')).toBeVisible();
  await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Đã hoàn thành bộ 15 câu',exact:true})).toBeVisible();
 const after=await(await request.get('/api/state')).json(),run=await latest();expect(run.answers).toHaveLength(15);expect(run.phase).toBe('summary');
 const events=after.events.filter((e:any)=>e.kind==='topic-review');expect(events).toHaveLength(15);expect(events.some((e:any)=>e.assisted)).toBe(true);expect(events.filter((e:any)=>e.skill==='writing'&&e.correct===null)).toHaveLength(1);
 for(const [id,record] of Object.entries(baseline))expect(after.objects.sessions[id]).toEqual(record);
 const evt=events[0];expect((await request.post('/api/events',{headers,data:{event:evt}})).ok()).toBe(true);expect((await(await request.get('/api/state')).json()).events.filter((e:any)=>e.kind==='topic-review')).toHaveLength(15);
 await page.getByRole('button',{name:'Bộ tiếp theo · 15 câu',exact:true}).click();await expect(page.locator('.exercise')).toBeVisible();const next=await latest();expect(next.packet.id).not.toBe(initial.packet.id);expect(next.packet.passage).not.toEqual(initial.packet.passage);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'data/topic-review-preview.png'});
 // Previously created sets must be quarantined without changing old answers
 // or allowing a cached client to submit another obsolete-model grade.
 const legacy={...next,run:'TEST-retired-review',created_at:new Date(Date.now()+1000).toISOString(),draft:'TEST preserved draft',packet:{...next.packet,id:'topic-review:v1:tw.food:TEST',revision:1,items:next.packet.items.map((q:any,i:number)=>({...q,id:'topic-review:v1:tw.food:TEST:'+i})),passage:next.packet.passage.map((line:any,i:number)=>i===3?{...line,hanzi:'你見面。',pinyin:'Nǐ jiànmiàn.',vi:'Câu mẫu cũ lỗi.'}:line)}};
 expect((await request.post('/api/objects',{headers,data:{collection:'sessions',id:'topic-review:'+legacy.run,expected_version:0,data:legacy}})).ok()).toBe(true);
 const rejected=await request.post('/api/events',{headers,data:{event:{...evt,id:'TEST retired event',action_key:'TEST retired event',item_id:legacy.packet.items[0].id}}});expect(rejected.status()).toBe(409);
 await page.reload();await expect(page.getByRole('heading',{name:'Bộ ôn này đã được thay thế',exact:true})).toBeVisible();
 await expect(page.getByText('你見面。',{exact:true})).toHaveCount(0);await expect(page.getByRole('textbox')).toHaveValue('TEST preserved draft');
 await page.getByRole('button',{name:'Bắt đầu bộ đã sửa · 15 câu',exact:true}).click();await expect(page.locator('.exercise')).toBeVisible();
 const final=await(await request.get('/api/state')).json();expect(Object.values(final.objects.sessions).filter((r:any)=>r.data.scope==='topic-review'&&r.data.packet.revision===2)).toHaveLength(3);expect(final.objects.sessions['topic-review:'+legacy.run].data).toEqual(legacy);
});
