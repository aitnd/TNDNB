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
