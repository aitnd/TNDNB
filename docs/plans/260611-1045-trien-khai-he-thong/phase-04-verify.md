# Phase 04: Xác minh trên Production
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Xác minh thực tế các tính năng phân tách vai trò "Ban Lãnh Đạo" (leader) và "Quản Lý" (manager) trên môi trường production sau khi deploy thành công.

## Requirements
- Kiểm tra tính nhất quán dữ liệu Firestore.
- Kiểm tra giao diện cấu hình UsageConfigPanel trên Web & Win production.
- Đăng nhập bằng tài khoản Lãnh đạo (`lanh_dao`) và Quản lý (`quan_ly`) trên môi trường thật để kiểm tra phân quyền.

## Implementation Steps
1. [ ] Đăng nhập tài khoản Admin -> Vào trang Cấu hình hệ thống -> Đảm bảo có tab "Ban Lãnh Đạo" mới.
2. [ ] Thay đổi giới hạn/quyền của "Ban Lãnh Đạo" và lưu lại. Check Firestore để xem key `leader` đã được tạo và lưu đúng chưa.
3. [ ] Đăng nhập bằng tài khoản có vai trò Lãnh đạo -> Đảm bảo các quyền hạn được áp dụng theo đúng tab cấu hình "Ban Lãnh Đạo".
4. [ ] Đăng nhập bằng tài khoản có vai trò Quản lý -> Đảm bảo các quyền hạn được áp dụng theo đúng tab cấu hình "Cán Bộ Quản Lý" (manager).

## Test Criteria
- Cấu hình của Lãnh đạo và Quản lý hoạt động hoàn toàn độc lập với nhau.
- Không phát sinh lỗi phân quyền hay lỗi giao diện trên bản production.
