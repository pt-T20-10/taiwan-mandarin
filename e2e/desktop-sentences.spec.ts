import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const bank=JSON.parse(readFileSync('content/sentence-review.json','utf8'));

test('desktop sentence review uses real learned-word filtering and saves a draft',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'},backup=await(await request.get('/api/backup')).json();
 const words=[...new Set(bank.entries.filter((e:any)=>e.unit_id==='tw.greetings').flatMap((e:any)=>e.required_words))] as string[];
 backup.objects=words.map(hanzi=>({collection:'reports',id:'learned-word:'+Array.from(hanzi).map(c=>c.codePointAt(0)!.toString(16)).join('-'),version:1,deleted:0,payload:JSON.stringify({kind:'learned-word',learned:true,word:{hanzi,pinyin:'TEST',vi:'TEST'}})}));backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBeTruthy();
 await page.goto('/#learn/sentence-review/tw.greetings');
 await expect(page.getByRole('heading',{name:'Ôn câu',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Bắt đầu lượt mới'}).click();
 const input=page.getByRole('textbox',{name:'Câu trả lời',exact:true});await input.fill('bản nháp giữ lại');
 await expect.poll(async()=>{const s=await(await request.get('/api/state')).json();return s.objects.reports['sentence-review:v1:tw.greetings']?.data.value.run.draft;}).toBe('bản nháp giữ lại');
 await page.reload();await expect(input).toHaveValue('bản nháp giữ lại');
 await page.getByRole('button',{name:'Bỏ qua',exact:true}).click();await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
 await expect.poll(async()=>{const s=await(await request.get('/api/state')).json();return s.events.filter((e:any)=>e.algorithm==='sentence-review-v1').length;}).toBe(1);
 const s=await(await request.get('/api/state')).json();expect(s.objects.cards).toEqual({});expect(s.events[0].correct).toBeNull();
 await page.screenshot({path:'data/desktop-sentence-review.png',fullPage:true});
});
