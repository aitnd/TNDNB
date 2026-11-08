# 🧠 Tóm Tắt Ngữ Cảnh Hiện Tại (`recap_current.md`) — Cập nhật: 2026-11-08 (20:15)

- **Dự án:** TNDNB (`d:\Antigravity\TNDNB`) — Nhánh chính `main` (Commit mới nhất: `43aa9df6` sau khi merge từ `feat/mobile-exam-screen-and-resume-banner`).
- **Mục tiêu hoàn thành trong phiên làm việc:**
  1. **Kế hoạch 1 (`261107-0620-mobile-dashboard-simplification-and-error-audit`):**
     - Sửa React Hydration Mismatch bằng `dynamic(..., { ssr: false })` cho `FeaturedSlider`.
     - Mặc định chọn cả 2 checkbox đăng nhập, loại bỏ popup cảnh báo thiết bị đơn, ngăn tự động hỏi Geolocation.
     - Tối giản Mobile Dashboard, gom TopNavbar vào Hamburger Menu bên phải.
     - Tích hợp banner cài đặt PWA Add to Home Screen.
  2. **Kế hoạch 2 (`261107-0940-clean-console-and-guest-firestore-guard`):**
     - Thêm Guest Auth Guard `auth?.currentUser` vào `getUsageConfig()` và `getGitHubConfig()` trong `adminConfigService.ts`. Khách vãng lai bỏ qua Firestore (Zero-Noise Console).
  3. **Kế hoạch 3 (`261107-1035-remove-fake-stats-welcome-modal`):**
     - Xóa sạch cột phải "THÔNG SỐ HỆ THỐNG HỌC LIỆU" và khối 3 bullet points tính năng tự chế.
     - Tái cấu trúc `WelcomeModal.tsx` thành thẻ đơn trung tâm (`max-w-lg text-center`) với `HelmIcon3D`.
  4. **Kế hoạch 4 (`261107-1135-mobile-exam-screen-and-resume-banner`):**
     - Thực hiện 2 yêu cầu tối ưu trực quan qua ảnh chụp từ người dùng:
       * **Ảnh 1 (`media_1794025676890_6c2dd17b.png`)**: Màn hình làm bài thi trên Mobile (`ExamQuizScreen.tsx`): Ẩn 100% thông tin cá nhân (ảnh đại diện, SBD, ngày sinh, địa chỉ, lớp, bằng) bằng `flex md:hidden`, thay bằng thanh Mobile Exam Header siêu mỏng (~38px) gồm nút `[← Thoát]`, nhãn hạng bằng, `Câu X/Y` và đồng hồ đếm ngược `⏱️ MM:SS` (`font-mono tabular-nums`). Câu hỏi và 4 đáp án A, B, C, D hiển thị ngay tại First Fold (không cần cuộn). Màn hình Desktop (`hidden md:flex`) giữ nguyên vẹn 100%.
       * **Ảnh 2 (`media_1794025726962_36023bc9.png`)**: Nút vàng nhắc làm bài thi dở dang (`App.tsx`): Xóa triệt để nút nổi `fixed bottom-4 left-1/2` kèm `animate-bounce` che màn hình; thay bằng **Alert Banner thanh mảnh** đặt dưới Header trong luồng trang (`animate-fade-in`), có nút `[Làm tiếp ngay]` nhỏ gọn và nút **`[✕ Bỏ qua]`** (`setResumeSessionAvailable(false)`) giúp học viên chủ động ẩn thông báo khi muốn chọn bài khác mà không xóa mất dữ liệu `localStorage`.
     - Bộ test TDD: Bổ sung `TC-30` và `TC-31` vào `scripts/portal-console-and-tinymce-fix.test.ts`. Cập nhật `scripts/ontap-dual-theme-and-sidebar.test.ts`. Toàn bộ **54/54 tests PASS 100%**.
     - Đã hoàn tất `[Bước 07] /check-project` (54/54 tests PASS, 0 lỗi TypeScript, Next.js 57 routes & Vite build hoàn tất).
     - Đã thực hiện `[Bước 08] /finishing-a-development-branch`: Merge `--no-ff` vào `main`, kiểm thử lại trên `main` và đẩy lên GitHub `origin/main` (Commit `43aa9df6`).

- **Trạng thái Kiểm thử & Build:**
  - Toàn bộ 5 bộ test suites: **54/54 tests PASS (100%)** trong 297ms.
  - TypeScript Strict Typecheck: **0 errors** trên cả root và `ontap-web`.
  - Production Build: Build thành công Vite (`ontap-web`) trong 15.24s và Next.js Portal (57 routes static).
  - Git Branch: Đang ở trên nhánh `main`, working tree sạch 100%, đồng bộ tuyệt đối với `origin/main`.
