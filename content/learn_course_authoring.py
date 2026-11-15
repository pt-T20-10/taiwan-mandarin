"""Editorial outline for the independent PC curriculum. No runtime AI."""
# Each row describes an actual lesson, not a presentation/skill tab.
OUTLINE={
'greetings':('Nhận biết và chào nhau|Tên và cách xưng hô|Lời lịch sự|Bạn từ đâu đến?|Giới thiệu người quen',7),
'numbers':('Số và số lượng|Giá trị hàng chục và hàng trăm|Giờ và phút|Ngày tháng và thứ|Hẹn ngày và đổi lịch',10),
'food':('Ăn và uống|Gọi món và số lượng|Khẩu vị|Ăn tại quán hay mang đi?|Thanh toán bữa ăn',7),
'shopping':('Tìm món cần mua|Giá và số lượng|Màu sắc và kích cỡ|Chọn và so sánh|Thanh toán và đổi hàng',7),
'transport':('Phương tiện và điểm đến|Hỏi đường|Mua vé và lên xe|Đổi tuyến và xuống xe|Thời gian di chuyển',7),
'family':('Người trong gia đình|Tuổi và nghề nghiệp|Giới thiệu người thân|Sở thích chung|Hẹn gặp gia đình',7),
'home':('Các phòng trong nhà|Đồ đạc|Vị trí đồ vật|Sinh hoạt ở nhà|Sắp xếp và dọn dẹp',7),
'schedule':('Ngày học và môn học|Giờ bắt đầu và kết thúc|Lịch tuần|Bận và rảnh|Thay đổi lịch học',10),
'information':('Mở lời hỏi thông tin|Địa chỉ và liên lạc|Tìm đúng nơi|Nhờ giải thích lại|Xác nhận thông tin',10),
'classroom':('Vật dụng học tập|Nghe và nói trong lớp|Đọc và viết|Bài tập và kiểm tra|Nhờ giúp khi chưa hiểu',10),
'daily':('Buổi sáng|Đi học và đi làm|Việc thường ngày|Giải trí và nghỉ ngơi|Kể một ngày của mình',10),
'campus':('Những nơi trong trường|Đăng ký và thủ tục|Thư viện và tài liệu|Làm việc với bạn học|Trao đổi với giảng viên',10),
'health':('Cơ thể và cảm giác|Mô tả triệu chứng|Đăng ký khám|Thuốc và cách dùng|Nghỉ ngơi và tái khám',15),
'renting':('Tìm chỗ ở|Xem phòng và tiện nghi|Tiền thuê và hợp đồng|Báo hỏng và sửa chữa|Chuyển nhà và trả phòng',15),
'services':('Tại quầy dịch vụ|Gửi thư và bưu kiện|Điền đơn và xác minh|Thanh toán và nhận lại|Hỏi tiến độ xử lý',15),
'worklife':('Người và nơi làm việc|Giờ làm và phân ca|Họp và báo cáo|Xin nghỉ và đổi hẹn|Theo dõi công việc',15),
'travel':('Lên kế hoạch đi chơi|Đặt và nhận phòng|Thăm quan|Di chuyển khi đi du lịch|Kết thúc chuyến đi',15),
'social':('Làm quen và bắt chuyện|Mời và nhận lời|Gặp gỡ và ăn chung|Chúc mừng và tặng quà|Bày tỏ ý kiến lịch sự',15),
}

# Explicit introductory vocabulary order; function words precede sentence work.
FIRST_WORDS=['我','你','是','學生','老師','你好','嗎',
 '名字','叫','他','她','的','什麼','呢',
 '謝謝','請','不客氣','對不起','沒關係','您好','再見',
 '臺灣','越南','人','不是','哪裡','來','從',
 '我們','朋友','同學','認識','也','很','高興']

# Full triples: the compiler never infers pronunciation or translation per glyph.
EXTRA_WORDS='''
不是|bú shì|không phải
你們|nǐmen|các bạn
他們|tāmen|họ
姓|xìng|họ; mang họ
同學們|tóngxuémen|các bạn học
'''

# Controlled sentences for the first lesson; samples and practice are disjoint.
FIRST_EXAMPLES=[
 ('我是學生。','Wǒ shì xuéshēng.','Tôi là học sinh.'),
 ('你是老師嗎？','Nǐ shì lǎoshī ma?','Bạn là giáo viên phải không?'),
 ('老師，你好！','Lǎoshī, nǐ hǎo!','Chào thầy/cô!'),
 ('你好，你是學生嗎？','Nǐ hǎo, nǐ shì xuéshēng ma?','Xin chào, bạn là học sinh phải không?'),
]
FIRST_FRAMES=[
 ('{s}是{r}。','{sp} shì {rp}.','{sv} là {rv}.'),
 ('{s}是{r}嗎？','{sp} shì {rp} ma?','{sv} là {rv} phải không?'),
 ('你好，{s}是{r}。','Nǐ hǎo, {sp} shì {rp}.','Xin chào, {svl} là {rv}.'),
 ('{s}也是{r}。','{sp} yě shì {rp}.','{sv} cũng là {rv}.'),
 ('{s}也是{r}嗎？','{sp} yě shì {rp} ma?','{sv} cũng là {rv} phải không?'),
 ('{s}不是{r}。','{sp} bú shì {rp}.','{sv} không phải {rv}.'),
]
FIRST_SUBJECTS=[('我','Wǒ','Tôi'),('你','Nǐ','Bạn'),('他','Tā','Anh ấy'),('她','Tā','Cô ấy')]
FIRST_ROLES=[('學生','xuéshēng','học sinh'),('老師','lǎoshī','giáo viên')]

# Five explicit vocabulary groups per topic. Revisited words serve the new
# topic's usage; do not fill a medical/administrative lesson with random particles.
WORD_GROUPS={
'numbers':[
'零 一 二 三 四 五 六 七 八 九',
'十 兩 百 千 個 幾 多少 第 號 共',
'點 分 半 小時 分鐘 上午 中午 下午 晚上 現在',
'年 月 日 星期 今天 明天 昨天 週末 日期 生日',
'上個月 這個月 下個月 上星期 這星期 下星期 以前 以後 時間 改期'],
'food':[
'吃 喝 飯 麵 水 茶 要',
'菜單 早餐 午餐 晚餐 碗 杯 份',
'好吃 好喝 辣 素食 牛肉 糖 冰',
'餐廳 服務生 內用 外帶 牛奶 咖啡 豆漿',
'付款 現金 信用卡 收據 蛋餅 不要 一共'],
'shopping':[
'買 賣 商店 超市 便利商店 商品 找',
'多少 錢 塊 元 公斤 水果 蘋果',
'衣服 褲子 鞋 藍色 大 小 試穿',
'貴 便宜 新鮮 特價 價格 比較 挑選',
'發票 袋子 購物袋 刷卡 換 退貨 金額'],
'transport':[
'車站 捷運 公車 火車 高鐵 計程車 去',
'右邊 左邊 前面 後面 附近 路 右轉',
'票 悠遊卡 坐 搭 上車 下車 月臺',
'轉車 路線圖 出口 入口 站 走路 腳踏車',
'遠 近 到 出發 抵達 多久 分鐘'],
'family':[
'家 家人 爸爸 媽媽 哥哥 姐姐 弟弟',
'妹妹 爺爺 奶奶 孩子 歲 先生 太太',
'人 有 沒有 工作 介紹 自己 住',
'喜歡 一起 常常 有時候 運動 電影 音樂',
'見面 邀請 週末 生日 禮物 聯絡 電話'],
'home':[
'房間 宿舍 房子 廚房 浴室 廁所 門',
'窗戶 床 桌子 椅子 書桌 家具 冰箱',
'裡 外 旁邊 桌上 前 後 放',
'冷氣 電 網路 熱水 洗衣機 開 關',
'乾淨 安靜 打掃 整理 垃圾 搬 洗'],
'schedule':[
'學校 大學 學期 課 課表 星期 每天 上課 下課 學生證',
'早上 上午 中午 下午 晚上 開始 結束 小時 分鐘 時間',
'週末 行事曆 計畫 安排 明天 昨天 下星期 這星期 今天 日期',
'忙 有空 方便 需要 能 可以 想 先 再 等',
'改期 改成 通知 聯絡 確認 遲到 準時 請假 取消 預約'],
'information':[
'請問 問題 什麼 誰 哪裡 怎麼 為什麼 知道 懂 問',
'地址 電話 號碼 聯絡方式 姓名 電子郵件 路 附近 這裡 那裡',
'服務臺 櫃臺 郵局 醫院 銀行 查詢處 觀光中心 地方 地圖 找',
'幫忙 麻煩 解釋 慢 再 一下 聽不懂 明白 意思 告訴',
'確認 核對 正確 錯誤 訊息 記錄 查詢 回答 沒問題 謝謝'],
'classroom':[
'中文 華語 越南文 英文 字 詞 句子 漢字 書 筆',
'聽 說 老師 同學 回答 問題 練習 念 慢 一起',
'讀 寫 意思 生字 例子 造句 鉛筆 紙 本 板擦',
'作業 考試 複習 準備 完成 檢查 交 修改 內容 方法',
'懂 聽懂 聽不懂 說明 再 一次 可以 幫忙 注意事項 學習'],
'daily':[
'起床 早上 刷牙 洗臉 早餐 洗澡 衣服 穿 出門 每天',
'上學 上班 下班 回家 公車 走路 腳踏車 遲到 準時 忙',
'做飯 洗衣服 打掃 買菜 吃飯 喝水 手機 電腦 上網 事情',
'休息 跑步 游泳 運動 看電影 聽音樂 唱歌 跳舞 散步 睡覺',
'常常 有時候 已經 還 正在 然後 以前 以後 一起 了'],
'campus':[
'圖書館 教室 辦公室 研究室 語言中心 餐廳 宿舍 大學 研究所 系',
'報名 申請 新生 學生證 表格 填寫 簽名 證件 手續 截止',
'資料 書 借 還書 預約 查詢 找 電腦 網路 期限',
'同學 報告 討論 小組 計畫 進度 分工 完成 整理 修改',
'教授 電子郵件 寄 收到 見面 方便 麻煩 確認 建議 參考'],
'health':[
'身體 頭 肚子 喉嚨 牙 眼睛 耳朵 鼻子 手 腳 背 心臟 皮膚 舒服 健康',
'不舒服 感冒 發燒 咳嗽 頭痛 痛 累 嚴重 過敏 流鼻水 拉肚子 頭暈 受傷 症狀 體溫',
'醫院 診所 醫生 護士 掛號 健保卡 看病 量體溫 門診 號碼 姓名 預約 排隊 檢查 費用',
'藥 藥局 藥袋 藥水 藥丸 吃藥 飯前 飯後 睡前 一天 一次 三次 顆 粒 副作用',
'休息 喝水 睡覺 運動 再看醫生 回診 住院 出院 病假 清淡 注意 避免 改善 治療 照顧'],
'renting':[
'租屋 套房 雅房 房東 房客 仲介 地址 附近 交通 房間 坪數 租金 預算 看房 出租',
'電梯 樓層 陽臺 家具 冰箱 洗衣機 冷氣 熱水 網路 廚房 浴室 窗戶 採光 通風 安靜',
'押金 合約 租約 房租 水電費 管理費 包含 另外 每月 付款 現金 轉帳 到期 簽名 規定',
'壞了 修理 漏水 水管 師傅 聯絡 通知 檢查 插座 燈泡 停電 鑰匙 門鎖 維修 預約',
'搬家 垃圾 打掃 整理 退租 退押金 紙箱 行李 搬走 交屋 清潔 損壞 責任 日期 確認'],
'services':[
'服務 櫃臺 服務臺 郵局 銀行 排隊 號碼牌 等候 營業 時間 證件 客人 人員 辦理 需要',
'包裹 郵票 信封 運費 寄件人 收件人 地址 郵遞區號 紙箱 寄 送達 掛號信 快遞 重量 公斤',
'填寫 表格 簽名 姓名 電話 號碼 影印 申請 手續 核對 正本 副本 有效 日期 身分證',
'付款 收據 金額 現金 刷卡 轉帳 領取 取件 通知 取貨 退款 收款 費用 零錢 發票',
'查詢 進度 完成 確認 修改 資料 遺失 補辦 期限 工作天 等待 處理 聯絡 客服 結果'],
'worklife':[
'公司 同事 主管 客戶 辦公室 工作 職位 部門 員工 經理 助理 新人 介紹 聯絡 電子郵件',
'上班 下班 加班 排班 早班 晚班 班表 工時 準時 遲到 打卡 休假 週末 每週 時段',
'開會 會議 報告 討論 資料 準備 簡報 議題 意見 決定 記錄 內容 通知 參加 主持',
'請假 病假 事假 行程 改期 預約 取消 確認 方便 有空 約時間 請求 同意 原因 抱歉',
'完成 檢查 訊息 進度 計畫 任務 分工 修改 截止 交付 負責 問題 解決 回覆 提醒'],
'travel':[
'旅行 計畫 出發 抵達 行程 交通 景點 地圖 預算 天氣 雨傘 護照 行李 車票 機票',
'旅館 民宿 訂房 入住 退房 雙人房 單人房 房間 櫃臺 預約 確認 早餐 房卡 住宿 一晚',
'門票 導覽 拍照 風景 海邊 爬山 博物館 公園 展覽 紀念品 參觀 遊客 開放 免費 入口',
'火車 高鐵 公車 捷運 計程車 轉車 走路 車站 月臺 出口 路線 搭車 車程 迷路 問路',
'回程 帶回 分享 照片 旅途 經驗 下次 推薦 好玩 漂亮 特別 記得 忘記 遺失 找到'],
'social':[
'朋友 同學 認識 介紹 名字 聊天 打招呼 最近 怎麼樣 興趣 喜歡 一起 高興 新朋友 聯絡方式',
'邀請 參加 活動 聚餐 約會 週末 有空 方便 時間 地點 決定 接受 拒絕 改天 下次',
'客人 主人 請客 吃飯 喝茶 見面 等待 遲到 準時 菜單 推薦 分享 聊聊天 開心 告別',
'生日 禮物 祝福 恭喜 快樂 結婚 送 包裝 驚喜 謝謝 心意 祝賀 節日 慶祝 感謝',
'建議 同意 意見 覺得 希望 抱歉 打擾 可惜 沒關係 不好意思 道歉 商量 尊重 理解 選擇'],
}
