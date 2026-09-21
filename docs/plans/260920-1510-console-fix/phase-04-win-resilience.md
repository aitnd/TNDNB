# Phase 4: Sửa lỗi hiển thị và bọc lỗi trên bản Electron (Win)

## Mục tiêu
- Kế thừa component ErrorBoundary từ web sang Win để bọc lỗi UI.
- Sửa lỗi runtime của AlertMarquee khi Firestore chặn quyền.
- Dọn dẹp cảnh báo log trong Electron Main & Preload process.
- Khắc phục lỗi hiển thị phiên bản .0.0 trong bản Win.

## Các bước thực hiện (TDD Steps)

1. **Copy ErrorBoundary từ web sang win và bọc vào App.tsx**
   - Đảm bảo ontap-win/components/ErrorBoundary.tsx tồn tại hoặc được tái sử dụng/sao chép từ web.
   - Import vào ontap-win/App.tsx.
   - Bọc TopNavbar và AlertMarquee bằng <ErrorBoundary> giống như cách đã làm trên web.

2. **Thêm try/catch và error callback cho AlertMarquee của bản win**
   - Mở ontap-win/components/AlertMarquee.tsx.
   - Bọc nội dung hàm loadAlerts trong 	ry/catch. Trong khối catch, bắt lỗi và gọi setAlerts([]) để tránh sập toàn ứng dụng.
   - Thêm tham số callback xử lý lỗi cho các lời gọi onSnapshot (cả global và personal).

3. **Dọn dẹp log và sửa lỗi hiển thị version .0.0**
   - Mở ontap-win/electron/main.cjs.
   - Tìm các lời gọi console.log và thay thế thành log.info hoặc loại bỏ để dọn dẹp console.
   - Mở ontap-win/electron/preload.cjs.
   - Cập nhật console.log thành log.info hoặc loại bỏ.
   - Sửa logic tại dòng 4 của preload.cjs để hiển thị đúng phiên bản thay vì .0.0.
