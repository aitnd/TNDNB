# CHANGELOG — [ontap-win]

## [3.9.3] - 2026-06-11 - Security Protection & Dynamic Roles Config
- **Bảo mật đề thi động (App Win):** Đồng bộ tính năng bảo vệ đề thi khi làm bài/thi thử dựa trên thuộc tính cấu hình `preventCopy` động của từng vai trò từ Firestore. Khi được kích hoạt, ứng dụng sẽ chặn chuột phải, bôi đen, copy và phím tắt `Ctrl+C` / `Cmd+C` / `Ctrl+U`.
- **Realtime Security Policies:** Tự động lắng nghe cấu hình `settings/usage_config` từ Firestore theo thời gian thực để áp dụng ngay lập tức các chính sách bảo mật thay đổi bởi Admin.
- **Phân quyền cấu hình động:** 
  - Admin có toàn quyền chỉnh sửa giới hạn và chính sách bảo mật cho tất cả các vai trò.
  - Lãnh đạo (`lanh_dao`) chỉ được chỉnh sửa cấu hình các vai trò cấp dưới, vô hiệu hóa (Read-only) toàn bộ giao diện cấu hình của Admin.
- **Đồng bộ hóa Route:** Truyền `userProfile` prop vào `UsageConfigPanel` tại Route `/ontap/cauhinh` để xác thực phân quyền chính xác.

## [3.9.2] - 2026-03-29 - Hotfix & Auto-update Sync
- **Version Update**: Nâng cấp lên 3.9.2 để đồng bộ với GitHub Release.
- **Auto-update**: Fix lỗi nhận diện phiên bản trên Windows khi sử dụng tag có hậu tố chữ.
- **UI**: Cập nhật Modal Changelog tự động lấy dữ liệu từ file này.

## [3.9.1] - 2026-03-22 - Desktop Performance Fix
- Tối ưu hóa hiệu năng render danh sách lớp học trên ứng dụng máy tính.
- Sửa lỗi font chữ hiển thị không đều trên một số máy chạy Windows 10 cũ.

## [3.9.0] - 2026-03-18 - Native Integration
- Hỗ trợ phím tắt và thông báo hệ thống trên Windows.
- Tự động kiểm tra bản cập nhật mỗi khi khởi động app.
