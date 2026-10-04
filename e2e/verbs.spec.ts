import {test,expect} from '@playwright/test';
test('động từ: học, lưu nháp qua reload và tiếp tục bài bổ sung',async({page,request})=>{
 await page.goto('/#grammar/verbs/lesson/recognize');await expect(page.getByRole('heading',{name:'1. Nhận biết động từ'})).toBeVisible();
 await page.getByRole('link',{name:/Luyện bài này/}).click();await page.getByRole('button',{name:'Bộ đề mới',exact:true}).click();
 const latest=async()=>Object.values((await(await request.get('/api/state')).json()).objects.sessions).filter((s:any)=>s.data.unit_id==='verbs:lesson:recognize').sort((a:any,b:any)=>b.data.created_at.localeCompare(a.data.created_at))[0] as any;
 await expect(page.locator('.practice-question')).toBeVisible();const session=(await latest()).data,q=session.packet.items[0];
 await page.locator('.choices').getByRole('button',{name:q.answers[0],exact:true}).click();
 await expect.poll(async()=>(await latest()).data.draft).toBe(q.answers[0]);
 await page.reload();await expect(page.locator('.choices button.selected')).toHaveText(q.answers[0]);
 expect((await latest()).data.packet.items).toEqual(session.packet.items);
 await page.getByRole('button',{name:'Kiểm tra',exact:true}).click();await expect(page.getByText('Đáp án khớp',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Tiếp tục →',exact:true}).click();await expect(page.getByText('Câu 2/6',{exact:true})).toBeVisible();
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
