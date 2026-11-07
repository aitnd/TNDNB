# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-07 (11:12)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `f60b54c6` sau khi merge từ `feat/mobile-dashboard-and-top-navbar-simplification`).
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
  3. **Kế hoạch 3 (`261107-1035-remove-fake-stats-welcome-modal`):**
     - Thực hiện chỉ đạo dứt khoát của người dùng qua 2 ảnh:
       * Ảnh 1: *"bỏ phần giới thiệu em tự bịa này đi"* (Cột phải `md:col-span-5` chứa "THÔNG SỐ HỆ THỐNG HỌC LIỆU" với `100%`, `30 câu / đề`, `24/7`).
       * Ảnh 2: *"bỏ cả cái này nữa"* (Cột trái chứa 3 bullet points: `Ôn luyện theo từng môn...`, `Tự động lưu câu hay sai...`, `Hỗ trợ làm bài ngoại tuyến...`).
     - Tái cấu trúc `ontap-web/components/WelcomeModal.tsx` thành thẻ đơn trung tâm (`max-w-lg text-center`) theo chuẩn Taste-Skill v2.5.0 (`centred`) và 62-rule Impeccable Craft Floor v4.8.0.
     - Lấy Bánh lái 3D (`HelmIcon3D`) làm tâm điểm thị giác, giữ nguyên vẹn interface contract `WelcomeModalProps`, hotline `0229 628 2969` gắn `tabular-nums`.
     - Cập nhật bộ test TDD `scripts/ontap-dual-theme-and-sidebar.test.ts` (11/11 tests PASS).
     - Đã hoàn tất `[Bước 07] /check-project` (52/52 tests PASS, 0 lỗi TypeScript, 0 bytes diff `ExamQuizScreen.tsx`, Next.js 57 routes & Vite build hoàn tất).
     - Đã thực hiện `[Bước 08] /finishing-a-development-branch`: Merge `--no-ff` vào `main`, kiểm thử lại trên `main` và đẩy lên GitHub `origin/main` (Commit `f60b54c6`).

- **Trạng thái Kiểm thử & Build:**
  - Toàn bộ 5 bộ test suites: **52/52 tests PASS (100%)** trong 498ms.
  - TypeScript Strict Typecheck: **0 errors** trên cả root và `ontap-web`.
  - Production Build: Build thành công Vite (`ontap-web`) trong 15.44s và Next.js Portal (57 routes static).
  - Bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` **0 bytes diff**.
  - Git Branch: Đang ở trên nhánh `main`, working tree sạch 100%, đồng bộ tuyệt đối với `origin/main`.
