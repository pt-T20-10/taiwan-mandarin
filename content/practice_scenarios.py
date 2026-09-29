"""Original annotated scenarios for v7. Draft, not teacher-reviewed.

Each scenario: destination, activity, necessary item, next action.
Pinyin is authored in context, never obtained by concatenating character readings.
"""
SCENARIOS = {
'greetings': [
('教室|jiàoshì|phòng học','認識新同學|rènshì xīn tóngxué|làm quen bạn học mới','學生證|xuéshēngzhèng|thẻ sinh viên','介紹自己的名字|jièshào zìjǐ de míngzi|giới thiệu tên của mình'),
('學校|xuéxiào|trường học','跟老師打招呼|gēn lǎoshī dǎ zhāohu|chào thầy cô','課本|kèběn|sách giáo khoa','告訴老師我來自越南|gàosu lǎoshī wǒ láizì Yuènán|nói với thầy cô rằng tôi đến từ Việt Nam'),
('活動中心|huódòng zhōngxīn|trung tâm sinh hoạt','參加歡迎會|cānjiā huānyínghuì|tham dự buổi chào đón','名牌|míngpái|bảng tên','問新朋友怎麼稱呼|wèn xīn péngyou zěnme chēnghu|hỏi cách xưng hô với bạn mới')],
'numbers': [
('車站|chēzhàn|nhà ga','確認火車的時間|quèrèn huǒchē de shíjiān|xác nhận giờ tàu','車票|chēpiào|vé tàu','記下出發時間|jìxià chūfā shíjiān|ghi lại giờ khởi hành'),
('銀行|yínháng|ngân hàng','抽號碼牌|chōu hàomǎpái|lấy số thứ tự','身分證|shēnfènzhèng|căn cước','等叫號|děng jiàohào|chờ gọi số'),
('商店|shāngdiàn|cửa hàng','確認商品的價格|quèrèn shāngpǐn de jiàgé|xác nhận giá sản phẩm','錢包|qiánbāo|ví tiền','算一共要付多少錢|suàn yīgòng yào fù duōshǎo qián|tính tổng số tiền phải trả')],
'food': [
('麵店|miàndiàn|quán mì','吃牛肉麵|chī niúròumiàn|ăn mì bò','現金|xiànjīn|tiền mặt','點一杯茶|diǎn yī bēi chá|gọi một ly trà'),
('早餐店|zǎocāndiàn|quán ăn sáng','買蛋餅|mǎi dànbǐng|mua bánh trứng','現金|xiànjīn|tiền mặt','買一杯豆漿|mǎi yī bēi dòujiāng|mua một ly sữa đậu nành'),
('餐廳|cāntīng|nhà hàng','吃晚餐|chī wǎncān|ăn tối','訂位資料|dìngwèi zīliào|thông tin đặt bàn','請服務生推薦一道菜|qǐng fúwùshēng tuījiàn yī dào cài|nhờ nhân viên giới thiệu một món')],
'shopping': [
('市場|shìchǎng|chợ','買水果|mǎi shuǐguǒ|mua trái cây','購物袋|gòuwùdài|túi mua sắm','問蘋果一斤多少錢|wèn píngguǒ yī jīn duōshǎo qián|hỏi một cân Đài Loan táo giá bao nhiêu'),
('超市|chāoshì|siêu thị','買牛奶|mǎi niúnǎi|mua sữa','購物清單|gòuwù qīngdān|danh sách mua sắm','確認有效日期|quèrèn yǒuxiào rìqí|kiểm tra hạn dùng'),
('服飾店|fúshìdiàn|cửa hàng quần áo','買外套|mǎi wàitào|mua áo khoác','信用卡|xìnyòngkǎ|thẻ tín dụng','試穿藍色的外套|shìchuān lánsè de wàitào|thử áo khoác màu xanh dương')],
'transport': [
('捷運站|jiéyùnzhàn|ga MRT','搭捷運|dā jiéyùn|đi MRT','悠遊卡|yōuyóukǎ|thẻ EasyCard','看路線圖|kàn lùxiàntú|xem sơ đồ tuyến'),
('公車站|gōngchēzhàn|trạm xe buýt','搭公車|dā gōngchē|đi xe buýt','零錢|língqián|tiền lẻ','確認公車的方向|quèrèn gōngchē de fāngxiàng|xác nhận hướng xe buýt'),
('高鐵站|gāotiězhàn|ga tàu cao tốc','搭高鐵|dā gāotiě|đi tàu cao tốc','車票|chēpiào|vé tàu','找自己的座位|zhǎo zìjǐ de zuòwèi|tìm chỗ ngồi của mình')],
'family': [
('爺爺家|yéye jiā|nhà ông nội','看爺爺|kàn yéye|thăm ông nội','水果|shuǐguǒ|trái cây','跟爺爺聊天|gēn yéye liáotiān|trò chuyện với ông nội'),
('姐姐家|jiějie jiā|nhà chị gái','幫姐姐做飯|bāng jiějie zuòfàn|giúp chị gái nấu ăn','蔬菜|shūcài|rau','一起吃午餐|yīqǐ chī wǔcān|ăn trưa cùng nhau'),
('弟弟的學校|dìdi de xuéxiào|trường của em trai','接弟弟回家|jiē dìdi huí jiā|đón em trai về nhà','雨傘|yǔsǎn|ô','問弟弟今天學了什麼|wèn dìdi jīntiān xué le shénme|hỏi hôm nay em trai đã học gì')],
'home': [
('新家|xīn jiā|nhà mới','整理房間|zhěnglǐ fángjiān|dọn phòng','紙箱|zhǐxiāng|thùng giấy','把書放在書架上|bǎ shū fàng zài shūjià shàng|đặt sách lên giá sách'),
('家具店|jiājùdiàn|cửa hàng nội thất','買書桌|mǎi shūzhuō|mua bàn học','房間的照片|fángjiān de zhàopiàn|ảnh căn phòng','量書桌的大小|liáng shūzhuō de dàxiǎo|đo kích thước bàn học'),
('陽台|yángtái|ban công','整理盆栽|zhěnglǐ pénzāi|chăm sóc cây trong chậu','水壺|shuǐhú|bình nước','把地板擦乾淨|bǎ dìbǎn cā gānjìng|lau sạch sàn')],
'schedule': [
('圖書館|túshūguǎn|thư viện','準備考試|zhǔnbèi kǎoshì|chuẩn bị thi','筆記|bǐjì|vở ghi chép','複習今天的課|fùxí jīntiān de kè|ôn bài hôm nay'),
('教室|jiàoshì|phòng học','上中文課|shàng Zhōngwén kè|học lớp tiếng Trung','課本|kèběn|sách giáo khoa','交昨天的作業|jiāo zuótiān de zuòyè|nộp bài tập hôm qua'),
('咖啡店|kāfēidiàn|quán cà phê','討論下週的計畫|tǎolùn xià zhōu de jìhuà|thảo luận kế hoạch tuần sau','行事曆|xíngshìlì|lịch làm việc','確認大家有空的時間|quèrèn dàjiā yǒu kòng de shíjiān|xác nhận thời gian mọi người rảnh')],
'information': [
('服務臺|fúwùtái|quầy dịch vụ','問路|wèn lù|hỏi đường','地圖|dìtú|bản đồ','記下服務人員說的方向|jìxià fúwù rényuán shuō de fāngxiàng|ghi lại hướng nhân viên chỉ'),
('車站|chēzhàn|nhà ga','問售票處在哪裡|wèn shòupiàochù zài nǎlǐ|hỏi quầy vé ở đâu','手機|shǒujī|điện thoại','確認營業時間|quèrèn yíngyè shíjiān|xác nhận giờ mở cửa'),
('觀光中心|guānguāng zhōngxīn|trung tâm thông tin du lịch','問附近有什麼景點|wèn fùjìn yǒu shénme jǐngdiǎn|hỏi gần đây có điểm tham quan nào','旅遊手冊|lǚyóu shǒucè|sổ hướng dẫn du lịch','請對方說慢一點|qǐng duìfāng shuō màn yīdiǎn|nhờ người đối diện nói chậm một chút')],
'classroom': [
('教室|jiàoshì|phòng học','練習讀課文|liànxí dú kèwén|luyện đọc bài khóa','課本|kèběn|sách giáo khoa','請老師解釋生詞|qǐng lǎoshī jiěshì shēngcí|nhờ giáo viên giải thích từ mới'),
('語言中心|yǔyán zhōngxīn|trung tâm ngôn ngữ','練習寫漢字|liànxí xiě Hànzì|luyện viết chữ Hán','鉛筆|qiānbǐ|bút chì','把作業交給老師|bǎ zuòyè jiāo gěi lǎoshī|nộp bài tập cho giáo viên'),
('電腦教室|diànnǎo jiàoshì|phòng máy tính','練習打字|liànxí dǎzì|luyện gõ chữ','學生帳號|xuéshēng zhànghào|tài khoản sinh viên','用中文寫一封信|yòng Zhōngwén xiě yī fēng xìn|viết một lá thư bằng tiếng Trung')],
'daily': [
('公園|gōngyuán|công viên','散步|sànbù|đi dạo','水|shuǐ|nước','坐下來休息一下|zuò xiàlái xiūxí yīxià|ngồi xuống nghỉ một chút'),
('運動中心|yùndòng zhōngxīn|trung tâm thể thao','運動|yùndòng|tập thể dục','毛巾|máojīn|khăn','換運動服|huàn yùndòngfú|thay đồ thể thao'),
('超市|chāoshì|siêu thị','買晚餐的材料|mǎi wǎncān de cáiliào|mua nguyên liệu cho bữa tối','購物袋|gòuwùdài|túi mua sắm','挑選新鮮的蔬菜|tiāoxuǎn xīnxiān de shūcài|chọn rau tươi')],
'campus': [
('系辦公室|xì bàngōngshì|văn phòng khoa','問選課的問題|wèn xuǎnkè de wèntí|hỏi về đăng ký môn học','學生證|xuéshēngzhèng|thẻ sinh viên','確認申請期限|quèrèn shēnqǐng qíxiàn|xác nhận hạn nộp đơn'),
('圖書館|túshūguǎn|thư viện','借參考書|jiè cānkǎoshū|mượn sách tham khảo','借書證|jièshūzhèng|thẻ thư viện','記下還書日期|jìxià huánshū rìqí|ghi lại ngày trả sách'),
('研究室|yánjiūshì|phòng nghiên cứu','和教授討論報告|hé jiàoshòu tǎolùn bàogào|thảo luận báo cáo với giáo sư','報告草稿|bàogào cǎogǎo|bản nháp báo cáo','按照建議修改內容|ànzhào jiànyì xiūgǎi nèiróng|sửa nội dung theo góp ý')],
'health': [
('診所|zhěnsuǒ|phòng khám','看醫生|kàn yīshēng|khám bác sĩ','健保卡|jiànbǎokǎ|thẻ bảo hiểm y tế','告訴醫生哪裡不舒服|gàosu yīshēng nǎlǐ bù shūfu|nói với bác sĩ chỗ thấy khó chịu'),
('藥局|yàojú|nhà thuốc','問藥的用法|wèn yào de yòngfǎ|hỏi cách dùng thuốc','藥袋|yàodài|túi thuốc','把注意事項記下來|bǎ zhùyì shìxiàng jì xiàlái|ghi lại những điều cần chú ý'),
('醫院|yīyuàn|bệnh viện','做健康檢查|zuò jiànkāng jiǎnchá|khám sức khỏe','預約資料|yùyuē zīliào|thông tin đặt hẹn','到服務臺報到|dào fúwùtái bàodào|đến quầy dịch vụ báo có mặt')],
'renting': [
('出租公寓|chūzū gōngyù|căn hộ cho thuê','看房子|kàn fángzi|xem nhà','租屋資料|zūwū zīliào|thông tin thuê nhà','問房租包含什麼費用|wèn fángzū bāohán shénme fèiyòng|hỏi tiền thuê bao gồm khoản phí nào'),
('房東家|fángdōng jiā|nhà chủ nhà','討論租約|tǎolùn zūyuē|thảo luận hợp đồng thuê','租約|zūyuē|hợp đồng thuê','確認押金的金額|quèrèn yājīn de jīn’é|xác nhận số tiền đặt cọc'),
('租屋處|zūwūchù|chỗ ở thuê','等師傅修水管|děng shīfu xiū shuǐguǎn|chờ thợ sửa ống nước','漏水的照片|lòushuǐ de zhàopiàn|ảnh chỗ rò nước','告訴房東修理的結果|gàosu fángdōng xiūlǐ de jiéguǒ|báo chủ nhà kết quả sửa chữa')],
'services': [
('郵局|yóujú|bưu điện','寄包裹|jì bāoguǒ|gửi bưu kiện','收件人的地址|shōujiànrén de dìzhǐ|địa chỉ người nhận','詢問運費|xúnwèn yùnfèi|hỏi phí gửi'),
('銀行|yínháng|ngân hàng','辦理轉帳|bànlǐ zhuǎnzhàng|làm thủ tục chuyển khoản','帳號|zhànghào|số tài khoản','確認收款人的姓名|quèrèn shōukuǎnrén de xìngmíng|xác nhận tên người nhận tiền'),
('便利商店|biànlì shāngdiàn|cửa hàng tiện lợi','領包裹|lǐng bāoguǒ|nhận bưu kiện','取貨通知|qǔhuò tōngzhī|thông báo nhận hàng','核對包裹上的姓名|héduì bāoguǒ shàng de xìngmíng|đối chiếu tên trên bưu kiện')],
'worklife': [
('公司|gōngsī|công ty','參加會議|cānjiā huìyì|tham dự cuộc họp','會議資料|huìyì zīliào|tài liệu họp','記錄大家的意見|jìlù dàjiā de yìjiàn|ghi lại ý kiến mọi người'),
('辦公室|bàngōngshì|văn phòng','討論工作進度|tǎolùn gōngzuò jìndù|thảo luận tiến độ công việc','進度表|jìndùbiǎo|bảng tiến độ','確認明天的工作|quèrèn míngtiān de gōngzuò|xác nhận công việc ngày mai'),
('會議室|huìyìshì|phòng họp','跟客戶見面|gēn kèhù jiànmiàn|gặp khách hàng','名片|míngpiàn|danh thiếp','寄信確認下次的時間|jì xìn quèrèn xià cì de shíjiān|gửi thư xác nhận thời gian lần sau')],
'travel': [
('旅館|lǚguǎn|khách sạn','辦理入住|bànlǐ rùzhù|làm thủ tục nhận phòng','護照|hùzhào|hộ chiếu','問早餐幾點開始|wèn zǎocān jǐ diǎn kāishǐ|hỏi bữa sáng bắt đầu lúc mấy giờ'),
('博物館|bówùguǎn|bảo tàng','看展覽|kàn zhǎnlǎn|xem triển lãm','門票|ménpiào|vé vào cửa','租一臺語音導覽機|zū yī tái yǔyīn dǎolǎnjī|thuê một máy thuyết minh'),
('海邊|hǎibiān|bờ biển','看風景|kàn fēngjǐng|ngắm cảnh','相機|xiàngjī|máy ảnh','拍幾張照片|pāi jǐ zhāng zhàopiàn|chụp vài tấm ảnh')],
'social': [
('朋友家|péngyou jiā|nhà bạn','參加生日聚會|cānjiā shēngrì jùhuì|dự tiệc sinh nhật','禮物|lǐwù|quà','祝朋友生日快樂|zhù péngyou shēngrì kuàilè|chúc bạn sinh nhật vui vẻ'),
('餐廳|cāntīng|nhà hàng','跟同學聚餐|gēn tóngxué jùcān|ăn liên hoan cùng bạn học','大家的聯絡方式|dàjiā de liánluò fāngshì|thông tin liên lạc của mọi người','確認誰還沒到|quèrèn shéi hái méi dào|xác nhận ai chưa đến'),
('咖啡店|kāfēidiàn|quán cà phê','和朋友見面|hé péngyou jiànmiàn|gặp bạn','朋友的電話號碼|péngyou de diànhuà hàomǎ|số điện thoại của bạn','討論週末的活動|tǎolùn zhōumò de huódòng|thảo luận hoạt động cuối tuần')],
}
