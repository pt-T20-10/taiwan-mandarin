import {separableVerbs} from './verbs';

// Editorial progression: one new verb in early topics, at most two later.
// These are short whole-word examples. Split forms and longer patterns remain
// available as optional study, never part of this introductory batch.
const rows=[
 ['greetings','meet','我們見面。','Wǒmen jiànmiàn.','Chúng ta gặp nhau.'],
 ['numbers','sleep','我想睡覺。','Wǒ xiǎng shuìjiào.','Tôi muốn ngủ.'],
 ['food','treat','今天我請客。','Jīntiān wǒ qǐngkè.','Hôm nay tôi mời.'],
 ['shopping','shop','我們去逛街。','Wǒmen qù guàngjiē.','Chúng ta đi dạo phố.'],
 ['transport','queue','請排隊。','Qǐng páiduì.','Xin xếp hàng.'],
 ['family','chat','我們聊天。','Wǒmen liáotiān.','Chúng ta trò chuyện.'],
 ['home','rise','我七點起床。','Wǒ qī diǎn qǐchuáng.','Tôi thức dậy lúc bảy giờ.'],
 ['home','bath','我先洗澡。','Wǒ xiān xǐzǎo.','Tôi tắm trước.'],
 ['schedule','class','我明天上課。','Wǒ míngtiān shàngkè.','Ngày mai tôi lên lớp.'],
 ['schedule','finish-class','我們四點下課。','Wǒmen sì diǎn xiàkè.','Chúng tôi tan học lúc bốn giờ.'],
 ['information','help','請幫忙。','Qǐng bāngmáng.','Xin giúp đỡ.'],
 ['classroom','study','我想讀書。','Wǒ xiǎng dúshū.','Tôi muốn đọc sách.'],
 ['daily','run','我每天跑步。','Wǒ měitiān pǎobù.','Tôi chạy bộ mỗi ngày.'],
 ['campus','school','我去上學。','Wǒ qù shàngxué.','Tôi đi học.'],
 ['health','doctor','我去看病。','Wǒ qù kànbìng.','Tôi đi khám bệnh.'],
 ['renting','move','我們要搬家。','Wǒmen yào bānjiā.','Chúng tôi sắp chuyển nhà.'],
 ['services','register','我想報名。','Wǒ xiǎng bàomíng.','Tôi muốn đăng ký.'],
 ['worklife','work','我九點上班。','Wǒ jiǔ diǎn shàngbān.','Tôi đi làm lúc chín giờ.'],
 ['worklife','finish-work','我六點下班。','Wǒ liù diǎn xiàbān.','Tôi tan làm lúc sáu giờ.'],
 ['travel','photo','我們拍照。','Wǒmen pāizhào.','Chúng ta chụp ảnh.'],
 ['social','apologize','我想道歉。','Wǒ xiǎng dàoqiàn.','Tôi muốn xin lỗi.'],
];
export const beginnerVerbs=rows.map(([topic,id,hanzi,pinyin,vi])=>({...separableVerbs.find(v=>v.id===id)!,topic:'tw.'+topic,whole:{hanzi,pinyin,vi}}));
export const beginnerVerbsFor=(topic:string)=>beginnerVerbs.filter(v=>v.topic===topic);
export const additionalVerbs=separableVerbs.filter(v=>!beginnerVerbs.some(b=>b.id===v.id));
