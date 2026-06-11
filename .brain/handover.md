━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Phân tách cấu hình vai trò & Triển khai v3.9.6
🔢 Đến bước: Đóng gói và phát hành thành công v3.9.6 (Web & Win Setup).

✅ ĐÃ XONG:
   - Phân tách cấu hình vai trò Ban Lãnh Đạo (leader) và Quản Lý (manager) độc lập trong Firestore và UI panel config ✓
   - Đồng bộ hóa logic check quyền `getRoleConfigKey` trên toàn hệ thống (Web, Win, Next.js Portal đăng bài) ✓
   - Sửa lỗi TypeScript cho file test và chạy Vitest pass 100% (5/5 cases) trên cả 2 bản ✓
   - Cập nhật CHANGELOG.md và nâng version lên v3.9.6 trong package.json ✓
   - Build thành công bản Web (Vite output vào public/ontap) ✓
   - Build và đóng gói thành công setup exe Windows: `Onthi-3.9.6-Setup.exe` ✓

⏳ CÒN LẠI:
   - Người dùng thực hiện `git push` để đẩy code lên GitHub và trigger Vercel deploy Web.
   - Kiểm tra, nghiệm thu thực tế trên môi trường thật (xác minh phân quyền Lãnh đạo hoạt động độc lập với Quản lý).

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Ánh xạ vai trò `lanh_dao` sang thuộc tính cấu hình `leader` trong Firestore, giải quyết vấn đề cấu hình dùng chung của Quản lý và Lãnh đạo trước đây.

⚠️ LƯU Ý CHO SESSION SAU:
   - Bản Windows setup exe được lưu trữ tại `ontap-win/release/Onthi-3.9.6-Setup.exe`.
   - Cần chạy git push để Vercel deploy các thay đổi mới nhất của bản Web và Next.js Portal.

📁 FILES QUAN TRỌNG:
   - ontap-win/services/adminConfigService.ts
   - ontap-web/services/adminConfigService.ts
   - ontap-win/components/UsageConfigPanel.tsx
   - ontap-web/components/UsageConfigPanel.tsx
   - .brain/session.json (Tiến độ chi tiết)
   - CHANGELOG.md (Lịch sử thay đổi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
