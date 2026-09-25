# Giọng neural offline để so sánh — 25/09/2026

Người dùng ưu tiên độ tự nhiên và đã đồng ý thêm giọng Quan thoại phổ thông có nhãn thật để so sánh. Không thay Qwen/Whisper hoặc tự đổi lựa chọn giọng đã lưu. Giọng Windows zh-TW vẫn có đủ; `auto` vẫn chỉ tự chọn zh-TW local.

## Sử dụng

Trong Cài đặt hoặc Phát âm, sửa **Câu so sánh giọng**, bấm **Nghe giọng đang chọn**, rồi nghe thử Kokoro nữ 001/nữ 002/nam 009. Nghe thử không ghi settings; **Dùng giọng này** mới lưu qua cơ chế CAS hiện có. Giọng đã lưu áp dụng cho từ/cụm/câu, ngữ pháp và hội thoại. Bản thu Pinyin độc lập, không bị thay bằng TTS. Nhịp thường được khuyên dùng để so sánh; nhịp chậm không tự sửa thanh điệu.

Gói Windows Chinese (Traditional, Taiwan) có ích để cung cấp Hanhan/Yating/Zhiwei local. Gói này không biến giọng legacy thành neural. Giọng Natural của Narrator là tính năng riêng, không mặc nhiên dùng được qua System.Speech hoặc browser SpeechSynthesis. Tham khảo [Microsoft: các ngôn ngữ và giọng](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-a-supported-languages-and-voices).

## Tài sản và giấy phép

| Thành phần | Phiên bản / nguồn | Giấy phép |
|---|---|---|
| Kokoro Chinese | [hexgrad/Kokoro-82M-v1.1-zh](https://huggingface.co/hexgrad/Kokoro-82M-v1.1-zh), 82M tham số; bản ONNX FP32 bên dưới | Apache-2.0 |
| Model ONNX, voices, lexicon, FST | [kokoro-multi-lang-v1_1.tar.bz2](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_1.tar.bz2); archive 364,816,464 byte, giải nén 426,654,376 byte | LICENSE Apache-2.0 kèm archive; eSpeak data giữ giấy phép riêng |
| Bộ chạy Windows CPU | [sherpa-onnx v1.13.8 win-x64 shared MD Release](https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.13.8/sherpa-onnx-v1.13.8-win-x64-shared-MD-Release.tar.bz2); archive 20,494,724 byte, file giữ lại 40,995,840 byte | sherpa-onnx Apache-2.0 và các dependency riêng |
| ONNX Runtime | Microsoft v1.28.2; [cấu hình bản build sherpa](https://github.com/k2-fsa/sherpa-onnx/blob/v1.13.8/cmake/onnxruntime-win-x64.cmake) | MIT + ThirdPartyNotices |
| eSpeak NG / dữ liệu phonemizer | [csukuangfj/espeak-ng commit ed530aa113046142eb5115cf2fc9157854d0ffe1](https://github.com/csukuangfj/espeak-ng/tree/ed530aa113046142eb5115cf2fc9157854d0ffe1), nguồn theo CMake sherpa | GPL-3.0; không gán toàn bộ runtime/dữ liệu là Apache |
| Piper phonemize | [commit f3ff95afc03640bc1399e113e83361192a2fafb4](https://github.com/csukuangfj/piper-phonemize/tree/f3ff95afc03640bc1399e113e83361192a2fafb4) | MIT; eSpeak đi kèm có giấy phép riêng |

Lưu bản giấy phép và thông báo tại [licenses/neural-tts](licenses/neural-tts). Model/runtime tải trực tiếp từ upstream vào thư mục ignored, không được commit hoặc phân phối trong Git. Các dependency và nguồn tương ứng được ghi để giữ attribution khi tiếp tục đóng gói; chưa tạo bộ cài phân phối.

SHA-256 archive model: `a3f4c73d043860e3fd2e5b06f36795eb81de0fc8e8de6df703245edddd87dbad`.

SHA-256 archive runtime: `3e971a04b2e0ba4dfa53d381a006367ce8c9f5f09b4ae00043e9845c2baded22`.

Script `scripts/setup_neural_tts.py --download` yêu cầu tải tường minh, tái sử dụng archive có hash đúng, kiểm tra ngân sách 10 GB/dung lượng trống và đường dẫn giải nén. Manifest hash từng file được lưu tại `models/kokoro-installed.json`. Không cần pip thêm gói hay thay môi trường Python. Trên máy hiện tại đã cài, không cần chạy lại.

## Cách chạy và kiểm thử

- [Bảng speaker và sample upstream](https://k2-fsa.github.io/sherpa/onnx/tts/all/Chinese-English/kokoro-multi-lang-v1_1.html): SID 3 = zf_001, 4 = zf_002, 58 = zm_009. Đây là lựa chọn nghe so sánh, chưa xếp hạng chất lượng.
- `backend/neural_tts.py`: CPU 4 luồng, WAV PCM16 mono 24 kHz; đưa nguyên câu Phồn thể vào model, không đổi chữ người dùng. FST số/ngày của nguồn; từng lần gọi giữ cả ngữ cảnh, runtime chia batch câu theo giới hạn model.
- Khởi động tiến trình cho mỗi câu mới; không giữ thêm model trong RAM giữa các câu. Tối đa một lượt TTS đồng thời, chờ có thể hủy. Timeout neural 90 giây, hủy sẽ kill/wait tiến trình và xóa thư mục tạm. Browser hủy cả request đang nhận body; đổi âm/giọng hoặc dừng không để audio cũ phát muộn.
- Kiểm tra HTTP disconnect thật phát hiện polling `is_disconnected()` không bắt được tín hiệu qua middleware hiện có. Đã thay bằng task chờ sự kiện ASGI `http.disconnect`; thử lại tiến trình thật thoát sau 61 ms. E2E thêm kiểm tra nhấn Dừng khi đang tổng hợp câu dài và tiến trình tương ứng phải biến mất, rồi phát câu khác thành công. Test mô phỏng riêng không đủ xác nhận đường này.
- Cache WAV tối đa 48 mục / 16 MB trong RAM, khóa theo nguyên câu + giọng + tốc độ. Không ghi câu/audio người dùng xuống đĩa để cache. Cache mất khi dừng dịch vụ. Thiếu giọng/model hoặc chữ OOV báo lỗi, không âm thầm chuyển sang giọng khác.
- `scripts/benchmark_neural_tts.py` tạo 12 WAV thật: 3 câu × (3 neural + Hanhan). Kết quả thô ở [benchmark-neural-tts.json](benchmark-neural-tts.json). Kokoro 4,510–6,647 ms toàn bộ tạo WAV gồm nạp model; 24 kHz, không clipping trong 9 mẫu. Cache ba mẫu 0,5 ms. Đây không phải độ trễ âm thanh đầu tiên.
- Whisper small nhận lại 1 câu mỗi giọng, không dùng prompt. Nữ 001/002 có khác chữ Phồn/Giản; nam 009 có `越南 → 岳南`. Giữ nguyên kết quả, không lọc để làm đẹp. ASR không xác nhận biến điệu hoặc độ tự nhiên.
- Lexicon có đủ 294 Hán tự trong bộ từ, nhưng độ phủ chữ không đảm bảo đọc đúng từ đa âm. Nguồn có mục `呣 ❓` không thuộc 294 chữ, gây cảnh báo token lúc nạp; không sửa dữ liệu nguồn để che cảnh báo.

## Hạn chế

Chưa có đánh giá nghe của người dùng/giáo viên cho giọng mới. Kokoro là Quan thoại phổ thông, chưa xác minh giọng Đài Loan, và có thể sai đa âm/biến điệu/tên riêng, số hoặc đoạn trộn ngôn ngữ. Không coi neural là audio đáp án chuẩn. Cảm giác trôi chảy phải được so sánh bằng tai trên câu thực tế. Chưa hoàn tất bộ 30 câu TTS nghe duyệt, 40 câu micro thật hoặc buổi hội thoại giọng 15 phút.

Chạy inference chỉ dùng tài sản trên máy. E2E chặn mạng ngoài loopback ở browser; đây không phải phép thử ngắt mạng vật lý hay audit mọi kết nối hệ điều hành.
