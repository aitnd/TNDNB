# CHANGELOG — [ontap-web]

## [3.11.0] - 2026-06-25 - Tích hợp và Tối ưu hóa Kiếm tiền Monetag
- **Chiến lược Quảng cáo Đa dạng:** Tích hợp Smart Tag (Vignette/Interstitial), Auto Popunder (giới hạn 1 lần/phiên), và Direct Link để tối ưu hóa doanh thu từ CPM/eCPM.
- **Dynamic Config qua Firebase:** Cho phép Admin thay đổi URL Direct Link động trực tiếp từ màn hình "Hệ thống" thay vì hardcode, phân bổ linh hoạt theo từng hạng tài khoản (RoleConfig).
- **Trải nghiệm chờ thông minh:** Bổ sung màn hình chờ `CountdownAdScreen` (5 giây) trước khi xem kết quả thi để tận dụng hiển thị quảng cáo toàn màn hình.
- **Service Worker Anti-Adblock:** Tích hợp `sw.js` vào thư mục public nhằm giảm tỷ lệ quảng cáo bị chặn bởi các trình duyệt và extension adblocker.

## [3.10.0] - 2026-06-25 - Thiết kế lại Admin Dashboard
- **AdminStatsBar:** Thanh hiển thị thông số online slim realtime trực quan ở trên cùng.
- **Giao diện 2 cột thông minh:**
  - Cột trái: Thẻ học viên/giáo viên (`StudentCard`) được giữ nguyên, kết hợp thêm các nút phụ điều hướng nhanh.
  - Cột phải: Lời chào thông minh theo giờ (`WelcomeHeader`), các nút thao tác nhanh dạng grid tiles (`QuickActionsGrid`).
- **Haptic Feedback:** Tích hợp rung phản hồi (haptics) cho các thao tác trên thiết bị di động.
- **Tối ưu hiệu năng (Lazy Loading):** Tách widget analytics (`CustomAnalyticsWidget`) thành chunk tải chậm (lazy-loaded chunk) chỉ tải khi admin click mở rộng để tiết kiệm băng thông tải trang ban đầu.

## [3.9.9] - 2026-06-15 - Sửa lỗi & Đóng gói Phục hồi
- **Đồng bộ hóa phiên bản:** Cập nhật phiên bản lên v3.9.9 để đồng bộ với root portal và ontap-win.
- **QA & Testing:** Khởi chạy và xác minh chất lượng sản phẩm chuẩn bị deploy.

## [3.9.8] - 2026-06-13 - Nâng cấp bảo mật & Tách Chunk Tối ưu
- **Nâng cấp SheetJS an toàn:** Chuyển đổi thành công thư viện đọc/ghi Excel từ `xlsx` (bản cũ lỗi thời) sang thư viện chính thức bảo mật `@sheetjs/xlsx` (v0.20.2) trên toàn hệ thống.
- **Tối ưu hóa dung lượng Bundle (Tách Chunk Vite):** Cấu hình manualChunks tách biệt thư viện `@sheetjs/xlsx` thành file chunk riêng `vendor-xlsx-*.js` (488 kB) trong cả hai cấu hình Vite `ontap-web/vite.config.ts` và `ontap-win/vite.config.ts`. File bundle chính `vendor-*.js` giảm từ **1.4 MB** xuống còn **907 kB** (tiết kiệm 35% dung lượng tải ban đầu).
- **Khắc phục lỗi biên dịch TypeScript:**
  - Định nghĩa tường minh kiểu `RoleKey` loại bỏ boolean `showPortalAds` để sửa lỗi spread types TS2698 tại `UsageConfigPanel.tsx`.
  - Khắc phục lỗi thiếu thư viện `@capacitor/local-notifications` bằng cách cập nhật dependency v8.0.1 tại `ontap-web/package.json`.
- **Sửa lỗi Unit Test:** Bọc `await waitFor` trong file test `AccountScreen.test.tsx` để xử lý cảnh báo `act(...)` bất đồng bộ của React, đưa tỷ lệ test pass đạt **100% (5/5 PASS)** sạch cảnh báo.

## [3.9.7] - 2026-06-12 - Triển Khai Quảng Cáo Portal & Refactor
- **Triển khai cấu hình quảng cáo Portal:** Bổ sung cấu hình `showPortalAds` trong Admin Panel cho phép bật/tắt quảng cáo trên Next.js Portal trang chủ & tin tức từ Firestore.
- **Đồng bộ hóa UI quản trị:** Thêm toggle "Quảng cáo Trang chủ & Tin tức" vào tab "Hệ thống" của UsageConfigPanel cho vai trò Admin và Lãnh đạo.
- **Tối ưu hóa Code (Refactor React Hooks):** 
  - Sửa lỗi thiếu dependency useEffect trong `CourseManager.tsx` bằng cách tách biệt logic cập nhật `viewingCourse` và Firestore listener.
  - Sửa lỗi useEffect trong `tai-khoan/page.tsx` bằng `useCallback` cho `fetchSessions`.
- **Vá bảo mật tự động:** Vá lỗ hổng của thư viện `@grpc/grpc-js` bằng `npm audit fix`.

## [3.9.6] - 2026-06-11 - Phân Tách Cấu Hình Ban Lãnh Đạo
- **Phân tách cấu hình vai trò:** Phân tách cấu hình giới hạn & quyền lợi giữa **Ban Lãnh Đạo** (`leader`) và **Cán Bộ Quản Lý** (`manager`) thành hai cấu hình độc lập trong database Firestore.
- **Đồng bộ hóa giao diện cấu hình:** Tách nút cấu hình hệ thống thành hai tab riêng biệt: "Ban Lãnh Đạo" (key: `leader`) và "Quản Lý" (key: `manager`).
- **Đồng bộ ánh xạ vai trò:** Cập nhật hàm `getRoleConfigKey` trên toàn bộ hệ thống (bao gồm AccountScreen, ClassManagementScreen và Next.js Portal đăng bài) để nhận diện đúng key `leader` khi vai trò là `lanh_dao`.
- **Sửa lỗi Unit Test:** Khắc phục lỗi kiểu dữ liệu TS2322 cho thuộc tính `role` trong `AccountScreen.test.tsx`.

## [3.9.5] - 2026-06-11 - Trạng thái Tài khoản & Kết thúc Lớp học
- **Quản lý trạng thái tài khoản:** Triển khai trạng thái tài khoản (`status: 'active' | 'disabled'`). Chặn đăng nhập và force logout thời gian thực khi tài khoản bị vô hiệu hóa. Ngăn tự tạo profile Firestore khi đăng nhập không profile.
- **Trạng thái lớp học:** Thêm trạng thái lớp học (`status: 'active' | 'finished'`). Khi kết thúc lớp học, tự động vô hiệu hóa toàn bộ học viên trong lớp học đó. Hỗ trợ mở lại lớp học.
- **Quản lý học viên nâng cao:** Thêm chức năng chọn nhiều học viên trong lớp để vô hiệu hóa hàng loạt. Thêm badge hiển thị trạng thái tài khoản và lớp học, làm mờ tài khoản bị vô hiệu hóa.
- **Phân quyền động mới:** Thêm phân quyền `courseDisableAccounts` (Vô hiệu hóa tài khoản học viên) và `courseFinish` (Kết thúc / Mở lại lớp học) cho từng vai trò.
- **Đồng bộ AccountScreen:** Chuyển đổi trạng thái xóa mềm thành `'disabled'` đồng bộ, hỗ trợ badge hiển thị và nút kích hoạt lại tài khoản.

## [3.9.3] - 2026-06-11 - Security Protection & Dynamic Roles Config
- **Bảo mật đề thi động:** Triển khai tính năng cấm chuột phải, bôi đen, copy và phím tắt (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong các màn hình thi/làm bài (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dựa trên thuộc tính cấu hình `preventCopy` động của từng vai trò từ database.
- **Realtime Security Policies:** Lắng nghe cấu hình bảo mật `settings/usage_config` theo thời gian thực bằng `onSnapshot` để thay đổi chính sách bảo mật ngay lập tức khi Admin điều chỉnh cấu hình mà không cần reload ứng dụng.
- **Phân quyền cấu hình động:** 
  - Admin có toàn quyền chỉnh sửa giới hạn và chính sách bảo mật cho tất cả các vai trò.
  - Lãnh đạo (`lanh_dao`) có quyền sửa cho các vai trò cấp dưới, riêng tab cấu hình của Admin sẽ hiển thị ở dạng Chỉ đọc (Read-only), ngăn cản Lãnh đạo can thiệp vào vai trò Quản trị viên tối cao.
- **Đồng bộ hóa Route:** Truyền `userProfile` prop vào `UsageConfigPanel` tại Route `/ontap/cauhinh` để xác thực phân quyền chính xác.

## [3.9.2] - 2026-03-29 - Premium Native Experience
- **UI/UX Native Overhaul**: Thiết kế lại toàn bộ giao diện theo phong cách Native Mobile cao cấp (Premium Cards, 3D icons, Apple-style spacing).
- **Haptic Feedback**: Tích hợp rung phản hồi (Vibration) cho mọi tương tác (Bấm nút, nộp bài, kết quả thi).
- **Mobile Navigation**: Thanh điều hướng dưới chân màn hình (Bottom Bar) chuẩn Mobile UI.
- **Enhanced Quiz Engine**: Tách biệt rõ ràng chế độ "Ôn tập" và "Thi thử mô phỏng" với bộ phím điều hướng tối ưu cho ngón cái.
- **Premium Animations**: Hệ thống chuyển cảnh mượt mà (Slide-up, Scale-up, Float) tối ưu cho cảm giác Native App.
- **Bug Fixes**: Sửa lỗi so sánh phiên bản và đồng bộ Electron-updater.

## [3.9.1] - 2026-03-22 - Đồng bộ hóa Props và Type Error Fix
- **ClassDetailClient.tsx**: Sửa lỗi Type Error và đồng bộ hóa hệ thống Props (thay `classData` bằng `course`).

## [3.9.0] - 2026-03-18 - Lớp Học & Analytics
- **Analytics**: Tích hợp Vercel Analytics để theo dõi Performance.
- **Search**: Cập nhật thanh tìm kiếm Lớp học (Search bar) UI/UX Pro Max.

## [3.8.12] - 2026-01-18 - Nâng cấp giao diện Thẻ
- **UI**: Thiết kế lại Thẻ Học viên/Giáo viên phong cách Premium Hologram v2.2.
- **Fix**: Sửa lỗi chính tả "THÈ" thành "THẺ" trên toàn hệ thống.

## [3.8.11] - 2026-01-18 - Góc giải trí VIP
- **Feature**: Thêm "Góc Giải Trí" với kho trò chơi HTML5 (Contra, Đào Vàng...).
