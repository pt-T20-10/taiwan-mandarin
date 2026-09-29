# Kế hoạch ứng dụng tự học Hoa ngữ Đài Loan

> Phạm vi v7 được người dùng duyệt ngày 29/09/2026: mở rộng bốn kỹ năng cho 18 chủ đề, ba bộ soạn sẵn/kỹ năng và AI tùy chọn; 72 bài lên 720 bài tập, hội thoại 8 câu. Bảo toàn v6, SQLite, FSRS, offline/model/zh-TW; Pinyin và Viết chữ không đổi. Triển khai và giới hạn thực tế ở [RELEASE-V7](RELEASE-V7.md); các kế hoạch cũ dưới đây giữ làm lịch sử.

> Cập nhật phạm vi 27/09/2026: kế hoạch v6 đã duyệt thay lựa chọn model/giọng cũ bên dưới. Chỉ Qwen3-4B-Q4_K_M, CPU/CUDA, Whisper base/small; zh-TW local, không Kokoro/audio mẫu Pinyin. Thêm 6 chủ đề A2 định hướng (24 bài/120 từ/12 ngữ pháp), tổng 18 chủ đề/72 bài/360 từ/36 ngữ pháp và animation 424 chữ. Giữ ID, dữ liệu, schema, offline và ngân sách 10 GB; B2 chưa hoàn thành. Trạng thái nghiệm thu ở TASKS/RELEASE-V6, không suy từ tài liệu kế hoạch gốc.

Ngày lập: 23/09/2026. Phiên bản: 1.0 — kế hoạch trước triển khai.

Tài liệu này xác định sản phẩm, thứ tự xây dựng và cách chuẩn bị VS Code/Codex. Chưa phải prompt yêu cầu xây toàn bộ ứng dụng, chưa có mã ứng dụng và chưa đo hiệu năng trên máy người dùng. Các công nghệ/model là lựa chọn triển khai dự kiến, cần xác nhận bằng thử nghiệm ở giai đoạn đầu.

## 1. Mục tiêu và các quyết định

Ứng dụng cá nhân học tiếng Trung Phồn thể theo Đài Loan, kết hợp giao tiếp đời sống, học thạc sĩ và luyện TOCFL. Tập trung Windows trước; sau khi bản Windows ổn định mới triển khai APK Android và đồng bộ hai thiết bị.

| Nội dung | Quyết định |
|---|---|
| Ngôn ngữ | Hán tự Phồn thể, cách dùng và giọng đọc theo Đài Loan; hướng dẫn và giải thích tiếng Việt |
| Phiên âm | Pinyin có dấu thanh; để khả năng thêm Zhuyin sau |
| Kỹ năng | Nghe, nói, đọc, viết; luyện viết chữ và viết diễn đạt là hai phần riêng |
| Cách học | Có lộ trình và tự chọn; kiểm tra đầu vào để bỏ qua kiến thức đã biết |
| Ôn tập | Flashcard, ôn cách quãng, sổ lỗi sai, luyện tự do |
| AI | Hội thoại tự do bằng chữ và bằng giọng nói theo lượt; có góp ý câu |
| Windows | Trình duyệt truy cập ứng dụng chạy cục bộ; chấp nhận chương trình khởi động local |
| Android | APK chạy độc lập trên điện thoại khi máy tính tắt; thực hiện sau Windows |
| Kết nối | Tải công cụ/model/nội dung khi có mạng; học offline sau khi cài đủ gói |
| Tiến độ | Lưu cục bộ; đồng bộ qua Wi-Fi nội bộ ở giai đoạn Android |
| Chi phí | Không yêu cầu API trả phí, thuê server hoặc mua nội dung/model để dùng ứng dụng |
| Giao diện | Đơn giản, một nhân vật minh họa; không năng lượng, quảng cáo, bảng xếp hạng hoặc streak |
| Dung lượng | Ngân sách thiết kế 10 GB trên mỗi thiết bị cho bản sử dụng, gồm model và nội dung |
| Thời gian học | Không áp đặt lịch hoặc số phút/ngày |

Ngày 25/09/2026, người dùng đã chốt mở rộng đến B2 theo từng nhóm nội dung hoàn chỉnh. Đợt hiện tại hoàn thiện 24 mục ngữ pháp nền tảng và lập lộ trình biên soạn tiếp; không phải yêu cầu biên soạn toàn bộ B2 trong một đợt. Gói v5 có 27 lô/12 chủ điểm/4 nhóm, mục tiêu và tiên quyết; 496 nhãn TBCL vẫn là danh mục tham chiếu chưa có bài đầy đủ. Không coi danh mục hoặc hoàn thành bài luyện nền tảng là đạt B2. C1–C2 chưa thuộc phạm vi hiện tại.

Phản hồi tiếp theo cùng ngày ưu tiên độ tự nhiên giọng đọc và grid Pinyin. Người dùng cho phép thêm neural Quan thoại phổ thông offline có nhãn để so sánh, giữ lựa chọn zh-TW cũ. Đã tích hợp Kokoro v1.1 Chinese tùy chọn, không đổi model chat/ASR; thông số, nguồn và phần chưa nghe duyệt ở [NEURAL_TTS.md](NEURAL_TTS.md).

### Phần cứng từ ảnh người dùng

- Windows 11 Home Single Language, Ryzen 5 5600H, RAM 16 GB.
- NVIDIA GTX 1650, VRAM khoảng 4 GB; GPU tích hợp AMD Radeon.
- Mục tổng bộ nhớ đồ họa khoảng 12 GB gồm bộ nhớ chia sẻ, không phải 12 GB VRAM riêng.
- Redmi Note 12S, Helio G96, Android 15, RAM vật lý 8 GB; phần +4 GB RAM mở rộng không dùng làm căn cứ chọn model.

## 2. Cấu trúc trải nghiệm

| Khu vực | Chức năng |
|---|---|
| Học | Tiếp tục bài, lộ trình theo trình độ, học theo chủ đề, kiểm tra đầu vào/cuối đơn vị |
| Ôn tập | Đến hạn, lỗi sai, từ/cấu trúc yếu, flashcard và luyện tự do |
| Luyện kỹ năng | Chọn nghe, nói, đọc, viết chữ hoặc viết câu/đoạn |
| Hội thoại | Chat tự do, chủ đề gợi ý, nhập chữ/micro, nghe trả lời, góp ý |
| Sổ tay | Từ cá nhân, cấu trúc, ghi chú, bộ thẻ tự tạo |
| Thống kê | Kết quả theo kỹ năng, thời gian học chủ động, nội dung đã học, hàng đợi ôn |
| Cài đặt | Hiển thị, audio/micro, model, gói nội dung, sao lưu và sau này đồng bộ |

Luồng một bài: giới thiệu mục tiêu và kiến thức mới → ví dụ có giải thích → bài nhận biết → bài tự nhớ/tạo câu → làm lại lỗi sau một khoảng xen kẽ → tổng kết → đưa kiến thức vào lịch ôn phù hợp.

Cho phép tạm dừng, tiếp tục, bỏ qua bài nghe/nói khi không tiện. Không bắt học lại toàn bộ bài sau khi ứng dụng đóng. Không khóa việc học vì hết lượt hoặc trả lời sai.

### Hiển thị Hán tự, Pinyin và tiếng Việt

- Mỗi lớp có tùy chọn luôn hiện, chạm/bấm để hiện hoặc ẩn. Pinyin có thêm chỉ hiện từ mới.
- Quy tắc áp dụng thống nhất ở thẻ, từ, câu, đáp án, hội thoại và bảng tra cứu.
- Không cần ép nghĩa Việt nằm dưới từng chữ: nghĩa từ/cụm/câu phải đúng ngữ cảnh.
- Pinyin căn theo từ/cụm; không tự tách mỗi chữ thành một từ độc lập.
- Với câu hỏi kiểm tra, thông tin làm lộ đáp án ẩn đến sau khi nộp; nếu người học bật gợi ý, ghi nhận trợ giúp thay vì xem như nhớ độc lập.
- Học phát âm cần phân biệt dạng phiên âm từ điển và ghi chú biến điệu trong lời nói. Chính sách hiển thị được ghi vào tài liệu nội dung.
- Chữ đa âm, thanh nhẹ, dấu cách, dấu thanh và cách dùng Đài Loan cần dữ liệu theo ngữ cảnh; không chỉ gọi bộ chuyển Pinyin rồi coi là đúng.
- Bài tập Pinyin chấp nhận đầu vào có dấu hoặc số thanh theo quy tắc công bố; phân biệt u và ü, hỗ trợ cách gõ v/u: nếu chọn sử dụng.
- Bài viết câu bằng Hán tự dùng IME Pinyin xuất chữ Phồn thể; không coi gõ một chuỗi Pinyin là đã viết đúng Hán tự.

## 3. Danh mục bài tập

| Nhóm | Dạng bài | Cách phản hồi |
|---|---|---|
| Phát âm | Thanh mẫu, vận mẫu, thanh điệu; nghe chọn âm; phân biệt cặp dễ nhầm | Audio mẫu, giải thích ngắn, phát lại |
| Từ vựng | Chọn nghĩa/chữ, ghép từ–nghĩa, ghép audio–chữ, nhớ chủ động | Nghĩa, Pinyin, ví dụ, loại từ/lượng từ khi cần |
| Ngữ pháp | Điền từ, sắp xếp câu, chọn/sửa lỗi, dịch hai chiều | Đáp án chấp nhận và lý do ngữ pháp |
| Nghe | Đúng–sai, chọn thông tin, chọn phản hồi, chép lại | Hiện transcript và bản dịch sau khi trả lời |
| Đọc | Đọc câu/đoạn/truyện; tìm thông tin và ý chính | Chỉ ra đoạn hỗ trợ đáp án |
| Nói | Nhắc lại, đọc câu, trả lời ngắn, đóng vai | Ghi âm, nghe lại, transcript; góp ý phù hợp độ tin cậy |
| Viết chữ | Xem nét, tô, giảm gợi ý, tự viết | Nét thiếu/thừa, thứ tự và vị trí dựa trên dữ liệu mẫu |
| Viết diễn đạt | Gõ câu, dịch, tin nhắn, email, đoạn văn | Quy tắc/đáp án mẫu với bài đóng; góp ý AI với bài mở |

Tập tô cần chuột trên Windows, chạm/bút trên Android. Kiểm tra nét không đồng nghĩa nhận dạng mọi kiểu chữ viết tay hoặc chấm thư pháp. Nếu dữ liệu nét khác chuẩn Đài Loan, phải sửa/chọn dữ liệu phù hợp hoặc báo thiếu dữ liệu; không âm thầm dạy mẫu sai.

Chấm bài đóng theo đáp án được biên soạn: chuẩn hóa Unicode, dấu câu và khoảng trắng khi hợp lý, nhưng không bỏ qua sai thanh hoặc sai chữ trong bài đang kiểm tra chính kỹ năng đó. Hỗ trợ nhiều đáp án đúng đã kiểm chứng; câu ngoài tập đáp án được ghi nhận để xem lại, không mặc định AI luôn đúng.

## 4. Flashcard và hệ thống ôn

### Các hướng thẻ

1. Hán tự → cách đọc và nghĩa Việt.
2. Nghĩa Việt → Hán tự/cách nói.
3. Audio → từ/nghĩa.
4. Nghĩa hoặc audio → viết chữ.
5. Câu khuyết → từ cần điền.
6. Tình huống → câu/cấu trúc phù hợp.

Mặt đáp án có Hán tự, Pinyin, nghĩa Việt, audio, ví dụ và ghi chú. Phím tắt Windows: Space lật thẻ; 1–4 đánh giá sau khi lật. Không để phím tắt cướp thao tác khi đang gõ IME.

### Quy tắc

- Ôn cách quãng bằng thư viện FSRS cho TypeScript làm ứng viên; khóa phiên bản khi chọn [9].
- Mức tự đánh giá: Quên, Khó, Nhớ, Dễ. Không biến mọi câu trả lời đúng trong bài trắc nghiệm thành mức Dễ.
- Thẻ theo hướng nhận diện, nghe và tự tạo có trạng thái nhớ riêng.
- Ôn đến hạn và luyện tự do là hai chế độ. Luyện thêm có ghi lịch sử nhưng không đẩy lịch ôn xa một cách giả tạo do lặp lại liên tiếp.
- Nội dung từ bài học chuẩn được tạo thẻ tự động theo lựa chọn người học; tránh tạo quá nhiều hướng cho mỗi từ cùng lúc.
- Cho phép tạo/sửa thẻ cá nhân, bộ thẻ, nhãn, tạm ngưng thẻ, nhập/xuất CSV hoặc JSON theo mẫu.
- Từ lấy từ AI có trạng thái chưa đối chiếu; người học xem trước khi thêm. Không giả mạo trạng thái đã được giáo viên kiểm duyệt.
- Sổ lỗi phân theo chữ, âm/thanh, nghĩa, lượng từ, ngữ pháp và lỗi nhập liệu khi xác định được.
- Số thẻ đến hạn là gợi ý, không là hạn mức. Người học có thể học tiếp không giới hạn.

## 5. Kiểm tra đầu vào và chương trình học

### Kiểm tra đầu vào

- Gói nền tảng có kiểm tra theo nhóm kiến thức để bỏ qua phần đã biết trong chính gói đó.
- Khi nội dung được mở rộng, ngân hàng kiểm tra mở rộng tương ứng. Không ước lượng B2 nếu chỉ có câu hỏi sơ cấp.
- Kết hợp nhận chữ/nghĩa, ngữ pháp, nghe và đọc; nói/viết có thể làm thêm để có hồ sơ riêng.
- Đề xuất khoảng 25–40 câu ở lần đầu; kết thúc sớm khi đủ dữ liệu hoặc người học muốn dừng.
- Kết quả là khuyến nghị vị trí bắt đầu, không phải điểm TOCFL chính thức.
- Cho người học chỉnh vị trí bắt đầu, mở lại bài đã bỏ qua và làm lại kiểm tra.
- Không suy từ đọc tốt thành nói/viết tốt. Phần bị bỏ qua chưa tự động được đánh dấu nhớ lâu mọi từ.

### Khung nội dung

Tham chiếu TBCL cho năng lực, chữ, từ, ngữ pháp; dùng nguồn TOCFL để định hướng dạng bài và luyện thi [10][11]. Không tự gán TBCL cấp N bằng CEFR cấp N; chỉ dùng đối chiếu có nguồn khi công bố.

Ba mạch: nền tảng ngôn ngữ; đời sống/đại học; luyện thi. Các chủ đề sớm gồm chào hỏi, giới thiệu, số và giờ, ăn uống, mua sắm, đi lại, gia đình, chỗ ở, lịch học, hỏi thông tin và giao tiếp trong lớp. Môi trường nghiên cứu, trao đổi giáo sư, báo cáo và email học thuật tăng dần sau nền tảng.

### Quy mô gói nền tảng đề xuất cho bản Windows đầu tiên

Đây là chỉ tiêu biên soạn để lập công việc, không phải mô tả một giáo trình đã tồn tại:

- 12 đơn vị chủ đề, khoảng 4 bài ngắn/đơn vị, tổng khoảng 48 bài.
- Khoảng 200–300 mục từ và 20–30 điểm ngữ pháp.
- Mỗi đơn vị có hội thoại ngắn, bài nghe/đọc, luyện chữ chọn lọc và ôn cuối đơn vị.
- Có tất cả nhóm kỹ năng và flashcard; bài viết mở ban đầu ở mức câu/tin nhắn ngắn.
- Biên soạn một đơn vị hoàn chỉnh trước để kiểm tra schema và trải nghiệm, rồi mở rộng.
- Chưa gọi gói này là hoàn thành A1 nếu chưa đối chiếu đủ yêu cầu năng lực.

### Kiểm soát nội dung

Mỗi mục có ID ổn định, nguồn, cấp/chủ đề, Hán tự, Pinyin theo ngữ cảnh, nghĩa Việt, audio/giọng đọc, đáp án, giải thích và trạng thái đối chiếu. Nội dung cập nhật giữ liên kết tiến độ bằng ID, không dùng vị trí dòng làm ID.

Nguồn tham chiếu chính: TBCL/NAER, tài nguyên TOCFL, từ điển Bộ Giáo dục Đài Loan. Việc tham chiếu không tự động cho phép đóng gói mọi tài sản: chọn nội dung và giấy phép phù hợp, lưu nguồn và điều kiện dùng, tránh phụ thuộc giáo trình/audio phải mua. Không sao chép nhân vật hoặc bộ bài của Duolingo.

Quy trình: xác định mục tiêu → soạn bài/đáp án → đối chiếu từ/cách đọc/cách dùng → kiểm tra tự động dữ liệu → nghe audio → ghi mức xác minh thực tế → đưa vào gói. Không có giáo viên thẩm định thì ghi rõ mức đối chiếu nguồn, không hứa chính xác tuyệt đối hoặc gán nhãn chuyên gia duyệt.

## 6. Kiến trúc đề xuất: Windows trước, tái sử dụng cho Android

| Lớp | Lựa chọn dự kiến | Trách nhiệm |
|---|---|---|
| Giao diện | React + TypeScript + Vite | Bài học, flashcard, nhập liệu, ghi âm, thống kê |
| Logic học dùng chung | Package TypeScript độc lập giao diện | Chấm bài đóng, sinh phiên ôn, FSRS, xử lý sự kiện học |
| Dịch vụ Windows | Python + FastAPI | Đọc/ghi dữ liệu, quản lý gói, điều phối AI và phục vụ bản web đã build |
| Dữ liệu Windows | SQLite + thư mục tài sản | Tiến độ, thẻ, phiên chat, model, audio, gói nội dung |
| Runtime LLM | llama.cpp qua adapter local | Sinh trả lời; CPU/GPU theo benchmark |
| Runtime ASR | whisper.cpp đa ngôn ngữ qua adapter local | Âm thanh → transcript tiếng Trung |
| TTS Windows | Giọng zh-TW local của Windows nếu thử nghiệm đạt | Đọc câu bài học và câu AI sinh ra |
| Luyện nét | Hanzi Writer + dữ liệu đóng gói đã đối chiếu | Hoạt hình và kiểm tra nét |
| Android sau | Capacitor + plugin native | Tái sử dụng web/core; thay adapter dữ liệu/audio/AI |

React/Vite, FastAPI, Capacitor và các runtime là phương án kỹ thuật có tài liệu chính thức [4–8][12][13]. Agent cần khóa phiên bản tương thích và ghi lại quyết định thực tế, không tự nâng hàng loạt dependency giữa dự án.

Không đóng gói Python server Windows nguyên xi vào APK. Các hợp đồng Storage, SpeechRecognition, SpeechSynthesis, ChatModel, ContentStore và Sync được tách từ đầu. Android dùng adapter native và model riêng khi cần.

### Chạy trên Windows

- Bản dùng hằng ngày: shortcut/launcher → mở dịch vụ cục bộ → mở trình duyệt tại localhost.
- FastAPI phục vụ web đã build cùng origin; Vite dev server chỉ dùng lúc phát triển.
- SQLite là nguồn dữ liệu chính trên Windows, không để toàn bộ tiến độ chỉ nằm trong cache trình duyệt.
- Model ở thư mục dữ liệu local, không đưa vào Git. Chỉ tải model khi người dùng chạy bước cài đặt/cập nhật rõ ràng.
- Lõi học và nội dung đã tải vẫn hoạt động nếu AI lỗi hoặc đang tắt.
- Có nút dừng dịch vụ; tránh để model tiếp tục chiếm RAM sau khi người dùng muốn thoát.
- Bind loopback mặc định; chỉ mở chức năng LAN khi cần đồng bộ. Không expose endpoint AI hoặc đường dẫn file tùy ý ra LAN.

## 7. AI và hội thoại giọng nói

### Chuỗi xử lý bản đầu

Người học bấm ghi âm → dừng ghi → ASR nhận dạng → cho sửa transcript nếu nghe nhầm → gửi → model trả lời ngắn → hiện Phồn thể/Pinyin/nghĩa Việt → đọc phần tiếng Trung bằng TTS local.

Có thể tự gửi sau khi nhận dạng bằng tùy chọn; mặc định cho kiểm tra transcript để tránh hiểu nhầm. Khi bấm ghi âm mới, dừng TTS để giảm việc micro thu lại giọng ứng dụng. Có hủy tạo câu, dừng audio, phát lại và chuyển sang gõ chữ.

Hội thoại tự do và đóng vai đều có. Góp ý tối đa một vài lỗi đáng chú ý mỗi lượt, giữ mạch trò chuyện. Không buộc bài nào cũng trở thành bài phân tích ngữ pháp dài.

### Ứng viên và điều kiện chọn

| Thành phần | Bắt đầu thử | Điều kiện cần xác minh |
|---|---|---|
| LLM | Qwen3-1.7B bản lượng tử hóa GGUF khoảng 4-bit, qua llama.cpp | Chất lượng Phồn thể, cách dùng Đài Loan, nghĩa Việt, Pinyin, tốc độ và RAM |
| LLM mạnh hơn | Một model cỡ 3–4B nếu bản nhỏ chưa đạt và máy còn tài nguyên | Đo thực tế, không tải nhiều model mặc định |
| ASR | Whisper base đa ngôn ngữ; so với small nếu cần | Câu tiếng Trung người học đọc, số, tên riêng, im lặng; không chọn bản .en |
| TTS | Windows voice zh-TW local như Hanhan/Yating/Zhiwei nếu máy cung cấp | Cài được, ứng dụng truy cập được, đọc mới khi ngắt Internet, phát âm phù hợp |
| TTS dự phòng | Runtime offline như sherpa-onnx với model/giọng phù hợp | Phải xác minh model cụ thể, giấy phép, giọng Đài Loan và tài nguyên |

Qwen3-1.7B và llama.cpp có nguồn chính thức [5][6]. Đây là danh sách ứng viên, không phải khẳng định model đã đạt chất lượng gia sư. Dùng cấu hình không suy luận dài nếu runtime/model hỗ trợ; bắt đầu với cửa sổ ngữ cảnh vừa phải và câu trả lời ngắn, sau đó đo.

Microsoft công bố các giọng Chinese (Traditional, Taiwan) [14]. Việc có tên trong danh sách chưa chứng minh đã cài trên máy hoặc được trình duyệt cung cấp. Agent phải liệt kê giọng, kiểm tra localService nếu dùng Web Speech, và thử phát câu mới khi offline [15]. Nếu trình duyệt không truy cập được nhưng Windows có giọng, thử adapter native Windows. Không sửa Registry để ép giọng vào API như đường mặc định.

Audio bài nghe cố định ưu tiên tài sản đã kiểm tra và được phép lưu. Khi dùng TTS hệ thống cho bài cố định, ghi nguồn giọng, kiểm tra phát âm và xử lý lỗi đọc. Không mặc định có thể xuất/phân phối giọng Windows sang Android. Nếu cần chuyển audio tạo sẵn sang điện thoại, xác minh quyền lưu/chuyển trước.

Không dùng edge-tts hoặc endpoint TTS online làm phương án offline. Không âm thầm thay giọng Đài Loan bằng zh-CN khi thiếu giọng. Nếu chưa tìm được giải pháp TTS phù hợp, báo rõ phần giọng nói chưa đạt thay vì ghi nhận đã hoàn thành.

### Góp ý và chấm nói

- ASR đúng chữ không chứng minh âm/thanh điệu đúng. Không quy transcript match thành điểm phát âm chính xác.
- Tách lỗi nhận dạng khỏi lỗi của người học. Cho người học sửa transcript trước khi nhận góp ý ngữ pháp.
- Với nói theo mẫu, có thể báo từ nhận dạng được/thiếu với nhãn phù hợp; không gán điểm chuyên gia về thanh điệu.
- Chấm thanh điệu chi tiết là phần thử nghiệm mở rộng, cần bộ đánh giá và phương pháp chuyên biệt.
- Câu AI sinh ra và Pinyin/dịch đi kèm có thể sai; ưu tiên tra từ đã có dữ liệu, đánh dấu nội dung sinh tự động và cho báo lỗi.
- Không tự đưa góp ý AI vào điểm thi, không tự cập nhật toàn bộ mức thành thạo vì chat một lần thành công.

### Ngân sách và benchmark

4 GB VRAM cần chia cho runtime và bộ nhớ ngữ cảnh; không nạp mọi model lên GPU đồng thời. Thử LLM trên GPU một phần/toàn phần, ASR/TTS trên CPU hoặc luân phiên theo kết quả đo. Có phương án CPU khi GPU không tương thích.

Mục tiêu thử nghiệm Windows đề xuất, chưa phải kết quả đo: thao tác bài thường phản hồi dưới khoảng 200 ms; câu AI ngắn có chữ đầu trong khoảng 5 giây sau khi transcript sẵn sàng; câu nói 5–10 giây được nhận dạng trong khoảng 5 giây; bắt đầu TTS trong khoảng 2 giây sau khi có câu để đọc. Báo riêng lần khởi động lạnh và lần đã nạp model; nếu không đạt, ghi số đo và lựa chọn đánh đổi.

Benchmark gồm khoảng 30 tình huống chat, 40 đoạn nói ngắn và 30 câu TTS bao phủ chữ đa âm, số, lượng từ và cách dùng Đài Loan. Đo latency, peak RAM/VRAM, lỗi/chất lượng và thử buổi chat 15 phút. Không dùng riêng đánh giá của một model để chứng nhận toàn bộ kết quả ngôn ngữ đúng.

## 8. Gói dữ liệu, dung lượng và đồng bộ

### Phân bổ 10 GB dự kiến mỗi thiết bị

| Phần | Ngân sách |
|---|---:|
| Một LLM được chọn | 2,5 GB |
| ASR | 0,6 GB |
| TTS/tài nguyên giọng được ứng dụng quản lý | 1,0 GB |
| Nội dung và audio | 3,0 GB |
| Runtime, font, dữ liệu nét | 0,8 GB |
| Tiến độ, ghi chú, cache/ghi âm giới hạn | 0,6 GB |
| Dự phòng cập nhật | 1,5 GB |
| Tổng | 10,0 GB |

Đây là giới hạn phân bổ, không phải kích thước model thực tế. Nếu thành phần vượt phần của mình thì điều chỉnh tổng, không vượt ngân sách âm thầm. Công cụ phát triển như SDK, node_modules, môi trường Python, Android Studio và file tải tạm không nằm trong kích thước bản sử dụng; cần thêm chỗ trống lúc phát triển. Không thể lưu audio/ghi âm vô hạn trong 10 GB: có quota, xóa cache và quản lý gói. Mặc định không lưu lâu mọi bản ghi micro.

Gói nội dung cần manifest, version, hash, ID, license/source và dung lượng. Nhập gói kiểm tra hash/schema trước, cập nhật theo transaction và giữ bản cũ khi thất bại. Font và dữ liệu nét phải có local, không kéo CDN lúc học.

### Đồng bộ ở giai đoạn Android

- Hai máy cùng Wi-Fi, ứng dụng mở; ghép cặp bằng mã/QR và xác nhận thiết bị.
- Chỉ chuyển dữ liệu học giữa thiết bị được ghép cặp; kết nối có xác thực và bảo vệ dữ liệu truyền. Không coi cùng mạng là đủ tin cậy.
- Bắt đầu với nút Đồng bộ; không cần chạy nền liên tục.
- Nhật ký học có event ID duy nhất, device ID, thời gian, loại kỹ năng, trợ giúp và phiên bản thuật toán/schema.
- Hợp nhất sự kiện chống trùng; tính lại trạng thái ôn từ dữ liệu chung theo thứ tự xác định. Có xử lý lệch đồng hồ và lưu phiên bản FSRS/tham số.
- Sửa ghi chú/thẻ đồng thời: lưu phiên bản và hiển thị xung đột cần chọn; không ghi đè toàn bộ database bằng file mới hơn.
- Xóa dữ liệu dùng dấu xóa để đồng bộ không làm xuất hiện lại dữ liệu đã xóa.
- Ngắt mạng giữa chừng không mất tiến độ; chạy lại an toàn.
- Bản đầu đồng bộ tiến độ, thẻ và ghi chú; model không nằm trong sync thường xuyên. Gói nội dung cùng ID/version được kiểm tra, bản ghi âm/chat có thể chọn chuyển sau.
- Sao lưu file vẫn có ở Windows trước khi có Android. Có thao tác phục hồi trên dữ liệu mẫu để xác nhận dùng được.

## 9. Thứ tự triển khai và điều kiện hoàn thành

| Giai đoạn | Việc chính | Đầu ra và điều kiện |
|---|---|---|
| 0. Chuẩn bị | Kiểm tra môi trường, tạo repo, lưu tài liệu, xác định phiên bản | Báo cáo môi trường và dự án mở đúng trong Codex |
| 1. Thử kỹ thuật | Micro, giọng zh-TW offline, ASR, LLM, VRAM; một lượt hội thoại hoàn chỉnh | Số đo trên Windows thật, model/giọng được chọn hoặc hạn chế được ghi rõ |
| 2. Lõi học | Schema, lưu local, hiển thị ba lớp, một đơn vị mẫu, bài tập đóng, luyện nét | Học trọn một đơn vị offline; đóng/mở không mất tiến độ |
| 3. Ôn và đầu vào | Flashcard, FSRS, lỗi sai, kiểm tra nền tảng, thống kê | Lịch ôn và bài bỏ qua hợp lý; không lộ đáp án ngoài chủ ý |
| 4. Hoàn thiện Windows | Tích hợp chat chữ/giọng, gói 12 đơn vị, launcher, quản lý dữ liệu và backup | Windows v1 có đầy đủ nhóm chức năng đã chốt, tài liệu sử dụng và giới hạn thật |
| 5. Ổn định | Dùng qua nhiều phiên, sửa lỗi nhập liệu/voice/mất dữ liệu, kiểm tra offline | Không còn lỗi chặn học; hoàn thành tiêu chí Windows bên dưới |
| 6. Android | Capacitor, native adapter, thử model trên Helio G96, tối ưu chạm/IME | APK độc lập khi PC tắt và điện thoại không có Internet |
| 7. Đồng bộ | Ghép cặp, hợp nhất tiến độ, kiểm tra xung đột và ngắt kết nối | Hai máy hội tụ cùng tiến độ, không mất/trùng lượt học |
| 8. Nội dung cao hơn | Bổ sung chương trình theo khung, bài dài, viết/học thuật, TOCFL | Công bố đúng phạm vi đã có dữ liệu; mở rộng đến B2 rồi theo quyết định tiếp |

Không cần lập lịch thời gian cứng. Mỗi giai đoạn chia thành việc nhỏ có kết quả chạy được và bằng chứng; Codex thực hiện liên tục trong phạm vi được giao. Nếu một yêu cầu chưa khả thi, ghi rõ và đưa lựa chọn cụ thể, không tự hạ yêu cầu rồi tuyên bố xong.

### Tiêu chí nghiệm thu Windows v1

1. Mở bằng launcher và trình duyệt; thao tác bình thường không cần mở VS Code.
2. Ngắt Internet trước khi mở ứng dụng: học, tra trong gói, flashcard, luyện nét, chat chữ và chat micro/TTS vẫn dùng được khi tài nguyên đã cài.
3. Không có request nền đến CDN, API AI hoặc endpoint TTS ngoài máy trong chế độ học offline.
4. Hán tự/Pinyin/nghĩa Việt hiển thị và ẩn đúng ngữ cảnh; IME không làm gửi bài trước khi chọn xong chữ.
5. Một buổi học có bài mới, ôn, nghe, nói, đọc, viết và lưu tiến độ đúng; không khóa vì sai.
6. Khởi động lại không mất bài đang làm, ghi chú hoặc lịch ôn; thao tác cùng lúc ở hai tab không tạo lượt học trùng.
7. Nhập/xuất thẻ và sao lưu/phục hồi hoạt động; cập nhật gói không xóa tiến độ.
8. Nội dung nền tảng đạt kiểm tra cấu trúc và có nguồn/mức đối chiếu rõ; số lượng thực tế được báo cáo.
9. Model lỗi, micro bị từ chối hoặc thiếu voice có thông báo và đường tiếp tục học; chỉ ghi hoàn thành voice khi chuỗi thực sự chạy.
10. Có báo cáo RAM/VRAM, dung lượng và độ trễ thực tế. Không dùng benchmark của máy khác thay cho máy người dùng.

## 10. Chuẩn bị VS Code/Codex trước khi gửi prompt triển khai

### A. Phần người dùng chuẩn bị

**Bước 1 — Giữ môi trường Windows native.** Mở VS Code trên Windows, dùng PowerShell. Không dùng Ubuntu VirtualBox cho dự án này vì mục tiêu đầu tiên là kiểm tra micro, giọng Windows và GPU ngay trên máy đang học. Codex có hướng dẫn native Windows; WSL là lựa chọn khác khi có nhu cầu cụ thể [1].

**Bước 2 — Kiểm tra công cụ trước khi cài thêm.** Trong terminal PowerShell của VS Code, chạy từng dòng:

```powershell
git --version
node --version
npm.cmd --version
py --list
nvidia-smi
```

Lệnh chưa có sẽ báo lỗi; đó là thông tin cần ghi lại, không phải lỗi dự án. Nếu nvidia-smi chưa gọi được, dùng thông tin GPU trong Task Manager/ứng dụng NVIDIA và để Agent kiểm tra đường dẫn/driver ở giai đoạn 0; không suy GPU không tồn tại chỉ từ lỗi PATH.

**Bước 3 — Bổ sung phần thiếu từ nguồn chính thức.**

| Công cụ | Chuẩn bị dự kiến |
|---|---|
| Git for Windows | Cài nếu thiếu; dùng Git local, chưa cần GitHub |
| Node.js | Bản LTS tương thích Vite; Node 24 LTS là ứng viên ở thời điểm lập kế hoạch, xác nhận bản đang hỗ trợ khi cài |
| Python | Python 3.13 64-bit là ứng viên; Agent xác minh package cần thiết rồi khóa phiên bản; giữ bản sẵn có nếu tương thích |
| Trình duyệt | Edge hoặc Chrome hiện có; chọn một làm mục tiêu kiểm tra chính trước |
| VS Code/Codex | Kiểm tra extension do OpenAI phát hành, cập nhật khi cần và đăng nhập |

Nguồn tải: [Node.js](https://nodejs.org/en/download), [Python Windows](https://www.python.org/downloads/windows/), [Git Windows](https://git-scm.com/downloads/win). Đóng/mở terminal sau cài để PATH được cập nhật. Không cài Docker, Android Studio, JDK, CUDA Toolkit hay Visual Studio C++ Build Tools ở bước đầu nếu chưa có nhu cầu đã xác định. Binary runtime dựng sẵn phù hợp được ưu tiên; CUDA Toolkit chỉ cần nếu phương án thực tế yêu cầu build.

**Bước 4 — Chuẩn bị nhập liệu và audio.**

- Windows Settings → Time & language: thêm Chinese (Traditional, Taiwan), tải thành phần speech/TTS nếu có; không cần đổi ngôn ngữ hiển thị Windows.
- Kiểm tra Microsoft Bopomofo/IME có tùy chọn Hanyu Pinyin phù hợp; gõ thử để đầu ra là Phồn thể. Tên menu có thể thay đổi theo bản Windows; ghi ảnh nếu không tìm thấy.
- Windows Settings → Privacy & security → Microphone: cho trình duyệt được sử dụng micro; trong ứng dụng sau này cấp quyền riêng cho localhost.
- Thử micro bằng công cụ ghi âm sẵn có. Tải voice khi online; phần kiểm tra phát qua ứng dụng và offline do Agent thực hiện ở giai đoạn 1.

**Bước 5 — Tạo thư mục dự án.** Ví dụ dưới dùng thư mục trong hồ sơ người dùng; nếu thư mục đã tồn tại, dùng lại khi đúng dự án, không xóa nội dung:

```powershell
$projectDir = Join-Path $env:USERPROFILE 'Projects\taiwan-mandarin'
New-Item -ItemType Directory -Force -Path $projectDir
Set-Location $projectDir
git init
code .
```

Đặt bản kế hoạch này vào `docs/PLAN.md` trong dự án. Lưu các ảnh tham khảo vào `docs/references/` nếu muốn Agent xem; mô tả trong kế hoạch vẫn đủ khi ảnh không sẵn có. Khi commit lần đầu, nếu Git yêu cầu tên/email tác giả thì cấu hình trong repo bằng thông tin người dùng chọn; không tự đặt thông tin giả hoặc sửa global config.

**Bước 6 — Mở Codex trong đúng thư mục.** Mở sidebar Codex hoặc Command Palette → `Codex: Open Codex Sidebar` [2]. Đăng nhập bằng tài khoản ChatGPT hiện có nếu đó là cách đang dùng. Đăng nhập bằng ChatGPT và API key có cơ chế truy cập/tính phí khác nhau [3]; không tạo API key trả phí cho dự án học này.

Codex là công cụ phát triển đang sử dụng, không phải AI local bên trong ứng dụng. Quyền truy cập Codex vẫn theo tài khoản/hạn mức; kế hoạch không hứa Codex miễn phí hoặc không giới hạn. Ứng dụng hoàn thành phải chạy độc lập với Codex và không đòi tài khoản ChatGPT.

**Bước 7 — Cho Agent làm việc trong dự án.** Chọn chế độ có thể đọc/sửa file và chạy lệnh local trong workspace, theo giao diện phiên bản đang dùng. Giữ cấu hình sandbox mặc định được hỗ trợ; nếu có bước setup Windows sandbox, làm theo hướng dẫn chính thức. Không cần cấp Full Access chỉ để làm dự án này. Tải package/model có thể cần cấp quyền mạng theo cấu hình Codex; chỉ cấp cho tác vụ thực tế.

Không bắt buộc cài thêm MCP, plugin hoặc nhiều agent. Không cần Codex CLI riêng nếu extension đang hoạt động tốt. Chọn model viết code có sẵn trong tài khoản, không phụ thuộc tên model cụ thể trong bản kế hoạch.

### B. Những tài liệu Agent cần có trước khi viết tính năng

Đây là cấu trúc đích để Agent tạo trong giai đoạn chuẩn bị, không phải các file đã tồn tại trên máy người dùng:

| File | Vai trò |
|---|---|
| `AGENTS.md` ở gốc repo | Nguyên tắc bền vững, cách chạy/test đã xác minh, đường dẫn tài liệu |
| `docs/PLAN.md` | Bản kế hoạch này |
| `docs/ENVIRONMENT.md` | OS, phiên bản công cụ, GPU/driver, voice, dung lượng, kết quả kiểm tra |
| `docs/DECISIONS.md` | Quyết định công nghệ/model thực tế, lý do và hạn chế |
| `docs/TASKS.md` | Việc đang làm, đã xong, còn thiếu và bằng chứng nghiệm thu |
| `docs/CONTENT_GUIDE.md` | Chuẩn Đài Loan, Pinyin, nguồn, đáp án và quy trình nội dung |
| `docs/BENCHMARKS.md` | Cấu hình model và số đo trên máy thật |

Codex đọc `AGENTS.md` trước khi làm việc [16]. File này nên ngắn, dẫn đến tài liệu đầy đủ thay vì chép cả kế hoạch vào phần chỉ dẫn tự động.

Nội dung cần ghi vào AGENTS.md khi chuẩn bị prompt:

- Windows trước; Android và đồng bộ LAN ở giai đoạn sau, nhưng giữ adapter để tái sử dụng.
- Không bỏ flashcard, micro/TTS hoặc kiểm tra đầu vào khỏi phạm vi bản Windows hoàn chỉnh.
- Không thêm phụ thuộc cloud/API trả phí vào runtime; tài sản học được đóng gói local.
- UI tiếng Việt, nội dung Phồn thể Đài Loan; Pinyin/nghĩa có tùy chọn hiển thị.
- Không giả kết quả model, không coi ASR là bộ chấm thanh điệu.
- Nội dung mẫu và nội dung đã đối chiếu phải phân biệt; không bịa nguồn/giấy phép.
- Bảo toàn dữ liệu người học; thay schema có migration và phương án phục hồi.
- Mỗi phần có tiêu chí kiểm tra có ý nghĩa; báo rõ kiểm tra đã chạy và chưa chạy.
- Sau mỗi mốc cập nhật TASKS và DECISIONS; giải thích thay đổi bằng tiếng Việt, tên code nhất quán.
- Không commit model, bộ nhớ đệm, database cá nhân, bản ghi micro hoặc thông tin đăng nhập.
- Dùng Git checkpoint cho thay đổi đã kiểm tra; không xóa thay đổi của người dùng.
- Dùng phiên bản đã khóa, tra tài liệu chính thức khi cần; không tự nâng cả stack để sửa lỗi nhỏ.

### C. Phân biệt các bước giao việc

1. Người dùng hoàn thành kiểm tra công cụ và mở repo.
2. Nhiệm vụ đầu cho Codex: đọc kế hoạch, kiểm tra môi trường, tạo tài liệu nền và chia việc giai đoạn 0–1; chưa xây toàn bộ ứng dụng.
3. Nhiệm vụ tiếp: thử chuỗi micro → ASR → LLM → TTS trên Windows và ghi số đo.
4. Sau khi biết cấu hình khả thi, giao từng mốc sản phẩm theo bảng giai đoạn.

Mỗi nhiệm vụ nên có mục tiêu, phạm vi, file liên quan, tiêu chí hoàn thành và báo cáo cần trả. Không cần hỏi lại người dùng cho mọi bước kỹ thuật nhỏ đã nằm trong phạm vi giao; chỉ đưa quyết định mới khi ảnh hưởng yêu cầu/chi phí hoặc thử nghiệm cho thấy mục tiêu chưa đáp ứng.

Trước khi gửi prompt triển khai, kiểm tra: mở đúng repo; kế hoạch có trong docs; Codex đăng nhập được; terminal nhận công cụ cần thiết; mic và nguồn voice có thông tin; phạm vi bắt đầu là Windows. Không cần người dùng tự tải tất cả model hoặc tự cài toàn bộ dependency AI trước khi Agent đánh giá.

## 11. Các điểm chưa được đo/chốt

- Chưa benchmark Windows; chưa kiểm tra driver GTX 1650 với bản runtime sẽ chọn.
- Chưa xác nhận giọng zh-TW local hiện có trên máy và khả năng truy cập từ ứng dụng.
- Chưa xác nhận model nhỏ tạo Pinyin/nghĩa Việt ổn định ở mức chấp nhận được.
- Chưa chứng minh chất lượng chấm phát âm/thanh điệu; không coi đó là chức năng đã bảo đảm.
- Chưa biên soạn gói 12 đơn vị hoặc xác minh toàn bộ nguồn/tài sản có thể đóng gói.
- Android cần benchmark riêng ở giai đoạn sau; kết quả tốt trên GTX 1650 không suy ra kết quả tốt trên Helio G96.
- Mốc B2 là giả định lập kế hoạch; điểm cuối cao hơn có thể điều chỉnh mà không cản trở giai đoạn nền tảng.

## 12. Nguồn kỹ thuật và chương trình học

Các nguồn đã tham khảo trong phiên lập kế hoạch. Phiên bản cài thực tế phải được ghi lại khi triển khai.

1. [Codex Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox).
2. [Codex IDE extension](https://learn.chatgpt.com/docs/codex/ide).
3. [Codex authentication](https://learn.chatgpt.com/docs/auth).
4. [Vite Getting Started](https://vite.dev/guide/).
5. [Qwen3-1.7B model card](https://huggingface.co/Qwen/Qwen3-1.7B).
6. [llama.cpp](https://github.com/ggml-org/llama.cpp).
7. [whisper.cpp](https://github.com/ggml-org/whisper.cpp).
8. [sherpa-onnx TTS](https://k2-fsa.github.io/sherpa/onnx/tts/index.html).
9. [TS-FSRS](https://github.com/open-spaced-repetition/ts-fsrs).
10. [TBCL — NAER](https://bcoct.naer.edu.tw/TBCL/).
11. [TOCFL teaching resources](https://tocfl.edu.tw/tocfl/index.php/teach/download).
12. [FastAPI](https://fastapi.tiangolo.com/).
13. [Capacitor](https://capacitorjs.com/docs).
14. [Microsoft — supported languages and voices](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-a-supported-languages-and-voices).
15. [MDN — localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService).
16. [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).
17. [Hanzi Writer local data loading](https://hanziwriter.org/docs.html).
18. [Duolingo Practice tab](https://blog.duolingo.com/guide-to-duolingo-practice-hub/).
19. [Duolingo spaced repetition](https://blog.duolingo.com/spaced-repetition-for-learning/).
20. [Duolingo writing activities](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-writing-skills/).
