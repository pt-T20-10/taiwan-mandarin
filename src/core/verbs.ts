import type {PracticeItem,PracticeSet,PracticeSkill,TextItem,Unit} from './types';
export const verbSources=[{title:'NTNU: phân loại động từ và tính li hợp',url:'https://www.mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/1.pdf'},{title:'NTNU: nghiên cứu cách học và lỗi dùng từ li hợp',url:'https://web.ntnu.edu.tw/~lchang/separable_2007.pdf'}];
const text=(hanzi:string,pinyin:string,vi:string):TextItem=>({hanzi,pinyin,vi});
export const verbGroups=['Sinh hoạt','Giải trí','Học tập','Công việc','Giao tiếp','Đời sống và sức khỏe'];
// Explicitly authored pairs: do not generate split forms by a blanket rule.
const rows=[
 ['sleep','睡覺','shuìjiào','ngủ','我想睡覺。','Wǒ xiǎng shuìjiào.','Tôi muốn ngủ.','我昨晚睡了八個小時的覺。','Wǒ zuówǎn shuì le bā ge xiǎoshí de jiào.','Đêm qua tôi ngủ tám tiếng.'],
 ['rise','起床','qǐchuáng','thức dậy','我每天七點起床。','Wǒ měitiān qī diǎn qǐchuáng.','Mỗi ngày tôi dậy lúc bảy giờ.','起了床以後，我就去刷牙。','Qǐ le chuáng yǐhòu, wǒ jiù qù shuāyá.','Sau khi dậy, tôi đi đánh răng.'],
 ['bath','洗澡','xǐzǎo','tắm','我先去洗澡。','Wǒ xiān qù xǐzǎo.','Tôi đi tắm trước.','我洗了個澡。','Wǒ xǐ le ge zǎo.','Tôi đã tắm một lần.'],
 ['dream','做夢','zuòmèng','nằm mơ','我昨晚做夢了。','Wǒ zuówǎn zuòmèng le.','Đêm qua tôi nằm mơ.','我做了一個奇怪的夢。','Wǒ zuò le yī ge qíguài de mèng.','Tôi đã có một giấc mơ kỳ lạ.'],
 ['walk','散步','sànbù','đi dạo','我們去散步吧。','Wǒmen qù sànbù ba.','Chúng ta đi dạo nhé.','我們去公園散散步吧。','Wǒmen qù gōngyuán sàn san bù ba.','Chúng ta ra công viên đi dạo một chút nhé.'],
 ['run','跑步','pǎobù','chạy bộ','我每天跑步。','Wǒ měitiān pǎobù.','Tôi chạy bộ mỗi ngày.','我跑了半個小時的步。','Wǒ pǎo le bàn ge xiǎoshí de bù.','Tôi đã chạy bộ nửa tiếng.'],
 ['swim','游泳','yóuyǒng','bơi','我喜歡游泳。','Wǒ xǐhuān yóuyǒng.','Tôi thích bơi.','我游了一個小時的泳。','Wǒ yóu le yī ge xiǎoshí de yǒng.','Tôi đã bơi một tiếng.'],
 ['sing','唱歌','chànggē','hát','她喜歡唱歌。','Tā xǐhuān chànggē.','Cô ấy thích hát.','她唱了一首歌。','Tā chàng le yī shǒu gē.','Cô ấy đã hát một bài.'],
 ['dance','跳舞','tiàowǔ','nhảy, múa','我們一起跳舞吧。','Wǒmen yīqǐ tiàowǔ ba.','Chúng ta cùng nhảy nhé.','我們跳了半個小時的舞。','Wǒmen tiào le bàn ge xiǎoshí de wǔ.','Chúng tôi đã nhảy nửa tiếng.'],
 ['chat','聊天','liáotiān','trò chuyện','我常跟朋友聊天。','Wǒ cháng gēn péngyǒu liáotiān.','Tôi thường trò chuyện với bạn.','我們聊了一會兒天。','Wǒmen liáo le yīhuǐr tiān.','Chúng tôi đã trò chuyện một lát.'],
 ['photo','拍照','pāizhào','chụp ảnh','這裡可以拍照嗎？','Zhèlǐ kěyǐ pāizhào ma?','Ở đây có được chụp ảnh không?','我們拍了幾張照。','Wǒmen pāi le jǐ zhāng zhào.','Chúng tôi đã chụp vài tấm ảnh.'],
 ['shop','逛街','guàngjiē','đi dạo phố, xem hàng','週末我們去逛街。','Zhōumò wǒmen qù guàngjiē.','Cuối tuần chúng tôi đi dạo phố.','我們逛了兩個小時的街。','Wǒmen guàng le liǎng ge xiǎoshí de jiē.','Chúng tôi đã đi dạo phố hai tiếng.'],
 ['class','上課','shàngkè','học, lên lớp','我明天要上課。','Wǒ míngtiān yào shàngkè.','Ngày mai tôi phải lên lớp.','我今天上了三節課。','Wǒ jīntiān shàng le sān jié kè.','Hôm nay tôi đã học ba tiết.'],
 ['finish-class','下課','xiàkè','tan học, hết tiết','我們四點下課。','Wǒmen sì diǎn xiàkè.','Chúng tôi tan học lúc bốn giờ.','下了課，我們去吃飯。','Xià le kè, wǒmen qù chīfàn.','Hết tiết, chúng tôi đi ăn.'],
 ['school','上學','shàngxué','đi học','弟弟每天坐公車上學。','Dìdi měitiān zuò gōngchē shàngxué.','Em trai đi xe buýt đến trường mỗi ngày.','他已經上了六年的學。','Tā yǐjīng shàng le liù nián de xué.','Cậu ấy đã đi học sáu năm.'],
 ['study','讀書','dúshū','đọc sách; học','我在圖書館讀書。','Wǒ zài túshūguǎn dúshū.','Tôi đọc sách trong thư viện.','我讀了兩個小時的書。','Wǒ dú le liǎng ge xiǎoshí de shū.','Tôi đã đọc sách hai tiếng.'],
 ['exam','考試','kǎoshì','thi','我們明天考試。','Wǒmen míngtiān kǎoshì.','Ngày mai chúng tôi thi.','考完試，我想休息。','Kǎo wán shì, wǒ xiǎng xiūxí.','Thi xong, tôi muốn nghỉ ngơi.'],
 ['register','報名','bàomíng','đăng ký','我想報名。','Wǒ xiǎng bàomíng.','Tôi muốn đăng ký.','我已經報了名。','Wǒ yǐjīng bào le míng.','Tôi đã đăng ký rồi.'],
 ['work','上班','shàngbān','đi làm, làm việc','我九點上班。','Wǒ jiǔ diǎn shàngbān.','Tôi đi làm lúc chín giờ.','我今天上了八個小時的班。','Wǒ jīntiān shàng le bā ge xiǎoshí de bān.','Hôm nay tôi đã làm việc tám tiếng.'],
 ['finish-work','下班','xiàbān','tan làm','我六點下班。','Wǒ liù diǎn xiàbān.','Tôi tan làm lúc sáu giờ.','下了班，我就回家。','Xià le bān, wǒ jiù huíjiā.','Tan làm, tôi về nhà ngay.'],
 ['meeting','開會','kāihuì','họp','我們下午開會。','Wǒmen xiàwǔ kāihuì.','Chiều nay chúng tôi họp.','我們開了一個小時的會。','Wǒmen kāi le yī ge xiǎoshí de huì.','Chúng tôi đã họp một tiếng.'],
 ['leave','請假','qǐngjià','xin nghỉ','我想請假。','Wǒ xiǎng qǐngjià.','Tôi muốn xin nghỉ.','我請了兩天假。','Wǒ qǐng le liǎng tiān jià.','Tôi đã xin nghỉ hai ngày.'],
 ['overtime','加班','jiābān','tăng ca','我今天要加班。','Wǒ jīntiān yào jiābān.','Hôm nay tôi phải tăng ca.','我加了兩個小時的班。','Wǒ jiā le liǎng ge xiǎoshí de bān.','Tôi đã tăng ca hai tiếng.'],
 ['part-time','打工','dǎgōng','làm thêm','我在咖啡店打工。','Wǒ zài kāfēidiàn dǎgōng.','Tôi làm thêm ở quán cà phê.','我在那裡打過工。','Wǒ zài nàlǐ dǎ guo gōng.','Tôi từng làm thêm ở đó.'],
 ['meet','見面','jiànmiàn','gặp mặt','我明天跟朋友見面。','Wǒ míngtiān gēn péngyǒu jiànmiàn.','Ngày mai tôi gặp bạn.','我們見了一次面。','Wǒmen jiàn le yī cì miàn.','Chúng tôi đã gặp nhau một lần.'],
 ['help','幫忙','bāngmáng','giúp đỡ','你可以來幫忙嗎？','Nǐ kěyǐ lái bāngmáng ma?','Bạn có thể đến giúp không?','請幫我一個忙。','Qǐng bāng wǒ yī ge máng.','Hãy giúp tôi một việc.'],
 ['treat','請客','qǐngkè','mời, đãi khách','今天我請客。','Jīntiān wǒ qǐngkè.','Hôm nay tôi mời.','他昨天請了客。','Tā zuótiān qǐng le kè.','Hôm qua anh ấy đã đãi khách.'],
 ['apologize','道歉','dàoqiàn','xin lỗi','我想向她道歉。','Wǒ xiǎng xiàng tā dàoqiàn.','Tôi muốn xin lỗi cô ấy.','我已經向她道過歉了。','Wǒ yǐjīng xiàng tā dào guo qiàn le.','Tôi đã xin lỗi cô ấy rồi.'],
 ['marry','結婚','jiéhūn','kết hôn','他們明年結婚。','Tāmen míngnián jiéhūn.','Năm sau họ kết hôn.','他們結了婚以後搬到臺北。','Tāmen jié le hūn yǐhòu bān dào Táiběi.','Sau khi kết hôn, họ chuyển đến Đài Bắc.'],
 ['argue','吵架','chǎojià','cãi nhau','他們常常吵架。','Tāmen chángcháng chǎojià.','Họ thường cãi nhau.','他們昨天吵了一架。','Tāmen zuótiān chǎo le yī jià.','Hôm qua họ đã cãi nhau một trận.'],
 ['move','搬家','bānjiā','chuyển nhà','我們下個月搬家。','Wǒmen xià ge yuè bānjiā.','Tháng sau chúng tôi chuyển nhà.','我搬過兩次家。','Wǒ bān guo liǎng cì jiā.','Tôi đã chuyển nhà hai lần.'],
 ['queue','排隊','páiduì','xếp hàng','請在這裡排隊。','Qǐng zài zhèlǐ páiduì.','Xin xếp hàng ở đây.','我們排了半個小時的隊。','Wǒmen pái le bàn ge xiǎoshí de duì.','Chúng tôi đã xếp hàng nửa tiếng.'],
 ['hospital-register','掛號','guàhào','đăng ký khám','我要先掛號。','Wǒ yào xiān guàhào.','Tôi cần đăng ký khám trước.','掛了號以後，請等一下。','Guà le hào yǐhòu, qǐng děng yīxià.','Sau khi đăng ký khám, xin chờ một chút.'],
 ['doctor','看病','kànbìng','đi khám; khám bệnh','我要去看病。','Wǒ yào qù kànbìng.','Tôi cần đi khám.','我昨天去看了病。','Wǒ zuótiān qù kàn le bìng.','Hôm qua tôi đã đi khám.'],
 ['ill','生病','shēngbìng','bị ốm','他生病了。','Tā shēngbìng le.','Anh ấy bị ốm rồi.','他去年生了一場病。','Tā qùnián shēng le yī cháng bìng.','Năm ngoái anh ấy bị một trận ốm.'],
 ['hospital','住院','zhùyuàn','nằm viện','他需要住院。','Tā xūyào zhùyuàn.','Anh ấy cần nằm viện.','他住了三天院。','Tā zhù le sān tiān yuàn.','Anh ấy đã nằm viện ba ngày.'],
];
export const separableVerbs=rows.map(([id,hanzi,pinyin,vi,a,ap,av,b,bp,bv],i)=>({id,hanzi,pinyin,vi,group:Math.floor(i/6),stage:i%6<4?'core':'extension',whole:text(a,ap,av),split:text(b,bp,bv),note:id==='help'?'Học mẫu 幫我一個忙. Tiếng Đài Loan có biến thể 幫忙 mang tân ngữ; không dùng quy tắc tuyệt đối để chấm mọi ngữ cảnh.':id==='register'?'Có thể nói 報名參加活動, cũng gặp 報名考試. Không suy li hợp là luôn cấm thành phần theo sau.':id==='study'?'讀書 có nghĩa đọc sách hoặc học tập tùy ngữ cảnh.':id==='ill'?'Diễn tả thay đổi trạng thái; không áp dụng mẫu lặp như 散散步.':'Câu tách là một mẫu cụ thể; không áp dụng mọi phép biến đổi cho từ này.'}));
export const basicVerbs=[
 ['看','kàn','xem','看書'],['聽','tīng','nghe','聽音樂'],['吃','chī','ăn','吃麵'],['喝','hē','uống','喝茶'],['買','mǎi','mua','買票'],['寫','xiě','viết','寫字'],['學','xué','học','學中文'],['問','wèn','hỏi','問老師'],['等','děng','đợi','等公車'],['走','zǒu','đi bộ; rời đi','我先走。'],
 ['參加','cānjiā','tham gia','參加活動'],['討論','tǎolùn','thảo luận','討論問題'],['準備','zhǔnbèi','chuẩn bị','準備晚餐'],['回答','huídá','trả lời','回答問題'],['學習','xuéxí','học tập','學習中文'],['喜歡','xǐhuān','thích','喜歡音樂'],['認識','rènshi','quen, biết','認識朋友'],['需要','xūyào','cần','需要幫忙'],['休息','xiūxí','nghỉ ngơi','休息一下'],['旅行','lǚxíng','du lịch','去臺灣旅行'],
].map(([hanzi,pinyin,vi,example],i)=>({hanzi,pinyin,vi,example,syllables:i<10?1:2,object:i===9||i>=18?'Trong nghĩa/mẫu này không nhận tân ngữ trực tiếp.':'Có thể nhận tân ngữ trong nghĩa/mẫu này; có thể không nói ra khi ngữ cảnh đã rõ.'}));
const topicVerbs:Record<string,string[]>={
 greetings:['meet','chat','help','apologize','treat','school'],numbers:['sleep','work','class','meeting','leave','run'],
 food:['treat','queue','help','chat','work','part-time'],shopping:['shop','queue','help','work','part-time','photo'],
 transport:['queue','school','work','meet','move','help'],family:['marry','argue','chat','help','dream','ill'],
 home:['move','sleep','rise','bath','dream','help'],schedule:['class','finish-class','study','exam','leave','register'],
 information:['register','queue','hospital-register','school','meet','help'],classroom:['class','finish-class','school','study','exam','register'],
 daily:['sleep','rise','bath','walk','run','work'],campus:['school','class','study','exam','register','part-time'],
 health:['ill','hospital-register','doctor','hospital','leave','sleep'],renting:['move','meet','help','work','sleep','chat'],
 services:['queue','hospital-register','register','help','meet','apologize'],worklife:['work','finish-work','meeting','leave','overtime','part-time'],
 travel:['photo','shop','walk','swim','queue','meet'],social:['meet','chat','help','treat','apologize','argue'],
};
export function verbsFor(topic:string){const ids=topicVerbs[topic.replace('tw.','')];return ids?ids.map(id=>separableVerbs.find(v=>v.id===id)!):separableVerbs;}
export function verbPacket(id:string,title:string,skill:PracticeSkill,items:PracticeItem[],passage:TextItem[]=[]):PracticeSet{return {id, title,skill,source:'authored',verification:'draft',reference:'Dự án biên soạn theo tài liệu NTNU; chưa giáo viên duyệt.',items,passage};}
export function verbUnit(id:string,title:string,packets:PracticeSet[]):Unit{return {id:'verbs:'+id,title,description:'Chuyên đề động từ',words:[],grammar:[],dialogue:[],writing_prompt:'',character:'動',lessons:[],practice_sets:packets};}
export function verbTopicUnit(topic:string,title:string){const all=verbsFor(topic),groups=topic==='all'?verbGroups.map((name,i)=>({name,examples:all.filter(v=>v.group===i)})):[{name:'Ôn theo tình huống',examples:all}];return verbUnit('topic:'+topic,title,groups.flatMap(({name:group,examples},index)=>{
 return (['reading','listening','speaking','writing'] as PracticeSkill[]).map(skill=>verbPacket(`verbs:topic:${topic}:${index}:${skill}:v1`,title+' · '+group,skill,examples.map((v,i):PracticeItem=>({id:`verbs:${topic}:${skill}:${v.id}`,kind:skill==='listening'?'dictation':skill==='reading'?'choice':skill==='speaking'?'respond':'write',prompt:skill==='reading'?`Câu “${v.split.hanzi}” có nghĩa gì?`:skill==='listening'?'Nghe và gõ cả câu; chú ý phần chen giữa động từ li hợp.':`Tự ${skill==='speaking'?'nói':'viết'} một câu diễn đạt: ${v.split.vi}`,answers:[skill==='reading'?v.split.vi:v.split.hanzi],choices:skill==='reading'?[v.split.vi,...examples.filter(x=>x.id!==v.id).slice(0,2).map(x=>x.split.vi)]:[],stimulus:skill==='listening'||skill==='speaking'?v.split:null,explanation:`${v.hanzi} (${v.pinyin}): ${v.vi}. ${v.note}`,evidence_index:skill==='reading'?i:null})),skill==='reading'?examples.map(v=>v.split):[]));
 }));}
