# Ôn vận dụng theo chủ đề

Ngày 04/11/2026, bản bổ sung v2 cho foundation-tw v8. Không thay gói đã cài, ID bài học hoặc schema SQLite. V1 đã ngừng dùng vì phép thay chủ ngữ và ghép tổ hợp tạo câu thiếu ngữ cảnh như `你見面`.

## Cách mở

Hoàn thành bốn bài chính và phần 5 lượng từ/động từ nếu có. Nút **Ôn tập chủ đề · 15 câu** xuất hiện trên thẻ chủ đề, màn kết thúc bài và trang phần 5. Lượt ôn là phần tự chọn, không tăng số bài bắt buộc trong lộ trình.

Đường dẫn: `#learn/topic-review/<unit-id>`. Mở trực tiếp khi chưa hoàn thành chủ đề chỉ hiển thị hướng dẫn hoàn thành các phần còn lại.

## Một bộ 15 câu

- 4 câu đọc lấy thông tin từ hai lời nhắn, mỗi người bốn câu.
- 2 câu đối chiếu đồng thời hai thông tin của cùng người.
- 4 câu điền từ/cụm hoặc lượng từ, động từ trong yêu cầu mới.
- 3 bài viết hai câu từ tình huống tiếng Việt.
- 2 câu chọn cách nói theo yêu cầu.

Bài đọc chú thích Người A/Người B; câu trả lời Pinyin/nghĩa và nút nghe xuất hiện trong lời giải gọn. Ở bài điền/viết, không hiển thị đoạn gốc hoặc audio câu hoàn chỉnh trước khi xin gợi ý. Mở Pinyin phần đề chỉ đọc chữ đang thấy, giữ chỗ trống; không mở lời giải. Nghe hoặc mở Pinyin bài đọc ghi nhận trợ giúp cho các câu đọc dùng chung đoạn.

## Bộ mới và phạm vi từ đã học

`topicReviewBank.ts` có khung câu với các cụm thay thế cụ thể. `topicReviewScenes.ts` chỉ định trọn bộ bốn thông tin nào được đi cùng nhau. Không lấy tích mọi tổ hợp từ các cột độc lập. Ví dụ giờ tan học phải khớp giờ kết thúc của buổi học; món cơm đi cùng lượng từ cho bát cơm, không bị tự đổi thành bát mì; các ví dụ ghế, xe, thư được đặt vào bối cảnh căn phòng, nhà ga, công việc tương ứng.

Mỗi động từ dùng một câu hoàn chỉnh biên soạn sẵn, có chủ thể/đối tượng/bối cảnh cần thiết. Không thay tôi/bạn/anh ấy bằng regex, không suy câu bằng cách nối chủ ngữ + động từ, không xóa “hôm nay”, “xin”, “muốn” của câu gốc. Ví dụ `我們見面。` giữ chủ thể số nhiều sau thông tin về bạn bè/thầy cô; `我想跟你道歉。` chỉ rõ người được xin lỗi; `請幫忙。` giữ vai trò lời nhờ giúp. Không tự thêm mẫu li hợp nâng cao. Lượng từ chỉ đổi lượng một/hai trong khung danh từ đã chỉ định, kèm Pinyin/nghĩa đồng bộ, rồi được giới hạn tiếp bởi danh sách tình huống.

Tạo bộ mới chọn hai hồ sơ tình huống nguyên vẹn để đọc/đối chiếu, một hồ sơ khác cho điền/viết, rồi trộn câu hỏi và đáp án. Không tráo từng câu giữa các hồ sơ. Đây là ngân hàng hữu hạn với câu và tình huống dùng lại, không phải hệ thống sinh vô hạn cốt truyện bằng AI. Không lặp ID bộ trong vòng; hết bộ đủ điều kiện thì bắt đầu vòng mới và tránh lặp bộ vừa làm nếu có lựa chọn khác.

Từ được phép lấy từ các bài đã hoàn thành, flashcard hoạt động và dấu đã học. Từ nối lấy thêm từ các câu/giới thiệu đã học và ví dụ phần 5 đã hoàn thành. Mọi phương án thay thế phải qua bộ lọc từ đã học; không cấp quyền dùng cả chủ đề tương lai theo vị trí. Nếu không còn đủ nhóm câu hợp lệ, báo rõ từ cần đối chiếu, giữ bộ cũ và không lấp bằng từ chưa học.

Mẫu biên soạn vẫn là bản nháp, chưa giáo viên duyệt. Kiểm tra cấu trúc/từ đã học không chứng nhận chất lượng ngôn ngữ. Với bài viết, hai câu lấy từ cùng hồ sơ, khớp mẫu được ghi nhận; câu khác mẫu cần đối chiếu thay vì tự kết luận sai. Không tự công nhận mọi cách đảo thứ tự là hợp lý vì quan hệ quy chiếu/ngữ cảnh có thể thay đổi.

Nguồn đối chiếu cách dùng 見面: [Bộ Giáo dục Đài Loan](https://dict.concised.moe.edu.tw/dictView.jsp?ID=22970&la=1&powerMode=0), [mô-đun Taiwan Mandarin của TUFS](https://www.coelang.tufs.ac.jp/ja/zt/vmod/v_search_detail.php?id=903&ls=%E3%81%82&rf=3). Các nguồn này không phải xác nhận thẩm định toàn bộ ngân hàng của dự án.

## Lưu dữ liệu

Phiên `sessions/topic-review:<run>` chứa snapshot đề, thứ tự câu/đáp án, bản nháp, trợ giúp, câu trả lời và kết quả. Lịch chọn bộ ở `reports/topic-review-history:<unit>`; tạo hai bản ghi bằng transaction `/api/practice/sessions`. Đổi bộ trước khi xong giữ lại phiên cũ trong danh sách đang dở.

Bản nháp ghi theo hàng đợi, CAS version; gửi đáp án và cập nhật phiên cùng transaction qua `/api/events`, khóa `topic-review:<run>:<index>`. Nhấn nộp lặp không tạo hai lượt. Lượt ôn không đổi phiên Học hoặc lịch FSRS. Câu sai dạng đóng có thể mở lại trong Sổ lỗi sai qua snapshot của phiên.

V2 lưu `packet.revision=2` và `scene_ids`, ID bắt đầu `topic-review:v2:`. Phiên v1 giữ nguyên dữ liệu nhưng chỉ xem lại câu trả lời/bản nháp, không hiện lại mô hình câu lỗi để luyện tiếp. Backend chặn tạo/nộp lượt v1 từ tab còn giữ bundle cũ; UI hướng sang bộ v2. Sổ lỗi và thống kê không dùng lượt v1 làm căn cứ chấm, không xóa hay sửa sự kiện gốc.

Phạm vi này là web PC và giao diện web hẹp. APK companion tiếp tục chỉ ôn flashcard.
