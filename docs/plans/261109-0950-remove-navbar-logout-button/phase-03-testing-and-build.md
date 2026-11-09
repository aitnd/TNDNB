# Phase 03: Kiểm thử TDD (Vitest) & Build đồng bộ `public/ontap`

> **Thuộc kế hoạch:** [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/plan.md)  
> **Tài liệu thiết kế:** [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/DESIGN.md)  
> **Status:** ⬜ Pending  
> **Dependencies:** Phase 01, Phase 02

**Goal:** Chạy toàn bộ bộ kiểm thử tự động Vitest (13/13 suites, 98/98 tests PASS), xác nhận 0 lỗi TypeScript, kiểm tra bảo toàn tuyệt đối 100% `ExamQuizScreen.tsx` (0 bytes diff), và đóng gói lại bản build tĩnh của `ontap-web` ra thư mục `public/ontap/` để hiệu lực hóa ngay lập tức trên hệ thống.

**Architecture:** Sử dụng Vitest cho kiểm thử tự động, Vite bundler đóng gói production bundle sang `public/ontap/` (được Next.js Portal phân phối tĩnh tại `/ontap/`).

**Tech Stack:** Vitest, Vite, TypeScript, Next.js 14 Static Router.

---

## Global Constraints
- Bảo toàn tuyệt đối 100% tệp [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) (`0 bytes diff`).
- Tất cả 13 test suites trong thư mục `scripts/` phải PASS 100%, không được bỏ qua bất kỳ bài kiểm tra nào (`0 skipped`).
- Không có lỗi typecheck TypeScript (`0 errors`).

## Review Focus
1. Bản build trong `public/ontap/` có chứa mã mới nhất của `TopNavbar.tsx` và `AdSenseLoader.tsx` không?
2. Thư mục `public/ontap/assets/` có sinh đủ các chunk JS/CSS và không bị lỗi đường dẫn asset tương đối không?
3. File `public/ontap/index.html` có giữ nguyên cấu trúc importmap và các meta tag PWA không?

---

## Implementation Steps (TDD Enriched)

### Task 1: Chạy toàn bộ Test Suites & Typecheck Nghiệm Thu

**Files:**
- Test: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)
- Test: Tất cả 13 file test trong [`scripts/*.test.ts`](file:///d:/Antigravity/TNDNB/scripts/)

- [ ] **Step 3.1: Chạy riêng bộ test cập nhật (RED/GREEN verification)**
  ```powershell
  npx vitest run scripts/portal-console-and-tinymce-fix.test.ts
  ```
  Expected: PASS toàn bộ test cases (gồm cả `TC-32`, `TC-33a`, `TC-33b`, `TC-34`).

- [ ] **Step 3.2: Chạy toàn bộ 13 test suites của dự án**
  ```powershell
  npx vitest run
  ```
  Expected: 13/13 test files passed, 98/98 tests passed (100%), thời gian thực thi < 2s.

- [ ] **Step 3.3: Typecheck Strict TypeScript**
  ```powershell
  npx --prefix ontap-web tsc --noEmit
  ```
  Expected: Không phát sinh bất kỳ lỗi TypeScript nào (`Found 0 errors`).

---

### Task 2: Build Production `ontap-web` xuất tĩnh sang `public/ontap/`

**Files:**
- Source: [`ontap-web/`](file:///d:/Antigravity/TNDNB/ontap-web/)
- Output: [`public/ontap/`](file:///d:/Antigravity/TNDNB/public/ontap/)

- [ ] **Step 3.4: Chạy lệnh build production**
  ```powershell
  npm --prefix ontap-web run build
  ```
  Expected: Vite build thành công, xuất file vào `public/ontap/` trong khoảng 10–20s với thông báo `✓ built in ...ms`.

- [ ] **Step 3.5: Kiểm tra Invariants & Trạng thái Git**
  ```powershell
  git diff ontap-web/components/ExamQuizScreen.tsx
  git status
  ```
  Expected: `git diff ontap-web/components/ExamQuizScreen.tsx` trả về 0 bytes. Các tệp đã thay đổi gồm `TopNavbar.tsx`, `useAppStore.ts`, `useAppInitialization.ts`, `usageService.ts`, `adBlockerStyles.ts`, `AppRoutes.tsx`, `AdSenseLoader.tsx`, `portal-console-and-tinymce-fix.test.ts` và các bundle cập nhật trong `public/ontap/`.

- [ ] **Step 3.6: Commit hoàn tất đợt phát hành**
  ```powershell
  git add public/ontap/ docs/plans/
  git commit -m "chore(release): complete topnavbar logout cleanup, adsense role gating fix and build verification"
  ```
  Expected: Toàn bộ thay đổi được lưu thành công vào commit Git.
