# Phase 02: Khôi phục Reset Pass & Tắt Offline
Status: ⬜ Pending
Dependencies: phase-01

## Objective
Gắn lạị hai nút Chìa Khóa (Reset Password) và nút Cột Sóng (Chặn thi Offline) trên danh sách hiển thị cá nhân.

## Requirements
### Functional
- [ ] Thêm nút chìa khoá `FaKey` kèm chức năng confirm đổi mật khẩu. Gọi hàm Firebase Cloud Function, hoặc Auth Firebase reset theo logic cũ (thường là qua backend function). Cần kiểm tra code logic của `ClassDetail.tsx` cũ.
- [ ] Thêm nút cột sóng `FaWifi` và/hoặc `TbPlaneOff` liên kết với state của thuộc tính `offlineAccess`.

### Non-Functional
- [ ] Thiết kế nút ở dạng hover chỉ hiện khi rê chuột tới hàng (y như thao tác Lịch sử/Sửa/Gỡ). Màu sắc tuỳ biến.

## Implementation Steps
1. Khôi phục logic `handleResetPassword` từ code gốc `ClassDetail.tsx`.
2. Khôi phục logic `toggleOfflineAccess` từ code gốc `ClassDetail.tsx`.
3. Nhúng giao diện vào grid và table cho mỗi dòng `paginatedStudents`.

---
Next Phase: `phase-03-sync.md`
