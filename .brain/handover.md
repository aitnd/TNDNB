━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Bảo mật & Bảo trì Hệ thống Ôn tập (TNDNB)
🔢 Đến bước: Hoàn thành triển khai và kiểm thử tính năng bảo mật.

✅ ĐÃ XONG:
   - Sửa lỗi import icon 'Award' trong TopNavbar.tsx (Khắc phục lỗi Màn hình trắng) ✓
   - Vô hiệu hóa DevTools (F12) trong main.cjs và ẩn nút toggle trong App.tsx ✓
   - Sửa nội dung các câu hỏi bị sai đáp án trong questions_db.json ✓
   - Khóa chuột phải (contextmenu) trên App Win: Khóa toàn cục cho mọi user trừ Admin ✓
   - Khóa chuột phải (contextmenu) trên Web: Khóa chọn lọc tại 4 màn hình thi/làm bài (`/lambai`, `/thithu`) trừ Admin ✓

⏳ CÒN LẠI:
   - Build và deploy các phiên bản mới của App Win (Electron) và Web lên production.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Chặn Console/DevTools và chuột phải (contextmenu) trên cả App Win và Web đối với tài khoản thường/chưa đăng nhập nhằm tăng bảo mật chống gian lận và rò rỉ dữ liệu.
   - Cho phép tài khoản role 'admin' bỏ qua khóa chuột phải để thuận tiện cho việc kiểm tra, debug.

⚠️ LƯU Ý CHO SESSION SAU:
   - Cần chạy build (npm run build) cho cả `ontap-win/` và `ontap-web/` để cập nhật các tính năng bảo mật mới.

📁 FILES QUAN TRỌNG:
   - ontap-win/App.tsx (Khóa chuột phải App Win)
   - ontap-web/App.tsx (Khóa chuột phải Web)
   - .brain/session.json (Tiến độ chi tiết)
   - CHANGELOG.md (Lịch sử thay đổi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
