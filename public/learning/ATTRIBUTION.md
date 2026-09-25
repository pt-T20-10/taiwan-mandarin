# Tài sản học local — 2026-09-25

## Nét chữ và cấu tạo

Nguồn [AnimCJK](https://github.com/parsimonhi/animCJK/tree/ec5e17cca76c87587790bcbce5ea0b4d4fb753d6), revision `ec5e17cca76c87587790bcbce5ea0b4d4fb753d6`.
Copyright Arphic Technology Co., Ltd. ©1999; AnimCJK FM&SH ©2016–2026; nguồn dẫn xuất Make Me a Hanzi và Unihan như COPYING.txt.

- Outline/median: Arphic Public License, gồm bản chuyển JSON/matrix, ghép và đổi thứ tự. Được phân phối/chỉnh sửa theo APL, không bảo hành. [Giấy phép đầy đủ](licenses/animcjk/APL/english/ARPHICPL.TXT).
- Bộ thủ/IDS từ dictionary: LGPL-3.0-or-later; kèm [LGPL](licenses/animcjk/LGPL.txt), [GPL](licenses/animcjk/GPL-3.0.txt), [thông báo Unihan](licenses/animcjk/Unihan/License-Unihan.txt) và [COPYING](licenses/animcjk/COPYING.txt).
- 271 chữ lấy hình Hant; 19 hình Hans dùng cho cùng chữ; 4 chữ 廁 廚 灣 碼 ghép từ thành phần AnimCJK. Không phân phối font Windows.
- `scripts/build_character_assets.py` trong source dự án là mã chuyển đổi/tạo bản sửa. Từng JSON ghi ngày/cách sửa, nguồn, bộ thủ và IDS. Các JSON là dữ liệu nguồn có thể sửa, không mã hóa/khóa.
- Sửa thứ tự riêng 房/關/灣 theo đối chiếu trước; không áp thuật toán greedy reorder. Sửa IDS 局 thành ⿸尸⿹𠃌口; 常 thành ⿱龸吊; 研 thành ⿰石开.
- Bộ thủ 23 chữ bổ sung khớp metadata MOE; cấu tạo là phân tích hình chữ do dự án ghi, chưa thẩm định từ nguyên. 研 dùng phần phải 开 bốn nét theo [MOE](https://dict.variants.moe.edu.tw/dictView.jsp?ID=30267). 廚 dùng 广 bao 尌 theo [MOE](https://dict.variants.moe.edu.tw/dictView.jsp?educode=A01227).
- 294 chữ khớp số nét MOE; đường đi so bằng công cụ không chứng minh toàn bộ dáng/thứ tự/hướng đã được người duyệt. Bốn mẫu ghép có tỉ lệ/nét chưa đồng đều. Mẫu chỉ để xem animation; bộ chấm viết tay vẫn giới hạn 12 chữ tự soạn.
- HTML/outline MOE chỉ ở cache đối chiếu, không nằm trong bản phân phối. Mỗi JSON có link MOE tương ứng.

## Âm mẫu

37 WAV thành phần giữ nguyên từ [國語注音符號手冊-開放部件](https://language.moe.gov.tw/001/Upload/files/SITE_CONTENT/M0001/deploy/index.html), gói `bopomofo_materials_20170213.zip`.
2017 © 教育部，國語注音符號手冊-開放部件. CC BY 4.0; [thông báo](licenses/moe-bopomofo.txt). Đây là âm đọc dạy học Zhuyin được ánh xạ sang thành phần Pinyin, không phải phụ âm thuần để nối cơ học.

1.632 MP3 giữ nguyên từ [davinfifield/mp3-chinese-pinyin-sound](https://github.com/davinfifield/mp3-chinese-pinyin-sound/tree/aa25ecce7b7fb02757b2c2b8e3c01aa975812edc), revision `aa25ecce7b7fb02757b2c2b8e3c01aa975812edc`, [Unlicense](licenses/pinyin-unlicense.txt).
Danh mục dạy gồm 406 âm tiết và 1.598 mẫu thanh 1–4; 26 tổ hợp chưa có mẫu. MP3 là Quan thoại bổ sung, chưa xác minh vùng giọng/chưa nghe duyệt toàn bộ. Không tuyên bố đây là bộ thu âm chuẩn Đài Loan. Thiếu mẫu thì báo thiếu, không thay ngầm bằng TTS. Chưa có bộ thu thanh nhẹ theo ngữ cảnh. Âm thành phần và âm tiết có thể khác giọng/âm lượng.

## Ngữ pháp

[TBCL/NAER](https://bcoct.naer.edu.tw/standsys/querygrammars.php) là nguồn 496 nhãn cấu trúc/cấp, giữ nguyên cấp nguồn và URL từng trang. Không sao chép câu ví dụ hoặc bài tập giáo trình từ nguồn. Các số `tbcl.001`…`tbcl.496` là ID dự án theo snapshot, không tuyên bố là ID chính thức của NAER.
Giải thích tiếng Việt, ví dụ, đáp án và 27 lô/12 chủ điểm là nội dung dự án có AI hỗ trợ, chưa giáo viên duyệt. Không gán giấy phép audio/nét chữ cho danh mục TBCL. Danh mục là tham chiếu để biên soạn, không phải chứng nhận hoàn thành chương trình B2.

`manifest.json` ghi SHA-256/kích thước toàn bộ file tài sản (trừ chính manifest). `sources.json` ghi revision và hash nguồn đã tải. Việc học không tải các nguồn này; liên kết ngoài chỉ mở khi người dùng chọn tra cứu.
