import {describe,it,expect} from 'vitest';
import {normalizePinyin,normalizeHanzi,canSubmitKey,newSchedule,review,grade} from './learning';
import type {Exercise} from './types';
describe('Chấm bài và IME',()=>{
  it('giữ chữ Phồn thể, bỏ dấu câu và chuẩn hóa Unicode',()=>{expect(normalizeHanzi(' 你好！')).toBe('你好');expect(normalizeHanzi('學')).not.toBe(normalizeHanzi('学'));});
  it('chấp nhận số thanh, giữ thanh và ü',()=>{expect(normalizePinyin('ni3 hao3')).toBe(normalizePinyin('nǐ hǎo'));expect(normalizePinyin('nǚ')).toBe(normalizePinyin('nv3'));expect(normalizePinyin('nu3')).not.toBe(normalizePinyin('nǚ'));expect(normalizePinyin('mā')).not.toBe(normalizePinyin('mǎ'));});
  it('không nộp Enter khi đang chọn IME',()=>{expect(canSubmitKey({key:'Enter',isComposing:true})).toBe(false);expect(canSubmitKey({key:'Enter',keyCode:229})).toBe(false);expect(canSubmitKey({key:'Enter'},true)).toBe(false);expect(canSubmitKey({key:'Enter'})).toBe(true);});
  it('thanh nhẹ, nhiều âm tiết và vị trí dấu chuẩn',()=>{expect(normalizePinyin('xie4xie5')).toBe(normalizePinyin('xièxie'));expect(normalizePinyin('liu2 shui3')).toBe(normalizePinyin('liú shuǐ'));expect(normalizePinyin('xue2sheng1')).toBe(normalizePinyin('xuéshēng'));});
  it('bài mở không quy thành đúng/sai',()=>{expect(grade({kind:'writing',answers:['你好']} as Exercise,'你好')).toBeNull();});
});
describe('FSRS',()=>{
  it('ôn đến hạn cập nhật, luyện tự do giữ nguyên',()=>{const now=new Date('2026-09-23T00:00:00Z');const card=newSchedule(now);const scheduled=review(card,3,'due',now).card;expect(scheduled.reps).toBe(1);expect(new Date(scheduled.due).getTime()).toBeGreaterThan(now.getTime());expect(review(card,4,'free',now).card).toEqual(card);});
  it('không đẩy lịch khi ôn sớm',()=>{expect(()=>review(newSchedule(new Date('2027-01-01')),4,'due',new Date('2026-01-01'))).toThrow();});
});
