# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-13 (Kế hoạch 261112-2215)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `cd2657bd`).
- **Mục tiêu hoàn thành trong kế hoạch `261112-2215-exam-dark-mode-color-contrast` (5 Phases — Commit: `cd2657bd`):**
  1. **Phase 01 & 02: Nâng Cấp Tương Phản Dark Mode Phòng Thi Web & Windows:**
     - Chuẩn hóa màu sắc Dark Mode đạt WCAG 2.1 AA (> 11:1) cho toàn bộ màn hình phòng thi trên [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`ontap-win/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ExamQuizScreen.tsx).
     - Thẻ câu hỏi: `dark:bg-slate-850`, văn bản nội dung: `dark:text-slate-100`, viền thẻ: `dark:border-slate-700/80`.
     - Nhãn phương án A/B/C/D và nội dung đáp án: `dark:text-slate-200`, `dark:hover:bg-slate-800/80`.
     - Trạng thái phương án: Chọn (`dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-200`), Đúng (`dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-200`), Sai (`dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-200`).
     - Bổ sung màu `slate-850: '#172033'` vào [`ontap-win/tailwind.config.js`](file:///d:/Antigravity/TNDNB/ontap-win/tailwind.config.js).
  2. **Phase 03: Chuẩn Hóa Phiếu Trả Lời (Answer Sheet Grid) & Trạng Thái Câu Liệt:**
     - Đánh số câu: `dark:bg-slate-800 dark:text-slate-200`.
     - Câu đã trả lời: `dark:bg-blue-900/60 dark:text-blue-100 dark:border-blue-700`.
     - Câu điểm liệt cảnh báo: `dark:bg-amber-950/40 dark:border-amber-500/80 dark:text-amber-200`.
  3. **Phase 04: Phòng Ngừa Electron Runtime Guard & Kiểm Thử Hồi Quy:**
     - Khắc phục lỗi `Uncaught ReferenceError: require is not defined` trên `/ontap/thithu` khi duyệt bằng nhân Electron/Webview.
     - ESM static import trong [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).
     - Xây dựng helper `isElectronRuntime()` trong [`ontap-web/utils/deployConfig.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/deployConfig.ts), bỏ check `userAgent` gây nhận diện sai ở [`ontap-win/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/App.tsx) và [`ontap-win/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx).
     - Bộ test [`scripts/ontap-electron-runtime-guard.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-electron-runtime-guard.test.ts) (5/5 tests PASS).
  4. **Phase 05: Giao Diện Sáng Mặc Định Theo Phiên & Tích Hợp ThemeSwitcher Vào Menu 3 Gạch:**
     - Mọi phiên mới mặc định theme Sáng (Light Theme): Lưu `sessionStorage` (`ontap_theme_session`), bỏ tự động fallback theo hệ điều hành (`prefers-color-scheme: dark`), tự dọn `localStorage` cũ tại [`ontap-web/contexts/ThemeContext.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx).
     - Gỡ bỏ hoàn toàn nút đổi theme nổi cố định (`fixed bottom-4 right-4 z-40`) trên `ontap-web/App.tsx`.
     - Tái cấu trúc [`ontap-web/components/ThemeSwitcher.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) hỗ trợ `variant="menu-item"`, tích hợp vào Hamburger Menu 3 gạch `[≡]` Desktop ([`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)) và Mobile Drawer ([`ontap-web/components/MobileBottomNav.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx)).
  5. **Nghiệm thu QA Loop & Khả Năng Tiếp Cận:**
     - Checkbox trắc nghiệm `SquareCheckbox` bổ sung `ariaLabel` và `focus-visible:ring-2`.
     - Thanh phóng to cỡ chữ [`ZoomBar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ZoomBar.tsx) có vùng chạm `44x44px` và `tabular-nums`.
     - Banner cài đặt PWA [`PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx) gradient tương phản > 5.5:1.
     - Vitest: **15/15 test suites PASS 100% (113/113 tests green)**.
     - TypeScript: `npx tsc --noEmit` **0 lỗi** trên toàn bộ monorepo.
     - Đóng gói: Thành công 57/57 routes Next.js Portal (`npm run build:portal`) và Vite `ontap-web`.
     - Đã merge an toàn vào `main` (commit `cd2657bd`).
