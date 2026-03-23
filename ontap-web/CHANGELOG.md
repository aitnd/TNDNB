# CHANGELOG — [ontap-web]

## [2026-03-22] - Research
- Nghiên cứu và phân tích cấu trúc component Quản lý Lớp học (`ClassDetailClient`).
- Lên kế hoạch nâng cấp tính năng gán học viên vào lớp.

## [3.9.1] - 2026-03-22 - Đồng bộ hóa Props và Type Error Fix

### Fixed
- **ClassDetailClient.tsx**: Sửa lỗi Type Error và đồng bộ hóa hệ thống Props (thay `classData` bằng `course`).
- **ClassManagementScreen.tsx**: Cập nhật logic render và truyền Props chính xác cho Chi tiết lớp học.
- **Sub-components**: Đồng bộ hóa `OverviewTab`, `StudentsTab`, `TeachersTab` theo chuẩn dữ liệu mới.

## [3.9.0] - 2026-03-18 - Lớp Học & Analytics

### 🚀 Features
- **Analytics**: Tích hợp Vercel Analytics để theo dõi Performance và Web Vitals.
- **Network**: Cấu hình Vite Proxy hỗ trợ gọi API Backend thông qua path `/api`.
- **Search**: Cập nhật thanh tìm kiếm Lớp học (Search bar) theo chuẩn thiết kế UI/UX Pro Max.

### 🐛 Bug Fixes
- **Search**: Sửa lỗi crash khi tìm kiếm thiết bị không có tên (`deviceName` null).
- **Admin**: Khắc phục lỗi render `AdminSessionList` khi danh sách session rỗng hoặc không hợp lệ.
- **Stability**: Thêm các kiểm tra null-check (Optional Chaining) cho các hợp phần sử dụng dữ liệu từ Firebase RTDB.

### 📝 Documentation
- Khởi tạo hệ thống tài liệu AI Agent trong `.brain/`.
- Cập nhật `CURRENT_SYSTEM_OVERVIEW.md` và `LEARNINGS.md`.
