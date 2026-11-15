"""Application frames for the 40 supplemental lessons, separate from examples.

Each row has a full authored pattern and a bounded phrase slot. The compiler
selects five distinct values per row; two rows supply ten independent tasks.
"""
from content.sentence_review_authoring import SLOTS, triples

SLOTS = {**SLOTS,
'greeting-people':triples('''你|nǐ|bạn
他|tā|anh ấy
她|tā|cô ấy
你們|nǐmen|các bạn
他們|tāmen|họ'''),
'names':triples('''小美|Xiǎo Měi|Tiểu Mỹ
小明|Xiǎo Míng|Tiểu Minh
小林|Xiǎo Lín|Tiểu Lâm
小陳|Xiǎo Chén|Tiểu Trần
小王|Xiǎo Wáng|Tiểu Vương'''),
'countries':triples('''越南|Yuènán|Việt Nam
臺灣|Táiwān|Đài Loan
日本|Rìběn|Nhật Bản
韓國|Hánguó|Hàn Quốc
美國|Měiguó|Mỹ'''),
'two':triples('''兩張票|liǎng zhāng piào|hai vé
兩本書|liǎng běn shū|hai quyển sách
兩碗飯|liǎng wǎn fàn|hai bát cơm
兩杯水|liǎng bēi shuǐ|hai cốc nước
兩個月|liǎng ge yuè|hai tháng'''),
'ordinal':triples('''第二天|dì èr tiān|ngày thứ hai
第二課|dì èr kè|bài thứ hai
第二次|dì èr cì|lần thứ hai
第二個|dì èr ge|cái thứ hai
第二本|dì èr běn|quyển thứ hai'''),
'dates':triples('''一月十五號|yī yuè shí wǔ hào|ngày 15 tháng 1
三月二十號|sān yuè èr shí hào|ngày 20 tháng 3
六月十二號|liù yuè shí èr hào|ngày 12 tháng 6
九月八號|jiǔ yuè bā hào|ngày 8 tháng 9
十二月二十五號|shí èr yuè èr shí wǔ hào|ngày 25 tháng 12'''),
'relative':triples('''上個月|shàng ge yuè|tháng trước
這個月|zhè ge yuè|tháng này
下個月|xià ge yuè|tháng sau
去年|qùnián|năm ngoái
明年|míngnián|năm sau'''),
'sizes':triples('''大|dà|lớn
小|xiǎo|nhỏ
長|cháng|dài
短|duǎn|ngắn
便宜|piányí|rẻ'''),
'colours':triples('''紅色|hóngsè|màu đỏ
藍色|lánsè|màu xanh dương
白色|báisè|màu trắng
黑色|hēisè|màu đen
綠色|lǜsè|màu xanh lá'''),
'positions':triples('''左邊|zuǒbiān|bên trái
右邊|yòubiān|bên phải
前面|qiánmiàn|phía trước
後面|hòumiàn|phía sau
旁邊|pángbiān|bên cạnh'''),
'vehicles':triples('''公車|gōngchē|xe buýt
捷運|jiéyùn|MRT
火車|huǒchē|tàu hỏa
高鐵|gāotiě|tàu cao tốc
計程車|jìchéngchē|taxi'''),
'ages':triples('''二十三|èr shí sān|23
二十八|èr shí bā|28
三十二|sān shí èr|32
四十七|sì shí qī|47
五十一|wǔ shí yī|51'''),
'cold-drinks':triples('''冰茶|bīng chá|trà đá
紅茶|hóngchá|trà đen
綠茶|lǜchá|trà xanh
果汁|guǒzhī|nước ép trái cây
豆漿|dòujiāng|sữa đậu nành'''),
'roomactions':triples('''開門|kāi mén|mở cửa
關門|guān mén|đóng cửa
開窗戶|kāi chuānghù|mở cửa sổ
關窗戶|guān chuānghù|đóng cửa sổ
開冷氣|kāi lěngqì|bật máy lạnh'''),
'quiet':triples('''安靜|ānjìng|yên tĩnh
乾淨|gānjìng|sạch sẽ
大|dà|rộng
小|xiǎo|nhỏ
方便|fāngbiàn|thuận tiện'''),
'questions':triples('''誰|shéi|ai
哪裡|nǎlǐ|ở đâu
什麼時候|shénme shíhou|khi nào
怎麼|zěnme|như thế nào
為什麼|wèishénme|tại sao'''),
'numbers-phone':triples('''一二三|yī èr sān|một-hai-ba
二三四|èr sān sì|hai-ba-bốn
三四五|sān sì wǔ|ba-bốn-năm
四五六|sì wǔ liù|bốn-năm-sáu
五六七|wǔ liù qī|năm-sáu-bảy'''),
'homework':triples('''讀課文|dú kèwén|đọc bài khóa
寫名字|xiě míngzi|viết tên
回答問題|huídá wèntí|trả lời câu hỏi
聽錄音|tīng lùyīn|nghe bản ghi âm
複習生詞|fùxí shēngcí|ôn từ mới'''),
'duration':triples('''一天|yī tiān|một ngày
兩天|liǎng tiān|hai ngày
三天|sān tiān|ba ngày
一個星期|yī ge xīngqí|một tuần
兩個星期|liǎng ge xīngqí|hai tuần'''),
'mail':triples('''資料|zīliào|tài liệu
報告|bàogào|báo cáo
作業|zuòyè|bài tập
電子郵件|diànzǐ yóujiàn|thư điện tử
訊息|xùnxí|tin nhắn'''),
'costs':triples('''水費|shuǐfèi|tiền nước
電費|diànfèi|tiền điện
管理費|guǎnlǐfèi|phí quản lý
網路費|wǎnglùfèi|phí Internet
清潔費|qīngjiéfèi|phí vệ sinh'''),
'parcels':triples('''這個包裹|zhè ge bāoguǒ|bưu kiện này
這封信|zhè fēng xìn|lá thư này
這些書|zhèxiē shū|những quyển sách này
這些衣服|zhèxiē yīfu|những bộ quần áo này
這份文件|zhè fèn wénjiàn|tài liệu này'''),
'nights':triples('''一晚|yī wǎn|một đêm
兩晚|liǎng wǎn|hai đêm
三晚|sān wǎn|ba đêm
四晚|sì wǎn|bốn đêm
五晚|wǔ wǎn|năm đêm'''),
}

# unit / lesson-key / slot / full Hanzi / Pinyin / Vietnamese
FRAMES='''greetings|introduce|names|她叫{0}，你呢？|Tā jiào {0}, nǐ ne?|Cô ấy tên {0}, còn bạn thì sao?
greetings|introduce|countries|我的朋友也是{0}人。|Wǒ de péngyǒu yě shì {0} rén.|Bạn tôi cũng là người {0}.
greetings|polite|greeting-people|請問，{0}是新同學嗎？|Qǐngwèn, {0} shì xīn tóngxué ma?|Xin hỏi, {0} là bạn học mới phải không?
greetings|polite|greeting-people|{0}不是新同學。|{0} bú shì xīn tóngxué.|{0} không phải bạn học mới.
numbers|tens|tens|{0}|{0}|{0}
numbers|tens|ages|{0}|{0}|{0}
numbers|hundreds|prices|{0}|{0}|{0}
numbers|hundreds|prices|一千{0}|yī qiān {0}|1.000 cộng {0}
numbers|two|two|我要{0}。|Wǒ yào {0}.|Tôi muốn {0}.
numbers|two|ordinal|我說的是{0}。|Wǒ shuō de shì {0}.|Ý tôi là {0}.
numbers|clock|hours|我們約{0}。|Wǒmen yuē {0}.|Chúng ta hẹn lúc {0}.
numbers|clock|hours|今天{0}下課。|Jīntiān {0} xiàkè.|Hôm nay tan học lúc {0}.
numbers|calendar|dates|我的生日是{0}。|Wǒ de shēngrì shì {0}.|Sinh nhật tôi là {0}.
numbers|calendar|days|{0}我們不用上課。|{0} wǒmen bù yòng shàngkè.|{0} chúng tôi không cần đi học.
numbers|relative|relative|{0}我不在臺灣。|{0} wǒ bù zài Táiwān.|{0} tôi không ở Đài Loan.
numbers|relative|relative|我們說的是{0}的行程。|Wǒmen shuō de shì {0} de xíngchéng.|Chúng ta đang nói về lịch trình của {0}.
food|order|drinks|我要三杯{0}，外帶。|Wǒ yào sān bēi {0}, wài dài.|Tôi lấy ba cốc {0}, mang đi.
food|order|drinks|這兩杯{0}是內用的。|Zhè liǎng bēi {0} shì nèi yòng de.|Hai cốc {0} này dùng tại chỗ.
food|preferences|drinks|這杯{0}不要加糖。|Zhè bēi {0} bù yào jiā táng.|Đừng thêm đường vào cốc {0} này.
food|preferences|cold-drinks|我的{0}要少冰。|Wǒ de {0} yào shǎo bīng.|{0} của tôi lấy ít đá.
shopping|prices|prices|一共{0}元，可以刷卡。|Yī gòng {0} yuán, kěyǐ shuākǎ.|Tổng cộng {0} Đài tệ, có thể trả bằng thẻ.
shopping|prices|prices|這個要{0}元，我用現金付。|Zhè ge yào {0} yuán, wǒ yòng xiànjīn fù.|Cái này giá {0} Đài tệ, tôi trả bằng tiền mặt.
shopping|compare|sizes|請給我{0}一點的。|Qǐng gěi wǒ {0} yī diǎn de.|Xin cho tôi cái {0} hơn một chút.
shopping|compare|colours|我想試穿{0}的。|Wǒ xiǎng shìchuān {0} de.|Tôi muốn thử cái {0}.
transport|directions|positions|郵局在車站{0}。|Yóujú zài chēzhàn {0}.|Bưu điện ở {0} nhà ga.
transport|directions|positions|請到路口{0}等我。|Qǐng dào lùkǒu {0} děng wǒ.|Xin đến {0} giao lộ chờ tôi.
transport|journey|vehicles|坐{0}到那裡要多久？|Zuò {0} dào nàlǐ yào duōjiǔ?|Đi {0} đến đó mất bao lâu?
transport|journey|vehicles|我先坐{0}，再走路。|Wǒ xiān zuò {0}, zài zǒulù.|Tôi đi {0} trước, rồi đi bộ.
family|people|relatives|我跟{0}住在臺北。|Wǒ gēn {0} zhù zài Táiběi.|Tôi sống ở Đài Bắc cùng {0}.
family|people|relatives|我{0}也會說中文。|Wǒ {0} yě huì shuō Zhōngwén.|{0} tôi cũng biết nói tiếng Trung.
family|age|ages|我姐姐今年{0}歲。|Wǒ jiějie jīnnián {0} suì.|Năm nay chị tôi {0} tuổi.
family|age|people|請問，{0}做什麼工作？|Qǐngwèn, {0} zuò shénme gōngzuò?|Xin hỏi, {0} làm công việc gì?
home|location|things|{0}在椅子上，不在桌上。|{0} zài yǐzi shàng, bù zài zhuō shàng.|{0} ở trên ghế, không ở trên bàn.
home|location|things|床旁邊有{0}。|Chuáng pángbiān yǒu {0}.|Bên cạnh giường có {0}.
home|describe|quiet|這個房間很{0}，我想租。|Zhè ge fángjiān hěn {0}, wǒ xiǎng zū.|Phòng này rất {0}, tôi muốn thuê.
home|describe|roomactions|麻煩你幫我{0}。|Máfan nǐ bāng wǒ {0}.|Phiền bạn giúp tôi {0}.
schedule|weekly|days|我{0}上午九點有課。|Wǒ {0} shàngwǔ jiǔ diǎn yǒu kè.|Tôi có lớp lúc chín giờ sáng {0}.
schedule|weekly|hours|星期五的課{0}開始。|Xīngqí wǔ de kè {0} kāishǐ.|Lớp thứ Sáu bắt đầu lúc {0}.
schedule|availability|days|你{0}下午有空嗎？|Nǐ {0} xiàwǔ yǒukòng ma?|Chiều {0} bạn có rảnh không?
schedule|availability|hours|我們改成{0}，可以嗎？|Wǒmen gǎi chéng {0}, kěyǐ ma?|Chúng ta đổi sang {0}, được không?
information|questions|questions|我想問的是「{0}」。|Wǒ xiǎng wèn de shì “{0}”.|Điều tôi muốn hỏi là “{0}”.
information|questions|places|請問，怎麼去{0}？|Qǐngwèn, zěnme qù {0}?|Xin hỏi, đi {0} bằng cách nào?
information|confirm|numbers-phone|最後三個號碼是{0}，對嗎？|Zuìhòu sān ge hàomǎ shì {0}, duì ma?|Ba số cuối là {0}, đúng không?
information|confirm|places|請再說一次去{0}的方法。|Qǐng zài shuō yī cì qù {0} de fāngfǎ.|Xin nói lại một lần cách đi {0}.
classroom|understand|study|我聽得清楚，可是不懂{0}。|Wǒ tīng de qīngchǔ, kěshì bù dǒng {0}.|Tôi nghe rõ, nhưng không hiểu {0}.
classroom|understand|study|老師可以再解釋一次{0}嗎？|Lǎoshī kěyǐ zài jiěshì yī cì {0} ma?|Thầy/cô có thể giải thích {0} thêm một lần không?
classroom|instructions|homework|請先{0}，再問問題。|Qǐng xiān {0}, zài wèn wèntí.|Xin {0} trước, rồi hỏi câu hỏi.
classroom|instructions|days|作業要{0}交嗎？|Zuòyè yào {0} jiāo ma?|Bài tập phải nộp vào {0} phải không?
daily|routine|actions|我有時候晚上{0}。|Wǒ yǒu shíhou wǎnshàng {0}.|Đôi khi tôi {0} vào buổi tối.
daily|routine|actions|我先{0}，然後休息。|Wǒ xiān {0}, ránhòu xiūxi.|Tôi {0} trước, rồi nghỉ ngơi.
daily|now-already|actions|他正在{0}，現在不方便。|Tā zhèngzài {0}, xiànzài bù fāngbiàn.|Anh ấy đang {0}, bây giờ không tiện.
daily|now-already|homework|我已經{0}了。|Wǒ yǐjīng {0} le.|Tôi đã {0} rồi.
campus|library|duration|這本書可以借{0}嗎？|Zhè běn shū kěyǐ jiè {0} ma?|Quyển sách này có thể mượn trong {0} không?
campus|library|days|我{0}去還書。|Wǒ {0} qù huán shū.|Tôi đi trả sách vào {0}.
campus|meeting|days|老師，{0}可以跟您見面嗎？|Lǎoshī, {0} kěyǐ gēn nín jiànmiàn ma?|Thưa thầy/cô, có thể gặp thầy/cô vào {0} không?
campus|meeting|mail|請問，您收到我寄的{0}了嗎？|Qǐngwèn, nín shōu dào wǒ jì de {0} le ma?|Xin hỏi, thầy/cô đã nhận được {0} tôi gửi chưa?
health|symptoms|symptoms|我昨天晚上開始{0}。|Wǒ zuótiān wǎnshàng kāishǐ {0}.|Tôi bắt đầu {0} tối qua.
health|symptoms|symptoms|現在還是有點{0}。|Xiànzài háishì yǒudiǎn {0}.|Bây giờ vẫn hơi {0}.
health|clinic|days|請問，{0}可以掛號嗎？|Qǐngwèn, {0} kěyǐ guàhào ma?|Xin hỏi, có thể đăng ký khám vào {0} không?
health|clinic|hours|醫生，這個藥可以{0}吃嗎？|Yīshēng, zhè ge yào kěyǐ {0} chī ma?|Thưa bác sĩ, thuốc này có thể uống lúc {0} không?
renting|costs|costs|租金不包括{0}。|Zūjīn bù bāokuò {0}.|Tiền thuê không bao gồm {0}.
renting|costs|prices|每個月的管理費是{0}元。|Měi ge yuè de guǎnlǐfèi shì {0} yuán.|Phí quản lý mỗi tháng là {0} Đài tệ.
renting|repairs|appliances|房東，我的{0}壞了。|Fángdōng, wǒ de {0} huài le.|Chủ nhà ơi, {0} của tôi hỏng rồi.
renting|repairs|days|可以{0}來修理嗎？|Kěyǐ {0} lái xiūlǐ ma?|Có thể đến sửa vào {0} không?
services|send|parcels|寄{0}要多少運費？|Jì {0} yào duōshǎo yùnfèi?|Gửi {0} tốn bao nhiêu phí vận chuyển?
services|send|parcels|我是來領{0}的。|Wǒ shì lái lǐng {0} de.|Tôi đến để nhận {0}.
services|forms|documents|請問，{0}上要簽名嗎？|Qǐngwèn, {0} shàng yào qiānmíng ma?|Xin hỏi, có cần ký tên trên {0} không?
services|forms|documents|麻煩幫我影印{0}。|Máfan bāng wǒ yǐngyìn {0}.|Phiền giúp tôi photocopy {0}.
worklife|reschedule|days|我{0}要請假，不能開會。|Wǒ {0} yào qǐngjià, bù néng kāihuì.|Tôi xin nghỉ vào {0}, không thể họp.
worklife|reschedule|hours|會議可以改到{0}嗎？|Huìyì kěyǐ gǎi dào {0} ma?|Cuộc họp có thể chuyển sang {0} không?
worklife|progress|mail|我正在準備{0}，還沒完成。|Wǒ zhèngzài zhǔnbèi {0}, hái méi wánchéng.|Tôi đang chuẩn bị {0}, vẫn chưa hoàn thành.
worklife|progress|mail|{0}已經寄出去了。|{0} yǐjīng jì chūqù le.|{0} đã được gửi đi rồi.
travel|booking|nights|我想訂雙人房，住{0}。|Wǒ xiǎng dìng shuāngrénfáng, zhù {0}.|Tôi muốn đặt phòng đôi, ở {0}.
travel|booking|dates|我們{0}入住，住兩晚。|Wǒmen {0} rùzhù, zhù liǎng wǎn.|Chúng tôi nhận phòng vào {0}, ở hai đêm.
travel|experience-weather|travel|我還沒去過{0}。|Wǒ hái méi qù guò {0}.|Tôi vẫn chưa từng đến {0}.
travel|experience-weather|travel|如果下雨，我們就不去{0}。|Rúguǒ xià yǔ, wǒmen jiù bù qù {0}.|Nếu trời mưa, chúng tôi sẽ không đi {0}.
social|invite|social|明天要不要跟我們一起{0}？|Míngtiān yào bù yào gēn wǒmen yīqǐ {0}?|Ngày mai có muốn cùng chúng tôi {0} không?
social|invite|social|今天沒辦法{0}，下次再約。|Jīntiān méi bànfǎ {0}, xià cì zài yuē.|Hôm nay không thể {0}, lần sau hẹn lại.
social|choices|social|你想{0}，還是想休息？|Nǐ xiǎng {0}, háishì xiǎng xiūxi?|Bạn muốn {0} hay muốn nghỉ ngơi?
social|choices|social|我比較想{0}，你覺得呢？|Wǒ bǐjiào xiǎng {0}, nǐ juéde ne?|Tôi muốn {0} hơn, bạn thấy sao?'''
