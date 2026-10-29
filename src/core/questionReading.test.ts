import {it,expect} from 'vitest';
import {questionReading} from './questionReading';
it('uses visible Hanzi only and keeps a cloze gap in Pinyin and audio',()=>{
 const source={hanzi:'晚餐要吃什麼？',pinyin:'Wǎncān yào chī shénme?',vi:'Bữa tối muốn ăn gì?'};
 const reading=questionReading('Điền từ: ___要吃什麼？',[source])!;
 expect(reading.pinyin).toContain('___');expect(reading.pinyin).not.toMatch(/wǎncān/i);
 expect(reading.audio).not.toContain('晚餐');expect(reading.audio).toContain('要吃什麼');
 expect(questionReading(source.hanzi,[source])!.pinyin).toBe(source.pinyin);
 expect(questionReading('Chọn một đáp án')).toBeNull();
 expect(questionReading('麵店')!.pinyin).toMatch(/miàn\s?diàn/);
 expect(questionReading('龘')!.missing).toBe(true);
});
