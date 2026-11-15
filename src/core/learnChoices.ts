export function learnChoices(choices:string[],answer:string){
 return [answer,...choices.filter(c=>c!==answer)].filter((c,i,a)=>a.indexOf(c)===i).slice(0,4);
}
