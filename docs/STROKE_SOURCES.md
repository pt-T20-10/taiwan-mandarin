# Đối chiếu nét chọn lọc — 23/09/2026

## Bổ sung animation ngày 25/09/2026

294 chữ trong 240 mục từ có animation local: 271 hình Hant, 19 hình Hans dùng cho cùng chữ, 4 mẫu ghép 廁 廚 灣 碼. Mã tái tạo: `scripts/build_character_assets.py`; báo cáo đầy đủ: `docs/character-audit.json`; [revision/nguồn/giấy phép](../public/learning/ATTRIBUTION.md). Hình AnimCJK chuyển sang JSON/matrix, giữ APL; dữ liệu dictionary giữ LGPL/Unihan, có ngày/cách sửa và thông báo không bảo hành.

Đã so số nét 294/294 với MOE (0 lệch), kiểm tra IDS đủ toán hạng và kiểm tra đường đi bằng công cụ. Bộ thủ 23 chữ bổ sung đều khớp metadata MOE. Đã xem bảng hình tĩnh của 23 chữ bổ sung và 常; đây là rà kỹ thuật của agent, không phải người dạy duyệt toàn bộ dáng/thứ tự/hướng. Bốn mẫu ghép còn tỉ lệ/độ dày chưa đồng đều. Không tự dùng greedy reorder; chỉ có override 房/關/灣 đã ghi từ đợt trước.

| Chữ bổ sung | Bộ thủ | Cấu tạo trực quan đã rà |
|---|---|---|
| 吃、址 | 口、土 | ⿰口乞、⿰土止 |
| 宿、寄 | 宀、宀 | ⿱宀佰、⿱宀奇 |
| 局 | 尸 | ⿸尸⿹𠃌口; sửa thiếu toán tử lồng |
| 廁、廚 | 广、广 | ⿸广則、⿸广尌; hình ghép 广+貝+刂 / 广+壴+寸 |
| 悠、戶 | 心、戶 | ⿱攸心; 戶 không tách thêm |
| 捷、授 | 手、手 | ⿰扌疌、⿰扌受 |
| 浴、灣 | 水、水 | ⿰氵谷、⿰氵⿱䜌弓; 灣 ghép 氵/糸/言/糸/弓 |
| 研、碼 | 石、石 | ⿰石开、⿰石馬; 碼 ghép 石+馬 |
| 究、窗 | 穴、穴 | ⿱穴九、⿱穴囱 |
| 素、臺 | 糸、至 | ⿱龶糸、⿱吉⿱冖至 |
| 舍、袋 | 舌、衣 | ⿱亼古、⿱代衣 |
| 踏、辣 | 足、辛 | ⿰𧾷沓、⿰辛束 |

Bộ thủ/số nét tra qua `https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=<mã Unicode thập phân>`; từng JSON có URL chính xác. IDS là mô tả hình do dự án ghi, không suy diễn từ nguyên hoặc vai trò biểu âm/biểu nghĩa. [研 theo MOE](https://dict.variants.moe.edu.tw/dictView.jsp?ID=30267) dùng 开 bốn nét, đã sửa dữ liệu trước là 幵. [廚 theo MOE](https://dict.variants.moe.edu.tw/dictView.jsp?educode=A01227) có 尌 dưới 广. Sửa thêm 常 từ IDS nguồn thiếu toán hạng `⿳龸吊` thành `⿱龸吊`. UI diễn giải các toán tử và thành phần hiếm bằng chữ thường để giảm phụ thuộc glyph font.

`node scripts/inspect_character_assets.mjs` tạo bảng hình ở `data/character-supplement-review.png` (ignored). HTML MOE cache vẫn ignored. Bộ chấm 12 chữ bên dưới độc lập với animation mới; chưa mở rộng chấm viết tay ra 294 chữ.

## Bộ chấm viết tay 12 chữ (giữ nguyên)

Agent đọc thứ tự các Stroke/Track tại từng trang MOE dưới đây. Đối chiếu số nét, hướng đi và nhóm gấp/móc của 12 chữ với mẫu luyện do dự án tự vẽ trong src/core/strokes.ts. Đây là đối chiếu cấu trúc nét, không phải giáo viên duyệt dáng chữ/thư pháp hoặc bộ dữ liệu toàn bộ từ vựng.

| Chữ | Số nét | Thứ tự đã đối chiếu | Trang MOE |
|---|---:|---|---|
| 一 | 1 | ngang | [19968](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=19968) |
| 二 | 2 | ngang trên, ngang dưới | [20108](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=20108) |
| 三 | 3 | ba ngang từ trên xuống | [19977](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=19977) |
| 十 | 2 | ngang, dọc | [21313](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=21313) |
| 人 | 2 | phẩy trái, mác phải | [20154](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=20154) |
| 大 | 3 | ngang, phẩy trái, mác phải | [22823](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=22823) |
| 小 | 3 | dọc móc giữa, phẩy trái, chấm phải | [23567](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=23567) |
| 日 | 4 | dọc trái, ngang gấp có móc thu, ngang giữa, ngang đáy | [26085](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=26085) |
| 月 | 4 | phẩy trái, ngang gấp móc, hai ngang trong từ trên xuống | [26376](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=26376) |
| 口 | 3 | dọc trái, ngang gấp bên phải, ngang đáy | [21475](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=21475) |
| 上 | 3 | dọc, ngang ngắn bên phải, ngang đáy | [19978](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=19978) |
| 下 | 3 | ngang trên, dọc, chấm phải | [19979](https://stroke-order.learningweb.moe.edu.tw/dictView.jsp?ID=19979) |

Hình học giản lược dùng tọa độ tự soạn trên bảng 300×300, nét đều và một số đoạn thẳng thay nét cong. Không sao chép outline, tọa độ Track hay animation MOE vào bản phân phối. HTML đối chiếu chỉ nằm trong data/source-review/ bị Git bỏ qua. scripts/review_stroke_sources.py là công cụ đọc nguồn lúc phát triển, không được gọi khi học.

Bộ kiểm tra dùng khoảng cách đường đi có hướng, vị trí bắt đầu/kết thúc và độ dài. Sai nét được xóa để thử lại chính nét đó; hoàn thành chỉ ghi một sự kiện cho chữ đang chọn. Tô/nhạt/tự nhớ và hoạt hình dùng tài sản local. Kiểm tra chuột không đánh giá phong cách chữ viết hoặc phát âm.
