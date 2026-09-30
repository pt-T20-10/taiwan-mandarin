# Tiến độ Windows — chưa đạt nghiệm thu v1

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
