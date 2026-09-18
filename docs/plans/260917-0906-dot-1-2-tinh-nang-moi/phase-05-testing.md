# Phase 05: Testing & Release

**Mục tiêu:** Kiểm thử toàn diện ứng dụng trên mọi nền tảng và đóng gói phiên bản mới phát hành tới người dùng.

## Checklist

- [ ] **Bước 1: Web Testing**
  - Test luồng tính năng học, thi thử.
  - Kiểm tra sửa lỗi "KHÔNG ĐẠT" và hiển thị tên (Bug 1, 2).
  - Test tính năng mới: Luyện câu sai, biểu đồ thống kê, tìm kiếm, phím tắt.
  - Test PWA (Feature 12): Cài đặt ứng dụng trên trình duyệt, nhận Local Notification nhắc học khi app đang mở.

- [ ] **Bước 2: Win Testing (Electron)**
  - Test các tính năng tương tự Web trên môi trường Desktop.
  - Test tính năng System Tray (Feature 15), ẩn app thay vì thoát.
  - Test Global Shortcut (Feature 16) bật app lên.
  - Test Background Update JSON (Feature 17) khi có version Supabase mới.
  - Test Fullscreen mode (Feature 19).

- [ ] **Bước 3: Build & Release**
  - Build release bản Web (`cd ontap-web && npm run build` — chạy trong thư mục web, KHÔNG dùng lệnh root).
  - Build release bản Windows `.exe` (`cd ontap-win && npm run electron:build:x64`).
  - Cập nhật tài liệu Release Notes.

- [ ] **Bước 4: Kế hoạch Rollback**
  - Web: Lưu build cũ, nếu có lỗi PWA thì deploy lại build cũ lên Firebase Hosting/Vercel.
  - Win: Báo user giữ lại bản cài (installer) `.exe` cũ. Nếu bản mới crash IPC hoặc LocalStorage, gửi lại link bản cài trước đó.
