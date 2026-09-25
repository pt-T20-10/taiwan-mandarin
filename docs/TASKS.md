# Tiến độ Windows — chưa đạt nghiệm thu v1

Cập nhật 25/09/2026. Không coi số lượng bản nháp hoặc test tự động là chứng nhận nội dung/audio. Các con số kiểm thử của mốc 23–24/09 bên dưới là lịch sử; kết quả đợt mới nằm ở phần này.

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
