# Android flashcard — VS Code, không cần Android Studio

## Phạm vi

APK `Đảo nhỏ – Ôn tập` chỉ ôn flashcard. Mặt trước là Hán tự; lật thẻ để xem Pinyin/nghĩa Việt, nghe Microsoft Yating và bấm Tiếp. Không đăng nhập, không chấm nhớ/đúng sai, không thay lịch FSRS. Không mang model chat/ASR hoặc tài sản nét chữ lên điện thoại.

PC quản lý thẻ; điện thoại chỉ nhận bản sao những thẻ chưa xóa/tạm ngưng. Các hướng học có cùng Hán tự/Pinyin được gộp thành một từ, giữ các nghĩa khác nhau. Lượt đã xem trên Android được đồng bộ về sự kiện practice riêng, `correct:null`, không có rating.

## Chuẩn bị công cụ trong VS Code

Mở terminal PowerShell tại thư mục repository, đã có Node và `.venv` theo hướng dẫn PC:

```powershell
npm.cmd ci
.venv\Scripts\python.exe -m pip install -r requirements.lock
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Setup-Android.ps1
```

Script tải JDK 21, Android SDK Command-line Tools, SDK Platform/Build Tools 36 và ADB vào `runtime/android-toolchain`. AGP có thể tải thêm Build Tools 35 theo phiên bản mặc định của nó. SDK chỉ cài các gói được dự án yêu cầu; script cấp câu trả lời chấp nhận giấy phép khi cài những gói này. Log ở `runtime/android-toolchain/sdk-install.log`. Không cài Android Studio, emulator hoặc sửa PATH hệ thống. Gradle dùng cache riêng ở thư mục `.dao-nho-gradle` cạnh repository để rút ngắn đường dẫn Windows. Các công cụ phát triển tải về không thuộc APK và không đưa lên Git.

## Build và cài trên điện thoại

```powershell
npm.cmd run android:build
```

APK được chép tới `data/android-build/dao-nho-review.apk`. Script tự tạo khóa ký cá nhân lần đầu trong `data/android-signing`; phải sao lưu riêng thư mục khóa này để các lần cập nhật dùng cùng chữ ký. Không đưa khóa/password lên Git hoặc gửi kèm APK. Gradle và Maven cần mạng khi tải công cụ/thư viện lần đầu.

Gradle 8.14.3 có lỗi khóa cache tạm trên Windows (#31438). Script dùng cache ngắn, hai worker, tắt VFS watching và khôi phục tên **chỉ** các transform đã có đủ metadata/results sau khi tiến trình build kết thúc; thử lại tối đa hai lần. Không đổi artifact, không ghi đè cache đã hoàn tất, không chỉnh antivirus/registry. Nếu vẫn lỗi, giữ output Gradle để kiểm tra; không xóa khóa ký hay dữ liệu học.

1. Bật Tùy chọn nhà phát triển và **Gỡ lỗi USB** trên điện thoại.
2. Dùng cáp có truyền dữ liệu nối với PC, mở khóa màn hình và chấp nhận dấu vân tay USB debugging.
3. Chạy:

```powershell
npm.cmd run android:install
```

Script chạy `adb devices`, yêu cầu đúng một máy được cấp quyền, cài bằng `adb install -r` và mở app. Có thể rút cáp sau khi cài. **Không gỡ app để cập nhật:** dùng lại script và khóa ký để giữ SQLite, kết nối và lượt ôn chưa gửi.

Nếu `unauthorized`: mở khóa điện thoại và chấp nhận PC. Nếu danh sách trống: kiểm tra cáp/chế độ USB/driver USB hãng; script không tự sửa driver hoặc registry. Có thể chép APK vào điện thoại để tự cài bằng trình quản lý file nếu không dùng ADB.

## Ghép cặp Wi-Fi lần đầu

1. PC và Android cùng Wi-Fi. Mở PC bằng `Start.cmd` và vào **Cài đặt → Đồng bộ điện thoại**.
2. Bấm **Bật đồng bộ Wi-Fi**. Web PC vẫn chỉ dùng localhost 8765; dịch vụ HTTPS flashcard riêng ở 8766.
3. Nếu Windows hỏi quyền mạng cho Python, chỉ cho phép mạng Private. Không cần mở cổng trên router, public Internet hay bật mạng Public.
4. Bấm **Ghép cặp điện thoại · tạo QR**. QR có hiệu lực 5 phút và chỉ dùng một lần.
5. Mở app Android → Quét QR. Cấp quyền camera ở lần đầu.
6. Trên PC, xác nhận **Cho phép thiết bị** cho yêu cầu vừa xuất hiện.
7. Điện thoại tải thẻ và audio. Đợi **Sẵn sàng ôn offline** trước khi tắt PC nếu muốn nghe mọi từ.

Nếu không dùng camera: mở mục nhập thủ công trên cả PC và điện thoại, chép toàn bộ thông tin kết nối vào app rồi kết nối. Giữ bí mật QR/thông tin này trong thời gian ghép cặp.

Nếu PC có nhiều card mạng, chọn địa chỉ Wi-Fi/LAN cùng mạng với điện thoại trước khi tạo QR; mặc định ưu tiên địa chỉ của tuyến mạng chính, tránh chọn nhầm adapter ảo.

Ứng dụng tìm lại PC qua mDNS khi IP đổi; nếu router chặn multicast, nhập lại kết nối bằng QR từ cùng PC. Khi không kết nối được, kiểm tra PC đang mở, cùng mạng, không phải Guest Wi-Fi/client isolation, cổng 8766 trên mạng Private và không có VPN chặn mạng LAN. Không bỏ kiểm tra chứng chỉ để chữa lỗi kết nối.

## Sử dụng và đồng bộ

- Mở app là tới thẻ đang ôn, mặc định mặt trước. Mục **Bộ ôn** chọn nhóm từ và lượt 20/30/40 từ hoặc cả nhóm; hoàn thành có điểm dừng, bấm Bộ tiếp theo để tiếp tục. Nút Trộn giữ thẻ hiện tại và trộn phần còn lại.
- PC và Android dùng chung cách chia nhóm: đếm từ riêng biệt, không đếm trùng hướng thẻ; sắp theo chủ đề rồi chia cân bằng, mỗi nhóm nhỏ có 20–39 từ. Nếu tổng sổ thẻ dưới 40 chỉ có Tất cả từ; nếu chưa đủ 20 báo rõ, không tạo thẻ giả. Bộ mới ưu tiên từ chưa lấy trong nhóm, cuối vòng có thể dùng lại một số từ để đủ lượt. Lượt và lịch sử chọn nhóm lưu riêng trên mỗi thiết bị, không đồng bộ vị trí đang ôn giữa hai máy.
- Trên PC, Luyện tự do mặc định cũng là Hán tự → lật → Tiếp, không đổi FSRS. Đến hạn là chế độ riêng chỉ lấy thẻ thực sự đến hạn, có thể ít hơn 20; không kéo thẻ tương lai vào để đủ số lượng.
- Chỉ khi đã lật và bấm Tiếp mới ghi lượt ôn. Lưu xuống SQLite trước khi chuyển thẻ; đóng/mở lại không đổi thứ tự còn lại.
- App tự thử đồng bộ khi mở/trở lại app, khi Wi-Fi kết nối lại lúc app đang mở, và sau một vòng ôn. Có Đồng bộ ngay trong cài đặt. Không cần app/dịch vụ chạy nền thường trực trên điện thoại.
- Nếu PC tắt hoặc ra ngoài: ôn thẻ và nghe audio đã tải. Lượt ôn chờ trong máy; chỉ bỏ khỏi hàng chờ sau khi PC xác nhận. Truyền lại không ghi trùng.
- Dữ liệu thẻ mới áp dụng khi nhận manifest từ PC; thẻ bị xóa/tạm ngưng bị loại. Từ mới được đưa vào bộ tiếp theo, không thay bộ đang ôn. Cập nhật APK giữ dữ liệu/pairing/outbox, thu gọn lượt cũ về tối đa 20 từ còn lại.
- Giọng duy nhất là Microsoft Yating OneCore zh-TW tốc độ thường. PC tạo WAV nguyên từ/cụm và điện thoại lưu bản phát lại; không đọc chuỗi Latin Pinyin và không đổi sang giọng khác khi thiếu Yating. Lỗi audio không ngăn ôn chữ.
- **Thêm thẻ không khởi động job tạo audio ngay:** file thiếu được tạo khi điện thoại yêu cầu trong lần đồng bộ. “Đánh dấu đã học” chỉ lưu bằng chứng học từ, chưa tự tạo flashcard và không thuộc nguồn sync trong phase này.
- Thẻ học từ trong bài, ngữ pháp, lượng từ/động từ và cửa sổ từ bổ sung có nút **Thêm vào flashcard** riêng. Nút đổi thành Đã thêm khi có thẻ Hán tự → nghĩa; không tạo trùng khi bấm lại. Thẻ này là nguồn đồng bộ. Bộ lọc chỉ giới hạn lượt ôn, không hạn chế tải thẻ/audio khi đồng bộ.
- Thẻ và audio là hai bước tải. Chỉ coi đủ offline khi thấy audio X/X và “Sẵn sàng ôn offline”; có thẻ chưa chứng minh đã tải đủ audio. Bản cập nhật sửa lượt resume bị bỏ qua nếu quay lại app trong lúc request cũ đang đóng; tự tiếp tục các file còn thiếu và chỉ ghi mốc hoàn tất sau khi đủ audio.
- Audio có checksum, tải theo file còn thiếu và dọn file không còn thuộc bộ thẻ sau lượt đồng bộ thành công. Chỉ chuyển audio cá nhân tới thiết bị ghép cặp, không phân phối engine/giọng Windows trong APK hoặc repository.
- Bản này ghép với một PC; không trộn lịch sử giữa các database PC độc lập. Để ngừng thiết bị, bấm Thu hồi kết nối trên PC. Thiết bị vẫn xem được dữ liệu đã lưu; các lần đồng bộ tiếp theo bị chặn cho đến khi ghép cặp lại.

## Dữ liệu và bảo vệ kết nối

PC giữ SQLite schema 1. Trước lần bật đồng bộ đầu có bản sao lưu trong `data/backups/before-mobile-sync-*.json`. Thông tin thiết bị nằm trong namespace reports `mobile-device:*`; lịch ôn thẻ không bị sửa. Chứng chỉ, khóa HTTPS và WAV nằm trong `data/mobile-sync`, đều bị Git bỏ qua.

Android dùng SQLite trong vùng riêng của app, audio trong files/audio và khóa kết nối mã hóa bằng Android Keystore. Cloud backup của app bị tắt. Gỡ app hoặc xóa dữ liệu sẽ mất các lượt chưa gửi; đồng bộ trước khi làm những thao tác đó.

HTTPS kiểm tra đúng dấu vân tay chứng chỉ lấy từ QR; không có trust-all toàn cục. LAN chỉ có `/v1/pair`, `/v1/pair/status`, `/v1/cards`, `/v1/events`, `/v1/audio/{key}`. Những API PC như chat, restore, shutdown không được công bố tại cổng đồng bộ.

## Kiểm tra và giới hạn

Các kiểm tra tự động tập trung vào: gộp hướng học, xóa/tạm ngưng, ghép cặp/xác nhận/thu hồi, gửi trùng hoặc xung đột lượt ôn, FSRS không đổi; hàng đợi offline qua reload và UI ở 390px. E2E UI giả lập bridge native, không thay thế kiểm tra điện thoại thật.

Sau cài trên máy thật cần tự thử: quét QR → nhận audio → bật chế độ máy bay/tắt PC → lật/nghe/Tiếp → mở lại → bật Wi-Fi và xác nhận lượt ôn được gửi. Chất lượng đọc từng từ và hoạt động camera/Wi-Fi của từng điện thoại cần nghe/thử trực tiếp; không tuyên bố đã xác minh chỉ vì build qua.

Ngày 29/10: đã cập nhật APK sửa resume bằng ADB lên Redmi của người dùng; UI đọc được audio 98/98, người dùng xác nhận nghe được. Đây là xác nhận phát âm thanh, chưa phải nghe duyệt chất lượng toàn bộ từ hay kiểm tra mọi tình huống mất mạng.

Cập nhật cùng ngày: thêm nhóm/lượt ôn trên PC và Android, build release và cài đè giữ dữ liệu. Kiểm tra UI Redmi thấy 98 từ, nhóm 25/25/24/24. Ba kiểm tra core/bridge và ba E2E liên quan qua; chưa chạy hết mọi nhóm hoặc vòng ôn trên điện thoại thật. APK mới SHA256 `088963763c23c0351def2f978b296bfd5192c6685a39b455c985dd242f4da4e8`, 32,180,435 bytes.

Nguồn công cụ: [Android command-line tools](https://developer.android.com/tools), [Gradle CLI build](https://developer.android.com/build/building-cmdline), [Capacitor Android](https://capacitorjs.com/docs/android), [quét QR trên thiết bị](https://capacitorjs.com/docs/apis/barcode-scanner), [Windows SpeechSynthesizer](https://learn.microsoft.com/en-us/uwp/api/windows.media.speechsynthesis.speechsynthesizer).
