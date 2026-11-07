# Danh Sách Nhiệm Vụ Thực Thi (Task Checklist)

> **Mã kế hoạch**: `261107-0940-clean-console-and-guest-firestore-guard`  
> **Kế hoạch tổng thể**: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0940-clean-console-and-guest-firestore-guard/plan.md)  
> **Trạng thái**: Hoàn thành toàn diện (Completed - All Tests Green & Verified)

---

## Phase 01: Cài Đặt Guest Auth Guard Trong adminConfigService
*Tài liệu chi tiết: [`phase-01-guest-firestore-guard.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0940-clean-console-and-guest-firestore-guard/phase-01-guest-firestore-guard.md)*

### Task 1: Bổ sung Guest Auth Guard cho `getUsageConfig()`
- [x] **Step 1.1**: Viết test thất bại (RED - `TC-28`) trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra guard `auth?.currentUser` trong `getUsageConfig()`.
- [x] **Step 1.2**: Chạy kiểm thử tự động `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` — xác nhận test `TC-28` FAIL (RED).
- [x] **Step 1.3**: Sửa mã nguồn [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts) tại dòng 298: thay `if (!data && db)` thành `if (!data && db && auth?.currentUser)` (GREEN).
- [x] **Step 1.4**: Chạy lại kiểm thử — xác nhận test `TC-28` PASS xanh (GREEN).

### Task 2: Bổ sung Guest Auth Guard cho `getGitHubConfig()`
- [x] **Step 2.1**: Viết test thất bại (RED - `TC-29`) trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra guard `auth?.currentUser` trong `getGitHubConfig()`.
- [x] **Step 2.2**: Chạy kiểm thử tự động `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` — xác nhận test `TC-29` FAIL (RED).
- [x] **Step 2.3**: Sửa mã nguồn [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts) tại dòng 413: thay `if (!data && db)` thành `if (!data && db && auth?.currentUser)` (GREEN).
- [x] **Step 2.4**: Chạy lại kiểm thử — xác nhận test `TC-29` PASS xanh (GREEN).

### Task 3: Rà soát & Xác nhận An Toàn Bản Desktop (`ontap-win`)
- [x] **Step 3.1**: Kiểm tra file [`ontap-win/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-win/services/adminConfigService.ts) để xác nhận bản desktop chỉ đọc D1 API và fallback sang localStorage/default, không bị ảnh hưởng bởi Firestore.

---

## Phase 02: Kiểm Thử TDD & Nghiệm Thu Toàn Diện
*Tài liệu chi tiết: [`phase-02-test-and-verification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0940-clean-console-and-guest-firestore-guard/phase-02-test-and-verification.md)*

- [x] **Task 2.1**: Chạy kiểm thử tự động toàn bộ test suite bằng lệnh `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (kỳ vọng 29/29 tests PASS 100%).
- [x] **Task 2.2**: Chạy kiểm tra kiểu dữ liệu toàn hệ thống bằng lệnh `npx tsc --noEmit` và `cd ontap-web; npx tsc --noEmit; cd ..` (kỳ vọng 0 lỗi TypeScript).
- [x] **Task 2.3**: Kiểm tra bất biến Invariant 1 bằng lệnh `git diff --stat ontap-web/components/ExamQuizScreen.tsx` (kỳ vọng 0 bytes thay đổi).
- [x] **Task 2.4**: Chạy kiểm tra đóng gói ứng dụng `npm run build` (kỳ vọng Vite build cho ontap-web và Next.js build cho 57 routes thành công 100%).
- [x] **Task 2.5**: Git commit an toàn và push lên nhánh `feat/mobile-dashboard-and-top-navbar-simplification`.
