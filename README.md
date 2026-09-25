# Đảo nhỏ — Hoa ngữ Đài Loan

Ứng dụng học local cho Windows, UI tiếng Việt. **Bản đang phát triển, chưa đạt nghiệm thu Windows v1.** Gói v5 có 12 đơn vị/48 bài, 240 từ, animation 294 chữ, ghép Pinyin với audio local và tab Ngữ pháp 24 mục/96 bài tập. Phần lớn nội dung chưa giáo viên duyệt; chấm viết tay vẫn giới hạn 12 chữ. Người dùng đã xác nhận nghe câu mới, ghi âm và nghe lại offline được; ASR còn sai và giọng đọc chưa tự nhiên.

## Dùng hằng ngày

Nhấp đúp **Start.cmd** trong thư mục này. Trình duyệt mở **http://127.0.0.1:8765**. Chỉ có một dịch vụ; không cần mở VS Code hoặc Vite. Giữ cửa sổ dịch vụ trong lúc học. Trong Cài đặt, chọn **Dừng dịch vụ** để đóng cả model.

Tiến độ nằm trong `data/learning.sqlite3`. Tải sao lưu ở Cài đặt; phục hồi cũng tại đó. Mỗi thiết bị dùng SQLite, không phụ thuộc cache trình duyệt. Không chia sẻ thư mục data nếu có thông tin cá nhân.

Trong **Học**, chọn từng chữ cạnh từ để xem nét; tổng kết có nút chuyển bài/chủ đề và giữ tiến độ cũ. Trong **Phát âm**, chọn thanh mẫu/vận mẫu/thanh rồi nghe âm tiết hoặc đánh vần. Mẫu âm tiết bổ sung là Quan thoại chưa xác minh vùng giọng; âm thiếu báo thiếu. Trong **Ngữ pháp**, học và lưu tiến độ riêng, xem kiến thức tiên quyết; lộ trình 27 lô B2 là kế hoạch biên soạn, chưa phải nội dung B2 hoàn thành. Xem [nguồn/giấy phép tài sản](public/learning/ATTRIBUTION.md).

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

Nút nghe cạnh Hán tự hoặc Pinyin đọc nguyên từ/cụm/câu. Chọn giọng và nhịp trong Cài đặt hoặc mục **Phát âm**. Mục Phát âm có bài đối chiếu biến điệu, thanh nhẹ và nhịp câu; âm TTS chưa được chứng nhận phát âm chuẩn. Đã bỏ câu gợi dẫn ASR gây lặp transcript; cần thu lại câu để kiểm tra trên micro thật sau khi cập nhật.

Model đang chọn: Qwen3-4B Q4_K_M trên CUDA 12.4; Whisper small đa ngôn ngữ trên CPU. Có thể chuyển LLM sang CPU hoặc ASR về base trong Cài đặt. Small sửa được một số lỗi từ trong thử nghiệm, chậm hơn và vẫn có Giản thể. Tài sản ứng dụng khoảng 8,27 GB/10 GB, gồm cả model/runtime thử nghiệm, public/dist/cache và backup; đo ngày 25/09/2026. Số đo và giới hạn chất lượng ở [BENCHMARKS](docs/BENCHMARKS.md).

Xem [TASKS](docs/TASKS.md), [ENVIRONMENT](docs/ENVIRONMENT.md), [DECISIONS](docs/DECISIONS.md), [CONTENT_GUIDE](docs/CONTENT_GUIDE.md) và [PLAN](docs/PLAN.md) để tiếp tục.
