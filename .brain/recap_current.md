# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-09 (Phiên bản v3.22.0)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `92f1f5f5` đã đẩy thành công lên `origin/main`).
- **Mục tiêu hoàn thành trong kế hoạch `261108-2025-authoritative-changelog-and-recent-plans-sync` (Đầy đủ 5 Phase):**
  1. **Phase 01 (`c3d806c3`):** Khôi phục bộ parser Markdown gốc (`parseChangelog.ts` cho Web & Windows) phân loại Regex Smart Classifier 6 nhóm thẻ màu sắc (`Sparkles`, `Rocket`, `Wrench`, `Shield`, `Code`, `List`).
  2. **Phase 02 (`c03b20ec`):** Tích hợp Segmented Control Tab Switcher (`[👤 Người dùng]` vs `[💻 Kỹ thuật (Dev)]`) nạp `?raw` markdown 0ms vào `ChangelogScreen.tsx` & `ChangelogModal.tsx`, nâng fallback `TopNavbar.tsx` lên `3.22.0`, và **bảo toàn tuyệt đối 100% logic Electron Auto-Updater & Đồng bộ Gói Đề Thi trên Windows (`ontap-win/components/ChangelogModal.tsx`)**.
  3. **Phase 03 (`8ffbd14c`):** Nâng `"version": "3.22.0"` đồng loạt trong 4 `package.json`, soạn thảo mục `[3.22.0]` bao quát đầy đủ 8 kế hoạch tháng 11/2026, và **khôi phục trọn vẹn 46 phiên bản lịch sử** tiếng Việt chuẩn UTF-8 (`3.22.0` ➔ `3.6.0`) cho `CHANGELOG.md`.
  4. **Phase 04 (`56c01d85`):** Đổi tên nhận diện App PWA Home Screen thành **"Giáo dục Ninh Bình"** (`manifest.json` x2, `index.html` WebKit meta tags, `PwaInstallBanner.tsx`), bắt sự kiện `beforeinstallprompt` ở module top-level (`__deferredPwaPrompt`), mở rộng banner cài đặt cho cả khách chưa đăng nhập (`WelcomeModal.tsx`, `LicenseSelectionScreen.tsx`) lẫn học viên (`Dashboard.tsx`) với 3 luồng cài đặt thông minh.
  5. **Phase 05 (`912be89e`, `92f1f5f5`):** Nghiệm thu toàn diện: Chạy 13 test suites tự động (`90/90 tests PASS 100%`), 0 lỗi TypeScript ở cả 3 phân hệ, đóng gói Production Vite `ontap-web` sang `public/ontap/` và Next.js Portal (`57/57 static routes PASS`).

- **Trạng thái Kiểm thử & Build:**
  - Toàn bộ 13 bộ test suites: **90/90 tests PASS (100%)** trong 566ms.
  - TypeScript Strict Typecheck: **0 errors** trên cả Root, `ontap-web` và `ontap-win`.
  - Production Build: Build thành công Vite (`ontap-web`) ra `public/ontap/` trong 15.19s và Next.js Portal (57 routes static).
  - Git: Đã push 6 commits lên GitHub `origin/main`, working tree sạch 100%.
