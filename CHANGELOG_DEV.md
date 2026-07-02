## [3.15.9] - 2026-07-02
### Selective AdBlocker (AdSense pointer-events: none / auto)
- **Shared Style:** Added `adBlockerStyles.ts` to export common styling definitions: `ADSENSE_SELECTIVE_BLOCK_CSS` and `ADSENSE_HIDE_ALL_CSS`.
- **AdSenseLoader:** Sourced `ADSENSE_SELECTIVE_BLOCK_CSS` in `AdSenseLoader.tsx` to apply selective pointer-events blocking.
- **PortalAdLoader:** Integrated `ADSENSE_SELECTIVE_BLOCK_CSS` in `PortalAdLoader.tsx`, removing legacy `display: none` layout concealment for AdSense, thereby enabling active viewability while retaining interaction safety.

## [3.15.8] - 2026-07-02
### Fix FileReader parameter shadowing bug in Excel Import (Web)
- **ImportStudentModal Bugfix:** Fixed a `TypeError` on `FileReader.readAsArrayBuffer` inside `handleFileUpload` where the file parameter was renamed to `_file` in `ontap-web` (to prevent a compiler warning) but the call remained referencing `file` (the outer state variable, which is still `null` due to React's asynchronous setState). Restored the parameter name to `file` to shadow the state correctly.

## [3.15.7] - 2026-06-30
### Mobile UI Enhancement & Navigation Architecture Refactoring (Web & Win)
- **New Mobile Header Component:** Integrated `MobileHeader` to render brand logo and user avatar dynamically based on `UserProfile` props on mobile layout.
- **Mobile Navigation Refactoring:** Overhauled `MobileBottomNav` component. Replaced legacy primary items (News, Practice, Account) with more functional routing keys: `dashboard` (Trang chủ), `history` (Lịch sử), and dynamic `class` (Lớp học) which toggles `FaSchool` or `FaUserGraduate` based on teacher/student role checking.
- **Expanded Secondary Drawer Menu:** Moved `Account` navigation to the sliding drawer. Integrated `Mailbox` (Hộp thư), `Download App` (Tải App), and `Config` (Cấu hình, restricted to `role === 'admin'`) in the bottom navigation menu items.
- **Safe Area Insets Adjustment:** Applied CSS padding-bottom using standard `env(safe-area-inset-bottom)` to avoid layout overlapping on modern borderless mobile devices.
- **Unified Layout Entry Integration:** Bound `MobileHeader` and `MobileBottomNav` layout renderers inside `AppContent` component for `ontap-web` (`App.tsx`) and `AppRoutes` wrapper for `ontap-win` (`AppRoutes.tsx`).

## [3.15.6] - 2026-06-30
### Tái cấu trúc mã nguồn hệ thống
- **Refactor (App.tsx):** Split God Component App.tsx vào routes/AppRoutes.tsx và hooks/useAppInitialization.ts cho cả ontap-web và ontap-win.
- **Cleanup:** Dọn dẹp unused variables và fix lỗi TypeScript warning (TS6133) ở nhiều files.

## [3.15.5] - 2026-06-30
### Fix Timezone Offsets, Refactor App.tsx, & Clean TS Warnings (Web & Win)
- **UTC-to-VN Time Conversion**: Fixed time drift by computing local hours with explicit `(new Date().getUTCHours() + 7) % 24` offset calculations inside `app/api/weather/route.ts` instead of relying on default server clock context.
- **Tooltip Overflow & Indicator Size**: Removed parent level `overflow-hidden` class in `WeatherWidget.tsx` (web & win) which caused status indicators tooltips to crop when rendered absolutely. Retained `overflow-hidden` transition inside the animated `motion.div` component. Increased network status indicator size to `w-4 h-4` for better accessibility.
- **App.tsx Refactoring (God Component Split)**: Extracted and isolated the client-side routing tree into `routes/AppRoutes.tsx`. Moved app initialization states, auth verification, database sync listeners, biometrics checks, and hardware back button listeners into a custom hook `hooks/useAppInitialization.ts`. Reduced `App.tsx` code size by 70%, keeping it purely as a coordinator.
- **TypeScript strict compliance**: Cleaned up 59 compiler warnings (`noUnusedLocals` and `noUnusedParameters` rules) across the `ontap-web` codebase. Removed unused local variables/imports in `App.tsx`, `StudentsTab.tsx`, `Dashboard.tsx`, `vite.config.ts`, etc. Fixed syntax errors and leftover logging.

## [3.15.4] - 2026-06-30
### Sửa lỗi Git Tag Duplication & Nâng cấp Cấu hình Quảng cáo (Web & Win)
- **Git Tag Autodelete**: Bổ sung hàm `deleteTag` gọi GitHub REST API endpoint `DELETE /repos/{owner}/{repo}/git/refs/tags/{tag}`. Tích hợp lệnh gọi xoá tag tự động trước khi tạo mới release trong `UsageConfigPanel.tsx` của cả bản Web và Win, tránh lỗi 422 `Validation Failed`.
- **Fix DirectLink Bug**: Cập nhật component `MonetagDirectLink` nhận thêm prop `maxPerSession` và kiểm tra giới hạn lượt hiển thị so với `sessionStorage` key `monetag_dl_count`. Nếu `maxPerSession <= 0` thì tắt hoàn toàn.
- **Single Source of Truth**: Thêm hằng số `AD_DISABLED = 0` và helper `isAdTypeDisabled` vào `services/monetagConfig.ts`.
- **UI Admin Panel Upgrade**: Cập nhật CSS trạng thái trong `UsageConfigPanel.tsx`, tự động đổi border thành `border-red-300` và gắn badge `🚫 Đã tắt` khi các ô input có giá trị `<= 0`.

## [3.15.3] - 2026-06-30
### Sửa lỗi hiển thị Huy hiệu Admin (MiniRoleBadge Opacity Bug)
- **Framer Motion Fix:** Bổ sung `opacity: 1` vào animate object của premium roles (`admin`, `super_admin`, `lanh_dao`) trong file `MiniRoleBadge.tsx` của cả `ontap-web` và `ontap-win`. Khắc phục triệt để lỗi ẩn huy hiệu (do ban đầu set `initial={{ opacity: 0 }}`).

### Tối ưu hóa xác thực Monetag qua Head Script tĩnh
- **Portal Layout Update:** Thay thế Next.js `<Script>` component (vốn tự động biên dịch sang queue JS động) thành thẻ `<script>` HTML chuẩn thô nằm trong `<head>` tự định nghĩa của `app/layout.tsx`. Giải quyết lỗi **"Installation error"** trên dashboard Monetag do bot quét tĩnh của họ không đọc được JS dynamic inject.

## [3.15.2] - 2026-06-30
### Weather Status Indicator (Web & App Win)
- **Weather Indicator UI:** Thêm indicator icon (`Signal`, `SignalLow`, `WifiOff`) và tooltip chi tiết thông qua state `dataSource` ('live' | 'server-mock' | 'offline') trên components `WeatherWidget.tsx` của cả `ontap-web` và `ontap-win`.

### Fix Monetag Ads Installation (Portal Head Script Injection)
- **Monetag Integration:** Đưa thẻ `<Script>` Monetag tĩnh vào file `app/layout.tsx` của Next.js với option `strategy="beforeInteractive"` để render thẳng trong HTML source của Head, vượt qua cơ chế quét mã cài đặt (Crawler check) của Monetag.

## [3.15.1] - 2026-06-30
### Cập nhật hệ thống quảng cáo Monetag (Web & App Win)
- **Multitag:** Cập nhật domain sang `quge5.com` và zone ID `254797`. Đổi attribute từ `data-z` sang `data-zone` và thêm `data-cfasync="false"` để tương thích với Cloudflare.
- **Service Worker:** Cập nhật domain sang `5gvci.com` và zone ID `11218490` trong các file `sw.js` (root, ontap-web, ontap-win).

### Cấu trúc thiết kế & Mở rộng thời tiết (Weather Redesign)
- **DESIGN.md Integration:** Tạo file `DESIGN.md` ở root quy định màu sắc Zinc trung tính, typography Satoshi, layout logic và spring motion. Vượt qua kiểm tra contrast WCAG AA.
- **Weather API Backend:** Sửa đổi API Next.js `/api/weather/route.ts` để slice dữ liệu forecast thực tế về 8 tiếng và refactor hàm giả lập `getDynamicMockWeather` sinh đủ 8 mốc động.
- **WeatherWidget Web/Win:** Tích hợp `Sparkles` icon, dynamic Advice styles (`getAdviceStyle`, `getAdviceIcon`), lọc emoji bằng regex và spring-physics hover card (`whileHover` trong Framer Motion).

## [3.15.0] - 2026-06-29
### Feature: Modernized Class Management UI (Web & Win)
- **ClassList Rewrite:** Rewrote `ClassList.tsx` to support both Grid and List view modes using Tailwind CSS.
- **Smart Cards:** Replaced traditional list items with dynamic cards containing gradient headers, status indicators (Active/Finished), and quick action overlay buttons (Edit/Delete).
- **Avatar Support:** Added `avatarUrl` rendering for head teachers fetching from `creatorProfiles` state map. Added avatarUrl input inside `AddEditCourseModal`.
- **Insights Bar:** Implemented `getDocs(query(collection(db, 'thithu_results'), where('courseId', '==', id)))` in `ClassManagementScreen.tsx` to display real-time member count and mock test attempt totals.
- **Environment Parity:** Synchronized changes from `ontap-web` to `ontap-win` to maintain codebase parity.

## [3.14.0] - 2026-06-29
### Gamification v2.0 - Complete Integration
- **BadgeAdminModal:** Implemented 3D icon rendering and manual grant/revoke functions using BadgeService for Admins and Leaders.
- **App.tsx Triggers:** Integrated `increasePracticeProgress` and `increaseMockTestProgress` into `saveExamResult` flows on both Web and Win platforms.
- **Fragment Fix:** Fixed React Fragment errors in UserManagerScreen.tsx on both platforms.
- **Constants Sync:** Synced `badges.ts` definitions for unified mock test and practice progress.

### QA Fixes
- **TypeScript Strict Compliance:** Fixed unused variables (`StudentAnswers`, `CONG_THUC_TRON_DE`, `loading`, `filterRole`, `sortKey`, `sortOrder`, `headTeacher`, `router`) across various components and API routes (`nop-bai`, `thi`, `dang-bai/sua`, `dang-bai/tao-moi`, `ho-so`, `ClassDetail`, `PostManager`, `StudentClassView`, `TeacherRoomList`) to successfully pass the Next.js `next build` process.
- **Rules of Hooks:** Refactored early returns in `AdminStatsBar.tsx` and `QuizScreen.tsx` to strictly occur after hook declarations, preventing React state mismatch errors across `ontap-web` and `ontap-win`.
- **Markdown Formatting & Font Issue:** Diagnosed recurring "lỗi font" in changelog rendering. Root cause: Missing newline (\n\n) before markdown headings (## [Version]) caused parsers to merge headings with previous list items, breaking UI typography and font scaling. Preventive measure: Always ensure strict double-newline separation between changelog blocks.

## [3.13.0] - 2026-06-29
### Gamification Engine & Smart Account Recycle (Web & App Win)
- **Badge Engine Core:** Implemented `BadgeService` and `BadgeListener` side-effect wrapper to trigger and unlock achievements (`achievement_1`, `achievement_perfect`) dynamically on quiz and online exam submission.
- **MiniRoleBadge Component:** Developed and integrated visual `<MiniRoleBadge />` displaying user privilege roles (`admin`, `giao_vien`, `hoc_vien`) in `TopNavbar` and `StudentCard`.
- **Database Recycling Services:** Added `BadgeService.resetUserBadges(uid)` and `clearUserHistory(uid)` in `historyService.ts` to purge and clean sub-collections and exam logs when recycling student IDs.
- **Conflict Resolution UI:** Upgraded `ImportStudentModal.tsx` and `CreateStudentModal.tsx` (Web & Win) with a pre-check verification step displaying conflict comparison tables and enforcing a double-confirmation prompt for active (unlocked) accounts before overwrite.
- **Codebase Cleanups & Modularity:** Cleaned up unused imports/variables in `Navbar`, `StudentsTab`, `PortalMaintenanceWrapper`, `admin/page.tsx`, and `quan-ly/[roomId]/page.tsx`. Added `.env*` to `ontap-win/.gitignore`.

## [3.12.2] - 2026-06-29
### Refactor UI Header Layout & TopNavbar Consolidation (Web & App Win)
- **Dashboard Row 1 Consolidation:** Integrated `<WeatherWidget />` and `<AdminStatsBar />` into a single responsive flex container (`flex flex-col lg:flex-row items-center justify-between gap-3 mb-4`) in both `Dashboard.tsx` (Web & Win).
- **Slim Weather & Stats Layout:** Reduced `WeatherWidget` padding to `py-2 px-3`, weather icon to `w-8 h-8`, and removed redundant `mb-6` margin from `AdminStatsBar.tsx`.
- **TopNavbar Restructuring:** Consolidated individual management links (`Quản lý lớp`, `Thi trực tuyến`, `Giám khảo`, `Quản lý TB`, `Cấu hình`) into a unified `<ShieldCheck />` System dropdown menu (`setShowSystemDropdown`) for privileged roles (`['admin', 'lanh_dao', 'quan_ly', 'giao_vien']`).
- **App.tsx Cleanup:** Removed redundant outer `<WeatherWidget />` renders from both `ontap-web/App.tsx` and `ontap-win/App.tsx`.

## [3.12.1] - 2026-06-29
### Changelog Refactoring & Popup Limits (Web & App Win)
- **Popup Version Limit**: Refactored `ChangelogModal.tsx` in both Web and Win to slice the changelog data array (`.slice(0, 1)`) showing only the latest release in the popup view.
- **Legacy Header Alignment**: Aligned and replaced legacy date headers in `CHANGELOG.md`, `CHANGELOG_DEV.md`, `ontap-web/CHANGELOG.md`, and `ontap-win/CHANGELOG.md` with semantic versions (`[3.9.2]`, `[3.8.0]`, `[3.7.0]`, `[3.6.0]`).
- **Workflow Updates**: Updated `/check-project` and `/tndnb-build` global workflows with double changelog verification rules and SemVer standards.

## [3.12.0] - 2026-06-29
### Cập nhật hệ thống bảo trì & IVT Shield
- **Tính năng:** Tách độc lập 3 công tắc bảo trì cho trang chính (Portal), Web và Win.
- **Tính năng:** Thêm nút bật/tắt quảng cáo (AdSense, Adsterra, Monetag) cho trang chính Portal.
- **Bảo mật:** Áp dụng giới hạn click AdSense (IVT Shield) để chống Invalid Traffic cho Portal.
- **Tính năng:** Đổi đơn vị thời gian cooldown quảng cáo từ 'giờ' sang 'phút' trên toàn hệ thống.
- **UI:** Cập nhật màn hình admin config đồng bộ cho Web và Win.

# Changelog
## [3.11.0] - 2026-06-29
### Tích hợp & Tối ưu hóa Kiếm tiền Monetag (Web & App Win)
- **Chiến lược Quảng cáo Đa dạng:** Tích hợp Smart Tag (Vignette/Interstitial), Auto Popunder (giới hạn 1 lần/phiên), và Direct Link để tối ưu hóa doanh thu từ CPM/eCPM cho thị trường Việt Nam.
- **Dynamic Config qua Firebase:** Cho phép Admin thay đổi URL Direct Link động trực tiếp từ màn hình "Hệ thống" thay vì hardcode.
- **Phân bổ theo Vai trò (RoleConfig):** Cho phép bật/tắt riêng biệt các định dạng Popunder, Direct Link, Countdown Ad theo từng hạng tài khoản (Free, Verified, VIP).
- **Trải nghiệm chờ thông minh:** Bổ sung màn hình chờ đếm ngược `CountdownAdScreen` (5 giây) trước khi xem kết quả thi để hiển thị quảng cáo Interstitial hiệu quả. (Tự động vô hiệu hóa trên môi trường Electron/Windows).
- **Service Worker Anti-Adblock:** Tích hợp `sw.js` nhằm giảm tỷ lệ quảng cáo bị chặn bởi các trình duyệt và extension.
- **Cấu hình Quảng cáo Tách biệt:** Tách riêng cấu hình bật tắt quảng cáo cho AdSense, Adsterra và Monetag trên trang chủ tin tức.
- **Dự kiến hiển thị (Text fallback):** Bổ sung text fallback trong màn hình bảo trì khi Admin không cài giờ bảo trì cụ thể.


## [3.10.9] - 2026-06-29
### Chặn Route Nghiêm Ngặt & Bộ Đếm Ngược Bảo Trì (Web & App Win)
- **Chặn route 2 lớp bảo mật:** Thêm component `ProtectedRoute` bọc các route nhạy cảm. Vá hoàn toàn 4 lỗ hổng bảo mật route admin (class-manager, usermanager, settings, exam-manager) hiện tại chỉ check đăng nhập mà không check vai trò.
- **Security Rules Firestore:** Thiết kế và lưu trữ file `firestore.rules` tại thư mục root để quản trị, kiểm soát quyền truy cập collections ở tầng Server-side.
- **Bộ đếm ngược thời gian thực (Real-time Maintenance Countdown):** Tích hợp custom hook `useCountdown` để tự động tính thời gian chênh lệch từng giây trên màn hình bảo trì `MaintenanceScreen` (Web & Win).
- **Giao diện countdown Glassmorphism:** Hiển thị thời gian bảo trì còn lại trực quan dưới dạng 4 ô glassmorphic tinh tế (Ngày/Giờ/Phút/Giây) với hiệu ứng số chạy mượt mà, tự động chuyển đổi sang nút "Tải lại trang" và tự động reload trang sau 10 giây khi hoàn tất bảo trì.
- **Cấu hình admin tiện ích:** Bổ sung input datetime picker `maintenanceEndTime` (ISO 8601) vào trang cài đặt hệ thống `UsageConfigPanel` của admin để cấu hình đếm ngược chính xác, giữ nguyên cơ chế text fallback nếu admin không cài đặt giờ cụ thể.

## [3.10.8] - 2026-06-27
### Cải tiến Giao diện Bảo trì, Phân quyền Dashboard Học Viên & Tối Ưu WeatherWidget (Web & App Win)
- **Hoạt họa Gears lướt sóng cực đẹp:** Khắc phục triệt để lỗi ghi đè transform của Framer Motion bằng cách bọc thẻ bánh răng vào thẻ div tĩnh, đồng thời thêm hiệu ứng cờ lê lơ lửng và tự lắc lư (Wobble) cực sinh động.
- **Cấu hình động 3 cột từ Settings:** Thêm các ô nhập liệu Thời gian dự kiến, Thông tin dữ liệu và Liên hệ hỗ trợ tại trang `/ontap/settings`.
- **Nâng cấp trang bảo trì tĩnh:** Trang bảo trì tĩnh `maintenance.html` được nâng cấp với giao diện gears mới và script kéo cấu hình động trực tiếp từ Firestore REST API của dự án `thi-tnd`.
- **Phân quyền Dashboard Học viên:** Ẩn các ô thao tác nhanh **Thông báo** và **Thống kê** trên Dashboard của học viên, đồng thời chặn quyền truy cập trực tiếp bằng URL đối với hai trang này (tự động chuyển hướng về Dashboard nếu học viên cố tình nhập URL).
- **Tối ưu hóa WeatherWidget hoạt động mọi nơi:** Tự động sử dụng API production của domain `https://daotaothuyenvien.com` khi chạy local/dev/offline và bổ sung cơ chế nạp dữ liệu thời tiết giả lập (mock fallback) nếu API lỗi để widget luôn hiển thị ổn định.

## [3.10.7] - 2026-06-27
### Tối ưu Vitest, vá bảo mật overrides & Đồng bộ điều hướng Dashboard (Web & App Win)
- **Tối ưu hóa chạy Vitest:** Thêm tùy chọn `fileParallelism: false` vào cấu hình kiểm thử của cả bản Web và Windows để tránh lỗi treo/timeout worker pool trên Windows, giúp giảm thời gian chạy test từ ~70s xuống còn 4.5s.
- **Vá bảo mật (Dependency Overrides):** Áp dụng cơ chế overrides ở root để vá hoàn toàn các lỗ hổng bảo mật Critical & High (protobufjs, protobufjs-cli, tar, uuid, fast-xml-parser, postcss, glob, @grpc/grpc-js).
- **Đồng bộ điều hướng Dashboard:**
  - Nút **Thông báo**: Chuyển hướng từ `/ontap/mailbox` sang trang quản lý thông báo `/ontap/notifications` (Web & Win).
  - Nút **Cấu hình**: Chuyển hướng từ `/ontap/profile` sang trang cài đặt `/ontap/settings` (Win).
- **Gộp cấu hình Monetag:** Gộp cấu hình hiển thị quảng cáo Monetag vào tab "Bảo vệ Quảng cáo (IVT Shield)", chuyển từ bật/tắt theo role sang cấu hình tần suất chung (số lần/phiên) trên toàn hệ thống.

## [3.10.6] - 2026-06-26
### Tích hợp Widget Thời tiết & Tối ưu hóa hình ảnh (Web & App Win)
- **Tính năng mới - Widget Thời tiết Thông minh:**
  - Tự động định vị người dùng (Browser Geolocation) hoặc tự động fallback về Triệu Việt Vương, phường Hoa Lư, Ninh Bình nếu bị từ chối quyền định vị.
  - Tích hợp API Next.js `/api/weather` (WeatherAPI với cơ chế Mock fallback) để lấy dữ liệu thời tiết thực tế.
  - Hiển thị nhiệt độ, trạng thái thời tiết hiện tại kèm theo lời khuyên học tập, thi cử sinh động bằng tiếng Việt.
  - Bổ sung nút mở rộng để xem dự báo thời tiết chi tiết trong ngày, ngày mai và dự báo 7 ngày.
  - Đồng bộ giao diện widget thích ứng Mobile và hỗ trợ đầy đủ Light/Dark Mode trên cả Web và App Windows.
- **Tối ưu hình ảnh Portal:** Thay thế thẻ `<img>` bằng component `<Image>` của Next.js để tăng tốc độ tải trang và giải quyết triệt để 22 cảnh báo linting.
- **Tối ưu hình ảnh App Web & Win:** Bổ sung thuộc tính `loading="lazy"` and `alt` cho toàn bộ thẻ `<img>` trên ứng dụng Vite của cả Web và Windows.
- **Sửa lỗi cú pháp:** Sửa lỗi trùng lặp thuộc tính `style` trong component `StudentClassView.tsx` phát sinh từ quá trình refactor trước đó.

## [3.10.5] - 2026-06-25
### Tối ưu Google AdSense & Bảo vệ IVT (Web & App Win)
- **Tối ưu AdSense Shield:** Thay đổi cơ chế chặn click tặc. Thay vì ẩn toàn bộ quảng cáo (display: none), chuyển sang sử dụng pointer-events: none để chặn click chuột nhưng vẫn giữ 100% hiển thị (Active View) nhằm duy trì doanh thu Impression.
- **Nâng cấp giới hạn AdSense:** Quản trị viên có thể tùy chỉnh giới hạn số click và thời gian phục hồi (Cooldown) trực tiếp từ màn hình "Hệ thống" thay vì hardcode.

## [3.10.4] - 2026-06-25
### Hệ Thống Bảo Trì 2 Tầng (Web & App Win)
- **Tính năng 1:** Tích hợp chế độ bảo trì Mềm (Tầng 1) vào App Windows, đồng bộ trạng thái khóa màn hình với Web.
- **Tính năng 2:** Thêm trang bảo trì Cứng (Tầng 2) dùng Vercel Edge Config cho Web.
- **Sửa lỗi 1:** Sửa các cảnh báo bảo mật High severity (npm audit fix) cho Web.
- **Bảo mật:** Cho phép role admin bypass màn hình bảo trì qua route /ontap/login-admin.

## [3.10.1] - 2026-06-25
### Tách biệt Module Quản lý Thành viên & Refactor Account Screen (Web & App Win)
- **Trang Quản lý thành viên riêng biệt (`/ontap/usermanager`):**
  - Tách toàn bộ bảng danh sách, bộ lọc, tìm kiếm và phân trang người dùng ra khỏi trang cá nhân thành một trang quản trị chuyên biệt mới.
  - Tích hợp Slide-over Panel xem chi tiết và danh sách thiết bị/phiên đăng nhập để force logout từ xa.
  - Thiết kế 3 thẻ KPI Stats tổng quan tài khoản (Học viên, nhân sự, bị khóa) hiển thị tĩnh ở đầu trang, tối ưu hóa Firestore Read Call.
- **Refactor `AccountScreen` cá nhân:**
  - Dọn dẹp hoàn toàn logic và giao diện quản trị thành viên cũ trong `AccountScreen.tsx` ở cả Web và Windows App (code giảm từ ~809 dòng xuống còn ~250 dòng).
  - Tích hợp danh sách phiên đăng nhập hoạt động của chính cá nhân (`AdminSessionList`) hiển thị trực tiếp ở cuối trang hồ sơ để nâng cao trải nghiệm bảo mật tự phục vụ.
- **Tích hợp Dashboard & Quick Actions:**
  - Cập nhật `QuickActionsGrid.tsx` và `Dashboard.tsx` thêm nút **"Quản lý Thành viên"** vào Dashboard admin (Web & Windows).
  - Đăng ký Route `/ontap/usermanager` và map điều hướng trong `App.tsx` ở cả 2 phân hệ.
- **Kiểm thử & Build pass 100%:** Xác thực biên dịch TypeScript (`tsc --noEmit`) và đóng gói `npm run build` thành công trên cả phân hệ Web và Windows.

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

## [3.9.2] - 2026-06-11
### Security & Role Authorization (Legacy)
- **Khóa chuột phải bảo mật (App Win & Web)**:
  - Trên App Win (Electron): Khóa chuột phải toàn cục đối với học viên và tài khoản thường để tránh rò rỉ mã nguồn và dữ liệu. Cho phép tài khoản `admin` sử dụng để debug.
  - Trên Web: Khóa chuột phải tại 4 màn hình thi/làm bài và giám khảo (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) để chống gian lận thi cử. Bỏ qua chặn đối với tài khoản `admin`.
- **Đồng bộ tiến độ**: Lưu trữ tiến độ thông qua `/save_brain`, cập nhật handover và dữ liệu bộ nhớ tĩnh/động (`brain.json`, `session.json`).

## [3.8.0] - 2026-03-29
### Fixed
- **Hệ thống Ôn tập Windows (Electron)**: Khắc phục lỗi **Màn hình trắng (ReferenceError: Award is not defined)** bằng cách bổ sung import icon `Award` còn thiếu trong `TopNavbar.tsx`.
- **Ổn định hóa hệ thống**: Đã thực hiện build và kiểm thử (`npm run build`) trong thư mục `ontap-win` đảm bảo ứng dụng không còn bị crash khi render.

### Changed
- **Bảo mật & Trải nghiệm**: Vô hiệu hóa tính năng tự động mở DevTools khi khởi động app và ẩn nút chuyển đổi DevTools trong giao diện chính (nhằm hạn chế can thiệp kỹ thuật F12 theo yêu cầu).
- **Phân tích dữ liệu**: Xác định chính xác nguồn dữ liệu câu hỏi offline nằm tại `ontap-win/data/questions_db.json`.

## [3.7.0] - 2026-03-29 (Android)
### Android Optimization Phases
- **Phase 04 (Visual)**: Đồng bộ màu sắc hệ thống Android (Indigo #4f46e5) và tối ưu hóa SplashScreen. Đã đồng bộ `colors.xml` trực tiếp vào dự án Android Studio.
- **Phase 05 (Security & Core)**: 
    - Tích hợp **Khóa Sinh trắc học (Fingerprint/FaceID)** bảo vệ ứng dụng ngay từ khi khởi động.
    - Hệ thống **Thông báo Nhắc học (Daily Reminders)** giúp học viên không bỏ lỡ bài vở.
    - `NativeSettingsModal`: Trung tâm quản lý các tính năng phần cứng thiết bị.
- **Phase 06 (Assets)**: Tối ưu hóa toàn bộ tài nguyên hình ảnh. Giảm kích thước Icon (5.4MB -> ~100KB) và Splash Screen (8.3MB -> 2.7MB) giúp APK nhẹ hơn và khởi động nhanh hơn. Tái tạo bộ resource icon/splash đúng chuẩn Android.

## [3.6.0] - 2026-03-15
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

