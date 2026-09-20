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

- [ ] **Task 3.1: Đồng bộ kích thước icon trong manifest.json**
  - [ ] Đổi kích thước thành `64x64` trong `ontap-web/public/manifest.json`.
  - [ ] Đổi kích thước thành `64x64` trong `public/ontap/manifest.json`.
- [ ] **Task 3.2: Cấu hình Tailwind v4 vào build pipeline**
  - [ ] Thêm `@import "tailwindcss";` và `@theme` block vào `theme.css`.
  - [ ] Thêm `import './theme.css';` vào `index.tsx`.
- [ ] **Task 3.3: Gỡ bỏ Tailwind CDN script và inline config trong index.html**
  - [ ] Xác nhận Task 3.2 build thành công.
  - [ ] Xóa script CDN ở dòng 11 của `index.html`.
  - [ ] Xóa block cấu hình `tailwind.config` trong `index.html`.
  - [ ] Kiểm tra layout không bị vỡ.
- [ ] **Task 3.4: Xóa fetch event listener rỗng trong Service Worker**
  - [ ] Xóa event fetch trong `ontap-web/public/sw-pwa.js`.
  - [ ] Xóa event fetch trong `public/ontap/sw-pwa.js`.
- [ ] **Task 3.5: Commit Phase 3**
  - [ ] Thực thi lệnh: `git commit -m "fix: cleanup manifest icons, migrate Tailwind to build-time, remove no-op SW fetch"`

---

### Phase 4: Nâng Cao Độ Ổn Định Cho Bản Electron (Win)
Tài liệu: [phase-04-win-resilience.md](../../../docs/plans/260920-1510-console-fix/phase-04-win-resilience.md)

- [ ] **Task 4.1: Kế thừa ErrorBoundary cho bản Win**
  - [ ] Copy `ErrorBoundary.tsx` sang `ontap-win/src/components/` (nếu cần) hoặc tái sử dụng từ web.
  - [ ] Import và bọc `<ErrorBoundary>` quanh `TopNavbar` và `AlertMarquee` trong `ontap-win/src/App.tsx` (tương tự như web).
- [ ] **Task 4.2: Thêm try/catch và error callback cho AlertMarquee của bản win**
  - [ ] Mở file `ontap-win/src/components/AlertMarquee.tsx`.
  - [ ] Bọc `try/catch` cho hàm `loadAlerts` (bắt lỗi set state về mảng rỗng).
  - [ ] Thêm error callback cho `onSnapshot`.
- [ ] **Task 4.3: Dọn dẹp log và sửa lỗi hiển thị version trong main/preload**
  - [ ] Mở file `ontap-win/main.cjs`, thay `console.log` bằng `log.info` (hoặc dọn dẹp log thừa).
  - [ ] Mở file `ontap-win/preload.cjs`, thay `console.log` bằng `log.info`.
  - [ ] Ở `ontap-win/preload.cjs` dòng 4, sửa logic để khắc phục lỗi hiển thị `0.0.0`.
- [ ] **Task 4.4: Commit chung Phase 4**
  - [ ] Thực thi lệnh: `git commit -m "fix: win electron resilience, error boundary, and console logs"`

---

### Phase 5: Kiểm Thử Toàn Diện & Nghiệm Thu Chất Lượng
- [ ] **Task 5.1: Kiểm tra lỗi kiểu tĩnh với TypeScript** (`npx tsc --noEmit`)
- [ ] **Task 5.2: Đóng gói kiểm tra bản dựng Production** (`npm run build`)
- [ ] **Task 5.3: Kiểm thử runtime trên trình duyệt với DevTools** (`npm run preview`)
