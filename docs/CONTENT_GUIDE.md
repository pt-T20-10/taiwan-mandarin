# Quy tắc nội dung

## Bổ sung v7 — 29/09/2026

720 bài tập/72 bài, 216 bộ luyện/1.620 câu-lượt; hội thoại 18 chủ đề đủ 8 câu. `practice_scenarios.py` chứa 54 tình huống và cụm đã ghi Phồn thể/Pinyin/nghĩa; `practice_dialogues.py` nối đúng hội thoại cũ. Rà cụm trong khung câu, nghĩa, đáp án/căn cứ và các trường hợp phi lý (mang thực đơn tới quán, vừa đến nơi đã về nhà); đã sửa các trường hợp này. Chưa có giáo viên duyệt, không nâng source-checked. Các khung đọc/nghe luyện kế hoạch, thông tin, quan hệ người đi cùng và mục đích chính; chưa thay cho giáo trình đọc mở rộng. Xem [RELEASE-V7](RELEASE-V7.md) về thiết kế, kiểm tra và giới hạn AI.

Toàn bộ 540 bài tập cũ/18 chủ đề khóa bằng fixture v6, ID giữ nguyên. Bài mới theo lesson giữ `.v7.extraN`, bộ Skills theo chủ đề/kỹ năng/số bộ/câu. AI có ID riêng và nhãn chưa kiểm chứng. Khác biệt Hán tự giữ khi chấm; gợi ý nghĩa không được tự hiện câu hoàn chỉnh/audio đáp án trước nộp. Pinyin bảng bốn thanh và tab Viết chữ không đổi trong v7; bản thu riêng đã được khôi phục theo yêu cầu ngày 28/09.

## Nội dung hiện tại v6 — 27/09/2026

- 18 chủ đề, 72 bài, 360 mục từ, 36 ngữ pháp; 540 bài tập trong bài và 144 bài ngữ pháp riêng. 12 chủ đề/24 grammar cũ giữ nguyên nội dung/ID, khóa bằng hash fixture.
- Sáu chủ đề mới: sức khỏe, thuê nhà, dịch vụ, công việc, du lịch, giao tiếp xã hội. Mỗi chủ đề 20 từ mới/4 bài/30 bài tập, hội thoại 6 lượt, đọc hiểu và đề viết. Không tạo thẻ/tiến độ trước khi học.
- `content/a2.py` là nguồn biên soạn; `grammar_foundation.json` giữ 24 mục cũ theo ID, `grammar_details.enrich` không dựa vị trí. Mỗi grammar có ba ví dụ khác nhau, bốn bài tập và đáp án/biến thể theo ý của đề.
- Audit 120 mục mới qua TBCL: 48 khớp từ/Pinyin, 72 chưa khớp truy vấn; báo cáo từng URL ở `a2-vocabulary-audit.json`. Giữ draft vì câu/nghĩa Việt chưa giáo viên duyệt; A2 chỉ là định hướng, không quy đổi TBCL/CEFR. 有點/得 dùng MOE; 垃圾 ghi lèsè, 得 nghĩa cần phải đọc děi.
- Animation 424 chữ, giữ byte 294 cũ; chấm viết tay vẫn 12. Pinyin grid 406 chỉ bằng chữ, không WAV/MP3/đánh vần hoặc Latin TTS. Từ/câu dùng zh-TW local, còn cần nghe duyệt.
- Kiểm tra đầu vào tăng 36→54 câu do ba câu/chủ đề; các câu cũ giữ thứ tự đầu, bản nháp cũ tiếp tục được. Lộ trình B2 vẫn là kế hoạch, không đánh dấu hoàn thành lô.

Các mục nhắc v5/audio cũ phía dưới là lịch sử biên soạn.


## Phạm vi và trạng thái

Gói foundation-tw v5 giữ 12 chủ đề, 48 bài, 240 mục từ, 24 điểm ngữ pháp và 360 bài tập trong bài. Tab Ngữ pháp có thêm 72 ví dụ riêng biệt và 96 bài tập, giữ ID ngữ pháp cũ. Có 5 mục từ đã đối chiếu chữ, Pinyin và nghĩa cơ bản với MOE: 先生、太太、名字、朋友、星期; xem content/source_checks.json. 235 mục còn là **bản nháp do AI hỗ trợ**, trong đó 麻煩 và 不客氣 mới đối chiếu một phần âm đọc. Tất cả ngữ pháp/bài tập/audio chưa được giáo viên duyệt. `ready` nghĩa là đủ cấu trúc để học/luyện, không phải `source-checked` hoặc đạt CEFR.

Nội dung nằm trong content/seeds.py, bộ tạo scripts/build_content.py. Không sửa ID bằng vị trí dòng: từ dùng slug chủ đề + mã Unicode, bài/grammar/exercise dùng khóa cố định. Khi thay nội dung không tái sử dụng ID cũ cho nghĩa khác.

## Chữ, Pinyin và nghĩa

- Phồn thể; ưu tiên từ Đài Loan như 捷運、公車、計程車、便利商店、網路. Không dùng chuyển Giản thể hàng loạt làm bước duyệt.
- Mục từ đơn thường dùng thanh từ điển; cụm/câu có thể ghi biến điệu 一/不 theo ngữ cảnh. Ví dụ 一 yī, 一杯 yì bēi, 一個 yí ge; 不 bù, 不要 bú yào. Thanh ba liên tiếp giữ Pinyin từ điển (nǐ hǎo), cần giải thích biến điệu khi dạy nói. Đây là quy tắc hiện tại, cần rà soát toàn gói.
- Thanh nhẹ không dấu; bài Pinyin hỗ trợ số 0/5 và v/u: thay ü. Chuẩn hóa NFC, chữ thường, khoảng trắng/dấu câu; giữ sai thanh, giữ phân biệt u/ü. Không coi Pinyin là đáp án Hán tự.
- Pinyin/Việt là theo từ/cụm/câu, không tự tách mỗi Hán tự thành một từ. Dịch Việt do dự án soạn, không sao chép định nghĩa từ điển.
- Ba lớp show/tap/hide và Pinyin new. “Từ mới” hiện nghĩa là chưa có thẻ của chữ đó được ôn lần nào. Câu hỏi chỉ đưa stimulus cần thiết; câu trả lời/transcript bị ẩn đến khi nộp hoặc chọn gợi ý. Gợi ý ghi assisted.
- Bài đóng dùng đáp án biên soạn; ngoài tập đáp án được ghi sổ lỗi để xem lại, không tuyên bố mọi biến thể khác đều sai ngôn ngữ. Bài mở/nói không chấm đúng/sai.

## Nguồn và tài sản

Nguồn để đối chiếu tiếp: [MOE từ điển giản biên](https://dict.concised.moe.edu.tw/), [MOE nét chữ](https://stroke-order.learningweb.moe.edu.tw/), [TBCL](https://bcoct.naer.edu.tw/TBCL/), [TOCFL](https://tocfl.edu.tw/tocfl/index.php/teach/download). Đã mở các trang nguồn; chưa được gọi việc này là đối chiếu 240 mục.

Văn bản bài học, đáp án, hình CSS và 12 mẫu chấm viết tay do dự án tự soạn. V5 bổ sung animation 294 chữ từ AnimCJK (APL/LGPL), 37 WAV MOE (CC BY 4.0) và MP3 Quan thoại bổ sung (Unlicense). MOE outline/HTML chỉ dùng để đối chiếu, không phân phối. Xem [nguồn và giấy phép](../public/learning/ATTRIBUTION.md), [đối chiếu chữ](STROKE_SOURCES.md). Không có tài sản giáo trình/audio trả phí. Không tuyên bố nội dung do giáo viên phê duyệt.

Font Microsoft JhengHei được Windows cung cấp tại máy, không phân phối lại. Audio đọc trực tiếp bằng giọng hệ điều hành/browser local; không xuất audio Windows để phân phối sang Android. Máy đã có zh-TW và người dùng xác nhận nghe câu mới offline được, nhưng báo giọng đọc rời, chưa đạt kiểm tra biến điệu.

## Phát âm trong lời nói

src/core/pronunciation.ts có 11 ca tự soạn để nghe cả cụm và câu: thanh 3 nối thanh 3, thanh 3 trước thanh khác, 一/不, thanh nhẹ, chữ đa âm và nhịp câu. Phiên âm cơ sở giữ riêng với ghi chú biến điệu; không thay dữ liệu Pinyin/chấm bài bằng cách đọc do TTS suy ra. Không áp một độ dài cố định cho từng thanh; độ dài và cao độ còn phụ thuộc trọng âm, tốc độ và ngữ cảnh.

Nguồn quy tắc đã đọc: [MOE — 一/不 và thanh nhẹ](https://dict.concised.moe.edu.tw/page.jsp?ID=55&la=0&powerMode=0), [NTU ICLP — đặc điểm âm học thanh điệu](https://iclpnews.ntu.edu.tw/journal/info/28). Tài liệu nghiên cứu bổ sung: [NCCU](https://ah.lib.nccu.edu.tw/bitstream/140.119/152670/1/101401.pdf). Không đóng gói tài sản audio/giáo trình từ các nguồn này. Các ghi chú là diễn giải của dự án, chưa phải đánh giá giáo viên cho từng audio.

Đối chiếu ví dụ thanh nhẹ ngày 24/09/2026: MOE giản biên ghi [名字 — míng zi](https://dict.concised.moe.edu.tw/dictView.jsp?ID=4842&la=0&powerMode=0) và [桌子 — zhuō zi](https://dict.concised.moe.edu.tw/dictView.jsp?ID=30786&la=1&powerMode=0). Không suy rộng thành mọi âm cuối đều nhẹ hoặc mọi người nói có cách đọc giống nhau.

Nhận xét “khá liền mạch / còn rời / nghi sai âm / chưa phân biệt” lưu trong reports, gắn cấu hình voice/nhịp. Chúng là ý kiến người học, không nâng nhãn thành audio chuẩn. Cần người nghe đủ năng lực đối chiếu các ca với từng giọng trước khi dùng làm mẫu phát âm đã duyệt.

## Kiểm tra gói

`npm.cmd run content:check` kiểm tra schema, hash, bytes, ID trùng, liên kết bài–từ/ngữ pháp, đáp án trong lựa chọn. Đây là kiểm tra cấu trúc; chưa tự xác minh tính đúng của Pinyin, nghĩa, chuẩn Đài Loan hoặc chất lượng audio.

Lộ trình đối chiếu tiếp: từng mục và chữ đa âm → ghi URL/mục cụ thể, ngày và người đối chiếu → rà câu/đáp án theo ngữ cảnh → nghe voice thật → cập nhật verification từng mục → tăng version và hash. Cập nhật không xóa ID cũ. Animation phủ 294 chữ trong từ vựng; chấm viết tay vẫn là 12 mẫu chọn lọc.

## Ngữ pháp và lộ trình biên soạn

`content/grammar_details.py` bổ sung giải thích, giới hạn, lỗi/ngữ cảnh cần sửa, ví dụ, bài tập và tham chiếu theo ID. Đã rà 24 hàng: cloze có nghĩa dự định, 是在 không bị kết luận luôn sai, 會 không bị đồng nhất với 在, có thêm biến thể viết lại ở các câu thời gian/đồng nghĩa. Tập đáp án vẫn có giới hạn; ngoài tập không đồng nghĩa sai ngôn ngữ trong mọi ngữ cảnh. Các câu chưa được giáo viên duyệt và không tự nâng mức kiểm chứng.

`content/grammar-roadmap.json` giữ snapshot 496 nhãn/cấp nguồn. `content/grammar_roadmap.py` phân nhóm biên tập thành 12 chủ điểm, 27 lô tối đa 24 mục, xếp từ cấp nguồn thấp đến cao trong từng chủ điểm và có tiên quyết không vòng lặp. Đây là định hướng biên soạn, không quy đổi TBCL sang CEFR; bộ lọc nhóm/cấp/lô áp dụng cả danh mục chờ soạn. Mỗi lô cần đủ giải thích, ít nhất 3 ví dụ và 4 bài tập mỗi mục, đáp án/biến thể, nguồn, rà ngôn ngữ trước khi chuyển thành nội dung sẵn học. Sau nền tảng tiếp tục thời–thể/bổ ngữ → so sánh/câu phức → lập luận/văn viết; đánh giá nghe/nói/đọc/viết để xác định độ phủ B2 riêng.

Phiên `grammar:<id>` dùng CAS/sự kiện chống trùng, gợi ý được lưu ngay, tạm dừng lưu bản nháp. Đi hết bài luyện chỉ tính cho tab ngữ pháp; không tăng số bài trong 72 bài hoặc tự đổi lịch FSRS.
