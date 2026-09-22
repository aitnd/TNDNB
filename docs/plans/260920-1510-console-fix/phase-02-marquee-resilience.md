# Phase 2: Nâng Cao Khả Năng Chịu Lỗi Của AlertMarquee & Chính Sách Firestore Rules

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](../../../docs/plans/260920-1510-console-fix/plan.md)
- **Tập tin công việc**: [task.md](../../../docs/plans/260920-1510-console-fix/task.md)
- **Độ ưu tiên tổng thể**: 🟠 **High**

---

## 1. Mục Tiêu & Giá Trị Mang Lại

### 1.1. Mục tiêu
1. Ngăn chặn triệt để lỗi đỏ console `FirebaseError: Missing or insufficient permissions` xuất hiện khi khách vãng lai truy cập.
2. Thiết lập cơ chế suy giảm duyên dáng (**Graceful Degradation**): Nếu người dùng chưa đăng nhập, hoặc mất mạng, AlertMarquee sẽ tự động ẩn đi.
3. Bảo toàn nguyên tắc đặc quyền tối thiểu (**Principle of Least Privilege**) trong chính sách bảo mật Firestore (`firestore.rules`).

---

## 2. Các Bước Thực Hiện (TDD Bite-Sized Tasks)

### Task 2.1: Bọc try/catch cho loadAlerts() trong AlertMarquee.tsx
**1. Verify (Trạng thái hiện tại):**
- Hàm `loadAlerts()` không có `try/catch`. Nếu `fetchActiveMarqueeNotifications` bị lỗi permission, promise bị reject không ai xử lý.

**2. Implement (GREEN):**
Sửa file `ontap-web/components/AlertMarquee.tsx`:
```diff
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
```

**3. Verify PASS:**
- Biên dịch lại code: `npx tsc --noEmit` pass.

### Task 2.2: Bổ sung error handler cho onSnapshot listener
**1. Verify:**
- Lời gọi `onSnapshot` thiếu tham số thứ 3 (error callback). Gây lỗi `Uncaught FirebaseError`.

**2. Implement (GREEN):**
Sửa file `ontap-web/components/AlertMarquee.tsx`:
```diff
--- a/ontap-web/components/AlertMarquee.tsx
+++ b/ontap-web/components/AlertMarquee.tsx
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
```

**3. Verify PASS:**
- Chạy ẩn danh vào trang `/ontap/`. Console hoàn toàn sạch lỗi đỏ. Thanh marquee được ẩn duyên dáng.

### Task 2.3: Đánh giá và bảo toàn chính sách bảo mật Firestore Rules
**1. Verify:** 
- Kiểm tra file `firestore.rules`.
- Quy tắc `allow read: if request.auth != null;` đối với `notifications` được bảo lưu nguyên trạng để giữ tính bảo mật.
- KHÔNG thay đổi file này. (Ghi nhận thông tin, hoàn thành task 2.3).

### Task 2.4: Commit Phase 2
```bash
git add ontap-web/components/AlertMarquee.tsx
git commit -m "fix: add error handling for AlertMarquee Firestore calls"
```
