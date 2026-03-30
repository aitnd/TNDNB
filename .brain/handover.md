━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Sửa lỗi Ứng dụng Ôn tập Windows & Bảo trì dữ liệu
🔢 Đến bước: Đã sửa xong lỗi Crash (White screen) & Đang chờ thông tin câu hỏi sai.

✅ ĐÃ XONG:
   - Sửa lỗi import icon 'Award' trong TopNavbar.tsx (Khắc phục lỗi Màn hình trắng). ✓
   - Vô hiệu hóa DevTools (F12) trong main.cjs và ẩn nút toggle trong App.tsx. ✓
   - Xác định file dữ liệu câu hỏi: ontap-win/data/questions_db.json. ✓
   - Chạy Build thành công (npm run build) để xác minh code không còn lỗi runtime. ✓

⏳ CÒN LẠI:
   - Task 1: Sửa nội dung câu hỏi bị sai đáp án (Chờ user cung cấp text/ID).
   - Task 2: Cân nhắc vô hiệu hóa chuột phải (Inspect Element) để bảo vệ dữ liệu triệt để hơn.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Tắt Console/DevTools trên bản build để tránh người dùng can thiệp vào mã nguồn hoặc dữ liệu thi.
   - Sử dụng JSON local cho dữ liệu câu hỏi thay vì fetch Firestore liên tục để tối ưu tốc độ offline.

⚠️ LƯU Ý CHO SESSION SAU:
   - File questions_db.json rất lớn (43k+ dòng), nên dùng keyword để tìm câu hỏi cụ thể thay vì đọc file.
   - Cần nhắc user Rebuild (npm run build hoặc npm run electron:build) để cập nhật các thay đổi UI mới nhất.

📁 FILES QUAN TRỌNG:
   - ontap-win/data/questions_db.json (Dữ liệu quan trọng nhất hiện tại)
   - .brain/session.json (Tiến độ chi tiết)
   - CHANGELOG.md (Lịch sử thay đổi)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
