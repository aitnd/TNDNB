<<<<<<< HEAD
# CHANGELOG — [ontap-web]

## [Unreleased] - 2026-03-18

### 🚀 Features
- **Analytics**: Tích hợp Vercel Analytics để theo dõi Performance và Web Vitals.
- **Network**: Cấu hình Vite Proxy hỗ trợ gọi API Backend thông qua path `/api`.

### 🐛 Bug Fixes
- **Search**: Sửa lỗi crash khi tìm kiếm thiết bị không có tên (`deviceName` null).
- **Admin**: Khắc phục lỗi render `AdminSessionList` khi danh sách session rỗng hoặc không hợp lệ.
- **Stability**: Thêm các kiểm tra null-check (Optional Chaining) cho các hợp phần sử dụng dữ liệu từ Firebase RTDB.

### 📝 Documentation
- Khởi tạo hệ thống tài liệu AI Agent trong `.brain/`.
- Cập nhật `CURRENT_SYSTEM_OVERVIEW.md` và `LEARNINGS.md`.
=======
# Changelog

## [3.9.0] - Lớp Học - Cập nhật thanh tìm kiếm

### Added
- **ClassManagementScreen.tsx**: Thêm giao diện thanh tìm kiếm Lớp học (Search bar) theo chuẩn thiết kế UI/UX Pro Max.
- Cập nhật state list courses để hỗ trợ tính năng lọc (filter) offline theo Tên lớp và Mô tả nhằm tăng tốc độ thao tác người dùng.

### Changed
- Refactor layout header của trang Quản lý Lớp học để bố trí nút Back và thanh tìm kiếm hợp lý.

>>>>>>> e2013370c468c50e8343c8e1201d3c9cdb4d498a
