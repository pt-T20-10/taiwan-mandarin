import {expect,it} from 'vitest';
import {structureParts} from './characterStructure';
import index from '../../public/learning/characters/index.json';

it('expands compound parts recursively, retaining radicals and repeated parts',()=>{
 expect(structureParts('⿱你心','您').map(p=>p.character)).toEqual(['亻','⺈','小','心']);
 expect(structureParts('⿰女子','好').map(p=>p.character)).toEqual(['女','子']);
 expect(structureParts('⿰木木','林').map(p=>p.character)).toEqual(['木','木']);
 expect(structureParts('⿱你心','您').map(p=>p.position)).toEqual(['trên / trái','trên / phải / trên','trên / phải / dưới','dưới']);
 expect(structureParts('⿱你','')).toEqual([]);
 for(const [char,row] of Object.entries(index)){
  if(row.decomposition){const parts=structureParts(row.decomposition,char);expect(parts.length,char).toBeGreaterThan(0);expect(parts.length,char).toBeLessThan(50);}
 }
});
