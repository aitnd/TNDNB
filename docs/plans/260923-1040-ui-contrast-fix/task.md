# Danh sách tác vụ

## Task 1: Sửa lỗi contrast phần danh sách file "Đã chọn"
- **File:** `ontap-web/components/UsageConfigPanel.tsx`
- **Vị trí:** Khối JSX hiển thị `selectedFiles` (thẻ `h5` "Đã chọn:" và thẻ `ul` chứa danh sách).
- **Chi tiết thay đổi:**
  - Cập nhật thẻ `<h5>` "Đã chọn:" thêm class `text-gray-800 dark:text-gray-200`.
  - Cập nhật thẻ `<ul>` hoặc các thẻ `<li>` thêm class `text-gray-800 dark:text-gray-200` để chữ dễ đọc hơn trên nền `bg-gray-50 dark:bg-slate-700/50`.

## Task 2: Sửa lỗi contrast phần hiển thị lỗi "Có lỗi xảy ra khi phát hành"
- **File:** `ontap-web/components/Admin/UploadStatus.tsx`
- **Vị trí:** Khối điều kiện `if (error)` trả về giao diện hiển thị thông báo lỗi.
- **Chi tiết thay đổi:**
  - Cập nhật màu chữ thành `text-red-600 dark:text-red-400` (thay vì text-red-700/300) để đảm bảo độ tương phản trên class nền hiện có `bg-red-100 dark:bg-red-900/30`.
