# Giáo trình PC mới — 10/11/2026

Trạng thái: đã triển khai PC, build và kiểm tra tập trung đạt; đã sao lưu/reset dữ liệu thật ngày 10/11/2026. Nội dung chưa được giáo viên thẩm định.

### Chấm đáp án mở — 12/11/2026

Thay trạng thái “cần đối chiếu” của lượt mới bằng chấm đúng/sai ngay trong bài. Đáp án khác mẫu gọi Qwen local, nhận diễn đạt tương đương nếu đúng nghĩa và phù hợp câu khuyết. Khung xanh: đúng; đỏ: chưa đúng, kèm lý do. Đáp án khớp mẫu chấm trực tiếp; lựa chọn đóng giữ quy tắc có sẵn. Khi model lỗi/bận, giữ nháp để thử lại hoặc bỏ qua, không tự ghi sai. Lượt cũ chưa chấm có nút chấm AI tại phản hồi. Cần runtime/model local đã cài; không thêm dịch vụ mạng hoặc cập nhật mobile.

### Đính chính nội dung v2 — 10/11/2026

Phản hồi thực tế phát hiện câu ghép vô lý dù kiểm tra số lượng/độ khó đạt. V2 rà các khung và nhóm thay thế cho toàn bộ 18 chủ đề, sửa nghĩa theo ngữ cảnh, thay nhóm lời lịch sự, loại câu mâu thuẫn/lặp vai trò, loại câu tự hỏi nghề và các từ rời lẫn vào bài tập câu. Bộ tạo dữ liệu vẫn yêu cầu đủ câu cho cả 90 bài sau khi loại; danh sách loại có lý do ở `data/learn-course-editorial-exclusions.json`. Các con số 4.240 câu bên dưới là mốc v1, không dùng để đánh giá chất lượng v2.

Đối chiếu cách dùng đại từ với [MOE: 您](https://dict.variants.moe.edu.tw/dictView.jsp?ID=15128) và [MOE: 老師](https://dict.revised.moe.edu.tw/dictView.jsp?ID=60442&q=1&word=31): 您 là ngôi thứ hai kính trọng, không tự gán người nghe là giáo viên. Câu 您是老師嗎 dịch “Anh/chị có phải là giáo viên không?” khi chưa biết nghề; không dịch thành hỏi “thầy/cô là giáo viên?”. Nguồn này giải thích cách dùng từ, không phải nguồn chứng thực mọi câu dự án soạn.

Lượt v1 giữ nguyên dữ liệu nhưng giao diện mời bắt đầu bộ v2, backend chặn tab cũ ghi tiếp. Không reset tiến độ/flashcard. Ví dụ bài quy tắc đọc bản sửa hiện tại; bộ câu quy tắc có ID thay đổi mở lượt mới. Sau cập nhật tải lại #learn bằng Ctrl+F5.

## Hợp đồng nội dung

18 chủ đề × 5 bài cùng cấu trúc: từ mới, hai cấu trúc/câu mẫu, luyện tập và kết quả. Nhóm nhập môn 7 từ/15 câu; nhóm thường 10 từ/20 câu; nhóm rộng 15 từ/25 câu. Năm dạng chia đều: Hán tự chọn nghĩa Việt, điền câu, nghe câu chọn chỗ khuyết, Việt→Trung (chọn và tự gõ), Trung→Việt. 80% nhiệm vụ là câu. Không bù thiếu câu bằng dịch từ. Có ít nhất hai bộ tương đương và câu mẫu tách câu luyện.

Vốn từ: đầu bài hiện tại, bài đã hoàn tất trong giáo trình mới, dấu tự học chủ động. Flashcard không cấp vốn từ. Tối đa 2/3 từ bổ sung theo mức bài, ít nhất 2/3 mục từ thuộc vốn được phép. Tự gõ Việt→Trung vẫn cho từ bổ sung theo yêu cầu; nút Từ hỗ trợ chỉ mở các từ đó. Kết thúc bộ, kể cả sai/bỏ qua, tự cấp toàn bộ từ đầu bài; không đồng nghĩa thành thạo. Dịch khác mẫu là cần đối chiếu.

## Giao diện

Thẻ đầu bài có loa và Thêm thẻ/Đã có, không có nút đánh dấu. Nét chữ tự chạy, bỏ điều khiển trong thẻ gọn. Thành phần chữ ghi ngắn, ví dụ 好: 女 nữ · 子 tử. Đáp án Hán tự: click chọn và đọc, hover/focus hiện Pinyin; bỏ các nút phụ chỉ ở lựa chọn. Tra từ trong bài mới cho đánh dấu chủ động. Giữ bốn lựa chọn 2×2 và lưu nháp.

## Reset và tương thích

Chỉ PC. Không sửa bộ đề #skills hoặc APK. Giáo trình có namespace/version riêng, không ghi đè foundation. Sau kiểm tra, backup đầy đủ rồi reset một lần toàn bộ #learn, dấu tự học và bằng chứng tự động cũ. Giữ nguyên cards/FSRS, ghi chú, cấu hình, ghép cặp, #skills/ngữ pháp riêng. Mốc reset chặn tab cũ hồi sinh tiến độ. Kiểm tra trên bản sao trước; lưu báo cáo hash dữ liệu được giữ và đường dẫn backup. Chưa reset nếu build/kiểm tra hoặc nội dung chưa đạt.

## Nghiệm thu

Kiểm tra 90 bài, tỷ lệ dạng câu, từ/cấu trúc được phép, không lặp ví dụ, đủ hai bộ; UI/audio/hover/tra từ/nháp/hoàn tất; reset idempotent và dữ liệu ngoài phạm vi không đổi. Ghi kết quả thật vào TASKS, không đồng nhất test với giáo viên thẩm định.

## Kết quả và cách mở bản mới

90 bài, 960 vị trí từ/cụm (713 mục khác nhau), 4.240 câu luyện khác nhau. Các câu dùng khung biên soạn với cụm thay thế được chỉ định; đây là ngân hàng hữu hạn, không phải AI sinh câu vô hạn. Câu mẫu bị loại khỏi toàn bộ ngân hàng luyện; mỗi lượt không lặp câu, ưu tiên tránh hai lượt gần nhất khi đủ. Bộ quy tắc bổ sung vẫn riêng. Không thay nội dung #skills hoặc cài mobile trong phase này.

Dịch vụ PC đã được mở lại. Tải lại trang `http://127.0.0.1:8765/#learn` (Ctrl+F5 nếu còn giao diện cũ). Khi máy khởi động lại, dùng `Start.cmd` như trước; không cần chạy lại reset. Chọn bài đầu của lộ trình mới để học lại. Hoàn thành nghĩa là đi hết bộ, không phải xác nhận thành thạo.

Reset ID `eca3ebff-c2eb-4222-afab-07d8ae1687bb`: 87 bản ghi bị tombstone, giữ 127 flashcard. Backup đầy đủ gồm objects/events/packages và metadata tại `data/backups/before-learn-course-eca3ebff-c2eb-4222-afab-07d8ae1687bb.json`. Báo cáo tại `data/backups/learn-course-reset-eca3ebff-c2eb-4222-afab-07d8ae1687bb.json`, chứa hash cards và toàn bộ dữ liệu ngoài #learn trước/sau. Lịch sử sự kiện vẫn giữ nhưng không cấp vốn từ trong giáo trình mới. Không dùng restore thông thường để khôi phục mốc cũ một cách ngầm định: dữ liệu cũ khác epoch không được tính lại; backup metadata được giữ cho phục hồi có chủ đích.

Build, 2 kiểm tra lõi mới, 3 backend tests và Edge qua. Cả suite src có một lỗi lookup cũ tại 格/表格; xem TASKS. Audio E2E dùng WAV im lặng ngắn, không chứng minh chất lượng phát âm. Chưa đo hiệu năng trên điện thoại, chưa sửa APK.
