/** Shared PC/Android grouping. Counts are distinct words, never card directions. */
export type ReviewWord={id:string;hanzi:string;pinyin:string;decks:string[]};
export type ReviewGroup={id:string;label:string;ids:string[]};
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;
export function reviewGroups(words:ReviewWord[]):ReviewGroup[]{
 const sorted=[...words].sort((a,b)=>compare(a.decks?.[0]||'Cá nhân',b.decks?.[0]||'Cá nhân')||compare(a.hanzi||a.id,b.hanzi||b.id)||compare(a.pinyin||'',b.pinyin||''));
 const groups:ReviewGroup[]=[{id:'all',label:'Tất cả từ',ids:sorted.map(w=>w.id)}];
 const count=Math.floor(sorted.length/20);
 if(count<2)return groups;
 let at=0;
 for(let i=0;i<count;i++){
  const size=Math.floor(sorted.length/count)+(i<sorted.length%count?1:0),rows=sorted.slice(at,at+size);at+=size;
  const topics=[...new Set(rows.map(w=>w.decks?.[0]||'Cá nhân'))];
  groups.push({id:'group:'+i,label:`Nhóm ${i+1} · ${topics.slice(0,2).join(' / ')}${topics.length>2?' +'+(topics.length-2)+' chủ đề':''}`,ids:rows.map(w=>w.id)});
 }
 return groups;
}
export function shuffleReview<T>(items:T[],random=Math.random){const rows=[...items];for(let i=rows.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}return rows;}
export function reviewRound(pool:string[],size:number,used:string[]=[],random=Math.random){
 const ids=[...new Set(pool)],limit=size===0?ids.length:Math.min(Math.max(20,size),ids.length);
 const old=new Set(used),fresh=shuffleReview(ids.filter(id=>!old.has(id)),random);
 if(fresh.length>=limit){const selected=fresh.slice(0,limit);return {ids:selected,used:[...new Set([...used.filter(id=>ids.includes(id)),...selected])]};}
 const fill=shuffleReview(ids.filter(id=>old.has(id)),random).slice(0,limit-fresh.length);
 return {ids:shuffleReview([...fresh,...fill],random),used:fill};
}
