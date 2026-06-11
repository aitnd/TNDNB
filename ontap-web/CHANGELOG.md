# CHANGELOG — [ontap-web]

## [3.9.3] - 2026-06-11 - Security Protection & Dynamic Roles Config
- **Bảo mật đề thi động:** Triển khai tính năng cấm chuột phải, bôi đen, copy và phím tắt (`Ctrl+C`, `Cmd+C`, `Ctrl+U`) trong các màn hình thi/làm bài (`/ontap/lambai`, `/ontap/thithu`, `/ontap/giamkhao/lambai`, `/ontap/giamkhao/thithu`) dựa trên thuộc tính cấu hình `preventCopy` động của từng vai trò từ database.
- **Realtime Security Policies:** Lắng nghe cấu hình bảo mật `settings/usage_config` theo thời gian thực bằng `onSnapshot` để thay đổi chính sách bảo mật ngay lập tức khi Admin điều chỉnh cấu hình mà không cần reload ứng dụng.
- **Phân quyền cấu hình động:** 
  - Admin có toàn quyền chỉnh sửa giới hạn và chính sách bảo mật cho tất cả các vai trò.
  - Lãnh đạo (`lanh_dao`) có quyền sửa cho các vai trò cấp dưới, riêng tab cấu hình của Admin sẽ hiển thị ở dạng Chỉ đọc (Read-only), ngăn cản Lãnh đạo can thiệp vào vai trò Quản trị viên tối cao.
- **Đồng bộ hóa Route:** Truyền `userProfile` prop vào `UsageConfigPanel` tại Route `/ontap/cauhinh` để xác thực phân quyền chính xác.

## [3.9.2] - 2026-03-29 - Premium Native Experience
- **UI/UX Native Overhaul**: Thiết kế lại toàn bộ giao diện theo phong cách Native Mobile cao cấp (Premium Cards, 3D icons, Apple-style spacing).
- **Haptic Feedback**: Tích hợp rung phản hồi (Vibration) cho mọi tương tác (Bấm nút, nộp bài, kết quả thi).
- **Mobile Navigation**: Thanh điều hướng dưới chân màn hình (Bottom Bar) chuẩn Mobile UI.
- **Enhanced Quiz Engine**: Tách biệt rõ ràng chế độ "Ôn tập" và "Thi thử mô phỏng" với bộ phím điều hướng tối ưu cho ngón cái.
- **Premium Animations**: Hệ thống chuyển cảnh mượt mà (Slide-up, Scale-up, Float) tối ưu cho cảm giác Native App.
- **Bug Fixes**: Sửa lỗi so sánh phiên bản và đồng bộ Electron-updater.

## [3.9.1] - 2026-03-22 - Đồng bộ hóa Props và Type Error Fix
- **ClassDetailClient.tsx**: Sửa lỗi Type Error và đồng bộ hóa hệ thống Props (thay `classData` bằng `course`).

## [3.9.0] - 2026-03-18 - Lớp Học & Analytics
- **Analytics**: Tích hợp Vercel Analytics để theo dõi Performance.
- **Search**: Cập nhật thanh tìm kiếm Lớp học (Search bar) UI/UX Pro Max.

## [3.8.12] - 2026-01-18 - Nâng cấp giao diện Thẻ
- **UI**: Thiết kế lại Thẻ Học viên/Giáo viên phong cách Premium Hologram v2.2.
- **Fix**: Sửa lỗi chính tả "THÈ" thành "THẺ" trên toàn hệ thống.

## [3.8.11] - 2026-01-18 - Góc giải trí VIP
- **Feature**: Thêm "Góc Giải Trí" với kho trò chơi HTML5 (Contra, Đào Vàng...).
