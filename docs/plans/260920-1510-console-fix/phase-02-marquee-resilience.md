# Phase 2: Nâng Cao Khả Năng Chịu Lỗi Của AlertMarquee & Chính Sách Firestore Rules

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [	ask.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🟠 **High**

---

## 1. Mục Tiêu & Giá Trị Mang Lại

### 1.1. Mục tiêu
1. Ngăn chặn triệt để lỗi đỏ console FirebaseError: Missing or insufficient permissions xuất hiện khi khách vãng lai (chưa đăng nhập) truy cập vào ứng dụng ôn thi.
2. Thiết lập cơ chế suy giảm duyên dáng (**Graceful Degradation**): Nếu người dùng chưa đăng nhập, hoặc mất kết nối mạng, widget AlertMarquee sẽ tự động ẩn đi (eturn null) mà không gây ô nhiễm Console hoặc gián đoạn trải nghiệm người dùng.
3. Bảo toàn nguyên tắc đặc quyền tối thiểu (**Principle of Least Privilege**) trong chính sách bảo mật Firestore (irestore.rules).

### 1.2. Giá trị sản phẩm (Product Value)
- **Ấn tượng đầu tiên chuyên nghiệp**: Người dùng mới và học viên tiềm năng truy cập lần đầu không gặp bất kỳ lỗi đỏ nào trong Console của trình duyệt.
- **Bảo mật dữ liệu**: Giữ kín các thông báo nội bộ, thông tin thi cử chỉ dành cho tài khoản đã được xác thực, không mở quyền bừa bãi ra internet.

---

## 2. Phân Tích Kỹ Thuật Chuyên Sâu

### 2.1. Phân tích nguyên nhân gốc rễ (Root Cause Analysis)
- **Tập tin**: [AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx) (Dòng 16-57)
- **Tập tin quy tắc**: [irestore.rules](file:///d:/Antigravity/TNDNB/firestore.rules) (Dòng 20-23)

Trong [irestore.rules](file:///d:/Antigravity/TNDNB/firestore.rules#L20-L23):
`irestore
// Collection: notifications (Thông báo)
match /notifications/{docId} {
  allow read: if request.auth != null;
  allow write: if isAdmin();
}
`
Quy tắc bảo mật quy định: **Chỉ người dùng đã đăng nhập (equest.auth != null) mới được phép đọc collection 
otifications**.

Tuy nhiên, trong [AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx#L16-L57):
`	ypescript
const loadAlerts = async () => {
    const data = await fetchActiveMarqueeNotifications(user?.uid, userProfile?.role);
    setAlerts(data);
};

useEffect(() => {
    // Realtime Listener for Global Alerts
    const qGlobal = query(
        collection(db, 'notifications'),
        where('targetType', '==', 'all'),
        where('type', 'in', ['special', 'attention'])
    );

    const unsubGlobal = onSnapshot(qGlobal, () => {
        loadAlerts(); // Reload all alerts (including personal) when global changes
    });
...
`

**2 lỗ hổng xử lý ngoại lệ nghiêm trọng**:
1. **Thiếu 	ry/catch trong loadAlerts**: Nếu etchActiveMarqueeNotifications bị từ chối quyền (Firestore Permission Denied), Promise sẽ bị reject không được bắt.
2. **Thiếu đối số onError trong onSnapshot**: Cú pháp đầy đủ của Firestore SDK là:
   onSnapshot(query, onNext, onError).
   Khi không truyền callback onError, nếu Firestore từ chối quyền (permission-denied), Firestore SDK sẽ ném thẳng lỗi ra môi trường toàn cục dưới dạng Uncaught Exception, dẫn đến dòng lỗi đỏ rực:
   FirebaseError: Missing or insufficient permissions.

### 2.2. Đánh giá chiến lược: Tại sao KHÔNG mở quyền trong irestore.rules?
Một giải pháp dễ dãi thường được đề xuất là đổi irestore.rules:
llow read: if true;
Tuy nhiên, dưới góc độ Product Manager và Kỹ sư trưởng, chúng tôi **quyết định giữ nguyên không sửa irestore.rules** vì các lý do sau:
1. **Bảo mật dữ liệu nội bộ**: Collection 
otifications có thể lưu thông báo khẩn, lịch thi, cảnh báo vi phạm nội bộ. Khách vãng lai không có tư cách truy cập dữ liệu này.
2. **Chi phí truy vấn Firestore**: Nếu mở ead: if true, các bot cào dữ liệu hoặc người dùng ẩn danh có thể kích hoạt hàng ngàn lượt đọc Firestore không cần thiết, làm tăng chi phí hạ tầng.
3. **Tính bền vững của Frontend**: Bất kể backend rules thay đổi thế nào, một client component vững chắc (resilient) bắt buộc phải có 	ry/catch và error handler để xử lý khi mất mạng, timeout hoặc permission denied.

---

## 3. Hướng Dẫn Kỹ Thuật Chi Tiết (Implementation)

### 3.1. Cập nhật AlertMarquee.tsx
Chúng ta sẽ:
1. Bọc loadAlerts bằng khối 	ry/catch. Khi có lỗi, đặt setAlerts([]) để ẩn thanh marquee.
2. Cung cấp callback thứ 2 cho onSnapshot(qGlobal, onNext, onError) để dập tắt lỗi permission-denied.
3. Kiểm tra điều kiện: Nếu !user, ta chỉ fetch hoặc lắng nghe nếu hợp lệ; nếu bị chặn thì âm thầm ghi nhận log debug.

#### Code Diff hoàn chỉnh:
`diff
--- a/ontap-web/components/AlertMarquee.tsx
+++ b/ontap-web/components/AlertMarquee.tsx
@@ -16,8 +16,14 @@ const AlertMarquee: React.FC = () => {
     const loadAlerts = async () => {
+        try {
             const data = await fetchActiveMarqueeNotifications(user?.uid, userProfile?.role);
-            setAlerts(data);
+            setAlerts(data || []);
+        } catch (error) {
+            // Người dùng chưa đăng nhập hoặc mất mạng: Ẩn thông báo nhẹ nhàng
+            setAlerts([]);
+        }
     };
 
     useEffect(() => {
         loadAlerts();
@@ -37,7 +43,10 @@ const AlertMarquee: React.FC = () => {
         const unsubGlobal = onSnapshot(qGlobal, () => {
             loadAlerts(); // Reload all alerts (including personal) when global changes
+        }, (error) => {
+            // Nuốt lỗi permission-denied khi khách chưa đăng nhập truy cập
+            setAlerts([]);
         });
 
         // Realtime Listener for Personal Alerts (if user exists)
@@ -48,7 +57,10 @@ const AlertMarquee: React.FC = () => {
                 where('type', 'in', ['special', 'attention'])
             );
             unsubPersonal = onSnapshot(qPersonal, () => {
                 loadAlerts();
+            }, (error) => {
+                setAlerts([]);
             });
         }
`

---

## 4. Kế Hoạch Kiểm Thử & Nghiệm Thu Phase 2

1. **Kiểm thử chế độ Khách vãng lai (Guest Mode)**:
   - Mở trình duyệt ở chế độ Cửa sổ ẩn danh (Incognito Window).
   - Truy cập vào ứng dụng (đường dẫn /ontap/).
   - Mở DevTools Console (F12):
     - **Kết quả mong đợi**: Console hoàn toàn sạch sẽ, **0 lỗi đỏ FirebaseError**.
     - Giao diện: Thanh Marquee ẩn đi không gây lỗi, không làm vỡ bố cục.

2. **Kiểm thử chế độ Đã đăng nhập (Authenticated Mode)**:
   - Đăng nhập với tài khoản Giáo viên hoặc Học viên hợp lệ.
   - Thêm một thông báo khẩn từ màn hình quản trị hoặc trực tiếp từ Firestore console.
   - **Kết quả mong đợi**:
     - Thanh AlertMarquee xuất hiện và cuộn chữ thông báo mượt mà.
     - Console không có lỗi phát sinh.

---

## 5. Danh Sách Tập Tin Tác Động Trong Phase 2
- [ontap-web/components/AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx)
- [irestore.rules](file:///d:/Antigravity/TNDNB/firestore.rules) *(Tham chiếu kiểm chứng - Giữ nguyên không sửa)*
