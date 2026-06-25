# Changelog

## [3.10.0] - 2026-06-25
### Tính năng Mới & Redesign Dashboard (Web & App Win)
- **Thiết kế lại Admin Dashboard (Phương án C "Hybrid Smart"):**
  - **AdminStatsBar:** Tích hợp thanh hiển thị thông số online slim realtime trực quan ở trên cùng, thay thế cho OnlineStatsWidget nặng nề.
  - **Giao diện 2 cột thông minh:** 
    - Cột trái: Giữ nguyên thẻ học viên/giáo viên (`StudentCard`) và bổ sung các nút phụ điều hướng nhanh.
    - Cột phải: Lời chào thông minh theo giờ (`WelcomeHeader`), các nút thao tác nhanh dạng grid tiles (`QuickActionsGrid`).
  - **Tối ưu hiệu năng (Lazy Loading):** Tách widget analytics (`CustomAnalyticsWidget`) thành chunk tải chậm (lazy-loaded chunk) chỉ tải khi admin click mở rộng để tiết kiệm băng thông tải trang ban đầu.
  - **Haptic Feedback:** Tích hợp rung phản hồi (haptics) cho các thao tác trên thiết bị di động (bản Web).
- **Đồng bộ hóa Windows App (ontap-win):** Áp dụng toàn bộ cấu trúc thiết kế Dashboard Phương án C sang ứng dụng Windows/Electron để đảm bảo trải nghiệm người dùng nhất quán.
- **Sửa lỗi TypeScript:** Sửa lỗi spread types TS2698 liên quan tới thuộc tính `showPortalAds` trong `UsageConfigPanel.tsx` của bản Windows.

## [3.9.9] - 2026-06-15
- **QA Loop & Khôi phục hệ thống:** Chạy lại quy trình build tích hợp và kiểm tra chất lượng tự động để chuẩn bị phát hành.
- **Sắp xếp cấu trúc code:** Đồng bộ hóa phiên bản build của portal root, ontap-web, và ontap-win thành v3.9.9.

## [3.9.8] - 2026-06-13
### Security Upgrades & Performance Tuning (Web & App Win)
- **Nâng cấp SheetJS an toàn:** Chuyển đổi thành công thư viện đọc/ghi Excel từ `xlsx` (vũ cũ lỗi thời) sang thư viện chính thức bảo mật `@sheetjs/xlsx` (v0.20.2) trên toàn hệ thống (bao gồm cả root portal, ontap-web và ontap-win).
- **Next.js Security Patch:** Nâng cấp Next.js lên bản `14.2.43` tại root và dọn dẹp cài đặt sạch (`clean install`), giải quyết triệt để các lỗ hổng bảo mật dependencies và lỗi môi trường SWC.
- **Tối ưu hóa dung lượng Bundle (Tách Chunk):** Cấu hình manualChunks tách biệt thư viện `@sheetjs/xlsx` thành file chunk riêng `vendor-xlsx-*.js` (488 kB) trong cả hai cấu hình Vite `ontap-web/vite.config.ts` và `ontap-win/vite.config.ts`. File bundle chính `vendor-*.js` giảm từ **1.4 MB** xuống còn **907 kB** (tiết kiệm 35% thời gian tải trang ban đầu).
- **Tối ưu hóa Next.js Image:** Thay thế các thẻ `<img>` cũ bằng `<Image />` tối ưu của Next.js tại 16 vị trí khác nhau trong Next.js Portal (trang bài viết chi tiết, danh mục, giải trí...) để nâng cao chỉ số LCP.
- **Sửa lỗi TypeScript & Unit Test:** 
  - Sửa lỗi spread types TS2698 tại `UsageConfigPanel.tsx`.
  - Khắc phục lỗi thiếu thư viện `@capacitor/local-notifications` bằng cách cập nhật dependency v8.0.1 tại `ontap-web/package.json`.
  - Sửa lỗi cảnh báo `act(...)` bất đồng bộ bằng `waitFor` trong `AccountScreen.test.tsx`, đưa tỷ lệ test pass đạt **100% (5/5 PASS)** sạch cảnh báo.

## [3.9.7] - 2026-06-12
### Portal Ad Management & System Refactor (Web & App Win)
- **Bật/tắt quảng cáo trang chủ:** Tích hợp tính năng dynamic ad toggle cho Next.js Portal homepage từ Firestore (settings/usage_config) thông qua component client `PortalAdLoader`. Loại bỏ script Adsterra cứng trong `app/layout.tsx`.
- **Đồng bộ hóa UI quản trị:** Thêm toggle "Quảng cáo Trang chủ & Tin tức" vào tab "Hệ thống" của UsageConfigPanel cho vai trò Admin và Lãnh đạo.
- **Sửa lỗi ESLint Circular Reference:** Khắc phục lỗi crash lint bằng cách hạ cấp package `eslint-config-next` về `14.2.35` tương thích, dọn dẹp các files cấu hình thừa.
- **Refactor React Hooks:** Sửa triệt để 2 lỗi useEffect missing dependency và useCallback trong `tai-khoan/page.tsx` và `CourseManager.tsx`.
- **Dọn dẹp log rác:** Xóa bỏ log build cũ và tạo template `.env.example` cấu hình môi trường an toàn.
- **Vá bảo mật:** Vá lỗ hổng `@grpc/grpc-js` bằng npm audit fix.

## [3.9.6] - 2026-06-11
### Phân Tách Cấu Hình Ban Lãnh Đạo (Web & App Win)
- **Phân tách cấu hình vai trò:** Phân tách cấu hình giới hạn & quyền lợi giữa **Ban Lãnh Đạo** (`leader`) và **Cán Bộ Quản Lý** (`manager`) thành hai cấu hình độc lập trong database Firestore.
- **Đồng bộ hóa giao diện cấu hình:** Tách nút cấu hình hệ thống thành hai tab riêng biệt: "Ban Lãnh Đạo" (key: `leader`) và "Quản Lý" (key: `manager`).
- **Đồng bộ ánh xạ vai trò:** Cập nhật hàm `getRoleConfigKey` trên toàn bộ hệ thống (bao gồm AccountScreen, ClassManagementScreen và Next.js Portal đăng bài) để nhận diện đúng key `leader` khi vai trò là `lanh_dao`.
- **Sửa lỗi Unit Test:** Khắc phục lỗi kiểu dữ liệu TS2322 cho thuộc tính `role` trong `AccountScreen.test.tsx`.

## [3.9.5] - 2026-06-11
### Trạng thái Tài khoản & Kết thúc Lớp học (Web & App Win)
- **Quản lý trạng thái tài khoản:** Triển khai trạng thái tài khoản (`status: 'active' | 'disabled'`). Chặn đăng nhập và force logout thời gian thực khi tài khoản bị vô hiệu hóa.
- **Trạng thái lớp học:** Thêm trạng thái lớp học (`status: 'active' | 'finished'`). Khi kết thúc lớp học, tự động vô hiệu hóa toàn bộ học viên trong lớp học đó.
- **Quản lý học viên nâng cao:** Thêm chức năng chọn nhiều học viên trong lớp để vô hiệu hóa hàng loạt. Thêm badge hiển thị trạng thái tài khoản và lớp học.
- **Phân quyền động mới:** Thêm phân quyền `courseDisableAccounts` (Vô hiệu hóa tài khoản học viên) và `courseFinish` (Kết thúc / Mở lại lớp học) cho từng vai trò.

## [3.9.4] - 2026-06-11
### Dynamic Permissions & Role Hierarchy (Web & App Win)
- **Hệ thống phân quyền động chi tiết (10 tính năng cốt lõi):** Tích hợp kiểm tra quyền từ cấu hình Firestore (`settings/usage_config`) cho các thao tác quản trị lớp học, người dùng, tin tức và thiết bị.
- **Trọng số vai trò (Role Hierarchy):** Áp dụng logic so sánh trọng số để đảm bảo người dùng chỉ có thể thao tác (Xem, Sửa, Xóa, Đổi vai trò, Force logout) trên các tài khoản có cấp bậc vai trò thấp hơn vai trò hiện tại của chính mình (`admin` (100) > `lanh_dao` (80) > `quan_ly` (60) > `giao_vien` (40) > `hoc_vien` (20) > `guest` (0)).
- **Ẩn/Hiện UI theo phân quyền:**
  - Giáo viên: Tự động ẩn các nút Thêm/Xóa học viên & giáo viên giảng dạy trong giao diện Lớp học (`StudentsTab`, `TeachersTab`) nếu cờ `courseAssignMembers` bị tắt.
  - Quản trị viên & Lãnh đạo: Ẩn nút Sửa (`FaEdit`), Xóa (`FaTrash`), Reset mật khẩu (`FaKey`) đối với tài khoản ngang hàng hoặc cao hơn. Trong giao diện chỉnh sửa, danh sách lựa chọn vai trò mới chỉ hiển thị các vai trò thấp hơn người đang thao tác.
  - Quản lý thiết bị: Ẩn danh sách phiên và nút Đăng xuất từ xa (`AdminSessionList`) đối với tài khoản không thuộc cấp dưới hoặc nếu thiếu quyền `userForceLogoutOthers`.
- **Cơ chế Xóa mềm (Soft Delete) tài khoản:** Thay đổi hành động xóa tài khoản trong Firestore thành Xóa mềm bằng cách cập nhật `status: 'deleted'`. Client khi hoạt động sẽ tự động phát hiện trạng thái này và thực hiện đăng xuất.

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
