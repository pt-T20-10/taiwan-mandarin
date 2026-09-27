export type Syllable={base:string;initial:string;final:string};
export const initials=['','b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s'];
export const finals='a o e ai ei ao ou an en ang eng er i ia ie iao iou ian in iang ing iong u ua uo uai uei uan uen uang ueng ong ü üe üan ün -i'.split(' ');
export function toneMark(base:string,tone:number){
 if(tone<1||tone>4)return base;
 const marks:Record<string,string[]>={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};
 const index=base.includes('a')?base.indexOf('a'):base.includes('e')?base.indexOf('e'):base.includes('ou')?base.indexOf('o'):Math.max(...Array.from(base).map((c,i)=>marks[c]?i:-1));
 return index<0?base:base.slice(0,index)+marks[base[index]][tone-1]+base.slice(index+1);
}
const symbols=['b','p','m','f','d','t','n','l','g','k','h','j','q','x','zh','ch','sh','r','z','c','s','a','o','e','ê','ai','ei','ao','ou','an','en','ang','eng','er','i','u','ü'];
const compound:Record<string,string[]>={ia:['i','a'],ie:['i','ê'],iao:['i','ao'],iou:['i','ou'],ian:['i','an'],in:['i','en'],iang:['i','ang'],ing:['i','eng'],iong:['ü','eng'],ua:['u','a'],uo:['u','o'],uai:['u','ai'],uei:['u','ei'],uan:['u','an'],uen:['u','en'],uang:['u','ang'],ueng:['u','eng'],ong:['u','eng'],'üe':['ü','ê'],'üan':['ü','an'],'ün':['ü','en'],'-i':[]};
export function spellingSteps(s:Syllable,tone:number):string[]{
 const pieces=[...(s.initial?[s.initial]:[]),...(compound[s.final]||[s.final])];
 if(pieces.some(p=>!symbols.includes(p)))return [];
 return [...pieces,toneMark(s.base,tone)];
}
