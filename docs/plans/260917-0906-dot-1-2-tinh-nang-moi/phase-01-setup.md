# Phase 01: Setup & Initialization

**Mục tiêu:** Chuẩn bị môi trường, tạo branch làm việc và review lại kiến trúc hiện tại để sẵn sàng cho việc code.

## Checklist

- [ ] **Bước 1: Khởi tạo branch mới**
  - Đảm bảo đang ở nhánh `main` (hoặc nhánh development chính).
  - Pull code mới nhất.
  - Tạo branch: `git checkout -b feature/phase-1-2-updates`.

- [ ] **Bước 2: Review Code & Dependencies**
  - Kiểm tra trạng thái build hiện tại (root chạy `npm run dev`; `cd ontap-win` rồi chạy `npm run electron` — script electron chỉ có ở ontap-win).
  - Review các file logic sẽ bị ảnh hưởng (utils chấm điểm, hooks của thi thử, kết quả thi).
  - Đảm bảo các thư viện UI (Chart, Icon...) đã có đủ hoặc thêm nếu cần (Chart.js / Recharts để vẽ biểu đồ).
  - Chuẩn bị tài nguyên (icon, manifest) cho PWA (Feature 12).

- [ ] **Bước 3: Chuẩn bị Supabase / Local Storage**
  - Đảm bảo schema của bảng lưu kết quả học tập ở Supabase không cần thay đổi.
  - Xem xét cơ chế lưu cài đặt (nhắc học, phím tắt) trên Local Storage hoặc IndexedDB.
