# Danh sách công việc (Task List)

## Phase 1: Mở rộng logic Upload files
- [x] Mở file [UploadZone.tsx](file:///D:/Antigravity/TNDNB/ontap-web/components/Admin/UploadZone.tsx)
- [x] Tìm logic kiểm tra `acceptedFiles.length === 3`
- [x] Sửa lại thành logic kiểm tra có chứa file `.yml` và chỉ chấp nhận `.exe`, `.blockmap`, `.yml` (tối đa không giới hạn, hoặc ví dụ 7 files).
- [x] Cập nhật text báo lỗi "Bắt buộc phải chọn đúng 3 file..." thành "Bắt buộc phải chọn file .yml và các file .exe, .blockmap tương ứng."

## Phase 2: Sửa Contrast UI (Theme-aware)
- [x] Mở file [UploadZone.tsx](file:///D:/Antigravity/TNDNB/ontap-web/components/Admin/UploadZone.tsx) và [UsageConfigPanel.tsx](file:///D:/Antigravity/TNDNB/ontap-web/components/UsageConfigPanel.tsx)
- [x] Tìm danh sách file "Đã chọn". Đổi background từ `bg-gray-100/200` sang `bg-muted` hoặc `bg-secondary`. Đổi text sang `text-foreground`.
- [x] Tìm modal lỗi / banner lỗi (như trong ảnh). Đổi nền thành `bg-destructive/10` và chữ thành `text-destructive`. 
- [x] Rà soát và loại bỏ các class dark mode dư thừa (như `dark:bg-gray-800`) vì biến CSS semantic đã tự lo việc đó.
- [x] Test trực quan bằng cách bật server và chuyển đổi thủ công qua cả 8 theme (light, dark, modern, classic, sunrise, tri-an, noel, premium) để đảm bảo độ tương phản.

## Phase 3: Cập nhật Web App Icon (PWA / Mobile Browser)
- [x] Mở file `ontap-web/index.html`, thay đổi link favicon nội trú (không dùng CDN ngoài).
- [x] Viết script Python (PIL) resize file `D:\Antigravity\TNDNB\assets\icon.png` thành `icon-192.png` và `icon-512.png`.
- [x] Ghi đè các file này vào thư mục `ontap-web/public/`.
- [x] Xác nhận ảnh icon mới sẽ hiện trên Mobile khi người dùng chọn "Add to Home Screen".
