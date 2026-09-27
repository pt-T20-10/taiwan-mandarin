# Nguồn và giấy phép

## Thay đổi v6 — 27/09/2026

Qwen 1.7B và Kokoro/sherpa-tts đã gỡ. Giữ giấy phép neural trong `docs/licenses/neural-tts/`, hash model đã gỡ ở MODELS-RETIRED.json và benchmark lịch sử; các dòng 1.7B dưới đây chỉ để truy vết. Qwen 4B Apache-2.0 cùng Whisper base/small và runtime CPU/CUDA tiếp tục dùng. Animation 424 chữ giữ APL/LGPL/Unihan; MOE chỉ đối chiếu. WAV MOE/MP3 Pinyin đã gỡ, thông báo CC BY/Unlicense vẫn giữ. Xem [ATTRIBUTION](../public/learning/ATTRIBUTION.md) về nguồn từng loại và [RELEASE-V6](RELEASE-V6.md) về giới hạn.


Không có CDN hoặc tài sản web từ xa trong phiên học. Các URL dưới đây dành cho cài đặt/đối chiếu khi có mạng.

| Thành phần | Nguồn | Điều kiện |
|---|---|---|
| React/React DOM | https://github.com/facebook/react | MIT; license trong node_modules và notices local |
| ts-fsrs 5.4.2 | https://github.com/open-spaced-repetition/ts-fsrs | MIT; giữ notice |
| Vite/TypeScript/FastAPI/Uvicorn | nguồn dự án chính thức, lockfiles | Công cụ/library mở; giữ license đi kèm |
| llama.cpp b11120 | https://github.com/ggml-org/llama.cpp/releases/tag/b11120 | MIT; binary và CUDA DLL từ release chính thức |
| Whisper.cpp v1.9.2 | https://github.com/ggml-org/whisper.cpp/releases/tag/v1.9.2 | MIT |
| Whisper base multilingual | https://huggingface.co/ggerganov/whisper.cpp | Model chuyển đổi do maintainer runtime cung cấp; MIT nguồn Whisper |
| Qwen3-1.7B GGUF | https://huggingface.co/Qwen/Qwen3-1.7B-GGUF | Apache-2.0; Q4 trong máy requantize từ Q8, không phải file Q4 chính thức |
| Qwen3-4B Q4_K_M | https://huggingface.co/Qwen/Qwen3-4B-GGUF | Apache-2.0; tải Q4 chính thức, SHA-256 kiểm tra theo LFS |
| NVIDIA CUDA DLL | trong official llama.cpp release | License NVIDIA đi kèm; chỉ phục vụ runtime Windows tại máy, không đổi driver |
| Microsoft JhengHei / Segoe UI / voice Windows | Windows đã cài | Dùng tại hệ điều hành, không sao chép hoặc phân phối lại font/voice |
| Văn bản bài học, mascot CSS, nét hình học | dự án tự soạn với trợ giúp AI | Không sao chép giáo trình. Chưa thẩm định; không tự gán license của tài sản ngoài |

Hash và phiên bản được ghi trong models/installed.json (local), docs/MODELS.json và các báo cáo benchmark. Không đưa model/runtime vào Git. Trước khi phân phối bộ cài cho người khác cần giữ đủ notice của binary/DLL trong gói tương ứng; dự án hiện là bản chạy cá nhân tại máy.
