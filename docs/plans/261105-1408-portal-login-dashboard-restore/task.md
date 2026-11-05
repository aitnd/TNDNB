# Living Task Checklist (TDD Enriched): Loại Bỏ Đa Theme Cũ, Chuẩn Hóa Giao Diện Hallmark Editorial Duy Nhất & Khôi Phục `/login`, `/quan-ly` Trên Root Portal

**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1408-portal-login-dashboard-restore/plan.md)
**Spec chuẩn:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md)

---

## Phase 01: Xóa Bỏ Hệ Thống Đa Theme Cũ & Chuẩn Hóa Global Shell
*Chi tiết kỹ thuật:* [phase-01-navbar-and-login.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1408-portal-login-dashboard-restore/phase-01-navbar-and-login.md)

- [x] **Task 1.1: Xóa bỏ hệ thống Đa Theme cũ & Chuẩn hóa Global Shell + Navbar `"Đăng nhập"`**
  - [x] **Step 1.1 (RED):** Viết unit test kiểm tra xóa 5 file Theme cũ, làm sạch Global Shell và đổi nhãn nút `"Đăng nhập"` trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts).
  - [x] **Step 1.2 (Verify RED):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 1.3 (GREEN):**
    - [x] Xóa 5 file: [context/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/context/ThemeContext.tsx), [components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.tsx), [components/ThemeSwitcher.module.css](file:///d:/Antigravity/TNDNB/components/ThemeSwitcher.module.css), [components/ThemeEffects.tsx](file:///d:/Antigravity/TNDNB/components/ThemeEffects.tsx), [components/MusicPlayer.tsx](file:///d:/Antigravity/TNDNB/components/MusicPlayer.tsx).
    - [x] Chuẩn hóa [app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css) (khóa `:root` Hallmark Editorial Tokens `#FAF9F6`, `#FFFFFF`, `#0B132B`, `#003566`, `#D4AF37`, `#B91C1C`, `#CBD5E1`, `4px`; xóa toàn bộ `[data-theme=...]` và `.snowflakes`/`.decor-img`).
    - [x] Làm sạch [app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx) (gỡ `ThemeProvider`, `ThemeEffects`, `MusicPlayer`).
    - [x] Cập nhật [components/Navbar.tsx](file:///d:/Antigravity/TNDNB/components/Navbar.tsx) (gỡ `ThemeSwitcher`, `useTheme`, ảnh Noel `nav-light.png`; đổi nhãn nút `"Đăng nhập cán bộ"` thành `"Đăng nhập"`) và xóa `:global([data-theme=...])` trong [components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css).
    - [x] Chuẩn hóa [components/Footer.tsx](file:///d:/Antigravity/TNDNB/components/Footer.tsx), [components/Footer.module.css](file:///d:/Antigravity/TNDNB/components/Footer.module.css), [components/Sidebar.module.css](file:///d:/Antigravity/TNDNB/components/Sidebar.module.css), và [app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css).
  - [x] **Step 1.4 (Verify GREEN):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận Phase 01 `PASS`.
  - [x] **Step 1.5 (UI Check):** Đối chiếu [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/design-specs.md](file:///d:/Antigravity/TNDNB/docs/design-specs.md) (Gate 38a `font-style: normal`, Zero Multi-Theme).

---

## Phase 02: Khôi Phục & Thiết Kế Mới Trang `/login` Chuẩn Hallmark Editorial
*Chi tiết kỹ thuật:* [phase-02-quan-ly-dashboard.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1408-portal-login-dashboard-restore/phase-02-quan-ly-dashboard.md)

- [x] **Task 2.1: Khôi phục [app/login/page.tsx](file:///d:/Antigravity/TNDNB/app/login/page.tsx) & thiết kế mới [app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css)**
  - [x] **Step 2.1 (RED):** Bổ sung test kiểm tra sự tồn tại, logic xác thực và token CSS của `/login` trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts).
  - [x] **Step 2.2 (Verify RED):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test Phase 02 `FAIL`.
  - [x] **Step 2.3 (GREEN):**
    - [x] Tạo [app/login/page.tsx](file:///d:/Antigravity/TNDNB/app/login/page.tsx) hỗ trợ: Đăng nhập Email/Username (tự nối `@gmail.com`), Đăng ký tài khoản mới (`role: 'hoc_vien'`), Đăng nhập Google (bắt lỗi `auth/unauthorized-domain`), Quên mật khẩu (`sendPasswordResetEmail`), ghi phiên [`recordLoginSession`](file:///d:/Antigravity/TNDNB/app/services/authSessionService.ts#L33-L51) và redirect `?redirect=...` hoặc `/quan-ly`.
    - [x] Thiết kế mới [app/login/page.module.css](file:///d:/Antigravity/TNDNB/app/login/page.module.css) theo chuẩn `Institutional Auth Card` (`--color-paper`, `--color-surface`, `border-top: 3px solid var(--color-accent)`, `--radius-editorial: 4px`).
  - [x] **Step 2.4 (Verify GREEN):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test Phase 02 `PASS`.
  - [x] **Step 2.5 (UI Check):** Kiểm định vùng chạm `>= 44px`, độ tương phản AAA và Gate 38a trên `/login`.

---

## Phase 03: Khôi Phục & Thiết Kế Mới Trang `/quan-ly` Cùng Các Trang Con Quản Trị
*Chi tiết kỹ thuật:* [phase-02-quan-ly-dashboard.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1408-portal-login-dashboard-restore/phase-02-quan-ly-dashboard.md)

- [x] **Task 3.1: Khôi phục [app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx), thiết kế mới [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) & chuẩn hóa 4 nhóm trang con quản trị**
  - [x] **Step 3.1 (RED):** Bổ sung test kiểm tra [app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx), [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) và 4 nhóm trang con quản trị trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts).
  - [x] **Step 3.2 (Verify RED):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test Phase 03 `FAIL`.
  - [x] **Step 3.3 (GREEN):**
    - [x] Khôi phục [app/quan-ly/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/page.tsx) bọc trong [components/ProtectedRoute.tsx](file:///d:/Antigravity/TNDNB/components/ProtectedRoute.tsx) với đủ 6 tab (`dashboard`, `my_class`, `courses`, `accounts` -> `/quan-ly/tai-khoan`, `posts`, `reviews`).
    - [x] Thiết kế mới [app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css) theo chuẩn `Institutional Operations Workspace`.
    - [x] Chuẩn hóa [app/quan-ly/ho-so/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/ho-so/page.module.css), [app/quan-ly/tai-khoan/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.module.css), [app/quan-ly/dang-bai/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/page.module.css), [app/quan-ly/dang-bai/tao-moi/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.module.css), [app/quan-ly/dang-bai/sua/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.module.css), và [app/quan-ly/[roomId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/%5BroomId%5D/page.module.css).
  - [x] **Step 3.4 (Verify GREEN):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test Phase 03 `PASS`.
  - [x] **Step 3.5 (UI Check):** Kiểm định bảng quản trị có `tabular-nums`, `overflow-x: auto` và không còn pill tròn `99px`.

---

## Phase 04: Chuẩn Hóa Toàn Bộ Trang Nội Dung Portal & Kiểm Thử Nghiệm Thu
*Chi tiết kỹ thuật:* [phase-03-testing-verification.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1408-portal-login-dashboard-restore/phase-03-testing-verification.md)

- [x] **Task 4.1: Đồng bộ 11 file CSS Module của 10 nhóm trang nội dung Portal về Hallmark Editorial Tokens & Nghiệm thu Build**
  - [x] **Step 4.1 (RED):** Bổ sung test kiểm tra 11 file CSS Module của 10 nhóm trang nội dung trong [scripts/portal-login-dashboard.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-login-dashboard.test.ts).
  - [x] **Step 4.2 (Verify RED):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts` — xác nhận test Phase 04 `FAIL`.
  - [x] **Step 4.3 (GREEN):** Chuẩn hóa 11 file CSS Module:
    - [x] [app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css)
    - [x] [app/danh-muc/[categoryId]/page.module.css](file:///d:/Antigravity/TNDNB/app/danh-muc/%5BcategoryId%5D/page.module.css)
    - [x] [app/gioi-thieu/page.module.css](file:///d:/Antigravity/TNDNB/app/gioi-thieu/page.module.css)
    - [x] [app/hoc-phi/page.module.css](file:///d:/Antigravity/TNDNB/app/hoc-phi/page.module.css)
    - [x] [app/lien-he/page.module.css](file:///d:/Antigravity/TNDNB/app/lien-he/page.module.css)
    - [x] [app/tai-lieu/page.module.css](file:///d:/Antigravity/TNDNB/app/tai-lieu/page.module.css)
    - [x] [app/thu-vien/page.module.css](file:///d:/Antigravity/TNDNB/app/thu-vien/page.module.css)
    - [x] [app/chuong-trinh-dao-tao/page.module.css](file:///d:/Antigravity/TNDNB/app/chuong-trinh-dao-tao/page.module.css)
    - [x] [app/chuong-trinh-dao-tao/chuong-trinh.module.css](file:///d:/Antigravity/TNDNB/app/chuong-trinh-dao-tao/chuong-trinh.module.css)
    - [x] [app/tu-van-nghe-nghiep/tu-van.module.css](file:///d:/Antigravity/TNDNB/app/tu-van-nghe-nghiep/tu-van.module.css)
    - [x] [app/tim-kiem/page.module.css](file:///d:/Antigravity/TNDNB/app/tim-kiem/page.module.css)
  - [x] **Step 4.4 (Verify GREEN):** Chạy `npx vitest run scripts/portal-login-dashboard.test.ts scripts/portal-navbar-cleanup.test.ts scripts/portal-homepage-editorial.test.ts` — xác nhận toàn bộ test `PASS`.
  - [x] **Step 4.5 (UI Check & Final Build):** Chạy `npx tsc --noEmit` và `npm run build:portal` xác nhận toàn bộ các trang của Root Portal build thành công (`exit code 0`).
