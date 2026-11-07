# 📋 TÀI LIỆU BÀN GIAO TIẾN ĐỘ DỰ ÁN (HANDOVER DOCUMENT)

> **Dự án**: Cổng thông tin & Hệ thống Quản trị Đào tạo Thuyền viên Ninh Bình (TNDNB)  
> **Thời điểm cập nhật**: 2026-11-07 11:12:50 (GMT+7)  
> **Nhánh hiện tại**: `main` (Up to date với `origin/main`)  
> **Commit mới nhất**: `f60b54c6` (Merge branch 'feat/mobile-dashboard-and-top-navbar-simplification' into main)  

---

## 1. Tình Trạng Hiện Tại & Công Việc Vừa Hoàn Thành

Phiên làm việc đã xử lý trọn vẹn và nghiệm thu hoàn hảo 3 đợt công việc quan trọng:

1. **Đợt 1 — Tối giản Mobile Dashboard, TopNavbar & PWA Banner**:
   - Khắc phục triệt để lỗi hydration mismatch của Swiper Slider (`dynamic(..., { ssr: false })`).
   - Mặc định tích cả 2 tùy chọn ghi nhớ tài khoản trên `LoginScreen.tsx`.
   - Loại bỏ popup cảnh báo thiết bị đơn, ngăn tự động hỏi Geolocation trên `WeatherWidget.tsx`.
   - Tối giản Dashboard học viên mobile: hiển thị thẻ học viên và nút "Vào Ôn Tập / Thi Thử" to rõ ràng.
   - Tối ưu TopNavbar: gom Tài khoản & Đăng xuất vào Hamburger menu bên phải, chỉ để 4 nút cho học viên mobile.
   - Thêm component `PwaInstallBanner.tsx` hướng dẫn cài đặt Add to Home Screen cho PWA.

2. **Đợt 2 — Zero-Noise Console & Guest Firestore Auth Guard**:
   - Phân tích nguyên nhân lỗi console do extension uBlock Origin (`net::ERR_BLOCKED_BY_CLIENT`) và extension máy khách (`200.js reading M_ID`).
   - Thêm Guest Auth Guard `auth?.currentUser` vào `getUsageConfig()` và `getGitHubConfig()` trong `ontap-web/services/adminConfigService.ts` để khách vãng lai không bị Firestore trả về lỗi đỏ `Missing or insufficient permissions`.

3. **Đợt 3 — Khử Sạch Thông Số Tự Bịa & Tái Cấu Trúc WelcomeModal**:
   - Loại bỏ hoàn toàn khối cột phải `md:col-span-5` chứa "THÔNG SỐ HỆ THỐNG HỌC LIỆU" (`100%`, `30 câu / đề`, `24/7`) và khối 3 bullet points tính năng theo 2 ảnh chỉ đạo của người dùng.
   - Chuyển `WelcomeModal.tsx` sang Hero Layout Archetype `centred` (`max-w-lg text-center`) với Bánh lái 3D `HelmIcon3D` làm Visual Anchor, chuẩn Taste-Skill v2.5.0 và Impeccable Craft Floor v4.8.0.
   - Kiểm thử TDD (11/11 tests PASS), nghiệm thu tổng lực `/check-project` (52/52 tests PASS, 0 lỗi TypeScript, 0 bytes diff `ExamQuizScreen.tsx`, Next.js 57 routes & Vite build hoàn tất).
   - Đã merge thành công vào nhánh `main` và push lên GitHub remote (`origin/main`).

---

## 2. Các Bất Biến & Cam Kết Kỹ Thuật (Protected Invariants)

- **Invariant 1 (Bất di bất dịch)**: [`ontap-web/components/ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) giữ nguyên `0 bytes diff` (`git diff` trống tuyệt đối).
- **Interface Contract**: `WelcomeModalProps` (`onStart`, `onLoginClick`, `onRegisterClick`) không bị thay đổi, đảm bảo tương thích 100% với `App.tsx`.
- **Changelog kép**: Cập nhật bài học và quyết định kiến trúc vào `.brain/LEARNINGS.md`.

---

## 3. Các Tệp Tin Quan Trọng Nhất Đã Thay Đổi
- [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx): Component thẻ đơn trung tâm mới.
- [`scripts/ontap-dual-theme-and-sidebar.test.ts`](file:///d:/Antigravity/TNDNB/scripts/ontap-dual-theme-and-sidebar.test.ts): Bộ test suite TDD canh gác giao diện và Invariant 1.
- [`docs/plans/261107-1035-remove-fake-stats-welcome-modal/`](file:///d:/Antigravity/TNDNB/docs/plans/261107-1035-remove-fake-stats-welcome-modal/): Thư mục kế hoạch, thiết kế, đặc tả UI và checklist task chính thức.
- [`ontap-web/services/adminConfigService.ts`](file:///d:/Antigravity/TNDNB/ontap-web/services/adminConfigService.ts): Guest Auth Guard chặn lỗi console.
- [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx): Hamburger Menu & 4 nút mobile.
- [`ontap-web/components/Dashboard.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/Dashboard.tsx): Mobile Dashboard tinh gọn.
