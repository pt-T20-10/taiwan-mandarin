"""Original A2-oriented Taiwan daily-life lessons; not CEFR certification.

Pinyin uses dictionary tones for 一/不; connected-speech notes are separate.
References identify constructions/readings, not teacher approval of all examples.
"""
UNITS = [
('health','Sức khỏe và đi khám','Mô tả khó chịu, đặt lịch và trao đổi cơ bản ở phòng khám.','病','''身體|shēntǐ|cơ thể; sức khỏe
不舒服|bù shūfu|không khỏe; khó chịu
感冒|gǎnmào|cảm lạnh
發燒|fāshāo|sốt
咳嗽|késòu|ho
頭痛|tóutòng|đau đầu
肚子|dùzi|bụng
喉嚨|hóulóng|cổ họng
痛|tòng|đau
累|lèi|mệt
診所|zhěnsuǒ|phòng khám
醫生|yīshēng|bác sĩ
護士|hùshì|y tá; điều dưỡng
掛號|guàhào|đăng ký khám
健保卡|jiànbǎokǎ|thẻ bảo hiểm y tế Đài Loan
藥|yào|thuốc
藥局|yàojú|nhà thuốc
看病|kànbìng|đi khám bệnh
量體溫|liáng tǐwēn|đo nhiệt độ cơ thể
嚴重|yánzhòng|nghiêm trọng''', [
('我有點累。','Wǒ yǒudiǎn lèi.','Tôi hơi mệt.','有點 thường đứng trước tính từ chỉ trạng thái không như mong muốn.'),
('今天太熱了。','Jīntiān tài rè le.','Hôm nay nóng quá.','太…了 nhấn mạnh mức độ cao; có thể là than phiền hoặc lời khen theo ngữ cảnh.')], [
('你好，我想掛號。','Nǐ hǎo, wǒ xiǎng guàhào.','Chào bạn, tôi muốn đăng ký khám.'),
('請問你哪裡不舒服？','Qǐngwèn nǐ nǎlǐ bù shūfu?','Xin hỏi bạn thấy khó chịu ở đâu?'),
('我有點頭痛，也有點累。','Wǒ yǒudiǎn tóutòng, yě yǒudiǎn lèi.','Tôi hơi đau đầu và hơi mệt.'),
('請先給我你的健保卡。','Qǐng xiān gěi wǒ nǐ de jiànbǎokǎ.','Xin đưa tôi thẻ bảo hiểm y tế của bạn trước.'),
('好的。今天人太多了！','Hǎo de. Jīntiān rén tài duō le!','Vâng. Hôm nay đông người quá!'),
('請坐一下，護士等一下會叫你的名字。','Qǐng zuò yīxià, hùshì děng yīxià huì jiào nǐ de míngzi.','Bạn ngồi một lát nhé, điều dưỡng sẽ gọi tên bạn sau.')], 'Viết ba câu mô tả trạng thái của bạn và nhờ đặt lịch khám; không cần nêu thông tin sức khỏe thật.'),
('renting','Thuê nhà và sửa chữa','So sánh phòng, hỏi điều kiện thuê và báo đồ dùng bị hỏng.','租','''租屋|zūwū|thuê nhà
套房|tàofáng|phòng khép kín
雅房|yǎfáng|phòng dùng chung phòng tắm
押金|yājīn|tiền đặt cọc
合約|héyuē|hợp đồng
租金|zūjīn|tiền thuê
水電費|shuǐdiànfèi|tiền nước và điện
管理費|guǎnlǐfèi|phí quản lý
電梯|diàntī|thang máy
樓層|lóucéng|tầng nhà
陽臺|yángtái|ban công
家具|jiājù|đồ nội thất
冰箱|bīngxiāng|tủ lạnh
洗衣機|xǐyījī|máy giặt
熱水|rèshuǐ|nước nóng
壞了|huài le|bị hỏng rồi
修理|xiūlǐ|sửa chữa
漏水|lòushuǐ|rò nước; dột
搬家|bānjiā|chuyển nhà
垃圾|lèsè|rác''', [
('這間套房比那間大。','Zhè jiān tàofáng bǐ nà jiān dà.','Phòng khép kín này lớn hơn phòng kia.','A 比 B + tính từ dùng để so sánh mức độ; không thêm 很 trước tính từ trong mẫu cơ bản.'),
('這間雅房沒有那間安靜。','Zhè jiān yǎfáng méiyǒu nà jiān ānjìng.','Phòng này không yên tĩnh bằng phòng kia.','A 沒有 B + tính từ diễn đạt A không bằng B về một đặc điểm.')], [
('這間套房的租金是多少？','Zhè jiān tàofáng de zūjīn shì duōshǎo?','Tiền thuê phòng khép kín này là bao nhiêu?'),
('一個月九千元，水電費另外算。','Yī ge yuè jiǔ qiān yuán, shuǐdiànfèi lìngwài suàn.','Mỗi tháng chín nghìn đài tệ, tiền nước điện tính riêng.'),
('這間比我現在住的房間大。','Zhè jiān bǐ wǒ xiànzài zhù de fángjiān dà.','Phòng này lớn hơn phòng tôi đang ở.'),
('對，也有冰箱和洗衣機。','Duì, yě yǒu bīngxiāng hé xǐyījī.','Đúng vậy, cũng có tủ lạnh và máy giặt.'),
('可是這裡沒有那邊安靜。','Kěshì zhèlǐ méiyǒu nàbiān ānjìng.','Nhưng ở đây không yên tĩnh bằng bên kia.'),
('你可以再看看，明天再決定。','Nǐ kěyǐ zài kànkan, míngtiān zài juédìng.','Bạn có thể xem thêm, ngày mai hãy quyết định.')], 'Viết ba câu so sánh hai phòng và hỏi về một khoản phí. Số tiền trong bài chỉ là tình huống giả định.'),
('services','Dịch vụ đời sống','Gửi hàng, điền thông tin và nhờ nhân viên hỗ trợ.','寄','''包裹|bāoguǒ|bưu kiện
郵票|yóupiào|tem thư
信封|xìnfēng|phong bì
運費|yùnfèi|phí vận chuyển
寄件人|jìjiànrén|người gửi
收件人|shōujiànrén|người nhận
填寫|tiánxiě|điền thông tin
表格|biǎogé|biểu mẫu
簽名|qiānmíng|ký tên; chữ ký
櫃臺|guìtái|quầy giao dịch
排隊|páiduì|xếp hàng
領取|lǐngqǔ|nhận; lĩnh
通知|tōngzhī|thông báo
證件|zhèngjiàn|giấy tờ tùy thân
影印|yǐngyìn|photocopy
申請|shēnqǐng|đăng ký; nộp đơn
手續|shǒuxù|thủ tục
取件|qǔjiàn|nhận hàng
付款|fùkuǎn|thanh toán
收據|shōujù|biên nhận''', [
('請先填表格，再去櫃臺。','Qǐng xiān tián biǎogé, zài qù guìtái.','Xin điền biểu mẫu trước rồi đến quầy.','先…再… sắp xếp hai hành động theo trình tự.'),
('請等一下。','Qǐng děng yīxià.','Xin đợi một lát.','Động từ + 一下 diễn đạt hành động ngắn hoặc làm lời nhờ nhẹ nhàng hơn.')], [
('你好，我想寄這個包裹。','Nǐ hǎo, wǒ xiǎng jì zhège bāoguǒ.','Chào bạn, tôi muốn gửi bưu kiện này.'),
('請先填表格，再到這個櫃臺付款。','Qǐng xiān tián biǎogé, zài dào zhège guìtái fùkuǎn.','Xin điền biểu mẫu trước rồi thanh toán ở quầy này.'),
('收件人的電話要寫嗎？','Shōujiànrén de diànhuà yào xiě ma?','Có cần ghi số điện thoại người nhận không?'),
('要，請寫在地址下面。','Yào, qǐng xiě zài dìzhǐ xiàmiàn.','Có, xin ghi ở dưới địa chỉ.'),
('麻煩你幫我看一下。','Máfan nǐ bāng wǒ kàn yīxià.','Phiền bạn xem giúp tôi một chút.'),
('資料都對了，這是你的收據。','Zīliào dōu duì le, zhè shì nǐ de shōujù.','Thông tin đều đúng rồi, đây là biên nhận của bạn.')], 'Viết hướng dẫn hai bước gửi một bưu kiện và một câu nhờ kiểm tra thông tin.'),
('worklife','Công việc và lịch hẹn','Trao đổi ca làm, nhiệm vụ và việc đang thực hiện.','班','''公司|gōngsī|công ty
同事|tóngshì|đồng nghiệp
主管|zhǔguǎn|người phụ trách; cấp trên
上班|shàngbān|đi làm
下班|xiàbān|tan làm
加班|jiābān|làm thêm giờ
請假|qǐngjià|xin nghỉ
排班|páibān|xếp ca làm
早班|zǎobān|ca sáng
晚班|wǎnbān|ca tối
開會|kāihuì|họp
會議|huìyì|cuộc họp
行程|xíngchéng|lịch trình
改期|gǎiqí|đổi ngày hẹn
遲到|chídào|đến muộn
準時|zhǔnshí|đúng giờ
完成|wánchéng|hoàn thành
檢查|jiǎnchá|kiểm tra
聯絡|liánluò|liên lạc
訊息|xùnxí|tin nhắn; thông tin''', [
('我明天得上早班。','Wǒ míngtiān děi shàng zǎobān.','Ngày mai tôi phải làm ca sáng.','得 đọc děi khi chỉ sự cần thiết; đứng trước động từ, khác 得 de trong bổ ngữ.'),
('同事正在開會。','Tóngshì zhèngzài kāihuì.','Đồng nghiệp đang họp.','正在 đứng trước hành động đang diễn ra tại thời điểm được nói đến.')], [
('明天早上可以開會嗎？','Míngtiān zǎoshang kěyǐ kāihuì ma?','Sáng mai họp được không?'),
('我明天得上早班，下午比較方便。','Wǒ míngtiān děi shàng zǎobān, xiàwǔ bǐjiào fāngbiàn.','Mai tôi phải làm ca sáng, buổi chiều tiện hơn.'),
('那我們改成下午兩點，好嗎？','Nà wǒmen gǎi chéng xiàwǔ liǎng diǎn, hǎo ma?','Vậy đổi thành hai giờ chiều nhé?'),
('好，我現在正在檢查資料。','Hǎo, wǒ xiànzài zhèngzài jiǎnchá zīliào.','Được, giờ tôi đang kiểm tra tài liệu.'),
('完成以後，請傳訊息給我。','Wánchéng yǐhòu, qǐng chuán xùnxí gěi wǒ.','Sau khi xong, nhắn tin cho tôi nhé.'),
('沒問題，我會準時到。','Méi wèntí, wǒ huì zhǔnshí dào.','Không vấn đề gì, tôi sẽ đến đúng giờ.')], 'Viết một tin nhắn nêu việc đang làm và đề nghị đổi lịch hẹn.'),
('travel','Du lịch và trải nghiệm','Đặt phòng, kể trải nghiệm và nói kế hoạch sắp xảy ra.','旅','''旅行|lǚxíng|du lịch; đi xa
旅館|lǚguǎn|khách sạn; nhà nghỉ
民宿|mínsù|nhà nghỉ kiểu homestay
訂房|dìngfáng|đặt phòng
入住|rùzhù|nhận phòng; vào ở
退房|tuìfáng|trả phòng
護照|hùzhào|hộ chiếu
行李|xínglǐ|hành lý
雙人房|shuāngrénfáng|phòng hai người
單人房|dānrénfáng|phòng một người
景點|jǐngdiǎn|điểm tham quan
門票|ménpiào|vé vào cửa
導覽|dǎolǎn|hướng dẫn tham quan
拍照|pāizhào|chụp ảnh
風景|fēngjǐng|phong cảnh
海邊|hǎibiān|bờ biển
爬山|páshān|leo núi
出發|chūfā|khởi hành
抵達|dǐdá|đến nơi
紀念品|jìniànpǐn|đồ lưu niệm''', [
('我去過臺南。','Wǒ qù guò Táinán.','Tôi từng đến Đài Nam.','V + 過 diễn đạt đã có trải nghiệm; phủ định dùng 沒 + V + 過.'),
('我們快要出發了。','Wǒmen kuàiyào chūfā le.','Chúng tôi sắp khởi hành rồi.','快要…了 nói sự việc sắp xảy ra; không dùng như dấu hiệu quá khứ.')], [
('你去過臺南嗎？','Nǐ qù guò Táinán ma?','Bạn từng đến Đài Nam chưa?'),
('去過一次，我很喜歡那裡的風景。','Qù guò yī cì, wǒ hěn xǐhuān nàlǐ de fēngjǐng.','Từng đi một lần, tôi rất thích phong cảnh ở đó.'),
('我們這次住旅館還是民宿？','Wǒmen zhè cì zhù lǚguǎn háishì mínsù?','Lần này mình ở khách sạn hay homestay?'),
('我已經訂好民宿了。','Wǒ yǐjīng dìng hǎo mínsù le.','Tôi đặt homestay xong rồi.'),
('太好了！我們快要出發了。','Tài hǎo le! Wǒmen kuàiyào chūfā le.','Tốt quá! Chúng ta sắp khởi hành rồi.'),
('等一下，我還沒拿行李。','Děng yīxià, wǒ hái méi ná xínglǐ.','Đợi một chút, tôi còn chưa lấy hành lý.')], 'Viết ba câu kể một trải nghiệm du lịch và kế hoạch sắp tới; có thể dùng tình huống tưởng tượng.'),
('social','Giao tiếp xã hội','Mời bạn, chọn hoạt động, từ chối lịch sự và giải thích.','友','''邀請|yāoqǐng|mời
聚餐|jùcān|ăn uống cùng nhau; liên hoan
約會|yuēhuì|hẹn gặp; hẹn hò
生日|shēngrì|sinh nhật
禮物|lǐwù|quà tặng
祝福|zhùfú|chúc phúc; lời chúc
恭喜|gōngxǐ|chúc mừng
參加|cānjiā|tham gia
活動|huódòng|hoạt động; sự kiện
聊天|liáotiān|trò chuyện
介紹|jièshào|giới thiệu
客人|kèrén|khách
主人|zhǔrén|chủ nhà; người tiếp khách
打擾|dǎrǎo|làm phiền
抱歉|bàoqiàn|xin lỗi; áy náy
可惜|kěxí|tiếc
下次|xià cì|lần sau
決定|juédìng|quyết định
建議|jiànyì|đề nghị; gợi ý
同意|tóngyì|đồng ý''', [
('你想喝茶還是咖啡？','Nǐ xiǎng hē chá háishì kāfēi?','Bạn muốn uống trà hay cà phê?','還是 nối các lựa chọn trong câu hỏi; mẫu lựa chọn trực tiếp thường không thêm 嗎.'),
('雖然今天很忙，但是我很開心。','Suīrán jīntiān hěn máng, dànshì wǒ hěn kāixīn.','Tuy hôm nay bận nhưng tôi rất vui.','雖然…但是… nối hai ý có quan hệ nhượng bộ, khác quan hệ nguyên nhân–kết quả.')], [
('星期六是我的生日，你可以來嗎？','Xīngqíliù shì wǒ de shēngrì, nǐ kěyǐ lái ma?','Thứ Bảy là sinh nhật tôi, bạn đến được không?'),
('謝謝你的邀請！你想在家聚餐還是去餐廳？','Xièxie nǐ de yāoqǐng! Nǐ xiǎng zài jiā jùcān háishì qù cāntīng?','Cảm ơn lời mời! Bạn muốn ăn cùng nhau ở nhà hay ra nhà hàng?'),
('在家比較方便，我會準備晚餐。','Zài jiā bǐjiào fāngbiàn, wǒ huì zhǔnbèi wǎncān.','Ở nhà tiện hơn, tôi sẽ chuẩn bị bữa tối.'),
('雖然我下午得上班，但是晚上可以來。','Suīrán wǒ xiàwǔ děi shàngbān, dànshì wǎnshang kěyǐ lái.','Tuy chiều tôi phải đi làm nhưng tối có thể đến.'),
('太好了！晚上七點見。','Tài hǎo le! Wǎnshang qī diǎn jiàn.','Tốt quá! Bảy giờ tối gặp nhé.'),
('好，祝你生日快樂！','Hǎo, zhù nǐ shēngrì kuàilè!','Được, chúc bạn sinh nhật vui vẻ!')], 'Viết lời mời có hai lựa chọn và một câu nhận lời hoặc từ chối lịch sự.')
]

READING={
'health':('Nhân viên yêu cầu đưa gì trước?','Thẻ bảo hiểm y tế',['Hộ chiếu','Tiền thuê nhà','Vé tàu'],'請先給我你的健保卡: đưa thẻ bảo hiểm y tế trước.'),
'renting':('Tiền nước điện trong cuộc trao đổi được tính thế nào?','Tính riêng ngoài tiền thuê',['Đã gồm trong tiền thuê','Không cần trả','Chỉ trả tiền nước'],'水電費另外算: tiền nước và điện tính riêng.'),
'services':('Sau khi điền biểu mẫu, người gửi phải làm gì?','Đến quầy này thanh toán',['Về nhà chờ','Gọi cho người nhận','Mua một cuốn sách'],'再到這個櫃臺付款: sau đó đến quầy này thanh toán.'),
'worklife':('Cuộc họp được đổi sang lúc nào?','Hai giờ chiều mai',['Hai giờ chiều nay','Chín giờ sáng mai','Bảy giờ tối mai'],'明天…改成下午兩點: đổi sang hai giờ chiều ngày mai.'),
'travel':('Lần này họ đã đặt chỗ ở đâu?','Homestay',['Khách sạn','Ký túc xá','Nhà bạn'],'我已經訂好民宿了: đã đặt homestay xong.'),
'social':('Người được mời có thể đến khi nào?','Bảy giờ tối thứ Bảy',['Chiều thứ Sáu','Sáng thứ Bảy','Bảy giờ sáng Chủ nhật'],'星期六…晚上七點見: hẹn bảy giờ tối thứ Bảy.')}

# ID -> title, pattern, restriction, wrong sentence, correction/example 2,
# example 3, cloze, missing, TBCL reference IDs, group, prerequisite IDs.
SPECS={
'tw.health.g.1':('Hơi: 有點','有點 + tính từ','Thường biểu thị cảm giác không mong muốn; đừng nhầm với 一點 + danh từ chỉ một ít.','我累有點。','我有點累。|Wǒ yǒudiǎn lèi.|Tôi hơi mệt.','今天我有點不舒服。|Jīntiān wǒ yǒudiǎn bù shūfu.|Hôm nay tôi hơi không khỏe.','今天我___不舒服。','有點',[], 'Câu cơ bản',['tw.home.g.1']),
'tw.health.g.2':('Mức độ cao: 太…了','太 + tính từ + 了','Có thể khen hoặc than phiền. 了 ở đây không tự mang nghĩa đã làm trong quá khứ.','今天熱太了。','今天太熱了。|Jīntiān tài rè le.|Hôm nay nóng quá.','這裡太吵了。|Zhèlǐ tài chǎo le.|Ở đây ồn quá.','這裡___吵了。','太',[80], 'Câu cơ bản',['tw.home.g.1']),
'tw.renting.g.1':('So sánh hơn: 比','A + 比 + B + tính từ','Trong mẫu cơ bản không thêm 很 trước tính từ; phải rõ hai đối tượng được so sánh.','這間比那間很大。','這間比那間大。|Zhè jiān bǐ nà jiān dà.|Phòng này lớn hơn phòng kia.','這裡比那裡安靜。|Zhèlǐ bǐ nàlǐ ānjìng.|Ở đây yên tĩnh hơn ở kia.','這裡___那裡安靜。','比',[94], 'So sánh và câu phức',['tw.home.g.1']),
'tw.renting.g.2':('Không bằng: 沒有','A + 沒有 + B + tính từ','Đây là so sánh, khác 沒有 + danh từ chỉ không có; không thêm 很 trong mẫu cơ bản.','這間沒有比那間安靜。','這間沒有那間安靜。|Zhè jiān méiyǒu nà jiān ānjìng.|Phòng này không yên tĩnh bằng phòng kia.','這裡沒有那裡方便。|Zhèlǐ méiyǒu nàlǐ fāngbiàn.|Ở đây không tiện bằng ở kia.','這裡___那裡方便。','沒有',[123], 'So sánh và câu phức',['tw.renting.g.1']),
'tw.services.g.1':('Trình tự: 先…再…','先 + hành động 1，再 + hành động 2','再 chỉ bước tiếp theo trong mẫu này, không nhất thiết là làm lại việc cũ.','請再填表格，先去櫃臺。','請先填表格，再去櫃臺。|Qǐng xiān tián biǎogé, zài qù guìtái.|Xin điền biểu mẫu trước rồi đến quầy.','我先排隊，再付款。|Wǒ xiān páiduì, zài fùkuǎn.|Tôi xếp hàng trước rồi thanh toán.','我先排隊，___付款。','再',[133], 'Thời–thể và bổ ngữ',['tw.classroom.g.1']),
'tw.services.g.2':('Hành động ngắn: 一下','Động từ + 一下','Không phải mọi động từ đều dùng tự nhiên với 一下. Thường dùng trong lời nhờ như 看一下, 等一下; 一 vẫn ghi thanh từ điển, khi nói trước 下 đọc yí.','請一下等。','請等一下。|Qǐng děng yīxià.|Xin đợi một lát.','請看一下這張表格。|Qǐng kàn yīxià zhè zhāng biǎogé.|Xin xem biểu mẫu này một chút.','請看___這張表格。','一下',[136], 'Thời–thể và bổ ngữ',['tw.information.g.1']),
'tw.worklife.g.1':('Cần phải: 得 děi','Chủ ngữ + 得 + động từ','得 ở đây đọc děi; khác 得 de nối bổ ngữ. Phủ định nghĩa không cần dùng 不用/不必, không ghép 不得 để diễn đạt ý đó.','我明天上得早班。','我明天得上早班。|Wǒ míngtiān děi shàng zǎobān.|Ngày mai tôi phải làm ca sáng.','我現在得去公司。|Wǒ xiànzài děi qù gōngsī.|Bây giờ tôi phải đến công ty.','我現在___去公司。','得',[], 'Câu cơ bản',['tw.shopping.g.2']),
'tw.worklife.g.2':('Đang: 正在','Chủ ngữ + 正在 + động từ','Dùng cho hành động đang diễn ra; không đặt sau động từ và không dùng tùy ý với trạng thái sở hữu.','同事開會正在。','同事正在開會。|Tóngshì zhèngzài kāihuì.|Đồng nghiệp đang họp.','我正在寫訊息。|Wǒ zhèngzài xiě xùnxí.|Tôi đang viết tin nhắn.','我___寫訊息。','正在',[43], 'Thời–thể và bổ ngữ',['tw.numbers.g.2']),
'tw.travel.g.1':('Trải nghiệm: 過','Chủ ngữ + động từ + 過 + tân ngữ','Phủ định trải nghiệm bằng 沒 + V + 過; phân biệt với chỉ kể một sự việc xảy ra tại thời điểm cụ thể.','我不去過臺南。','我沒去過臺南。|Wǒ méi qù guò Táinán.|Tôi chưa từng đến Đài Nam.','她住過這間旅館。|Tā zhù guò zhè jiān lǚguǎn.|Cô ấy từng ở khách sạn này.','她住___這間旅館。','過',[30,108], 'Thời–thể và bổ ngữ',['tw.daily.g.1']),
'tw.travel.g.2':('Sắp: 快要…了','Chủ ngữ + 快要 + sự việc + 了','Diễn đạt sự việc sắp xảy ra so với mốc đang nói; không dùng mẫu này để kể một việc đã hoàn tất. Với giờ cụ thể, ưu tiên mẫu 要…了 (明天三點要出發了).','我們快要出發的。','我們快要出發了。|Wǒmen kuàiyào chūfā le.|Chúng tôi sắp khởi hành rồi.','火車快要到了。|Huǒchē kuàiyào dào le.|Tàu sắp đến rồi.','火車___到了。','快要',[135], 'Thời–thể và bổ ngữ',['tw.daily.g.1']),
'tw.social.g.1':('Chọn A hay B: 還是','Lựa chọn A + 還是 + lựa chọn B','Câu hỏi lựa chọn trực tiếp dùng 還是; mẫu đang học không cần thêm 嗎. 或者 thường dùng để nêu lựa chọn trong câu trần thuật.','你想喝茶或者咖啡？','你想喝茶還是咖啡？|Nǐ xiǎng hē chá háishì kāfēi?|Bạn muốn uống trà hay cà phê?','你想在家吃還是去餐廳吃？|Nǐ xiǎng zài jiā chī háishì qù cāntīng chī?|Bạn muốn ăn ở nhà hay ra nhà hàng?','你想在家吃___去餐廳吃？','還是',[81], 'So sánh và câu phức',['tw.greetings.g.2']),
'tw.social.g.2':('Nhượng bộ: 雖然…但是…','雖然 + ý 1，但是 + ý 2','Hai ý có quan hệ trái với điều thường mong đợi; không dùng 所以 thay 但是 trong bài nhượng bộ này.','雖然今天很忙，所以我很開心。','雖然今天很忙，但是我很開心。|Suīrán jīntiān hěn máng, dànshì wǒ hěn kāixīn.|Tuy hôm nay bận nhưng tôi rất vui.','雖然下雨，但是我還是想去。|Suīrán xià yǔ, dànshì wǒ háishì xiǎng qù.|Tuy trời mưa nhưng tôi vẫn muốn đi.','雖然下雨，___我還是想去。','但是',[45], 'So sánh và câu phức',['tw.information.g.2'])}

# Additional independent examples when the correction repeats the seed example.
EXTRA={
'tw.health.g.1':'她有點頭痛。|Tā yǒudiǎn tóutòng.|Cô ấy hơi đau đầu.',
'tw.health.g.2':'這個禮物太好了！|Zhège lǐwù tài hǎo le!|Món quà này tuyệt quá!',
'tw.services.g.1':'他先簽名，再領取包裹。|Tā xiān qiānmíng, zài lǐngqǔ bāoguǒ.|Anh ấy ký tên trước rồi nhận bưu kiện.',
'tw.services.g.2':'我想休息一下。|Wǒ xiǎng xiūxi yīxià.|Tôi muốn nghỉ một lát.',
'tw.worklife.g.1':'她今天得加班。|Tā jīntiān děi jiābān.|Hôm nay cô ấy phải làm thêm giờ.',
'tw.worklife.g.2':'主管正在打電話。|Zhǔguǎn zhèngzài dǎ diànhuà.|Người phụ trách đang gọi điện.',
'tw.travel.g.2':'電影快要開始了。|Diànyǐng kuàiyào kāishǐ le.|Phim sắp bắt đầu rồi.',
'tw.social.g.1':'你星期六來還是星期日來？|Nǐ xīngqíliù lái háishì xīngqírì lái?|Bạn đến thứ Bảy hay Chủ nhật?',
'tw.social.g.2':'雖然有點遠，但是交通很方便。|Suīrán yǒudiǎn yuǎn, dànshì jiāotōng hěn fāngbiàn.|Tuy hơi xa nhưng giao thông rất tiện.'}

def enrich(grammar,roadmap):
    import re
    gid=grammar['id'];title,pattern,restriction,wrong,second,third,cloze,missing,refs,group,parents=SPECS[gid]
    parse=lambda row:dict(zip(('hanzi','pinyin','vi'),row.split('|')))
    examples=list({e['hanzi']:e for e in [{k:grammar[k] for k in ('hanzi','pinyin','vi')},parse(second),parse(third)]}.values())
    if len(examples)<3:examples.append(parse(EXTRA[gid]))
    references=[{'id':r['id'],'title':r['title'],'tbcl_level':r['tbcl_level'],'url':r['source']} for r in roadmap if r['id'] in {f'tbcl.{n:03d}' for n in refs}]
    if not references:references=[{'id':'','title':'MOE tra nghĩa '+('得（děi）' if gid=='tw.worklife.g.1' else '有點'),'tbcl_level':'','url':'https://dict.concised.moe.edu.tw/dictView.jsp?ID=7458&la=0&powerMode=0' if gid=='tw.worklife.g.1' else 'https://dict.revised.moe.edu.tw/dictView.jsp?ID=154232&la=0&powerMode=0'}]
    g={**grammar,'title':title,'pattern':pattern,'restrictions':restriction,'common_mistake':wrong,'examples':examples,'status':'ready','group':group,'level':'A2 · đời sống','prerequisites':parents,'references':references}
    def ex(suffix,kind,prompt,answer,explanation,choices=None,tokens=None):return dict(id=gid+'.practice.'+suffix,grammar_id=gid,kind=kind,prompt=prompt,answers=[answer],explanation=explanation,choices=choices or [],tokens=tokens or [],skill='grammar')
    distractors=[s[0] for key,s in SPECS.items() if key!=gid and s[4].split('|')[0] not in examples[0]['hanzi']][:3]
    choices=[title,*distractors];offset=sum(map(ord,gid))%4;choices=choices[offset:]+choices[:offset]
    target=parse(third);tokens=list(re.sub(r'[，。！？、；：\s]','',target['hanzi']));tokens=tokens[1:]+tokens[:1]
    g['exercises']=[ex('use','meaning','Câu “'+examples[0]['hanzi']+'” minh họa cấu trúc nào đang học?',title,grammar['explanation'],choices),
        ex('cloze','cloze','Điền cấu trúc đang học để diễn đạt “'+target['vi']+'”: '+cloze,missing,restriction),
        ex('order','order','Sắp xếp hoặc gõ câu theo nghĩa: '+target['vi'],target['hanzi'],grammar['explanation'],tokens=tokens),
        ex('correct','hanzi','Viết lại theo cấu trúc đang học để diễn đạt “'+parse(second)['vi']+'”: '+wrong,parse(second)['hanzi'],restriction)]
    variants={
        'tw.health.g.1':['我有一點累。'],
        'tw.services.g.1':['先填表格，再去櫃臺。'],
        'tw.services.g.2':['請你等一下。'],
        'tw.worklife.g.1':['明天我得上早班。'],
        'tw.travel.g.1':['我沒有去過臺南。'],
        'tw.social.g.2':['今天雖然很忙，但是我很開心。'],
    }
    g['exercises'][-1]['answers'].extend(variants.get(gid,[]))
    return g
