# Living To-Do List: Loại bỏ nút "Thoát" trên TopNavbar & Khắc phục lỗi hiển thị AdSense sai đối tượng (`261109-0950-remove-navbar-logout-button`)

> **Kế hoạch tổng thể:** [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/plan.md)  
> **Tài liệu thiết kế:** [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/DESIGN.md)

---

## Phase 01: Dọn dẹp nút `Thoát` độc lập trên thanh `TopNavbar.tsx`
> Chi tiết: [`phase-01-topnavbar-cleanup.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-01-topnavbar-cleanup.md)

- [x] **Step 1.1 (RED):** Bổ sung bài kiểm thử thất bại `TC-32` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra [`TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) không còn nút Thoát ngoài thanh Desktop và bảo toàn nút Đăng xuất trong Hamburger Menu.
- [x] **Step 1.2 (VERIFY FAIL):** Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-32"` xác nhận FAIL do nút Thoát vẫn còn.
- [x] **Step 1.3 (GREEN):** Mở [`TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) và xóa vách ngăn dọc `<div className="h-6 w-[1px] bg-border mx-1 hidden md:block"></div>` cùng khối nút `{/* Standalone Logout Button (Desktop) */}` tại dòng 215–225.
- [x] **Step 1.4 (VERIFY PASS):** Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-32"` xác nhận PASS 100%.
- [x] **Step 1.5 (INVARIANTS & COMMIT):** Xác nhận `git diff ontap-web/components/ExamQuizScreen.tsx` bằng 0 bytes và commit Phase 01 (`daa4986d`).

---

## Phase 02: Khắc phục triệt để lỗi hiển thị AdSense sai đối tượng (Auth Ready Guard, Async Cancellation, DOM Purge & Role Mapping)
> Chi tiết: [`phase-02-adsense-role-gating-fix.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-02-adsense-role-gating-fix.md)

- [x] **Step 2.1 (RED):** Viết test `TC-33a` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra cờ `isAuthReady` trong [`useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts) và [`useAppInitialization.ts`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts).
- [x] **Step 2.2 (VERIFY FAIL):** Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33a"` xác nhận FAIL.
- [x] **Step 2.3 (GREEN):** Bổ sung `isAuthReady` vào [`useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts) và kích hoạt `setIsAuthReady(true)` trong [`useAppInitialization.ts`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts) khi auth xác định xong.
- [x] **Step 2.4 (VERIFY PASS):** Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33a"` xác nhận PASS.
- [x] **Step 2.5 (RED):** Viết test `TC-34` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra role mapping (`leader`, `courseId`) và CSS phòng thủ Auto-Ads.
- [x] **Step 2.6 (VERIFY FAIL):** Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-34"` xác nhận FAIL.
- [x] **Step 2.7 (GREEN):** Cập nhật `getUserRoleConfig` trong [`usageService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts) và nâng cấp `ADSENSE_HIDE_ALL_CSS` trong [`adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts).
- [x] **Step 2.8 (VERIFY PASS):** Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-34"` xác nhận PASS.
- [x] **Step 2.9 (RED):** Viết test `TC-33b` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra chốt chặn `isAuthReady`, cờ `isCancelled` và hàm `purgeAllAdSenseDomAndScripts` trong [`AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx).
- [x] **Step 2.10 (VERIFY FAIL):** Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33b"` xác nhận FAIL.
- [x] **Step 2.11 (GREEN):** Cập nhật [`AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx) truyền `isAuthReady`, và nâng cấp [`AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx) với chốt chặn `if (!isAuthReady)`, cờ `isCancelled` và `purgeAllAdSenseDomAndScripts()`.
- [x] **Step 2.12 (VERIFY PASS):** Chạy lại `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-33b"` xác nhận PASS.
- [x] **Step 2.13 (INVARIANTS & COMMIT):** Xác nhận `git diff ontap-web/components/ExamQuizScreen.tsx` bằng 0 bytes và commit Phase 02 (`850f50e3`).

---

## Phase 03: Kiểm thử TDD (Vitest) & Build đồng bộ `public/ontap`
> Chi tiết: [`phase-03-testing-and-build.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/phase-03-testing-and-build.md)

- [x] **Step 3.1:** Chạy riêng bộ kiểm thử cập nhật: `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` đảm bảo 100% PASS.
- [x] **Step 3.2:** Chạy toàn bộ 13 test suites của dự án: `npx vitest run scripts/` đảm bảo 99/99 tests PASS.
- [x] **Step 3.3:** Typecheck nghiêm ngặt: `npx --prefix ontap-web tsc --noEmit` đạt 0 lỗi.
- [x] **Step 3.4:** Build production: `npm --prefix ontap-web run build` xuất bản sang [`public/ontap/`](file:///d:/Antigravity/TNDNB/public/ontap/).
- [x] **Step 3.5:** Kiểm tra invariant `git diff ontap-web/components/ExamQuizScreen.tsx` = 0 bytes.
- [x] **Step 3.6:** Commit hoàn tất đợt phát hành lên Git.
