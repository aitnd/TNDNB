# Danh Sách Nhiệm Vụ Thi Công Chi Tiết (Living Task Checklist)

> **Mã kế hoạch**: `261107-0620-mobile-dashboard-simplification-and-error-audit`  
> **Quy trình áp dụng**: TDD Enriched (RED -> FAIL -> GREEN -> PASS -> COMMIT)  
> **Tài liệu gốc**:
> - Kế hoạch tổng thể: [`plan.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md)
> - Thiết kế kỹ thuật: [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/DESIGN.md)
> - Chi tiết Phase 01: [`phase-01-audit-console-errors-and-login-screen.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-01-audit-console-errors-and-login-screen.md)
> - Chi tiết Phase 02: [`phase-02-mobile-dashboard-simplification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-02-mobile-dashboard-simplification.md)
> - Chi tiết Phase 03: [`phase-03-smart-app-banner-and-pwa-prompt.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-03-smart-app-banner-and-pwa-prompt.md)
> - Bộ kiểm thử TDD: [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts)

---

## 📌 Trạng Thái Tổng Thể Các Phase

- [x] **Phase 01: Kiểm toán lỗi console 5 ảnh, sửa Hydration Next.js & Đặt mặc định tích 2 ô LoginScreen**
- [x] **Phase 02: Tối giản UI Dashboard mobile, Menu 3 gạch ngang & Triệt tiêu hỏi quyền/cảnh báo**
- [x] **Phase 03: Smart App Banner & Gợi ý Thêm vào Màn hình chính (PWA Add to Home Screen)**

---

## 🛠️ Chi Tiết Từng Bước Thi Công TDD (Granular Bite-Sized Checklist)

### Phase 01: Kiểm Toán Lỗi Console, Sửa Hydration Next.js & Tích Mặc Định Đăng Nhập
> Chi tiết kỹ thuật: [`phase-01-audit-console-errors-and-login-screen.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-01-audit-console-errors-and-login-screen.md)

- [x] **Task 1: Triệt Tiêu React Hydration Mismatch trong `app/page.tsx`**
  - [x] **Step 1.1 (TDD RED)**: Viết test case `TC-17` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra dynamic import `FeaturedSlider` với `{ ssr: false }`.
  - [x] **Step 1.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-17"` xác nhận test thất bại theo đúng quy trình TDD.
  - [x] **Step 1.3 (TDD GREEN)**: Sửa [`app/page.tsx`](file:///d:/Antigravity/TNDNB/app/page.tsx) dùng `dynamic(() => import('../components/FeaturedSlider'), { ssr: false })`.
  - [x] **Step 1.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-17"` xác nhận PASS 100%.
  - [x] **Step 1.5 (Commit)**: `git commit -m "fix(portal): resolve React hydration mismatch using dynamic import for FeaturedSlider"`.

- [x] **Task 2: Tích Mặc Định 2 Ô Đăng Nhập trong `LoginScreen.tsx`**
  - [x] **Step 2.1 (TDD RED)**: Viết test case `TC-18` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra `rememberMe` và `saveThisAccount` mặc định là `true`.
  - [x] **Step 2.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-18"` xác nhận FAIL do `rememberMe` đang là `false`.
  - [x] **Step 2.3 (TDD GREEN)**: Sửa [`ontap-web/components/LoginScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/LoginScreen.tsx) đổi `const [rememberMe, setRememberMe] = useState(true);`.
  - [x] **Step 2.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-18"` xác nhận PASS 100%.
  - [x] **Step 2.5 (Commit)**: `git commit -m "feat(auth): default rememberMe and saveThisAccount checkboxes to checked"`.

---

### Phase 02: Tối Giản UI Dashboard & Top Navbar Mobile (1 Chạm Vào Thi, Menu 3 Gạch Ngang & Tắt Cảnh Báo)
> Chi tiết kỹ thuật: [`phase-02-mobile-dashboard-simplification.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-02-mobile-dashboard-simplification.md)

- [x] **Task 1: Triệt Tiêu Modal Cảnh Báo Đăng Nhập trong `authSessionService.ts`**
  - [x] **Step 1.1 (TDD RED)**: Viết test case `TC-19` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) đảm bảo không gọi `showSingleDeviceWarning()` trong `enforceAndRecordSession`.
  - [x] **Step 1.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-19"` xác nhận FAIL.
  - [x] **Step 1.3 (TDD GREEN)**: Cập nhật [`ontap-web/services/authSessionService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/authSessionService.ts) tắt bật popup modal khi xoay phiên đăng nhập.
  - [x] **Step 1.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-19"` xác nhận PASS 100%.
  - [x] **Step 1.5 (Commit)**: `git commit -m "fix(auth): disable noisy single-device warning modal for smooth login"`.

- [x] **Task 2: Tắt Tự Động Xin Quyền Vị Trí trong `WeatherWidget.tsx`**
  - [x] **Step 2.1 (TDD RED)**: Viết test case `TC-20` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) đảm bảo `useEffect` không tự kích hoạt `navigator.geolocation.getCurrentPosition`.
  - [x] **Step 2.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-20"` xác nhận FAIL.
  - [x] **Step 2.3 (TDD GREEN)**: Sửa [`ontap-web/components/WeatherWidget.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WeatherWidget.tsx) gọi trực tiếp `fetchWeather()` không hỏi vị trí trên mount.
  - [x] **Step 2.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-20"` xác nhận PASS 100%.
  - [x] **Step 2.5 (Commit)**: `git commit -m "fix(weather): prevent automatic GPS permission request on mount"`.

- [x] **Task 3: Tối Giản Layout Mobile trong `Dashboard.tsx`**
  - [x] **Step 3.1 (TDD RED)**: Viết test cases `TC-21` & `TC-22` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra `hidden lg:block` cho Thời tiết & Tiến độ, và `PrimaryButton` render sát dưới `StudentCard`.
  - [x] **Step 3.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-21|TC-22"` xác nhận FAIL.
  - [x] **Step 3.3 (TDD GREEN)**: Cập nhật [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) ẩn widget không cần thiết trên mobile và đưa nút Vào Ôn Tập lên vị trí đập vào mắt ngay lập tức.
  - [x] **Step 3.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-21|TC-22"` xác nhận PASS 100%.
  - [x] **Step 3.5 (Commit)**: `git commit -m "feat(dashboard): streamline mobile layout with instant CTA under student card"`.

- [x] **Task 4: Tối Giản TopNavbar: Menu 3 Gạch Ngang & 4 Nút Tối Giản Cho Role Học Viên**
  - [x] **Step 4.1 (TDD RED)**: Viết test cases `TC-25` & `TC-26` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra Hamburger menu icon `Menu` và ẩn các nút riêng lẻ trên mobile.
  - [x] **Step 4.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-25|TC-26"` xác nhận FAIL.
  - [x] **Step 4.3 (TDD GREEN)**: Cập nhật [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx): Gom tài khoản + đăng xuất vào menu 3 gạch; chỉ để 4 nút trên mobile cho role học viên (`[Ôn tập]`, `[Lớp của tôi]`, `[NotificationBell]`, `[Menu 3 gạch]`).
  - [x] **Step 4.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-25|TC-26"` xác nhận PASS 100%.
  - [x] **Step 4.5 (Commit)**: `git commit -m "feat(navbar): simplify mobile navbar with hamburger menu and 4-item student layout"`.

---

### Phase 03: Banner Cài Đặt Ứng Dụng PWA / Đưa Ra Màn Hình Chính (PWA Add to Home Screen)
> Chi tiết kỹ thuật: [`phase-03-smart-app-banner-and-pwa-prompt.md`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/phase-03-smart-app-banner-and-pwa-prompt.md)

- [x] **Task 1: Xây Dựng Component `PwaInstallBanner.tsx`**
  - [x] **Step 1.1 (TDD RED)**: Viết test cases `TC-23` & `TC-24` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra xử lý standalone, `beforeinstallprompt`, hướng dẫn iOS và ghi nhớ ẩn 7 ngày.
  - [x] **Step 1.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-23|TC-24"` xác nhận FAIL do component chưa tồn tại.
  - [x] **Step 1.3 (TDD GREEN)**: Tạo mới [`ontap-web/components/PwaInstallBanner.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/PwaInstallBanner.tsx) theo đúng thiết kế thuần PWA (không dùng APK).
  - [x] **Step 1.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-23|TC-24"` xác nhận PASS 100%.
  - [x] **Step 1.5 (Commit)**: `git commit -m "feat(pwa): create PwaInstallBanner with native prompt and iOS home screen guide"`.

- [x] **Task 2: Tích Hợp `PwaInstallBanner` Vào Mobile Dashboard**
  - [x] **Step 2.1 (TDD RED)**: Viết test case `TC-27` trong [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts) kiểm tra `<PwaInstallBanner />` render phía trên `StudentCard`.
  - [x] **Step 2.2 (TDD FAIL)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-27"` xác nhận FAIL.
  - [x] **Step 2.3 (TDD GREEN)**: Cập nhật [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx) render `<PwaInstallBanner />`.
  - [x] **Step 2.4 (TDD PASS)**: Chạy `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts -t "TC-27"` xác nhận PASS 100%.
  - [x] **Step 2.5 (Commit)**: `git commit -m "feat(dashboard): integrate PwaInstallBanner above student card"`.

- [x] **Task 3: Toàn Bộ Kiểm Thử TDD, TypeCheck & Kiểm Tra Bất Biến Invariant 1**
  - [x] **Step 3.1**: Chạy toàn bộ test suite `npx vitest run scripts/portal-console-and-tinymce-fix.test.ts` (TC-01 -> TC-27 PASS 100%).
  - [x] **Step 3.2**: Chạy kiểm tra tĩnh TypeScript `npx tsc --noEmit` (0 lỗi).
  - [x] **Step 3.3**: Chạy build sản phẩm `npm run build` xác nhận không có lỗi đóng gói.
  - [x] **Step 3.4**: Kiểm tra bất biến Invariant 1: `git diff ontap-web/components/ExamQuizScreen.tsx` === 0 bytes.
  - [x] **Step 3.5 (Final Commit)**: `git commit -m "feat(pwa): finalize mobile dashboard simplification and PWA home screen prompt"`.
