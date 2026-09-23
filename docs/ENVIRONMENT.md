# Môi trường kiểm tra 23/09/2026

- Git root: `D:\Taiwanese App\taiwan-mandarin`; ban đầu chỉ docs/PLAN.md chưa theo dõi và .venv.
- Git 2.45.1.windows.1; Node v24.12.0; npm 11.6.2.
- .venv có CPython 3.14.3 AMD64, pip 25.3. Giữ nguyên môi trường của người dùng.
- Windows 11 build 26200; GPU GTX 1650 4096 MiB, driver 572.83 / CUDA compatibility 12.8.
- Lúc kiểm tra GPU dùng 146 MiB. D: trống 122230669312 bytes; C: trống 37918482432 bytes.
- Kiểm tra đầu phiên: System.Speech desktop chỉ David/Zira, WinRT David/Zira/Mark, Edge chưa có zh-TW local. Kiểm tra lại cuối phiên: System.Speech có Microsoft Hanhan Desktop; Edge có Hanhan/Yating/Zhiwei zh-TW local. Không do script dự án cài thành phần Windows. Dữ liệu hiện tại thay thế kết luận thiếu voice ban đầu.
- llama.cpp b11120 CPU/CUDA 12.4 và Whisper.cpp v1.9.2 chạy native trong runtime/. CUDA chạy được với driver hiện có; Vulkan thử nghiệm không đạt health. Model/hash và khóa phiên bản xem MODELS.json.
- Build bằng Vite phục vụ từ FastAPI tại 127.0.0.1:8765; Edge E2E chạy riêng 8767, dữ liệu riêng data/e2e. Không cài browser hoặc Python global.
- Native Hanhan đã tạo WAV thành công trên 40 câu và chạy qua Whisper thật; xem BENCHMARKS. Người dùng trả lời “Chưa thử” khi hỏi kiểm tra micro/loa offline; chưa trực tiếp nghe loa hoặc thử micro thật, không suy ra chất lượng audio từ kết quả kỹ thuật.
