# Changelog

## [3.9.1] - 2026-03-22 - Đồng bộ hóa Props và Type Error Fix

### Fixed
- **ClassDetailClient.tsx**: Sửa lỗi Type Error và đồng bộ hóa hệ thống Props (thay `classData` bằng `course`).
- **ClassManagementScreen.tsx**: Cập nhật logic render và truyền Props chính xác cho Chi tiết lớp học.
- **Sub-components**: Đồng bộ hóa `OverviewTab`, `StudentsTab`, `TeachersTab` theo chuẩn dữ liệu mới.

## [3.9.0] - Lớp Học - Cập nhật thanh tìm kiếm (Desktop)

### Added
- **ClassManagementScreen.tsx**: Thêm giao diện thanh tìm kiếm Lớp học (Search bar) theo chuẩn thiết kế UI/UX Pro Max cho ứng dụng Desktop.
- Cập nhật state list courses để hỗ trợ tính năng lọc (filter) offline theo Tên lớp và Mô tả nhằm tăng tốc độ thao tác cho Admin/Giáo viên trên máy tính.

### Changed
- Thay đổi layout header của trang Quản lý Lớp học tương đồng với bản Web, tích hợp thanh tìm kiếm hiện đại.

