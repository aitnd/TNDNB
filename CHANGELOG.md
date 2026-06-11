# Changelog

## [3.9.3] - 2026-06-11
### Security & Role Authorization (Web & App Win)
- **Bảo mật đề thi động (Chặn Copy, Bôi đen, Chuột phải & Phím tắt):** Tự động áp dụng cấm chuột phải, bôi đen, copy và phím tắt (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong các màn hình thi/làm bài (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dựa trên cấu hình `preventCopy` động của từng vai trò được tải theo thời gian thực từ Firestore.
- **Phân quyền cấu hình động:** 
  - Admin có toàn quyền điều chỉnh giới hạn và chính sách bảo mật của toàn bộ vai trò.
  - Lãnh đạo (`lanh_dao`) được quyền chỉnh sửa cấu hình các vai trò cấp dưới, riêng tab cấu hình của Admin sẽ ở trạng thái Chỉ xem (Read-only) và không cho Lãnh đạo chỉnh sửa.
- **Đồng bộ hóa Route:** Truyền `userProfile` prop vào `UsageConfigPanel` tại Route `/ontap/cauhinh` để xác thực phân quyền chính xác.

## [2026-06-11] (Legacy)
### Security & Role Authorization
- **Khóa chuột phải bảo mật (App Win & Web)**:
  - Trên App Win (Electron): Khóa chuột phải toàn cục đối với học viên và tài khoản thường để tránh rò rỉ mã nguồn và dữ liệu. Cho phép tài khoản `admin` sử dụng để debug.
  - Trên Web: Khóa chuột phải tại 4 màn hình thi/làm bài và giám khảo (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) để chống gian lận thi cử. Bỏ qua chặn đối với tài khoản `admin`.
- **Đồng bộ tiến độ**: Lưu trữ tiến độ thông qua `/save_brain`, cập nhật handover và dữ liệu bộ nhớ tĩnh/động (`brain.json`, `session.json`).

## [2026-03-29]
### Fixed
- **Hệ thống Ôn tập Windows (Electron)**: Khắc phục lỗi **Màn hình trắng (ReferenceError: Award is not defined)** bằng cách bổ sung import icon `Award` còn thiếu trong `TopNavbar.tsx`.
- **Ổn định hóa hệ thống**: Đã thực hiện build và kiểm thử (`npm run build`) trong thư mục `ontap-win` đảm bảo ứng dụng không còn bị crash khi render.

### Changed
- **Bảo mật & Trải nghiệm**: Vô hiệu hóa tính năng tự động mở DevTools khi khởi động app và ẩn nút chuyển đổi DevTools trong giao diện chính (nhằm hạn chế can thiệp kỹ thuật F12 theo yêu cầu).
- **Phân tích dữ liệu**: Xác định chính xác nguồn dữ liệu câu hỏi offline nằm tại `ontap-win/data/questions_db.json`.

## [2026-03-29] - Android Optimization Phases
- **Phase 04 (Visual)**: Đồng bộ màu sắc hệ thống Android (Indigo #4f46e5) và tối ưu hóa SplashScreen. Đã đồng bộ `colors.xml` trực tiếp vào dự án Android Studio.
- **Phase 05 (Security & Core)**: 
    - Tích hợp **Khóa Sinh trắc học (Fingerprint/FaceID)** bảo vệ ứng dụng ngay từ khi khởi động.
    - Hệ thống **Thông báo Nhắc học (Daily Reminders)** giúp học viên không bỏ lỡ bài vở.
    - `NativeSettingsModal`: Trung tâm quản lý các tính năng phần cứng thiết bị.
- **Phase 06 (Assets)**: Tối ưu hóa toàn bộ tài nguyên hình ảnh. Giảm kích thước Icon (5.4MB -> ~100KB) và Splash Screen (8.3MB -> 2.7MB) giúp APK nhẹ hơn và khởi động nhanh hơn. Tái tạo bộ resource icon/splash đúng chuẩn Android.

## [2026-03-15]
### Added
- Tích hợp `@capacitor/haptics` và `@capacitor/app` cho phản hồi xúc giác (Haptics) và cấu hình điều hướng Nút Back vật lý cho Android.
- Khởi tạo `utils/nativeUX.ts` quản lý logic trải nghiệm người dùng trên thiết bị di động (Native-like).
- `verify_encryption.js` kịch bản kiểm thử độc lập cho hệ thống giải mã.

### Changed
- Refactor phương pháp lưu mật khẩu ở client: Chuyển đổi từ XOR plaintext sang **Web Crypto API (AES-GCM 256-bit)** với PBKDF2 Master Key, cường hóa đáng kể độ bảo mật dữ liệu lưu ở trình duyệt.
- Tái cấu trúc logic gọi Gemini API: Dịch chuyển từ gọi trực tiếp ở frontend sang gọi qua **Proxy backend (`/api/ai/gemini`)** chặn hoàn toàn nguy cơ rò rỉ API Keys ra public.

### Security
- Khắc phục nguy cơ lộ Gemini API Key nghiêm trọng. Toàn bộ logic kiểm tra và generateContent hiện tại đã thực thi ngầm ở Node server thay vì client.
- Xóa bỏ điểm yếu mã hóa XOR có thể dễ dàng bị bẻ khóa trong Local Storage đối với "Ghi nhớ tài khoản".
