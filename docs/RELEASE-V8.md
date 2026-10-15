# V8: học từ trong ngữ cảnh, sửa lỗi và luyện viết

Ngày 15/10/2026. Thay đổi local, không push.

- Dùng chung StudyCard/StudyText/LearningGuide cho Học, lượng từ, động từ và 36 bài ngữ pháp. Tra từ mở dialog tại chỗ, Pinyin/nghĩa/nghe/cấu tạo/nét/luyện viết. Hoạt ảnh nghỉ 2,5 giây và ngừng khi ngoài vùng nhìn thấy. Nguồn chuyển sang Cài đặt → Tài sản học.
- `scripts/build_lookup.py` đóng gói 786 mục và 2.415 chuỗi; bao phủ Hán tự trong 144 câu hội thoại và 108 ví dụ ngữ pháp. Một số chuỗi ghi chú, mảnh bài tập ngoài các đoạn này còn chữ chưa phân đoạn; báo cáo kỹ thuật ở `data/lookup-missing.json`. Dữ liệu ngôn ngữ là bản nháp, chưa giáo viên duyệt.
- Thay bài phân loại động từ bằng tình huống thực tế; thay câu hỏi tên cấu trúc trong foundation. Câu đổi có ID mới, giữ `retired_exercises`; phiên bị ảnh hưởng yêu cầu bắt đầu phiên mới và lưu bản cũ trong namespace archive.
- Sổ lỗi gộp theo ID nội dung bất biến, Cần sửa/Đã sửa. Sửa đúng độc lập ghi event `mistake-repair` cùng report `mistake:<id>` trong transaction; điểm cũ/lịch FSRS giữ nguyên. Sai lại mở lại cùng mục.
- Luyện viết dùng mẫu nét thật, chọn chữ trong từ, xem/tô/tự viết, phản hồi hướng/điểm đầu/hình nét, hoàn tác và gợi ý. `writing:<char>` lưu số lượt hoàn tất/có trợ giúp; không lưu audio micro.
- Thêm 209 mẫu nguồn có giấy phép; 17 chữ thiếu và mức đối chiếu ở `v8-assets.json`. Mẫu mới chưa đối chiếu từng chữ với MOE. Không tuyên bố chấm thư pháp.
- SQLite schema giữ nguyên; nâng gói bằng `scripts/upgrade_bundled.py --apply` qua API, có backup và so sánh toàn bộ state.

Kiểm tra tập trung: build; core lookup/ngữ cảnh/ma trận/hướng nét và hợp đồng bài động từ; backend nâng v7→v8 và chống nộp trùng; E2E tra từ/luyện viết/mobile, gộp lỗi→sửa→reload→sai lại. Không chạy benchmark AI. Bundle JS tăng do ngân hàng tra từ offline; Vite cảnh báo kích thước chunk, không phải lỗi build.
