# Danh Sách Công Việc Chi Tiết (Living Task File)

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](../../../docs/plans/260920-1510-console-fix/plan.md)
- **Dự án**: TNDNB Ôn Thi (ontap-web)
- **Ngày khởi tạo**: 20/09/2026
- **Trạng thái**: Đang chờ thực thi (Pending)

---

## Danh Mục Công Việc Theo Phase

### Phase 1: Ổn Định Điều Hướng & Bọc Lỗi Giao Diện (TopNavbar & ErrorBoundary)
Tài liệu: [phase-01-topnavbar-fix.md](../../../docs/plans/260920-1510-console-fix/phase-01-topnavbar-fix.md)

- [x] **Task 1.1: Khắc phục lỗi hiển thị Promise trong TopNavbar**
  - [x] Khởi tạo state `latestVersion`.
  - [x] Thêm `useEffect` để fetch version và gán vào state.
  - [x] Cập nhật hiển thị thành `{latestVersion}`.
  - [x] Kiểm tra lỗi: Không còn hiện `[object Promise]`.
- [x] **Task 1.2: Tạo mới component ErrorBoundary**
  - [x] Tạo file `ErrorBoundary.tsx`.
  - [x] Định nghĩa class component `ErrorBoundary`.
- [x] **Task 1.3: Tích hợp ErrorBoundary bọc TopNavbar và AlertMarquee**
  - [x] Import `ErrorBoundary` vào `App.tsx`.
  - [x] Bọc `TopNavbar` và `AlertMarquee` với `ErrorBoundary`.
  - [x] Chạy `cd ontap-web && npx tsc --noEmit` xác nhận pass.
- [x] **Task 1.4: Commit chung Phase 1**
  - [x] Thực thi lệnh: `git commit -m "fix: resolve async JSX in TopNavbar, add ErrorBoundary"`

---

### Phase 2: Nâng Cao Khả Năng Chịu Lỗi Của AlertMarquee & Chính Sách Firestore
Tài liệu: [phase-02-marquee-resilience.md](../../../docs/plans/260920-1510-console-fix/phase-02-marquee-resilience.md)

- [x] **Task 2.1: Bọc try/catch cho hàm loadAlerts trong AlertMarquee**
  - [x] Bọc nội dung hàm `loadAlerts` bằng khối `try/catch`.
  - [x] Xử lý fallback `setAlerts([])` khi bắt lỗi.
- [x] **Task 2.2: Bổ sung error handler cho onSnapshot listener**
  - [x] Thêm callback xử lý lỗi cho `onSnapshot` global.
  - [x] Thêm callback xử lý lỗi cho `onSnapshot` personal.
  - [x] Chạy ẩn danh vào trang `/ontap/` kiểm tra sạch lỗi đỏ.
- [x] **Task 2.3: Đánh giá và bảo toàn chính sách bảo mật Firestore Rules**
  - [x] Xác nhận không thay đổi `firestore.rules`.
- [x] **Task 2.4: Commit Phase 2**
  - [x] Thực thi lệnh: `git commit -m "fix: add error handling for AlertMarquee Firestore calls"`

---

### Phase 3: Dọn Dẹp Cảnh Báo Môi Trường & Chuẩn Hóa PWA / Build
Tài liệu: [phase-03-cleanup.md](../../../docs/plans/260920-1510-console-fix/phase-03-cleanup.md)

- [x] **Task 3.1: Tạo icon chuẩn cho PWA (192x192 & 512x512)**
  - [x] Resize `icon-192.png` về đúng 192x192.
  - [x] Resize `icon-512.png` về đúng 512x512.
- [x] **Task 3.2: Cấu hình Tailwind v4 vào build pipeline**
  - [x] Thêm `@import "tailwindcss";` và `@theme` block vào `theme.css`.
  - [x] Thêm `import './theme.css';` vào `index.tsx`.
- [x] **Task 3.3: Gỡ bỏ Tailwind CDN script và inline config trong index.html**
  - [x] Xác nhận Task 3.2 build thành công.
  - [x] Xóa script CDN ở dòng 11 của `index.html`.
  - [x] Xóa block cấu hình `tailwind.config` trong `index.html`.
  - [x] Kiểm tra layout không bị vỡ.
- [x] **Task 3.4: Xóa fetch event listener rỗng trong Service Worker**
  - [x] Xóa event fetch trong `ontap-web/public/sw-pwa.js`.
  - [x] Xóa event fetch trong `public/ontap/sw-pwa.js`.
- [x] **Task 3.5: Commit Phase 3**
  - [x] Thực thi lệnh: `git commit -m "fix: migrate Tailwind to build-time, remove no-op SW fetch"`

---

### Phase 4: Nâng Cao Độ Ổn Định Cho Bản Electron (Win)
Tài liệu: [phase-04-win-resilience.md](../../../docs/plans/260920-1510-console-fix/phase-04-win-resilience.md)

- [x] **Task 4.1: Tích hợp ErrorBoundary vào ontap-win**
  - [x] Copy file `ErrorBoundary.tsx` sang `ontap-win`.
  - [x] Bọc `ErrorBoundary` cho `TopNavbar` và `AlertMarquee` trong `App.tsx` (hoặc `AppRoutes.tsx`).
- [x] **Task 4.2: Thêm try/catch & error fallback cho AlertMarquee (Win)**
  - [x] Thêm `try/catch` bọc hàm `loadAlerts`, gọi `setAlerts([])` khi lỗi.
  - [x] Thêm error callback cho `onSnapshot` global.
  - [x] Thêm error callback cho `onSnapshot` personal.
- [x] **Task 4.3: Chuẩn hóa logging trong main.cjs và preload.cjs**
  - [x] Sửa `console.log`/`console.error` thành `log.info`/`log.error` trong `main.cjs`.
  - [x] Sửa `console.log` thành `log.info` trong `preload.cjs`.
  - [x] Sửa lỗi fallback `0.0.0` hiện thoáng qua ở `preload.cjs`.
- [x] **Task 4.4: Commit chung Phase 4**
  - [x] Thực thi lệnh: `git commit -m "fix(win): add ErrorBoundary, secure AlertMarquee, standardize electron logging"`

---

### Phase 5: Kiểm Thử Toàn Diện & Nghiệm Thu Chất Lượng
- [ ] **Task 5.1: Kiểm tra lỗi kiểu tĩnh với TypeScript** (`npx tsc --noEmit`)
- [ ] **Task 5.2: Đóng gói kiểm tra bản dựng Production** (`npm run build`)
- [ ] **Task 5.3: Kiểm thử runtime trên trình duyệt với DevTools** (`npm run preview`)
