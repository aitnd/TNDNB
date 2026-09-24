# Kế Hoạch Sửa Lỗi Giao Diện Màu Chữ & Màu Nền (Contrast Fix)

## Bối cảnh
Người dùng phản ánh tình trạng giao diện màu chữ và màu nền không nổi bật ở một số theme (đặc biệt là Dark Mode), gây khó khăn khi sử dụng. Cụ thể là tại component `UsageConfigPanel.tsx` (phần upload release), danh sách file "Đã chọn" và phần hiển thị thông báo lỗi "Có lỗi xảy ra khi phát hành" không đạt đủ độ tương phản.

## Mục tiêu
- Cải thiện độ tương phản (contrast) giữa màu chữ và màu nền trên các thành phần UI ở màn hình Upload Release.
- Tích hợp đúng chuẩn Tailwind classes cho cả chế độ sáng (Light Mode) và tối (Dark Mode).

## Phạm vi công việc
- Component `ontap-web/components/UsageConfigPanel.tsx`: Cập nhật class CSS cho danh sách file "Đã chọn".
- Component `ontap-web/components/Admin/UploadStatus.tsx`: Điều chỉnh lại class CSS cho phần hiển thị lỗi để tăng độ nhận diện (đổi sang `text-red-600 dark:text-red-400` để đảm bảo contrast trên nền `bg-red-100 dark:bg-red-900/30`).

## Cấu trúc Kế hoạch
- **Phase 1 (Hiện tại):** Điều chỉnh Tailwind class tại component `UsageConfigPanel.tsx` và `UploadStatus.tsx`.
