━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT — DỰ ÁN TNDNB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Tối Giản Mobile Dashboard, TopNavbar Hamburger Menu, Error Audit & PWA Add-to-Home-Screen
🔢 Đến bước: Đã hoàn tất 100% Phase 01 đến Phase 03, QA 27/27 Tests PASS, Push lên Remote Branch & Dọn dẹp Nhánh Cũ.

✅ ĐÃ XONG:
- Khắc phục lỗi console Bitwarden & React Hydration Mismatch (#418, #425, #423) bằng dynamic import `FeaturedSlider` (`ssr: false`).
- Mặc định tích sẵn cả 2 ô "Ghi nhớ đăng nhập" và "Lưu tài khoản này" trong `LoginScreen.tsx`.
- Loại bỏ triệt để modal cảnh báo 1 thiết bị phiền hà khi đăng nhập (`authSessionService.ts`).
- Ngăn tự động hỏi quyền vị trí Geolocation khi mở app (`WeatherWidget.tsx`).
- Tối giản Mobile Dashboard: Đưa Thẻ học viên và nút "Vào Ôn Tập / Thi Thử" lên hàng đầu, ẩn các widget phụ trên màn hình nhỏ.
- Tối ưu TopNavbar: Gom Tài khoản và Đăng xuất vào Menu 3 gạch ở góc phải; role học viên trên mobile chỉ hiển thị đúng 4 nút: `[Ôn tập]`, `[Lớp của tôi]`, `[Chuông]` và `[Menu 3 gạch]`.
- Thêm Banner PWA Cài đặt ra Màn hình chính (`PwaInstallBanner.tsx`) chuẩn Web App Manifest, tự động ghi nhớ tắt 7 ngày, hướng dẫn iOS Safari.
- Xóa sạch 2 nhánh cũ: `fix/console-cleanup` (local & origin) và `feature/phase-1-2-updates` (origin), đồng thời prune git.
- Bảo toàn tuyệt đối bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` 0 bytes diff.
- Nghiệm thu QA: 27/27 Vitest tests PASS, TypeScript 0 lỗi, Production Build 100% thành công.
- Git: Branch `feat/mobile-dashboard-and-top-navbar-simplification`, PR https://github.com/aitnd/TNDNB/pull/new/feat/mobile-dashboard-and-top-navbar-simplification.

⏳ CÒN LẠI:
- Merge Pull Request vào nhánh `main` khi người dùng sẵn sàng triển khai chính thức.
- Triển khai Vercel Production sau khi merge.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- `ontap-web/components/ExamQuizScreen.tsx` giữ nguyên 100% (`git diff = 0`).
- Người dùng yêu cầu PWA chuẩn Add to Home Screen, tuyệt đối không dùng link tải APK.
- Không hỏi quyền vị trí tự động khi vào Dashboard; chỉ hỏi khi người dùng click vào Thời tiết.
- TopNavbar mobile cho học viên luôn khóa chặt ở 4 thành phần thiết yếu nhất.

📁 FILES QUAN TRỌNG:
- Kế hoạch: `docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md`
- Nhiệm vụ: `docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/task.md`
- Thiết kế: `docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/DESIGN.md`, `design-specs.md`
- Component PWA: `ontap-web/components/PwaInstallBanner.tsx`
- Component TopNavbar: `ontap-web/components/TopNavbar.tsx`
- Component Dashboard: `ontap-web/components/Dashboard.tsx`
- Bộ test TDD: `scripts/portal-console-and-tinymce-fix.test.ts`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
