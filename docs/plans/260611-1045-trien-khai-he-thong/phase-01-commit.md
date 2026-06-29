# Phase 01: Commit & Cập nhật Changelog
Status: ✅ Complete
Dependencies: None

## Objective
Lưu trữ toàn bộ thay đổi phân tách vai trò "Ban Lãnh Đạo" (leader) và "Quản Lý" (manager) vào Git, đồng thời cập nhật CHANGELOG trên cả 2 phiên bản Web và Win để phản ánh chính xác các tính năng mới của v3.9.6.

## Requirements
- Cập nhật CHANGELOG cho `ontap-web` và `ontap-win`.
- Stage toàn bộ các file thay đổi (sử dụng `git add`).
- Thực hiện commit với thông điệp chuẩn mực.

## Implementation Steps
1. [ ] Cập nhật `ontap-web/CHANGELOG.md` thêm thông tin v3.9.6.
2. [ ] Cập nhật `ontap-win/CHANGELOG.md` thêm thông tin v3.9.6.
3. [ ] Chạy `git add .` để thêm toàn bộ file chỉnh sửa.
4. [ ] Thực hiện `git commit -m "feat: split leader and manager role configs in admin panel and nextjs portal v3.9.6"`.

## Files to Create/Modify
- `ontap-web/CHANGELOG.md` - [Modify]
- `ontap-win/CHANGELOG.md` - [Modify]

## Test Criteria
- `git status` sạch sẽ, không còn file chưa commit.
- Lịch sử Git ghi nhận commit mới của v3.9.6.

---
Next Phase: [phase-02-deploy-web.md](file:///d:/Antigravity/TNDNB/docs/plans/260611-1045-trien-khai-he-thong/phase-02-deploy-web.md)
