# Đảo nhỏ — Hoa ngữ Đài Loan

Ứng dụng học local cho Windows, UI tiếng Việt. **Bản đang phát triển, chưa đạt nghiệm thu Windows v1.** Đã có gói 12 đơn vị/48 bài, 240 từ và 12 chữ luyện nét chọn lọc; phần lớn nội dung còn là bản nháp. Máy hiện có giọng Windows zh-TW Hanhan và đã chạy TTS → Whisper bằng âm thanh tổng hợp; người dùng chưa thử micro/loa offline.

## Dùng hằng ngày

Nhấp đúp **Start.cmd** trong thư mục này. Trình duyệt mở **http://127.0.0.1:8765**. Chỉ có một dịch vụ; không cần mở VS Code hoặc Vite. Giữ cửa sổ dịch vụ trong lúc học. Trong Cài đặt, chọn **Dừng dịch vụ** để đóng cả model.

Tiến độ nằm trong `data/learning.sqlite3`. Tải sao lưu ở Cài đặt; phục hồi cũng tại đó. Mỗi thiết bị dùng SQLite, không phụ thuộc cache trình duyệt. Không chia sẻ thư mục data nếu có thông tin cá nhân.

## Cài dependency/build lại

Chạy ở đúng `D:\Taiwanese App\taiwan-mandarin` bằng PowerShell:

```powershell
npm.cmd ci
.\.venv\Scripts\python.exe -m pip install -r requirements.lock
npm.cmd run build
.\Start.cmd
```

Không tự tạo lại .venv của người dùng. Interpreter hiện dùng Python 3.14.3 64-bit. Model/runtime đã tải ở máy hiện tại; script cài lại có mạng: `.\.venv\Scripts\python.exe scripts/setup_selected.py`. Xem docs/DECISIONS.md trước khi thay model.

## Phát triển và kiểm tra

```powershell
npm.cmd run server       # backend + web build, 8765
npm.cmd run dev          # Vite 5173, proxy API tới 8765, chỉ cho phát triển
npm.cmd run content:check
npm.cmd test
.\.venv\Scripts\python.exe -m pytest -q
npm.cmd run build
npm.cmd run test:e2e     # Edge headless; server riêng 8767, data/e2e
```

Test trình duyệt dùng Edge đã có, không cần tải browser khác. Test không ghi đè database học thật. Các lượt chat benchmark chạy local bằng scripts/benchmark.py; không phải chứng nhận ngôn ngữ.

## Micro và offline

Trong Cài đặt có màn hình ghi âm/nghe lại/nhận dạng, danh sách voice thực tế và thử câu mới. Cấp quyền micro cho localhost khi muốn ghi. Trên máy hiện tại không cần cài thêm voice: đã thấy Hanhan Desktop qua System.Speech và Hanhan/Yating/Zhiwei local qua Edge. Để tự kiểm tra, ngắt Internet, sửa câu thử, bấm Nghe rồi ghi 5–10 giây, nghe lại và nhận dạng. Nếu chuyển máy mà thiếu voice, cài Chinese (Traditional, Taiwan) và Speech/Text-to-speech qua Windows Settings, mở lại dịch vụ/trình duyệt. Không đổi registry hoặc dùng giọng online thay thế.

Chữ/flashcard/ghi chú dùng offline. Bài nghe cần zh-TW local; thiếu có thể bỏ qua, không tính đạt kỹ năng. ASR không phải chấm thanh điệu. AI sinh Pinyin/dịch có thể sai và không tham gia chấm bài đóng.

Model đang chọn: Qwen3-4B Q4_K_M trên CUDA 12.4; Whisper base đa ngôn ngữ trên CPU. Có thể chuyển LLM sang CPU trong Cài đặt. Tài sản ứng dụng khoảng 7,62 GB/10 GB, gồm cả model/runtime thử nghiệm. Số đo và giới hạn chất lượng ở [BENCHMARKS](docs/BENCHMARKS.md).

Xem [TASKS](docs/TASKS.md), [ENVIRONMENT](docs/ENVIRONMENT.md), [DECISIONS](docs/DECISIONS.md), [CONTENT_GUIDE](docs/CONTENT_GUIDE.md) và [PLAN](docs/PLAN.md) để tiếp tục.
