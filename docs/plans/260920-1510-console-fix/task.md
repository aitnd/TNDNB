# Danh Sách Công Việc Chi Tiết (Living Task File)

- **Mã kế hoạch**: 260920-1510-console-fix
- **Kế hoạch tổng thể**: [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/plan.md)
- **Dự án**: TNDNB Ôn Thi (ontap-web)
- **Ngày khởi tạo**: 20/09/2026
- **Trạng thái**: Đang chờ thực thi (Pending)

---

## Danh Mục Công Việc Theo Phase

### Phase 1: Ổn Định Điều Hướng & Bọc Lỗi Giao Diện (TopNavbar & ErrorBoundary)
Tài liệu hướng dẫn kỹ thuật: [phase-01-topnavbar-fix.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-01-topnavbar-fix.md)

- [ ] **Task 1.1: Khắc phục lỗi hiển thị Promise trong TopNavbar**
  - **Tập tin cần sửa**: [TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx#L4-L170)
  - **Mục tiêu**: Xóa bỏ hiện tượng chuỗi [object Promise] hiển thị trên thanh điều hướng.
  - **Hành động cụ thể**:
    - Khởi tạo state const [latestVersion, setLatestVersion] = React.useState<string>('...');
    - Thêm React.useEffect(() => { getLatestVersion().then(setLatestVersion); }, []);
    - Thay thế dòng 168 {getLatestVersion()} thành {latestVersion}.
  - **Độ ưu tiên**: 🔴 Critical

- [ ] **Task 1.2: Tạo mới component ErrorBoundary**
  - **Tập tin tạo mới**: [ErrorBoundary.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ErrorBoundary.tsx)
  - **Mục tiêu**: Tạo rào chắn bắt ngoại lệ React cấp component, ngăn lỗi runtime đánh sập toàn bộ ứng dụng.
  - **Hành động cụ thể**:
    - Xây dựng React Class Component kế thừa React.Component với các lifecycle getDerivedStateFromError và componentDidCatch.
    - Cung cấp fallback UI tinh gọn, thân thiện (có thể tùy biến qua prop allback hoặc hiển thị thông báo nhẹ nhàng).
  - **Độ ưu tiên**: 🟠 High

- [ ] **Task 1.3: Tích hợp ErrorBoundary bọc TopNavbar và AlertMarquee**
  - **Tập tin cần sửa**: [App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L418-L428)
  - **Mục tiêu**: Đảm bảo nếu TopNavbar hoặc AlertMarquee gặp sự cố, phần thân ứng dụng (AppRoutes) vẫn hiển thị bình thường.
  - **Hành động cụ thể**:
    - Import ErrorBoundary vào App.tsx.
    - Bọc cụm <TopNavbar ... /> và <AlertMarquee /> trong <ErrorBoundary fallback={<div className=h-16 bg-white dark:bg-slate-900 border-b flex items-center px-4 text-sm text-gray-500>Hệ thống đang bảo trì thanh điều hướng</div>}>.
  - **Độ ưu tiên**: 🟠 High

---

### Phase 2: Nâng Cao Khả Năng Chịu Lỗi Của AlertMarquee & Chính Sách Firestore
Tài liệu hướng dẫn kỹ thuật: [phase-02-marquee-resilience.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-02-marquee-resilience.md)

- [ ] **Task 2.1: Bọc try/catch cho hàm loadAlerts trong AlertMarquee**
  - **Tập tin cần sửa**: [AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx#L16-L28)
  - **Mục tiêu**: Bắt các ngoại lệ bất đồng bộ khi gọi API/Firestore đọc thông báo chạy chữ.
  - **Hành động cụ thể**:
    - Trong hàm loadAlerts, bọc khối 	ry { const data = await fetchActiveMarqueeNotifications(...); setAlerts(data); } catch (error) { setAlerts([]); }.
  - **Độ ưu tiên**: 🟠 High

- [ ] **Task 2.2: Bổ sung error handler cho onSnapshot listener**
  - **Tập tin cần sửa**: [AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx#L29-L58)
  - **Mục tiêu**: Dập tắt lỗi FirebaseError: Missing or insufficient permissions khi khách vãng lai truy cập.
  - **Hành động cụ thể**:
    - Thêm callback error (err) => { /* Chế độ khách hoặc mất kết nối - bỏ qua lỗi */ } vào onSnapshot(qGlobal, ..., errorCallback).
    - Thêm callback error tương tự cho onSnapshot(qPersonal, ..., errorCallback).
  - **Độ ưu tiên**: 🟠 High

- [ ] **Task 2.3: Đánh giá và bảo toàn chính sách bảo mật Firestore Rules**
  - **Tập tin tham chiếu**: [irestore.rules](file:///d:/Antigravity/TNDNB/firestore.rules#L20-L29)
  - **Mục tiêu**: Giữ nguyên quy tắc llow read: if request.auth != null; cho 
otifications và settings để bảo vệ dữ liệu nội bộ.
  - **Hành động cụ thể**:
    - Xác nhận không sửa đổi mở quyền public cho khách trên Firestore rules; việc xử lý ngoại lệ ở Task 2.1 và 2.2 đã giải quyết triệt để lỗi Console mà vẫn đảm bảo tính bảo mật.
  - **Độ ưu tiên**: ℹ️ Info

---

### Phase 3: Dọn Dẹp Cảnh Báo Môi Trường & Chuẩn Hóa PWA / Build
Tài liệu hướng dẫn kỹ thuật: [phase-03-cleanup.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-03-cleanup.md)

- [ ] **Task 3.1: Đồng bộ kích thước icon trong manifest.json**
  - **Tập tin cần sửa**:
    - [ontap-web/public/manifest.json](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json#L8-L11)
    - [public/ontap/manifest.json](file:///d:/Antigravity/TNDNB/public/ontap/manifest.json#L8-L11)
  - **Mục tiêu**: Loại bỏ cảnh báo Chrome DevTools: Manifest: property 'src' does not match size '192x192' (actual size 64x64).
  - **Hành động cụ thể**:
    - Sửa sizes: 64x64 cho icon hiện tại trong 2 file manifest.
  - **Độ ưu tiên**: 🟡 Medium

- [ ] **Task 3.2: Kiểm tra và cấu hình Tailwind CSS trong postcss.config.cjs**
  - **Tập tin cần sửa / kiểm tra**: [postcss.config.cjs](file:///d:/Antigravity/TNDNB/ontap-web/postcss.config.cjs)
  - **Mục tiêu**: Đảm bảo pipeline biên dịch PostCSS tích hợp Tailwind CSS đầy đủ trước khi gỡ CDN, tránh làm sập toàn bộ giao diện.
  - **Hành động cụ thể**:
    - Kiểm tra cấu hình Tailwind plugin trong postcss.config.cjs hoặc cấu hình Vite.
    - Đảm bảo các utility class mở rộng (màu sắc, animations trong index.html) được chuyển dịch vào cấu hình CSS / Tailwind an toàn.
  - **Độ ưu tiên**: 🟡 Medium

- [ ] **Task 3.3: Gỡ bỏ Tailwind CDN script và inline config trong index.html**
  - **Tập tin cần sửa**: [ontap-web/index.html](file:///d:/Antigravity/TNDNB/ontap-web/index.html#L11-L98)
  - **Mục tiêu**: Loại bỏ hoàn toàn cảnh báo sản phẩm cdn.tailwindcss.com should not be used in production và tăng tốc độ dựng trang.
  - **Hành động cụ thể**:
    - Xóa dòng thẻ script CDN (dòng 11).
    - Xóa khối inline script cấu hình 	ailwind.config = { ... } (dòng 29-98) sau khi đã tích hợp vào theme/css.
  - **Độ ưu tiên**: 🟡 Medium

- [ ] **Task 3.4: Xóa fetch event listener rỗng trong Service Worker**
  - **Tập tin cần sửa**:
    - [ontap-web/public/sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js#L3)
    - [public/ontap/sw-pwa.js](file:///d:/Antigravity/TNDNB/public/ontap/sw-pwa.js#L3)
  - **Mục tiêu**: Loại bỏ cảnh báo lãng phí tài nguyên CPU của trình duyệt khi kích hoạt Service Worker không cần thiết.
  - **Hành động cụ thể**:
    - Xóa dòng self.addEventListener('fetch', (e) => { /* passthrough mặc định, không cache */ });.
  - **Độ ưu tiên**: 🟡 Low

---

### Phase 4: Kiểm Thử Toàn Diện & Nghiệm Thu Chất Lượng
- [ ] **Task 4.1: Kiểm tra lỗi kiểu tĩnh với TypeScript**
  - **Lệnh thực thi**: cd d:\Antigravity\TNDNB\ontap-web && npx tsc --noEmit
  - **Tiêu chí chấp nhận**: 0 errors, exit code 0.
- [ ] **Task 4.2: Đóng gói kiểm tra bản dựng Production**
  - **Lệnh thực thi**: cd d:\Antigravity\TNDNB\ontap-web && npm run build
  - **Tiêu chí chấp nhận**: Bản dựng thành công, các chunk tĩnh được tạo trong ../public/ontap/.
- [ ] **Task 4.3: Kiểm thử runtime trên trình duyệt với DevTools**
  - **Lệnh thực thi**: cd d:\Antigravity\TNDNB\ontap-web && npm run preview
  - **Tiêu chí chấp nhận**: Mở Console F12 ở cả 2 chế độ Ẩn danh (Guest) và Đăng nhập: Không có bất kỳ lỗi đỏ (Error) hoặc cảnh báo vàng (Warning) nào liên quan đến các thành phần trên.
