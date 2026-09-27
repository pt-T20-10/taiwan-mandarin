# Foundation-tw v6 — 27/09/2026

## Phạm vi

18 chủ đề, 72 bài, 360 mục từ, 36 mục ngữ pháp; 540 bài tập trong bài và 144 bài ngữ pháp riêng. Sáu chủ đề mới mỗi chủ đề có 20 từ, 4 bài, 30 bài tập, hội thoại sáu lượt, đọc hiểu và đề viết. Có 424 chữ animation; 294 tài sản cũ giữ nguyên byte. ID/nội dung 12 chủ đề cũ không đổi; không tự tạo tiến độ/thẻ cho nội dung chưa học.

Chỉ Qwen3-4B-Q4_K_M, giữ CPU/CUDA và Whisper small/base. Giữ config thật 4B/CUDA + Whisper small. Cấu hình thiếu/hỏng dùng 4B/CPU và báo rõ; config 1.7B cũ backup rồi chuyển riêng model. Không tải model trong phiên học.

TTS chỉ Windows/browser zh-TW local. Kokoro và audio mẫu Pinyin đã gỡ, còn grid 406 âm/dấu thanh/cách ghép bằng chữ. Ví dụ Hán tự có nút nghe riêng; không dùng Latin TTS. Settings chọn giọng neural cũ được backup rồi đổi riêng voice về auto, giữ pace/nhận xét. Thiếu zh-TW được báo rõ và bài nghe có thể bỏ qua.

## Các sửa cuối

- Nút nghe thử chờ lưu xong lựa chọn giọng, tránh dùng lựa chọn cũ khi request lưu còn đang cập nhật state. Trace lỗi trước không có request native TTS; sau sửa đã phát WAV thật qua UI.
- E2E lưu/tạm dừng chờ route đổi xong trước mở lại bài. Kiểm tra đầu vào theo số chủ đề: 54 câu; có test tiếp tục bản nháp v5 và kết thúc sớm.
- Rà median đánh số với MOE, sửa thứ tự chọn lọc 嚴/惜/感/聯/訊. 邀 giữ thứ tự hiện tại; không dùng kết quả greedy sai cho 辶. Số nét 424/424 khớp; chưa duyệt chuyên môn mọi hình/hướng nét.

## Nguồn và giới hạn

- [ATTRIBUTION](../public/learning/ATTRIBUTION.md) và [STROKE_SOURCES](STROKE_SOURCES.md): AnimCJK pinned, APL/LGPL/Unihan; MOE chỉ đối chiếu, không đóng gói đường nét MOE. Một số mẫu lấy nguồn Ja hoặc ghép, còn cần rà dáng Đài Loan/tỉ lệ/độ dày. Chấm viết tay chỉ 12 chữ.
- [Audit từ vựng](a2-vocabulary-audit.json): tra 120 từ mới, 48 khớp từ/Pinyin qua TBCL; 72 chưa khớp truy vấn hiện tại. Không gọi cả 120 là đã kiểm chứng. Giải thích/câu/nghĩa Việt vẫn draft, chưa giáo viên duyệt. A2 là định hướng biên soạn; B2 chưa hoàn thành.
- [Smoke 4B CPU/CUDA](benchmark-v6-4b-smoke.json) xác nhận khả năng chạy, không chứng nhận gia sư. Xóa model nhỏ giảm ổ đĩa, không giảm RAM/VRAM của 4B.
- [Native TTS/cancel](benchmark-v6-native-tts.json) dùng tiến trình thật. Giọng zh-TW vẫn cần nghe đối chiếu độ tự nhiên/chữ đa âm/biến điệu; không có model giọng mới. ASR không chấm phát âm/thanh điệu.
- Giữ giấy phép/benchmark/hash của tài sản đã gỡ; [NEURAL_TTS](NEURAL_TTS.md) là lịch sử. Không viết lại Git để thu hồi binary trong lịch sử.

## Kiểm thử, cài gói và dung lượng

Đã chạy trên source cuối: build/content checker qua, **25 core/adapter**, **36 backend**, **39/39 Edge E2E** qua trong một lượt toàn bộ (4,5 phút). Có một cảnh báo deprecation Starlette/httpx; không đổi dependency khóa. E2E đi qua 72 bài (gồm 24 bài mới), 12 bài ngữ pháp A2, lưu/tiếp tục/gợi ý/sổ lỗi, thiếu giọng, native TTS thật/hủy khi chuyển trang, desktop/mobile và chặn mạng ngoài. Test byte bảo toàn 294 tài sản cũ và hash 12 unit cũ đều qua.

Qwen 4B chạy lại sau khi xóa model nhỏ: CPU 34.706 ms, CUDA 9.409 ms cho hai lượt smoke gồm nạp model; không coi đây là benchmark thống kê. Native TTS có kiểm tra WAV và hủy child thật riêng.

Đã backup `data/backups/before-v6-20260927-201705.json` rồi nâng database thật v5→v6 qua API transaction. So sánh state trước/sau bằng nhau hoàn toàn: **13 objects, 33 events**, giữ tiến độ/lịch ôn/cài đặt. Báo cáo đầy đủ ở `data/backups/upgrade-v6-20260927-201705.json` (ignored). Giữ browser Yating/nhịp thường, 4B/CUDA và Whisper small; không cần migrate setting thật. Không restore snapshot cũ có ít sự kiện hơn.

Đã kiểm tra giao diện v6 cài thật bằng Edge ở desktop/mobile, không lỗi trang, không ghi thêm dữ liệu học. Localhost phục vụ tại http://127.0.0.1:8765 bằng launcher trực tiếp.

Đã xóa **3,906,879,800 bytes (~3,907 GB)**; phép đo cuối **5,250,713,005 bytes (~5.251 GB)/10 GB** cho models/runtime/data/public/dist/content. Bao gồm cache/backup và bản build; không gồm công cụ phát triển/lịch sử Git. [Chi tiết dung lượng](v6-storage.json), [kết quả kiểm tra](v6-validation.json). Giữ lịch sử Git và giấy phép đã gỡ; không push.
