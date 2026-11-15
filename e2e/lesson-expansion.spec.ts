import {test,expect} from '@playwright/test';

test('new application questions preserve drafts, assistance and old progress',async({page,request})=>{
 const headers={'X-Mandarin-Client':'local-ui'};
 const backup=await(await request.get('/api/backup')).json();backup.objects=[];backup.events=[];
 expect((await request.post('/api/restore',{headers,data:backup})).ok()).toBeTruthy();
 const old={collection:'sessions',id:'tw.numbers.lesson.1',expected_version:0,data:{phase:'summary',index:0,answers:[],run:'old-lesson'}};
 expect((await request.post('/api/objects',{headers,data:old})).ok()).toBeTruthy();
 const initial=await(await request.get('/api/state')).json();
 await page.goto('/#learn');await expect(page.locator('.expansion-links a')).toHaveCount(40);
 await page.getByRole('link',{name:/Ghép số 11–99/}).click();
 await expect(page.locator('.expansion-page')).toContainText('12 = 10 + 2');
 await page.getByRole('button',{name:'Tra từ 十',exact:true}).first().click();
 await expect(page.getByRole('dialog')).toContainText('shí');await page.getByRole('button',{name:'Đóng thẻ từ ×'}).click();
 await page.getByRole('button',{name:'Vận dụng ngay · 10 câu →'}).click();
 const started=await(await request.get('/api/state')).json();
 const questions=(Object.values(started.objects.sessions).find((r:any)=>r.data.scope==='lesson-expansion') as any).data.packet.questions;
 let drafted=false;
 for(let i=0;i<questions.length;i++){
  const q=questions[i];
  if(q.kind==='listening'){
   await expect(page.getByRole('button',{name:'Kiểm tra',exact:true})).toBeDisabled();
   await page.getByRole('button',{name:'Bỏ qua',exact:true}).click();
  }else{
   if(!q.choices.length){
    const input=page.getByRole('textbox',{name:'Câu trả lời',exact:true});
    await input.fill(q.answers[0]);await expect(page.getByText('Đã lưu trên máy',{exact:true})).toBeVisible();
    if(!drafted){drafted=true;await page.getByRole('button',{name:'Thống kê',exact:true}).click();await page.goto('/#learn/expansion/tw.numbers/tens');await expect(input).toHaveValue(q.answers[0]);
     await page.getByRole('button',{name:'Xem lại quy tắc / gợi ý'}).click();await page.getByRole('button',{name:'Đóng gợi ý'}).click();await page.reload();await expect(input).toHaveValue(q.answers[0]);await expect(page.locator('.exercise')).toContainText('Đã dùng trợ giúp');}
   }else await page.locator('.choices').getByRole('button',{name:q.answers[0],exact:true}).click();
   await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();
   await expect(page.getByRole('heading',{name:'Đúng rồi!',exact:true})).toBeVisible();
  }
  await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'Đã đi hết bài vận dụng'})).toBeVisible();
 await expect(page.locator('.summary details')).toHaveCount(0);
 await expect(page.getByText('Nguồn tham khảo và cách biên soạn')).toHaveCount(0);
 await expect(page.getByText(/Lượt học đã lưu/)).toHaveCount(0);
 await page.screenshot({path:'data/learn-summary-20261110.png',fullPage:true});
 const finished=await(await request.get('/api/state')).json();
 expect(finished.objects.cards).toEqual(initial.objects.cards);
 expect(finished.objects.sessions[old.id]).toEqual(initial.objects.sessions[old.id]);
 expect(finished.events).toHaveLength(10);
 const row=Object.values(finished.objects.sessions).find((r:any)=>r.data.scope==='lesson-expansion') as any;
 expect(row.data.answers).toHaveLength(10);expect(row.data.answers.some((a:any)=>a.assisted)).toBe(true);
 await page.getByRole('button',{name:'Học lại với lượt mới'}).click();await expect(page.getByRole('button',{name:/Vận dụng ngay/})).toBeVisible();
 await page.goto('/#learn/expansion/tw.numbers/calendar');await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('heading',{name:'Thứ trong tuần và ngày tháng'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
