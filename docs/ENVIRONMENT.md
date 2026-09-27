# Môi trường kiểm tra 23/09/2026

## Trạng thái v6 — 27/09/2026

Chỉ còn file Qwen3-4B-Q4_K_M.gguf; giữ CPU/CUDA và Whisper base/small, không tạo lại venv hoặc tải lại model. Xóa Kokoro/runtime riêng/archive/audio Pinyin, vẫn giữ license/benchmark lịch sử. Cấu hình hợp lệ tại máy là 4B/CUDA + Whisper small. Native Hanhan tổng hợp và hủy tiến trình thật đã qua; tính tự nhiên chưa được chứng nhận. Số đo mới khoảng 5,25 GB cho bản sử dụng; các số phía dưới là lịch sử.


- Git root: `D:\Taiwanese App\taiwan-mandarin`; ban đầu chỉ docs/PLAN.md chưa theo dõi và .venv.
- Git 2.45.1.windows.1; Node v24.12.0; npm 11.6.2.
- .venv có CPython 3.14.3 AMD64, pip 25.3. Giữ nguyên môi trường của người dùng.
- Windows 11 build 26200; GPU GTX 1650 4096 MiB, driver 572.83 / CUDA compatibility 12.8.
- Lúc kiểm tra GPU dùng 146 MiB. D: trống 122230669312 bytes; C: trống 37918482432 bytes.
- Kiểm tra đầu phiên: System.Speech desktop chỉ David/Zira, WinRT David/Zira/Mark, Edge chưa có zh-TW local. Kiểm tra lại cuối phiên: System.Speech có Microsoft Hanhan Desktop; Edge có Hanhan/Yating/Zhiwei zh-TW local. Không do script dự án cài thành phần Windows. Dữ liệu hiện tại thay thế kết luận thiếu voice ban đầu.
- llama.cpp b11120 CPU/CUDA 12.4 và Whisper.cpp v1.9.2 chạy native trong runtime/. CUDA chạy được với driver hiện có; Vulkan thử nghiệm không đạt health. Model/hash và khóa phiên bản xem MODELS.json.
- Build bằng Vite phục vụ từ FastAPI tại 127.0.0.1:8765; Edge E2E chạy riêng 8767, dữ liệu riêng data/e2e. Không cài browser hoặc Python global.
- Native Hanhan đã tạo WAV thành công trên 40 câu và chạy qua Whisper thật; xem BENCHMARKS. Ngày 24/09 người dùng xác nhận nghe câu mới, ghi âm/nghe lại khi ngắt Internet được, nhưng ASR sai và giọng đọc rời; chưa đạt nghiệm thu chất lượng phát âm.
- Ngày 25/09 bổ sung Kokoro v1.1 Chinese FP32 + sherpa-onnx v1.13.8 CPU 4 luồng, standalone trong models/kokoro-v1.1-zh và runtime/sherpa-tts. Không cài pip thêm, không đổi Qwen/Whisper/Windows voices. Tài sản quản lý khoảng 9,13 GB; chi tiết/hash/giấy phép ở NEURAL_TTS.md. Windows hiện có zh-Hant-TW; giọng Hanhan/Yating/Zhiwei là lựa chọn local cũ, chưa được nâng chất lượng chỉ nhờ cài language pack.
