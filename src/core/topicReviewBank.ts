import type {TextItem} from './types';
export type ReviewFrame={line:TextItem;ask:string;values:TextItem[]};
const t=(hanzi:string,pinyin:string,vi:string):TextItem=>({hanzi,pinyin,vi});
const f=(hanzi:string,pinyin:string,vi:string,ask:string,values:string[]):ReviewFrame=>({line:t(hanzi,pinyin,vi),ask,values:values.map(v=>{const [h,p,m]=v.split('|');return t(h,p,m);})});
// Bounded authored substitutions: each slot contains interchangeable phrases.
// No LLM or character-by-character Pinyin inference is used during practice.
export const topicReviewFrames:Record<string,ReviewFrame[]>={
 'tw.greetings':[
  f('我是{0}人。','Wǒ shì {0} rén.','Tôi là người {0}.','Người này đến từ đâu?',['臺灣|Táiwān|Đài Loan','越南|Yuènán|Việt Nam','臺灣|Táiwān|Đài Loan']),
  f('我叫{0}。','Wǒ jiào {0}.','Tôi tên là {0}.','Người này tên là gì?',['小安|Xiǎo Ān|Tiểu An','小明|Xiǎo Míng|Tiểu Minh','小美|Xiǎo Měi|Tiểu Mỹ']),
 ],
 'tw.numbers':[
  f('我們{0}見面。','Wǒmen {0} jiànmiàn.','Chúng ta gặp nhau lúc {0}.','Cuộc gặp diễn ra lúc mấy giờ?',['三點半|sān diǎn bàn|ba giờ rưỡi','五點十分|wǔ diǎn shí fēn|năm giờ mười','七點半|qī diǎn bàn|bảy giờ rưỡi']),
  f('我{0}睡覺。','Wǒ {0} shuìjiào.','Tôi đi ngủ lúc {0}.','Người này đi ngủ lúc mấy giờ?',['九點|jiǔ diǎn|chín giờ','十點|shí diǎn|mười giờ','十點半|shí diǎn bàn|mười giờ rưỡi']),
 ],
 'tw.food':[
  f('我要吃{0}，不要辣。','Wǒ yào chī {0}, bù yào là.','Tôi muốn ăn {0}, không cay.','Người này chọn món gì, không cay?',['飯|fàn|cơm','麵|miàn|mì','早餐|zǎocān|bữa sáng']),
  f('我不要咖啡，我要喝{0}。','Wǒ bù yào kāfēi, wǒ yào hē {0}.','Tôi không muốn cà phê, tôi muốn uống {0}.','Đồ uống được chọn thay cà phê là gì?',['茶|chá|trà','水|shuǐ|nước','牛奶|niúnǎi|sữa']),
 ],
 'tw.shopping':[
  f('我想去{0}買水果。','Wǒ xiǎng qù {0} mǎi shuǐguǒ.','Tôi muốn đến {0} mua trái cây.','Người này định mua trái cây ở đâu?',['超市|chāoshì|siêu thị','商店|shāngdiàn|cửa hàng','便利商店|biànlì shāngdiàn|cửa hàng tiện lợi']),
  f('這個袋子{0}。','Zhège dàizi {0}.','Chiếc túi này giá {0}.','Chiếc túi giá bao nhiêu?',['五塊|wǔ kuài|năm Đài tệ','十塊|shí kuài|mười Đài tệ','三塊|sān kuài|ba Đài tệ']),
 ],
 'tw.transport':[
  f('我坐{0}到車站。','Wǒ zuò {0} dào chēzhàn.','Tôi đi {0} đến nhà ga.','Người này đến nhà ga bằng phương tiện nào?',['公車|gōngchē|xe buýt','捷運|jiéyùn|MRT','計程車|jìchéngchē|taxi']),
  f('便利商店在車站{0}。','Biànlì shāngdiàn zài chēzhàn {0}.','Cửa hàng tiện lợi ở {0} nhà ga.','Cửa hàng nằm ở vị trí nào so với nhà ga?',['左邊|zuǒbiān|bên trái','右邊|yòubiān|bên phải','前面|qiánmiàn|phía trước']),
 ],
 'tw.family':[
  f('我{0}，沒有妹妹。','Wǒ {0}, méiyǒu mèimei.','Tôi {0}, không có em gái.','Người này có anh chị em nào?',['有哥哥|yǒu gēge|có anh trai','有姐姐|yǒu jiějie|có chị gái','有弟弟|yǒu dìdi|có em trai']),
  f('我的朋友喜歡{0}。','Wǒ de péngyǒu xǐhuān {0}.','Bạn tôi thích {0}.','Sở thích của người bạn là gì?',['喝茶|hē chá|uống trà','吃麵|chī miàn|ăn mì','聊天|liáotiān|trò chuyện']),
 ],
 'tw.home':[
  f('我想住{0}的房間。','Wǒ xiǎng zhù {0} de fángjiān.','Tôi muốn ở căn phòng {0}.','Người này muốn phòng có đặc điểm gì?',['安靜|ānjìng|yên tĩnh','乾淨|gānjìng|sạch sẽ','大|dà|rộng']),
  f('房間裡有{0}，沒有冷氣。','Fángjiān lǐ yǒu {0}, méiyǒu lěngqì.','Trong phòng có {0}, không có máy lạnh.','Trong căn phòng không có máy lạnh này có gì?',['桌子|zhuōzi|bàn','椅子|yǐzi|ghế','床|chuáng|giường']),
 ],
 'tw.schedule':[
  f('我從{0}上課。','Wǒ cóng {0} shàngkè.','Tôi học từ {0}.','Khoảng thời gian học là khi nào?',['九點到十點|jiǔ diǎn dào shí diǎn|chín đến mười giờ','三點到五點|sān diǎn dào wǔ diǎn|ba đến năm giờ','七點到九點|qī diǎn dào jiǔ diǎn|bảy đến chín giờ','三點到四點|sān diǎn dào sì diǎn|ba đến bốn giờ']),
  f('我{0}有空。','Wǒ {0} yǒukòng.','Tôi rảnh vào {0}.','Có thể hẹn người này vào thời gian nào?',['下午|xiàwǔ|buổi chiều','晚上|wǎnshàng|buổi tối','週末|zhōumò|cuối tuần']),
 ],
 'tw.information':[
  f('請問，{0}在哪裡？','Qǐngwèn, {0} zài nǎlǐ?','Xin hỏi, {0} ở đâu?','Người này cần tìm nơi nào?',['郵局|yóujú|bưu điện','醫院|yīyuàn|bệnh viện','服務臺|fúwùtái|quầy thông tin']),
  f('因為我不知道{0}，所以想問你。','Yīnwèi wǒ bù zhīdào {0}, suǒyǐ xiǎng wèn nǐ.','Vì tôi không biết {0}, nên muốn hỏi bạn.','Thông tin còn thiếu là gì?',['地址|dìzhǐ|địa chỉ','電話|diànhuà|số điện thoại','名字|míngzi|tên']),
 ],
 'tw.classroom':[
  f('這個{0}的意思，我不懂。','Zhège {0} de yìsi, wǒ bù dǒng.','Tôi không hiểu nghĩa của {0} này.','Người học chưa hiểu nghĩa của gì?',['字|zì|chữ','詞|cí|từ','句子|jùzi|câu']),
  f('請再{0}。','Qǐng zài {0}.','Xin {0} lại.','Người học muốn được hỗ trợ bằng cách nào?',['說一次|shuō yī cì|nói một lần','寫一次|xiě yī cì|viết một lần','讀一次|dú yī cì|đọc một lần']),
 ],
 'tw.daily':[
  f('我已經{0}了。','Wǒ yǐjīng {0} le.','Tôi đã {0} rồi.','Việc nào đã hoàn tất?',['洗澡|xǐzǎo|tắm','回家|huíjiā|về nhà','起床|qǐchuáng|thức dậy']),
  f('我會{0}，你呢？','Wǒ huì {0}, nǐ ne?','Tôi biết {0}, còn bạn?','Người này biết làm gì?',['游泳|yóuyǒng|bơi','說中文|shuō Zhōngwén|nói tiếng Trung','寫中文|xiě Zhōngwén|viết tiếng Trung']),
 ],
 'tw.campus':[
  f('我明天跟{0}見面。','Wǒ míngtiān gēn {0} jiànmiàn.','Ngày mai tôi gặp {0}.','Người này sẽ gặp ai vào ngày mai?',['教授|jiàoshòu|giáo sư','老師|lǎoshī|thầy/cô','同學|tóngxué|bạn học']),
  f('我需要{0}，請幫忙。','Wǒ xūyào {0}, qǐng bāngmáng.','Tôi cần {0}, xin giúp đỡ.','Người này cần hỗ trợ việc gì?',['借書|jiè shū|mượn sách','還書|huán shū|trả sách','準備報告|zhǔnbèi bàogào|chuẩn bị báo cáo']),
 ],
 'tw.health':[
  f('我有點{0}，想去看病。','Wǒ yǒudiǎn {0}, xiǎng qù kànbìng.','Tôi hơi {0}, muốn đi khám.','Vì biểu hiện nào mà người này muốn đi khám?',['頭痛|tóutòng|đau đầu','累|lèi|mệt','不舒服|bù shūfu|khó chịu trong người']),
  f('我的{0}很痛。','Wǒ de {0} hěn tòng.','{0} của tôi rất đau.','Người này đau ở đâu?',['喉嚨|hóulóng|cổ họng','肚子|dùzi|bụng','頭|tóu|đầu']),
 ],
 'tw.renting':[
  f('這間套房比那間{0}。','Zhè jiān tàofáng bǐ nà jiān {0}.','Phòng khép kín này {0} hơn phòng kia.','Điểm khác nhau giữa hai phòng là gì?',['大|dà|rộng','安靜|ānjìng|yên tĩnh','便宜|piányí|rẻ']),
  f('我家的{0}壞了，需要修理。','Wǒ jiā de {0} huài le, xūyào xiūlǐ.','{0} nhà tôi hỏng rồi, cần sửa.','Thiết bị nào cần sửa?',['冰箱|bīngxiāng|tủ lạnh','洗衣機|xǐyījī|máy giặt','冷氣|lěngqì|máy lạnh']),
 ],
 'tw.services':[
  f('我想寄{0}。','Wǒ xiǎng jì {0}.','Tôi muốn gửi {0}.','Người này muốn gửi gì?',['包裹|bāoguǒ|bưu kiện','一封信|yī fēng xìn|một lá thư','兩封信|liǎng fēng xìn|hai lá thư']),
  f('請先{0}，再付款。','Qǐng xiān {0}, zài fùkuǎn.','Xin {0} trước, rồi thanh toán.','Việc nào phải làm trước khi thanh toán?',['填寫表格|tiánxiě biǎogé|điền biểu mẫu','簽名|qiānmíng|ký tên','排隊|páiduì|xếp hàng']),
 ],
 'tw.worklife':[
  f('我明天得{0}。','Wǒ míngtiān děi {0}.','Ngày mai tôi phải {0}.','Ngày mai người này phải làm gì?',['加班|jiābān|tăng ca','開會|kāihuì|họp','上班|shàngbān|đi làm']),
  f('我正在{0}，請等一下。','Wǒ zhèngzài {0}, qǐng děng yīxià.','Tôi đang {0}, xin đợi một chút.','Việc nào đang diễn ra?',['檢查資料|jiǎnchá zīliào|kiểm tra tài liệu','準備會議|zhǔnbèi huìyì|chuẩn bị cuộc họp','聯絡同事|liánluò tóngshì|liên lạc với đồng nghiệp']),
 ],
 'tw.travel':[
  f('我去過{0}，還想再去。','Wǒ qù guò {0}, hái xiǎng zài qù.','Tôi từng đến {0}, vẫn muốn đến lần nữa.','Người này từng đến đâu?',['臺灣|Táiwān|Đài Loan','海邊|hǎibiān|bờ biển','那個景點|nàge jǐngdiǎn|điểm tham quan kia']),
  f('我們快要{0}了。','Wǒmen kuàiyào {0} le.','Chúng tôi sắp {0}.','Việc gì sắp diễn ra?',['出發|chūfā|khởi hành','抵達|dǐdá|đến nơi','退房|tuìfáng|trả phòng']),
 ],
 'tw.social':[
  f('雖然我很忙，但是想{0}。','Suīrán wǒ hěn máng, dànshì xiǎng {0}.','Tuy tôi rất bận nhưng vẫn muốn {0}.','Dù bận, người này vẫn muốn làm gì?',['參加活動|cānjiā huódòng|tham gia hoạt động','跟你聊天|gēn nǐ liáotiān|trò chuyện với bạn','去聚餐|qù jùcān|đi ăn cùng mọi người']),
  f('你想{0}，還是去喝茶？','Nǐ xiǎng {0}, háishi qù hē chá?','Bạn muốn {0} hay đi uống trà?','Ngoài uống trà, lựa chọn còn lại là gì?',['一起吃飯|yīqǐ chī fàn|ăn cơm cùng nhau','去看電影|qù kàn diànyǐng|đi xem phim','去逛街|qù guàngjiē|đi dạo phố']),
 ],
};
