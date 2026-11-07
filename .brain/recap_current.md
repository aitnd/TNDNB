# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-07 (10:10)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh `feat/mobile-dashboard-and-top-navbar-simplification` (Commit mới nhất: `9d06d0a7`).
- **Pull Request URL:** https://github.com/aitnd/TNDNB/pull/new/feat/mobile-dashboard-and-top-navbar-simplification
- **Mục tiêu hoàn thành trong phiên làm việc:**
  1. **Kế hoạch 1 (`261107-0620-mobile-dashboard-simplification-and-error-audit`):**
     - Giải mã lỗi console Bitwarden extension và sửa triệt để React Hydration Mismatch bằng `dynamic(..., { ssr: false })` cho `FeaturedSlider`.
     - Mặc định chọn cả 2 checkbox đăng nhập ("Ghi nhớ đăng nhập" và "Lưu tài khoản này").
     - Loại bỏ popup cảnh báo đăng nhập 1 thiết bị, ngăn tự động hỏi Geolocation.
     - Tối giản Mobile Dashboard: hiển thị Thẻ học viên và nút "Vào Ôn Tập / Thi Thử" to rõ ràng (1 chạm vào thi ngay).
     - Tối ưu TopNavbar: gom Tài khoản và Đăng xuất vào Menu 3 gạch bên phải, khóa 4 nút cho học viên mobile (`[Ôn tập]`, `[Lớp của tôi]`, `[Chuông]`, `[Menu 3 gạch]`).
     - Tích hợp banner cài đặt PWA Add to Home Screen (Web Manifest, iOS guide, auto-hide trên standalone).
     - Xóa 2 nhánh cũ: `fix/console-cleanup` và `feature/phase-1-2-updates` kèm `git fetch --prune`.
  2. **Kế hoạch 2 (`261107-0940-clean-console-and-guest-firestore-guard`):**
     - Phân tích DevTools console trên trang thi thử `/ontap/thithu`: Lỗi đỏ `net::ERR_BLOCKED_BY_CLIENT` là do tiện ích uBlock Origin/Adblock; lỗi đỏ `200.js reading M_ID` là do Chrome extension của máy khách; cảnh báo vàng `FirebaseError: Missing or insufficient permissions` là do khách vãng lai bị Firestore Security Rules chặn đọc `settings`.
     - Thêm Guest Auth Guard `auth?.currentUser` vào `getUsageConfig()` và `getGitHubConfig()` trong `ontap-web/services/adminConfigService.ts`. Khách vãng lai bỏ qua Firestore, nạp thẳng từ localStorage/default (Zero-Noise Console).
     - Thêm 2 test TDD `TC-28` và `TC-29` vào `scripts/portal-console-and-tinymce-fix.test.ts`.

- **Trạng thái Kiểm thử & Build:**
  - Bộ test TDD: **29/29 tests PASS (100%)** trong 277ms.
  - TypeScript Strict Typecheck: **0 errors** trên cả root và `ontap-web`.
  - Production Build: Build thành công Vite (`ontap-web`) và Next.js (57 routes).
  - Bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` **0 bytes diff**.
  - Git Commit: SHA `9d06d0a7` đã đẩy lên origin.
