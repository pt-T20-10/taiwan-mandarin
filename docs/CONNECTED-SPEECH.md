# Ưu tiên: audio đọc liền và biến điệu

Ngày 30/09/2026. Người dùng xác nhận **hầu hết ví dụ trong Quy tắc đọc liền đều rời từng âm**. Chức năng phát audio chạy được nhưng chất lượng để dạy đọc liền chưa đạt. Đây là vấn đề trọng tâm, ưu tiên trước mở rộng nội dung hoặc AI tạo đề.

## Kết quả điều tra

- Cấu hình đọc đang lưu: `browser:Microsoft Yating - Chinese (Traditional, Taiwan)`, nhịp `normal`. Qwen sinh văn bản và Whisper nhận dạng không tạo âm thanh này.
- `Pronunciation.tsx` gửi cả `item.hanzi` hoặc cả `item.context` qua `Speak`; `local.ts` tạo một `SpeechSynthesisUtterance` với nguyên chuỗi. Không thấy vòng lặp tách chữ hoặc nối WAV từng âm trong đường chạy này.
- `item.spoken` là ghi chú trên màn hình, không phải đầu vào kiểm soát phát âm. Bộ đọc tự quyết định biến điệu, thanh nhẹ và nhịp; ứng dụng hiện chưa có cơ chế bảo đảm âm thanh khớp quy tắc đang dạy.
- Các kiểm tra cũ chỉ chứng minh có WAV, playback tiến triển, hủy được và gửi đúng chuỗi/giọng. Chúng **không nghiệm thu biến điệu hoặc độ tự nhiên**. Phản hồi nghe của người dùng là lỗi chất lượng còn mở.

## Thử nghiệm nhỏ trên giọng native có sẵn

Không đổi cấu hình Yating hoặc dữ liệu học. Thử riêng Microsoft Hanhan Desktop để xem khả năng xử lý SSML của đường native:

1. Văn bản `你好，我要一杯茶。我不要冰。`: tạo được WAV 180.450 bytes.
2. Cùng văn bản bọc hai thẻ câu `<s>`: WAV giống hệt cả hash `63d864186378106ff43d6f85e2d54d9318bc4d8d7fa407ce186a9167dc1c240f`. Bọc ranh giới câu như vậy không cải thiện audio trong mẫu thử này.
3. Thử phoneme IPA có ký hiệu đường nét thanh điệu cho `你好`: native API từ chối thuộc tính phoneme. Đây chỉ là kết quả của chuỗi IPA/máy/giọng đã thử, không chứng minh mọi biến thể SSML hoặc mọi giọng đều không hỗ trợ.

Script/kết quả/WAV local: `data/probe-connected-speech.ps1`, `data/connected-speech-probe/`. Không xuất bản các WAV này thành mẫu đúng. Chưa đo/đối chiếu được âm thanh Yating người dùng đang nghe; chưa xác định lỗi âm học từng ví dụ.

## Hướng giải quyết và tiêu chí nghiệm thu

- Riêng 11 ví dụ cố định: cần bản thu nguyên cụm/câu giọng Đài Loan có nguồn và được nghe đối chiếu, hoặc TTS thay thế thực sự vượt kiểm tra trên chính các ví dụ này. Không ghép âm tiết bảng Pinyin thành lời nói, không đổi chữ sang từ đồng âm để ép TTS, không xem chỉnh tốc độ là sửa biến điệu.
- Với câu mới trong toàn ứng dụng: cần đánh giá TTS có khả năng xử lý ngữ cảnh và điều khiển phát âm. BreezyVoice của MediaTek là ứng viên nghiên cứu vì hướng tới Hoa ngữ Đài Loan và điều khiển bằng Zhuyin; **chưa cài, chưa đo trên GTX 1650/CPU, chưa xác nhận chất lượng, dung lượng hay tương thích môi trường dự án**. Không tự thay model/giọng mặc định từ mô tả quảng bá.
- Mỗi ca phải có audio tham chiếu, bản ứng viên, vị trí âm cần nghe và kết quả nghe riêng. Gồm thanh 3+3, thanh 3 thấp, 一 trước 1/2/3/4 và trường hợp giữ nguyên, 不 đổi/không đổi, thanh nhẹ, đa âm và nhịp câu. Trọng âm/rào cản ngữ điệu phải có ngữ cảnh; không chỉ kiểm tra dấu thanh trong Pinyin.
- Người nghe đối chiếu cụm và câu ở tốc độ thường; nếu có thể dùng đường F0/thời lượng hỗ trợ phân tích nhưng không dùng ASR/transcript thay cho đánh giá thanh điệu. Lỗi hoặc chưa phân biệt được không được tự đánh dấu đạt.
- Chỉ tích hợp làm mẫu học sau khi các ca được xác nhận; giữ offline, tiến độ và lịch ôn. Chưa có bản audio thay thế được kiểm chứng nên **chưa sửa xong lỗi người dùng báo**.

## Nguồn đã đọc

- [MOE: quy tắc ghi âm đọc và biến điệu](https://dict.concised.moe.edu.tw/page.jsp?ID=55&la=0&powerMode=0): phân biệt âm cơ sở và biến điệu, có ví dụ 一/不/thanh nhẹ.
- [MOE: gói dữ liệu và audio](https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_concised_download.html): nguồn có audio, CC BY-ND 3.0 Taiwan; chưa xác nhận đủ 11 câu, không tự coi audio từ điển là mẫu hội thoại đọc liền.
- [Microsoft: AppendTextWithPronunciation](https://learn.microsoft.com/en-us/dotnet/api/system.speech.synthesis.promptbuilder.appendtextwithpronunciation): cơ chế chỉ định IPA; khả năng của giọng thực tế phải thử riêng.
- [MediaTek: BreezyVoice](https://github.com/mtkresearch/BreezyVoice): ứng viên TTS Hoa ngữ Đài Loan có điều khiển phát âm. Chưa phải lựa chọn đã nghiệm thu.
