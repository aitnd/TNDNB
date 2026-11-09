# Plan: Loại bỏ nút "Thoát" trên TopNavbar & Khắc phục triệt để lỗi hiển thị AdSense sai đối tượng (Admin/Verified User)

> **Plan ID:** `261109-0950-remove-navbar-logout-button`
> **Ngày tạo:** 2026-11-09
> **Cập nhật:** 2026-11-09 10:25 (Bổ sung Phase 02: Fix AdSense Role Gating & Auto-Ads Race Condition)
> **Trạng thái:** Completed

---

## 1. Tổng quan PRD & Bối cảnh (Product Context)

### 1.1. Yêu cầu #1: Loại bỏ nút "Thoát" độc lập trên thanh `TopNavbar`
- Phía bên phải thanh điều hướng [TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) hiện đang hiển thị đồng thời:
  1. Thông tin chào người dùng (`Xin chào, Nguyễn Tiến Hưng 👑`).
  2. Vách ngăn dọc (`<div className="h-6 w-[1px] bg-border mx-1 hidden md:block"></div>`).
  3. Nút `[Thoát]` màu đỏ nằm lộ thiên trên thanh bar (`Standalone Logout Button (Desktop)`).
  4. Nút `[≡]` (Hamburger Menu 3 gạch), bên trong menu xổ xuống đã có sẵn nút **`Đăng xuất`** ở cuối danh sách.
- **Mục tiêu:** Loại bỏ hoàn toàn vách ngăn dọc và nút `Thoát` độc lập nằm ngoài thanh `TopNavbar` trên `ontap-web`, giữ nguyên 100% nút `Đăng xuất` nằm gọn bên trong Hamburger Menu (`showHamburgerMenu`).

### 1.2. Yêu cầu #2: Khắc phục triệt để lỗi hiển thị AdSense khi đăng nhập tài khoản Admin / Học viên đã xác minh
- **Hiện tượng thực tế:** Admin đã cấu hình trong `UsageConfigPanel` chỉ bật AdSense cho **Khách vãng lai (`guest`)** và **Học viên tự do (`free_user`)**, tắt hoàn toàn AdSense cho `verified_user`, `vip_user`, `teacher`, `manager`, `leader`, `admin`. Tuy nhiên khi đăng nhập bằng tài khoản **Admin** (`Nguyễn Tiến Hưng 👑`) trên điện thoại (`daotaothuyenvien.com/ontap`), ở góc dưới bên trái màn hình vẫn hiện nút nổi AdSense Auto-Ads (`✕ [📰] Ứng dụng ôn tập`).
- **4 Nguyên nhân gốc rễ (Root Causes) đã xác định:**
  1. **Nguyên nhân #1 (Chí mạng - Auth Initialization Race Condition):**
     - Khi mở hoặc tải lại trang `/ontap`, `userProfile` trong Zustand store ([useAppStore.ts](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts)) khởi tạo là `null` trong khoảng 300ms–1200ms đầu tiên (trong lúc chờ Firebase Auth `onAuthStateChanged` khôi phục phiên từ IndexedDB và Firestore tải hồ sơ `admin` trong [useAppInitialization.ts](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts)).
     - `<AdSenseLoader userProfile={userProfile} />` trong [AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx) được mount ngay từ đầu và chạy `checkConfig()` ngay khi `userProfile === null` (trước khi `isAuthReady` hoàn tất).
     - Khi `userProfile === null`, hàm `getUserRoleConfig(config, null)` trả về cấu hình của **Khách vãng lai (`config.guest`)**! Vì Admin cài đặt `guest.showAdSense = true`, `AdSenseLoader` lập tức nhận nhầm Admin là Khách vãng lai trong vài trăm ms đầu và gọi `loadAdSenseScript()` bơm `adsbygoogle.js` vào trang!
  2. **Nguyên nhân #2 (Chí mạng - Async Closure Race Condition & Undead `IntersectionObserver` trong [AdSenseLoader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx)):**
     - Trong [AdSenseLoader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx) (dòng 13–85), hàm `checkConfig()` là `async` (`await getUsageConfig()`), nhưng **không có cờ `isCancelled` (cleanup flag)**.
     - Khi lượt chạy 1 (`userProfile = null`) đang `await getUsageConfig()`, Firebase Auth tải xong `userProfile = Admin` và kích hoạt cleanup của lượt 1. Tại thời điểm cleanup chạy, biến `observer` của lượt 1 vẫn là `null` nên `observer?.disconnect()` không làm gì cả!
     - Ngay sau đó, `await getUsageConfig()` của lượt 1 hoàn tất, nó gọi `removeAllAdSenseStyles()` (xóa mất style ẩn quảng cáo của lượt 2), tạo `IntersectionObserver` không bao giờ bị hủy, và gọi `loadAdSenseScript()` nạp quảng cáo đè lên phiên Admin!
  3. **Nguyên nhân #3 (DOM Cleanup & Inline `!important` của Google Auto-Ads):**
     - Một khi `adsbygoogle.js` đã chạy, nó tự sinh ra các phần tử Auto-Ads / Anchor / Floating Pill (`✕ Ứng dụng ôn tập`) với class `.adsbygoogle`, `.adsbygoogle-noablate`, `.google-auto-placed`, `iframe[id^="google_ads"]`, `div[id^="google-anno"]`, `ins[data-ad-status]`, `[data-ad-client]` kèm inline style `style="display: block !important"`.
     - Trong CSS chuẩn, inline `style="display: block !important"` thắng `<style> .adsbygoogle { display: none !important } </style>`. Hơn nữa, `removeScripts()` trong [AdSenseLoader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx) hiện chỉ xóa thẻ `<script id="adsense-script">` chứ không xóa các thẻ DOM đã chèn vào trang.
  4. **Nguyên nhân #4 (Sót điều kiện phân loại Role trong `getUserRoleConfig` tại [usageService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts)):**
     - Dòng 30: Vai trò `lanh_dao` đang bị trả về `config.manager` thay vì `config.leader || config.manager` (trong khi `UsageConfigPanel.tsx` tách riêng 2 tab `manager` và `leader`).
     - Dòng 45: Kiểm tra học viên đã xác minh (`verified_user`) đang viết `if (userProfile.class && userProfile.class.length > 0 || userProfile.isVerified)` — thiếu điều kiện `|| Boolean(userProfile.courseId)` (như `TopNavbar.tsx` dòng 209 đang dùng), khiến học viên đã được gán `courseId` nhưng chưa có `isVerified: true` bị rơi xuống `free_user` và bị hiện quảng cáo.

---

## 2. Phân tích Tác động & Giải pháp Kiến trúc (Impact Analysis)

### 2.1. Hạng mục 1: Dọn dẹp `TopNavbar.tsx` (Phase 01)
- **[ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx):**
  - Xóa vách ngăn dọc `<div className="h-6 w-[1px] bg-border mx-1 hidden md:block"></div>` và nút `Thoát` độc lập (`{/* Standalone Logout Button (Desktop) */}`) tại dòng 215–225.
  - Giữ nguyên nút `Đăng xuất` bên trong Hamburger Menu (`showHamburgerMenu`, dòng 359–369).

### 2.2. Hạng mục 2: Chốt chặn Auth Ready & Khử sạch AdSense sai đối tượng (Phase 02)
1. **Thêm cờ `isAuthReady` vào [useAppStore.ts](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts) & [useAppInitialization.ts](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts):**
   - Trong `useAppStore.ts`: Thêm state `isAuthReady: boolean` (mặc định `false`) và setter `setIsAuthReady: (ready: boolean) => void`.
   - Trong `useAppInitialization.ts`: Trong callback `onAuthStateChanged(auth, async (firebaseUser) => { ... })`:
     - Nếu `firebaseUser` tồn tại: Đợi lấy xong `profile` (từ `getUserProfile(firebaseUser.uid)` hoặc `onSnapshot` lần đầu) và gọi `setUserProfile(profile)` xong xuôi rồi mới gọi `setIsAuthReady(true)`.
     - Nếu `firebaseUser === null` (người dùng thực sự chưa đăng nhập): Gọi `setUserProfile(null)` rồi gọi `setIsAuthReady(true)`.
2. **Truyền `isAuthReady` và chống Race Condition trong [AdSenseLoader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx) & [AppRoutes.tsx](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx):**
   - Trong `AppRoutes.tsx`: Lấy `isAuthReady` từ `useAppStore` và chỉ kích hoạt `<AdSenseLoader userProfile={userProfile} isAuthReady={isAuthReady} />`.
   - Trong `AdSenseLoader.tsx`:
     - Nếu `!isAuthReady`: **Tuyệt đối không gọi `checkConfig()`** để nạp quảng cáo của `guest`; đồng thời gọi `injectHideAdsCompletely()` tạm thời trong lúc chờ xác thực để không lọt bất kỳ quảng cáo nào.
     - Thêm biến cục bộ `let isCancelled = false;` trong `useEffect`. Trong hàm cleanup (`return () => { isCancelled = true; observer?.disconnect(); ... }`), nếu `isCancelled === true` sau khi `await getUsageConfig()` hoàn tất thì `return` ngay lập tức, không bao giờ cho phép lượt chạy cũ ghi đè hay tạo `IntersectionObserver` ma (undead observer).
     - Xây dựng hàm `purgeAllAdSenseDomAndScripts()`: Khi role hiện tại có `showAdSense === false`:
       - Xóa các script `#adsense-script`, `script[src*="adsbygoogle"]`, `#adsterra-script`, `#monetag-script`.
       - Quét và `.remove()` toàn bộ các phần tử DOM do Google Auto-Ads / Anchor / Floating Pill sinh ra: `.adsbygoogle`, `.adsbygoogle-noablate`, `.google-auto-placed`, `ins[data-ad-client]`, `ins[data-ad-status]`, `div[id^="google-anno"]`, `div[id^="google_ads"]`, `iframe[id^="google_ads"]`, `iframe[id^="aswift"]`, `iframe[src*="googlesyndication"]`, `#google-vignette`.
       - Reset `document.body.style.paddingBottom` / `paddingTop` nếu Auto-Ads từng chèn khoảng đệm.
3. **Nâng cấp CSS ẩn quảng cáo tuyệt đối tại [adBlockerStyles.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts):**
   - Cập nhật `ADSENSE_HIDE_ALL_CSS` bao phủ mọi selector của Google Auto-Ads (`.adsbygoogle, ins.adsbygoogle, .adsbygoogle-noablate, .google-auto-placed, [data-ad-client], [data-ad-status], div[id^="google-anno"], div[id^="google_ads"], iframe[id^="google_ads"], iframe[id^="aswift"], #google-vignette`).
   - Kết hợp đa thuộc tính CSS để thắng cả trường hợp Google gán inline `style="display: block !important"`:
     ```css
     display: none !important;
     visibility: hidden !important;
     opacity: 0 !important;
     pointer-events: none !important;
     height: 0 !important;
     max-height: 0 !important;
     width: 0 !important;
     max-width: 0 !important;
     overflow: hidden !important;
     z-index: -9999 !important;
     transform: scale(0) !important;
     ```
4. **Chuẩn hóa phân loại Role tại [usageService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts):**
   - Trong `getUserRoleConfig(config, userProfile)`:
     - Tách riêng `role === 'lanh_dao'` trả về `{ param: config.leader || config.manager, type: 'leader' }` và `role === 'quan_ly'` trả về `{ param: config.manager, type: 'manager' }`.
     - Cập nhật điều kiện Học viên đã xác minh (`verified_user`):
       `if ((userProfile.class && userProfile.class.length > 0) || userProfile.isVerified || Boolean(userProfile.courseId))` -> trả về `{ param: config.verified_user, type: 'verified' }`.

### 2.3. Các Bất biến Hệ thống (Mandatory Invariants)
1. **Invariant 1:** Bảo toàn tuyệt đối 100% tệp [ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`0 bytes diff`).
2. **Invariant 2:** Giữ nguyên chức năng `onLogout` bên trong Hamburger Menu của [TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx).
3. **Invariant 3:** Không làm ảnh hưởng đến việc hiển thị AdSense hợp lệ cho `guest` (người thực sự chưa đăng nhập sau khi `isAuthReady === true`) và `free_user` (học viên chưa xác minh/chưa vào lớp) khi Admin bật `showAdSense: true` cho 2 nhóm này.
4. **Invariant 4:** Bộ kiểm thử Vitest tại [portal-console-and-tinymce-fix.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm định đầy đủ cả Phase 01 và Phase 02, tất cả PASS 100%, và build lại `ontap-web` sang `public/ontap/`.

---

## 3. Bảng Theo dõi Tiến độ các Phases (Phase Tracking)

| Phase | Tên Phase | Tệp chi tiết | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Phase 01** | Dọn dẹp nút `Thoát` thừa trên thanh `TopNavbar.tsx` (`ontap-web`) | [phase-01-topnavbar-cleanup.md](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-01-topnavbar-cleanup.md) | `[x] Complete (daa4986d)` |
| **Phase 02** | Khắc phục triệt để lỗi hiển thị AdSense sai đối tượng (Auth Ready Guard, Async Cancellation, DOM Purge & Role Mapping) | [phase-02-adsense-role-gating-fix.md](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-02-adsense-role-gating-fix.md) | `[x] Complete (850f50e3)` |
| **Phase 03** | Bổ sung Unit Test Vitest, Kiểm thử toàn diện & Build `public/ontap` | [phase-03-testing-and-build.md](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-03-testing-and-build.md) | `[x] Complete` |
