# Phase 5: Kiểm Thử Toàn Diện & Nghiệm Thu Chất Lượng

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](../../../docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [task.md](../../../docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🟢 **Normal**

---

## 1. Mục Tiêu & Giá Trị Mang Lại
- Xác nhận không có lỗi kiểu tĩnh TypeScript (Typecheck pass).
- Xác nhận bản build production thành công, không gặp lỗi cấu hình Vite/Tailwind.
- Xác nhận runtime trên môi trường production (preview) không bị rớt mạng hay lỗi logic.

---

## 2. Các Bước Thực Hiện (TDD Bite-Sized Tasks)

### Task 5.1: Kiểm tra lỗi kiểu tĩnh với TypeScript
**1. Verify:** Chạy 
px tsc --noEmit trên cả ontap-web và ontap-win.
**2. Implement:** Sửa lỗi nếu có (hiện tại đã xử lý sạch sẽ ở các phase trước).
**3. Verify PASS:** Tiến trình kết thúc với mã 0.

### Task 5.2: Đóng gói kiểm tra bản dựng Production
**1. Verify:** Chạy 
pm run build trên ontap-web.
**2. Implement:** Xác nhận CSS chunk có dung lượng hợp lý (đã bundle Tailwind).
**3. Verify PASS:** Build successful.

### Task 5.3: Kiểm thử runtime trên trình duyệt với DevTools
**1. Verify:** Chạy 
pm run preview. Mở trình duyệt ẩn danh.
**2. Implement:**
- Bật Network throttling (Slow 3G) -> Load trang -> Xem TopNavbar hiển thị ... mượt mà, không bị sập.
- Không đăng nhập (Guest) -> Xem Console -> Không còn lỗi \PERMISSION_DENIED\.
**3. Verify PASS:** UI không vỡ, Console sạch sẽ.

### Task 5.4: Cập nhật tài liệu & Evidence
**1. Implement:**
- Lưu lại log build và test vào \uild_report.md\.
- Đánh dấu hoàn thành toàn bộ \	ask.md\.
