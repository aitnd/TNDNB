# Kế Hoạch Cập Nhật Toàn Diện (File Upload, Theme Contrast & Mobile Icon)

Kế hoạch này giải quyết 3 yêu cầu cốt lõi nhằm nâng cao tính linh hoạt và trải nghiệm người dùng trên hệ thống:

1. **Sửa logic validate số lượng file upload**: Nới lỏng điều kiện kiểm tra, cho phép upload từ 3-7 file (hoặc không giới hạn, miễn là đúng định dạng `.exe`, `.yml`, `.blockmap`). Điều này giúp hỗ trợ build đa kiến trúc (x64, ia32).
2. **Đồng bộ tương phản UI trên 8 Theme**: Thay vì dùng màu cứng (`bg-gray-200`, `text-red-600`), hệ thống sẽ sử dụng các CSS Semantic Variables của Tailwind (như `bg-muted`, `text-foreground`, `text-destructive`, `bg-destructive/10`) cho giao diện Admin (UploadZone, UsageConfigPanel). Đảm bảo giao diện nổi bật, dễ nhìn trên mọi theme (light, dark, modern, classic, sunrise, tri-an, noel, premium).
3. **Cập nhật Web App Icon (PWA / Mobile)**: Thay thế icon của ứng dụng web khi người dùng "Add to Home screen" trên điện thoại bằng ảnh gốc từ thư mục `assets`.

## Phạm vi thay đổi
- **Upload Logic & UI**:
  - [MODIFY] `ontap-web/components/Admin/UploadZone.tsx`
  - [MODIFY] `ontap-web/components/UsageConfigPanel.tsx`
  - [MODIFY] `ontap-web/components/Admin/UploadStatus.tsx`
- **Mobile Web App (PWA)**:
  - [MODIFY] `ontap-web/public/icon-192.png`
  - [MODIFY] `ontap-web/public/icon-512.png`
  - [MODIFY] `ontap-web/index.html`

## Các giai đoạn (Phases)
- **Phase 1**: Sửa logic Validate số lượng file upload thành hỗ trợ 1 hoặc nhiều kiến trúc (tối đa 7 files).
- **Phase 2**: Sửa class Tailwind ở phần hiển thị file "Đã chọn" và "Thông báo lỗi" sang dạng dùng biến CSS Semantic (Theme-aware). Rà soát và test trên cả 8 themes.
- **Phase 3**: Generate lại Web App Icon (192x192, 512x512) để PWA nhận diện đúng ảnh nguồn khi cài trên điện thoại.

## User Review Required
- Logic mới sẽ kiểm tra xem các file được chọn có thuộc định dạng cho phép hay không và có chứa `.yml` hay không, thay vì đếm cứng "phải bằng 3".
- Khung hiển thị file đã chọn sẽ lấy màu nền `bg-muted` hoặc `bg-secondary` và chữ `text-foreground` để tự động thích ứng với nền sáng/tối của cả 8 theme.
