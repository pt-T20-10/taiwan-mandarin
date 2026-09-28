# Tài sản học local — 27/09/2026, v6

## Nét chữ và cấu tạo

Nguồn [AnimCJK](https://github.com/parsimonhi/animCJK/tree/ec5e17cca76c87587790bcbce5ea0b4d4fb753d6), revision `ec5e17cca76c87587790bcbce5ea0b4d4fb753d6`.
Copyright Arphic Technology Co., Ltd. ©1999; AnimCJK FM&SH ©2016–2026; nguồn dẫn xuất Make Me a Hanzi và Unihan như COPYING.txt.

- Outline/median: Arphic Public License, gồm chuyển JSON/matrix, ghép và đổi thứ tự. Được phân phối/chỉnh sửa theo APL, không bảo hành. [Giấy phép đầy đủ](licenses/animcjk/APL/english/ARPHICPL.TXT).
- Bộ thủ/IDS từ dictionary: LGPL-3.0-or-later; kèm [LGPL](licenses/animcjk/LGPL.txt), [GPL](licenses/animcjk/GPL-3.0.txt), [thông báo Unihan](licenses/animcjk/Unihan/License-Unihan.txt) và [COPYING](licenses/animcjk/COPYING.txt).
- 424 chữ trong 360 mục từ. Giữ nguyên byte 294 mẫu v5 (271 Hant, 19 Hans, 4 mẫu ghép 廁/廚/灣/碼). Thêm 130 mẫu từ cùng revision, ưu tiên Hant; nguồn Hans/Ja hoặc mẫu ghép được ghi trong từng JSON. Nguồn Ja bổ sung 嚴/擾/櫃/簽/絡/覽/訊/診/邀; không coi hình nguồn Nhật là chuẩn Đài Loan chỉ vì số nét khớp.
- Ghép mới 嚨 từ 口/龍, 圾 từ 土/及; 覽 thay bảy nét 臣 nguồn Ja bằng sáu nét nguồn Hoa ngữ. Hình ghép có tỉ lệ/độ dày chưa đều. Không phân phối font Windows.
- `scripts/build_character_assets.py` là mã chuyển đổi/tạo bản sửa; từng JSON có ngày/cách sửa và thông báo không bảo hành. Các JSON là dữ liệu nguồn có thể sửa.
- Thứ tự chọn lọc đã đối chiếu MOE: v5 房/關/灣; v6 嚴/惜/感/聯/訊. Chỉ áp các sửa cụ thể đã xem, không tự áp greedy reorder. 邀 giữ thứ tự nguồn; chi phí so hình cao không tự chứng minh sai thứ tự.
- 424/424 khớp số nét MOE. Bộ thủ của 130 mẫu mới lấy từ metadata MOE. Sửa IDS 衣 và các chữ bổ sung từ dictionary Ja. Cấu tạo chỉ để nhận hình; chưa thẩm định từ nguyên/vai trò biểu âm–biểu nghĩa hoặc toàn bộ dáng/hướng nét.
- MOE HTML/đường nét chỉ ở cache đối chiếu, không phân phối. Mỗi JSON có URL MOE. Bộ chấm viết tay vẫn 12 mẫu hình học độc lập; không mở chấm 424 chữ.

## Pinyin và giọng đọc

Yêu cầu mới ngày 28/09/2026: bảng hàng/cột 406 âm; hover/chạm mở 4 thanh rồi click phát bản thu nguyên âm tiết. Khôi phục riêng **1.598 MP3 / 31.305.950 bytes** từ checkpoint `9198c81`, kiểm tra byte/SHA-256 từng file theo catalog cũ bằng `scripts/restore_pinyin_recordings.py`. `pinyin/recordings.json` ghi từng đường dẫn, nguồn, hash và 26 tổ hợp thiếu. Không khôi phục WAV thành phần MOE, không ghép/nối âm, không dùng Latin TTS, không đổi giọng từ/câu. Không suy bản thu tồn tại thành cách đọc của một từ có nghĩa.

Nguồn MP3: [davinfifield/mp3-chinese-pinyin-sound](https://github.com/davinfifield/mp3-chinese-pinyin-sound/tree/aa25ecce7b7fb02757b2c2b8e3c01aa975812edc), revision `aa25ecce7b7fb02757b2c2b8e3c01aa975812edc`; [Unlicense](licenses/pinyin-unlicense.txt). Quan thoại phổ thông, chưa xác minh vùng giọng Đài Loan và chưa nghe duyệt toàn bộ. Playback thật xác nhận file phát được, không thay đánh giá người nghe.

Bảng ví dụ Hán tự của đợt trước được giữ làm dữ liệu tham chiếu, **không còn dùng cho bảng nghe Pinyin**:

`pinyin/examples.json` là bảng độc lập giáo trình, gồm 589 tổ hợp, chọn từ mục từ một/hai chữ trong [TBCL — NAER, từ vựng cốt lõi](https://bcoct.naer.edu.tw/standsys/querycorevocab.php?q=&num=10000&page=1&deng_ji=all). Chỉ ghi sự kiện mục từ/Pinyin/cấp/URL và vị trí âm đích; không sao chép định nghĩa, câu ví dụ hoặc audio. Ưu tiên mục một chữ chỉ có một cách đọc trong nguồn này, rồi cụm ngắn theo thứ tự cấp của nguồn; không suy ra chữ không đa âm trong mọi ngữ cảnh. Chỉ tách Pinyin khi có duy nhất một cách khớp số chữ với catalog. Thanh nhẹ luôn phát cả cụm. Không gán giấy phép audio/nét chữ cho dữ liệu tham chiếu TBCL.

Mọi mục có `dictionary_status=verified` (khớp mục từ/Pinyin), `listening_status=not-reviewed` (chưa người nghe duyệt). 1.441 tổ hợp chưa có ví dụ từ phạm vi nguồn đã chọn, không phải kết luận bất khả thi. `docs/pinyin-coverage.json` ghi từng khóa thiếu và SHA-256 nguồn; `scripts/build_pinyin_examples.py` dựng/kiểm tra offline từ cache, tùy chọn `--refresh-source` chỉ tải HTML nếu thiếu. Không dùng ASR xác nhận phát âm. Chất lượng giọng/biến điệu vẫn cần người nghe đối chiếu.

Lịch sử tài sản đã gỡ ngày 27/09/2026; giữ thông báo nguồn/giấy phép để truy vết:

- 37 WAV từ [國語注音符號手冊-開放部件](https://language.moe.gov.tw/001/Upload/files/SITE_CONTENT/M0001/deploy/index.html), 2017 © 教育部, CC BY 4.0; [thông báo](licenses/moe-bopomofo.txt).
- Bộ cũ 1.632 MP3 đã gỡ ngày 27/09; nay chỉ khôi phục 1.598 file thực sự được catalog 406 âm tham chiếu như mô tả trên.
- Kokoro và runtime riêng đã gỡ; giấy phép/lịch sử benchmark ở `docs/NEURAL_TTS.md`, không còn trong lựa chọn giọng hiện tại.

## Nội dung và nguồn ngôn ngữ

[TBCL/NAER](https://bcoct.naer.edu.tw/standsys/querygrammars.php) cung cấp 496 nhãn cấu trúc/cấp tham chiếu. ID `tbcl.001`…`tbcl.496` là ID dự án theo snapshot, không phải ID chính thức. Không sao chép ví dụ/bài tập giáo trình; không gán giấy phép audio/nét chữ cho danh mục TBCL.

36 bài ngữ pháp do dự án biên soạn, gồm 24 nền tảng và 12 mục thuộc sáu chủ đề A2 định hướng. Danh mục 27 lô/12 chủ điểm vẫn là kế hoạch B2 chưa hoàn thành. Không quy đổi cấp TBCL sang CEFR. Nguồn của 有點/得 theo MOE được dẫn trong từng bài.

120 mục từ mới đã tra TBCL; 48 mục khớp từ/Pinyin trong công cụ đối chiếu, 72 mục chưa khớp theo truy vấn hiện tại. Báo cáo `docs/a2-vocabulary-audit.json` ghi từng URL và mức kiểm tra. Câu, nghĩa Việt, hội thoại và ngữ cảnh vẫn do dự án soạn với AI hỗ trợ, chưa giáo viên duyệt. Không tự nâng toàn bộ mục thành `source-checked`.

`manifest.json` ghi SHA-256/kích thước mọi file tài sản trừ chính manifest. `sources.json` ghi revision/hash nguồn đã tải. Học không tải nguồn từ xa; liên kết ngoài chỉ mở khi người dùng chọn tra cứu.
