# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — 2026-11-05

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh `feat/cloudflare-offline-v3.21` (Commit mới nhất: `0c9145aa`).
- **Mục tiêu vừa hoàn thành (100% PASS — 98.8/100 điểm):**
  1. **Xóa sổ 100% hệ thống Đa Theme cũ & Hiệu ứng Noel:** Đã xóa vĩnh viễn 5 file (`context/ThemeContext.tsx`, `components/ThemeSwitcher.tsx`, `components/ThemeSwitcher.module.css`, `components/ThemeEffects.tsx`, `components/MusicPlayer.tsx`) và gỡ sạch toàn bộ selector `[data-theme=...]`, `.snowflakes`, `.decor-img`.
  2. **Khóa chặt 1 Giao diện Duy nhất (Single Canonical Hallmark Editorial Theme):** Chuẩn hóa `:root` trong `app/globals.css` (`--color-paper: #FAF9F6`, `--color-surface: #FFFFFF`, `--color-ink: #0B132B`, `--color-accent: #003566`, `--color-gold: #D4AF37`, `--color-signal: #B91C1C`, `--color-rule: #CBD5E1`, `--radius-editorial: 4px`, Gate 38a Zero Italic Headings `font-style: normal`).
  3. **Khôi phục & Thiết kế mới `/login` & `/quan-ly`:**
     - Đổi nhãn nút trên `components/Navbar.tsx` từ `"Đăng nhập cán bộ"` thành `"Đăng nhập"`.
     - Khôi phục `app/login/page.tsx` + `app/login/page.module.css` (`Institutional Auth Card`, hỗ trợ Email/Username `@gmail.com`, Đăng ký, Google Popup bắt lỗi `auth/unauthorized-domain`, Quên MK, `recordLoginSession`, redirect an toàn).
     - Khôi phục `app/quan-ly/page.tsx` + `app/quan-ly/page.module.css` (`ProtectedRoute`, 6 tabs phân quyền RBAC 2 lớp) và chuẩn hóa toàn bộ các trang con quản trị (`ho-so`, `tai-khoan`, `dang-bai`, `[roomId]`) cùng 11 file CSS Module của 10 nhóm trang nội dung.
- **Trạng thái Kiểm thử & Build:**
  - Vitest: **18/18 tests PASS (100%)**.
  - TypeScript (`npx tsc --noEmit`) & ESLint (`npm run lint`): **0 errors, 0 warnings**.
  - Next.js Production Build (`npm run build:portal`): **57/57 static pages thành công (`exit code 0`)**.
- **Bước tiếp theo khi quay lại:** Merge nhánh `feat/cloudflare-offline-v3.21` vào `main` / kiểm tra Vercel Production hoặc phát triển tính năng mới.
