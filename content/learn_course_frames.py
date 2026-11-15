"""Bounded authored constructions and explicit semantic slot whitelists.

Triples are written together; no sentence is translated or romanized at runtime.
The first two frames are reserved for examples across the course.
"""
FAMILIES={
'object':[
 ('我有{x}。','Wǒ yǒu {p}.','Tôi có {v}.'),('你要{x}嗎？','Nǐ yào {p} ma?','Bạn muốn {v} phải không?'),
 ('我要{x}。','Wǒ yào {p}.','Tôi muốn {v}.'),('我們要{x}。','Wǒmen yào {p}.','Chúng tôi muốn {v}.'),
 ('你有{x}嗎？','Nǐ yǒu {p} ma?','Bạn có {v} không?'),('我沒有{x}。','Wǒ méiyǒu {p}.','Tôi không có {v}.'),
 ('他要{x}。','Tā yào {p}.','Anh ấy muốn {v}.'),('她有{x}。','Tā yǒu {p}.','Cô ấy có {v}.'),
 ('我們沒有{x}。','Wǒmen méiyǒu {p}.','Chúng tôi không có {v}.'),('請給我{x}。','Qǐng gěi wǒ {p}.','Vui lòng cho tôi {v}.'),
 ('你也要{x}嗎？','Nǐ yě yào {p} ma?','Bạn cũng muốn {v} phải không?'),('他也有{x}。','Tā yě yǒu {p}.','Anh ấy cũng có {v}.'),
 ('她沒有{x}嗎？','Tā méiyǒu {p} ma?','Cô ấy không có {v} sao?'),('你要不要{x}？','Nǐ yào bú yào {p}?','Bạn có muốn {v} không?'),
],
'place':[
 ('我在{x}。','Wǒ zài {p}.','Tôi ở {v}.'),('你要去{x}嗎？','Nǐ yào qù {p} ma?','Bạn muốn đến {v} phải không?'),
 ('我要去{x}。','Wǒ yào qù {p}.','Tôi muốn đến {v}.'),('我們去{x}。','Wǒmen qù {p}.','Chúng tôi đến {v}.'),
 ('你在{x}嗎？','Nǐ zài {p} ma?','Bạn đang ở {v} phải không?'),('他在{x}。','Tā zài {p}.','Anh ấy ở {v}.'),
 ('她要去{x}。','Tā yào qù {p}.','Cô ấy muốn đến {v}.'),('我不去{x}。','Wǒ bú qù {p}.','Tôi không đến {v}.'),
 ('我們不在{x}。','Wǒmen bú zài {p}.','Chúng tôi không ở {v}.'),('你也去{x}嗎？','Nǐ yě qù {p} ma?','Bạn cũng đến {v} phải không?'),
 ('他不在{x}嗎？','Tā bú zài {p} ma?','Anh ấy không ở {v} sao?'),('請問，{x}在哪裡？','Qǐngwèn, {p} zài nǎlǐ?','Xin hỏi, {v} ở đâu?'),
 ('我們今天去{x}。','Wǒmen jīntiān qù {p}.','Hôm nay chúng tôi đến {v}.'),('她明天去{x}。','Tā míngtiān qù {p}.','Ngày mai cô ấy đến {v}.'),
],
'action':[
 ('我想{x}。','Wǒ xiǎng {p}.','Tôi muốn {v}.'),('你想{x}嗎？','Nǐ xiǎng {p} ma?','Bạn muốn {v} không?'),
 ('我要{x}。','Wǒ yào {p}.','Tôi muốn {v}.'),('我們想{x}。','Wǒmen xiǎng {p}.','Chúng tôi muốn {v}.'),
 ('你要{x}嗎？','Nǐ yào {p} ma?','Bạn muốn {v} phải không?'),('我不想{x}。','Wǒ bù xiǎng {p}.','Tôi không muốn {v}.'),
 ('他要{x}。','Tā yào {p}.','Anh ấy muốn {v}.'),('她想{x}。','Tā xiǎng {p}.','Cô ấy muốn {v}.'),
 ('我們今天{x}。','Wǒmen jīntiān {p}.','Hôm nay chúng tôi {v}.'),('你明天要{x}嗎？','Nǐ míngtiān yào {p} ma?','Ngày mai bạn muốn {v} phải không?'),
 ('我可以{x}嗎？','Wǒ kěyǐ {p} ma?','Tôi có thể {v} không?'),('我們一起{x}吧。','Wǒmen yìqǐ {p} ba.','Chúng ta cùng {v} nhé.'),
 ('他不想{x}嗎？','Tā bù xiǎng {p} ma?','Anh ấy không muốn {v} sao?'),('我也想{x}。','Wǒ yě xiǎng {p}.','Tôi cũng muốn {v}.'),
],
'information':[
 ('請確認{x}。','Qǐng quèrèn {p}.','Vui lòng xác nhận {v}.'),('你知道{x}嗎？','Nǐ zhīdào {p} ma?','Bạn biết {v} không?'),
 ('我想知道{x}。','Wǒ xiǎng zhīdào {p}.','Tôi muốn biết {v}.'),('我們要確認{x}。','Wǒmen yào quèrèn {p}.','Chúng tôi cần xác nhận {v}.'),
 ('請問，你知道{x}嗎？','Qǐngwèn, nǐ zhīdào {p} ma?','Xin hỏi, bạn có biết {v} không?'),('我不知道{x}。','Wǒ bù zhīdào {p}.','Tôi không biết {v}.'),
 ('他要確認{x}。','Tā yào quèrèn {p}.','Anh ấy cần xác nhận {v}.'),('她知道{x}。','Tā zhīdào {p}.','Cô ấy biết {v}.'),
 ('我們不知道{x}。','Wǒmen bù zhīdào {p}.','Chúng tôi không biết {v}.'),('我可以問{x}嗎？','Wǒ kěyǐ wèn {p} ma?','Tôi có thể hỏi về {v} không?'),
 ('你也想知道{x}嗎？','Nǐ yě xiǎng zhīdào {p} ma?','Bạn cũng muốn biết {v} phải không?'),('請先確認{x}。','Qǐng xiān quèrèn {p}.','Vui lòng xác nhận {v} trước.'),
 ('他不知道{x}嗎？','Tā bù zhīdào {p} ma?','Anh ấy không biết {v} sao?'),('我需要確認{x}。','Wǒ xūyào quèrèn {p}.','Tôi cần xác nhận {v}.'),
],
'person':[
 ('這是我的{x}。','Zhè shì wǒ de {p}.','Đây là {v} của tôi.'),('你認識我的{x}嗎？','Nǐ rènshì wǒ de {p} ma?','Bạn có quen {v} của tôi không?'),
 ('我的{x}在這裡。','Wǒ de {p} zài zhèlǐ.','{v_cap} của tôi ở đây.'),('我的{x}不在這裡。','Wǒ de {p} bú zài zhèlǐ.','{v_cap} của tôi không ở đây.'),
 ('你認識這位{x}嗎？','Nǐ rènshì zhè wèi {p} ma?','Bạn có quen {v} này không?'),('我想找我的{x}。','Wǒ xiǎng zhǎo wǒ de {p}.','Tôi muốn tìm {v} của tôi.'),
 ('我的{x}今天有空。','Wǒ de {p} jīntiān yǒu kòng.','Hôm nay {v} của tôi rảnh.'),('你的{x}在哪裡？','Nǐ de {p} zài nǎlǐ?','{v_cap} của bạn ở đâu?'),
 ('我的{x}也在這裡。','Wǒ de {p} yě zài zhèlǐ.','{v_cap} của tôi cũng ở đây.'),('我想認識這位{x}。','Wǒ xiǎng rènshì zhè wèi {p}.','Tôi muốn làm quen với {v} này.'),
 ('我的{x}明天要來。','Wǒ de {p} míngtiān yào lái.','Ngày mai {v} của tôi sẽ đến.'),('你的{x}也在這裡嗎？','Nǐ de {p} yě zài zhèlǐ ma?','{v_cap} của bạn cũng ở đây phải không?'),
 ('我的{x}今天不來。','Wǒ de {p} jīntiān bù lái.','Hôm nay {v} của tôi không đến.'),('我在等我的{x}。','Wǒ zài děng wǒ de {p}.','Tôi đang chờ {v} của tôi.'),
],
'time':[
 ('我{x}有空。','Wǒ {p} yǒu kòng.','Tôi rảnh {v}.'),('你{x}要上課嗎？','Nǐ {p} yào shàng kè ma?','Bạn phải đi học {v} không?'),
 ('我們{x}見面。','Wǒmen {p} jiàn miàn.','Chúng ta gặp nhau {v}.'),('我{x}要上課。','Wǒ {p} yào shàng kè.','Tôi phải đi học {v}.'),
 ('你{x}有空嗎？','Nǐ {p} yǒu kòng ma?','Bạn rảnh {v} không?'),('我{x}沒有空。','Wǒ {p} méiyǒu kòng.','Tôi không rảnh {v}.'),
 ('他{x}要來。','Tā {p} yào lái.','Anh ấy sẽ đến {v}.'),('她{x}不來。','Tā {p} bù lái.','Cô ấy không đến {v}.'),
 ('我們{x}去學校。','Wǒmen {p} qù xuéxiào.','Chúng tôi đến trường {v}.'),('你{x}在家嗎？','Nǐ {p} zài jiā ma?','Bạn ở nhà {v} không?'),
 ('我們{x}可以見面。','Wǒmen {p} kěyǐ jiàn miàn.','Chúng ta có thể gặp nhau {v}.'),('我{x}要回家。','Wǒ {p} yào huí jiā.','Tôi sẽ về nhà {v}.'),
 ('他{x}也有空。','Tā {p} yě yǒu kòng.','Anh ấy cũng rảnh {v}.'),('她{x}要去學校。','Tā {p} yào qù xuéxiào.','Cô ấy sẽ đến trường {v}.'),
],
'number':[
 ('我要{x}個。','Wǒ yào {p} ge.','Tôi muốn {v} cái.'),('這是{x}號。','Zhè shì {p} hào.','Đây là số {v}.'),
 ('我要{x}杯水。','Wǒ yào {p} bēi shuǐ.','Tôi muốn {v} cốc nước.'),('我們有{x}個人。','Wǒmen yǒu {p} ge rén.','Chúng tôi có {v} người.'),
 ('你要{x}個嗎？','Nǐ yào {p} ge ma?','Bạn muốn {v} cái phải không?'),('我要{x}個，不是一個。','Wǒ yào {p} ge, bú shì yí ge.','Tôi muốn {v} cái, không phải một cái.'),
 ('他有{x}本書。','Tā yǒu {p} běn shū.','Anh ấy có {v} quyển sách.'),('她要{x}杯茶。','Tā yào {p} bēi chá.','Cô ấy muốn {v} cốc trà.'),
 ('這裡有{x}個人。','Zhèlǐ yǒu {p} ge rén.','Ở đây có {v} người.'),('你有{x}本書嗎？','Nǐ yǒu {p} běn shū ma?','Bạn có {v} quyển sách phải không?'),
 ('請給我{x}杯水。','Qǐng gěi wǒ {p} bēi shuǐ.','Vui lòng cho tôi {v} cốc nước.'),('我們要{x}張票。','Wǒmen yào {p} zhāng piào.','Chúng tôi muốn {v} vé.'),
 ('她也要{x}個。','Tā yě yào {p} ge.','Cô ấy cũng muốn {v} cái.'),('我有{x}個朋友。','Wǒ yǒu {p} ge péngyǒu.','Tôi có {v} người bạn.'),
]}

# Noun/action selections are editorial, not guessed from the dictionary.
SLOTS={
'greetings':[('person','老師 學生 同學'),('information','名字 姓名 電話'),('object','水 茶 咖啡'),('place','臺灣 越南 臺北'),('person','朋友 同學 老師')],
'numbers':[('number','三 四 五 六 七 八 九'),('number','十 百 千'),('time','上午 中午 下午 晚上'),('time','今天 明天 週末 星期一'),('time','上個月 這個月 下個月 下星期')],
'food':[('object','飯 麵 水 茶'),('object','早餐 午餐 晚餐 菜單'),('object','牛肉 糖 冰'),('object','牛奶 咖啡 豆漿'),('object','收據 蛋餅 現金')],
'shopping':[('place','商店 超市 便利商店'),('object','水果 蘋果 現金'),('object','衣服 褲子 鞋'),('information','價格 金額 規定'),('object','發票 袋子 購物袋')],
'transport':[('place','車站 公車站 捷運站'),('place','車站 公園 超市'),('object','票 悠遊卡 車票'),('place','月臺 出口 入口'),('information','時間 車程 路線')],
'family':[('person','爸爸 媽媽 哥哥 姐姐'),('person','妹妹 爺爺 奶奶'),('person','先生 太太 家人'),('action','運動 看電影 聽音樂'),('object','禮物 電話 地址')],
'home':[('place','房間 宿舍 廚房 浴室'),('object','床 桌子 椅子 冰箱'),('object','桌子 椅子 書桌'),('object','冷氣 熱水 洗衣機'),('action','打掃 整理 洗衣服')],
'schedule':[('information','學期 課表 時間 日期'),('time','早上 上午 中午 下午 晚上'),('time','明天 下星期 週末 今天'),('action','上課 休息 見面'),('action','改期 請假 預約')],
'information':[('information','問題 名字 時間'),('information','地址 電話 號碼 姓名'),('place','服務臺 郵局 醫院 銀行'),('information','意思 方法 問題'),('information','訊息 記錄 地址')],
'classroom':[('object','書 筆 漢字'),('action','練習 回答 上課'),('object','鉛筆 紙 本'),('information','作業 考試 內容'),('action','學習 練習 讀書')],
'daily':[('action','刷牙 洗臉 洗澡'),('action','上學 上班 回家'),('action','做飯 洗衣服 買菜'),('action','跑步 游泳 唱歌 跳舞 散步'),('action','運動 休息 睡覺')],
'campus':[('place','圖書館 教室 辦公室 研究室 語言中心'),('object','學生證 表格 證件'),('object','資料 書 電腦'),('information','報告 計畫 進度'),('information','電子郵件 建議 時間')],
'health':[('information','身體 體溫 健康'),('information','症狀 體溫 過敏 原因'),('place','醫院 診所 藥局'),('information','副作用 藥丸 藥水 藥袋'),('action','休息 喝水 睡覺 回診')],
'renting':[('information','租金 預算 地址 坪數'),('object','家具 冰箱 洗衣機 冷氣'),('information','合約 房租 水電費 管理費'),('object','插座 燈泡 鑰匙 門鎖'),('action','搬家 打掃 退租 整理')],
'services':[('place','櫃臺 服務臺 郵局 銀行'),('object','包裹 郵票 信封 紙箱'),('information','姓名 電話 號碼 日期'),('object','收據 現金 零錢 發票'),('information','進度 結果 期限 資料')],
'worklife':[('person','主管 同事 經理 助理'),('information','班表 工時 時段 日期'),('information','會議 議題 內容 決定'),('action','請假 改期 預約 休假'),('information','進度 計畫 任務 問題')],
'travel':[('information','行程 交通 預算 天氣'),('place','旅館 民宿 房間 櫃臺'),('place','海邊 博物館 公園 景點'),('place','車站 月臺 出口 入口'),('object','照片 行李 護照 紀念品')],
'social':[('person','朋友 同學 新朋友'),('information','活動 時間 地點 日期'),('action','吃飯 喝茶 見面 聊聊天'),('object','禮物 照片 蛋糕'),('information','建議 意見 選擇 原因')],
}

FAMILIES['location']=[
 ('{x}在桌上。','{p} zài zhuō shàng.','{v_cap} ở trên bàn.'),('請把{x}放在桌上。','Qǐng bǎ {p} fàng zài zhuō shàng.','Vui lòng đặt {v} lên bàn.'),
 ('我的{x}在桌上。','Wǒ de {p} zài zhuō shàng.','{v_cap} của tôi ở trên bàn.'),('你的{x}在桌上嗎？','Nǐ de {p} zài zhuō shàng ma?','{v_cap} của bạn ở trên bàn phải không?'),
 ('她的{x}不在桌上。','Tā de {p} bú zài zhuō shàng.','{v_cap} của cô ấy không ở trên bàn.'),('他的{x}在椅子旁邊。','Tā de {p} zài yǐzi pángbiān.','{v_cap} của anh ấy ở cạnh ghế.'),
 ('我把{x}放在房間裡。','Wǒ bǎ {p} fàng zài fángjiān lǐ.','Tôi để {v} trong phòng.'),('你把{x}放在哪裡？','Nǐ bǎ {p} fàng zài nǎlǐ?','Bạn để {v} ở đâu?'),
 ('我的{x}在門後。','Wǒ de {p} zài mén hòu.','{v_cap} của tôi ở sau cửa.'),('他的{x}在門外。','Tā de {p} zài mén wài.','{v_cap} của anh ấy ở ngoài cửa.'),
 ('請把{x}放在椅子旁邊。','Qǐng bǎ {p} fàng zài yǐzi pángbiān.','Vui lòng đặt {v} cạnh ghế.'),('你的{x}也在桌上嗎？','Nǐ de {p} yě zài zhuō shàng ma?','{v_cap} của bạn cũng ở trên bàn phải không?'),
 ('我把{x}放在床旁邊。','Wǒ bǎ {p} fàng zài chuáng pángbiān.','Tôi để {v} cạnh giường.'),('她把{x}放在房間裡。','Tā bǎ {p} fàng zài fángjiān lǐ.','Cô ấy để {v} trong phòng.'),
]
FAMILIES['price']=[
 ('{x}很貴。','{p} hěn guì.','{v_cap} đắt.'),('這裡的{x}很便宜。','Zhèlǐ de {p} hěn piányí.','{v_cap} ở đây rẻ.'),
 ('我覺得{x}太貴。','Wǒ juéde {p} tài guì.','Tôi thấy {v} đắt quá.'),('這裡的{x}不貴。','Zhèlǐ de {p} bú guì.','{v_cap} ở đây không đắt.'),
 ('{x}今天特價。','{p} jīntiān tèjià.','{v_cap} hôm nay có giá khuyến mãi.'),('我想知道{x}的價格。','Wǒ xiǎng zhīdào {p} de jiàgé.','Tôi muốn biết giá {v}.'),
 ('你覺得{x}貴嗎？','Nǐ juéde {p} guì ma?','Bạn thấy {v} đắt không?'),('這裡的{x}比較便宜。','Zhèlǐ de {p} bǐjiào piányí.','{v_cap} ở đây rẻ hơn.'),
 ('我想挑選{x}。','Wǒ xiǎng tiāoxuǎn {p}.','Tôi muốn chọn {v}.'),('你知道{x}的價格嗎？','Nǐ zhīdào {p} de jiàgé ma?','Bạn biết giá {v} không?'),
 ('她覺得{x}不貴。','Tā juéde {p} bú guì.','Cô ấy thấy {v} không đắt.'),('他要買特價的{x}。','Tā yào mǎi tèjià de {p}.','Anh ấy muốn mua {v} giảm giá.'),
 ('我想買便宜的{x}。','Wǒ xiǎng mǎi piányí de {p}.','Tôi muốn mua {v} rẻ.'),('我們在挑選{x}。','Wǒmen zài tiāoxuǎn {p}.','Chúng tôi đang chọn {v}.'),
]
FAMILIES['direction']=[
 ('{x}在右邊。','{p} zài yòubiān.','{v_cap} ở bên phải.'),('{x}在左邊。','{p} zài zuǒbiān.','{v_cap} ở bên trái.'),
 ('{x}在前面。','{p} zài qiánmiàn.','{v_cap} ở phía trước.'),('{x}在後面。','{p} zài hòumiàn.','{v_cap} ở phía sau.'),
 ('{x}在附近嗎？','{p} zài fùjìn ma?','{v_cap} có ở gần đây không?'),('{x}不在右邊。','{p} bú zài yòubiān.','{v_cap} không ở bên phải.'),
 ('{x}在前面嗎？','{p} zài qiánmiàn ma?','{v_cap} ở phía trước phải không?'),('我在{x}的右邊。','Wǒ zài {p} de yòubiān.','Tôi ở bên phải {v}.'),
 ('你在{x}的左邊嗎？','Nǐ zài {p} de zuǒbiān ma?','Bạn ở bên trái {v} phải không?'),('我們在{x}的前面。','Wǒmen zài {p} de qiánmiàn.','Chúng tôi ở phía trước {v}.'),
 ('他在{x}的後面。','Tā zài {p} de hòumiàn.','Anh ấy ở phía sau {v}.'),('她在{x}附近。','Tā zài {p} fùjìn.','Cô ấy ở gần {v}.'),
 ('請問，{x}在右邊嗎？','Qǐngwèn, {p} zài yòubiān ma?','Xin hỏi, {v} ở bên phải phải không?'),('我想找附近的{x}。','Wǒ xiǎng zhǎo fùjìn de {p}.','Tôi muốn tìm {v} gần đây.'),
]
FAMILIES['vehicle']=[
 ('我搭{x}去。','Wǒ dā {p} qù.','Tôi đi bằng {v}.'),('你要搭{x}嗎？','Nǐ yào dā {p} ma?','Bạn định đi {v} phải không?'),
 ('我們搭{x}去學校。','Wǒmen dā {p} qù xuéxiào.','Chúng tôi đi {v} đến trường.'),('我不想搭{x}。','Wǒ bù xiǎng dā {p}.','Tôi không muốn đi {v}.'),
 ('她要搭{x}回家。','Tā yào dā {p} huí jiā.','Cô ấy muốn đi {v} về nhà.'),('他今天搭{x}。','Tā jīntiān dā {p}.','Hôm nay anh ấy đi {v}.'),
 ('你也搭{x}嗎？','Nǐ yě dā {p} ma?','Bạn cũng đi {v} phải không?'),('我明天要搭{x}。','Wǒ míngtiān yào dā {p}.','Ngày mai tôi định đi {v}.'),
 ('我們可以搭{x}去。','Wǒmen kěyǐ dā {p} qù.','Chúng ta có thể đi bằng {v}.'),('請問，這裡可以搭{x}嗎？','Qǐngwèn, zhèlǐ kěyǐ dā {p} ma?','Xin hỏi, có thể đón {v} ở đây không?'),
 ('她不想搭{x}嗎？','Tā bù xiǎng dā {p} ma?','Cô ấy không muốn đi {v} sao?'),('我們一起搭{x}吧。','Wǒmen yìqǐ dā {p} ba.','Chúng ta cùng đi {v} nhé.'),
 ('他常常搭{x}。','Tā chángcháng dā {p}.','Anh ấy thường đi {v}.'),('我有時候搭{x}。','Wǒ yǒu shíhòu dā {p}.','Thỉnh thoảng tôi đi {v}.'),
]
FAMILIES['lost']=[
 ('我找到{x}了。','Wǒ zhǎo dào {p} le.','Tôi tìm thấy {v} rồi.'),('我忘記帶{x}。','Wǒ wàngjì dài {p}.','Tôi quên mang {v}.'),
 ('你找到{x}了嗎？','Nǐ zhǎo dào {p} le ma?','Bạn tìm thấy {v} chưa?'),('她找到{x}了。','Tā zhǎo dào {p} le.','Cô ấy tìm thấy {v} rồi.'),
 ('他忘記帶{x}。','Tā wàngjì dài {p}.','Anh ấy quên mang {v}.'),('請記得帶{x}。','Qǐng jìde dài {p}.','Nhớ mang {v} nhé.'),
 ('我要把{x}帶回家。','Wǒ yào bǎ {p} dài huí jiā.','Tôi muốn mang {v} về nhà.'),('你記得帶{x}嗎？','Nǐ jìde dài {p} ma?','Bạn có nhớ mang {v} không?'),
 ('我遺失了{x}。','Wǒ yíshī le {p}.','Tôi làm thất lạc {v}.'),('他遺失了{x}。','Tā yíshī le {p}.','Anh ấy làm thất lạc {v}.'),
 ('不要忘記帶{x}。','Bú yào wàngjì dài {p}.','Đừng quên mang {v}.'),('我們找到{x}了。','Wǒmen zhǎo dào {p} le.','Chúng tôi tìm thấy {v} rồi.'),
 ('她想把{x}帶回家。','Tā xiǎng bǎ {p} dài huí jiā.','Cô ấy muốn mang {v} về nhà.'),('請幫我找到{x}。','Qǐng bāng wǒ zhǎo dào {p}.','Vui lòng giúp tôi tìm {v}.'),
]
FAMILIES['gift']=[
 ('這是生日禮物。','Zhè shì shēngrì lǐwù.','Đây là quà sinh nhật.'),('我要送你{x}。','Wǒ yào sòng nǐ {p}.','Tôi muốn tặng bạn {v}.'),
 ('這是我送你的{x}。','Zhè shì wǒ sòng nǐ de {p}.','Đây là {v} tôi tặng bạn.'),('謝謝你送我{x}。','Xièxie nǐ sòng wǒ {p}.','Cảm ơn bạn đã tặng tôi {v}.'),
 ('她送我{x}。','Tā sòng wǒ {p}.','Cô ấy tặng tôi {v}.'),('我們想送老師{x}。','Wǒmen xiǎng sòng lǎoshī {p}.','Chúng tôi muốn tặng thầy/cô {v}.'),
 ('你想送他{x}嗎？','Nǐ xiǎng sòng tā {p} ma?','Bạn muốn tặng anh ấy {v} phải không?'),('我要包裝{x}。','Wǒ yào bāozhuāng {p}.','Tôi muốn gói {v}.'),
 ('謝謝，這是很好的{x}。','Xièxie, zhè shì hěn hǎo de {p}.','Cảm ơn, đây là {v} rất tốt.'),('他想把{x}送給朋友。','Tā xiǎng bǎ {p} sòng gěi péngyǒu.','Anh ấy muốn tặng {v} cho bạn.'),
 ('我想買{x}當禮物。','Wǒ xiǎng mǎi {p} dāng lǐwù.','Tôi muốn mua {v} làm quà.'),('你要包裝{x}嗎？','Nǐ yào bāozhuāng {p} ma?','Bạn muốn gói {v} phải không?'),
 ('我收到你送的{x}了。','Wǒ shōudào nǐ sòng de {p} le.','Tôi nhận được {v} bạn tặng rồi.'),('她想買{x}送給同學。','Tā xiǎng mǎi {p} sòng gěi tóngxué.','Cô ấy muốn mua {v} tặng bạn học.'),
]
SLOTS['shopping'][3]=('price','水果 蘋果 衣服 褲子 鞋')
SLOTS['transport'][1]=('direction','車站 公園 超市')
SLOTS['home'][2]=('location','書 手機 電腦 袋子')
SLOTS['travel'][3]=('vehicle','火車 高鐵 公車 捷運 計程車')
SLOTS['travel'][4]=('lost','照片 行李 護照 紀念品')
SLOTS['social'][3]=('gift','禮物 蛋糕 紀念品 書')
SLOTS['classroom'][2]=('object','鉛筆 紙 課本')

FAMILIES['courtesy']=[
 ('謝謝，{x}。','Xièxie, {p}.','Cảm ơn, {v}.'),('對不起，{x}。','Duìbuqǐ, {p}.','Xin lỗi, {v}.'),
 ('你好，謝謝你。','Nǐ hǎo, xièxie nǐ.','Xin chào, cảm ơn bạn.'),('對不起，我是{x}。','Duìbuqǐ, wǒ shì {p}.','Xin lỗi, tôi là {v}.'),
 ('謝謝，你是{x}嗎？','Xièxie, nǐ shì {p} ma?','Cảm ơn, bạn là {v} phải không?'),('您好，我是{x}。','Nín hǎo, wǒ shì {p}.','Xin kính chào, tôi là {v}.'),
 ('沒關係，你是{x}嗎？','Méi guānxi, nǐ shì {p} ma?','Không sao, bạn là {v} phải không?'),('不客氣，我是{x}。','Bú kèqi, wǒ shì {p}.','Không có gì, tôi là {v}.'),
 ('再見，{x}！','Zài jiàn, {p}!','Tạm biệt {v}!'),('對不起，你是{x}嗎？','Duìbuqǐ, nǐ shì {p} ma?','Xin lỗi, bạn là {v} phải không?'),
 ('謝謝，她是{x}。','Xièxie, tā shì {p}.','Cảm ơn, cô ấy là {v}.'),('您好，你是{x}嗎？','Nín hǎo, nǐ shì {p} ma?','Xin kính chào, bạn là {v} phải không?'),
 ('不客氣，他是{x}。','Bú kèqi, tā shì {p}.','Không có gì, anh ấy là {v}.'),('沒關係，我不是{x}。','Méi guānxi, wǒ bú shì {p}.','Không sao, tôi không phải {v}.'),
]
SLOTS['greetings'][2]=('courtesy','學生 老師 同學')
FAMILIES['number'] += [
 ('你是{x}號嗎？','Nǐ shì {p} hào ma?','Bạn mang số {v} phải không?'),
 ('我是{x}號。','Wǒ shì {p} hào.','Tôi mang số {v}.'),
 ('他是{x}號。','Tā shì {p} hào.','Anh ấy mang số {v}.'),
 ('她是{x}號。','Tā shì {p} hào.','Cô ấy mang số {v}.'),
 ('你是第{x}個學生嗎？','Nǐ shì dì {p} ge xuéshēng ma?','Bạn là học sinh thứ {v} phải không?'),
 ('我是第{x}個學生。','Wǒ shì dì {p} ge xuéshēng.','Tôi là học sinh thứ {v}.'),
 ('她是第{x}個老師。','Tā shì dì {p} ge lǎoshī.','Cô ấy là giáo viên thứ {v}.'),
 ('他是第{x}個學生。','Tā shì dì {p} ge xuéshēng.','Anh ấy là học sinh thứ {v}.'),
]
FAMILIES['month']=[
 ('我{x}是學生。','Wǒ {p} shì xuéshēng.','{v_cap}, tôi là học sinh.'),('你{x}有時間嗎？','Nǐ {p} yǒu shíjiān ma?','{v_cap}, bạn có thời gian không?'),
 ('她{x}是老師。','Tā {p} shì lǎoshī.','{v_cap}, cô ấy là giáo viên.'),('你{x}是學生嗎？','Nǐ {p} shì xuéshēng ma?','{v_cap}, bạn là học sinh phải không?'),
 ('他{x}在臺灣。','Tā {p} zài Táiwān.','{v_cap}, anh ấy ở Đài Loan.'),('我{x}在越南。','Wǒ {p} zài Yuènán.','{v_cap}, tôi ở Việt Nam.'),
 ('我們{x}沒有時間。','Wǒmen {p} méiyǒu shíjiān.','{v_cap}, chúng tôi không có thời gian.'),('我{x}不在臺灣。','Wǒ {p} bú zài Táiwān.','{v_cap}, tôi không ở Đài Loan.'),
 ('你{x}在哪裡？','Nǐ {p} zài nǎlǐ?','{v_cap}, bạn ở đâu?'),('她{x}在這裡。','Tā {p} zài zhèlǐ.','{v_cap}, cô ấy ở đây.'),
 ('我們{x}有時間。','Wǒmen {p} yǒu shíjiān.','{v_cap}, chúng tôi có thời gian.'),('他{x}是老師嗎？','Tā {p} shì lǎoshī ma?','{v_cap}, anh ấy là giáo viên phải không?'),
 ('她{x}不在越南。','Tā {p} bú zài Yuènán.','{v_cap}, cô ấy không ở Việt Nam.'),('我{x}有時間。','Wǒ {p} yǒu shíjiān.','{v_cap}, tôi có thời gian.'),
]
SLOTS['numbers'][4]=('month','上個月 這個月 下個月 上星期 下星期')
FAMILIES['distance']=[
 ('{x}很遠。','{p} hěn yuǎn.','{v_cap} rất xa.'),('到{x}要多久？','Dào {p} yào duōjiǔ?','Đến {v} mất bao lâu?'),
 ('{x}很近。','{p} hěn jìn.','{v_cap} rất gần.'),('{x}不遠。','{p} bù yuǎn.','{v_cap} không xa.'),
 ('我們要到{x}。','Wǒmen yào dào {p}.','Chúng tôi muốn đến {v}.'),('你到{x}了嗎？','Nǐ dào {p} le ma?','Bạn đến {v} chưa?'),
 ('我到{x}了。','Wǒ dào {p} le.','Tôi đến {v} rồi.'),('你覺得{x}遠嗎？','Nǐ juéde {p} yuǎn ma?','Bạn thấy {v} xa không?'),
 ('到{x}要十分鐘。','Dào {p} yào shí fēnzhōng.','Đến {v} mất mười phút.'),('他到{x}了。','Tā dào {p} le.','Anh ấy đến {v} rồi.'),
 ('她要到{x}。','Tā yào dào {p}.','Cô ấy muốn đến {v}.'),('請問，{x}遠不遠？','Qǐngwèn, {p} yuǎn bù yuǎn?','Xin hỏi, {v} có xa không?'),
 ('到{x}要五分鐘嗎？','Dào {p} yào wǔ fēnzhōng ma?','Đến {v} mất năm phút phải không?'),('我想到{x}去。','Wǒ xiǎng dào {p} qù.','Tôi muốn đến {v}.'),
]
SLOTS['transport'][4]=('distance','車站 超市 公園 醫院')
FAMILIES['explain']=[
 ('請再說一次{x}。','Qǐng zài shuō yí cì {p}.','Vui lòng nói lại {v} một lần.'),('我想知道{x}的意思。','Wǒ xiǎng zhīdào {p} de yìsi.','Tôi muốn biết ý nghĩa của {v}.'),
 ('我聽不懂{x}。','Wǒ tīng bù dǒng {p}.','Tôi nghe không hiểu {v}.'),('請解釋{x}。','Qǐng jiěshì {p}.','Vui lòng giải thích {v}.'),
 ('你明白{x}的意思嗎？','Nǐ míngbái {p} de yìsi ma?','Bạn hiểu ý nghĩa của {v} không?'),('請告訴我{x}的意思。','Qǐng gàosu wǒ {p} de yìsi.','Vui lòng cho tôi biết ý nghĩa của {v}.'),
 ('他聽不懂{x}。','Tā tīng bù dǒng {p}.','Anh ấy nghe không hiểu {v}.'),('麻煩你解釋{x}。','Máfan nǐ jiěshì {p}.','Phiền bạn giải thích {v}.'),
 ('我不明白{x}的意思。','Wǒ bù míngbái {p} de yìsi.','Tôi không hiểu ý nghĩa của {v}.'),('她想知道{x}的意思。','Tā xiǎng zhīdào {p} de yìsi.','Cô ấy muốn biết ý nghĩa của {v}.'),
 ('你可以解釋{x}嗎？','Nǐ kěyǐ jiěshì {p} ma?','Bạn có thể giải thích {v} không?'),('我們聽不懂{x}。','Wǒmen tīng bù dǒng {p}.','Chúng tôi nghe không hiểu {v}.'),
 ('請幫忙解釋{x}。','Qǐng bāngmáng jiěshì {p}.','Vui lòng giúp giải thích {v}.'),('我想請你解釋{x}。','Wǒ xiǎng qǐng nǐ jiěshì {p}.','Tôi muốn nhờ bạn giải thích {v}.'),
]
SLOTS['information'][3]=('explain','這個問題 這個詞 這個句子')

RULES={
'object':[('有／沒有 + đồ vật','Dùng 有 để nói có, 沒有 để nói không có. Thêm 嗎 ở cuối để hỏi.'),('要 + đồ vật','要 nêu thứ muốn lấy/dùng. 也 nghĩa là cũng; 要不要 là câu hỏi có muốn hay không.')],
'place':[('在 + nơi chốn','在 nói vị trí đang ở; 不在 phủ định vị trí.'),('去 + nơi chốn','去 diễn đạt đi đến. 要去 là muốn/sẽ đến; 在哪裡 hỏi ở đâu.')],
'action':[('想／要 + hành động','想 nói mong muốn; 要 nói ý định. 不想 là không muốn.'),('Thời gian + hành động','Đặt 今天/明天 trước hành động. 可以 hỏi khả năng/cho phép; 一起…吧 rủ cùng làm.')],
'information':[('知道 + thông tin','知道 là biết; 不知道 là không biết. Thêm 嗎 để hỏi.'),('確認／問 + thông tin','確認 là xác nhận, 問 là hỏi. 請 đứng trước hành động tạo lời nhờ lịch sự.')],
'person':[('我的／你的 + người','的 nối người sở hữu với người/đồ vật được nói đến.'),('認識／找／等 + người','認識 là quen biết, 找 là tìm, 等 là chờ. Dùng 在哪裡 khi hỏi vị trí.')],
'time':[('Mốc thời gian + hành động','Đặt mốc thời gian trước động từ; 今天/明天 chỉ ngày, 上午/下午 chỉ buổi.'),('有空／沒有空','有空 là rảnh. Có thể thêm mốc thời gian và 嗎 để hỏi lịch rảnh.')],
'number':[('Số + lượng từ + danh từ','Dùng 個 cho người/vật phù hợp, 杯 cho đồ uống, 本 cho sách và 張 cho vé. Hai trước lượng từ thường dùng 兩; các slot luyện ở đây tránh 二 trước lượng từ.'),('第 + số + lượng từ','第 biến số đếm thành số thứ tự. Đặt 嗎 ở cuối để hỏi xác nhận.')],
'location':[('Đồ vật + 在 + vị trí','桌上: trên bàn; 門後: sau cửa; 門外: ngoài cửa; 旁邊: bên cạnh.'),('把 + đồ vật + 放在 + vị trí','Dùng 把 để nêu đồ vật sẽ được di chuyển rồi nói vị trí đặt bằng 放在.')],
'price':[('很／太 + tính từ','很 đi với nhận xét, 太… nêu mức quá. 不貴 là không đắt.'),('比較 + tính từ','比較 diễn tả mức tương đối hơn. 特價 là giá khuyến mãi; 價格 là giá cả.')],
'direction':[('Nơi chốn + 在 + hướng','右邊, 左邊, 前面, 後面 lần lượt là phải, trái, trước, sau.'),('Nơi chốn + 的 + hướng','Dùng 的 để nói bên phải/trái của một nơi; 附近 chỉ khu vực gần đó.')],
'vehicle':[('搭 + phương tiện','搭 dùng khi đi tàu/xe. Ghép 去/回家 để nói đi đâu hoặc về nhà.'),('常常／有時候 + hành động','常常 là thường xuyên, 有時候 là thỉnh thoảng. Muốn rủ cùng đi dùng 一起…吧.')],
'lost':[('找到…了／遺失了…','找到 là tìm thấy; 遺失 là thất lạc. 了 ghi nhận thay đổi/kết quả đã xảy ra.'),('記得／忘記 + hành động','記得帶 là nhớ mang; 忘記帶 là quên mang. 把…帶回家 nói mang đồ về nhà.')],
'gift':[('送 + người + quà','Có thể nói 送你… hoặc 把…送給你. Dùng 謝謝你送我… để cảm ơn món quà.'),('當 + mục đích/vai trò','買…當禮物 nghĩa là mua làm quà. 收到…了 là đã nhận được.')],
'courtesy':[('Lời lịch sự ở đầu câu','謝謝: cảm ơn; 對不起: xin lỗi; 您好: kính chào. Dừng nhẹ sau lời mở đầu rồi nói tiếp.'),('Đáp lại lịch sự','不客氣 đáp lời cảm ơn; 沒關係 đáp lời xin lỗi. 再見 dùng khi tạm biệt.')],
'month':[('Mốc tháng/tuần + câu','上個月/這個月/下個月: tháng trước/này/sau; 上星期/下星期: tuần trước/sau.'),('Mốc thời gian + 在／是','在 nêu vị trí tại thời điểm đó, 是 nêu vai trò. Tiếng Hoa không chia động từ theo thì.')],
'distance':[('到 + nơi chốn','到 là đến. 到…了 cho biết đã đến nơi; 要多久 hỏi cần bao lâu.'),('遠／近 và thời lượng','遠 là xa, 近 là gần. 到…要…分鐘 nói số phút cần để đến.')],
'explain':[('請／麻煩你 + hành động','Đặt 請 hoặc 麻煩你 trước 解釋/告訴 để nhờ lịch sự.'),('聽不懂／不明白','聽不懂 là nghe không hiểu; 不明白 là chưa hiểu. 再說一次 yêu cầu nói lại một lần.')],
}
FEATURES={
'object':['alternative-question'],'action':['permission'],'place':[],
'information':['permission'],'person':[],'time':['permission'],
'number':[],'location':['disposal'],'price':['comparison'],
'direction':[],'vehicle':['permission'],'lost':['disposal','completed'],
'gift':['disposal','completed'],'courtesy':[],'month':[],
'distance':['duration','completed'],'explain':['permission'],
}
SLOTS['numbers'][1]=('number','十 一百 一千')
FAMILIES['place'] += [
 ('我想去{x}。','Wǒ xiǎng qù {p}.','Tôi muốn đến {v}.'),
 ('她也在{x}。','Tā yě zài {p}.','Cô ấy cũng ở {v}.'),
 ('他也要去{x}。','Tā yě yào qù {p}.','Anh ấy cũng muốn đến {v}.'),
]
FAMILIES['body']=[
 ('我的{x}很痛。','Wǒ de {p} hěn tòng.','{v_cap} của tôi rất đau.'),('你的{x}會痛嗎？','Nǐ de {p} huì tòng ma?','{v_cap} của bạn có đau không?'),
 ('我的{x}不痛。','Wǒ de {p} bú tòng.','{v_cap} của tôi không đau.'),('他的{x}很痛。','Tā de {p} hěn tòng.','{v_cap} của anh ấy rất đau.'),
 ('她的{x}不舒服。','Tā de {p} bù shūfu.','Cô ấy thấy khó chịu ở {v}.'),('你的{x}也痛嗎？','Nǐ de {p} yě tòng ma?','{v_cap} của bạn cũng đau phải không?'),
 ('我的{x}今天很痛。','Wǒ de {p} jīntiān hěn tòng.','Hôm nay {v} của tôi rất đau.'),('我的{x}現在不痛了。','Wǒ de {p} xiànzài bú tòng le.','Bây giờ {v} của tôi hết đau rồi.'),
 ('他的{x}不痛嗎？','Tā de {p} bú tòng ma?','{v_cap} của anh ấy không đau sao?'),('我的{x}昨天很痛。','Wǒ de {p} zuótiān hěn tòng.','Hôm qua {v} của tôi rất đau.'),
 ('她的{x}現在很痛。','Tā de {p} xiànzài hěn tòng.','Bây giờ {v} của cô ấy rất đau.'),('我覺得{x}很痛。','Wǒ juéde {p} hěn tòng.','Tôi thấy rất đau ở {v}.'),
 ('你的{x}現在痛嗎？','Nǐ de {p} xiànzài tòng ma?','Bây giờ {v} của bạn có đau không?'),('我的{x}還是很痛。','Wǒ de {p} háishì hěn tòng.','{v_cap} của tôi vẫn rất đau.'),
]
SLOTS['health'][0]=('body','頭 肚子 喉嚨 牙 手 腳')
SLOTS['health'][1]=('information','症狀 體溫 原因')
SLOTS['health'][3]=('object','藥 藥丸 藥水 藥袋')
RULES['body']=[('身體部位 + 痛','Nêu bộ phận cơ thể rồi nói 痛; 很痛 là rất đau, 不痛 là không đau.'),('現在／今天／昨天 + cảm giác','Dùng mốc thời gian để nói hiện trạng và triệu chứng trước đó. 不痛了 diễn tả đã hết đau.')]
FEATURES['body']=['completed']

# Additional complete utterances replace old word-only stimulus imports.
FAMILIES['number'].append(('我的號碼是{x}號。','Wǒ de hàomǎ shì {p} hào.','Số của tôi là số {v}.'))
FAMILIES['action'] += [
 ('我今天想{x}。','Wǒ jīntiān xiǎng {p}.','Hôm nay tôi muốn {v}.'),
 ('我明天想{x}。','Wǒ míngtiān xiǎng {p}.','Ngày mai tôi muốn {v}.'),
]
FAMILIES['object'] += [
 ('我今天要{x}。','Wǒ jīntiān yào {p}.','Hôm nay tôi muốn {v}.'),
 ('我現在需要{x}。','Wǒ xiànzài xūyào {p}.','Bây giờ tôi cần {v}.'),
]
