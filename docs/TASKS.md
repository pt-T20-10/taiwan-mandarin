# Tiến độ Windows — chưa đạt nghiệm thu v1

Cập nhật 24/09/2026. Không coi số lượng bản nháp hoặc test tự động là chứng nhận nội dung/audio.

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
- [ ] 12 chữ nét chọn lọc đã có nguồn đối chiếu; chưa có dữ liệu nét cho mọi chữ trong từ vựng, chưa kiểm chứng dáng chữ bằng người dạy.
- [ ] Chưa đo riêng TTFT hoặc mọi thao tác <200 ms. Bảng latency hiện là thời gian toàn bộ kết quả; không suy ra đạt mục tiêu TTFT.
- [ ] Chưa triển khai Android, Wi-Fi sync hoặc chương trình B2 (đúng thứ tự PLAN).

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
