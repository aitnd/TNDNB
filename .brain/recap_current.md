# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-09 (Phiên bản v3.22.0 + RBAC & Concise Changelog)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `4ee3d5a7` đã đẩy thành công lên `origin/main`).
- **Mục tiêu hoàn thành trong 2 kế hoạch ngày 08-09/11/2026:**
  1. **Kế hoạch `261108-2025-authoritative-changelog-and-recent-plans-sync` (5 Phase):**
     - Khôi phục bộ parser Markdown gốc (`parseChangelog.ts` cho Web & Windows) phân loại Regex Smart Classifier 6 nhóm thẻ màu sắc.
     - Nâng `"version": "3.22.0"` đồng loạt trong 4 `package.json`, khôi phục trọn vẹn 46 phiên bản lịch sử tiếng Việt chuẩn UTF-8 (`3.22.0` ➔ `3.6.0`).
     - Đổi tên nhận diện App PWA Home Screen thành **"Giáo dục Ninh Bình"**, bắt sự kiện `beforeinstallprompt` ở module top-level (`__deferredPwaPrompt`), mở rộng banner cài đặt cho cả khách chưa đăng nhập (`WelcomeModal.tsx`, `LicenseSelectionScreen.tsx`) lẫn học viên (`Dashboard.tsx`).
  2. **Kế hoạch `261109-0650-changelog-rbac-and-concise-copy` (3 Phase — `da9ff6d7`, `b961ae6c`, `4ee3d5a7`):**
     - **Phase 01 (`da9ff6d7`):** Biên tập lại mục `[3.22.0]` và `[3.21.0]` trong `CHANGELOG.md` (và 3 bản sao + `update_changelogs.js`) theo đúng chuẩn ngắn gọn, súc tích như bản `3.19.0`, loại bỏ 100% các thuật ngữ/tên component của riêng DEV (`WelcomeModal`, `LicenseSelectionScreen`, `Cloudflare`, `Firestore`, `Dexie`, `TinyMCE`...); tích hợp `renderInlineMarkdown` chuyển `**in đậm**` thành thẻ `<strong>` sạch đẹp.
     - **Phase 02 (`b961ae6c`):** Phân quyền RBAC cho Tab `💻 Kỹ thuật (Dev)` thông qua `useAppStore(state => state.userProfile)`: chỉ hiển thị thanh chuyển đổi Tab cho 3 vai trò `['admin', 'quan_ly', 'lanh_dao']`; ẩn hoàn toàn với Khách vãng lai (`null`), Học viên (`hoc_vien`) và Giáo viên (`giao_vien`), bảo toàn tuyệt đối 100% logic Electron Auto-Updater & Đồng bộ Gói Đề Thi trên Windows (`ontap-win/components/ChangelogModal.tsx` dòng 16–287).
     - **Phase 03 (`4ee3d5a7`):** Bổ sung 5 bài kiểm thử TDD (`TC-RBAC01`..`TC-RBAC05`), vượt qua **13/13 test suites (`95/95 tests PASS 100%`)**, 0 lỗi TypeScript, và đóng gói lại `public/ontap/`.

- **Trạng thái Kiểm thử & Build:**
  - Toàn bộ 13 bộ test suites: **95/95 tests PASS (100%)** trong 607ms.
  - TypeScript Strict Typecheck: **0 errors** trên cả Root, `ontap-web` và `ontap-win`.
  - Production Build: Build thành công Vite (`ontap-web`) ra `public/ontap/` (15.04s) và Next.js Portal (`57/57` static routes).
  - Git: Đã push toàn bộ commits lên GitHub `origin/main`, working tree sạch 100%.
