# Quy tắc dự án

- Đọc docs/PLAN.md, docs/TASKS.md và docs/DECISIONS.md trước khi tiếp tục.
- Windows trước; Android/đồng bộ sau. Giữ adapter lưu trữ, audio, AI và lõi học độc lập UI.
- UI tiếng Việt; Hoa ngữ Phồn thể Đài Loan, Pinyin có dấu. Không lộ đáp án khi chưa nộp/xin gợi ý.
- Không cloud, API trả phí hoặc CDN trong phiên học. Không giả chất lượng AI/giọng/nội dung; ASR không chấm thanh điệu.
- Bảo toàn dữ liệu; migration, ID ổn định, sự kiện chống trùng, backup/restore.
- Python: gọi trực tiếp .venv\Scripts\python.exe; không sửa môi trường global.
- Không commit .venv, model, runtime tải về, database, ghi âm, cache, bí mật.
- Khóa dependency. Ghi kiểm tra thực chạy và hạn chế vào docs/TASKS.md; không tuyên bố Windows v1 xong khi chưa đạt PLAN.
- Không push/deploy. Không sửa driver, registry hoặc cấu hình global.

## Lệnh đã kiểm tra

- `npm.cmd ci`; `npm.cmd run build`; `npm.cmd test`; `npm.cmd run test:e2e`.
- `.venv\Scripts\python.exe -m pytest -q`; `npm.cmd run content:check`.
- `Start.cmd` mở dịch vụ + browser 127.0.0.1:8765; `npm.cmd run server` không mở browser.
- E2E dùng Edge/port 8767/data/e2e; media và AI fixture TEST chỉ dùng trong E2E.
- Không nâng nhãn Windows v1 hoặc source-checked chỉ vì test pass. Xem docs/BENCHMARKS.md về lỗi AI đã phát hiện.
- Sửa văn bản Unicode qua apply_patch hoặc file UTF-8; không pipe mã Python chứa tiếng Việt qua PowerShell với encoding mặc định.
