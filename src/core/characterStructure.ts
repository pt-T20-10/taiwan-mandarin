import components from './character-components.json';

const positions:Record<string,string[]>={'⿰':['trái','phải'],'⿱':['trên','dưới'],'⿲':['trái','giữa','phải'],'⿳':['trên','giữa','dưới'],'⿴':['bao quanh','bên trong'],'⿵':['bao phía trên','bên trong'],'⿶':['bao phía dưới','bên trong'],'⿷':['bao phía trái','bên trong'],'⿸':['bao trên/trái','bên trong'],'⿹':['bao trên/phải','bên trong'],'⿺':['bao dưới/trái','bên trong'],'⿻':['lớp thứ nhất','lớp thứ hai']};
const terminals=new Set(Array.from(components.terminals));
const decompositions:Record<string,string>=components.decompositions;
export type StructurePart={character:string;position:string};

// Expand compound operands too, but retain radicals/variants as learning units.
// A path-local guard preserves repeated components (e.g. 林) and stops cycles.
export function structureParts(value:string,character=''):StructurePart[]{
 if(terminals.has(character))return [{character,position:'toàn chữ'}];
 function parse(ids:string,parent:string,seen:Set<string>):StructurePart[]{
  const chars=Array.from(ids);let index=0,valid=true;
  function read(position:string):StructurePart[]{
   const char=chars[index++];if(!char){valid=false;return [];}
   const children=positions[char];
   if(children)return children.flatMap(child=>read(position?`${position} / ${child}`:child));
   const nested=decompositions[char];
   if(nested&&!terminals.has(char)&&!seen.has(char)){
    const expanded=parse(nested,position,new Set([...seen,char]));
    if(expanded.length)return expanded;
   }
   return [{character:char,position}];
  }
  const parts=read(parent);return valid&&index===chars.length?parts:[];
 }
 return parse(value,'',new Set(character?[character]:[]));
}
