# Đối chiếu nét chọn lọc — 23/09/2026

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
