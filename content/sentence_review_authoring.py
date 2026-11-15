"""Bounded authored frames. Slots are whole, semantically compatible phrases.

This is an editorial source, not a runtime language generator. No model or
character-level Pinyin inference is involved. Changing a frame changes IDs.
"""

def triples(text):
    return [dict(zip(('hanzi', 'pinyin', 'vi'), row.split('|'))) for row in text.strip().splitlines()]

SLOTS = {
'people': triples('''朋友|péngyǒu|người bạn
你|nǐ|bạn
他|tā|anh ấy
她|tā|cô ấy
同學|tóngxué|bạn học
同事|tóngshì|đồng nghiệp
鄰居|línjū|hàng xóm
老師|lǎoshī|thầy/cô'''),
'days': triples('''今天|jīntiān|hôm nay
明天|míngtiān|ngày mai
星期一|xīngqí yī|thứ Hai
星期二|xīngqí èr|thứ Ba
星期三|xīngqí sān|thứ Tư
星期四|xīngqí sì|thứ Năm
星期五|xīngqí wǔ|thứ Sáu
星期六|xīngqí liù|thứ Bảy'''),
'hours': triples('''八點|bā diǎn|tám giờ
八點半|bā diǎn bàn|tám giờ rưỡi
九點十分|jiǔ diǎn shí fēn|chín giờ mười
十點二十分|shí diǎn èr shí fēn|mười giờ hai mươi
十一點半|shí yī diǎn bàn|mười một giờ rưỡi
十二點|shí èr diǎn|mười hai giờ
兩點十五分|liǎng diǎn shí wǔ fēn|hai giờ mười lăm
三點四十分|sān diǎn sì shí fēn|ba giờ bốn mươi'''),
'drinks': triples('''熱茶|rè chá|trà nóng
冰茶|bīng chá|trà đá
紅茶|hóngchá|trà đen
綠茶|lǜchá|trà xanh
咖啡|kāfēi|cà phê
牛奶|niúnǎi|sữa
豆漿|dòujiāng|sữa đậu nành
果汁|guǒzhī|nước ép trái cây'''),
'places': triples('''學校|xuéxiào|trường học
公司|gōngsī|công ty
車站|chēzhàn|nhà ga
超市|chāoshì|siêu thị
醫院|yīyuàn|bệnh viện
郵局|yóujú|bưu điện
圖書館|túshūguǎn|thư viện
便利商店|biànlì shāngdiàn|cửa hàng tiện lợi'''),
'relatives': triples('''爸爸|bàba|bố
媽媽|māma|mẹ
哥哥|gēge|anh trai
姐姐|jiějie|chị gái
弟弟|dìdi|em trai
妹妹|mèimei|em gái
先生|xiānsheng|chồng
太太|tàitai|vợ'''),
'things': triples('''書|shū|sách
手機|shǒujī|điện thoại
電腦|diànnǎo|máy tính
杯子|bēizi|cốc
衣服|yīfu|quần áo
鑰匙|yàoshi|chìa khóa
雨傘|yǔsǎn|ô
包包|bāobāo|túi xách'''),
'study': triples('''這個字|zhè ge zì|chữ này
這個詞|zhè ge cí|từ này
這個句子|zhè ge jùzi|câu này
這個問題|zhè ge wèntí|câu hỏi này
第一課|dì yī kè|bài một
第二課|dì èr kè|bài hai
第三課|dì sān kè|bài ba
第四課|dì sì kè|bài bốn'''),
'actions': triples('''上課|shàngkè|đi học
上班|shàngbān|đi làm
買東西|mǎi dōngxi|mua đồ
看書|kàn shū|đọc sách
運動|yùndòng|tập thể dục
做飯|zuò fàn|nấu cơm
洗衣服|xǐ yīfu|giặt quần áo
看電影|kàn diànyǐng|xem phim'''),
'symptoms': triples('''頭痛|tóutòng|đau đầu
肚子痛|dùzi tòng|đau bụng
喉嚨痛|hóulóng tòng|đau họng
牙痛|yátòng|đau răng
咳嗽|késòu|ho
發燒|fāshāo|sốt
流鼻水|liú bíshuǐ|sổ mũi
頭暈|tóuyūn|chóng mặt'''),
'appliances': triples('''冷氣|lěngqì|máy lạnh
冰箱|bīngxiāng|tủ lạnh
洗衣機|xǐyījī|máy giặt
電視|diànshì|ti vi
電燈|diàndēng|đèn điện
熱水器|rèshuǐqì|máy nước nóng
電風扇|diànfēngshàn|quạt điện
微波爐|wéibōlú|lò vi sóng'''),
'documents': triples('''表格|biǎogé|biểu mẫu
收據|shōujù|biên nhận
發票|fāpiào|hóa đơn
護照|hùzhào|hộ chiếu
證件|zhèngjiàn|giấy tờ tùy thân
申請書|shēnqǐngshū|đơn đăng ký
合約|héyuē|hợp đồng
報告|bàogào|báo cáo'''),
'work': triples('''開會|kāihuì|họp
加班|jiābān|tăng ca
請假|qǐngjià|xin nghỉ
出差|chūchāi|đi công tác
準備報告|zhǔnbèi bàogào|chuẩn bị báo cáo
回覆郵件|huífù yóujiàn|trả lời thư điện tử
聯絡客戶|liánluò kèhù|liên hệ khách hàng
整理資料|zhěnglǐ zīliào|sắp xếp tài liệu'''),
'travel': triples('''臺北|Táiběi|Đài Bắc
臺中|Táizhōng|Đài Trung
臺南|Táinán|Đài Nam
高雄|Gāoxióng|Cao Hùng
花蓮|Huālián|Hoa Liên
臺東|Táidōng|Đài Đông
宜蘭|Yílán|Nghi Lan
嘉義|Jiāyì|Gia Nghĩa'''),
'social': triples('''吃飯|chī fàn|ăn cơm
喝茶|hē chá|uống trà
喝咖啡|hē kāfēi|uống cà phê
看電影|kàn diànyǐng|xem phim
逛街|guàngjiē|đi dạo mua sắm
散步|sànbù|đi dạo
打球|dǎ qiú|chơi bóng
聊天|liáotiān|trò chuyện'''),
'tens': triples('''十三|shí sān|13
十八|shí bā|18
二十四|èr shí sì|24
三十九|sān shí jiǔ|39
四十二|sì shí èr|42
五十七|wǔ shí qī|57
六十八|liù shí bā|68
八十三|bā shí sān|83'''),
'prices': triples('''一百零八|yī bǎi líng bā|108
一百八十|yī bǎi bā shí|180
兩百零三|liǎng bǎi líng sān|203
兩百三十|liǎng bǎi sān shí|230
四百零九|sì bǎi líng jiǔ|409
四百九十|sì bǎi jiǔ shí|490
一千零六|yī qiān líng liù|1.006
一千六百|yī qiān liù bǎi|1.600'''),
}

# topic|slot|family|Hanzi|Pinyin|Vietnamese; {0} is the ONLY substitution.
FRAMES = '''greetings|people|identity|請問，{0}是老師嗎？|Qǐngwèn, {0} shì lǎoshī ma?|Xin hỏi, {0} là giáo viên phải không?
greetings|people|nationality|{0}不是臺灣人。|{0} bù shì Táiwān rén.|{0} không phải người Đài Loan.
greetings|people|language|{0}也說中文。|{0} yě shuō Zhōngwén.|{0} cũng nói tiếng Trung.
greetings|people|introduction|{0}姓陳，不姓林。|{0} xìng Chén, bù xìng Lín.|{0} họ Trần, không phải họ Lâm.
greetings|people|welcome|很高興認識{0}。|Hěn gāoxìng rènshi {0}.|Rất vui được làm quen với {0}.
greetings|people|thanks|謝謝{0}的幫忙。|Xièxie {0} de bāngmáng.|Cảm ơn sự giúp đỡ của {0}.
greetings|people|friend|{0}是我的新朋友。|{0} shì wǒ de xīn péngyǒu.|{0} là bạn mới của tôi.
greetings|people|confirm|{0}不是學生，是老師。|{0} bù shì xuéshēng, shì lǎoshī.|{0} không phải học sinh, mà là giáo viên.
numbers|tens|count|這裡有{0}個人。|Zhèlǐ yǒu {0} ge rén.|Ở đây có {0} người.
numbers|prices|price|這張票要{0}元。|Zhè zhāng piào yào {0} yuán.|Vé này giá {0} Đài tệ.
numbers|hours|appointment|請{0}到車站。|Qǐng {0} dào chēzhàn.|Xin đến nhà ga lúc {0}.
numbers|hours|closing|圖書館今天{0}關門。|Túshūguǎn jīntiān {0} guānmén.|Hôm nay thư viện đóng cửa lúc {0}.
numbers|days|calendar|{0}我沒有課。|{0} wǒ méiyǒu kè.|{0} tôi không có lớp.
numbers|days|reschedule|我們改成{0}見面，好嗎？|Wǒmen gǎi chéng {0} jiànmiàn, hǎo ma?|Chúng ta đổi sang gặp nhau vào {0}, được không?
numbers|hours|departure|公車{0}出發，請早一點來。|Gōngchē {0} chūfā, qǐng zǎo yī diǎn lái.|Xe buýt xuất phát lúc {0}, xin đến sớm một chút.
numbers|days|deadline|請在{0}回覆。|Qǐng zài {0} huífù.|Xin trả lời vào {0}.
food|drinks|order|請給我一杯{0}，謝謝。|Qǐng gěi wǒ yī bēi {0}, xièxie.|Cho tôi một cốc {0}, cảm ơn.
food|drinks|quantity|我們要兩杯{0}。|Wǒmen yào liǎng bēi {0}.|Chúng tôi lấy hai cốc {0}.
food|drinks|takeaway|這杯{0}要外帶。|Zhè bēi {0} yào wài dài.|Cốc {0} này mang đi.
food|drinks|sugar|我的{0}不要加糖。|Wǒ de {0} bù yào jiā táng.|Đừng thêm đường vào {0} của tôi.
food|drinks|availability|請問，今天有{0}嗎？|Qǐngwèn, jīntiān yǒu {0} ma?|Xin hỏi, hôm nay có {0} không?
food|drinks|preference|我不想喝{0}，我想喝水。|Wǒ bù xiǎng hē {0}, wǒ xiǎng hē shuǐ.|Tôi không muốn uống {0}, tôi muốn uống nước.
food|drinks|payment|這杯{0}多少錢？|Zhè bēi {0} duōshǎo qián?|Cốc {0} này bao nhiêu tiền?
food|drinks|missing|我點的{0}還沒來。|Wǒ diǎn de {0} hái méi lái.|{0} tôi gọi vẫn chưa được mang ra.
shopping|things|find|請問，這裡有賣{0}嗎？|Qǐngwèn, zhèlǐ yǒu mài {0} ma?|Xin hỏi, ở đây có bán {0} không?
shopping|things|compare|這裡的{0}比那裡便宜。|Zhèlǐ de {0} bǐ nàlǐ piányí.|{0} ở đây rẻ hơn ở đó.
shopping|things|need|我今天只買{0}。|Wǒ jīntiān zhǐ mǎi {0}.|Hôm nay tôi chỉ mua {0}.
shopping|things|price|這些{0}一共多少錢？|Zhèxiē {0} yī gòng duōshǎo qián?|Những {0} này tổng cộng bao nhiêu tiền?
shopping|things|budget|這裡的{0}太貴了。|Zhèlǐ de {0} tài guì le.|{0} ở đây đắt quá.
shopping|things|payment|買{0}可以刷卡嗎？|Mǎi {0} kěyǐ shuākǎ ma?|Mua {0} có thể thanh toán bằng thẻ không?
shopping|things|purchase|我已經買好{0}了。|Wǒ yǐjīng mǎi hǎo {0} le.|Tôi đã mua xong {0} rồi.
shopping|things|return|我想退這些{0}。|Wǒ xiǎng tuì zhèxiē {0}.|Tôi muốn trả lại những {0} này.
transport|places|destination|到{0}要坐哪一班公車？|Dào {0} yào zuò nǎ yī bān gōngchē?|Đến {0} phải đi chuyến xe buýt nào?
transport|places|walking|從這裡走到{0}要多久？|Cóng zhèlǐ zǒu dào {0} yào duōjiǔ?|Đi bộ từ đây đến {0} mất bao lâu?
transport|places|taxi|請帶我到{0}。|Qǐng dài wǒ dào {0}.|Xin đưa tôi đến {0}.
transport|places|direction|往前走就到{0}了。|Wǎng qián zǒu jiù dào {0} le.|Đi về phía trước là đến {0}.
transport|places|transfer|去{0}要換車嗎？|Qù {0} yào huàn chē ma?|Đi {0} có cần đổi xe không?
transport|places|arrival|我已經到{0}門口了。|Wǒ yǐjīng dào {0} ménkǒu le.|Tôi đã đến cửa {0} rồi.
transport|places|pickup|我們在{0}前面等你。|Wǒmen zài {0} qiánmiàn děng nǐ.|Chúng tôi chờ bạn trước {0}.
transport|places|wrongway|這班車不到{0}。|Zhè bān chē bù dào {0}.|Chuyến xe này không đến {0}.
family|relatives|work|我{0}在醫院工作。|Wǒ {0} zài yīyuàn gōngzuò.|{0} tôi làm việc ở bệnh viện.
family|relatives|home|我跟{0}一起住。|Wǒ gēn {0} yīqǐ zhù.|Tôi sống cùng {0}.
family|relatives|visit|我明天去看{0}。|Wǒ míngtiān qù kàn {0}.|Ngày mai tôi đi thăm {0}.
family|relatives|preference|我{0}喜歡喝熱茶。|Wǒ {0} xǐhuān hē rè chá.|{0} tôi thích uống trà nóng.
family|relatives|availability|我{0}今天不在家。|Wǒ {0} jīntiān bù zài jiā.|Hôm nay {0} tôi không ở nhà.
family|relatives|contact|請幫我打電話給{0}。|Qǐng bāng wǒ dǎ diànhuà gěi {0}.|Xin giúp tôi gọi điện cho {0}.
family|relatives|photo|照片裡的人是我{0}。|Zhàopiàn lǐ de rén shì wǒ {0}.|Người trong ảnh là {0} tôi.
family|relatives|help|今天是我{0}做飯。|Jīntiān shì wǒ {0} zuò fàn.|Hôm nay người nấu cơm là {0} tôi.
home|things|location|我的{0}在房間裡。|Wǒ de {0} zài fángjiān lǐ.|{0} của tôi ở trong phòng.
home|things|missing|你看到我的{0}了嗎？|Nǐ kàn dào wǒ de {0} le ma?|Bạn có thấy {0} của tôi không?
home|things|ownership|這些{0}不是我的。|Zhèxiē {0} bù shì wǒ de.|Những {0} này không phải của tôi.
home|things|tidy|請把{0}放在桌上。|Qǐng bǎ {0} fàng zài zhuō shàng.|Xin đặt {0} lên bàn.
home|things|borrow|我可以借你的{0}嗎？|Wǒ kěyǐ jiè nǐ de {0} ma?|Tôi có thể mượn {0} của bạn không?
home|things|return|謝謝，我明天還你{0}。|Xièxie, wǒ míngtiān huán nǐ {0}.|Cảm ơn, ngày mai tôi trả {0} cho bạn.
home|things|bring|出門的時候，記得帶{0}。|Chūmén de shíhou, jìde dài {0}.|Khi ra ngoài, nhớ mang {0}.
home|things|storage|這裡沒有地方放{0}。|Zhèlǐ méiyǒu dìfang fàng {0}.|Ở đây không có chỗ để {0}.
schedule|days|class|{0}上午有課，下午沒有課。|{0} shàngwǔ yǒu kè, xiàwǔ méiyǒu kè.|Sáng {0} có lớp, buổi chiều không có lớp.
schedule|days|availability|{0}晚上你有空嗎？|{0} wǎnshàng nǐ yǒukòng ma?|Tối {0} bạn có rảnh không?
schedule|days|cancel|{0}的會議取消了。|{0} de huìyì qǔxiāo le.|Cuộc họp vào {0} đã bị hủy.
schedule|days|confirm|我們約的是{0}，對嗎？|Wǒmen yuē de shì {0}, duì ma?|Chúng ta hẹn vào {0}, đúng không?
schedule|hours|start|今天的課改成{0}開始。|Jīntiān de kè gǎi chéng {0} kāishǐ.|Lớp hôm nay đổi sang bắt đầu lúc {0}.
schedule|hours|finish|我到{0}才有空。|Wǒ dào {0} cái yǒukòng.|Đến {0} tôi mới rảnh.
schedule|hours|deadline|請在{0}以前到。|Qǐng zài {0} yǐqián dào.|Xin đến trước {0}.
schedule|hours|late|對不起，我{0}才能到。|Duìbuqǐ, wǒ {0} cái néng dào.|Xin lỗi, đến {0} tôi mới đến được.
information|places|address|請告訴我{0}的地址。|Qǐng gàosu wǒ {0} de dìzhǐ.|Xin cho tôi biết địa chỉ của {0}.
information|places|phone|你知道{0}的電話嗎？|Nǐ zhīdào {0} de diànhuà ma?|Bạn có biết số điện thoại của {0} không?
information|places|opening|{0}今天有開嗎？|{0} jīntiān yǒu kāi ma?|Hôm nay {0} có mở cửa không?
information|places|nearby|附近有{0}嗎？|Fùjìn yǒu {0} ma?|Gần đây có {0} không?
information|places|confirm|這是去{0}的路嗎？|Zhè shì qù {0} de lù ma?|Đây có phải đường đến {0} không?
information|places|distance|{0}離這裡很遠嗎？|{0} lí zhèlǐ hěn yuǎn ma?|{0} có cách đây xa không?
information|places|search|我在找{0}，不是找餐廳。|Wǒ zài zhǎo {0}, bù shì zhǎo cāntīng.|Tôi đang tìm {0}, không phải tìm nhà hàng.
information|places|repeat|請再說一次{0}的地址。|Qǐng zài shuō yī cì {0} de dìzhǐ.|Xin nói lại địa chỉ của {0} một lần.
classroom|study|meaning|請解釋一下{0}。|Qǐng jiěshì yīxià {0}.|Xin giải thích {0} một chút.
classroom|study|reading|請你先讀{0}。|Qǐng nǐ xiān dú {0}.|Xin bạn đọc {0} trước.
classroom|study|understand|我還不太懂{0}。|Wǒ hái bù tài dǒng {0}.|Tôi vẫn chưa hiểu rõ {0}.
classroom|study|review|我們明天再複習{0}。|Wǒmen míngtiān zài fùxí {0}.|Ngày mai chúng ta ôn lại {0}.
classroom|study|question|關於{0}，我有一個問題。|Guānyú {0}, wǒ yǒu yī ge wèntí.|Về {0}, tôi có một câu hỏi.
classroom|study|homework|今天的作業跟{0}有關。|Jīntiān de zuòyè gēn {0} yǒuguān.|Bài tập hôm nay liên quan đến {0}.
classroom|study|help|你可以教我{0}嗎？|Nǐ kěyǐ jiāo wǒ {0} ma?|Bạn có thể dạy tôi {0} không?
classroom|study|progress|老師還沒教{0}。|Lǎoshī hái méi jiāo {0}.|Thầy/cô vẫn chưa dạy {0}.
daily|actions|habit|我每天都要{0}。|Wǒ měitiān dōu yào {0}.|Ngày nào tôi cũng cần {0}.
daily|actions|ongoing|我正在{0}，等一下再說。|Wǒ zhèngzài {0}, děng yīxià zài shuō.|Tôi đang {0}, lát nữa nói tiếp.
daily|actions|plan|我吃完飯以後要{0}。|Wǒ chī wán fàn yǐhòu yào {0}.|Ăn cơm xong tôi sẽ {0}.
daily|actions|negative|我今天不想{0}。|Wǒ jīntiān bù xiǎng {0}.|Hôm nay tôi không muốn {0}.
daily|actions|frequency|你常常{0}嗎？|Nǐ chángcháng {0} ma?|Bạn có thường {0} không?
daily|actions|sequence|我先{0}，再回家。|Wǒ xiān {0}, zài huíjiā.|Tôi {0} trước, rồi về nhà.
daily|actions|time|你通常幾點{0}？|Nǐ tōngcháng jǐ diǎn {0}?|Bạn thường {0} lúc mấy giờ?
daily|actions|tomorrow|明天不用{0}，可以休息。|Míngtiān bù yòng {0}, kěyǐ xiūxi.|Ngày mai không cần {0}, có thể nghỉ ngơi.
campus|days|borrow|我{0}去圖書館借書。|Wǒ {0} qù túshūguǎn jiè shū.|Tôi đến thư viện mượn sách vào {0}.
campus|days|return|這本書要在{0}以前還。|Zhè běn shū yào zài {0} yǐqián huán.|Quyển sách này phải trả trước {0}.
campus|days|professor|教授{0}下午有空。|Jiàoshòu {0} xiàwǔ yǒukòng.|Giáo sư rảnh chiều {0}.
campus|days|meeting|我想約老師{0}見面。|Wǒ xiǎng yuē lǎoshī {0} jiànmiàn.|Tôi muốn hẹn gặp thầy/cô vào {0}.
campus|days|report|我們{0}要交報告。|Wǒmen {0} yào jiāo bàogào.|Chúng tôi phải nộp báo cáo vào {0}.
campus|days|group|{0}我們一起準備報告。|{0} wǒmen yīqǐ zhǔnbèi bàogào.|{0} chúng tôi cùng chuẩn bị báo cáo.
campus|days|exam|{0}有考試，不能請假。|{0} yǒu kǎoshì, bù néng qǐngjià.|{0} có thi, không thể xin nghỉ.
campus|days|registration|選課到{0}結束。|Xuǎnkè dào {0} jiéshù.|Đăng ký môn học kết thúc vào {0}.
health|symptoms|symptom|我從昨天開始{0}。|Wǒ cóng zuótiān kāishǐ {0}.|Tôi bắt đầu {0} từ hôm qua.
health|symptoms|duration|我已經{0}三天了。|Wǒ yǐjīng {0} sān tiān le.|Tôi đã {0} ba ngày rồi.
health|symptoms|question|你現在還會{0}嗎？|Nǐ xiànzài hái huì {0} ma?|Bây giờ bạn còn bị {0} không?
health|symptoms|appointment|因為{0}，我想掛號。|Yīnwèi {0}, wǒ xiǎng guàhào.|Vì {0}, tôi muốn đăng ký khám.
health|symptoms|report|請告訴醫生，我有{0}的症狀。|Qǐng gàosu yīshēng, wǒ yǒu {0} de zhèngzhuàng.|Xin nói với bác sĩ rằng tôi có triệu chứng {0}.
health|symptoms|rest|我今天{0}，想在家休息。|Wǒ jīntiān {0}, xiǎng zài jiā xiūxi.|Hôm nay tôi {0}, muốn nghỉ ở nhà.
health|symptoms|absence|他因為{0}，今天沒有來上班。|Tā yīnwèi {0}, jīntiān méiyǒu lái shàngbān.|Vì {0}, hôm nay anh ấy không đến làm.
health|symptoms|worry|如果明天還{0}，我就去看醫生。|Rúguǒ míngtiān hái {0}, wǒ jiù qù kàn yīshēng.|Nếu ngày mai vẫn {0}, tôi sẽ đi khám bác sĩ.
renting|appliances|included|這間房有{0}嗎？|Zhè jiān fáng yǒu {0} ma?|Phòng này có {0} không?
renting|appliances|broken|這裡的{0}不能用了。|Zhèlǐ de {0} bù néng yòng le.|{0} ở đây không dùng được nữa.
renting|appliances|repair|請房東找人來修{0}。|Qǐng fángdōng zhǎo rén lái xiū {0}.|Xin chủ nhà tìm người đến sửa {0}.
renting|appliances|purchase|我搬家以後要買{0}。|Wǒ bānjiā yǐhòu yào mǎi {0}.|Sau khi chuyển nhà tôi sẽ mua {0}.
renting|appliances|shared|這裡的{0}是大家一起用的。|Zhèlǐ de {0} shì dàjiā yīqǐ yòng de.|{0} ở đây là đồ dùng chung của mọi người.
renting|appliances|check|搬進來以前，我想先看看{0}。|Bān jìnlái yǐqián, wǒ xiǎng xiān kànkan {0}.|Trước khi chuyển vào, tôi muốn xem {0} trước.
renting|appliances|missing|房間裡沒有{0}。|Fángjiān lǐ méiyǒu {0}.|Trong phòng không có {0}.
renting|appliances|permission|我可以自己換{0}嗎？|Wǒ kěyǐ zìjǐ huàn {0} ma?|Tôi có thể tự thay {0} không?
services|documents|bring|辦理的時候要帶{0}。|Bànlǐ de shíhou yào dài {0}.|Khi làm thủ tục phải mang {0}.
services|documents|copy|請幫我影印{0}。|Qǐng bāng wǒ yǐngyìn {0}.|Xin giúp tôi photocopy {0}.
services|documents|lost|我的{0}不見了。|Wǒ de {0} bú jiàn le.|{0} của tôi bị mất rồi.
services|documents|check|請先確認{0}上的名字。|Qǐng xiān quèrèn {0} shàng de míngzi.|Xin xác nhận tên trên {0} trước.
services|documents|send|可以用電子郵件寄{0}嗎？|Kěyǐ yòng diànzǐ yóujiàn jì {0} ma?|Có thể gửi {0} qua thư điện tử không?
services|documents|receive|我還沒有收到{0}。|Wǒ hái méiyǒu shōu dào {0}.|Tôi vẫn chưa nhận được {0}.
services|documents|counter|請把{0}交給櫃臺人員。|Qǐng bǎ {0} jiāo gěi guìtái rényuán.|Xin đưa {0} cho nhân viên quầy.
services|documents|return|用完以後，請把{0}還給我。|Yòng wán yǐhòu, qǐng bǎ {0} huán gěi wǒ.|Dùng xong, xin trả lại {0} cho tôi.
worklife|work|plan|我明天下午要{0}。|Wǒ míngtiān xiàwǔ yào {0}.|Chiều mai tôi sẽ {0}.
worklife|work|request|主管請我今天{0}。|Zhǔguǎn qǐng wǒ jīntiān {0}.|Quản lý yêu cầu tôi {0} hôm nay.
worklife|work|ability|你明天可以{0}嗎？|Nǐ míngtiān kěyǐ {0} ma?|Ngày mai bạn có thể {0} không?
worklife|work|priority|我得先{0}，晚一點再說。|Wǒ děi xiān {0}, wǎn yī diǎn zài shuō.|Tôi phải {0} trước, lát nữa nói tiếp.
worklife|work|reason|因為要{0}，我不能參加聚餐。|Yīnwèi yào {0}, wǒ bù néng cānjiā jùcān.|Vì phải {0}, tôi không thể tham gia bữa ăn chung.
worklife|work|colleague|我的同事今天要{0}。|Wǒ de tóngshì jīntiān yào {0}.|Hôm nay đồng nghiệp tôi phải {0}.
worklife|work|confirm|你說的是明天{0}，對嗎？|Nǐ shuō de shì míngtiān {0}, duì ma?|Ý bạn là {0} vào ngày mai, đúng không?
worklife|work|change|我原本要{0}，現在不用了。|Wǒ yuánběn yào {0}, xiànzài bù yòng le.|Ban đầu tôi định {0}, giờ không cần nữa.
travel|travel|destination|我們下個月要去{0}旅行。|Wǒmen xià ge yuè yào qù {0} lǚxíng.|Tháng sau chúng tôi sẽ đi du lịch {0}.
travel|travel|ticket|我要買一張到{0}的車票。|Wǒ yào mǎi yī zhāng dào {0} de chēpiào.|Tôi muốn mua một vé xe đến {0}.
travel|travel|duration|你打算在{0}住幾天？|Nǐ dǎsuàn zài {0} zhù jǐ tiān?|Bạn định ở {0} mấy ngày?
travel|travel|weather|聽說{0}明天會下雨。|Tīngshuō {0} míngtiān huì xià yǔ.|Nghe nói ngày mai {0} sẽ có mưa.
travel|travel|experience|我以前沒去過{0}。|Wǒ yǐqián méi qù guò {0}.|Trước đây tôi chưa từng đến {0}.
travel|travel|hotel|我們已經訂好{0}的旅館了。|Wǒmen yǐjīng dìng hǎo {0} de lǚguǎn le.|Chúng tôi đã đặt xong khách sạn ở {0} rồi.
travel|travel|return|從{0}回來以後，我要休息一天。|Cóng {0} huílái yǐhòu, wǒ yào xiūxi yī tiān.|Sau khi từ {0} trở về, tôi sẽ nghỉ một ngày.
travel|travel|recommend|你可以介紹{0}的景點嗎？|Nǐ kěyǐ jièshào {0} de jǐngdiǎn ma?|Bạn có thể giới thiệu điểm tham quan ở {0} không?
social|social|invite|週末要不要一起{0}？|Zhōumò yào bù yào yīqǐ {0}?|Cuối tuần có muốn cùng {0} không?
social|social|decline|謝謝你的邀請，可是我今天不能{0}。|Xièxie nǐ de yāoqǐng, kěshì wǒ jīntiān bù néng {0}.|Cảm ơn lời mời của bạn, nhưng hôm nay tôi không thể {0}.
social|social|preference|比起逛夜市，我更想{0}。|Bǐ qǐ guàng yèshì, wǒ gèng xiǎng {0}.|So với đi chợ đêm, tôi muốn {0} hơn.
social|social|reschedule|我們改天再{0}，好嗎？|Wǒmen gǎitiān zài {0}, hǎo ma?|Chúng ta để hôm khác {0}, được không?
social|social|company|你想跟誰一起{0}？|Nǐ xiǎng gēn shéi yīqǐ {0}?|Bạn muốn cùng ai {0}?
social|social|permission|我可以跟你們一起{0}嗎？|Wǒ kěyǐ gēn nǐmen yīqǐ {0} ma?|Tôi có thể cùng các bạn {0} không?
social|social|time|我們吃完早餐再去{0}。|Wǒmen chī wán zǎocān zài qù {0}.|Chúng ta ăn sáng xong rồi đi {0}.
social|social|apology|對不起，今天沒辦法陪你{0}。|Duìbuqǐ, jīntiān méi bànfǎ péi nǐ {0}.|Xin lỗi, hôm nay không thể cùng bạn {0}.'''
