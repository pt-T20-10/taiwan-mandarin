# Đo thực tế tại máy — 23/09/2026

> Trạng thái v6 ngày 27/09/2026: 1.7B/Kokoro đã gỡ; các số đo của chúng bên dưới là lịch sử. Giữ Qwen 4B CPU/CUDA, Whisper base/small và zh-TW. Smoke sau dọn model: CPU 34.706 ms, CUDA 9.409 ms gồm nạp model/toàn bộ trả lời, không benchmark thống kê. Xem benchmark-v6-4b-smoke.json, benchmark-v6-native-tts.json và RELEASE-V6.md; không suy chất lượng ngôn ngữ từ việc chạy thành công.

Ryzen 5 5600H, GTX 1650 4 GB, driver 572.83, Windows 11. Có ứng dụng phát triển/trình duyệt đang chạy; đây là số đo tại phiên làm việc, không phải phòng thử nghiệm cô lập. Không có số đo nào lấy từ máy khác.

## Bổ sung giọng neural — 25/09/2026

Đã đo Kokoro v1.1 Chinese FP32 qua sherpa-onnx 1.13.8 CPU 4 luồng, 3 speaker × 3 câu; thêm Hanhan 3 câu đối chiếu. Neural mất 4,510–6,647 ms để có cả WAV gồm nạp model, cache RAM ba mẫu ~0,5 ms; không phải TTFA hoặc đánh giá tự nhiên. File [benchmark-neural-tts.json](benchmark-neural-tts.json) giữ số đo waveform và 4 transcript Whisper small thô; nam 009 có lỗi 越南 → 岳南. Không chấm phát âm bằng ASR. Chi tiết nguồn/giấy phép/hạn chế ở [NEURAL_TTS.md](NEURAL_TTS.md).

Kiểm tra hủy HTTP thật ban đầu phát hiện child tiếp tục chạy vì polling disconnect không bắt được sự kiện qua middleware. Sau khi dùng watcher ASGI receive, cùng kiểm tra thấy child thoát sau 61 ms; E2E có kiểm tra hủy tổng hợp dài trước khi phát câu khác. Đây là phép kiểm tra vận hành, không phải bằng chứng chất lượng giọng.

## LLM

llama.cpp b11120, context 4096, 6 CPU threads, một slot, tắt thinking, trả JSON không streaming. Chỉ nạp một LLM mỗi lần. HTTP tổng tính tới khi có **toàn bộ** câu trả lời, chưa đo riêng chữ đầu/TTFT.

| Thử nghiệm | Kết quả |
|---|---|
| Qwen3-1.7B Q4_K_M CPU, 30 tình huống | 30/30 HTTP 200; lượt lạnh 7.136 s; warm median 4.364 s, khoảng 2.463–10.677 s |
| Peak RSS llama 1.7B trong phép đo 30 câu | 2397.5 MiB, lấy mẫu khoảng 100 ms |
| Qwen3-4B Q4_K_M CUDA, 30 tình huống | 30/30 HTTP 200; lượt lạnh trong phép đo này 7.499 s; warm median 2.960 s, khoảng 2.349–5.154 s |
| Peak RSS llama 4B trong phép đo 30 câu | 2801.7 MiB, lấy mẫu khoảng 100 ms |
| Thử so sánh 4B CPU, 5 câu | nạp 5.513 s; trả lời 3.821–9.584 s |
| Thử so sánh 4B CUDA 12.4, 5 câu | lần khởi tạo CUDA đầu: nạp 32.067 s, câu đầu thêm 33.353 s; bốn câu sau 1.031–1.924 s |
| GPU trong thử so sánh CUDA | nvidia-smi báo 3153 MiB cho **toàn GPU**, lấy mẫu sau từng lượt; không phải phép đo peak riêng tiến trình |
| Vulkan | không đạt health trong thời hạn thử; không chọn. Không đổi driver để ép chạy |

Lần khởi tạo CUDA đầu tiên chậm hơn những lần sau; không giấu số đo này. Cấu hình đang chọn là 4B/CUDA thử nghiệm, có CPU thay thế trong Cài đặt. Khóa API ngẫu nhiên nội bộ bảo vệ cổng llama; trình duyệt chỉ gọi FastAPI.

File thô: benchmark-chat.json (1.7B), benchmark-runtime-comparison.json (prompt mới 1.7B CPU), benchmark-4b-comparison.json, benchmark-chat-4b.json. Prompt/response được giữ để đọc lại. Chúng là câu thử biên soạn, không phải dữ liệu riêng của người dùng.

### Chất lượng: CHƯA ĐẠT gia sư

1.7B thường lặp câu người dùng, sai Pinyin và dịch. 4B duy trì hội thoại khá hơn nhưng vẫn lỗi rõ: ví dụ đọc 方便 sai, dịch 星期三 thành thứ Ba, trộn Hán tự vào trường Pinyin/Việt, có câu dùng Giản thể. Không dùng model tự chấm để chứng nhận chất lượng.

Ứng dụng ghi rõ lỗi đã biết, ẩn trường Pinyin/dịch lẫn Hán tự khi phát hiện, cảnh báo ký tự có thể là Giản thể. Khi cả câu khớp mục đã có, dùng Pinyin/nghĩa trong gói kèm mức đối chiếu. Không chuyển Giản thể hàng loạt rồi coi là đúng Đài Loan. Bộ lọc không bảo đảm phát hiện mọi lỗi, và thay đổi bộ lọc sau benchmark không biến các kết quả cũ thành tốt hơn.

## ASR và TTS

**Phản hồi người dùng 24/09/2026:** đã ngắt Internet, đổi câu mới và nghe được; ghi âm/nghe lại được. Nhận dạng sai, transcript lặp một phần câu ngữ cảnh của Whisper; người dùng còn báo giọng đọc rời. Đây là bằng chứng thực tế khiến cấu hình --prompt bên dưới bị rút lại, dù số đo trên âm tổng hợp tốt hơn. Chưa có file micro thật để chạy lại cùng đầu vào.

- Whisper.cpp v1.9.2 + base đa ngôn ngữ, CPU. SHA trong docs/MODELS.json và models/installed.json.
- File im lặng tổng hợp 5 giây PCM16/16kHz/mono ban đầu bị nhận dạng thành một câu không có thật, inference 4.649 s. File thô benchmark-asr-silence.json.
- Đã thêm cổng RMS cho im lặng/âm quá nhỏ; chạy lại trả transcript rỗng với thông báo, không gọi model. File benchmark-asr-silence-after-fix.json và regression test backend. Đây không phải benchmark 40 mẫu tiếng nói, không phải chấm phát âm.
- Đầu phiên thiếu zh-TW; kiểm tra lại cuối phiên System.Speech có Microsoft Hanhan Desktop, Edge có Hanhan/Yating/Zhiwei local. Người dùng chưa thử micro/loa offline; không có đánh giá nghe bằng người thật.
- Đã chạy 40 câu bằng Hanhan Desktop → WAV → PCM16 mono/16kHz → Whisper thật. Không giữ WAV sau thử. Bản trước thêm ngữ cảnh: TTS median 420.5 ms, ASR median 1088.5 ms; lỗi ký tự thô 6.63%. Bản có ngữ cảnh Phồn thể: TTS median 542 ms, ASR median 1543 ms, lỗi ký tự thô 4.97%. Lượt sau chạy cùng lúc Edge E2E nên không quy mọi chênh lệch tốc độ cho prompt. File benchmark-audio-synthetic.json và benchmark-audio-synthetic-context.json.
- Đây là **âm thanh tổng hợp**, không phải 40 mẫu micro của người học hoặc 30 câu được nghe duyệt. Thời gian TTS tới khi WAV hoàn tất, không phải lúc loa bắt đầu phát. Lỗi ký tự tính cả khác biệt Giản/Phồn và chữ số; chưa chuẩn hóa các trường hợp ngôn ngữ tương đương. Có lỗi thật như 郵局 → 有局, 圖書館借書 → 圖書管界書, 捷運站見 → 捷運戰艦.
- Pilot 10 câu thêm ngữ cảnh Phồn thể giảm lỗi từ 20 xuống 15 ký tự; chọn mẫu sau khi xem baseline, không gọi là tập kiểm định độc lập. Không đưa đáp án vào prompt, không chuyển Giản thể hàng loạt sau ASR. Có bản so sánh đầy đủ 40 câu sau pilot.
- Các số đo có ngữ cảnh hiện chỉ là lịch sử thử nghiệm. Bản sửa bỏ prompt hoàn toàn, cho phép chọn giọng/nhịp đọc và có 11 ca nghe biến điệu; không tuyên bố việc đổi tốc độ làm giọng tự nhiên hoặc sửa mọi lỗi nhận dạng.
- Browser E2E ghi âm dùng thiết bị giả của Edge và ASR/LLM fixture gắn TEST chỉ trong test. Đã kiểm tra ghi → dừng → nhận dạng → sửa transcript → gửi → lưu; không gọi đó là kiểm thử micro/loa thật.

## Offline và hiệu năng học

Browser test chặn mọi URL ngoài loopback và đi qua các màn hình học/ôn/tra/cài đặt; không quan sát request ngoài máy. Đây là kiểm tra chặn mạng ở trình duyệt, không phải đã rút mạng Windows trong một buổi học thật. LLM/ASR không có client dịch vụ cloud; TTS từ chối voice online hoặc zh-CN.

Build thành công; 11 backend tests, 14 core/adapter tests, 21 Edge E2E đã qua ở các lượt ghi trong TASKS. Bao phủ cả 48 bài, dữ liệu/IME/hủy TTS/luyện nét, phát WAV native thật trong browser chặn mạng ngoài. Chưa công bố latency <200 ms cho mọi thao tác vì chưa có phép đo riêng đầy đủ.

## Độ bền 15 phút

scripts/soak_chat.py đã hoàn tất hội thoại chữ theo kịch bản 15 phút: `complete=true`, `elapsed_seconds=900.0`, 28/28 HTTP 200; file docs/benchmark-soak.json. Không thay thế buổi hội thoại micro/TTS 15 phút mà PLAN yêu cầu.

Thử hủy trong lúc model đang nạp: API hủy trả trong 0.013 s, lượt chat trả 409 như dự kiến, model dừng. Lượt kế tiếp trả HTTP 200 sau 8.860 s (gồm nạp lại), unload cuối trả trạng thái không còn chạy. File benchmark-runtime-recovery.json; không có dữ liệu học bị ghi từ phép thử này.

## Dung lượng

### Cập nhật ASR ngày 24/09

Đã so sánh Whisper base và small đa ngôn ngữ trên cùng 12 WAV tổng hợp Hanhan, không dùng prompt. Đây là tập thăm dò có các ca lỗi đã biết, không phải kiểm định giọng người học.

| Model | Median toàn tiến trình | Peak RSS lấy mẫu | Lỗi ký tự thô |
|---|---:|---:|---:|
| base | 995 ms | 301.2 MiB | 15.32% |
| small | 3063 ms | 766.1 MiB | 18.55% |

Không giấu việc CER thô tăng: small trả Giản thể thường hơn, và chỉ số này tính cả Giản/Phồn, 台/臺, chữ số 3/三. Đọc thủ công output cho thấy small sửa các lỗi từ thật 越男人 → 越南人, 圖書管界書 → 圖書館借書, 有局 → 郵局, 捷運戰艦 → 捷運站見, 想再加休息 → 想在家休息. Chọn small cho lần thử micro tiếp theo vì các lỗi nội dung này, chấp nhận chậm hơn và giữ cảnh báo Giản thể; có base để người dùng đổi lại. Chưa tuyên bố small tốt hơn trên mọi người nói.

File thô: benchmark-asr-models.json. Model official ggml-small.bin 487601967 bytes, SHA-256 trong MODELS.json. Tổng thư mục quản lý sau tải ~8.107 GB, dưới 10 GB.

Kiểm tra API đang chọn small: benchmark-audio-small-regression.json ghi 11 WAV mới, chọn rate -2 hoạt động, im lặng trả rỗng. Câu tổng hợp “我是越南人，我是留學生。” trả đúng chữ trong ~3.034 s inference. Đây không phải bản ghi micro người dùng; chưa đánh giá bằng nghe biến điệu hay độ tự nhiên.

Trước khi thêm Whisper small: models ~5.587 GB, runtime ~2.030 GB, tổng ~7.62 GB. Sau thêm small tổng ~8.107 GB. Có cả Q8 nguồn, ứng viên 1.7B, ZIP tải và Vulkan thử; không giấu tài sản này khỏi tổng. node_modules/.venv là công cụ phát triển, không tính vào phép cộng trên theo PLAN. Không lưu lâu bản ghi micro.
