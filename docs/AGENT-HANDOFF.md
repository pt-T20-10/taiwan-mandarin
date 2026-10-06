# Bàn giao dự án Đảo nhỏ — Taiwan Mandarin

**Cập nhật: 06/10/2026, múi giờ Asia/Bangkok.** Tài liệu dành cho agent tiếp quản mà không có lịch sử chat. Đã đối chiếu mã nguồn, Git và các tệp local tại thời điểm viết; không chạy lại ứng dụng/test cho riêng lần bàn giao này.

**Cập nhật xuất bản cùng ngày:** sau khi tạo tài liệu, người dùng yêu cầu commit và push lên remote. Mã thử nghiệm đọc liền và tài liệu này được đưa vào commit `Add experimental connected-speech playback and agent handoff`. Các mô tả “chưa commit” bên dưới là snapshot trước checkpoint này; hãy dùng `git status` và `git log` để xác định trạng thái mới nhất. Việc commit không đồng nghĩa nghiệm thu chất lượng audio. Database/model/runtime/WAV local vẫn không nằm trong Git.

## 1. Đọc nhanh trước khi làm

- Repository: `D:\Taiwanese App\taiwan-mandarin`; shell PowerShell, Windows.
- Ứng dụng cá nhân học Hoa ngữ **Phồn thể theo Đài Loan**, hướng dẫn tiếng Việt, Pinyin có dấu. Học giao tiếp đời sống, môi trường đại học và định hướng TOCFL.
- Chạy offline trên Windows. Android/đồng bộ là hướng sau, chưa phải phạm vi triển khai hiện tại.
- Đã có gói nền tảng v7, luyện bốn kỹ năng, thẻ ôn, ngữ pháp, lượng từ và chuyên đề động từ.
- **Chưa nghiệm thu Windows v1; chưa được coi nội dung/audio là giáo viên duyệt hoặc chứng nhận đạt A1/B2.**
- Việc trọng tâm còn dở: người dùng nghe phần “Quy tắc đọc liền” bị rời từng âm. Có thử nghiệm BreezyVoice nhưng chưa xác nhận sửa được chất lượng phát âm.
- **Working tree không sạch, chủ yếu do thử nghiệm đọc liền. Không reset/clean hoặc ghi đè để “làm sạch”.**
- Yêu cầu mới nhất chỉ là tạo tài liệu bàn giao. Không tự hiểu đây là yêu cầu chạy lại benchmark, sinh tiếp audio hay mở rộng nội dung.

Thứ tự đọc: [AGENTS.md](../AGENTS.md) → tài liệu này → [TASKS.md](TASKS.md) → [DECISIONS.md](DECISIONS.md) → [PLAN.md](PLAN.md). PLAN chứa nhiều phương án lịch sử đã bị thay thế; ưu tiên quyết định và mã hiện tại, không khôi phục thiết kế cũ chỉ vì thấy trong PLAN.

## 2. Cách cộng tác người dùng mong muốn

- Giao tiếp tiếng Việt, ngắn gọn; giải thích kết quả và cách mở tính năng.
- Khi đã duyệt kế hoạch thì triển khai, tránh hỏi lại quyền cho việc đã được cho phép.
- Người dùng yêu cầu **tiết kiệm token, hạn chế viết quá nhiều test và tác vụ không cần thiết**; họ có thể tự thử rồi phản hồi.
- Kiểm tra đúng phần thay đổi: build, kiểm tra ngân hàng/hợp đồng lưu khi đổi nội dung, một smoke luồng liên quan nếu cần. Không chạy cả E2E hoặc benchmark AI liên tục.
- Không tự thêm agent phụ: chưa có yêu cầu phân công song song.
- Khi thay đổi đáng kể, cập nhật TASKS/DECISIONS và có thể lưu checkpoint Git local; **không push/deploy**.
- Không sửa Python global, driver, registry; không tạo lại `.venv` ứng dụng. Không tải model khác hoặc dọn model đang dùng tùy tiện.
- Không commit database, model, runtime, audio ghi âm, cache hoặc bí mật. Tệp sinh và môi trường lớn đã nằm trong `.gitignore`.

## 3. Kiến trúc và điểm vào

| Thành phần | Vị trí / vai trò |
|---|---|
| Frontend | React + TypeScript + Vite, `src/`; route bằng hash |
| Điều hướng / context | `src/App.tsx`, `src/context.tsx` |
| Màn hình | `src/components/` |
| Lõi học, FSRS, chấm bài | `src/core/learning.ts`, `practice.ts`, `types.ts` |
| Adapter local | `src/adapters/local.ts`; storage, audio, ASR/chat |
| Tạo bộ AI | `src/adapters/practice.ts`, `backend/practice.py` |
| Backend | FastAPI/Uvicorn, `backend/app.py` |
| Khởi chạy | `Start.cmd`, `backend/launcher.py` |
| Lưu trữ | `backend/db.py`, Python `sqlite3` |
| Gói và validator | `backend/content.py`, `content/foundation.pack.json` |
| Asset offline | `public/learning/`, manifest và attribution đi kèm |
| Frontend đã build | `dist/`, backend phục vụ tại `http://127.0.0.1:8765` |

Các tab chính: Học, Ôn tập, Luyện kỹ năng, Phát âm, Ngữ pháp, Hội thoại, Sổ tay, Kiểm tra đầu vào, Thống kê, Cài đặt.

Các đường mở quan trọng:

- `/#learn`: 18 chủ đề / 72 bài.
- `/#skills/<unit-id>/<skill>`: `listening`, `speaking`, `reading`, `writing`; `stroke` là viết chữ.
- `/#pronunciation`: bảng Pinyin và quy tắc đọc liền.
- `/#grammar`: bài ngữ pháp và lộ trình tham chiếu.
- `/#learn/classifiers`: lượng từ; có `/<unit-id>/<skill>` để ôn theo chủ đề.
- `/#grammar/verbs`: chuyên đề động từ.
- `/#grammar/verbs/lesson/recognize`: bài đầu; thêm `/practice` để luyện.
- `/#grammar/verbs/topic/tw.daily/reading`: ví dụ ôn động từ theo chủ đề.

18 unit ID: `tw.greetings`, `tw.numbers`, `tw.food`, `tw.shopping`, `tw.transport`, `tw.family`, `tw.home`, `tw.schedule`, `tw.information`, `tw.classroom`, `tw.daily`, `tw.campus`, `tw.health`, `tw.renting`, `tw.services`, `tw.worklife`, `tw.travel`, `tw.social`.

## 4. Database và nguyên tắc bảo toàn

Database mặc định: **`D:\Taiwanese App\taiwan-mandarin\data\learning.sqlite3`**. SQLite schema 1, chế độ WAL. `MANDARIN_DATA_DIR` có thể đổi thư mục data; E2E dùng `data/e2e`.

| Bảng | Nội dung |
|---|---|
| `meta` | Metadata, gồm device ID |
| `objects` | JSON theo collection + ID; có version và cờ deleted |
| `events` | Sự kiện học; ID và `action_key` duy nhất để chống nộp trùng |
| `packages` | Gói nội dung đã cài trong DB |

Collections: `sessions`, `cards`, `notes`, `settings`, `placement`, `chats`, `reports`. Tiến độ không lấy localStorage làm kho chính.

- Dùng `expected_version` khi ghi; xung đột phải báo và giữ bản nháp, không ghi đè tùy tiện.
- `GET /api/backup`, `POST /api/restore`, `POST /api/packages` là các đường backup/restore/cài gói. Sao lưu trước khi nâng gói; dùng transaction hiện có, không sửa DB trực tiếp.
- Sửa `content/foundation.pack.json` không đồng nghĩa gói đang cài trong DB đã cập nhật. Kiểm tra `/api/content` và luồng cài gói.
- Phiên Học mới cố định `exercise_ids`. Phiên v6 cũ chưa có danh sách này dùng `legacy_exercise_ids`; giữ cả câu retry và mốc đã hoàn thành.
- Skills lưu nguyên packet/thứ tự/câu trả lời/trợ giúp/bản nháp trong session `skills:<run>`. Lịch sử vòng chọn ở report `skills-history:<unit>:<skill>`.
- Lượng từ/động từ dùng `unit_id` riêng `classifiers:*` / `verbs:*` **bên trong session Skills**; không nhầm với khóa session ngoài cùng.
- Luyện Skills/chuyên đề không tự hoàn thành bài Học và không đổi FSRS. Thêm thẻ phải là hành động người dùng chọn.
- Audio micro chỉ tồn tại trong phiên trình duyệt; lưu transcript và kết quả, không lưu dài hạn bản ghi.

API ghi cần header `X-Mandarin-Client: local-ui`; backend có giới hạn localhost/origin. `POST /api/practice/sessions` ghi session và lịch sử chọn bộ cùng transaction.

## 5. Những phần đã hoàn thành

### Nền tảng v7 và bốn kỹ năng

- 18 chủ đề, 72 bài, 360 mục từ, 36 mục ngữ pháp trong gói; 720 bài tập Học; hội thoại giới thiệu tám câu/chủ đề.
- 216 bộ Skills soạn sẵn: 18 chủ đề × bốn kỹ năng × ba bộ; tổng 1.620 câu/lượt.
- Mỗi bộ v7: Nghe/Đọc 10 câu; Nói 8 lượt; Viết 2 đề. Ngữ cảnh tám câu, giữ mạch đoạn khi trộn câu hỏi/lựa chọn.
- Đọc/Nói có bật/tắt Pinyin và nghĩa Việt, mặc định ẩn trong nội dung mới; `PracticeText.tsx` quản lý hiển thị này.
- Mở trợ giúp được ghi nhận và không xóa khi ẩn lại. Điền từ phải che câu/audio chứa đáp án trước khi nộp hoặc xin gợi ý.
- Nghe/Đọc phân biệt đúng độc lập, có trợ giúp, bỏ qua. Nói/Viết ghi lượt luyện, không tự cho điểm đúng/sai hay điểm phát âm.
- Ba bộ soạn sẵn chọn theo vòng không lặp; đổi bộ tạo phiên mới, giữ các phiên đang dở.
- Tạo đề AI tùy chọn, nhận nguyên bộ khi đầy đủ; nhãn chưa kiểm chứng, tách khỏi điểm chuẩn và sổ lỗi chuẩn.

Chi tiết và giới hạn: [RELEASE-V7.md](RELEASE-V7.md), [BENCHMARKS.md](BENCHMARKS.md).

### Lượng từ — hoàn thành 02/10, sửa hợp đồng lưu 04/10

- `src/core/classifiers.ts`, `src/components/Classifiers.tsx`.
- Bài nhập môn, bảng tra **20 lượng từ / 22 cụm**, liên kết theo 18 chủ đề.
- Dùng lại `SkillPractice`; mỗi chủ đề/kỹ năng một bộ bổ sung, không quảng bá thành ba bộ khác nhau.
- Thẻ học cả cụm, ví dụ 兩本書; chấp nhận cách dùng thay thế khi phù hợp ngữ cảnh.
- Nội dung frontend bổ sung, không nâng gói nền tảng v7.

### Động từ — hoàn thành 04/10

- `src/core/verbs.ts`, `verbLessons.ts`, `src/components/Verbs.tsx`.
- Sáu bài × sáu câu; 20 động từ cơ bản đối chiếu; **36 từ li hợp / 72 câu ví dụ liền–tách**.
- 24 mục học trước, 12 mở rộng; tra cứu/lọc nhóm và liên kết theo 18 chủ đề.
- Mỗi bộ ôn chủ đề có sáu mục; phần tổng hợp có sáu nhóm luân phiên cho từng kỹ năng.
- Phân biệt số âm tiết, khả năng nhận tân ngữ và tính li hợp. Không chia thành các nhóm loại trừ nhau; không tự sinh mọi mẫu tách/lặp từ một công thức.
- Ghi riêng biến thể 幫忙, 報名; câu mẫu tự soạn, chưa giáo viên duyệt. Bài nói/viết không ép một cách diễn đạt duy nhất.
- Sổ lỗi đọc được câu/đáp án từ packet bổ sung đã lưu (`Review.tsx`).

**Lỗi đã sửa cần nhớ:** backend từng bắt mọi Skills packet theo cấu trúc v7 cố định (8 câu ngữ cảnh, đúng tỷ lệ dạng bài), nên từ chối bài lượng từ/động từ. `SupplementalPracticeSet` trong `backend/content.py` và chọn validator trong `backend/db.py` giải quyết việc này. Chỉ dùng validator bổ sung cho namespace verbs/classifiers và nguồn authored; không nới hợp đồng đề v7 hoặc AI.

Chỗ trống trong dữ liệu phải là đúng một `___`; các dạng `respond`/`dictation`/`read-aloud` cần `stimulus` hợp lệ. Lựa chọn trắc nghiệm phải đủ ba phương án khác nhau. Đây là những lỗi đã gặp thực tế, tránh tái tạo khi thêm ngân hàng.

## 6. Audio và AI: phân biệt rõ các đường chạy

### Model ứng dụng

- Qwen3-4B-Q4_K_M qua llama.cpp: chat, góp ý, tạo bài; **không phải model đọc tiếng**.
- Whisper base/small qua whisper.cpp: ASR; **transcript không xác minh thanh điệu**.
- `models/active.json` tại lúc bàn giao: `Qwen3-4B-Q4_K_M.gguf`, runtime `cuda`, ASR `ggml-small.bin`.
- Khóa một tác vụ AI và cơ chế hủy có sẵn; không phá hợp đồng chat/góp ý khi sửa tạo đề.
- `POST /api/ai/practice` nhận chủ đề/kỹ năng/request ID, backend lấy nội dung từ gói. Sinh từng lô nhỏ; poll trạng thái, hủy được; lỗi/hủy giữ nguyên bộ cũ.

### Bảng Pinyin

- `PinyinLab.tsx`: bảng 406 ô; hover/chạm mở bốn thanh, click mới phát.
- 1.598 MP3 nguyên âm tiết, 26 tổ hợp thiếu bản thu có nút mờ. Không còn cách ghép từng thành phần hoặc phụ thuộc ví dụ Hán tự để nghe.
- Nguồn Quan thoại phổ thông, chưa chứng nhận vùng giọng Đài Loan. Không nối các MP3 này thành câu.

### Đọc liền — chưa hoàn tất

Người dùng xác nhận **hầu hết ví dụ nghe rời từng âm**, không chỉ một trường hợp. Đây là lỗi chất lượng học tập trọng tâm.

Điều tra trước đó:

- Giọng đã lưu khi điều tra: browser Microsoft Yating zh-TW, tốc độ normal; không mặc định đây vẫn là lựa chọn hiện tại của người dùng.
- Ứng dụng đã gửi nguyên cụm/câu vào một lượt TTS, không tách từng chữ. Ghi chú `spoken` chỉ là văn bản dạy học, chưa điều khiển Windows TTS.
- Probe Hanhan native: văn bản và SSML bọc câu tạo WAV trùng hash; chuỗi IPA có đường nét thanh điệu bị từ chối. Không kết luận mọi SSML/giọng khác đều thất bại.

Thử nghiệm đang có trong working tree:

- BreezyVoice của MediaTek, dùng source/model khóa revision/hash trong `docs/BREEZY-MODELS.json`.
- Runtime riêng **Python 3.11** ở `runtime/breezy/venv`; `.venv` chính của app vẫn riêng (Python 3.14 trong môi trường đã dùng).
- Model ở `models/breezyvoice`; chỉ chạy thử CPU. Chưa thử CUDA cho BreezyVoice.
- `scripts/setup_breezy.py` tải source/model có hash; **không phải trình cài hoàn chỉnh mọi dependency**. Xem requirements và lock runtime riêng trước khi tái tạo.
- `scripts/render_connected_speech.py`: 11 ca cố định trong `content/connected-speech.json`, gợi ý Zhuyin, sinh cả cụm/câu. Flow conditioning dùng ba giây đầu của mẫu tham chiếu upstream; LLM mặc định dynamic INT8, `--fp32` để đối chiếu; `--resume` giữ clip đã khớp text/hash.
- Không coi `--resume` là bảo đảm cùng precision: các file sinh ở hai chế độ có thể cùng tồn tại. Kiểm tra manifest từng clip.
- **Hiện chỉ có bốn WAV** trong `data/connected-speech`: `third-third-{phrase,context}` và `yi-first-{phrase,context}`. Không phải đã có đủ 22 clip.
- Hai mẫu đầu chạy FP32; lần thử tiếp theo dùng INT8. FP32 đã ghi khoảng 34 giây/cụm và 83 giây/câu; đây là thời gian sinh, nghe WAV lưu sẵn không cần chạy model.
- Backend thử nghiệm: `backend/connected_speech.py`, `GET /api/pronunciation/audio`, `GET /api/pronunciation/audio/{key}`; kiểm tra text/hash, không thay giọng âm thầm khi thiếu file.
- UI: `ConnectedAudio.tsx` và `Pronunciation.tsx`, có bản mới thử nghiệm và nghe đối chiếu Windows, nhận xét gắn nguồn/variant/hash. Audio dùng chung cơ chế dừng của adapter.
- Chưa có phản hồi người dùng xác nhận chất lượng bản mới. Không dùng WAV hợp lệ, ASR đọc gần đúng hay E2E pass để tuyên bố đã sửa biến điệu.
- Đã từng bỏ hai ZIP cài CUDA trùng với DLL giải nén để giữ ngân sách; DLL/model đang dùng vẫn giữ. Lần đo trước khoảng 9,45 GB managed data, **không phải số đo mới ngày bàn giao**. Ngân sách mục tiêu 10 GB gồm models/runtime/data/public/dist/content.

**Tài liệu cũ bị chậm cập nhật:** đoạn đọc liền trong TASKS và [CONNECTED-SPEECH.md](CONNECTED-SPEECH.md) vẫn có câu “BreezyVoice chưa cài”. Mô tả đó là lịch sử trước thử nghiệm; trạng thái working tree và bốn WAV ở trên mới hơn. Chất lượng vẫn chưa nghiệm thu.

Việc tiếp theo nếu người dùng yêu cầu tiếp tục audio: kiểm tra bốn clip/manifest, lấy nhận xét nghe, quyết định giữ hay điều chỉnh ứng viên; sau đó mới sinh thêm và kiểm tra 11 ca. Không tải lại model hoặc chạy benchmark lớn mặc định.

## 7. Lỗi khởi chạy từng được báo

Người dùng báo ứng dụng **tự dừng dù không bấm Ctrl+C**. Launcher đã bắt KeyboardInterrupt ở entrypoint và ghi log xoay vòng (`data/launcher.log`) để phân biệt signal với `/api/shutdown`.

Nguồn signal tự dừng **chưa được xác định**. Việc traceback sạch hơn không có nghĩa nguyên nhân đã được sửa. Nếu tái diễn, đọc log/tình huống chạy thực tế; không tự chuyển thành service hệ thống hoặc sửa terminal/registry để che lỗi.

## 8. Git và công việc chưa commit

Checkpoint mới nhất tại lúc viết:

| Commit | Phạm vi |
|---|---|
| `0e1461d` | Động từ, validator bài bổ sung, sửa tương thích lượng từ |
| `a6567ab` | Chuyên đề lượng từ |
| `862e3c1` | Điều tra/ưu tiên chất lượng đọc liền |
| `acd08a9` | Skills v7 và bảo toàn tiến độ cũ |

Tệp tracked đang sửa, chưa commit trước khi tạo tài liệu này:

```text
backend/app.py
e2e/app.spec.ts
src/adapters/local.ts
src/components/Pronunciation.tsx
```

Tệp mới chưa tracked của thử nghiệm đọc liền:

```text
backend/connected_speech.py
content/connected-speech.json
docs/BREEZY-MODELS.json
e2e/connected-speech.spec.ts
scripts/breezy-requirements.txt
scripts/breezy-runtime.lock.txt
scripts/render_connected_speech.py
scripts/setup_breezy.py
src/components/ConnectedAudio.tsx
tests/test_connected_speech.py
```

`backend/app.py` còn có sửa phép đo dung lượng để bỏ qua tệp tạm biến mất giữa lúc duyệt và stat. Đừng bỏ sửa này khi tách commit audio.

Clone chỉ các commit sẽ **không có toàn bộ thử nghiệm đang chạy trên máy này**. Model/runtime/WAV/DB bị ignore; agent khác trên máy khác phải biết đó là tài nguyên local, không cho rằng Git đủ để tái hiện chúng.

## 9. Chạy và kiểm tra vừa đủ

Chạy từ root repository:

```powershell
.\Start.cmd
# Hoặc chỉ chạy server, không mở browser:
npm.cmd run server

npm.cmd run build
npm.cmd run content:check

# Kiểm tra chọn lọc mới nhất:
npx.cmd vitest run src/core/verbs.test.ts src/core/classifiers.test.ts
npm.cmd run test:e2e -- e2e/verbs.spec.ts
```

Các lệnh toàn bộ có sẵn, chỉ dùng khi phạm vi thay đổi cần:

```powershell
npm.cmd test
.venv\Scripts\python.exe -m pytest -q
npm.cmd run test:e2e
```

- E2E dùng Edge, cổng 8767 và `data/e2e`; không restore fixture vào database người dùng.
- Backend production phục vụ `dist`, nên sửa frontend xong cần build; backend đổi cần khởi động lại dịch vụ. Không giả định 8765 đang chạy từ một phiên trước.
- Trước khi dừng tiến trình, kiểm tra đúng launcher của dự án; ưu tiên `/api/shutdown` khi cần. Không tắt hàng loạt process Python.
- Sandbox Windows từng chặn child process Vite/Edge hoặc thư mục tạm pytest. Đó không nhất thiết là lỗi code; dùng quyền phù hợp cho đúng lệnh, không sửa cấu hình toàn máy.
- `verbs.test.ts` gọi Python `.venv/Scripts/python.exe` để đối chiếu packet TypeScript với validator backend. Đây là kiểm tra hợp đồng hai phía, không chỉ kiểm tra nội bộ frontend.

Kiểm tra đã thực chạy gần nhất (04/10): build pass; hai test ngân hàng pass; một Edge E2E pass cho bắt đầu/lưu nháp/reload/giữ thứ tự/nộp/tiếp tục và chiều rộng mobile. Không có full regression mới cho toàn hệ thống sau đợt động từ. Lịch sử v7/đọc liền có các lần kiểm tra lớn hơn, xem TASKS; không dùng số cũ như kết quả chạy hôm nay.

## 10. Các nguyên tắc không được làm sai khi tiếp tục

1. Đọc yêu cầu mới của người dùng trước khi chọn việc tiếp theo. Handoff không phải lệnh tự chạy mọi hạng mục tồn đọng.
2. Kiểm tra `git status`, giữ các thay đổi dở; không commit gộp nội dung hoàn tất với thử nghiệm chưa rà.
3. Giữ nội dung Phồn thể/Pinyin/nghĩa Việt và cách dùng Đài Loan; ví dụ tự soạn không tự nâng nhãn đối chiếu/giáo viên duyệt.
4. Không suy mọi động từ hai chữ là li hợp; không suy mọi danh từ chỉ có một lượng từ hoặc mọi từ li hợp cấm tân ngữ tuyệt đối.
5. Ngăn lộ đáp án trước nộp/gợi ý; giữ dấu trợ giúp sau khi ẩn lại.
6. Không đánh đồng số lượt luyện Nói/Viết với điểm đúng/sai hay chất lượng phát âm.
7. Bảo toàn ID bài, snapshot bộ đề, tiến độ v6/v7, chống nộp trùng và lịch FSRS.
8. Không nới validator đề AI/v7 để xử lý bài bổ sung; dùng hợp đồng bổ sung có giới hạn riêng.
9. Không âm thầm đổi model/giọng mặc định, không ghép âm tiết Pinyin thành lời nói.
10. Ghi rõ đã kiểm tra gì và còn chưa biết gì; ưu tiên thử vừa đủ theo yêu cầu tiết kiệm của người dùng.
