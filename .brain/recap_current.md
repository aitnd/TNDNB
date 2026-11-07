# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-07 (09:15)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh `feat/mobile-dashboard-and-top-navbar-simplification` (Commit mới nhất: `e2a97dcd`).
- **Pull Request:** https://github.com/aitnd/TNDNB/pull/new/feat/mobile-dashboard-and-top-navbar-simplification
- **Mục tiêu hoàn thành đợt này:** Hoàn tất 100% 3 Phase trong kế hoạch [`261107-0620-mobile-dashboard-simplification-and-error-audit`](file:///d:/Antigravity/TNDNB/docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md) và dọn dẹp Git:
  1. **Phase 01 (Xử lý lỗi console & Form Đăng nhập):**
     - Làm rõ lỗi `disconnected port` trong `CM.sendMessageTo` là do tiện ích Bitwarden của trình duyệt, không phải lỗi code web.
     - Khắc phục triệt để lỗi React Hydration Mismatch (`Minified React error #418, #425, #423`) tại trang chủ `app/page.tsx` bằng cách tải động `FeaturedSlider` qua `dynamic(() => import(...), { ssr: false })`.
     - Mặc định tích sẵn cả 2 ô checkbox: `rememberMe: true` (Ghi nhớ đăng nhập) và `saveThisAccount: true` (Lưu tài khoản này) trong `ontap-web/components/LoginScreen.tsx`.
  2. **Phase 02 (Tối giản Mobile Dashboard & TopNavbar):**
     - Loại bỏ popup cảnh báo đăng nhập 1 thiết bị phiền hà (`showSingleDeviceWarning`) trong `ontap-web/services/authSessionService.ts`, cho phép session tự xoay êm ái (silent rotation).
     - Ngăn trình duyệt tự động hỏi quyền vị trí Geolocation khi mount `WeatherWidget.tsx`, chỉ truy vấn khi người dùng chủ động click thời tiết.
     - Bố cục Mobile Dashboard: ẩn widget Thời tiết và Tiến độ học tập (`hidden lg:block`), đưa nút "Vào Ôn Tập / Thi Thử" (`PrimaryButton`) lên ngay sát dưới Thẻ học viên (`StudentCard`) giúp học viên 1 chạm vào thi ngay.
     - Tối ưu TopNavbar: thiết kế nút Menu 3 gạch (`Menu` icon) ở góc phải cùng, mở sheet dropdown chứa thông tin tài khoản, hòm thư, lịch sử, khám phá, phiên bản và nút Đăng xuất màu đỏ.
     - Với role học viên (`hoc_vien`) trên màn hình điện thoại: tinh giản tối đa, chỉ giữ đúng 4 nút: `[Ôn tập]`, `[Lớp của tôi]`, `[Chuông thông báo]` và `[Menu 3 gạch]`. Ẩn tất cả nút còn lại (`hidden md:flex`).
  3. **Phase 03 (Thêm PWA Add to Home Screen Banner):**
     - Tạo component `ontap-web/components/PwaInstallBanner.tsx` chuẩn PWA cài đặt ra màn hình chính (KHÔNG dùng file APK).
     - Bắt sự kiện `beforeinstallprompt` trên trình duyệt Android/Chrome, mở modal 3 bước hướng dẫn cài đặt trên iOS Safari.
     - Tự động ẩn khi người dùng đang chạy ở chế độ Standalone PWA hoặc khi người dùng đã bấm tắt trong vòng 7 ngày qua `localStorage`.
  4. **Phase QA & Clean-up:**
     - Bộ test Vitest: **27/27 tests PASS (100%)**.
     - TypeScript Strict Typecheck: **0 errors** trên cả root và `ontap-web`.
     - Production Build (`npm run build`): Build thành công Vite (`ontap-web`) và Next.js (57 routes).
     - Bảo toàn tuyệt đối bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` 0 bytes diff.
     - Đã xóa sạch 2 nhánh cũ theo yêu cầu: `fix/console-cleanup` (local & remote origin) và `feature/phase-1-2-updates` (remote origin), đồng thời chạy `git fetch --prune`.
