# Phase 02: Kiểm thử TDD (Vitest) & Build đồng bộ `public/ontap`

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/plan.md)
> **Mục tiêu:** Cập nhật/bổ sung bài kiểm thử tự động trong [scripts/portal-console-and-tinymce-fix.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts), chạy toàn bộ test suite, kiểm tra TypeScript và build `ontap-web` ra `public/ontap/`.

---

## 1. Các bước thực thi chi tiết (Step-by-Step Implementation)

### Bước 2.1: Cập nhật & Bổ sung Unit Test tại [scripts/portal-console-and-tinymce-fix.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)
1. Mở tệp [portal-console-and-tinymce-fix.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) tại khu vực `TC-25` (dòng 251–260) hoặc cuối tệp (sau `TC-31`).
2. Cập nhật `TC-25` hoặc bổ sung `TC-32` để kiểm định chặt chẽ:
   - [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) **KHÔNG** còn chứa nút `Thoát` độc lập ngoài thanh navbar:
     - `expect(content).not.toContain('Standalone Logout Button (Desktop)');`
     - `expect(content).not.toMatch(/<span[^>]*>\s*Thoát\s*<\/span>/);`
   - [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) **VẪN GIỮ** nút `Đăng xuất` bên trong Hamburger Menu (`showHamburgerMenu`):
     - `expect(content).toMatch(/setShowHamburgerMenu\(false\);\s*onLogout\(\)/);`
     - `expect(content).toMatch(/<span[^>]*>\s*Đăng xuất\s*<\/span>/);`

### Bước 2.2: Chạy bộ kiểm thử Vitest & Typecheck
1. Chạy lệnh kiểm thử tự động:
   ```powershell
   npx vitest run scripts/portal-console-and-tinymce-fix.test.ts
   ```
2. Đảm bảo tất cả các test cases (từ `TC-01` đến `TC-32`) đều `PASS` 100%.
3. Kiểm tra `git diff ontap-web/components/ExamQuizScreen.tsx` đảm bảo bằng rỗng (`0 bytes diff`).

### Bước 2.3: Build `ontap-web` xuất tĩnh sang `public/ontap/`
1. Chạy lệnh build trong thư mục `ontap-web` (hoặc script build tương ứng của dự án) để cập nhật bundle tĩnh trong `public/ontap/`:
   ```powershell
   npm --prefix ontap-web run build
   ```
2. Kiểm tra trạng thái bản build thành công, không phát sinh lỗi biên dịch TypeScript hay Vite bundler.
