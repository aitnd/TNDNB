━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 HANDOVER DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Đang làm: Quản lý Lớp học - Tính năng Gán học viên
🔢 Đến bước: Research Phase (Hoàn thành phân tích component)

✅ ĐÃ XONG:
   - Tìm thấy các file core của tính năng Class Management ✓
   - Hiểu logic gán học viên hiện tại (qua Firebase updateDoc: courseId, courseName) ✓
   - Phân tích xong component `AddStudentModal.tsx` và `StudentsTab.tsx` ✓

⏳ CÒN LẠI:
   - Task 1: Thiết kế lại UI cho `AddStudentModal` để hỗ trợ chọn nhiều học viên (Checkbox).
   - Task 2: Implement logic cập nhật hàng loạt (Firestore transaction hoặc batch write).
   - Task 3: Test lại khả năng cập nhật real-time trên `StudentsTab`.

🔧 QUYẾT ĐỊNH QUAN TRỌNG:
   - Sẽ cải tiến `AddStudentModal` thay vì tạo modal mới để tận dụng logic search hiện có.
   - Dùng Framer Motion để tạo hiệu ứng mượt mà khi gán học viên.

⚠️ LƯU Ý CHO SESSION SAU:
   - File `components/ClassDetail/AddStudentModal.tsx` cần được sửa lại phần `handleAddStudent`.
   - Cần kiểm tra xem có cần update `studentCount` trong collection `courses` không (tốt nhất là auto-calc).

📁 FILES QUAN TRỌNG:
   - `components/ClassDetail/ClassDetailClient.tsx`
   - `components/ClassDetail/AddStudentModal.tsx`
   - `components/ClassDetail/StudentsTab.tsx`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Đã lưu! Để tiếp tục: Gõ /recap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
