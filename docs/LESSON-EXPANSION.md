# Mở rộng bài học theo quy tắc và nhiệm vụ — 07/11/2026

## Cập nhật 09/11/2026

Đã thay bộ vận dụng mới bằng 400 câu riêng (40 × 10), không dùng lại nguyên ví dụ để đủ số. Nguồn `content/expansion_application_authoring.py` → `scripts/build_expansion_application.py` → `src/core/expansion-application.json`. Giữ giải thích/thẻ từ/cơ chế tra từ và mọi snapshot cũ; người học mở lượt mới để nhận bộ mới. Phần mô tả giữ câu gốc ngày 08/11 bên dưới là lịch sử. Ôn chủ đề mới dùng ngân hàng riêng, xem [MOBILE_SENTENCE_REVIEW](MOBILE_SENTENCE_REVIEW.md).

## Mục tiêu và phạm vi đã triển khai

Theo yêu cầu người dùng: mở rộng **cả 18 chủ đề**, ưu tiên nghiên cứu và thiết kế bài; kiểm tra tập trung, không benchmark AI. Giải quyết việc có danh sách từ nhưng thiếu cách ghép và dùng kiến thức, điển hình là biết 一–十 nhưng chưa đọc được 37 hoặc 105.

Thêm **40 bài / 400 câu vận dụng** (cập nhật 08/11 từ 126 câu): Số và thời gian có 6 bài; 17 chủ đề còn lại mỗi chủ đề 2 bài. Tích hợp ngay trong thẻ chủ đề dưới nhãn **Quy tắc & vận dụng**. Phần 5 dẫn tiếp vào bài bổ sung, các bài mới nối nhau rồi tới chủ đề tiếp theo. Các bộ 15 câu hiện có đổi nhãn thành “Ôn bài nền tảng” để không ngụ ý đã bao phủ phần mới.

Mỗi bài có mục tiêu sử dụng, gợi ý kiến thức nên biết trước, cụm từ hỗ trợ với Hán tự/Pinyin/nghĩa Việt, hai phần giải thích quy tắc kèm ví dụ, chỗ dễ nhầm, 10 câu nhận biết/điền/nghe và nguồn có địa chỉ cụ thể. Bài số có thêm câu tự ghép một số chưa nằm nguyên dạng trong ví dụ. Câu điền có ràng buộc nghĩa hoặc vị trí; không dùng chấm khớp mẫu để đánh giá viết tự do.

Ngày 08/11: giữ nguyên 3–4 câu gốc và ID, bổ sung đọc hiểu + điền phần thiếu theo các ví dụ đã biên soạn; 400 câu là số nhiệm vụ, không phải 400 câu tiếng Hoa mới. Không tạo Pinyin/dịch hoặc câu Hoa mới bằng thuật toán. Mọi lượt mới đóng băng 10 câu; lượt cũ giữ nguyên snapshot, có nút mở lượt 10 câu riêng. Từ vựng dùng StudyCard (nghe, đánh dấu đã học, flashcard, xem chữ); ví dụ/đáp án/đề dùng StudyText và hộp tra từ hiện có. Từ bổ sung của bài ưu tiên trước ngân hàng chung, khớp cụm dài trước; chỉ các mục có dữ liệu đóng gói mới có nút tra. Tra trong đề trước khi nộp ghi assisted; không hiển thị đáp án trước khi nộp/xin trợ giúp.

Không đặt số từ mới cố định cho từng bài, không sinh hàng trăm mục từ chỉ để liệt kê các con số, không gọi AI sinh câu trong phiên học. Đây là Hoa ngữ Đài Loan (Taiwan Mandarin), không phải tiếng Đài Loan Hokkien.

## Nghiên cứu làm căn cứ

Đã đọc trực tiếp các nguồn sau ngày 07/11/2026. Chỉ tham khảo nguyên tắc, nhãn ngữ pháp và cách đọc; không đóng gói giáo trình, ảnh trang sách hay audio của bên thứ ba.

1. [NAER — ngữ pháp nền tảng, trang 1](https://coct.naer.edu.tw/grammar.jsp): có riêng **稱數法**, **時間表達**, số + lượng từ. Vì vậy số ghép và thời gian phải là nội dung dạy tường minh, không chỉ ví dụ trong từ vựng.
2. NAER [trang 2](https://coct.naer.edu.tw/grammar.jsp?page=2), [trang 3](https://coct.naer.edu.tw/grammar.jsp?page=3), [trang 4](https://coct.naer.edu.tw/grammar.jsp?page=4), [trang 5](https://coct.naer.edu.tw/grammar.jsp?page=5), [trang 6](https://coct.naer.edu.tw/grammar.jsp?page=6): đối chiếu các chức năng như thứ tự, thời lượng, khả năng/xin phép, trải nghiệm, vị trí, yêu cầu, trước/sau, khoảng thời gian, lựa chọn và mức độ. Cấp nguồn không được tự quy đổi sang CEFR hoặc biến thành chứng nhận cho bài dự án.
3. [NTNU/MTC — nguyên tắc 當代中文課程, tr. 1–3, 5–8](https://mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/1.pdf): định hướng giao tiếp và nhiệm vụ; chọn ngôn ngữ dùng ở Đài Loan; liên hệ loại từ với cách dựng câu. Dùng để tránh ghép máy móc như đặt người ngay sau 見面.
4. [NTNU/MTC — đối chiếu chủ đề và ngữ pháp, tr. 1–7](https://mtc.ntnu.edu.tw/upload_files/resource/download/Contemporary-Chinese/4.pdf): tham khảo trình tự dạy số lớn, mốc/thời lượng, thời gian trước động từ, 先…再…, phủ định, quan hệ nơi chốn và kết quả hành động. Không sao chép thứ tự nguyên chương hay bài tập sách.
5. [OCAC — thiết kế 來！學華語](https://newhuayuworld.ccdntech.com/Ebook/Ebook/LearnMandarin): tham khảo cách tổ chức theo nhu cầu giao tiếp người lớn, lượng kiến thức vừa phải và hoạt động sử dụng ngay. Các bối cảnh mua sắm, biểu mẫu, gửi bưu kiện do dự án tự soạn, không được ghi là câu trích của OCAC.
6. MOE giản biên: [星期](https://dict.concised.moe.edu.tw/dictView.jsp?ID=28118) ghi **xīng qí**; [誰](https://dict.concised.moe.edu.tw/dictView.jsp?ID=34016) ghi **shéi**; [兩](https://dict.concised.moe.edu.tw/dictView.jsp?ID=14994) ghi **liǎng**. Đây là đối chiếu mục từ cụ thể, không phải xác minh toàn bộ Pinyin của 40 bài.
7. [MOE — 再](https://dict.revised.moe.edu.tw/dictView.jsp?ID=9505): đối chiếu nghĩa bước tiếp theo trong kết cấu 先…再…. Không dùng các ví dụ cổ của từ điển này làm mẫu giao tiếp nhập môn.

Quy tắc trong ứng dụng là diễn giải tiếng Việt và ví dụ tự biên soạn. Nguồn tham khảo hỗ trợ lựa chọn/giải thích ngôn ngữ, không có nghĩa NAER, MOE hoặc NTNU đã duyệt sản phẩm. Giữ trạng thái **bản nháp, chưa giáo viên thẩm định**, kể cả khi kiểm tra dữ liệu qua.

## Ma trận 18 chủ đề: khoảng thiếu và phần bổ sung

| Chủ đề | Khoảng thiếu khi rà gói hiện có | Bài bổ sung và mục tiêu |
|---|---|---|
| Chào bạn, Đài Loan! | Từ chào và 是/什麼 chưa đủ duy trì đối thoại | Giới thiệu rồi hỏi lại: 姓/叫, quốc tịch, 呢/也; hỏi lịch sự và đáp cảm ơn/xin lỗi |
| Số và thời gian | Có 零–十、兩、百、點/分/半 nhưng thiếu bài hệ thống số ghép, lịch và mốc tương đối | Sáu bài chi tiết bên dưới |
| Một bữa ăn ngon | Tên món và lượng từ chưa thành giao dịch gọi món | Gọi món/suất và 內用/外帶; khẩu vị, ít đường/đá, không thêm thành phần |
| Đi chợ và mua sắm | Hỏi giá chưa đủ tính tổng, chọn món/cỡ và thanh toán | Đơn giá/tổng tiền, tiền mặt/thẻ; màu, lược danh từ với 的, cỡ lớn hơn một chút, xin thử |
| Đi một vòng thành phố | Có phương tiện và trái/phải nhưng thiếu chuỗi chỉ dẫn | Hỏi điểm đầu–đích, đi thẳng/rẽ; lên/xuống/chuyển xe, mốc giờ so với thời gian đi |
| Những người thân quen | Tên thân nhân chưa đủ tự giới thiệu một gia đình | Số thành viên/quan hệ lớn nhỏ/都; tuổi, cách hỏi phù hợp và nghề nghiệp |
| Một góc để ở | Trong/ngoài/vị trí đồ vật và yêu cầu sinh hoạt còn ít | Đồ vật + 在 so với nơi + 有; miêu tả phòng, nhờ bật/tắt thiết bị |
| Lịch học của tôi | 星期 và 從…到… cần vận dụng với lịch tuần thật | Thứ–buổi–giờ, 每週, thời lượng; hỏi rảnh, đề xuất đổi mốc và xác nhận |
| Xin hỏi một chút | Nhiều từ hỏi nhưng thiếu chọn theo loại thông tin | Ai/đâu/khi nào/cách nào; nghe không hiểu, nhắc lại, đọc từng chữ số và xác nhận |
| Trong lớp học | Chưa phân biệt rõ các khó khăn và yêu cầu bài tập | Nghe không rõ/không hiểu/chưa biết viết; thứ tự thao tác, bài thứ mấy, hạn nộp |
| Một ngày thường | Từ sinh hoạt chưa tạo được chuỗi kể nhất quán | Tần suất và trước/sau; đang làm/đã làm/chưa làm |
| Bước vào đại học | Từ thư viện/email/hẹn gặp cần tình huống kết nối | Mượn/trả và thời hạn; gặp giảng viên qua 跟…見面, gửi và xác nhận nhận tài liệu |
| Sức khỏe và đi khám | Thiếu diễn đạt rõ triệu chứng và câu hỏi làm thủ tục | Bộ phận, mức độ, lúc bắt đầu; đăng ký, có/quên mang giấy tờ, hỏi lại chỉ dẫn dùng thuốc |
| Thuê nhà và sửa chữa | Danh sách khoản phí chưa giúp hỏi giá đã bao gồm gì | Chu kỳ thuê/cọc/phí riêng; mô tả đồ hỏng, hẹn sửa và chưa sửa xong |
| Dịch vụ đời sống | Thiếu hoàn chỉnh nhiệm vụ gửi/nhận và điền mẫu | Người gửi/người nhận, đích, phí gửi; nhãn biểu mẫu, bản chính/bản sao, thứ tự thao tác |
| Công việc và lịch hẹn | Cần mẫu báo tình trạng thay vì chỉ từ công việc | Lý do xin nghỉ/đổi họp; đang chuẩn bị, đã hoàn tất, còn chưa kiểm tra |
| Du lịch và trải nghiệm | Cần phân biệt số phòng/người/đêm và kế hoạch có điều kiện | Đặt phòng theo ngày, nhận/trả; từng/chưa từng, thời tiết và 如果…就… |
| Giao tiếp xã hội | Chưa đủ lời đáp duy trì tương tác | Mời/nhận lời/từ chối và dịp khác; hỏi chọn A/B, ưu tiên và bất đồng nhẹ |

Nguồn cụ thể và nhãn chức năng nằm trong `references` của từng bài, hiển thị trong mục nguồn tại giao diện. Không gán một nguồn tổng quát cho tất cả các câu như thể đã được nguồn đó kiểm chứng.

## “Số và thời gian”: sáu bước

1. **11–99:** 十 + đơn vị; chục + 十 + đơn vị; 12 khác 20; chục tròn không đọc 零 cuối. Bài vận dụng yêu cầu tự tạo 37 và 16.
2. **Trăm/nghìn:** hàng lớn đến nhỏ; 零 nối qua hàng khuyết; phân biệt 105/150; 千 và 萬; đọc đủ hàng để tránh cách rút gọn mơ hồ. Bài chấp nhận 二百三十 và 兩百三十.
3. **二/兩:** số ghép, thứ tự, tháng khác hai đơn vị và 2 giờ; 22 vẫn là 二十二, không thay mọi 二 bằng 兩.
4. **Giờ–phút:** buổi + giờ + 點 + phút + 分; phút một chữ số, 半; phân biệt 兩點 và 兩個小時. Không bắt người dùng chỉ theo một biến thể khi 兩點八分 và 兩點零八分 đều phù hợp.
5. **Lịch:** đủ thứ Hai–Chủ nhật (星期一–六, 日/天), tháng 1–12 và thứ tự năm–tháng–ngày; 號/日; đọc năm từng số; câu hỏi ngày/thứ.
6. **Mốc tương đối:** 上個月 shàng ge yuè / 這個月 zhè ge yuè / 下個月 xià ge yuè; tuần trước/này/sau; hôm qua/nay/mai; năm ngoái/nay/sau; đặt thời gian trước hành động.

Pinyin của 一/不 trong phần mới dùng thanh cơ sở; giao diện giải thích đây không phải bản ghi chính xác mọi biến điệu khi đọc liền. Giọng zh-TW local cũ được giữ; không phát Latin Pinyin và không nhận playback thành chứng nhận phát âm.

## Tích hợp và bảo toàn dữ liệu

- Nội dung TypeScript tự chứa, đóng cùng frontend như các supplement hiện có. Không nâng gói foundation v8, không thay 72 ID bài gốc hoặc SQLite schema 1.
- ID bài `expansion:v1:<topic>:<key>`; câu có hậu tố `qN`. Nếu sau này thay ý nghĩa câu, cần version/ID mới hoặc giữ snapshot trước.
- Lượt học `sessions/<lesson-id>:run:<uuid>`: lưu snapshot cả bài, câu, đáp án, thứ tự, trạng thái gợi ý và bản nháp. Học lại tạo lượt mới, giữ kết quả cũ. Không có migration hay tự hoàn thành bài mới từ dấu hoàn thành bài cũ.
- Draft ghi theo hàng đợi với CAS. Mở lại trang đợi lượt ghi đang chờ rồi tải state mới. Khi xung đột ngừng ghi và giữ câu trả lời để sao chép, không ghi đè tab khác.
- Nộp câu dùng event + mutation trong transaction có action key theo lượt/câu. `kind=practice`, `correct=null` ở event chung; kết quả bài đóng nằm trong snapshot. Không sửa điểm Học hoặc lịch FSRS, không tự tạo thẻ.
- Thêm flashcard là thao tác chủ động qua nút đã có; Android nhận các thẻ đó theo luồng sync hiện có. APK không được thay đổi để chứa các bài mở rộng.
- Khi hoàn tất lượt, chỉ lời giải của câu thực sự trả lời đúng mới trở thành bằng chứng câu đã học trong `writingKnowledge`. Ngân hàng viết câu nhận các câu trọn mới, yêu cầu đã luyện đúng; chỉ xem intro hoặc bỏ qua câu không mở khóa toàn bộ từ/ngữ pháp.
- Các bài/lượt nền tảng cũ, lịch sử phần 5 và bộ ôn chủ đề 15 câu vẫn dùng hợp đồng cũ. Bộ ôn 15 câu chưa được biên soạn lại cho toàn bộ kiến thức mở rộng; từng bài mới đã có phần vận dụng/xem lại riêng.

## Kiểm tra và giới hạn

Cập nhật kết thúc 08/11/2026: build bản cuối qua; Edge E2E chạy lại qua sau bổ sung ca điều hướng phần 5 → bài mở rộng. Kiểm tra diff không có lỗi whitespace. Lượt xét duyệt hết hạn mức trước khi gián đoạn đã được giải quyết khi tiếp tục; không còn build đang chờ.

- Build TypeScript/Vite qua; còn cảnh báo bundle lớn vốn có. Chưa tối ưu chia bundle trong đợt nội dung này.
- 3 kiểm tra mới: bao phủ đúng 18 chủ đề/40 bài, trường Hán tự/Pinyin/nghĩa và tham chiếu; snapshot tất cả bài qua validator Python thật; ca số/thời gian, bảo toàn lịch sử và điều kiện kiến thức. Cộng 3 kiểm tra `learnedWriting` liên quan: **6/6 qua** khi chạy trực tiếp Vitest đúng hai file.
- 1 Edge E2E trên port 8767/data/e2e qua: đủ 40 liên kết, giới thiệu quy tắc, đáp án không lộ trước nộp, lưu/reload/đổi tab, gợi ý bền vững, nghe chưa phát không được nộp là đã nghe, bỏ qua, kết quả, học lại giữ snapshot cũ, giữ bài gốc/thẻ, giao diện 390px. Đã xem ảnh desktop/mobile.
- Lệnh `npm test -- <hai file>` ban đầu vẫn khớp cả `src` vì script package đã có `vitest run src`: thực tế 48/49 ca qua. Một ca cũ `studyV8.test.ts` lỗi độ phủ tra từ chữ 格 trong câu `請先填表格，再到這個櫃臺付款。`. Các file gói/lookup và test đó không đổi trong đợt này; không sửa hoặc bỏ test để báo xanh. Đã chuyển sang gọi trực tiếp Vitest khi cần chọn file.
- Không benchmark AI, không thử micro, không nghe duyệt 40 câu TTS bằng người có chuyên môn, không chứng nhận giáo trình đạt toàn bộ A1/A2/B2. Không có kiểm tra tự động nào chứng nhận ngữ pháp/ý nghĩa tiếng Việt đúng hết. Các câu nói/viết tự do và đánh giá năng lực toàn diện vẫn cần đợt riêng.
- Bài mới đã build vào `dist`. Khi app đang mở, tải lại để nhận frontend; khởi động lại bằng `Start.cmd` để nạp validator backend mới. Không push/deploy, không thay cấu hình global hay model.
