# Quy tắc nội dung

## Phạm vi và trạng thái

Gói foundation-tw v4 có 12 chủ đề, 48 bài, 240 mục từ, 24 điểm ngữ pháp, 360 bài tập. Có 5 mục từ đã đối chiếu chữ, Pinyin và nghĩa cơ bản với MOE: 先生、太太、名字、朋友、星期; xem content/source_checks.json. 235 mục còn là **bản nháp do AI hỗ trợ**, trong đó 麻煩 và 不客氣 mới đối chiếu một phần âm đọc. Tất cả ngữ pháp/bài tập/audio chưa được giáo viên duyệt. Trạng thái được hiển thị theo từng mục; không gán cấp TBCL/CEFR/TOCFL chưa được chứng minh.

Nội dung nằm trong content/seeds.py, bộ tạo scripts/build_content.py. Không sửa ID bằng vị trí dòng: từ dùng slug chủ đề + mã Unicode, bài/grammar/exercise dùng khóa cố định. Khi thay nội dung không tái sử dụng ID cũ cho nghĩa khác.

## Chữ, Pinyin và nghĩa

- Phồn thể; ưu tiên từ Đài Loan như 捷運、公車、計程車、便利商店、網路. Không dùng chuyển Giản thể hàng loạt làm bước duyệt.
- Mục từ đơn thường dùng thanh từ điển; cụm/câu có thể ghi biến điệu 一/不 theo ngữ cảnh. Ví dụ 一 yī, 一杯 yì bēi, 一個 yí ge; 不 bù, 不要 bú yào. Thanh ba liên tiếp giữ Pinyin từ điển (nǐ hǎo), cần giải thích biến điệu khi dạy nói. Đây là quy tắc hiện tại, cần rà soát toàn gói.
- Thanh nhẹ không dấu; bài Pinyin hỗ trợ số 0/5 và v/u: thay ü. Chuẩn hóa NFC, chữ thường, khoảng trắng/dấu câu; giữ sai thanh, giữ phân biệt u/ü. Không coi Pinyin là đáp án Hán tự.
- Pinyin/Việt là theo từ/cụm/câu, không tự tách mỗi Hán tự thành một từ. Dịch Việt do dự án soạn, không sao chép định nghĩa từ điển.
- Ba lớp show/tap/hide và Pinyin new. “Từ mới” hiện nghĩa là chưa có thẻ của chữ đó được ôn lần nào. Câu hỏi chỉ đưa stimulus cần thiết; câu trả lời/transcript bị ẩn đến khi nộp hoặc chọn gợi ý. Gợi ý ghi assisted.
- Bài đóng dùng đáp án biên soạn; ngoài tập đáp án được ghi sổ lỗi để xem lại, không tuyên bố mọi biến thể khác đều sai ngôn ngữ. Bài mở/nói không chấm đúng/sai.

## Nguồn và tài sản

Nguồn để đối chiếu tiếp: [MOE từ điển giản biên](https://dict.concised.moe.edu.tw/), [MOE nét chữ](https://stroke-order.learningweb.moe.edu.tw/), [TBCL](https://bcoct.naer.edu.tw/TBCL/), [TOCFL](https://tocfl.edu.tw/tocfl/index.php/teach/download). Đã mở các trang nguồn; chưa được gọi việc này là đối chiếu 240 mục.

Không đóng gói ảnh/audio/định nghĩa từ các trang trên. Văn bản bài học, đáp án, hình CSS và 12 mẫu nét hình học do dự án tự soạn. Nét đã đối chiếu số/thứ tự/hướng theo MOE, ghi phạm vi ở STROKE_SOURCES.md. Không có tài sản giáo trình/audio trả phí. Không tuyên bố nội dung do giáo viên phê duyệt.

Font Microsoft JhengHei được Windows cung cấp tại máy, không phân phối lại. Audio đọc trực tiếp bằng giọng hệ điều hành/browser local khi có; không xuất audio Windows để phân phối sang Android. Hiện máy thiếu zh-TW nên chưa có audio được nghe duyệt.

## Kiểm tra gói

`npm.cmd run content:check` kiểm tra schema, hash, bytes, ID trùng, liên kết bài–từ/ngữ pháp, đáp án trong lựa chọn. Đây là kiểm tra cấu trúc; chưa tự xác minh tính đúng của Pinyin, nghĩa, chuẩn Đài Loan hoặc chất lượng audio.

Lộ trình đối chiếu tiếp: từng mục và chữ đa âm → ghi URL/mục cụ thể, ngày và người đối chiếu → rà câu/đáp án theo ngữ cảnh → nghe voice thật → cập nhật verification từng mục → tăng version và hash. Cập nhật không xóa ID cũ. Mỗi đơn vị hiện có một chữ luyện nét chọn lọc; chưa có bộ nét cho mọi Hán tự trong từ vựng.
