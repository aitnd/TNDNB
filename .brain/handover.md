# 📋 TÀI LIỆU BÀN GIAO DỰ ÁN (HANDOVER DOCUMENT)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Dự án TNDNB (`d:\Antigravity\TNDNB`)
🔢 Tiến độ: Hoàn tất 100% Kế hoạch `261112-2215-exam-dark-mode-color-contrast` (5/5 Phases)
🏷️ Nhánh Git: `main` (Mới nhất: `cd2657bd` - đã merge từ `fix/exam-dark-mode-color-contrast`)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ ĐÃ XONG:
1. **Nâng cấp toàn diện tương phản Dark Mode (>11:1) WCAG 2.1 AA:**
   - Hoàn tất trên cả Web và Windows App: `ontap-web/components/ExamQuizScreen.tsx`, `ontap-win/components/ExamQuizScreen.tsx`.
   - Bổ sung màu `slate-850: '#172033'` vào `ontap-win/tailwind.config.js`.
   - Đáp án, nhãn phương án, phiếu trả lời, câu liệt, câu đã trả lời đồng bộ màu sắc độ tương phản cao, dễ đọc khi ôn tập ban đêm.
2. **Cơ chế Theme Sáng Mặc Định Cho Mọi Phiên Mới:**
   - Lưu trữ qua `sessionStorage` (`ontap_theme_session`), loại bỏ `prefers-color-scheme: dark`.
   - Dọn sạch các khóa theme cũ trong `localStorage` và bảo vệ chống lỗi môi trường ẩn danh bằng `try/catch`.
3. **Gọn hóa giao diện người dùng:**
   - Gỡ bỏ hoàn toàn nút đổi giao diện nổi cố định góc dưới bên phải (`fixed bottom-4 right-4`).
   - Tích hợp ThemeSwitcher vào Hamburger Menu 3 gạch `[≡]` trên Desktop (`TopNavbar.tsx`) và Mobile Drawer (`MobileBottomNav.tsx`).
4. **Phòng thủ Electron Runtime Guard:**
   - Thay `require()` bằng ESM static import trong `ontap-web/App.tsx`.
   - Helper `isElectronRuntime()` trong `deployConfig.ts` chỉ phát hiện qua `window.electron` hoặc `file:`.
   - Bộ unit test `scripts/ontap-electron-runtime-guard.test.ts` (5/5 tests PASS).
5. **Nâng cấp khả năng tiếp cận (Accessibility):**
   - Checkbox trắc nghiệm: `ariaLabel` + `focus-visible:ring-2`.
   - `ZoomBar`: kích thước chạm tối thiểu `44x44px`, font `tabular-nums`.
   - `PwaInstallBanner`: màu nền gradient tương phản > 5.5:1.
6. **Kiểm thử & Đóng gói:**
   - 15/15 test suites Vitest PASS (113/113 tests).
   - 0 lỗi TypeScript strict (`npx tsc --noEmit`).
   - Đóng gói thành công 57 routes Next.js và Vite ontap-web.
   - Nhánh `fix/exam-dark-mode-color-contrast` đã được merge sạch vào `main` (commit `cd2657bd`).

## ⏳ CÒN LẠI:
- Không còn task tồn đọng trong kế hoạch này.
- User đã tự push lên Vercel để triển khai thực tế.

## 🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- **Theme Session Scope:** Khóa `'ontap_theme_session'` trong `sessionStorage` thay vì `localStorage` để mọi phiên truy cập mới đều bắt đầu bằng theme Sáng theo quy tắc nghiệp vụ.
- **Menu Integration:** Giấu nút đổi theme vào menu 3 gạch thay vì để nút nổi trôi nổi trên màn hình gây che khuất bảng điều khiển và nội dung bài thi.
- **Electron Guard:** Không tin cậy `navigator.userAgent` để phát hiện runtime Electron vì các trình duyệt Chromium tùy biến có thể để lộ chuỗi này.

## ⚠️ LƯU Ý CHO SESSION SAU:
- Khi kiểm thử phòng thi trắc nghiệm, luôn bảo toàn tính bất biến của file `ExamQuizScreen.tsx` và chạy kiểm thử `scripts/ontap-dual-theme-and-sidebar.test.ts` cùng `deployConfig.test.ts`.

## 📁 FILES QUAN TRỌNG:
- `ontap-web/components/ExamQuizScreen.tsx`
- `ontap-win/components/ExamQuizScreen.tsx`
- `ontap-web/contexts/ThemeContext.tsx`
- `ontap-web/components/ThemeSwitcher.tsx`
- `ontap-web/components/TopNavbar.tsx`
- `ontap-web/components/MobileBottomNav.tsx`
- `ontap-web/utils/deployConfig.ts`
- `docs/plans/261112-2215-exam-dark-mode-color-contrast/plan.md`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
