# Luyện bốn kỹ năng — foundation-tw v7

Ngày 29/09/2026. Bản phát triển Windows, chưa nghiệm thu v1 hoặc chứng nhận trình độ.

## Nội dung và cách học

- 18 chủ đề × 4 kỹ năng × 3 bộ = **216 bộ**, **1.620 câu/lượt**. Mỗi bộ có ngữ cảnh 8 câu. Nghe: 6 chọn đáp án, 2 điền từ có lựa chọn, 2 chép nghe. Đọc: 6 đọc hiểu, 2 điền từ có lựa chọn, 2 tự gõ. Nói: 4 đọc mẫu + 4 tình huống. Viết: 1 câu + 1 đoạn 3–5 câu.
- Mục Học có **72 × 10 = 720 bài tập**, giữ nguyên 540 câu v6 và ID. Hội thoại giới thiệu được nối tiếp thành 8 câu. Liên kết luyện thêm không đổi bài bắt buộc.
- Ngân hàng gốc ở `content/practice_scenarios.py`, `practice_dialogues.py`, dựng bởi `practice.py`. Có 54 tình huống khác nhau, dùng khung kể kế hoạch để giữ mức luyện có cấu trúc. Đọc/Nghe cùng chủ đề có thể dùng chung tình huống; ba bộ trong một kỹ năng khác nhau. Tất cả là draft, chưa giáo viên duyệt.
- Đọc/Nói và hội thoại Học có bật/tắt Pinyin, tiếng Việt từng câu/cả đoạn, mặc định ẩn. Xin trợ giúp trong câu chấm điểm được ghi ngay; ẩn lại vẫn giữ dấu trợ giúp.
- Điền từ có chỗ trống thật, gợi ý nghĩa và đáp án chấp nhận chính xác. Không đổi Giản thể thành Phồn thể để chấm đúng. Ẩn đoạn đầy đủ trước khi nộp; audio ngữ cảnh của câu nghe điền từ loại cụm đáp án. Chép nghe phát câu đầy đủ theo đúng dạng bài.
- Nói ghi âm/nghe lại, sửa transcript, tự xác nhận hoặc bỏ qua; ASR không chấm phát âm. Viết lưu bài và xem mẫu sau nộp, góp ý AI tùy chọn. Nói/Viết ghi lượt luyện, không tự cho điểm đúng/sai.

## Phiên luyện và dữ liệu

- SQLite **`data/learning.sqlite3`**, Python `sqlite3`, schema 1 giữ nguyên, WAL. Bảng `objects` chứa JSON có collection/ID/version; `events` lưu lượt học chống trùng; `packages` lưu gói có hash. Không dùng localStorage làm kho tiến độ.
- `objects.sessions` với ID `skills:<run>` lưu nguyên bộ, thứ tự câu/đáp án, câu trả lời, trợ giúp, vị trí và bản nháp. `reports` với `skills-history:<unit>:<skill>` lưu lịch sử chọn, bản AI nhận gần nhất; mọi bộ AI cũ vẫn nằm nguyên trong phiên.
- Chọn ngẫu nhiên trong ba bộ chưa dùng của vòng hiện tại, hết mới sang vòng mới. Bộ mới tạo phiên mới, giữ bài đang dở. Lưu nháp theo hàng đợi có kiểm tra version; chuyển màn hình rồi quay lại đọc dữ liệu đã lưu. Xung đột/lỗi lưu báo lỗi và dừng nộp tiếp để không ghi đè.
- Skills không hoàn thành bài Học, không thay lịch flashcard. Sự kiện AI có `source=ai`, không cộng vào tỷ lệ đúng hoặc sổ lỗi chuẩn; sự kiện cũ mặc định authored. Audio micro chỉ nằm trong phiên trình duyệt, transcript/kết quả lưu local.
- Phiên Học mới cố định `exercise_ids`; phiên v6 không có trường này dùng `legacy_exercise_ids`, kể cả lượt retry. Mốc hoàn thành bài cũ giữ nguyên; “Học lại” mới mở 10 câu.

## Tạo đề AI và giới hạn thực tế

`POST /api/ai/practice` chỉ nhận chủ đề, kỹ năng và request ID. Backend lấy từ/ngữ pháp trong gói, gọi Qwen3-4B hiện có qua khóa một tác vụ AI. Bốn lượt tạo 2 câu ngữ cảnh, rồi tối đa 2 câu hỏi/lượt; tiến độ được poll qua `GET /api/ai/practice/{id}`, hủy bằng API hiện có. Ngữ cảnh sai được thử sửa tối đa một lần mỗi cặp. Không thay hợp đồng chat/góp ý.

Ràng buộc JSON theo loại câu, kiểm tra đủ số lượng, đáp án/lựa chọn, câu lặp, Pinyin lẫn Hán tự/số thanh và bản dịch lẫn Hán tự. Chỗ trống AI được dựng từ vị trí duy nhất của đáp án trong câu nguồn. Chỉ nhận trọn bộ; lỗi/hủy giữ nguyên bộ cũ. Đây là kiểm tra cấu trúc, không xác minh ngôn ngữ.

Smoke thật có nhiều lỗi model: từ rời thay cho câu, Pinyin sai, nghĩa Việt sai, lặp câu/ngữ cảnh và câu hỏi. Đã sửa lỗi ràng buộc runtime JSON phát hiện trong thử nghiệm. **Lượt cuối CPU/Viết bị chặn do bản dịch lẫn Hán tự (49,97 giây); CUDA/Đọc bị chặn do câu hỏi lặp (44,21 giây). Chưa xác nhận model tạo thành công một bộ đạt toàn bộ kiểm tra cuối trên cả hai runtime.** Nút AI vẫn là thử nghiệm; ba bộ soạn sẵn không phụ thuộc AI. Không coi các lượt trước chỉ qua schema là nội dung đạt chất lượng. Kết quả thô local: `data/practice-smoke-v7*.json`; script tái hiện: `scripts/smoke_practice.py`. Không chạy lại benchmark chất lượng toàn bộ.

## Kiểm tra

- Build, **31 core/adapter**, **43 backend**, content checker và manifest 2.035 tài sản đã qua. Kiểm tra hash toàn bộ 18 đơn vị v6 sau loại phần thêm, ID cũ và transaction nâng gói bảo toàn state.
- **46/46 Edge E2E** ở lượt đầy đủ: 72 bài, offline/mobile, lưu/gợi ý/điền từ/hoàn thành, AI fixture và giọng zh-TW thật. Sau sửa hội thoại/audio điền từ, **11/11 E2E liên quan** đã qua. Bản sửa cuối khôi phục bản nháp qua chuyển tab/resume đạt **5/5 Skills**; sau thêm retry ngữ cảnh AI, **6/6 backend Skills** qua.
- Native zh-TW trả audio, playback chạy và dừng được. Đây không phải nghe duyệt chất lượng. AI/media fixture trong E2E được ghi TEST, không tính là kết quả AI hoặc micro người thật.
- Còn cảnh báo deprecation Starlette/httpx từ môi trường hiện có; không thay dependency/model/voice.

## Cập nhật bản cài

Nâng gói qua `scripts/upgrade_bundled.py --apply`: GET backup, kiểm tra hash, POST gói trong transaction rồi so sánh toàn bộ state trước/sau. Backup/report nằm ở `data/backups/`. Không sửa SQLite trực tiếp hoặc đặt lại lịch ôn. Bản cuối phục vụ tại `http://127.0.0.1:8765`; checkpoint Git local, không push.

Đã thực hiện lúc `20260929-132736`, giữ nguyên **15 objects/44 events**, hash state `62531c7e9c48153893f55454ba93e2037a590351b39005cd859001786beb02ba`. Backup `before-v7-20260929-132736.json`, report `upgrade-v7-20260929-132736.json`. Smoke Edge bản cài sau nâng gói không page error/request ngoài loopback, desktop/mobile không tràn, state bằng cả trước restart. Kết quả/hình nằm ở `data/v7-installed-*`.
