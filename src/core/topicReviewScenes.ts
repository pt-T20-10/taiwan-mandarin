import type {TextItem} from './types';
export type VerbCase={id:string;verb:string;text:TextItem};
const v=(id:string,verb:string,hanzi:string,pinyin:string,vi:string):VerbCase=>({id,verb,text:{hanzi,pinyin,vi}});
// Complete authored sentences. Do not derive another subject or erase a
// request/time marker from these sentences to manufacture more variants.
export const reviewVerbCases:Record<string,VerbCase[]>={
 greetings:[v('meet-together','meet','我們見面。','Wǒmen jiànmiàn.','Chúng tôi gặp nhau.')],
 numbers:[v('sleep-now','sleep','我現在想睡覺。','Wǒ xiànzài xiǎng shuìjiào.','Bây giờ tôi muốn ngủ.')],
 food:[v('treat-today','treat','今天我請客。','Jīntiān wǒ qǐngkè.','Hôm nay tôi mời.')],
 shopping:[v('shop-together','shop','我們去逛街。','Wǒmen qù guàngjiē.','Chúng tôi đi dạo phố mua sắm.')],
 transport:[v('queue-at-station','queue','我在車站排隊。','Wǒ zài chēzhàn páiduì.','Tôi xếp hàng ở nhà ga.')],
 family:[v('chat-together','chat','我們聊天。','Wǒmen liáotiān.','Chúng tôi trò chuyện với nhau.')],
 home:[v('rise-seven','rise','我七點起床。','Wǒ qī diǎn qǐchuáng.','Tôi thức dậy lúc bảy giờ.'),v('bath-bathroom','bath','我在浴室洗澡。','Wǒ zài yùshì xǐzǎo.','Tôi tắm ở phòng tắm.')],
 schedule:[v('class-tomorrow','class','我明天上課。','Wǒ míngtiān shàngkè.','Ngày mai tôi lên lớp.'),v('finish-five','finish-class','我們五點下課。','Wǒmen wǔ diǎn xiàkè.','Chúng tôi tan học lúc năm giờ.'),v('finish-four','finish-class','我們四點下課。','Wǒmen sì diǎn xiàkè.','Chúng tôi tan học lúc bốn giờ.')],
 information:[v('request-help','help','請幫忙。','Qǐng bāngmáng.','Xin giúp đỡ.')],
 classroom:[v('want-read','study','我想讀書。','Wǒ xiǎng dúshū.','Tôi muốn đọc sách.')],
 daily:[v('run-daily','run','我每天跑步。','Wǒ měitiān pǎobù.','Tôi chạy bộ mỗi ngày.')],
 campus:[v('go-school','school','我去上學。','Wǒ qù shàngxué.','Tôi đi học.')],
 health:[v('visit-doctor','doctor','我去看病。','Wǒ qù kànbìng.','Tôi đi khám bệnh.')],
 renting:[v('plan-move','move','我們要搬家。','Wǒmen yào bānjiā.','Chúng tôi sắp chuyển nhà.')],
 services:[v('register-tomorrow','register','我明天想報名。','Wǒ míngtiān xiǎng bàomíng.','Ngày mai tôi muốn đăng ký.')],
 worklife:[v('start-nine','work','我九點上班。','Wǒ jiǔ diǎn shàngbān.','Tôi bắt đầu làm việc lúc chín giờ.'),v('finish-six','finish-work','我今天六點下班。','Wǒ jīntiān liù diǎn xiàbān.','Hôm nay tôi tan làm lúc sáu giờ.')],
 travel:[v('photo-together','photo','我們拍照。','Wǒmen pāizhào.','Chúng tôi chụp ảnh.')],
 social:[v('apologize-to-you','apologize','我想跟你道歉。','Wǒ xiǎng gēn nǐ dàoqiàn.','Tôi muốn xin lỗi bạn.')],
};

export type ReviewScene={id:string;first:number;second:number;classifier:string;quantity:1|2;verb:string};
const s=(id:string,first:number,second:number,classifier:string,quantity:1|2,verb:string):ReviewScene=>({id,first,second,classifier,quantity,verb});
// This is an explicit allowlist of whole four-fact profiles, not a Cartesian
// product. In particular class end/free time and meal/count choices agree.
export const reviewScenes:Record<string,ReviewScene[]>={
 greetings:[s('vn-an',1,0,'people',1,'meet-together'),s('tw-minh',0,1,'people',2,'meet-together'),s('vn-my',1,2,'teacher',1,'meet-together'),s('tw-an',0,0,'teacher',1,'meet-together')],
 numbers:[s('meet-afternoon',0,0,'cup',2,'sleep-now'),s('meet-evening',1,1,'book',2,'sleep-now'),s('meet-late',2,2,'ticket',2,'sleep-now')],
 food:[s('rice-tea',0,0,'rice-bowl',1,'treat-today'),s('noodles-water',1,1,'bowl',2,'treat-today'),s('breakfast-milk',2,2,'meal',2,'treat-today')],
 shopping:[s('market-bag',0,0,'clothes',1,'shop-together'),s('store-bag',1,1,'trousers',1,'shop-together'),s('convenience-bag',2,2,'shoes',1,'shop-together')],
 transport:[s('bus-left',0,0,'ticket',2,'queue-at-station'),s('mrt-right',1,1,'car',1,'queue-at-station'),s('taxi-front',2,2,'ticket',1,'queue-at-station')],
 family:[s('brother-tea',0,0,'cat',1,'chat-together'),s('sister-noodles',1,1,'people',2,'chat-together'),s('younger-chat',2,2,'cat',1,'chat-together')],
 home:[s('quiet-room',0,0,'room',2,'rise-seven'),s('clean-room',1,1,'chair',2,'bath-bathroom'),s('big-room',2,2,'room',1,'rise-seven')],
 schedule:[s('morning-class',0,0,'course',2,'class-tomorrow'),s('afternoon-five',1,1,'class',2,'finish-five'),s('evening-class',2,2,'class',1,'class-tomorrow'),s('afternoon-four',3,1,'class',2,'finish-four')],
 information:[s('post-address',0,0,'shop',1,'request-help'),s('hospital-phone',1,1,'teacher',1,'request-help'),s('desk-name',2,2,'shop',2,'request-help')],
 classroom:[s('character-say',0,0,'book',2,'want-read'),s('word-write',1,1,'book',1,'want-read'),s('sentence-read',2,2,'book',1,'want-read')],
 daily:[s('bathed-swim',0,0,'cup',2,'run-daily'),s('home-speak',1,1,'meal',1,'run-daily'),s('awake-write',2,2,'book',2,'run-daily')],
 campus:[s('professor-borrow',0,0,'book',2,'go-school'),s('teacher-return',1,1,'course',2,'go-school'),s('classmate-report',2,2,'class',2,'go-school')],
 health:[s('head-throat',0,0,'medicine',1,'visit-doctor'),s('tired-stomach',1,1,'bottle',2,'visit-doctor'),s('unwell-throat',2,0,'medicine',2,'visit-doctor')],
 renting:[s('larger-fridge',0,0,'room',2,'plan-move'),s('quiet-washer',1,1,'chair',2,'plan-move'),s('cheaper-ac',2,2,'room',1,'plan-move')],
 services:[s('package-form',0,0,'letter',1,'register-tomorrow'),s('letter-sign',1,1,'letter',1,'register-tomorrow'),s('letters-queue',2,2,'letter',2,'register-tomorrow')],
 worklife:[s('overtime-check',0,0,'letter',2,'start-nine'),s('meeting-prepare',1,1,'letter',1,'finish-six'),s('work-contact',2,2,'people',2,'start-nine')],
 travel:[s('taiwan-depart',0,0,'ticket',2,'photo-together'),s('sea-arrive',1,1,'room',1,'photo-together'),s('sight-checkout',2,2,'ticket',1,'photo-together')],
 social:[s('event-meal',0,0,'people',2,'apologize-to-you'),s('chat-film',1,1,'cup',1,'apologize-to-you'),s('dinner-shopping',2,2,'cup',2,'apologize-to-you')],
};

const independentPairs=[[0,1],[0,2],[1,3]];
// Writing prompts also preserve discourse dependencies. In the first topic,
// introduce the friend/teacher before the reciprocal plural sentence.
export const reviewWritingPairs:Record<string,number[][]>={
 greetings:[[0,1],[0,2],[2,3]],numbers:independentPairs,food:independentPairs,
 shopping:independentPairs,transport:independentPairs,family:independentPairs,
 home:independentPairs,schedule:independentPairs,information:independentPairs,
 classroom:independentPairs,daily:independentPairs,campus:independentPairs,
 health:independentPairs,renting:independentPairs,services:independentPairs,
 worklife:independentPairs,travel:independentPairs,social:independentPairs,
};
