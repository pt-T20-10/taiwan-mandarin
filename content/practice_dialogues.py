"""Authored continuations of the original lesson introductions (draft)."""
TAILS = {
'greetings': [
'我也很高興認識你。|Wǒ yě hěn gāoxìng rènshì nǐ.|Tôi cũng rất vui được làm quen với bạn.',
'你在這裡學中文嗎？|Nǐ zài zhèlǐ xué Zhōngwén ma?|Bạn học tiếng Trung ở đây à?',
'對，我今天第一天上課。|Duì, wǒ jīntiān dì yī tiān shàngkè.|Đúng, hôm nay là ngày đầu tôi đi học.',
'我們一起去教室吧。|Wǒmen yīqǐ qù jiàoshì ba.|Chúng mình cùng đến phòng học nhé.',
'好，謝謝你。|Hǎo, xièxie nǐ.|Được, cảm ơn bạn.'],
'numbers': [
'在車站見面，好嗎？|Zài chēzhàn jiànmiàn, hǎo ma?|Gặp ở nhà ga nhé?',
'好。你坐幾號公車？|Hǎo. Nǐ zuò jǐ hào gōngchē?|Được. Bạn đi xe buýt số mấy?',
'我坐五號公車。|Wǒ zuò wǔ hào gōngchē.|Tôi đi xe buýt số năm.',
'我會早十分鐘到。|Wǒ huì zǎo shí fēnzhōng dào.|Tôi sẽ đến sớm mười phút.',
'好，等一下見。|Hǎo, děng yīxià jiàn.|Được, lát nữa gặp.'],
'food': [
'茶要熱的還是冰的？|Chá yào rè de háishì bīng de?|Trà nóng hay trà đá?',
'熱的，請不要加糖。|Rè de, qǐng bù yào jiā táng.|Trà nóng, xin đừng cho đường.',
'好的，要在這裡吃嗎？|Hǎo de, yào zài zhèlǐ chī ma?|Vâng, bạn ăn tại đây à?',
'對，我坐那邊。|Duì, wǒ zuò nàbiān.|Đúng, tôi ngồi bên kia.',
'好，請稍等。|Hǎo, qǐng shāo děng.|Vâng, xin chờ một chút.'],
'shopping': [
'這是兩百元。|Zhè shì liǎng bǎi yuán.|Đây là hai trăm đồng.',
'收你兩百元，找你一百元。|Shōu nǐ liǎng bǎi yuán, zhǎo nǐ yī bǎi yuán.|Nhận của bạn hai trăm, trả lại bạn một trăm đồng.',
'請問，這是今天的特價嗎？|Qǐngwèn, zhè shì jīntiān de tèjià ma?|Xin hỏi đây là giá khuyến mãi hôm nay à?',
'對，特價到今天晚上。|Duì, tèjià dào jīntiān wǎnshàng.|Đúng, khuyến mãi đến tối nay.',
'好的，謝謝你。|Hǎo de, xièxie nǐ.|Vâng, cảm ơn bạn.'],
'transport': [
'不客氣，你要去哪一站？|Bù kèqi, nǐ yào qù nǎ yī zhàn?|Không có gì, bạn muốn đến ga nào?',
'我要去臺北車站。|Wǒ yào qù Táiběi Chēzhàn.|Tôi muốn đến ga Đài Bắc.',
'你可以看站裡的路線圖。|Nǐ kěyǐ kàn zhàn lǐ de lùxiàntú.|Bạn có thể xem sơ đồ tuyến trong ga.',
'好，我有悠遊卡，可以用嗎？|Hǎo, wǒ yǒu yōuyóukǎ, kěyǐ yòng ma?|Vâng, tôi có thẻ EasyCard, dùng được không?',
'可以，進站的時候刷卡。|Kěyǐ, jìn zhàn de shíhou shuā kǎ.|Được, quẹt thẻ khi vào ga.'],
'family': [
'她是老師。|Tā shì lǎoshī.|Chị ấy là giáo viên.',
'她在哪裡工作？|Tā zài nǎlǐ gōngzuò?|Chị ấy làm việc ở đâu?',
'她在家附近的學校工作。|Tā zài jiā fùjìn de xuéxiào gōngzuò.|Chị ấy làm ở trường gần nhà.',
'你們常常一起吃飯嗎？|Nǐmen chángcháng yīqǐ chīfàn ma?|Các bạn có thường ăn cơm cùng nhau không?',
'對，我們晚上常常一起吃飯。|Duì, wǒmen wǎnshàng chángcháng yīqǐ chīfàn.|Có, chúng tôi thường ăn cơm tối cùng nhau.'],
'home': [
'一個月八千元。|Yī ge yuè bā qiān yuán.|Mỗi tháng tám nghìn đồng.',
'水電費也包含在裡面嗎？|Shuǐdiànfèi yě bāohán zài lǐmiàn ma?|Tiền điện nước cũng bao gồm trong đó à?',
'沒有，水電費另外算。|Méiyǒu, shuǐdiànfèi lìngwài suàn.|Không, tiền điện nước tính riêng.',
'我可以看看廚房嗎？|Wǒ kěyǐ kànkan chúfáng ma?|Tôi có thể xem bếp không?',
'可以，廚房在房間旁邊。|Kěyǐ, chúfáng zài fángjiān pángbiān.|Được, bếp ở bên cạnh phòng.'],
'schedule': [
'在哪裡見面？|Zài nǎlǐ jiànmiàn?|Gặp nhau ở đâu?',
'在學校門口見，好嗎？|Zài xuéxiào ménkǒu jiàn, hǎo ma?|Gặp ở cổng trường nhé?',
'好，我們要做什麼？|Hǎo, wǒmen yào zuò shénme?|Được, chúng mình sẽ làm gì?',
'先去圖書館，再一起吃晚餐。|Xiān qù túshūguǎn, zài yīqǐ chī wǎncān.|Đến thư viện trước, rồi cùng ăn tối.',
'好，明天見。|Hǎo, míngtiān jiàn.|Được, mai gặp.'],
'information': [
'可以，先直走，到路口再右轉。|Kěyǐ, xiān zhí zǒu, dào lùkǒu zài yòu zhuǎn.|Được, đi thẳng trước, đến ngã đường thì rẽ phải.',
'右轉以後就看得到了嗎？|Yòu zhuǎn yǐhòu jiù kàn de dào le ma?|Rẽ phải xong là nhìn thấy rồi à?',
'對，郵局就在右邊。|Duì, yóujú jiù zài yòubiān.|Đúng, bưu điện ở ngay bên phải.',
'謝謝，我明白了。|Xièxie, wǒ míngbái le.|Cảm ơn, tôi hiểu rồi.',
'不客氣。|Bù kèqi.|Không có gì.'],
'classroom': [
'好，請聽我再念一次。|Hǎo, qǐng tīng wǒ zài niàn yī cì.|Được, em nghe tôi đọc lại một lần nhé.',
'我聽懂了，可以自己造句嗎？|Wǒ tīng dǒng le, kěyǐ zìjǐ zàojù ma?|Em hiểu rồi, em tự đặt câu được không?',
'可以，請試試看。|Kěyǐ, qǐng shìshìkàn.|Được, em thử xem.',
'我想先把句子寫下來。|Wǒ xiǎng xiān bǎ jùzi xiě xiàlái.|Em muốn viết câu xuống trước.',
'沒問題，寫好以後再念。|Méi wèntí, xiě hǎo yǐhòu zài niàn.|Không sao, viết xong rồi đọc.'],
'daily': [
'好，我們幾點出發？|Hǎo, wǒmen jǐ diǎn chūfā?|Được, mấy giờ chúng mình xuất phát?',
'早上九點，可以嗎？|Zǎoshang jiǔ diǎn, kěyǐ ma?|Chín giờ sáng được không?',
'可以，我會帶毛巾。|Kěyǐ, wǒ huì dài máojīn.|Được, tôi sẽ mang khăn.',
'游泳以後一起吃午餐吧。|Yóuyǒng yǐhòu yīqǐ chī wǔcān ba.|Bơi xong cùng ăn trưa nhé.',
'好啊，明天見。|Hǎo a, míngtiān jiàn.|Được đấy, mai gặp.'],
'campus': [
'請先把報告草稿寄給我。|Qǐng xiān bǎ bàogào cǎogǎo jì gěi wǒ.|Em gửi bản nháp báo cáo cho tôi trước nhé.',
'好的，我今天晚上寄。|Hǎo de, wǒ jīntiān wǎnshàng jì.|Vâng, tối nay em gửi.',
'你有什麼問題想討論？|Nǐ yǒu shénme wèntí xiǎng tǎolùn?|Em có vấn đề gì muốn thảo luận?',
'我想請教您怎麼整理資料。|Wǒ xiǎng qǐngjiào nín zěnme zhěnglǐ zīliào.|Em muốn hỏi thầy cô cách sắp xếp tài liệu.',
'好，明天我們一起看。|Hǎo, míngtiān wǒmen yīqǐ kàn.|Được, ngày mai chúng ta cùng xem.'],
'health': [
'謝謝，我在這裡等。|Xièxie, wǒ zài zhèlǐ děng.|Cảm ơn, tôi chờ ở đây.',
'好，有問題可以到櫃臺問。|Hǎo, yǒu wèntí kěyǐ dào guìtái wèn.|Vâng, có thắc mắc thì bạn có thể hỏi ở quầy.'],
'renting': [
'好，我回去想一想，再跟你聯絡。|Hǎo, wǒ huíqù xiǎng yī xiǎng, zài gēn nǐ liánluò.|Được, tôi về suy nghĩ rồi liên lạc lại.',
'沒問題，這是我的電話號碼。|Méi wèntí, zhè shì wǒ de diànhuà hàomǎ.|Không sao, đây là số điện thoại của tôi.'],
'services': [
'好的，收據我會留著。|Hǎo de, shōujù wǒ huì liú zhe.|Vâng, tôi sẽ giữ biên nhận.',
'謝謝，請慢走。|Xièxie, qǐng màn zǒu.|Cảm ơn, chào bạn nhé.'],
'worklife': [
'請記得帶筆記型電腦。|Qǐng jìde dài bǐjìxíng diànnǎo.|Nhớ mang máy tính xách tay nhé.',
'好，我會一起帶過去。|Hǎo, wǒ huì yīqǐ dài guòqù.|Được, tôi sẽ mang theo.'],
'travel': [
'沒關係，我在門口等你。|Méi guānxi, wǒ zài ménkǒu děng nǐ.|Không sao, tôi chờ bạn ở cửa.',
'好了，我們走吧！|Hǎo le, wǒmen zǒu ba!|Xong rồi, chúng mình đi thôi!'],
'social': [
'謝謝你，我會把地址傳給你。|Xièxie nǐ, wǒ huì bǎ dìzhǐ chuán gěi nǐ.|Cảm ơn bạn, tôi sẽ gửi địa chỉ cho bạn.',
'好，星期六見！|Hǎo, xīngqí liù jiàn!|Được, thứ bảy gặp nhé!'],
}
