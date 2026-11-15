# Phase ôn câu PC / Android — 09/11/2026

Trạng thái: đã triển khai và kiểm tra tự động PC/mobile; APK 1.1 (versionCode 2). Chưa nghiệm thu trên điện thoại thật. Kết quả và giới hạn tại TASKS.md.

## Bản triển khai

Ngân hàng 1.150 câu, 8 nhóm tình huống mỗi chủ đề (63–64 câu/chủ đề); khung và lựa chọn được biên soạn trước. Không phải 1.150 tình huống độc lập. Bộ lọc kiến thức có thể chỉ mở một phần ngân hàng; không tự coi hoàn thành 72 bài là biết mọi từ bổ sung.

40 bài bổ sung dùng 400 câu vận dụng mới, tách ví dụ. 72 bài chính giữ 5 câu nhớ từ và thay 5 nhiệm vụ lấy lại hội thoại mẫu bằng gợi dẫn tình huống để nhập từ; không tuyên bố cả 72 bài đã chuyển thành luyện dịch câu. Ôn câu riêng mở từ thẻ chủ đề. Snapshot và lịch sử cũ giữ nguyên.

Đóng app/chuyển tab rồi quay lại tiếp tục bản nháp hiện tại. Mỗi lượt chọn câu khác nhau giữa các dạng, tránh hai lượt gần nhất khi đủ dữ liệu; lượt chuẩn bị bị loại nếu câu đã được luyện trên thiết bị khác sau khi chuẩn bị. Dữ liệu lưu một bản câu theo ID, nhiệm vụ tham chiếu ID; sửa nội dung tạo ID mới và giữ bản cũ cho sự kiện đang chờ. Lịch sử vẫn tăng theo số lượt, không có cam kết dung lượng cố định.

## Phạm vi và mục tiêu

Rà 72 bài chính, 40 bài quy tắc/vận dụng và ôn chủ đề của 18 chủ đề. Không mở rộng toàn bộ Luyện kỹ năng. Android giữ flashcard và thêm điền, chọn từ, chọn/ghép dịch, dịch tự gõ hai chiều. Không nhúng AI; PC chuẩn bị nội dung/audio, điện thoại chọn đề và học offline. Không đồng bộ/hiển thị lịch sử nguồn học; chỉ danh sách kiến thức được phép dùng.

## Nội dung và chọn đề

- Minh họa và vận dụng là hai ngân hàng khác nhau. Không hỏi lại nguyên câu đã xem để đủ 10 câu. Từ đơn đang học vẫn được kiểm tra trực tiếp.
- Mỗi chủ đề tối thiểu 60 câu vận dụng riêng biệt, ít nhất 6 nhóm tình huống. Nhóm và mục tiêu biên soạn rõ; đổi số/tên không tạo nhóm mới. Câu nguyên vẹn hoặc tổ hợp được chỉ định hợp lệ, không lấy tích tùy ý hay suy Pinyin từng chữ.
- Bộ mặc định 15: 4 điền, 4 chọn từ, 3 chọn/ghép dịch, 4 dịch tự gõ chia hai chiều. Bộ 10: 2 mỗi dạng điền, chọn từ, chọn/ghép, dịch Trung–Việt, dịch Việt–Trung.
- Lọc từ/cấu trúc đã học, không bắt câu mới từng được học nguyên dạng. Thiếu thì giảm số thật. Không lặp câu giữa các dạng trong lượt; tối đa 2 câu cùng nhóm; tránh câu của 2 lượt gần nhất khi đủ ngân hàng. Ưu tiên câu mới và câu yếu đến lượt ôn; hết ngân hàng báo ôn lại.
- Không để đề/phản hồi câu trước giải câu sau. Dịch tự gõ khác mẫu cần đối chiếu, không tự chấm sai. Tự đánh giá tách khỏi điểm khách quan.
- Từ trong câu có phân đoạn, Pinyin/nghĩa theo ngữ cảnh và nút nghe; mobile không có nét chữ. Tra/gợi ý trước nộp ghi trợ giúp; không phát âm thanh đáp án trước nộp trừ xin gợi ý.

## Lưu và đồng bộ

Ngân hàng lưu câu một lần, nhiệm vụ tham chiếu; phiên đang làm đóng băng đề. ID/phiên bản mới khi sửa nội dung. API ôn câu có phiên bản song song API flashcard, ghép cặp/chứng chỉ giữ nguyên. Đồng bộ phần thay đổi, sự kiện có ID chống trùng; không đổi FSRS hoặc hoàn thành bài Học. PC/mobile giữ vị trí lượt riêng, đồng bộ kết quả. Không mất outbox khi lỗi hoặc cài cập nhật.

## Audio

Yating PC xuất nguyên câu và nguyên từ, khóa theo nội dung/giọng; không ghép từ thành câu. Tải chữ trước, file thiếu sau; có checksum/resume. Cache câu mặc định 200 MB, độc lập flashcard; bảo vệ lượt đang làm và tối đa 3 lượt chuẩn bị tiếp theo. Không dọn file còn được tham chiếu. Hiển thị đủ/thiếu audio thật; thiếu vẫn luyện chữ, không tự thay giọng.

## Các mốc / nghiệm thu

1. Tài liệu và quyết định.
2. Ngân hàng riêng, rà nội dung 18 chủ đề, lõi chọn đề và PC.
3. Đồng bộ/version/outbox/audio.
4. Mobile và lưu tiếp tục.
5. Kiểm tra tập trung, build PC/mobile/APK; thử Redmi offline rồi đồng bộ lại.

Kiểm tra chống lặp/không rò đáp án, giới hạn kiến thức, lưu nháp/trợ giúp, khác mẫu dịch, cập nhật phiên, ngắt/tải lại/gửi trùng, cache không xóa audio flashcard, FSRS không đổi. Ghi kết quả thực chạy tại TASKS; test không chứng nhận ngôn ngữ/giọng.

## Cập nhật app mobile bằng USB

Không gỡ app cũ. Dùng cùng khóa ký trong `data/android-signing`; không xóa thư mục này. Kết nối dây USB–Type-C có truyền dữ liệu, chọn Truyền tệp, bật Tùy chọn nhà phát triển → Gỡ lỗi USB. Mở khóa điện thoại, chấp nhận dấu vân tay PC khi được hỏi.

Trong terminal PowerShell của VS Code:

```powershell
cd "D:\Taiwanese App\taiwan-mandarin"
npm.cmd run android:build
npm.cmd run android:install
```

Nếu bản APK mới đã được build sẵn thì chỉ cần lệnh `android:install`. Script cài đè bằng `adb install -r`, không xóa dữ liệu. Nếu báo unauthorized: xác nhận trên điện thoại; nếu không thấy thiết bị: kiểm tra dây và Gỡ lỗi USB (chọn Truyền tệp một mình chưa đủ).

Sau cập nhật: mở PC bằng Start.cmd, giữ dịch vụ đồng bộ hoạt động, PC/điện thoại cùng Wi-Fi; trên app bấm Đồng bộ ngay. Chờ đủ nội dung/audio mong muốn rồi rút cáp, tắt PC để kiểm tra offline. USB dùng cập nhật APK; các lần đồng bộ dữ liệu sau dùng Wi-Fi như trước. Lệnh build/install của phase mới phải được ghi kết quả thực chạy riêng trước khi công bố đã kiểm tra.
