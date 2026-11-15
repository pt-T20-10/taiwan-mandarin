// A single supporting word (老師) across the entire first lesson. These are
// complete, authored greetings, not inferred translations or generated pinyin.
export const greetingPrimer=[
 ['你好','老師，你好！','Lǎoshī, nǐ hǎo!','Chào thầy/cô!'],
 ['您好','老師，您好！','Lǎoshī, nín hǎo!','Em kính chào thầy/cô!'],
 ['早安','老師，早安！','Lǎoshī, zǎo ān!','Chào buổi sáng, thầy/cô!'],
 ['晚安','老師，晚安！','Lǎoshī, wǎn ān!','Chúc thầy/cô ngủ ngon!'],
 ['再見','老師，再見！','Lǎoshī, zài jiàn!','Tạm biệt thầy/cô!'],
].map(([gap,hanzi,pinyin,vi],i)=>({id:'greeting-primer:'+i,unit_id:'tw.greetings',hanzi,pinyin,vi,gap,
 options:['你好','您好','早安','晚安','再見'],required_words:['老師',gap],required_grammar:[] as string[]}));
