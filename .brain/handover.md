# 📋 TÀI LIỆU BÀN GIAO TIẾN ĐỘ DỰ ÁN (HANDOVER DOCUMENT)

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Thời điểm cập nhật**: 2026-11-09 11:55:00 (GMT+7)  
> **Nhánh hiện tại**: `main` (Up to date với `origin/main`)  
> **Commit mới nhất**: `833ec627` (chore(brain): update current recap for plan 261109-0950)  

---

## 1. Tình Trạng Hiện Tại & Công Việc Vừa Hoàn Thành

Phiên làm việc đã hoàn thành 100% 3 Phase của kế hoạch **`261109-0950-remove-navbar-logout-button`**, giải quyết trọn vẹn 2 yêu cầu của người dùng:

1. **Dọn dẹp nút Thoát độc lập trên TopNavbar Desktop (`TopNavbar.tsx`)**:
   - Gỡ bỏ hoàn toàn nút Thoát Desktop và vách ngăn dọc nằm cạnh Avatar.
   - Thống nhất trải nghiệm: Đăng xuất được đặt an toàn và duy nhất ở mục cuối cùng trong **Menu Hamburger 3 gạch `[≡]`** trên cả Desktop lẫn Mobile.
   - Tránh việc người dùng vô tình bấm nhầm vào nút thoát khi đang thao tác các tính năng trên thanh điều hướng.

2. **Khắc phục triệt để lỗi AdSense Auto-Ads hiển thị cho Admin & Học viên lớp (`AdSenseLoader.tsx`, `useAppStore.ts`, `useAppInitialization.ts`, `adBlockerStyles.ts`, `usageService.ts`)**:
   - **Auth Initialization Race Condition:** Bổ sung cờ `isAuthReady: boolean` vào store, chỉ bật `true` khi Firebase Auth và Firestore đã tải xong hồ sơ hoặc xác nhận rõ ràng là khách vãng lai (`currentUser === null`). Ngăn chặn `AdSenseLoader` nhận nhầm Admin là khách vãng lai trong 300ms–1000ms đầu khi vừa tải trang.
   - **Async Closure Race Condition:** Bổ sung cờ hủy `let isCancelled = false;` trong cleanup hook để hủy toàn bộ các promise ngầm và callback của `IntersectionObserver` khi người dùng chuyển đổi trạng thái auth.
   - **Đè bẹp Google Auto-Ads Inline `!important`:** Tăng cường `ADSENSE_HIDE_ALL_CSS` với đa thuộc tính `opacity: 0 !important; pointer-events: none !important; max-height: 0 !important; transform: scale(0) !important; z-index: -9999 !important;` và hàm `purgeAllAdSenseDomAndScripts()` quét sạch DOM và script của quảng cáo khi role không được phép hiển thị.
   - **Chuẩn hóa Role Mapping:** Điều chỉnh vai trò `lanh_dao` sang `config.leader || config.manager` và bổ sung điều kiện `courseId` đối với học viên chính thức (`verified_user`).

3. **Kiểm thử & Nghiệm thu**:
   - Toàn bộ **13/13 test suites (99/99 tests PASSED 100%)** với 4 test mới (`TC-32`, `TC-33a`, `TC-33b`, `TC-34`).
   - Typecheck Strict: **0 lỗi** trên toàn bộ `ontap-web`.
   - ESLint: **0 errors, 0 warnings**.
   - Build Verify: `npm --prefix ontap-web run build` thành công trong 16.58s xuất bản sang `public/ontap/`.
   - Bảo toàn tuyệt đối Invariant `ExamQuizScreen.tsx` (**0 bytes diff**).
   - Git: Đã push toàn bộ 4 commits lên GitHub remote (`origin/main`).

---

## 2. Các Tệp Tin Trọng Tâm Vừa Chỉnh Sửa
- [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx): Dọn dẹp nút Thoát độc lập Desktop.
- [`ontap-web/stores/useAppStore.ts`](file:///d:/Antigravity/TNDNB/ontap-web/stores/useAppStore.ts): Bổ sung `isAuthReady`.
- [`ontap-web/hooks/useAppInitialization.ts`](file:///d:/Antigravity/TNDNB/ontap-web/hooks/useAppInitialization.ts): Kích hoạt `setIsAuthReady(true)` sau khi auth ổn định.
- [`ontap-web/components/AdSenseLoader.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/AdSenseLoader.tsx): Auth gate, cleanup token `isCancelled`, và `purgeAllAdSenseDomAndScripts()`.
- [`ontap-web/services/adBlockerStyles.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adBlockerStyles.ts): Đa tầng CSS kháng inline `display: block !important`.
- [`ontap-web/services/usageService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/usageService.ts): Chuẩn hóa role mapping `lanh_dao` và `verified_user`.
- [`ontap-web/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/routes/AppRoutes.tsx): Truyền `isAuthReady` vào `<AdSenseLoader />`.
- [`scripts/portal-console-and-tinymce-fix.test.ts`](file:///d:/Antigravity/TNDNB/scripts/portal-console-and-tinymce-fix.test.ts): Thêm `TC-32`, `TC-33a`, `TC-33b`, `TC-34`.
- [`docs/plans/261109-0950-remove-navbar-logout-button/`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0950-remove-navbar-logout-button/): Hồ sơ kế hoạch, thiết kế và các phases đã tick `[x]` 100%.
