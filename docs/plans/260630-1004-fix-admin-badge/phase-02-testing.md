# Phase 02: Verification & Testing
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Xác thực lỗi đã được giải quyết triệt để trên cả hai nền tảng web local và xác nhận không có hồi quy (regression).

## Implementation Steps
1. [ ] Chạy dev server: `npm run dev` tại thư mục root.
2. [ ] Truy cập `http://localhost:3001` (Portal chính) và `/ontap/dashboard`.
3. [ ] Kiểm tra xem Huy hiệu đặc quyền màu tím/đỏ/cam dạng hình tròn 👑/🦅/🛡️ có hiển thị đúng bên cạnh tên của tài khoản trên:
   - Thẻ Giáo viên/Học viên ở giữa màn hình.
   - Thần góc phải phía trên của Header TopNavbar.
   - Trang cá nhân `/ontap/profile`.
4. [ ] Verify bằng mắt và kiểm tra console log xem có lỗi phát sinh không.

## Test Criteria
- Huy hiệu Admin hiển thị đúng, chạy hiệu ứng lấp lánh (box shadow pulsing) mượt mà.
