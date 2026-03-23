# 🔍 Nhật ký điều tra lỗi - [2026-03-22]

## 📋 Mô tả hiện tượng
- URL: `localhost:3000/ontap/quanlylop`
- Console báo lỗi đỏ liên quan đến Firebase UID.
- Trang web có vẻ không hiển thị đúng nội dung (vùng đen lớn).

## 🕵️ Giả thuyết điều tra

### 🎯 Giả thuyết A (80% khả năng): Lỗi truy cập UID undefined
- **Hiện tượng:** `Uncaught TypeError: Cannot read properties of undefined (reading 'Xa1s...')`
- **Phân tích:** Code đang cố đọc `obj[uid]` nhưng `obj` này đang là `undefined`. 
- **Nghi vấn:** Có thể là `studentLatestResults[st.id]` hoặc `deviceCounts[st.id]` trong `StudentsTab.tsx`.

### 🎯 Giả thuyết B (15% khả năng): Lỗi cấu hình Analytics
- **Hiện tượng:** `/api/analytics` báo lỗi 500.
- **Nguyên nhân:** Thiếu `client_email` trong cấu hình Firebase Admin.

### 🎯 Giả thuyết C (5% khả năng): Lỗi phân quyền (RLS/Firestore Rules)
- **Hiện tượng:** `permission_denied at /status`

## 🛠️ Hành động tiếp theo
1. Kiểm tra file `StudentsTab.tsx` đoạn render danh sách học viên.
2. Kiểm tra file `.env` hoặc file cấu hình service account.
3. Kiểm tra logic phân quyền Firestore.
