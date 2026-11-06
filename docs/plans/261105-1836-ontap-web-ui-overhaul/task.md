# Living Task Checklist (TDD Enriched): Xử Lý Lỗi Font Tiếng Việt "Chữ To Chữ Bé" Toàn Portal, Gắn Liên Kết `/ontap` Vào Sidebar, Tối Ưu Tốc Độ Bài Viết, Đại Tu Giao Diện `ontap-web` Chuẩn Dual-Theme & Triển Khai Hạ Tầng Cloudflare Edge (`D1` + `R2` + `KV`)

**Kế hoạch tổng thể:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)  
**Cổng thông tin chính thức:** https://www.daotaothuyenvien.com  
**App Ôn tập & Thi thử Trực tuyến:** https://www.daotaothuyenvien.com/ontap  
*(Định danh hệ thống: Dự án chạy trên domain `www.daotaothuyenvien.com`, không dùng domain tndnb.vn)*  
**Spec chuẩn:** [docs/DESIGN.md](file:///d:/Antigravity/TNDNB/docs/DESIGN.md) & [docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/design-specs.md)

---

## Phase 01: Fix Font Tiếng Việt Toàn Portal, Gắn Link Sidebar `/ontap`, Dual-Theme Core (`light` / `dark`) & Tối Ưu Tốc Độ Bài Viết
*Chi tiết kỹ thuật:* [phase-01-portal-sidebar-and-dual-theme-core.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-01-portal-sidebar-and-dual-theme-core.md)

- [x] **Task 1.0: Xử lý triệt để lỗi "Chữ to chữ bé" (Vietnamese Font Fallback) trên toàn bộ 13 file của Root Portal**
  - [x] **Step 1.0.1 (RED):** Viết unit test kiểm tra `app/layout.tsx`, `app/globals.css` và 11 file CSS Module trên Portal trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 1.0.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 1.0.3 (GREEN):**
    - [x] **[app/layout.tsx](file:///d:/Antigravity/TNDNB/app/layout.tsx):** Xóa bỏ `Rubik`; nạp bộ 3 font `Be_Vietnam_Pro` (`--font-sans`), `Merriweather` (`--font-display`), `JetBrains_Mono` (`--font-mono`) qua `next/font/google` với đầy đủ `subsets: ['latin', 'vietnamese']`.
    - [x] **[app/globals.css](file:///d:/Antigravity/TNDNB/app/globals.css):** Xóa câu lệnh `@import url(...)` bị đặt sai vị trí sau `@tailwind`; đảm bảo `body` kế thừa `var(--font-sans)`.
    - [x] **[components/Navbar.module.css](file:///d:/Antigravity/TNDNB/components/Navbar.module.css):** Chuyển `.metaBadge`, `.categoryLabel` (`CHUYÊN MỤC:`), `.navRow1 a`, `.categoryGroup a` sang `var(--font-sans, 'Be Vietnam Pro', sans-serif)`.
    - [x] **[app/page.module.css](file:///d:/Antigravity/TNDNB/app/page.module.css):** Chuyển `.kickerTag`, `.metaDate`, `.briefingCode`, `.briefingDate`, `.postDate` sang `var(--font-sans)` + `font-variant-numeric: tabular-nums` (giữ `var(--font-mono)` cho con số `.sectionIndex` và `.briefingIndex`).
    - [x] **[app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css):** Chuyển `.meta`/`.postMeta` sang `var(--font-sans)` + `tabular-nums`.
    - [x] **[app/danh-muc/[categoryId]/page.module.css](file:///d:/Antigravity/TNDNB/app/danh-muc/%5BcategoryId%5D/page.module.css):** Chuyển `.postDate` sang `var(--font-sans)` + `tabular-nums`.
    - [x] **[app/hoc-phi/page.module.css](file:///d:/Antigravity/TNDNB/app/hoc-phi/page.module.css):** Chuyển `.table th` sang `var(--font-sans)` (giữ `var(--font-mono)` + `tabular-nums` cho cột giá tiền).
    - [x] **[app/quan-ly/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/page.module.css):** Chuyển `.roleTag` sang `var(--font-sans)`.
    - [x] **[app/quan-ly/dang-bai/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/page.module.css):** Chuyển `.userTable th` và `.dateCell` sang `var(--font-sans)` + `tabular-nums`.
    - [x] **[app/quan-ly/tai-khoan/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/tai-khoan/page.module.css):** Chuyển `.userTable th` và `.rolePill` sang `var(--font-sans)`.
    - [x] **[app/quan-ly/[roomId]/page.module.css](file:///d:/Antigravity/TNDNB/app/quan-ly/%5BroomId%5D/page.module.css):** Chuyển `.statusBadge`, `.table th`, `.statusTag` sang `var(--font-sans)` + `tabular-nums`.
    - [x] **[app/tra-cuu-dia-chi/page.module.css](file:///d:/Antigravity/TNDNB/app/tra-cuu-dia-chi/page.module.css):** Đổi `'Segoe UI', Tahoma...` (dòng 7) sang `var(--font-sans, 'Be Vietnam Pro', sans-serif)`.
    - [x] **[components/StudentCard.module.css](file:///d:/Antigravity/TNDNB/components/StudentCard.module.css):** Đổi `'Arial', sans-serif` (dòng 14) sang `var(--font-sans, 'Be Vietnam Pro', sans-serif)`.
  - [x] **Step 1.0.4 (Verify GREEN):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận Task 1.0 `PASS`.

- [x] **Task 1.1: Gắn link App Ôn Tập (`/ontap`) vào khung "Tra cứu & Tiện ích" trên [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx)**
  - [x] **Step 1.1.1 (RED):** Bổ sung test kiểm tra `href="/ontap"` trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx) tại [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 1.1.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 1.1.3 (GREEN):** Thêm mục `<Link href="/ontap">` dẫn tới **Ôn tập & Thi thử Trực tuyến** ở đầu danh sách `<ul className={styles.linkList}>` trong [components/Sidebar.tsx](file:///d:/Antigravity/TNDNB/components/Sidebar.tsx#L137-L151).
  - [x] **Step 1.1.4 (Verify GREEN):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-navbar-cleanup.test.ts` — xác nhận cả 2 file test đều `PASS`.

- [x] **Task 1.2, 1.3 & 1.4: Thiết lập Dual-Theme Core (`light` / `dark`) cho `ontap-web`, xóa `SnowEffect.tsx` & sửa vòng lặp `--font-sans`**
  - [x] **Step 1.2.1 (RED):** Bổ sung test kiểm tra `ontap-web/types.ts`, `ThemeContext.tsx`, `theme.css`, `index.html`, `icons.tsx`, `Footer.tsx`, và xóa `SnowEffect.tsx` trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 1.2.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 1.2.3 (GREEN):**
    - [x] Cập nhật `export type Theme = 'light' | 'dark';` trong [ontap-web/types.ts](file:///d:/Antigravity/TNDNB/ontap-web/types.ts#L3).
    - [x] Cập nhật [ontap-web/contexts/ThemeContext.tsx](file:///d:/Antigravity/TNDNB/ontap-web/contexts/ThemeContext.tsx) tự động fallback mọi giá trị theme cũ lưu trong `localStorage` về `'light'` và bổ sung `toggleTheme()`.
    - [x] Xóa file `ontap-web/components/SnowEffect.tsx` và gỡ `<SnowEffect />` khỏi [ontap-web/App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx).
    - [x] Dọn sạch các nhánh `if (theme === 'tri-an')` và `if (theme === 'noel')` trong [ontap-web/components/icons.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/icons.tsx) và [ontap-web/components/Footer.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Footer.tsx).
    - [x] Tinh giản link Google Fonts trong [ontap-web/index.html](file:///d:/Antigravity/TNDNB/ontap-web/index.html#L14) chỉ nạp `Be Vietnam Pro`.
    - [x] Sửa lỗi vòng lặp `--font-sans: var(--font-sans), sans-serif;` trong [ontap-web/theme.css](file:///d:/Antigravity/TNDNB/ontap-web/theme.css#L11) và chuẩn hóa 2 hệ màu `light` / `dark`.
    - [x] Thiết kế lại [ontap-web/components/ThemeSwitcher.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThemeSwitcher.tsx) thành nút chuyển đổi nhanh Sáng / Tối (`Sun` / `Moon` toggle).
  - [x] **Step 1.2.4 (Verify GREEN & UI Check):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận Tasks 1.0–1.4 `PASS`.

- [x] **Task 1.5: Khắc phục triệt để lỗi click bài viết chờ 10s trên Root Portal (`< 50ms` ISR + Skeleton) & Bổ sung Fallback Supabase cho API trộn đề (`/api/thi/[licenseId]`)**
  - [x] **Step 1.5.1 (RED):** Tạo mới bộ test [scripts/portal-post-performance.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-post-performance.test.ts) kiểm tra `revalidate = 60`, `authorCache`, `Promise.race` (`1500ms`), `Promise.all` trong [app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx), sự tồn tại của [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx), và fallback Supabase trong [app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts).
  - [x] **Step 1.5.2 (Verify RED):** Chạy `npx vitest run scripts/portal-post-performance.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 1.5.3 (GREEN):**
    - [x] **[app/bai-viet/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.tsx):** Đổi `export const revalidate = 0;` thành `export const revalidate = 60;`; bổ sung `authorCache = new Map<string, { name: string; expiresAt: number }>()` + timeout `1500ms` (`Promise.race`) khi gọi `adminDb?.collection('users').doc(authorId).get()`; gom song song tác giả và `getRelatedPosts(post.category_id, post.id)` bằng `Promise.all`.
    - [x] **[app/bai-viet/[postId]/page.module.css](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/page.module.css) & [app/bai-viet/[postId]/loading.tsx](file:///d:/Antigravity/TNDNB/app/bai-viet/%5BpostId%5D/loading.tsx):** Tạo mới Editorial Skeleton UI đồng bộ với `.container` để chuyển cảnh tức thì (`0ms` cảm giác đơ).
    - [x] **[app/api/thi/[licenseId]/route.ts](file:///d:/Antigravity/TNDNB/app/api/thi/%5BlicenseId%5D/route.ts):** Nếu `NEXT_PUBLIC_CLOUDFLARE_API_URL` chưa cấu hình hoặc `fetch` tới Cloudflare Worker gặp sự cố mạng, tự động fallback truy vấn trực tiếp từ `supabase.from('licenses')` và giữ nguyên bộ lọc đáp án đúng (`Zero Answer Leaks` — Mục 2.1).
  - [x] **Step 1.5.4 (Verify GREEN):** Chạy `npx vitest run scripts/portal-post-performance.test.ts scripts/ontap-dual-theme-and-sidebar.test.ts scripts/portal-navbar-cleanup.test.ts` — xác nhận 100% `PASS`.

---

## Phase 02: App Shell, Navigation & Entry / Bento Dashboard Screens
*Chi tiết kỹ thuật:* [phase-02-ontap-shell-and-entry-screens.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-02-ontap-shell-and-entry-screens.md)

- [x] **Task 2.1, 2.2, 2.3 & 2.4: Nâng cấp App Shell, Split-Window `WelcomeModal`, Bento 12-Col `Dashboard` & các màn hình Xác thực**
  - [x] **Step 2.1 (RED):** Bổ sung test kiểm tra xóa sạch `blur-[120px]`, `blur-[100px]`, `glass-premium`, `blur-xl` và xác nhận cấu trúc Split Window (`md:col-span-7` & `md:col-span-5`) trong [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) cùng Bento 12-Col (`lg:col-span-4` & `lg:col-span-8`) trong [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) tại [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 2.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test Phase 02 `FAIL`.
  - [x] **Step 2.3 (GREEN):**
    - [x] Chuẩn hóa App Shell: [ontap-web/components/TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx), [ontap-web/components/MobileHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileHeader.tsx), [ontap-web/components/MobileBottomNav.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MobileBottomNav.tsx), và [ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx).
    - [x] Thiết kế lại [ontap-web/components/WelcomeModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) theo bố cục Split Window Card (`md:col-span-7` & `md:col-span-5`) kèm thống kê `tabular-nums`.
    - [x] Chuẩn hóa [ontap-web/components/Dashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) theo bố cục Bento Asymmetric 12-Col (`lg:col-span-4` & `lg:col-span-8`, xóa sạch `blur-[120px]`, `blur-[100px]`, `glass-premium`); đồng bộ [ontap-web/components/WelcomeHeader.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeHeader.tsx), [ontap-web/components/QuickActionsGrid.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuickActionsGrid.tsx), [ontap-web/components/StudentCard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/StudentCard.tsx), [ontap-web/components/WeatherWidget.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx), [ontap-web/components/AdminStatsBar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AdminStatsBar.tsx), [ontap-web/components/ProgressDashboard.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ProgressDashboard.tsx).
    - [x] Đồng bộ các màn hình Xác thực: [ontap-web/components/LoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx), [ontap-web/components/RegisterScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/RegisterScreen.tsx), và [ontap-web/components/WindowsLoginScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/WindowsLoginScreen.tsx).
  - [x] **Step 2.4 (Verify GREEN & UI Craft Check):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` + chạy bộ kiểm định `taste-skill` (`consistency.mjs`, `perf.mjs`) + rà soát `impeccable` (`craft`, `polish`, `typeset`, `colorize`) — xác nhận Phase 02 `PASS`.

---

## Phase 03: Learning Flow, Practice Quiz & Results Screens (GIỮ NGUYÊN 100% `ExamQuizScreen.tsx`)
*Chi tiết kỹ thuật:* [phase-03-learning-flow-and-results-screens.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-03-learning-flow-and-results-screens.md)

- [x] **Task 3.1, 3.2, 3.3 & 3.4: Nâng cấp Luồng Học Tập, `QuizScreen.tsx` & Màn hình Kết quả (Bảo toàn tuyệt đối [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx))**
  - [x] **Step 3.1 (RED):** Bổ sung test kiểm tra `LicenseSelectionScreen.tsx` (`tabular-nums`, bỏ `rounded-[2.5rem]`), `QuizScreen.tsx` (`tabular-nums`, xóa `bg-gray-50` / `border-gray-200`), `ResultsScreen.tsx` (`tabular-nums`) và `git diff ontap-web/components/ExamQuizScreen.tsx === ''` trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 3.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test Phase 03 `FAIL`.
  - [x] **Step 3.3 (GREEN):**
    - [x] Thiết kế lại [ontap-web/components/LicenseSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LicenseSelectionScreen.tsx) theo mẫu Bento License Card kèm badge `tabular-nums`.
    - [x] Chuẩn hóa [ontap-web/components/NameInputScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NameInputScreen.tsx), [ontap-web/components/ModeSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ModeSelectionScreen.tsx), [ontap-web/components/SubjectSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/SubjectSelectionScreen.tsx), và [ontap-web/components/GiamKhaoSelectionScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/GiamKhaoSelectionScreen.tsx).
    - [x] Đại tu [ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) (`/ontap/lambai`) với bố cục 2 cột chuẩn Dual-Theme, sửa lỗi tương phản đáp án đang chọn và chuẩn hóa bảng lưới câu hỏi 4 trạng thái `tabular-nums`.
    - [x] Chuẩn hóa [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx), [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx), và phần Sảnh chờ của [ontap-web/components/ThiTrucTuyenPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ThiTrucTuyenPage.tsx) (**tuyệt đối không chạm vào `ExamQuizScreen.tsx`**).
  - [x] **Step 3.4 (Verify GREEN & UI Craft Check):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` + `taste-skill` (`consistency.mjs`, `perf.mjs`) + `impeccable` — xác nhận Phase 03 `PASS` và `git diff ontap-web/components/ExamQuizScreen.tsx` trống hoàn toàn.

---

## Phase 04: Management, Utility Screens, Self-Hosted TinyMCE & Chuẩn Hóa Kiến Trúc Hybrid (`2.1 D1+Supabase`, `2.2 R2+Image Fallback`, `2.3 KV Zero-Fallback`, `2.4 Firebase`)
*Chi tiết kỹ thuật:* [phase-04-management-utility-screens-and-verification.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-04-management-utility-screens-and-verification.md)

- [x] **Tasks 4.1, 4.2 & 4.3: Đồng bộ 15 Màn hình Quản lý, Học viên & Tiện ích chuẩn Dual-Theme**
  - [x] **Step 4.1.1 (RED):** Bổ sung test quét toàn bộ thư mục `ontap-web/components` sạch 100% 6 theme cũ và kiểm tra `tabular-nums` trên các bảng quản lý trong [scripts/ontap-dual-theme-and-sidebar.test.ts](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts).
  - [x] **Step 4.1.2 (Verify RED):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 4.1.3 (GREEN):**
    - [x] Đồng bộ các màn hình Học viên: [ontap-web/components/HistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/HistoryScreen.tsx), [ontap-web/components/MyClassScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MyClassScreen.tsx), [ontap-web/components/AccountScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AccountScreen.tsx), [ontap-web/components/LoginHistoryScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginHistoryScreen.tsx).
    - [x] Đồng bộ các màn hình Quản trị: [ontap-web/components/ClassManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ClassManagementScreen.tsx), [ontap-web/components/UserManagerScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UserManagerScreen.tsx), [ontap-web/components/OnlineExamManagementScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/OnlineExamManagementScreen.tsx), [ontap-web/components/NotificationMgmtScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/NotificationMgmtScreen.tsx), [ontap-web/components/UsageConfigPanel.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/UsageConfigPanel.tsx), [ontap-web/components/AnalyticsPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AnalyticsPage.tsx).
    - [x] Đồng bộ các màn hình Tiện ích: [ontap-web/components/MailboxScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/MailboxScreen.tsx), [ontap-web/components/DownloadAppPage.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/DownloadAppPage.tsx), [ontap-web/components/ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx), [ontap-web/components/ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx), [ontap-web/components/EntertainmentScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/EntertainmentScreen.tsx).
  - [x] **Step 4.1.4 (Verify GREEN):** Chạy `npx vitest run scripts/ontap-dual-theme-and-sidebar.test.ts` — xác nhận `PASS`.

- [x] **Task 4.4: Bổ sung Fallback Supabase cho `dataService.ts` (Mục 2.1) & Khắc phục lỗi quyền `BadgeListener` (Mục 2.4)**
  - [x] **Step 4.4.1 (RED & GREEN — `dataService.ts`):** Bổ sung `fetchLicensesFromSupabaseFallback()` trong [ontap-web/services/dataService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/dataService.ts) và unit test trong [ontap-web/services/__tests__/dataService.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/dataService.test.ts) tự động kích hoạt khi lần đầu mở app mà `fetchQuestionsSnapshot()` từ D1 gặp sự cố mạng, lưu xuống IndexedDB qua `saveLicensesOffline`.
  - [x] **Step 4.4.2 (GREEN — `BadgeListener`):** Kiểm tra phiên `auth?.currentUser` hợp lệ và tự động dừng polling 30 giây khi gặp `permission-denied` tại [ontap-web/services/badgeService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/badgeService.ts) & [ontap-web/components/Badges/BadgeListener.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Badges/BadgeListener.tsx).

- [x] **Task 4.5: Chuyển TinyMCE sang Self-hosted Local (`public/tinymce/`) trên Root Portal (Xóa bỏ vĩnh viễn popup đòi API Key)**
  - [x] **Step 4.5.1 (Setup & Assets):** Cài đặt gói `tinymce` vào `devDependencies` và sao chép đầy đủ các asset tĩnh (`tinymce.min.js`, `themes/`, `plugins/`, `skins/`, `icons/`, `models/`) vào thư mục [public/tinymce/](file:///d:/Antigravity/TNDNB/public/tinymce/).
  - [x] **Step 4.5.2 (RED):** Viết unit test [scripts/portal-tinymce-local.test.ts](file:///d:/Antigravity/TNDNB/scripts/portal-tinymce-local.test.ts) kiểm tra sự tồn tại của [public/tinymce/tinymce.min.js](file:///d:/Antigravity/TNDNB/public/tinymce/tinymce.min.js) và cấu hình `tinymceScriptSrc="/tinymce/tinymce.min.js"` trên cả 2 trang tạo/sửa bài viết.
  - [x] **Step 4.5.3 (GREEN):** Cập nhật [app/quan-ly/dang-bai/tao-moi/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx) và [app/quan-ly/dang-bai/sua/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx) dùng `tinymceScriptSrc="/tinymce/tinymce.min.js"`, `skin_url: '/tinymce/skins/ui/oxide'`, `content_css: '/tinymce/skins/content/default/content.min.css'`.
  - [x] **Step 4.5.4 (Verify PASS):** Chạy `npx vitest run scripts/portal-tinymce-local.test.ts` và `npx tsc --noEmit` đạt 100% `PASS`.

- [x] **Task 4.6: Chuẩn hóa kiến trúc Hybrid theo chốt mới (Mục 2.2 R2 Image Fallback `onError` + Mục 2.3 Cloudflare KV `CONFIG_KV` Không Fallback Firestore)**
  - [x] **Step 4.6.1 (RED):**
    - [x] Cập nhật [ontap-web/services/__tests__/adminConfigD1.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/__tests__/adminConfigD1.test.ts) kiểm chứng `getUsageConfig`, `saveUsageConfig`, `getGitHubConfig`, `saveGitHubConfig` chỉ đọc/ghi qua Cloudflare KV API (`/api/v1/config/*`), **tuyệt đối không gọi `firestore.getDoc` / `firestore.setDoc`** và ném lỗi rõ ràng nếu bấm Lưu khi chưa kết nối được KV API.
    - [x] Tạo mới [ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts) kiểm tra xóa sạch domain giả mặc định và xác minh hàm `resolveQuestionImageFallbackUrl(question)`.
    - [x] Cập nhật unit test Worker kiểm tra `handleConfigRoutes` đọc/ghi trực tiếp `env.CONFIG_KV`.
  - [x] **Step 4.6.2 (Verify RED):** Chạy `npm --prefix ontap-web run test:run -- services/__tests__/adminConfigD1.test.ts utils/__tests__/imageHelper.test.ts` và `npm --prefix cloudflare-worker run test` — xác nhận test `FAIL`.
  - [x] **Step 4.6.3 (GREEN):**
    - [x] **[cloudflare-worker/src/types.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/types.ts) & [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts):** Thêm `CONFIG_KV: KVNamespace;` vào `WorkerEnv` và chuyển `GET/PUT /api/v1/config/:key` sang đọc/ghi trực tiếp trên `env.CONFIG_KV` (`< 5ms` tại Edge, thay vì bảng `app_configs` trong D1).
    - [x] **[ontap-web/services/d1Client.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/d1Client.ts) & [ontap-web/services/adminConfigService.ts](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts):** Xóa bỏ URL giả mặc định; gỡ bỏ hoàn toàn fallback đọc/ghi kép vào Firestore `settings/usage_config` & `settings/github_config` (chỉ giữ `DEFAULT_CONFIG` an toàn trong RAM khi mất mạng lúc đọc, và báo lỗi rõ ràng khi bấm Lưu mà chưa kết nối được KV API).
    - [x] **[ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts) & [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs):** Xóa bỏ hoàn toàn chuỗi URL giả mặc định cũ; bổ sung hàm `resolveQuestionImageFallbackUrl(question)` trả về link ảnh gốc trên Supabase/Firebase (nếu `question.image` là `https://...` gốc) hoặc đường dẫn tĩnh `/ontap/question_images/${question.id}.png`.
    - [x] **[ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx), [ontap-web/components/ResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ResultsScreen.tsx), [ontap-web/components/ExamResultsScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamResultsScreen.tsx):** Gắn xử lý `onError` tự động chuyển sang ảnh dự phòng trên thẻ `<img>` câu hỏi (**TUYỆT ĐỐI KHÔNG CHẠM VÀO [ontap-web/components/ExamQuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx)** — `git diff = 0`).
  - [x] **Step 4.6.4 (Verify GREEN & Build):**
    - [x] Chạy `npm --prefix ontap-web run test:run -- services/__tests__/adminConfigD1.test.ts services/__tests__/dataService.test.ts utils/__tests__/imageHelper.test.ts` và `npm --prefix cloudflare-worker run test` đạt 100% `PASS`.
    - [x] Xác nhận `git diff ontap-web/components/ExamQuizScreen.tsx` bằng `0`.
    - [x] Chạy `npx tsc --noEmit` và `npm run build` hoàn tất với `exit code 0`.

---

## Phase 05: Triển Khai Hạ Tầng Cloudflare Edge Production (`D1 Database` + `R2 Object Storage` + `KV Config Store` + `tndnb-edge-api` Worker)
*Chi tiết kỹ thuật:* [phase-05-cloudflare-production-deployment.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-05-cloudflare-production-deployment.md)

- [x] **Task 5.1: Kích hoạt Cloudflare R2 trên Dashboard & Khởi tạo bucket `tndnb-assets`**
  - [x] Kích hoạt gói R2 miễn phí trên Cloudflare Dashboard (`R2 Object Storage -> Activate R2 Plan`).
  - [x] Chạy `npx --prefix cloudflare-worker wrangler r2 bucket create tndnb-assets` và xác nhận bằng `wrangler r2 bucket list`.

- [x] **Task 5.2: Khởi tạo Cloudflare KV (`TNDNB_CONFIG_KV`) & Cloudflare D1 (`tndnb-d1-prod`), cập nhật [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml) & bổ sung route ảnh `/question-images/*`**
  - [x] **Step 5.2.1 (RED):** Tạo bộ test [scripts/cloudflare-prod-readiness.test.ts](file:///d:/Antigravity/TNDNB/scripts/cloudflare-prod-readiness.test.ts) kiểm tra `ALLOWED_ORIGINS` (`localhost:3001`, `https://www.daotaothuyenvien.com`), đủ 3 bindings (`tndnb-d1-prod`, `tndnb-assets`, `CONFIG_KV`), route KV trong [cloudflare-worker/src/routes/config.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/routes/config.ts), nhánh phục vụ ảnh `/question-images/*` trong [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts), và cờ `--remote` trong [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs).
  - [x] **Step 5.2.2 (Verify RED):** Chạy `npx vitest run scripts/cloudflare-prod-readiness.test.ts` — xác nhận test `FAIL`.
  - [x] **Step 5.2.3 (GREEN):**
    - [x] Chạy `npx --prefix cloudflare-worker wrangler kv namespace create TNDNB_CONFIG_KV` và ghi nhận `id` KV thật (`fba8d3d67cfb44bdbef1855016061ff4`).
    - [x] Chạy `npx --prefix cloudflare-worker wrangler d1 create tndnb-d1-prod` và ghi nhận `database_id` UUID thật (`0177c851-b4c5-45a0-9980-785b758fdb20`).
    - [x] Cập nhật `database_id`, khối `[[kv_namespaces]]` (`binding = "CONFIG_KV"`), `ALLOWED_ORIGINS` (`https://daotaothuyenvien.com,https://www.daotaothuyenvien.com,http://localhost:3001,...`) và `FIREBASE_PROJECT_ID` vào [cloudflare-worker/wrangler.toml](file:///d:/Antigravity/TNDNB/cloudflare-worker/wrangler.toml).
    - [x] Bổ sung nhánh `GET /question-images/*` đọc từ `env.ASSETS_BUCKET` kèm `Cache-Control: public, max-age=31536000, immutable` trong [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts).
    - [x] Bổ sung cờ `'--remote'` vào lệnh `wrangler r2 object put` trong [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs).
  - [x] **Step 5.2.4 (Verify GREEN):** Chạy `npx vitest run scripts/cloudflare-prod-readiness.test.ts` và `npm --prefix cloudflare-worker run test` — xác nhận `PASS`.

- [x] **Task 5.3 & Task 5.4: Deploy Cloudflare Worker `tndnb-edge-api` lên Remote & Seed 1.000+ câu hỏi/đáp án sang D1**
  - [x] Chạy `npm --prefix cloudflare-worker run deploy` để triển khai `tndnb-edge-api` và lấy URL chính thức `https://tndnb-edge-api.pokecvlkq.workers.dev`.
  - [x] Chạy migration schema lên D1 Remote: `npx --prefix cloudflare-worker wrangler d1 execute tndnb-d1-prod --remote --file=./cloudflare-worker/migrations/0001_initial_schema.sql`.
  - [x] Sinh file `0002_seed_data.sql` bằng [scripts/migrate-to-d1.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-to-d1.mjs) với `VITE_R2_PUBLIC_URL` trỏ về URL Worker thật và thực thi seed lên D1 Remote (`--remote`).
  - [x] Kiểm tra endpoint `GET /api/v1/meta/version` xác nhận `totalQuestions = 1810 >= 1000`.

- [x] **Task 5.5: Upload toàn bộ 280+ ảnh câu hỏi lên Cloudflare R2 (`tndnb-assets`)**
  - [x] Thực thi [scripts/migrate-images-to-r2.mjs](file:///d:/Antigravity/TNDNB/scripts/migrate-images-to-r2.mjs) đẩy toàn bộ 280 ảnh từ `ontap-win/public/question_images` lên bucket `tndnb-assets` (`--remote`).
  - [x] Kiểm tra truy xuất ảnh thực tế qua `GET /question-images/nvmt_1.png` trả về `HTTP 200` + `immutable` cache.

- [x] **Task 5.6: Cập nhật biến môi trường (`VITE_CLOUDFLARE_API_URL`, `VITE_R2_PUBLIC_URL`, `NEXT_PUBLIC_CLOUDFLARE_API_URL`) & Kiểm thử E2E đúng 4 quy tắc kiến trúc**
  - [x] Cập nhật `.env.local`, `ontap-web/.env` và `ontap-web/.env.production` trỏ vào link Worker thật `https://tndnb-edge-api.pokecvlkq.workers.dev`.
  - [x] Chạy kiểm thử E2E toàn diện 4 tầng: (2.1) nạp đề thi D1 Snapshot + Fallback Supabase, (2.2) hiển thị ảnh R2 + Fallback `onError` (giữ nguyên `ExamQuizScreen.tsx`), (2.3) lưu cấu hình `https://www.daotaothuyenvien.com/ontap/settings` 100% vào Cloudflare KV `CONFIG_KV` không fallback Firestore, và (2.4) đăng nhập/lớp học/phòng thi Firebase.

- [x] **Task 5.7 (Tùy chọn mở rộng): Cấu hình Custom Domain miễn phí `api.daotaothuyenvien.com` / `cdn.daotaothuyenvien.com` trên Cloudflare Dashboard**
  - [x] Gắn Custom Domain `api.daotaothuyenvien.com` vào Worker `tndnb-edge-api` và `cdn.daotaothuyenvien.com` vào R2 `tndnb-assets` trên Cloudflare Dashboard (đều đạt HTTP 200 OK), sau đó cập nhật lại biến môi trường `.env.local`, `ontap-web/.env` và `ontap-web/.env.production`.

---

## Phase 06 (Mở Rộng Tương Lai / Backlog Sau Khi Phase 05 Hoàn Tất): Chuyển Đổi Dần Ảnh & Tài Liệu Giáo Trình (PDF/Word) Của Root Portal (`https://www.daotaothuyenvien.com`) Sang Cloudflare R2 (`Gradual Migration`)
*Chi tiết kỹ thuật & thiết kế:* [phase-06-portal-r2-assets-design.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/phase-06-portal-r2-assets-design.md) & Mục 2.5 trong [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261105-1836-ontap-web-ui-overhaul/plan.md)

- [x] **Task 6.1 (Bước 1 — Chuyển luồng Upload bài viết mới sang Cloudflare R2 sau khi Phase 05 Go-Live):**
  - [x] Bổ sung endpoint `POST /api/v1/portal/upload` (xác thực quyền Admin/Editor) và route phục vụ file `GET /portal-assets/*` trên Cloudflare Worker [cloudflare-worker/src/index.ts](file:///d:/Antigravity/TNDNB/cloudflare-worker/src/index.ts) kết nối trực tiếp vào R2 bucket `tndnb-assets` (theo prefix `portal/images/` và `portal/documents/`).
  - [x] Cập nhật trang tạo bài viết mới [app/quan-ly/dang-bai/tao-moi/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/tao-moi/page.tsx) và trang chỉnh sửa bài viết [app/quan-ly/dang-bai/sua/[postId]/page.tsx](file:///d:/Antigravity/TNDNB/app/quan-ly/dang-bai/sua/%5BpostId%5D/page.tsx) để mọi bài viết mới khi tải ảnh bìa, ảnh nội dung hoặc tài liệu đính kèm (PDF/Word giáo trình) tự động đẩy thẳng lên Cloudflare R2, hưởng trọn **10 GB lưu trữ miễn phí** và **Zero Egress ($0 băng thông)**.
- [ ] **Task 6.2 (Bước 2 — Giữ an toàn tuyệt đối bài viết cũ & Gom Backup dần khi Supabase vượt 500 MB):**
  - [ ] Giữ nguyên toàn bộ bài viết và file cũ trên **Supabase Storage** để không làm đứt gãy bất kỳ đường link ảnh hay tài liệu cũ nào trên `https://www.daotaothuyenvien.com`.
  - [ ] *(Chỉ kích hoạt khi dung lượng Supabase Storage vượt mốc 500 MB)* Viết và chạy script gom backup dần các file lịch sử từ Supabase Storage sang Cloudflare R2 kèm cập nhật URL an toàn.
