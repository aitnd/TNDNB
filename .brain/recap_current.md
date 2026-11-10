# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-10 (Kế hoạch 261110-1015)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `81827f8e` đã đẩy thành công lên `origin/main`).
- **Mục tiêu hoàn thành trong kế hoạch `261110-1015-portal-ad-role-gating-and-management` (3 Phases — 4 Commits: `79e1d190`, `f67b43ad`, `747b7204`, `81827f8e`):**
  1. **Phase 01 (`79e1d190`):** Đồng bộ Triple-Lock Gating & Động cơ dọn sạch DOM vào [`app/components/PortalAdLoader.tsx`](file:///d:/Antigravity/TNDNB/app/components/PortalAdLoader.tsx):
     - Route Gate: Chặn 100% quảng cáo trên [`/quan-ly`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx), `/quan-ly/*` và `/login`.
     - Role Gate: Miễn trừ 100% quảng cáo trên toàn bộ cổng Portal cho tài khoản cán bộ quản trị/quản lý (`admin`, `quan_ly`, `lanh_dao`).
     - Auth Ready Guard: Trì hoãn nạp script và tiêm stylesheet `ADSENSE_HIDE_ALL_CSS` trong 300ms–800ms đầu khi Firebase Auth đang xác thực (`loading === true`), triệt tiêu hoàn toàn hiện tượng chớp quảng cáo FOUA.
     - Động cơ dọn sạch `purgeAllAdSenseDomAndScripts()`: Tiêu diệt toàn bộ script quảng cáo, iframe `aswift`, iframe `google_ads`, `#google-vignette`, `ins.adsbygoogle`, lớp `.google-auto-placed`, và DOM của Adsterra/Monetag khi chuyển trang SPA sang trang quản trị.
  2. **Phase 02 (`f67b43ad`, `747b7204`):** Dọn sạch Console F12:
     - Khắc phục triệt để lỗi 404 avatar fallback: Tạo 3 tệp ảnh vật lý dự phòng [`public/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/default_avatar.png), [`public/assets/img/default-avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default-avatar.png), [`public/assets/img/default_avatar.png`](file:///d:/Antigravity/TNDNB/public/assets/img/default_avatar.png) (7,612 bytes).
     - Nâng cấp [`app/quan-ly/page.tsx`](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx) với helper `getValidAvatarUrl` an toàn và sự kiện `onError={() => setAvatarError(true)}` trên thẻ `<Image>`.
     - Khắc phục triệt để lỗi React Hydration Mismatch (`#418`, `#423`) trên [`components/Navbar.tsx`](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) bằng `isMounted` guard và placeholder `.authPlaceholder` trong [`components/Navbar.module.css`](file:///d:/Antigravity/TNDNB/components/Navbar.module.css), đảm bảo SSR và CSR render đồng nhất lần đầu.
  3. **Phase 03 (`81827f8e`):** Nghiệm thu tổng lực 4 tầng ([`scripts/portal-ad-gate.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-ad-gate.test.ts)):
     - Toàn bộ **14/14 test suites PASS 100% (105/105 tests green)** trong 640ms.
     - Bảo toàn tuyệt đối 100% Invariant phòng thi [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và `QuizScreen.tsx` (**0 bytes diff**).
     - Typecheck strict: `npx tsc --noEmit` đạt **0 lỗi TypeScript**.
     - Đóng gói Next.js Portal (`npm run build:portal`): Thành công **57/57 routes** không có lỗi SSR bailout.
     - Đóng gói Web Ôn Tập (`npm --prefix ontap-web run build`): Thành công trong **14.97s** ra `public/ontap/`.
     - Git: Đã commit và đẩy an toàn toàn bộ 4 mốc mã nguồn lên GitHub `origin/main` (tới commit `81827f8e`), working tree sạch 100%.
