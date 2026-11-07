━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT — DỰ ÁN TNDNB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đang làm: Tối Giản Mobile Dashboard, PWA Banner & Zero-Noise Console cho Khách Vãng Lai
🔢 Đến bước: Hoàn thành 100% cả 2 kế hoạch (`261107-0620` và `261107-0940`), QA 29/29 Tests PASS, Đẩy Git Remote PR.

✅ ĐÃ XONG:
- Giải quyết dứt điểm React Hydration Mismatch (`#418, #425, #423`) bằng dynamic import `FeaturedSlider` (`ssr: false`).
- Mặc định tích sẵn cả 2 ô "Ghi nhớ đăng nhập" và "Lưu tài khoản này" trong `LoginScreen.tsx`.
- Loại bỏ modal cảnh báo single-device phiền hà khi đăng nhập (`authSessionService.ts`).
- Ngăn tự động hỏi quyền vị trí Geolocation khi mount `WeatherWidget.tsx`.
- Tối giản Mobile Dashboard: Đưa Thẻ học viên và nút "Vào Ôn Tập / Thi Thử" lên hàng đầu (1 chạm vào thi), ẩn các widget phụ trên mobile (`hidden lg:block`).
- Tối ưu TopNavbar: Gom Tài khoản và Đăng xuất vào Menu 3 gạch ở góc phải; role học viên mobile khóa chặt 4 nút: `[Ôn tập]`, `[Lớp của tôi]`, `[Chuông]` và `[Menu 3 gạch]`.
- Thêm Banner PWA Cài đặt ra Màn hình chính (`PwaInstallBanner.tsx`) chuẩn Web Manifest, iOS guide, auto-hide trên standalone app.
- Xóa sạch 2 nhánh cũ: `fix/console-cleanup` và `feature/phase-1-2-updates`, kèm `git fetch --prune`.
- Phân tích DevTools Console trang thi thử: làm rõ lỗi Bitwarden và `200.js` là từ extension của máy khách; uBlock chặn analytics.
- Bổ sung Guest Auth Guard `auth?.currentUser` vào `getUsageConfig()` và `getGitHubConfig()` trong `adminConfigService.ts`, triệt tiêu cảnh báo vàng Firestore `Missing or insufficient permissions` cho khách vãng lai (Zero-Noise Console).
- Mở rộng bộ test TDD: thêm `TC-28` và `TC-29` (đạt 29/29 tests PASS 100%).
- Nghiệm thu: 0 lỗi TypeScript, Production build thành công cả Vite và Next.js (57 routes).
- Bảo toàn tuyệt đối bất biến Invariant 1: `ontap-web/components/ExamQuizScreen.tsx` 0 bytes diff.
- Git: Commit `9d06d0a7` trên nhánh `feat/mobile-dashboard-and-top-navbar-simplification`, PR https://github.com/aitnd/TNDNB/pull/new/feat/mobile-dashboard-and-top-navbar-simplification.

⏳ CÒN LẠI:
- Merge Pull Request vào nhánh `main` khi quản trị viên phê duyệt trên GitHub.
- Vercel tự động build & deploy lên production khi nhánh `main` nhận commit mới.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
- `ontap-web/components/ExamQuizScreen.tsx` giữ nguyên 100% (`git diff = 0`).
- Người dùng yêu cầu chuẩn PWA Add to Home Screen, không dùng file APK.
- Khách vãng lai thi thử không được gửi request đọc Firestore `settings`, nạp trực tiếp từ `localStorage`/default để tối ưu 0ms và giữ console sạch bóng.

📁 FILES QUAN TRỌNG:
- Kế hoạch 1: `docs/plans/261107-0620-mobile-dashboard-simplification-and-error-audit/plan.md`
- Kế hoạch 2: `docs/plans/261107-0940-clean-console-and-guest-firestore-guard/plan.md`
- Component PWA: `ontap-web/components/PwaInstallBanner.tsx`
- Component TopNavbar: `ontap-web/components/TopNavbar.tsx`
- Cấu hình Service: `ontap-web/services/adminConfigService.ts`
- Bộ test TDD: `scripts/portal-console-and-tinymce-fix.test.ts`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
