"""Original AI-assisted drafts. Not copied from a textbook or teacher-reviewed."""
READING = {
 'greetings': ('Người nói ở câu cuối đến từ đâu?', 'Việt Nam', ['Đài Loan','Nhật Bản','Hàn Quốc'], 'Câu cuối có 我是越南人: người nói là người Việt Nam.'),
 'numbers': ('Hai người hẹn gặp lúc mấy giờ?', 'Ba giờ', ['Hai giờ','Hai giờ rưỡi','Bốn giờ'], '我們三點見 là lời hẹn gặp lúc ba giờ; 兩點半 là giờ hiện tại.'),
 'food': ('Người khách gọi đồ uống gì?', 'Một ly trà', ['Một ly cà phê','Một ly sữa','Một bát canh'], 'Câu cuối là 我要一杯茶: muốn một ly trà.'),
 'shopping': ('Người mua chọn trả bằng gì?', 'Tiền mặt', ['Thẻ tín dụng','Thẻ EasyCard','Chuyển khoản'], '我用現金: tôi dùng tiền mặt. Người mua cũng nói không cần túi.'),
 'transport': ('Đi bộ đến ga tàu điện mất khoảng bao lâu?', 'Năm phút', ['Ba phút','Mười phút','Nửa giờ'], '走路五分鐘: đi bộ năm phút.'),
 'family': ('Gia đình người trả lời có mấy người?', 'Bốn người', ['Ba người','Năm người','Sáu người'], '有四個人: có bốn người; sau đó liệt kê bố, mẹ, chị và bản thân.'),
 'home': ('Ngoài máy lạnh, phòng còn có tiện nghi nào được nói đến?', 'Mạng Internet', ['Máy giặt','Tivi','Tủ lạnh'], '也有網路: cũng có mạng Internet.'),
 'schedule': ('Hai người cuối cùng hẹn gặp vào lúc nào?', 'Bốn giờ rưỡi', ['Hai giờ','Bốn giờ','Ba giờ rưỡi'], '我們四點半見 là giờ hẹn; 四點下課 là giờ tan học.'),
 'information': ('Bưu điện nằm ở đâu?', 'Bên cạnh bệnh viện', ['Trong nhà ga','Bên trái trường học','Đằng sau thư viện'], '在醫院旁邊: ở bên cạnh bệnh viện.'),
 'classroom': ('Người học nhờ giáo viên làm gì ở câu cuối?', 'Nói chậm hơn và nói lại một lần', ['Viết bài tập lên bảng','Dịch sang tiếng Anh','Đổi giờ học'], '請慢一點，再說一次 là lời nhờ nói chậm và nhắc lại.'),
 'daily': ('Lời rủ ở câu cuối là hoạt động nào?', 'Ngày mai cùng đi bơi', ['Tối nay xem phim','Cuối tuần chạy bộ','Ngày mai đi thư viện'], '明天一起去游泳吧: ngày mai cùng đi bơi nhé.'),
 'campus': ('Cuộc hẹn được đề nghị vào lúc nào?', 'Ba giờ chiều mai', ['Ba giờ chiều nay','Hai giờ sáng mai','Bốn giờ chiều mai'], '明天下午三點: ba giờ chiều ngày mai.')
}
UNITS = [
('greetings', 'Chào bạn, Đài Loan!', 'Chào hỏi, giới thiệu tên và quốc tịch.', '一', '''你好|nǐ hǎo|xin chào
您好|nín hǎo|xin chào (kính trọng)
早安|zǎo ān|chào buổi sáng
晚安|wǎn ān|chúc ngủ ngon
再見|zài jiàn|tạm biệt
謝謝|xièxie|cảm ơn
不客氣|bú kèqì|không có gì (đáp lời cảm ơn)
對不起|duìbuqǐ|xin lỗi
沒關係|méi guānxi|không sao
請|qǐng|xin mời; vui lòng
我|wǒ|tôi
你|nǐ|bạn
他|tā|anh ấy
她|tā|cô ấy
我們|wǒmen|chúng tôi; chúng ta
名字|míngzi|tên
叫|jiào|tên là; gọi
是|shì|là
臺灣|Táiwān|Đài Loan
越南|Yuènán|Việt Nam''', [
('我是越南人。','Wǒ shì Yuènán rén.','Tôi là người Việt Nam.','A 是 B: 是 nối chủ ngữ với danh từ chỉ danh tính; không dùng 是 trước mọi tính từ.'),
('你叫什麼名字？','Nǐ jiào shénme míngzi?','Bạn tên là gì?','什麼 đứng tại vị trí thông tin cần hỏi; không đảo trật tự câu.')], [
('你好！我叫安。','Nǐ hǎo! Wǒ jiào Ān.','Xin chào! Tôi tên An.'),
('你好！我是臺灣人。你呢？','Nǐ hǎo! Wǒ shì Táiwān rén. Nǐ ne?','Chào bạn! Tôi là người Đài Loan. Còn bạn?'),
('我是越南人。很高興認識你！','Wǒ shì Yuènán rén. Hěn gāoxìng rènshì nǐ!','Tôi là người Việt Nam. Rất vui được biết bạn!')], 'Viết hai câu giới thiệu tên và quốc tịch của bạn.'),
('numbers', 'Số và thời gian', 'Nói số, hỏi giờ và hẹn thời gian.', '二', '''零|líng|số không
一|yī|một
二|èr|hai (số đếm)
三|sān|ba
四|sì|bốn
五|wǔ|năm (số đếm)
六|liù|sáu
七|qī|bảy
八|bā|tám
九|jiǔ|chín
十|shí|mười
兩|liǎng|hai (trước lượng từ)
百|bǎi|trăm
今天|jīntiān|hôm nay
明天|míngtiān|ngày mai
昨天|zuótiān|hôm qua
現在|xiànzài|bây giờ
點|diǎn|giờ (mốc giờ)
分|fēn|phút; phần
半|bàn|một nửa; rưỡi''', [
('現在幾點？','Xiànzài jǐ diǎn?','Bây giờ là mấy giờ?','幾 hỏi số nhỏ hoặc thời gian; 幾點 hỏi giờ.'),
('我們明天三點見。','Wǒmen míngtiān sān diǎn jiàn.','Ngày mai chúng ta gặp nhau lúc ba giờ.','Từ chỉ thời gian thường đứng sau chủ ngữ hoặc trước cả chủ ngữ, trước động từ.')], [
('現在幾點？','Xiànzài jǐ diǎn?','Bây giờ là mấy giờ?'),
('現在兩點半。','Xiànzài liǎng diǎn bàn.','Bây giờ là hai giờ rưỡi.'),
('我們三點見。','Wǒmen sān diǎn jiàn.','Chúng ta gặp nhau lúc ba giờ nhé.')], 'Nhắn cho bạn giờ gặp ngày mai.'),
('food', 'Một bữa ăn ngon', 'Gọi món và nói sở thích ăn uống.', '三', '''吃|chī|ăn
喝|hē|uống
飯|fàn|cơm; bữa ăn
麵|miàn|mì
水|shuǐ|nước
茶|chá|trà
咖啡|kāfēi|cà phê
牛奶|niúnǎi|sữa bò
早餐|zǎocān|bữa sáng
午餐|wǔcān|bữa trưa
晚餐|wǎncān|bữa tối
菜單|càidān|thực đơn
好吃|hǎochī|ngon (đồ ăn)
好喝|hǎohē|ngon (đồ uống)
要|yào|muốn; cần
不要|bú yào|không muốn
杯|bēi|ly (lượng từ)
碗|wǎn|bát (lượng từ)
辣|là|cay
素食|sùshí|đồ chay''', [
('我要一杯茶。','Wǒ yào yì bēi chá.','Tôi muốn một ly trà.','Số + lượng từ + danh từ: 一杯茶. 一 đổi thành yì trước thanh 1, 2, 3 khi nói.'),
('這碗麵不辣。','Zhè wǎn miàn bú là.','Bát mì này không cay.','不 phủ định tính từ/động từ; trước thanh 4, 不 đọc bú.')], [
('你好，我要一碗麵。','Nǐ hǎo, wǒ yào yì wǎn miàn.','Xin chào, tôi muốn một bát mì.'),
('要喝什麼？','Yào hē shénme?','Bạn muốn uống gì?'),
('我要一杯茶，謝謝。','Wǒ yào yì bēi chá, xièxie.','Tôi muốn một ly trà, cảm ơn.')], 'Viết lời gọi một món ăn và một đồ uống.'),
('shopping', 'Đi chợ và mua sắm', 'Hỏi giá, chọn hàng và thanh toán.', '十', '''多少|duōshǎo|bao nhiêu
錢|qián|tiền
塊|kuài|đồng (cách nói giá tiền)
元|yuán|đồng (đơn vị tiền)
買|mǎi|mua
賣|mài|bán
貴|guì|đắt
便宜|piányí|rẻ
這個|zhège|cái này
那個|nàge|cái kia
商店|shāngdiàn|cửa hàng
超市|chāoshì|siêu thị
便利商店|biànlì shāngdiàn|cửa hàng tiện lợi
發票|fāpiào|hóa đơn
袋子|dàizi|túi
現金|xiànjīn|tiền mặt
信用卡|xìnyòngkǎ|thẻ tín dụng
水果|shuǐguǒ|trái cây
蘋果|píngguǒ|táo
公斤|gōngjīn|kilôgam''', [
('這個多少錢？','Zhège duōshǎo qián?','Cái này bao nhiêu tiền?','多少 hỏi số lượng/giá, không giới hạn ở số nhỏ.'),
('我想買蘋果。','Wǒ xiǎng mǎi píngguǒ.','Tôi muốn mua táo.','想 + động từ diễn đạt mong muốn; 想買 nhẹ hơn yêu cầu trực tiếp.')], [
('這個多少錢？','Zhège duōshǎo qián?','Cái này bao nhiêu tiền?'),
('一百元。要袋子嗎？','Yì bǎi yuán. Yào dàizi ma?','Một trăm đồng. Bạn cần túi không?'),
('不要，謝謝。我用現金。','Bú yào, xièxie. Wǒ yòng xiànjīn.','Không cần, cảm ơn. Tôi dùng tiền mặt.')], 'Viết câu hỏi giá một món hàng và cách bạn muốn thanh toán.'),
('transport', 'Đi một vòng thành phố', 'Hỏi đường và sử dụng giao thông công cộng.', '人', '''去哪裡|qù nǎlǐ|đi đâu
車站|chēzhàn|nhà ga; trạm xe
捷運|jiéyùn|tàu điện đô thị
公車|gōngchē|xe buýt
火車|huǒchē|tàu hỏa
高鐵|gāotiě|đường sắt cao tốc
計程車|jìchéngchē|taxi
腳踏車|jiǎotàchē|xe đạp
走路|zǒulù|đi bộ
右邊|yòubiān|bên phải
左邊|zuǒbiān|bên trái
前面|qiánmiàn|phía trước
後面|hòumiàn|phía sau
附近|fùjìn|gần đây
遠|yuǎn|xa
近|jìn|gần
到|dào|đến
坐|zuò|ngồi; đi bằng (xe)
下車|xiàchē|xuống xe
悠遊卡|Yōuyóukǎ|thẻ EasyCard''', [
('我坐公車去學校。','Wǒ zuò gōngchē qù xuéxiào.','Tôi đi xe buýt đến trường.','坐 + phương tiện + 去 + nơi đến.'),
('車站在右邊。','Chēzhàn zài yòubiān.','Nhà ga ở bên phải.','在 + nơi chốn diễn đạt vị trí; không thêm 是 trước 在.')], [
('請問，捷運站在哪裡？','Qǐngwèn, jiéyùn zhàn zài nǎlǐ?','Xin hỏi, ga tàu điện ở đâu?'),
('在前面，走路五分鐘。','Zài qiánmiàn, zǒulù wǔ fēnzhōng.','Ở phía trước, đi bộ năm phút.'),
('謝謝你！','Xièxie nǐ!','Cảm ơn bạn!')], 'Nhắn hướng dẫn đường đi từ nhà ga đến nơi hẹn.'),
('family', 'Những người thân quen', 'Giới thiệu gia đình và mô tả người.', '大', '''家|jiā|nhà; gia đình
家人|jiārén|người nhà
爸爸|bàba|bố
媽媽|māma|mẹ
哥哥|gēge|anh trai
姐姐|jiějie|chị gái
弟弟|dìdi|em trai
妹妹|mèimei|em gái
朋友|péngyǒu|bạn bè
同學|tóngxué|bạn học
先生|xiānshēng|ông; chồng
太太|tàitai|bà; vợ
孩子|háizi|con; trẻ nhỏ
人|rén|người
個|ge|cái; người (lượng từ)
有|yǒu|có
沒有|méiyǒu|không có
歲|suì|tuổi
工作|gōngzuò|công việc; làm việc
喜歡|xǐhuān|thích''', [
('我有一個妹妹。','Wǒ yǒu yí ge mèimei.','Tôi có một em gái.','有 biểu thị sở hữu; phủ định là 沒有, không dùng 不有. 一 trước 個 thường đọc yí.'),
('這是我的家人。','Zhè shì wǒ de jiārén.','Đây là người nhà của tôi.','的 nối người sở hữu với danh từ; với quan hệ thân thuộc đôi khi có thể lược 的.')], [
('你家有幾個人？','Nǐ jiā yǒu jǐ ge rén?','Gia đình bạn có mấy người?'),
('有四個人：爸爸、媽媽、姐姐和我。','Yǒu sì ge rén: bàba, māma, jiějie hé wǒ.','Có bốn người: bố, mẹ, chị gái và tôi.'),
('你姐姐做什麼工作？','Nǐ jiějie zuò shénme gōngzuò?','Chị gái bạn làm công việc gì?')], 'Giới thiệu hai người trong gia đình hoặc bạn bè.'),
('home', 'Một góc để ở', 'Hỏi phòng, mô tả đồ vật và tiện nghi.', '小', '''房間|fángjiān|phòng
宿舍|sùshè|ký túc xá
房租|fángzū|tiền thuê nhà
房東|fángdōng|chủ nhà
床|chuáng|giường
桌子|zhuōzi|bàn
椅子|yǐzi|ghế
門|mén|cửa
窗戶|chuānghù|cửa sổ
廚房|chúfáng|bếp
浴室|yùshì|phòng tắm
廁所|cèsuǒ|nhà vệ sinh
冷氣|lěngqì|máy lạnh
電|diàn|điện
網路|wǎnglù|mạng Internet
大|dà|to; lớn
小|xiǎo|nhỏ
乾淨|gānjìng|sạch
安靜|ānjìng|yên tĩnh
住|zhù|ở; cư trú''', [
('房間很乾淨。','Fángjiān hěn gānjìng.','Căn phòng sạch sẽ.','很 thường nối chủ ngữ với tính từ, không nhất thiết nhấn mạnh mức độ rất.'),
('桌子上有一本書。','Zhuōzi shàng yǒu yì běn shū.','Trên bàn có một quyển sách.','Nơi chốn + 有 + sự vật để giới thiệu vật tồn tại tại nơi đó.')], [
('這個房間有冷氣嗎？','Zhège fángjiān yǒu lěngqì ma?','Phòng này có máy lạnh không?'),
('有，也有網路。','Yǒu, yě yǒu wǎnglù.','Có, cũng có mạng Internet.'),
('一個月的房租多少錢？','Yí ge yuè de fángzū duōshǎo qián?','Tiền thuê một tháng là bao nhiêu?')], 'Viết tin nhắn hỏi chủ nhà hai điều về phòng thuê.'),
('schedule', 'Lịch học của tôi', 'Nói về lớp học và lịch tuần.', '日', '''學校|xuéxiào|trường học
大學|dàxué|đại học
學生|xuéshēng|học sinh; sinh viên
老師|lǎoshī|giáo viên
上課|shàngkè|vào học; học trên lớp
下課|xiàkè|tan học
課|kè|buổi học; môn học
星期|xīngqí|tuần; thứ
週末|zhōumò|cuối tuần
早上|zǎoshang|buổi sáng
中午|zhōngwǔ|buổi trưa
下午|xiàwǔ|buổi chiều
晚上|wǎnshang|buổi tối
時間|shíjiān|thời gian
忙|máng|bận
有空|yǒu kòng|rảnh
開始|kāishǐ|bắt đầu
結束|jiéshù|kết thúc
每天|měitiān|mỗi ngày
學期|xuéqí|học kỳ''', [
('我從九點上課到十二點。','Wǒ cóng jiǔ diǎn shàngkè dào shí èr diǎn.','Tôi học từ chín giờ đến mười hai giờ.','從…到… xác định điểm đầu và điểm cuối của thời gian hoặc không gian.'),
('我星期一和星期三有課。','Wǒ xīngqí yī hé xīngqí sān yǒu kè.','Tôi có lớp vào thứ Hai và thứ Tư.','和 nối danh từ/cụm danh từ; không dùng thay mọi liên từ và trong tiếng Việt.')], [
('你明天下午有空嗎？','Nǐ míngtiān xiàwǔ yǒu kòng ma?','Chiều mai bạn có rảnh không?'),
('我兩點有課，四點下課。','Wǒ liǎng diǎn yǒu kè, sì diǎn xiàkè.','Tôi có lớp lúc hai giờ, tan học lúc bốn giờ.'),
('那我們四點半見。','Nà wǒmen sì diǎn bàn jiàn.','Vậy chúng ta gặp nhau lúc bốn giờ rưỡi.')], 'Viết lịch học ngày mai và một khoảng thời gian rảnh.'),
('information', 'Xin hỏi một chút', 'Hỏi thông tin và nhờ hỗ trợ.', '月', '''請問|qǐngwèn|xin hỏi
問題|wèntí|câu hỏi; vấn đề
知道|zhīdào|biết
懂|dǒng|hiểu
可以|kěyǐ|có thể; được phép
幫忙|bāngmáng|giúp đỡ
找|zhǎo|tìm
誰|shéi|ai
什麼|shénme|cái gì
哪裡|nǎlǐ|ở đâu
怎麼|zěnme|như thế nào; làm sao
為什麼|wèishénme|tại sao
因為|yīnwèi|bởi vì
所以|suǒyǐ|cho nên
地址|dìzhǐ|địa chỉ
電話|diànhuà|điện thoại
號碼|hàomǎ|số; mã số
服務臺|fúwùtái|quầy dịch vụ
醫院|yīyuàn|bệnh viện
郵局|yóujú|bưu điện''', [
('可以幫我嗎？','Kěyǐ bāng wǒ ma?','Có thể giúp tôi không?','可以…嗎 dùng hỏi xin phép hoặc nhờ một việc một cách lịch sự.'),
('因為我有課，所以不能去。','Yīnwèi wǒ yǒu kè, suǒyǐ bù néng qù.','Vì tôi có lớp nên không thể đi.','因為 nêu nguyên nhân; 所以 nêu kết quả; có thể cùng xuất hiện trong một câu.')], [
('請問，郵局在哪裡？','Qǐngwèn, yóujú zài nǎlǐ?','Xin hỏi, bưu điện ở đâu?'),
('在醫院旁邊。','Zài yīyuàn pángbiān.','Ở bên cạnh bệnh viện.'),
('我不知道怎麼走，可以幫我嗎？','Wǒ bù zhīdào zěnme zǒu, kěyǐ bāng wǒ ma?','Tôi không biết đi thế nào, bạn giúp tôi được không?')], 'Viết lời nhờ quầy dịch vụ giúp tìm một địa điểm.'),
('classroom', 'Trong lớp học', 'Nhờ giải thích và dùng từ học tập.', '口', '''中文|Zhōngwén|tiếng Trung
華語|Huáyǔ|Hoa ngữ
越南文|Yuènánwén|tiếng Việt (văn tự/ngôn ngữ)
英文|Yīngwén|tiếng Anh
說|shuō|nói
聽|tīng|nghe
讀|dú|đọc
寫|xiě|viết
看|kàn|xem; nhìn
字|zì|chữ
詞|cí|từ
句子|jùzi|câu
意思|yìsi|ý nghĩa
作業|zuòyè|bài tập về nhà
考試|kǎoshì|kỳ thi; thi
書|shū|sách
筆|bǐ|bút
本|běn|quyển (lượng từ)
慢|màn|chậm
再|zài|lại; thêm lần nữa''', [
('請再說一次。','Qǐng zài shuō yí cì.','Xin nói lại một lần nữa.','再 + động từ diễn đạt hành động sẽ lặp lại; 次 đếm số lần.'),
('我聽不懂。','Wǒ tīng bu dǒng.','Tôi nghe không hiểu.','Động từ + 不 + bổ ngữ kết quả diễn đạt không đạt được kết quả; 聽不懂 là không hiểu điều nghe được.')], [
('老師，這個詞是什麼意思？','Lǎoshī, zhège cí shì shénme yìsi?','Thưa thầy/cô, từ này nghĩa là gì?'),
('請看這個句子。','Qǐng kàn zhège jùzi.','Hãy xem câu này.'),
('請慢一點，再說一次。','Qǐng màn yì diǎn, zài shuō yí cì.','Xin chậm một chút, nói lại một lần nữa.')], 'Nhắn cho giáo viên một điều bạn chưa hiểu trong bài.'),
('daily', 'Một ngày thường', 'Kể sinh hoạt và điều đã làm.', '上', '''起床|qǐchuáng|thức dậy
睡覺|shuìjiào|ngủ
洗澡|xǐzǎo|tắm
回家|huíjiā|về nhà
運動|yùndòng|vận động; thể thao
跑步|pǎobù|chạy bộ
游泳|yóuyǒng|bơi
休息|xiūxí|nghỉ ngơi
上網|shàngwǎng|lên mạng
手機|shǒujī|điện thoại di động
電腦|diànnǎo|máy tính
電影|diànyǐng|phim
音樂|yīnyuè|âm nhạc
常常|chángcháng|thường xuyên
有時候|yǒu shíhòu|thỉnh thoảng
一起|yìqǐ|cùng nhau
已經|yǐjīng|đã
還|hái|vẫn; còn
了|le|trợ từ thay đổi/hoàn thành
會|huì|biết (kỹ năng); sẽ''', [
('我已經吃飯了。','Wǒ yǐjīng chīfàn le.','Tôi đã ăn cơm rồi.','已經…了 nhấn mạnh việc đã xảy ra/tình trạng đã thay đổi; 了 không đơn giản là thì quá khứ.'),
('我會游泳。','Wǒ huì yóuyǒng.','Tôi biết bơi.','會 + động từ có thể chỉ kỹ năng học được; nghĩa sẽ phụ thuộc ngữ cảnh.')], [
('你週末常常做什麼？','Nǐ zhōumò chángcháng zuò shénme?','Cuối tuần bạn thường làm gì?'),
('我常常運動，有時候看電影。','Wǒ chángcháng yùndòng, yǒu shíhòu kàn diànyǐng.','Tôi thường tập thể thao, thỉnh thoảng xem phim.'),
('我們明天一起去游泳吧！','Wǒmen míngtiān yìqǐ qù yóuyǒng ba!','Ngày mai chúng ta cùng đi bơi nhé!')], 'Viết ba câu về sinh hoạt của bạn vào cuối tuần.'),
('campus', 'Bước vào đại học', 'Trao đổi đơn giản về học tập và gửi tin nhắn.', '下', '''圖書館|túshūguǎn|thư viện
教室|jiàoshì|phòng học
辦公室|bàngōngshì|văn phòng
研究所|yánjiùsuǒ|viện/chương trình sau đại học
教授|jiàoshòu|giáo sư
研究|yánjiù|nghiên cứu
報告|bàogào|báo cáo
討論|tǎolùn|thảo luận
資料|zīliào|tài liệu; dữ liệu
電子郵件|diànzǐ yóujiàn|thư điện tử
寄|jì|gửi
收到|shōudào|nhận được
準備|zhǔnbèi|chuẩn bị
需要|xūyào|cần
借|jiè|mượn; cho mượn
還書|huán shū|trả sách
預約|yùyuē|đặt hẹn
見面|jiànmiàn|gặp mặt
方便|fāngbiàn|thuận tiện
麻煩|máfán|phiền; làm phiền''', [
('我想跟老師討論報告。','Wǒ xiǎng gēn lǎoshī tǎolùn bàogào.','Tôi muốn thảo luận báo cáo với giáo viên.','跟 + người đứng trước động từ để chỉ người cùng tham gia.'),
('您什麼時候方便？','Nín shénme shíhòu fāngbiàn?','Khi nào thầy/cô thuận tiện?','什麼時候 hỏi thời gian; 您 và cách hỏi sự thuận tiện giúp lời hẹn lịch sự.')], [
('老師您好，我想跟您討論報告。','Lǎoshī nín hǎo, wǒ xiǎng gēn nín tǎolùn bàogào.','Em chào thầy/cô, em muốn trao đổi báo cáo với thầy/cô.'),
('明天下午三點可以嗎？','Míngtiān xiàwǔ sān diǎn kěyǐ ma?','Ba giờ chiều mai được không?'),
('可以，謝謝老師。','Kěyǐ, xièxie lǎoshī.','Dạ được, em cảm ơn thầy/cô.')], 'Viết tin nhắn ngắn xin hẹn giáo viên trao đổi bài báo cáo.')
]
