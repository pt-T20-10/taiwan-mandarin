# Tiến độ Windows — chưa đạt nghiệm thu v1

## Pinyin/nghe ở câu hỏi, lựa chọn và đáp án — 25/10/2026

- Dùng chung `QuestionReading` trong Học, Skills, phần 5, WrittenPractice và Sổ lỗi sai: Hiện/Ẩn Pinyin nhiều lần và nghe đúng phần Hán tự đang hiển thị bằng adapter zh-TW. Điều khiển nằm ngoài nút chọn đáp án; chỉ hiển thị khi có Hán tự. Chuyển câu/phiên trở lại ẩn Pinyin. Phần đối chiếu của Học dùng PracticeText thay lớp Pinyin luôn hiện.
- `build_lookup.py` biên soạn `question-readings.json` từ dữ liệu có sẵn, gồm các mảnh câu còn lại sau khi tạo chỗ trống. Runtime chỉ tra chính văn bản hiển thị, ưu tiên Pinyin nguồn nếu khớp nguyên câu; không phục hồi chỗ trống hoặc sinh phiên âm bằng AI. Mảnh chưa có dữ liệu báo thiếu Pinyin. Nghe dùng cả cụm/câu Hán tự qua giọng cũ, không đọc chuỗi Latin.
- Mở Pinyin/nghe trong lượt chấm được ghi là trợ giúp, ẩn lại không xóa dấu. Phần 5 và sửa lỗi tách cờ đã dùng trợ giúp khỏi cờ mở đáp án để không vô tình lộ lời giải. Giữ tiến độ, ID, snapshot và FSRS.
- Đã chạy build, 3 core tests (questionReading + lessonSequence), 2 E2E (lesson-sequence + question-reading): lặp toggle, chỗ trống không lộ đáp án, nghe không chọn lựa chọn, payload audio đúng từ, dấu trợ giúp qua reload/nộp, phản hồi đáp án, phần 5 không mở đáp án khi bật Pinyin, mobile. TTS trong E2E chặn request để xác nhận văn bản, không đánh giá chất lượng giọng. Build còn cảnh báo bundle lớn như trước. Local 8765 đã phục vụ build mới; chưa commit/push.

## Nối từ mới → hội thoại → luyện xen ôn theo lesson — 25/10/2026

- Soạn 72 hội thoại riêng, mỗi bài 4 lượt A/B, đủ 5 từ trọng tâm; nguồn `content/lesson-dialogues.tsv`, đóng gói bằng `scripts/build_lesson_dialogues.py` vào `core/lesson-dialogues.json`. Intro không dùng lại `unit.dialogue`. Pinyin/Việt soạn sẵn, tra từ và nghe dùng cơ chế hiện có; thêm 13 mục tra từ hỗ trợ. Không gọi AI lúc học; nội dung vẫn là bản nháp, chưa giáo viên duyệt.
- `lessonSequence.ts` tạo 10 câu/bài: 5 nhớ từ, 3 điền từ trong câu, 1 nghe và 1 đọc từ hội thoại vừa học. Mỗi từ có câu vận dụng. Xen tối đa 2 câu từ bài trước đã hoàn thành trong cùng chủ đề và 1 câu từ chủ đề trước đã hoàn thành. Không lấy bài sau/dở/xóa; phiên legacy chỉ lấy câu từ đúng word_ids đã giới thiệu, bỏ filler dùng từ tương lai. Có nhãn nguồn ôn.
- Phiên mới lưu `sequence_revision`, `exercise_snapshot`, thứ tự `exercise_ids`/lựa chọn và `review_labels` trong sessions hiện có. Retry giải theo snapshot; Review tìm được câu mới để sửa lỗi. `learnedWriting` đọc đúng snapshot đã hoàn thành; ngân hàng viết câu bổ sung hội thoại mới qua bộ lọc đã học. Giữ v8/package/SQLite/schema/FSRS và phiên đang làm cũ; Học lại mở bộ mới. Màn intro cũ chưa bắt đầu chuyển sang bộ liên kết khi bấm bắt đầu.
- Đã chạy: build; compiler 72/72 và bao phủ từ; 7 core tests (lessonSequence/learnedWriting/topicLanguage); 1 E2E qua (food.3: hội thoại, 13 câu, chỗ trống không lộ câu đầy đủ, reload, lưu/tiếp tục bản nháp, hoàn thành, legacy nguyên trạng, mobile); content:check và 1 test manifest/tài sản. Hai lần E2E đầu lỗi test do điều hướng và locator label khi textarea có giá trị; sửa test dùng chờ URL và role textbox rồi qua. Không benchmark AI hay kiểm định nghe toàn bộ. Build có cảnh báo bundle >500kB như trước.
- Tất cả chữ trong 72 đoạn mới có phân đoạn tra từ; dữ liệu cũ còn 66 ký tự chưa phủ ở các văn bản khác. Không bổ sung/chứng nhận mẫu nét mới. Local 8765 phục vụ bản build mới, giữ thay đổi trước đó, chưa commit/push.

## Giảm tải động từ nhập môn — 20/10/2026 (điều chỉnh phần 5)

- Thay phân bổ động từ tự động bằng `beginnerVerbs.ts`: 21 động từ toàn lộ trình, sáu chủ đề đầu chỉ 1 từ/chủ đề, các chủ đề sau tối đa 2. 15 từ còn lại của ngân hàng 36 từ chuyển sang `#grammar/verbs/advanced`, nhãn nâng cao/bổ sung tự chọn. Đây là phân tầng biên tập theo mức tải của bài, không phải chứng nhận cấp độ TOCFL.
- Dùng 21 câu ngắn, tối đa 8 ký tự kể cả dấu câu, có Phồn thể/Pinyin/nghĩa. Phần 5 nhập môn chỉ dạy nguyên từ, không bắt học tách/thời lượng/trải nghiệm. Trang động từ cũng thu mẫu tách vào mục Học thêm, danh sách nhập môn 21 từ và phân loại bổ sung nhất quán. Câu ngắn được đưa vào ngân hàng viết câu nhưng vẫn qua bộ lọc đã học.
- Phiên mới dùng `topic-language:v2:<unit>` và câu động từ có hậu tố `intro-v2`; lưu tách khỏi v1. Link `/legacy` đọc đúng snapshot, bản nháp và kết quả v1; không ghi đè, chuyển đáp án hoặc tự hoàn thành v2. Dấu hoàn thành cũ vẫn được nhận diện trên lộ trình. `learnedWriting` đọc cả hai phiên bản, cấp đúng từ/câu của phiên đã hoàn thành, không biến bằng chứng v1 thành câu v2 chưa học.
- Phân bổ nhập môn mới có nội dung cho cả 18 chủ đề (tổng 90 phần cùng 72 bài gốc); số lượng từ không đổi. Tài liệu phần 5 bên dưới là lịch sử phân bổ v1.
- Build cuối qua; 5 core checks và 2 E2E liên quan qua sau cập nhật kỳ vọng phiên bản: giới hạn số từ, không trùng, câu ngắn, nguồn v1/v2, học/tiếp tục/nộp, bản nháp v1 nguyên trạng, mục bổ sung 15 từ và mobile. `build_lookup.py` đóng gói câu mới; đối chiếu cả 21 câu không thiếu chữ trong phân đoạn tra từ (67 chữ chưa phủ ở dữ liệu cũ không tăng). Không chạy benchmark AI, không sửa SQLite/FSRS/package. Bản local cập nhật, chưa commit/push.

## Phần 5: lượng từ và động từ mới — 20/10/2026

- `core/topicLanguage.ts` phân bổ theo lần giới thiệu đầu tiên trong thứ tự 18 chủ đề của gói. Lượng từ so theo chữ lượng từ chính (張 đi với danh từ mới vẫn là ôn lại), động từ so ID từ. Không phụ thuộc tìm kiếm, thứ tự mở bài hoặc tiến độ người dùng. Ngân hàng hiện tại tạo 14 phần mới, tổng 20 lượng từ và 34 động từ li hợp; classroom/campus/renting/social không thêm phần 5 vì không có mục mới. Không bổ sung ngôn liệu chỉ để đủ số.
- Thẻ chủ đề trong Học có phần thứ 5 khi cần, thay hai liên kết bổ sung cũ. Từ đã giới thiệu nằm trong mục Ôn lại kèm liên kết chủ đề giới thiệu đầu. Trang tra cứu động từ/lượng từ vẫn giữ ngân hàng liên quan cho ôn tập, gắn nhãn Mới/Ôn lại và liên kết phần 5.
- `TopicLanguage.tsx`: học thẻ từ/nét/Pinyin/nghĩa và mẫu dùng, điền từ vào câu thật; chấp nhận biến thể lượng từ đã biên soạn. Namespace `topic-language:v1:<unit>` lưu snapshot câu, đáp án, trợ giúp, bản nháp, tiến độ và danh sách mục đã học. Lưu nháp tuần tự CAS; nộp dùng event practice + mutation transaction/key chống trùng. Đây là lượt thực hành, không cộng vào tỷ lệ đúng bài đóng hoặc tạo flashcard/lịch FSRS.
- Hoàn thành mới cấp bằng chứng cho đúng mục đã trả lời đúng: từ trọng tâm và các câu mẫu đã trình bày, không tự mở ngữ pháp hay mọi từ trong đoạn. `learnedWriting` nhận nguồn này; học lại giữ danh sách đã học từ lần hoàn thành trước. Có dấu hoàn thành, tiếp tục bài đang dở, chuyển phần 4 → 5 → chủ đề sau. 72 ID/mốc bài cũ giữ nguyên; tổng hiển thị là 86 phần, không đánh dấu lại các bài cũ.
- Build qua; 5 core checks (2 mới + 3 học từ cũ) và 2 E2E tập trung qua: chu kỳ giới thiệu không trùng, thiếu thật trong câu, nguồn từ đúng/sai/chưa xong/học lại, lưu nháp/reload/tiếp tục/nộp đúp/hoàn thành, giữ bản ghi bài cũ và số thẻ, tra cứu chủ đề/mobile. E2E lần đầu phát hiện loại event không được API chấp nhận; đã dùng kind practice hiện có và chạy lại qua. Không chạy benchmark AI. Bản local cập nhật; chưa commit/push.

## Phân biệt trang lượng từ/động từ theo chủ đề — 20/10/2026

- Liên kết trong 18 thẻ Học đã mang đúng ID; vấn đề là trang chủ đề mở đầu bằng nội dung chung giống nhau. Đưa tên chủ đề, phạm vi và bộ chọn lên đầu. Trang động từ chủ đề chỉ hiện nhóm từ tương ứng; sáu bài nền tảng và 20 động từ đối chiếu nằm ở trang tổng hợp, ghi rõ kiến thức chung.
- Phần Dùng khi nào/Từ cần biết/Cách dùng/Ví dụ của lượng từ dùng đúng tập cụm theo chủ đề thay vì luôn ly trà/sách/vé. Trang tổng hợp của cả hai mục có danh sách 18 chủ đề kèm từ/cụm. Ghi rõ từ có thể xuất hiện ở nhiều chủ đề và đây là ngân hàng bổ sung.
- Đổi chủ đề lượng từ tạo lại trạng thái tìm kiếm; giữ nguyên ID nội dung, ngân hàng, lịch sử và các phiên luyện. Không nâng gói hay sửa SQLite.
- Build qua; một E2E kiểm tra liên kết của 18 chủ đề, bộ từ/giới thiệu riêng Số và thời gian/Ăn uống/Giao thông, đổi chủ đề và màn hình 390px qua. Lần đầu test kỳ vọng sai thứ tự hai cụm vận tải; sửa kỳ vọng, chạy lại qua. Bản local đã build; chưa commit/push.

## Tạm ẩn luyện nói — 20/10/2026

- Cờ `SPEAKING_ENABLED=false` tại `src/core/features.ts`: ẩn tab/liên kết Nói trong Skills, Học, lượng từ, động từ và hàng thống kê Nói. Link nói cũ mở phần đọc/tra cứu; bộ luyện nói không được khởi tạo qua UI.
- Ẩn Recorder dùng chung, cấu hình ASR và thử micro trong Cài đặt; Hội thoại giữ nhập chữ, nghe trả lời và góp ý viết. Giữ code/model/API/ngân hàng và dữ liệu cũ để bật lại sau.
- Phiên Học mới/học lại loại câu nói khỏi danh sách. Phiên cũ gặp câu nói có nút tiếp tục, giữ snapshot bản nháp trong `paused_speaking`, không phát sự kiện nói hay thêm đáp án giả. Không sửa lịch FSRS hoặc xóa lịch sử.
- Build qua; 1 E2E qua: 6 màn hình/link nói cũ không có Recorder/liên kết nói, tiếp tục phiên cũ giữ bản nháp/không tạo đáp án. Không benchmark ASR. Chưa commit/push.

## Sổ tay: trạng thái thẻ và căn chỉnh bộ lọc — 19/10/2026

- Tra trong gói hiển thị ✓ Đã thêm, viền nhận diện và khóa nút thêm khi đã có thẻ theo hướng đang chọn. Bộ lọc Tất cả/Đã thêm/Chưa thêm có số lượng kết quả; nếu chỉ có hướng khác thì có nhãn riêng. Thẻ tạm ngưng vẫn được tính đã thêm; thẻ đã xóa không tính.
- Dò cả word_id và Hán tự + Pinyin chuẩn hóa, nên thẻ nhập JSON/ID cá nhân cũng được nhận ra. Chống bấm thêm trùng trong lúc lưu; không ghi đè thẻ cũ nếu nó từng được sửa sang hướng khác. Lịch ôn của thẻ đã tồn tại giữ nguyên.
- `forms.css` thống nhất chiều cao, nhãn và căn đáy ô nhập/dropdown; `filter-bar` dùng cho Sổ tay, ngữ pháp, động từ, lượng từ. Sửa căn hàng các actions có dropdown, ô tìm Học và thanh tìm Pinyin. Màn hình hẹp chuyển bộ lọc thành cột; không đổi cài đặt hiển thị/lịch học.
- Build, 1 core test dò thẻ nhập/tạm ngưng/xóa/khác cách đọc, 2 E2E trạng thái/lọc/đổi hướng/reload/giữ lịch ôn và bố cục desktop/mobile trên 8 màn hình qua. Đã xem ảnh desktop Sổ tay. Chưa commit/push; bản dist local cập nhật.

## Giữ nguyên đơn vị bộ thủ/thành phần đã nhận diện — 19/10/2026

- `radical-learning-units.json` là danh mục dùng chung cho tên Việt hiển thị và điểm dừng phân tích. Bổ sung các tên/dạng phổ biến còn thiếu như 虍, 几, 米, 气; giữ nguyên các đơn vị có tên như 王, 青, 母 thay vì tách tiếp.
- 號: giữ nguyên 虎 bên phải, hiển thị hổ · con hổ; bộ thủ tra cứu vẫn là 虍 — hổ · đầu hổ. Đối chiếu MOE: https://stroke-order.learningweb.moe.edu.tw/dictMean.jsp?ID=34399&la=0 ; danh mục bộ thủ: https://dict.variants.moe.edu.tw/file/files/214%E9%83%A8%E9%A6%96%E5%AD%97%E9%9F%B3%E8%AE%80%E8%A1%A8.pdf . Không coi mọi thành phần nguyên khối là bộ thủ tra cứu riêng.
- Bộ đóng gói dùng danh mục này để tạo các mẫu IDS nhận diện được. Gộp cả cây con IDS được viết tường minh, chỉ khi hình thức trùng đúng và ánh xạ không mơ hồ; không gộp mọi chữ có nghĩa. Vẫn tách 您 thành 亻/⺈/小/心, giữ thành phần lặp và chống vòng lặp.
- Build, một core test mở rộng (quét toàn bộ danh mục mẫu chữ + 號/皇 và IDS tường minh), một E2E thẻ 號/nhãn hổ/desktop/mobile qua. Không đổi nét chữ gốc, SQLite hay tiến độ; chưa commit/push.

## Đánh dấu từ đã học ngay trong bài — 19/10/2026

- Thẻ từ dùng chung (gồm hộp Từ bổ sung) có nút Đánh dấu đã học / Đã học ✓ · Bỏ đánh dấu. Chỉ khi người học bấm mới ghi nhận; mở thẻ hay nghe không tự đánh dấu.
- Lưu report `learned-word:<mã chữ>` với đúng Hán tự/Pinyin/nghĩa/ngữ cảnh, phiên bản CAS và thời điểm; dùng schema/backup hiện có. Có thể bỏ dấu và tải lại vẫn giữ trạng thái. Không tạo flashcard, sửa lịch ôn, tăng điểm hoặc đánh dấu xong bài.
- `writingKnowledge` nhận dấu này là nguồn thứ ba cùng flashcard và bài hoàn thành. Chỉ mở đúng từ/cụm được đánh dấu, không tự mở chữ thành phần hay ngữ pháp/cả chủ đề. Bỏ dấu không xóa bằng chứng đã học từ nguồn khác. Giao diện luyện viết có đếm nguồn tự đánh dấu.
- Build qua; 3 core tests (nguồn mới/bỏ dấu/giữ nguồn khác cùng bộ lọc cũ) và 1 E2E tra từ → đánh dấu → reload → bỏ dấu, đối chiếu cards/sessions/events giữ nguyên, desktop/mobile qua. Không chạy lại benchmark AI. Dist local đã cập nhật, chưa commit/push.

## Sửa điều kiện kiến thức đã học cho viết câu — 17/10/2026

- Thay việc chọn chủ đề là đủ bằng `writingKnowledge`/`learnedSentenceBank`: từ từ flashcard không xóa/không tạm dừng, đúng `word_ids` của từng bài hoàn thành, mẫu ngữ pháp gắn với bài/phiên ngữ pháp hoàn thành. Bài đang dở, AI feedback và phiên viết câu trước không tự mở khóa từ mới.
- Kiểm tra từng từ/cụm bằng từ điển phân đoạn đóng gói, không suy đã biết từ ghép chỉ vì biết từng chữ. Các mẫu tách động từ phải có bằng chứng đã luyện; bài bổ sung chỉ mở đúng các câu trong bộ đã hoàn thành. Theo dõi cả danh sách câu v6/v7/v8 của phiên đã hoàn thành khi lấy bằng chứng.
- Chọn chủ đề chỉ lọc hẹp nguồn đã học, không cấp thêm kiến thức. Đọc lại state mới trước khi tạo bộ; báo thiếu khi dưới 5 câu, giữ bộ cũ/bản nháp. Bộ dở vượt kiến thức hiện tại có thông báo tạo bộ mới thay vì tiếp tục hiển thị câu không phù hợp. Bài đã nộp vẫn xem được trong lịch sử.
- Bổ sung lời chào/câu giao tiếp ngắn để các bài chào hỏi đầu tiên có bộ ôn phù hợp. Đối chiếu read-only tiến độ local: 61 flashcard đang dùng, 6 bài hoàn thành, 62 từ/cụm được ghi nhận, 19 câu đủ điều kiện tại thời điểm kiểm tra.
- Build qua; 4 core checks về nguồn học/không tự mở từ ghép/ngữ pháp/chu kỳ và 1 E2E từ hồ sơ trống → thêm flashcard + hoàn thành bài → tạo/đổi/tiếp tục/nộp bộ qua. Không sửa SQLite, không chạy lại benchmark AI, chưa commit/push.

## Viết câu theo bộ và đọc vận dụng — 17/10/2026

- Thêm `#skills/<chủ đề>/sentences`, liên kết từ Ôn tập: chọn nhiều chủ đề đã học, bộ 5/8/10 câu Việt → Hán tự bằng IME Pinyin của Windows; gom ví dụ đã soạn từ ngữ pháp/hội thoại/động từ/lượng từ. Câu mới trộn không lặp trước khi cạn ngân hàng; bản nháp, thứ tự và lịch sử được lưu.
- Nộp cả bộ, đối chiếu biến thể đã biên soạn; câu khác mẫu cần đối chiếu, không tự kết luận sai. Có tự nhận xét AI local các câu khác mẫu khi bật, hoặc gọi từng câu sau nộp; prompt mới `sentence-review` nhận cả đề Việt và đáp án tham chiếu. Kết quả AI thử nghiệm, không biến thành điểm đúng tự động.
- Đọc theo bộ hiển thị trọn đoạn và 10 câu hỏi cùng lúc. Chào hỏi có 3 bộ mới: 2 hội thoại 8–10 lượt có nhãn nhân vật, 1 đoạn văn 9 câu; thêm câu hỏi suy luận, vận dụng và tự gõ. Chủ đề khác dùng lại ngân hàng hiện có dưới dạng đoạn văn, chưa biên soạn lại toàn bộ. Có liên kết tiếp tục phiên đọc cũ.
- Hover câu 0,5 giây hiện Pinyin và đọc nguyên câu Hán tự; bàn phím/nút chạm cũng dùng được. Không tra từ làm lộ nghĩa Việt; bản dịch chỉ xuất hiện qua gợi ý hoặc sau nộp. Trợ giúp được lưu.
- Namespace `written:*` / `written-history:*`, dùng transaction tạo phiên + lịch sử và event nộp chống trùng; không đổi schema, package v8, lịch FSRS hoặc mốc bài Học. Bộ đề nằm trong source có ID phiên bản và được chụp vào phiên.
- Máy hiện chỉ báo một giọng zh-TW native: Microsoft Hanhan Desktop. Có chọn giọng theo vai, nhưng hai nhân vật phải dùng chung nếu máy không có giọng thứ hai; không giả giọng nam.
- Kiểm tra thực chạy: build; 2 core tests (chu kỳ/biến thể và ngân hàng đọc); 2 backend tests (namespace/transaction/chống nộp trùng và tương thích v8); 2 E2E (viết/lưu nháp/đổi bộ/tiếp tục/nộp/AI fixture và đọc 10 câu/ẩn nghĩa/mobile) qua. E2E có một cảnh báo Proactor WinError 10054 khi hủy kết nối audio, không làm test thất bại.
- Smoke Qwen local CUDA một câu thật qua mode `sentence-review`: phản hồi đủ Hán tự/Pinyin/nghĩa/nhận xét đúng với câu thử “Tôi có hai quyển sách”; tổng 63,09 giây gồm nạp model, phần tạo câu 3,552 giây. Không chạy lại benchmark chất lượng; không suy rộng chất lượng từ một câu. Báo cáo local ignored: `data/sentence-review-smoke.json`.
- Bản local tại 127.0.0.1:8765 đã nạp backend mới và dist mới; không nâng gói/sửa trực tiếp SQLite, không commit/push.

## Gỡ luyện viết bằng chuột — 17/10/2026

- Gỡ tab Viết chữ, nút Luyện viết từ này, luyện nét cuối bài Học và bảng vẽ nháp trong flashcard. Xóa bộ so nét bằng chuột và các kiểm tra dành riêng cho tính năng đã gỡ. Giữ hoạt ảnh thứ tự nét, cấu tạo chữ, Pinyin/nghe và viết diễn đạt bằng bàn phím. Bản ghi luyện cũ vẫn được giữ.
- Kiểm tra: build qua; một E2E tra từ/xem hoạt ảnh/mobile và đường dẫn tab viết cũ qua. Bản local 8765 phục vụ dist mới. Chưa commit/push thay đổi này.

## Học trong ngữ cảnh v8 — 15/10/2026

- [x] Sửa thẻ bị chồng lấn trong Khám phá từ mới: dùng cùng `study-card-grid` với Từ cần biết thay lưới thẻ nhỏ cũ. Build và E2E chủ đề giao thông ở rộng 1440/768/390 px qua; bản dist cập nhật tại 8765.

- [x] Thẻ từ dùng chung, trình bày lại lượng từ/động từ/ngữ pháp, tra từ offline, luyện viết bằng mẫu nét hiện có, sửa lỗi có điểm kết thúc. Chi tiết và giới hạn: [RELEASE-V8.md](RELEASE-V8.md).
- [x] Build, 3 core checks, 3 backend/content/manifest checks, 2 E2E (tra từ/mobile/luyện viết và sửa→reload→sai lại) qua. Không chạy benchmark AI.
- [x] Sao lưu và nâng v7→v8 qua API ngày 15/10/2026 15:07; 81 objects và 180 events giữ nguyên, hash state trước/sau trùng. Backup local `data/backups/before-v8-20261015-150720.json`. Phục vụ tại 127.0.0.1:8765; không push.
- [ ] 17 chữ chưa có mẫu; mẫu mới chưa đối chiếu MOE từng chữ. Một số ghi chú/mảnh câu ngoài hội thoại và ví dụ ngữ pháp chưa tra được mọi chữ. Không nâng nhãn nội dung đã duyệt.

## Mẫu nét tự lặp — 11/10/2026

- [x] CharacterStudy tự lặp sau khi giữ chữ hoàn chỉnh 2,5 giây; bỏ nút Phát lại. Tạm dừng/Phát tiếp, Nét kế và Chậm vẫn hoạt động; hủy timer/frame khi đổi chữ hoặc rời màn hình. Giữ tùy chọn hệ thống giảm chuyển động (bấm Phát tiếp để bắt đầu). Build qua.

## Pinyin trong bài chọn nghĩa — 11/10/2026

- [x] Thêm Hiện/Ẩn Pinyin dưới từ ở bài `meaning`, dùng PracticeText với riêng lớp Pinyin. Mở Pinyin lưu trạng thái có trợ giúp; ẩn lại vẫn giữ, câu/lượt mới mặc định ẩn. Tiếng Việt tiếp tục chỉ mở qua gợi ý hoặc đối chiếu để bảo toàn đáp án. Build qua; không thêm test cho thay đổi giao diện nhỏ.

## Thành phần cấu tạo chữ — 11/10/2026

- [x] Màn hình mẫu nét tách bộ thủ tra cứu khỏi các thành phần, hiện vị trí và tên Việt khi có dữ liệu; 好 hiện 女 (bộ nữ) và 子 (bộ tử). Bản đầu chỉ tách một tầng, chưa đạt yêu cầu ở 您; đã sửa để tách đệ quy 您 → 你 + 心 → 亻 + 尔 + 心 → 亻 + ⺈ + 小 + 心, giữ bộ/biến thể làm đơn vị học thay vì tách tiếp thành nét. ⺈ được ghi là dạng thành phần của 刀, không gán thành 冖 (mịch).
- [x] Đóng gói 637 cấu tạo có thể truy cập từ 424 chữ, lấy từ AnimCJK dictionary đã cache ở revision `ec5e17cca76c87587790bcbce5ea0b4d4fb753d6` (LGPL-3.0), ưu tiên IDS đã chỉnh của dự án. Script tái tạo: `scripts/build_character_components.py`. Giữ thành phần lặp, chặn vòng tham chiếu; thiếu dữ liệu/tên Việt thì giữ hình chữ và báo rõ, không đoán từ nguyên. Chưa thẩm định chuyên môn toàn bộ cấu tạo.
- [x] Build và một test qua: 您/好/林, vị trí nhiều tầng, IDS thiếu và toàn bộ 424 mẫu. Loại file test khỏi bước typecheck của bản ứng dụng vì test động từ dùng `node:child_process` trong khi tsconfig chỉ nạp kiểu Vite; Vitest vẫn chạy các file này.

## Chuyên đề động từ — 04/10/2026

- [x] Ngữ pháp → Động từ và cách dùng: sáu bài × sáu câu; 20 động từ đơn/song âm để đối chiếu; 36 từ li hợp với 72 câu ví dụ liền/tách, Phồn thể/Pinyin/nghĩa Việt, 24 mục học trước + 12 mở rộng. Nhãn số âm tiết/tân ngữ/li hợp không bị đồng nhất; ghi riêng biến thể 幫忙, 報名. Ví dụ do dự án soạn, chưa giáo viên duyệt.
- [x] Liên kết từ Học, bài Học và Skills theo 18 chủ đề; bộ ôn sáu mục/kỹ năng/chủ đề, tổng hợp có sáu nhóm luân phiên. Dùng lại lưu nháp, tiếp tục, ghi âm, trợ giúp, sổ lỗi; thêm thẻ theo câu khi người học chọn. Không sửa gói v7/ID/tiến độ 72 bài hoặc FSRS.
- [x] Smoke phát hiện backend chỉ nhận bộ Skills v7 (8 câu ngữ cảnh và tỷ lệ dạng bài cố định), cũng làm lượng từ không lưu được. Thêm SupplementalPracticeSet chỉ cho nguồn authored và namespace verbs/classifiers; giữ kiểm tra v7/AI cũ. Sửa câu khuyết `___`, câu mẫu Nói và lựa chọn của ngân hàng lượng từ để đáp ứng hợp đồng lưu. Không đổi schema SQLite.
- [x] Build pass; hai kiểm tra core ngân hàng pass, test động từ đối chiếu toàn bộ packet frontend qua validator Python và kiểm tra biên v7/AI không bị nới. Một Edge E2E pass: bắt đầu, lưu đáp án, reload giữ thứ tự/nháp, nộp, tiếp tục và mobile. Không chạy benchmark hay E2E toàn bộ theo yêu cầu tiết kiệm.
- Nguồn/giới hạn: [hướng dẫn NTNU](https://www.mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/1.pdf), [nghiên cứu NTNU về li hợp và lỗi người học](https://web.ntnu.edu.tw/~lchang/separable_2007.pdf). Chưa nghiệm thu âm thanh hoặc xác minh giáo viên cho toàn bộ câu. Phần đọc liền còn là công việc riêng đang dở.

## Lượng từ bổ sung — 02/10/2026

- [x] Mục Học → Lượng từ: bài nhập môn, 22 cụm ví dụ/20 lượng từ, tìm kiếm và lọc theo 18 chủ đề; liên kết từ bài Học, Ngữ pháp và Skills. Bài tập tổng hợp nhập môn dùng sáu cụm, các chủ đề dùng cụm liên quan.
- [x] Dùng lại SkillPractice: đọc hiểu chọn nghĩa, điền lượng từ có ngữ cảnh/đáp án thay thế, nghe chép câu, đọc mẫu/tự nói, viết câu; lưu nháp, lịch sử, trộn thứ tự và tiếp tục. Mỗi chủ đề/kỹ năng có một bộ bổ sung, không quảng bá thành ba bộ khác nhau. Không tạo đề AI cho các chủ đề bổ sung chưa có trong API.
- [x] Thêm thẻ theo cả cụm khi người học chọn; sổ lỗi đọc được câu/đáp án từ packet đã lưu. Tiến độ bổ sung dùng ID `classifiers:*`, không sửa 72 bài, gói v7 hoặc lịch ôn hiện có.
- [x] Build và kiểm tra core/adapter; chỉ thêm một test ngân hàng để kiểm tra đủ chủ đề, ID, đáp án/lựa chọn và roundtrip phiên. Không chạy E2E/benchmark lớn theo yêu cầu tiết kiệm của người dùng. Chưa kiểm tra nghe thủ công hoặc nghiệm thu giáo viên.
- Nguồn tham khảo: [tài liệu lượng từ trên 全球華文網](https://blog2.huayuworld.org/phunglaoshi/wp-content/uploads/sites/1457/2019/01/L9-PPT.pdf); ví dụ và giải thích Việt do dự án biên soạn, trạng thái bản nháp.

## Ưu tiên trọng tâm: đọc liền/biến điệu — 30/09/2026

- [ ] Người dùng xác nhận hầu hết ví dụ đọc liền vẫn rời từng âm. Tính năng nghe chưa đạt mục tiêu dạy phát âm; ưu tiên xử lý trước mở rộng nội dung. Không coi playback/WAV/ASR pass là nghiệm thu biến điệu.
- [x] Xác nhận giọng đã lưu Yating zh-TW/normal, ứng dụng gửi nguyên cụm/câu, ghi chú đọc liền chưa điều khiển TTS. Probe native Hanhan: plain và SSML câu cho WAV trùng byte, IPA có thanh điệu bị từ chối. Không đổi giọng/tiến độ, không công bố probe là audio chuẩn.
- [ ] Chưa có audio thay thế được nghe kiểm chứng. Cần mẫu nguyên cụm/câu và đánh giá TTS cho câu mới theo bộ ca đọc liền. Điều tra/tiêu chí/nguồn và giới hạn: [CONNECTED-SPEECH](CONNECTED-SPEECH.md). BreezyVoice chỉ là ứng viên đã tìm hiểu, chưa cài hoặc xác nhận chạy phù hợp máy này.

## Luyện bốn kỹ năng v7 — 29/09/2026

- [x] 18 chủ đề × 4 kỹ năng × 3 bộ = 216 bộ/1.620 câu-lượt. Nghe/Đọc 10 câu đúng tỷ lệ dạng bài; Nói 8 lượt; Viết 2 đề. Mỗi bộ 8 câu ngữ cảnh, 54 tình huống. Nối hội thoại cũ thành 8 câu, 72 bài × 10 = 720 bài tập; hash fixture khóa toàn bộ nội dung v6, giữ 540 ID/câu cũ.
- [x] Bật/tắt Pinyin/nghĩa Việt từng câu/cả đoạn, ẩn khi đổi câu/bộ; trợ giúp được lưu. Điền từ che câu/audio đáp án; chấm giữ khác biệt Hán tự. Ghi âm/nghe lại/transcript sửa được, tự xác nhận/bỏ qua; Viết lưu và xem mẫu sau nộp. Không chấm phát âm hoặc cho đúng/sai bài mở.
- [x] Vòng ba bộ không lặp, giữ thứ tự câu/đáp án qua reload; bản nháp, lịch sử, tiếp tục và chống nộp trùng. Đã tìm/sửa lỗi UI dùng state cũ sau chuyển tab; mount chờ lượt ghi còn chờ rồi tải state mới. Không đổi lịch thẻ hoặc mốc hoàn thành Học.
- [x] Backend/adapter AI tạo theo lô tối đa hai câu, tiến độ/hủy và khóa chung; source AI tách thống kê/sổ lỗi. Bộ AI lưu nguyên trong phiên; lỗi/hủy không thay bộ cũ. JSON schema giới hạn dạng câu, hậu kiểm căn cứ/chỗ trống/ngôn ngữ thô; không nhận prompt tùy ý.
- [x] Build/content/manifest qua; 31 core/adapter và 43 backend qua. Sau sửa retry AI, 6/6 backend Skills qua. Lượt Edge đầy đủ 46/46 kiểm tra cả 72 bài; 11/11 flow liên quan sau sửa nội dung/audio; bản sửa cuối khôi phục draft qua tab/resume đã qua 5/5 Skills. Có một lượt 4/5 Skills lỗi do cờ chặn lưu khởi tạo sai trong bản sửa giữa chừng; đã sửa và chạy lại đủ năm, không bỏ kiểm tra.
- [x] Smoke zh-TW thật qua API/playback/dừng. Smoke Qwen CPU/CUDA thật chạy, **lượt cuối đều bị hậu kiểm từ chối** (CPU: dịch lẫn Hán tự; CUDA: câu hỏi lặp). AI optional chưa ổn định, không khẳng định có bộ qua toàn bộ kiểm tra cuối. Chi tiết/timing/lỗi ở [RELEASE-V7](RELEASE-V7.md), kết quả thô `data/practice-smoke-v7*.json`. Không đổi cấu hình/model, không benchmark lại toàn bộ.
- [x] Sao lưu trước restart và trước nâng gói. API transaction nâng v6→v7 ngày `20260929-132736`; **state giữ nguyên 15 objects/44 events**, SHA-256 trước/sau `62531c7e9c48153893f55454ba93e2037a590351b39005cd859001786beb02ba`. Backup `data/backups/before-v7-20260929-132736.json`, report cùng timestamp. Không sửa trực tiếp database hoặc reset lịch ôn.
- [x] Bản cuối chạy `http://127.0.0.1:8765`; smoke Edge bản cài desktop/mobile không tràn, không page error/request ngoài loopback, đủ 216 bộ/720 câu, toggle đoạn 8 câu và state trước restart/sau smoke bằng nhau. Artifact `data/v7-installed-smoke.json`, `data/v7-installed-{desktop,mobile}.png`. Lưu checkpoint Git local, không push.
- [ ] Nội dung mới chưa giáo viên duyệt, TTS chưa nghe duyệt, AI còn lỗi nghĩa/Pinyin. Xem giới hạn trong bàn giao; chưa nghiệm thu Windows v1/B2.

## Điều tra Start.cmd tự dừng — 29/09/2026

- [x] Log người dùng cho thấy startup thành công, shutdown hoàn tất rồi `KeyboardInterrupt`/`^C`; người dùng xác nhận không tự bấm ngắt. Uvicorn cài đặt phát lại signal sau cleanup; launcher nay bắt riêng KeyboardInterrupt ở entrypoint, không che lỗi khác. Không coi favicon 404 là nguyên nhân.
- [x] Thêm log xoay vòng `data/launcher.log` (1 MB × tối đa 3 file), timestamp/PID/parent và phân biệt tín hiệu SIGINT/SIGTERM/SIGBREAK với callback `/api/shutdown`. Không ghi nội dung học/request body; không tự bỏ qua signal, đổi dependency hoặc cấu hình Windows.
- [x] 37/37 backend tests qua, gồm subprocess Uvicorn thật với data tạm/port tự chọn nhận SIGINT sau startup, cleanup đủ và không traceback, log signal đầy đủ. Không đổi frontend nên không build/E2E lại. Dịch vụ hiện tại trả health bình thường; giữ nguyên tiến trình người dùng đang chạy, log mới có hiệu lực khi khởi động lại.
- [ ] Chưa xác định nguồn gửi tín hiệu của lần tự dừng trước; Python/Windows signal không cung cấp sender trong handler. Chuỗi tiến trình hiện tại thuộc terminal VS Code, chưa đủ bằng chứng quy lỗi cho VS Code. Cần log mới nếu tái diễn; không tuyên bố đã sửa nguyên nhân tự dừng.

## Bảng Pinyin hover/chạm, bốn thanh và bản thu riêng — yêu cầu tiếp theo 28/09/2026

- [x] Thay grid/nội dung ghép từng phần bằng table hàng thanh mẫu/cột vận mẫu, giữ 406 ô. Hover hoặc chạm mở popup bốn thanh cạnh ô; chỉ click thanh mới phát, click lại replay. Có tìm kiếm/dừng; hỗ trợ bàn phím (Enter/Space mở, ↓ vào thanh, Escape đóng), popup trong viewport, cuộn bảng riêng trên mobile.
- [x] Theo yêu cầu mới, khôi phục **1.598 bản MP3 nguyên âm tiết / 31.305.950 bytes** từ Git `9198c81`, xác minh từng hash/size. Không khôi phục WAV ghép thành phần, model hoặc runtime cũ. Có **26/1.624 tổ hợp** thiếu bản thu, nút mờ “Chưa có”; bỏ thông báo thiếu ví dụ Hán tự. Mapping TBCL cũ giữ làm dữ liệu tham chiếu, không được bảng này gọi nữa.
- [x] Nguồn Unlicense davinfifield, revision và giới hạn ghi trong ATTRIBUTION/recordings.json. Quan thoại phổ thông, chưa xác minh vùng giọng Đài Loan hoặc nghe duyệt toàn bộ; không coi mọi bản thu là từ có nghĩa. Từ/câu và các nhóm 一/不/thanh nhẹ vẫn dùng zh-TW đã lưu. Không TTS Latin hoặc ghép audio.
- [x] Adapter phát một bản thu dùng chung cơ chế dừng với TTS: chọn mới, dừng, phát câu và rời trang đều hủy; lỗi muộn không đè lượt mới. Giữ settings/progress/content v6/schema/models, không migration. Dung lượng tài sản quản lý sau build **5.316.595.302 / 10.000.000.000 bytes** (không tính môi trường phát triển).
- [x] Source cuối qua **build, 27 core/adapter, content checker, kiểm tra manifest 2.035 file / 35.388.602 bytes**, và **7 Edge E2E liên quan**. Ba flow table kiểm tra phát MP3 thật, hover/replay/search, thiếu bản thu, mobile có cảm ứng, keyboard, lỗi/dừng/đổi/điều hướng; bốn flow cũ kiểm tra thiếu voice, Windows TTS, nút nghe và preferences. Không đổi backend code; chỉ chạy kiểm tra tài sản backend, không benchmark Qwen hoặc duyệt lại 72 bài.
- [x] `http://127.0.0.1:8765/#pronunciation` phục vụ build mới. Smoke bản cài phát/dừng MP3 thật, 406 ô, desktop/mobile không tràn trang/page error, toàn bộ state trước/sau giữ nguyên. Kết quả/hình: `data/pinyin-table-installed-smoke.json`, `data/pinyin-table-installed-{desktop,mobile}.png`. Lưu checkpoint local, không push.

Đợt này thay cách nghe của đợt Hanzi-TTS ngay dưới đây theo yêu cầu mới; số 1.441 thiếu mapping bên dưới là lịch sử, không phải độ phủ audio của bảng hiện tại.

## Khôi phục bấm Pinyin để nghe — 28/09/2026

- [x] Giữ 406 ô, tìm kiếm, dấu thanh và ghép chữ; bấm ô/thanh gọi TTS bằng lựa chọn mới, bấm lại phát lại. Mặc định nghe ngay, có bật/tắt, nghe lại, dừng, trạng thái/lỗi ngay cạnh bảng. Không phát khi mở trang hoặc gõ tìm kiếm; không đổi thanh khi thiếu ví dụ. Hủy khi đổi/dừng/rời trang, bỏ qua callback cũ.
- [x] Bảng `public/learning/pinyin/examples.json` độc lập 360 từ giáo trình. Từ danh sách mục từ cốt lõi TBCL, chọn một/hai chữ có phân đoạn Pinyin duy nhất, ưu tiên mục một chữ có một cách đọc trong nguồn rồi cụm ngắn theo cấp. Chỉ đối chiếu tự động mục từ/Pinyin; không coi là giáo viên rà hay chứng minh chữ không đa âm ngoài nguồn này.
- [x] Audit toàn bộ **2.030 tổ hợp**: **589 có ví dụ** trên **302/406 âm cơ sở**, **1.441 chưa có ví dụ**; 376 ánh xạ phát một chữ, 213 phát cụm. Theo thanh: 1=134, 2=128, 3=120, 4=183, nhẹ=24. Cả 589 khớp nguồn từ điển, 0 ánh xạ chưa khớp nguồn; **589 chưa người nghe duyệt TTS**. Thiếu ví dụ không chứng minh tổ hợp bất khả thi. Danh sách khóa thiếu và hash nguồn: [pinyin-coverage.json](pinyin-coverage.json).
- [x] Thanh nhẹ chỉ phát cụm có âm đích/vị trí rõ ràng (ví dụ 爸爸 · bà ba); hiển thị chính xác Hán tự gửi TTS, Pinyin, nguồn và trạng thái kiểm chứng. Không Latin TTS, audio mẫu, nối audio hoặc đổi pitch. Phần thanh/vận mẫu giữ visual-only.
- [x] Source cuối qua build; **26/26 core/adapter**, content checker (18/72/360/36/540), **1 kiểm tra manifest/tài sản** (436 file, 3.447.304 bytes), **7/7 Edge E2E liên quan**. Lệnh E2E: `npm.cmd run test:e2e -- e2e/learning-features.spec.ts e2e/taiwan-voice.spec.ts e2e/app.spec.ts --grep 'grid 406|Pinyin|giọng Windows|nghe cạnh|zh-TW Windows|thiếu'`. Backend code không đổi; không chạy lại benchmark/model/toàn bộ bài. Cảnh báo Starlette/httpx có từ trước, không đổi dependency.
- [x] Ba flow Pinyin gồm gửi Hanzi/giọng/nhịp đã lưu, replay/toggle/tìm kiếm, lỗi/thiếu giọng, thiếu mapping, thanh nhẹ, callback cũ/dừng/điều hướng; giữ nút nghe 一/不 và mobile. Native zh-TW thật trả audio và tiến triển playback cho **八, 爸爸, 女**, nhịp chậm; kiểm tra dừng thành công. Đây là xác nhận phát được, không phải đánh giá phát âm bằng người nghe hoặc ASR.
- [x] Build cuối được phục vụ tại **http://127.0.0.1:8765/#pronunciation**. Smoke bản cài desktop/mobile: 406 ô, ví dụ mới, nghe ngay mặc định, không request ngoài loopback/page error; giọng đã lưu và toàn bộ state trước/sau bằng nhau. Kết quả/hình local: `data/pinyin-installed-smoke.json`, `data/pinyin-installed-{desktop,mobile}.png`.
- [x] Giữ foundation-tw v6, schema, ID, tiến độ, lịch ôn và cấu hình model/voice; không migration, không tải model/dependency hoặc khôi phục bản thu. Nguồn/manifest cập nhật; checkpoint Git local, không push.
- [ ] Còn 1.441 tổ hợp chưa chọn được ví dụ từ phạm vi nguồn này; mở rộng cần đối chiếu nguồn theo mục. Cần người nghe kiểm tra giọng, đa âm/biến điệu và thanh nhẹ; chưa nghiệm thu Windows v1.

## Hoàn tất đợt v6 — 27/09/2026

Kết quả hiện tại: [RELEASE-V6.md](RELEASE-V6.md), [HANDOFF-2026-09-27.md](HANDOFF-2026-09-27.md). Kokoro/audio Pinyin ở các mục dưới là lịch sử đã thay thế.

- [x] Chỉ Qwen 4B, CPU/CUDA kiểm tra thật; giữ Whisper base/small và config 4B/CUDA/small.
- [x] Gỡ 1.7B, Kokoro/runtime/archive, WAV/MP3 Pinyin và hai WAV thử; xóa 3.906.879.800 bytes. Còn khoảng 5,251 GB cho tài sản quản lý.
- [x] 18 chủ đề/72 bài/360 từ/36 grammar/540 bài tập trong bài/144 bài grammar riêng; 424 chữ, 294 cũ giữ byte. ID/nội dung cũ giữ nguyên. B2 vẫn chưa hoàn thành.
- [x] Sửa ba lỗi E2E: chờ lưu/tạm dừng, số câu đầu vào 54, khóa nghe khi lựa chọn giọng đang lưu. Rà/sửa thứ tự chọn lọc năm chữ mới; không tự reorder mọi chữ.
- [x] Build/content checker, 25 core/adapter, 36 backend, **39/39 Edge E2E trên source cuối**; native TTS/cancel và Qwen 4B CPU/CUDA thật qua. Một cảnh báo deprecation Starlette/httpx, không đổi lockfile.
- [x] Nguồn/giấy phép/giới hạn/manifest cập nhật. Audit TBCL 48/120 từ mới khớp mục/Pinyin; giữ draft, không giả giáo viên duyệt.
- [x] Backup `before-v6-20260927-201705.json`, nâng dữ liệu thật v5→v6 qua transaction, giữ nguyên 13 objects/33 events và settings. Edge kiểm tra bản cài thật không ghi dữ liệu học.
- [x] Localhost chạy trên 8765. Checkpoint Git chứa source/tài liệu, không model/runtime/data; không push.

Không còn task triển khai/phát hành trong đợt đã duyệt. Những việc chất lượng dài hạn (giáo viên rà nội dung, nghe giọng thực, mẫu nét nguồn Ja/ghép, toàn bộ B2) vẫn là giới hạn/lộ trình, không được ghi đã đạt Windows v1.

Cập nhật 25/09/2026. Không coi số lượng bản nháp hoặc test tự động là chứng nhận nội dung/audio. Các con số kiểm thử của mốc 23–24/09 bên dưới là lịch sử; kết quả đợt mới nằm ở phần này.

## Phản hồi giọng đọc và giao diện Phát âm — tiếp nối checkpoint def42b5

- [x] Theo chấp thuận của người dùng, thêm 3 giọng Kokoro v1.1 neural offline (2 nữ/1 nam), ghi Quan thoại phổ thông/chưa xác minh Đài Loan. Nghe so sánh cùng câu, chọn áp dụng/lưu giọng cho toàn app; nghe thử không đổi settings. Giữ browser/native zh-TW, Qwen4B/CUDA và Whisper small/base. Windows Traditional Chinese cung cấp giọng local, không tự nâng chất lượng giọng legacy.
- [x] Dùng bộ chạy sherpa-onnx 1.13.8 standalone CPU, không cài dependency Python/global. Kiểm tra SHA-256 download, manifest file cài đặt, ngân sách/disk/path. Nguồn/giấy phép và số đo ở NEURAL_TTS.md; có bản Apache/MIT/GPL/ThirdPartyNotices local, không commit model/runtime.
- [x] Tạo WAV cả câu, cache RAM giới hạn 16 MB/48 mục theo giọng/nhịp/câu, một lượt tổng hợp đồng thời, hủy và dọn file tạm. Đã phát hiện/sửa disconnect thật không được polling bắt qua middleware; dùng ASGI receive, đo child thoát sau 61 ms. Không thay giọng âm thầm khi lỗi/thiếu.
- [x] Grid 406 âm Pinyin hiển thị trực tiếp thay dropdown thanh/vận mẫu, tìm nhanh, nghe ngay tùy chọn; desktop grid cạnh phần nghe, mobile không tràn. 6 nhóm quy tắc giữ 11 ID cũ/nhận xét, 一 và 不 mỗi chữ một mục.
- [x] Benchmark thật 12 WAV: 3 neural + Hanhan × 3 câu Phồn thể, neural 4,510–6,647 ms gồm nạp model, WAV 24 kHz; cache ~0,5 ms ở ba câu thử. ASR raw 4 câu lưu nguyên trạng; nam 009 có 越南 → 岳南. Không chứng nhận độ tự nhiên, biến điệu hay giọng Đài Loan. Lexicon có 294/294 chữ, không suy ra đọc đúng từ đa âm.
- [x] Source cuối: build, content checker, core/adapter **25/25**, backend **21/21**, Edge E2E **31/31 trong một lượt đầy đủ, 2,5 phút** qua. Gồm hủy tiến trình neural thật trước khi phát câu khác, nghe thử/áp dụng/reload và mobile. Một lượt trước có 30/31 do selector trạng thái trùng, đã sửa; sau sửa disconnect thật đã chạy lại toàn bộ. Backend giữ một warning deprecation Starlette/httpx từ dependency đã khóa.
- [x] Backup thêm `data/backups/before-voice-update-20260925-181553.json`. State cá nhân trước/sau sửa và khởi động lại bằng nhau: **12 object / 20 sự kiện**, SHA-256 `3e1e2f82248cbdcd2c45d1253e3c5a795709aa324823e495b2d4752d0034028e`. Gói vẫn v5, không nâng lại hoặc restore. Chênh số object/event so với mốc bốn tính năng là tiến độ người dùng đã có trước lần sửa giọng.
- [x] Localhost 8765 chạy source/build mới bằng launcher ẩn. Tổng tài sản đo **9.124.705.305 / 10.000.000.000 byte**, gồm archive tải về, model, runtime, data/cache/backup, public/dist/content; dữ liệu có thể tăng khi học. Vẫn không tính môi trường phát triển.
- [ ] Người dùng nghe so sánh và chọn giọng phù hợp; chưa có đánh giá nghe chuyên môn. 30 câu TTS nghe duyệt, micro thật và buổi hội thoại giọng 15 phút vẫn còn thiếu. Giữ các hạn chế B2/nội dung/ASR dưới đây.

## Đợt bốn tính năng — hoàn tất triển khai và kiểm thử

- [x] Animation 294/294 chữ; chọn chữ, chạy một lần/phát lại/tạm dừng/từng nét/chậm, reduced motion; cấu tạo ẩn trước nộp/gợi ý. Bộ thủ 23 chữ bổ sung đối chiếu MOE; sửa IDS 局/常 và 研 = 石 + 开. Bổ sung bản quyền/ngày/cách sửa từng JSON, giấy phép local. Xem STROKE_SOURCES.md; chấm viết tay vẫn 12 mẫu.
- [x] Ghép Pinyin 406 âm tiết; 37 WAV thành phần MOE, 1.598 mẫu thanh 1–4 được tham chiếu. Audio thật local, dừng ngay khi đổi âm/route; regression lỗi phát muộn không làm hỏng lượt mới. 26 tổ hợp thiếu và thanh nhẹ báo giới hạn đúng.
- [x] Route bài theo ID, chuyển bài/chủ đề từ tổng kết, cuối lộ trình tới ôn; reload/Back và phiên dở/tổng kết được giữ.
- [x] Tab Ngữ pháp: 24 ID cũ, 72 ví dụ khác nhau, 96 bài tập, nguồn/giới hạn/biến thể; lưu tiếp tục/gợi ý kể cả reload, sổ lỗi và tiến độ riêng. Không tự đổi FSRS/số bài nền tảng. Có link tiên quyết.
- [x] Lộ trình biên soạn B2: 4 nhóm, 12 chủ điểm, 27 lô có mục tiêu/tiên quyết/cấp nguồn; 496 mục tham chiếu lọc theo nhóm/cấp/lô/từ khóa. Tất cả lô vẫn ghi chưa biên soạn đầy đủ. Không quy đổi TBCL sang CEFR.
- [x] Source cuối ngày 25/09: `npm.cmd run build`, `npm.cmd run content:check`, `npm.cmd test` **23/23**, `.venv\Scripts\python.exe -m pytest -q` **18/18**, `npm.cmd run test:e2e` **29/29 trong một lượt đầy đủ, 2,3 phút**. Lượt trước cũng 29/29 nhưng source được sửa thêm rồi mới chạy lại toàn bộ. Backend có một cảnh báo Starlette/httpx deprecation; chưa thay dependency đã khóa.
- [x] E2E đi cả 48 bài; media fixture có nhãn TEST, native Windows TTS tạo WAV thật, Pinyin phát WAV/MP3 thật. Chặn mạng ngoài loopback trong các ca offline; desktop/mobile không tràn ngang. Kiểm tra âm thiếu, dừng audio, gợi ý sau reload, navigation/resume, tiên quyết và filter. Xem hình tại `test-results/` (có thể bị lượt sau thay thế).
- [x] Manifest SHA-256/bytes kiểm tra **1.975 file / 40.741.100 byte** tài sản, chưa tính manifest; Git giữ byte tài sản qua `.gitattributes`. Build copy đủ tài sản sang dist. Không tải lại model hoặc tạo venv.
- [x] Sau backup/nâng gói, `/api/status` đo **8.270.310.936 / 10.000.000.000 byte** (~8,270 GB): models 6.074.669.223; runtime 2.029.697.983; data 82.364.492; dist 41.451.250; content 1.043.190; public 41.084.798. Data gồm cache/E2E/backup và có thể tăng khi học. Không tính môi trường phát triển `.venv`/`node_modules` theo PLAN.
- [x] Backup API `data/backups/before-v5-20260925-125640.json`, nâng v4 → v5 qua `/api/packages`. **Toàn bộ state trước/sau bằng nhau: 10 object, 17 sự kiện**; hash state `e3002e2effb27d3fc579ab438edcc49c6bbaa93b1b0a41f8be91ea1736edccba`. Báo cáo local `data/backups/upgrade-v5-20260925-125640.json`; bản gói cũ `data/previous-package.json`. Không restore dữ liệu cá nhân để test.
- [x] Localhost `http://127.0.0.1:8765` phục vụ build mới/gói v5. Script nâng gói `scripts/upgrade_bundled.py` mặc định chỉ đọc; `--apply` backup rồi gọi transaction, từ chối khi version không mới hơn. Bốn helper tích hợp một lần đã lưu vào `data/archived-integration-2026-09-25/`, không chạy lại.

## Phần cần tiếp tục sau đợt này

- [ ] Nghe duyệt toàn bộ MP3, xác minh vùng giọng, bổ sung 26 tổ hợp thiếu và bộ thanh nhẹ ngữ cảnh khi có nguồn phù hợp; không thay ngầm bằng TTS.
- [ ] Người dạy rà dáng/thứ tự/hướng 294 chữ, ưu tiên 23 chữ bổ sung và bốn mẫu ghép. Agent đã xem bảng hình tĩnh; không coi đó là giáo viên duyệt. Chưa mở rộng chấm viết tay.
- [ ] Rà ngôn ngữ 24 mục/72 ví dụ/96 bài tập và nội dung nền tảng cũ theo từng mục; `ready` chỉ xác nhận đủ cấu trúc. Biên soạn tiếp từng lô B2 đầy đủ và đánh giá nghe/nói/đọc/viết; danh mục không được tính là bài đã hoàn thành.
- [ ] Giữ các hạn chế AI/TTS/ASR, yêu cầu giọng người thật và tiêu chí Windows v1 bên dưới; ASR không chấm phát âm. Android/sync không thuộc đợt này.

## Đã chạy được

- [x] Đúng Git root; đọc toàn bộ PLAN; giữ .venv và tool tương thích.
- [x] React/TypeScript/Vite build, FastAPI cùng origin, SQLite WAL migration v1, launcher Start.cmd.
- [x] Nội dung có ID, schema, SHA-256, phiên bản; cập nhật transaction, giữ ID và tiến độ.
- [x] Bài học nhiều dạng, lớp hiển thị, gợi ý có đánh dấu, retry câu sai sau các câu xen kẽ, lưu/tạm dừng/tiếp tục.
- [x] Ôn FSRS 5.4.2 nhiều hướng, phím tắt an toàn với IME; luyện tự do không đẩy lịch.
- [x] Sổ lỗi, đầu vào 36 câu, thống kê, tra gói, ghi chú, thẻ cá nhân/nhãn/bộ thẻ/tạm ngưng, nhập/xuất JSON.
- [x] Sao lưu/phục hồi JSON; transaction, kiểm tra dữ liệu, giữ bản trước phục hồi. Sự kiện chống trùng và CAS hai tab.
- [x] Gói bản nháp 12 đơn vị / 48 bài / 240 mục từ / 24 ngữ pháp / 360 bài tập, qua schema checker.
- [x] Hội thoại local, ghi âm/nghe lại/ASR/sửa transcript, góp ý viết, hủy LLM, dừng audio, giải phóng model. Tình trạng thiếu model/voice hiển thị thật.
- [x] 30 lượt Qwen 1.7B CPU và 30 lượt Qwen 4B CUDA. Đã chọn 4B/CUDA thử nghiệm; chất lượng chưa đạt gia sư. Không có download đang chờ.
- [x] Soak chat chữ 15 phút hoàn tất: 28/28 HTTP 200, elapsed_seconds=900.0. Hủy thật trong lúc nạp model, chạy lại và unload thành công; xem benchmark-runtime-recovery.json.
- [x] Phát hiện Hanhan Desktop và ba giọng zh-TW local trong Edge ở lần kiểm tra lại. Native TTS và Whisper thật chạy 40 đoạn tổng hợp trước/sau thay ngữ cảnh ASR; không coi là micro/đánh giá nghe của người thật.
- [x] Thử Whisper trên im lặng: phát hiện hallucination; đã thêm cổng RMS, có regression test.
- [x] 12 mẫu nét 一 二 三 十 人 大 小 日 月 口 上 下, đủ chữ chọn lọc của 12 đơn vị. Tô/nhạt/tự nhớ, hoạt hình theo đường đi, kiểm tra nét xiên/gấp/móc. Đối chiếu thứ tự và hướng với MOE; hình học tự soạn, không chấm thư pháp.
- [x] Sửa lỗi lưu sự kiện nét theo chữ mặc định thay vì chữ người học chọn; đổi chủ đề cập nhật chữ đúng. Sửa nhãn/tài liệu lỗi encoding tiếng Việt.
- [x] Build và content checker qua. Backend 11 ca, core/adapter 14 ca qua. Edge 21 ca đã qua: 20 ở lượt toàn bộ; ca voice native được sửa cách đọc body WAV trong automation và chạy lại riêng thành công. Không sửa kết quả thô để giấu lần test lỗi.
- [x] E2E chạy cả 48 bài/12 đơn vị; gồm đường bỏ qua nghe, không giả là đã nghe đúng. Test riêng native voice nhận WAV thật, phát tiến triển rồi dừng. Bản ghi micro giả chỉ ở test có nhãn TEST.
- [x] Browser test chặn request ngoài loopback: không có request ngoài; desktop/mobile không tràn ngang.
- [x] Start.cmd khởi động từ đường dẫn có khoảng trắng, health 8765 chạy được, dữ liệu v4 được giữ sau khi dừng/mở dịch vụ. Dịch vụ hiện được mở bằng launcher.

## Đang làm / chưa đạt

- [ ] AI 4B vẫn sai Pinyin/dịch và đôi lúc Phồn thể; ASR vẫn nhận nhầm chữ. Giữ nhãn thử nghiệm, sửa transcript thủ công và không dùng AI làm đáp án bài đóng.
- [x] Người dùng đã ngắt Internet, sửa câu mới nghe được; ghi âm và nghe lại được. Đây là xác nhận thiết bị/offline cơ bản, không phải xác nhận ASR hoặc biến điệu đạt chuẩn.
- [ ] Người dùng báo ASR sai, lặp câu gợi dẫn; đã bỏ --prompt và thêm regression test. Giọng TTS bị nhận xét rời từng âm; đã thêm giọng/nhịp và bộ nghe 11 ca. Cần thu lại câu thật sau cập nhật, nghe đánh giá biến điệu và tiếp tục bộ 40 đoạn người thật/30 câu TTS/buổi chat giọng 15 phút.
- [ ] Chưa đối chiếu toàn bộ 240 từ/24 ngữ pháp/360 bài: 5 từ có source-checked, 235 draft (2 trong số này đã đối chiếu một phần âm). Chưa có giáo viên duyệt/audio được nghe duyệt.
- [ ] 294 chữ đã có animation và 12 chữ có chấm viết tay chọn lọc; chưa kiểm chứng toàn bộ dáng chữ bằng người dạy.
- [ ] Chưa đo riêng TTFT hoặc mọi thao tác <200 ms. Bảng latency hiện là thời gian toàn bộ kết quả; không suy ra đạt mục tiêu TTFT.
- [ ] Chưa triển khai Android, Wi-Fi sync hoặc chương trình B2 đầy đủ; đã có lộ trình biên soạn theo nhóm.

## Tiếp tục sau gián đoạn

### Sửa theo phản hồi nghe/nói

- Nút nghe cạnh Hán tự/Pinyin, câu hỏi có chữ, đáp án và các lớp hiển thị. Không đưa audio đáp án vào câu hỏi Pinyin trước khi nộp.
- Mục Phát âm gồm 11 ca: thanh 3, 一/不, thanh nhẹ, đa âm, nhịp câu. Phiên âm cơ sở tách khỏi ghi chú đọc liền. Nhận xét người học lưu local theo cấu hình.
- Chọn giọng zh-TW local và nhịp chậm/thường/nhanh nhẹ, mặc định thường; native bridge nhận voice/rate đã kiểm tra.
- 14 backend tests, 16 core/adapter tests qua. 23 Edge tests đã qua trên các lượt: 21 ca cũ trong lượt toàn bộ, ca nút nghe/cấu hình/nhận xét sau khi sửa fixture SpeechSynthesisUtterance (fixture ban đầu dùng voice giả với lớp native nên bị từ chối kiểu), và ca đổi ASR cập nhật thông tin model. Lượt kiểm tra cuối chạy lại 3 ca liên quan audio/ASR, đều qua.
- Tạo WAV thật cho 11 câu nghe mới; silent gate qua. Whisper small tải chính thức, xác minh SHA-256, so sánh cùng 12 WAV với base. Đã chọn small cho lượt thử thật tiếp theo: sửa được nhiều từ bị base nhận sai, nhưng chậm hơn (~3.063 s median) và trả Giản thể nhiều hơn. UI đổi base/small trong Cài đặt. Tổng dung lượng ~8.107 GB. Câu tổng hợp giới thiệu bản thân qua API small trả đúng chữ; chưa có bản ghi micro để xác minh bản sửa.

1. Kiểm tra tiến trình/download đang chạy; models/runtime/data đều gitignored. Không tải lại tài sản đã có hash đúng.
2. Đọc docs/DECISIONS.md và benchmark JSON. Cấu hình đã chọn Qwen3-4B Q4_K_M/CUDA, Whisper small/CPU (base thay thế), Windows zh-TW với lựa chọn voice/nhịp; không cài lại voice/model đã có.
3. Build/test sau thay đổi; cập nhật gói qua API khi version tăng, không xóa database.
4. Tiếp tục đối chiếu nội dung và bài đọc/đáp án theo ngữ cảnh; làm cùng người dùng ở bước nghe/micro/offline. Nghiệm thu theo 10 tiêu chí PLAN, giữ trạng thái chưa đạt nếu còn thiếu.
