import {describe,it,expect} from 'vitest';
import {matchesStroke,strokeModels,type Stroke} from './strokes';
import pack from '../../content/foundation.pack.json';
describe('Kiểm tra nét có hướng và góc gấp',()=>{
  it('mỗi đơn vị có đủ dữ liệu nét đã chọn',()=>{
    for(const unit of pack.content.units)expect(strokeModels[unit.character]?.length).toBeGreaterThan(0);
  });
  it('chấp nhận đường chuột có nhiễu nhỏ và nét xiên',()=>{
    const mouse:Stroke=[[145,48],[140,77],[125,133],[108,160],[90,198],[67,220],[42,246]];
    expect(matchesStroke(mouse,strokeModels['人'][0])).toBe(true);
    expect(matchesStroke([...mouse].reverse(),strokeModels['人'][0])).toBe(false);
  });
  it('không chấp nhận đi tắt qua góc, sai nét hoặc thiếu móc dài',()=>{
    expect(matchesStroke([[70,80],[215,235]],strokeModels['口'][1])).toBe(false);
    expect(matchesStroke([[150,45],[150,255]],strokeModels['十'][0])).toBe(false);
    expect(matchesStroke([[105,50],[220,50],[220,255]],strokeModels['月'][1])).toBe(false);
  });
  it('từ chối chấm một điểm, đường sai vị trí và dữ liệu hỏng',()=>{
    expect(matchesStroke([[45,150]],strokeModels['一'][0])).toBe(false);
    expect(matchesStroke([[45,210],[255,210]],strokeModels['一'][0])).toBe(false);
    expect(matchesStroke([[NaN,150],[255,150]],strokeModels['一'][0])).toBe(false);
  });
});
