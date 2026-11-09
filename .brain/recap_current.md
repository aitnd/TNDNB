# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-09 (Kế hoạch 261109-0950)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `269a7e90` đã đẩy thành công lên `origin/main`).
- **Mục tiêu hoàn thành trong kế hoạch `261109-0950-remove-navbar-logout-button` (3 Phase — `daa4986d`, `850f50e3`, `269a7e90`):**
  1. **Phase 01 (`daa4986d`):** Dọn dẹp nút `Thoát` độc lập trên thanh TopNavbar Desktop ([`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)), loại bỏ vách ngăn dọc thừa, gom trọn vẹn hành động Đăng xuất vào bên trong Hamburger Menu 3 gạch (`showHamburgerMenu`).
  2. **Phase 02 (`850f50e3`):** Khắc phục triệt để lỗi hiển thị AdSense Auto-Ads (`✕ Ứng dụng ôn tập`) khi đăng nhập tài khoản Admin / Học viên lớp:
     - Thêm cờ `isAuthReady` vào [`useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts) và chỉ bật `true` trong [`useAppInitialization.ts`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts) khi Firebase Auth & Firestore đã tải xong hồ sơ, ngăn `AdSenseLoader` nhận nhầm Admin là khách vãng lai ở 300ms–1000ms đầu.
     - Thêm cờ hủy `isCancelled` trong [`AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx) triệt tiêu hoàn toàn Async Race Condition và Undead `IntersectionObserver`.
     - Thêm hàm `purgeAllAdSenseDomAndScripts()` và nâng cấp `ADSENSE_HIDE_ALL_CSS` ([`adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts)) với đa thuộc tính (`opacity: 0`, `pointer-events: none`, `transform: scale(0)`, `max-height: 0`, `z-index: -9999`) để đè bẹp inline `display: block !important` của Google Auto-Ads.
     - Tách riêng `lanh_dao` sang `config.leader` và bổ sung `Boolean(userProfile.courseId)` vào nhận diện `verified_user` trong [`usageService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts).
  3. **Phase 03 (`269a7e90`):**
     - Bổ sung 4 bài kiểm thử TDD (`TC-32`, `TC-33a`, `TC-33b`, `TC-34`) vào [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts).
     - Vượt qua **13/13 test suites (99/99 tests PASS 100%)** trong 628ms.
     - TypeScript Strict Typecheck: **0 errors**.
     - Đóng gói Vite `ontap-web` thành công ra [`public/ontap/`](file:///d:/Antigravity/TNDNB/public/ontap/) (16.84s).
     - Bảo toàn tuyệt đối 100% Invariant [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`0 bytes diff`).
     - Đã đẩy toàn bộ 3 commits lên `origin/main`, working tree sạch 100%.
