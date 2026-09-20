# Kế Hoạch Khắc Phục Lỗi Console & Nâng Cao Chất Lượng Mã Nguồn (Console Fix & Code Quality)

- **Mã kế hoạch**: 260920-1510-console-fix
- **Dự án**: TNDNB (ontap-web)
- **Tác giả**: Senior Product Manager & Technical Lead
- **Ngày lập**: 20/09/2026
- **Trạng thái**: [ ] Ready for Execution (Sẵn sàng triển khai)

---

## 1. Tầm Nhìn Sản Phẩm & Mục Tiêu Chiến Lược (Product Vision & Strategic Goals)

### 1.1. Bối cảnh hiện tại
Ứng dụng Ôn tập & Thi trắc nghiệm Thuyền viên TNDNB (ontap-web) đang phục vụ số lượng lớn học viên và giảng viên ôn luyện. Mặc dù các chức năng cốt lõi đang hoạt động, trình duyệt (DevTools Console) hiện đang xuất hiện nhiều lỗi đỏ (Error) và cảnh báo (Warning) nghiêm trọng:
1. Giao diện thanh điều hướng (TopNavbar) hiển thị chuỗi [object Promise] gây mất thẩm mỹ và giảm uy tín sản phẩm.
2. Ứng dụng thiếu cơ chế cách ly lỗi (ErrorBoundary); nếu một widget phụ như Marquee hoặc Navbar bị lỗi runtime, toàn bộ ứng dụng sẽ bị crash thành màn hình trắng (White Screen of Death).
3. Người dùng chưa đăng nhập (khách vãng lai truy cập lần đầu) bị Firestore từ chối quyền truy cập collection 
otifications, làm bắn hàng loạt lỗi đỏ FirebaseError: Missing or insufficient permissions vào console.
4. Tài nguyên PWA (Manifest icons sai kích thước, Service Worker fetch event listener rỗng) làm giảm điểm chất lượng PWA trên Google Lighthouse.
5. Tailwind CSS đang nạp qua CDN runtime compilation trực tiếp trên production, gây chậm tốc độ dựng layout (FOUC) và Chrome đưa ra cảnh báo chính thức.

### 1.2. Mục tiêu chiến lược
- **Zero Console Errors & Warnings**: Đưa số lượng lỗi đỏ và cảnh báo trên Console về 0 ở cả hai trạng thái: Khách vãng lai (Guest) và Người dùng đăng nhập (Authenticated).
- **Khả năng chịu lỗi cao (Fault Tolerance & Resilience)**: Ngăn chặn triệt để hiện tượng sập toàn ứng dụng (White Screen) khi các dịch vụ phụ (thông báo, changelog) gặp sự cố.
- **Tối ưu trải nghiệm tải trang & PWA**: Đạt chuẩn cài đặt PWA không cảnh báo, chuẩn hóa luồng biên dịch CSS ở build-time thay vì runtime.

---

## 2. Ma Trận Ưu Tiên Vấn Đề (Priority & Impact Matrix)

| STT | Vấn đề | Tác động UX / Kỹ thuật | Phân loại | Độ ưu tiên | File liên quan |
|---|---|---|---|---|---|
| 1 | TopNavbar render trực tiếp Promise<string> | Hiển thị [object Promise], lỗi anti-pattern React 19 | Lỗi hiển thị & Runtime | 🔴 **Critical** | [TopNavbar.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx) |
| 2 | Thiếu ErrorBoundary bọc TopNavbar & AlertMarquee | Khi widget phụ crash, toàn bộ app bị crash trắng xóa | Tính sẵn sàng của hệ thống | 🟠 **High** | [App.tsx](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx) |
| 3 | AlertMarquee thiếu try/catch & error callback Firestore | Bắn lỗi đỏ Console khi khách chưa đăng nhập truy cập | Ổn định & Quyền hạn | 🟠 **High** | [AlertMarquee.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/AlertMarquee.tsx) |
| 4 | Manifest icons khai báo 192/512 nhưng ảnh chỉ 64x64 | Chrome cảnh báo kích thước sai, giảm điểm PWA | Tiêu chuẩn PWA | 🟡 **Medium** | [manifest.json](file:///d:/Antigravity/TNDNB/ontap-web/public/manifest.json) |
| 5 | Dùng Tailwind CDN runtime trên production | Chrome cảnh báo, tốn băng thông, render chậm | Hiệu năng & Build | 🟡 **Medium** | [index.html](file:///d:/Antigravity/TNDNB/ontap-web/index.html), [postcss.config.cjs](file:///d:/Antigravity/TNDNB/ontap-web/postcss.config.cjs) |
| 6 | Service Worker fetch listener rỗng | Chrome cảnh báo giảm hiệu năng network | Tối ưu PWA | 🟡 **Low** | [sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js) |
| 7 | Quyền truy cập Firestore cho thông báo | Khách bị chặn đọc notifications | Bảo mật hệ thống | ℹ️ **Keep As-Is** | [irestore.rules](file:///d:/Antigravity/TNDNB/firestore.rules) |

---

## 3. Lộ Trình Triển Khai (Roadmap)

Kế hoạch được chia thành 3 Phase tuần tự nhằm đảm bảo không gián đoạn dịch vụ và dễ dàng rollback nếu có sự cố:

### Phase 1: Ổn định Điều hướng & Bọc Lỗi Giao diện (TopNavbar Fix + ErrorBoundary)
- **Mục tiêu**: Xóa bỏ hoàn toàn lỗi hiển thị version [object Promise] và dựng lưới an toàn ErrorBoundary cho toàn bộ thanh header.
- **Tài liệu chi tiết**: [phase-01-topnavbar-fix.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-01-topnavbar-fix.md)

### Phase 2: Nâng cao Khả năng Chịu lỗi Firestore & Thông báo (AlertMarquee Resilience)
- **Mục tiêu**: Đảm bảo khách vãng lai hoặc kết nối mạng chập chờn không làm bắn lỗi đỏ console; giữ nguyên nguyên tắc bảo mật Least Privilege của Firestore.
- **Tài liệu chi tiết**: [phase-02-marquee-resilience.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-02-marquee-resilience.md)

### Phase 3: Dọn dẹp Cảnh báo Môi trường & Chuẩn hóa PWA / Build (Cleanup & PWA)
- **Mục tiêu**: Chuẩn hóa manifest PWA, dọn dẹp SW fetch rỗng, giải phóng app khỏi Tailwind CDN runtime compilation một cách an toàn.
- **Tài liệu chi tiết**: [phase-03-cleanup.md](file:///d:/Antigravity/TNDNB/docs/plans/260920-1510-console-fix/phase-03-cleanup.md)

---

## 3.1. Chiến Lược Branch & Deploy (Git Workflow)

> ⚠️ **QUAN TRỌNG:** Tất cả thay đổi code PHẢI nằm trên branch riêng, KHÔNG commit trực tiếp vào `main`.

```
main (production) ─────────────────────────────── merge ← PR review
  └── fix/console-cleanup (đã tạo) ── commit → push → deploy test → verify OK ─┘
```

**Quy trình:**
1. ✅ Branch `fix/console-cleanup` đã được tạo từ `main`
2. Thi công Phase 1 → 2 → 3 trên branch này, commit sau mỗi phase
3. Push branch lên origin: `git push -u origin fix/console-cleanup`
4. Deploy branch lên môi trường test (Vercel Preview hoặc local preview)
5. Anh kiểm tra thủ công: Console sạch, UI không vỡ
6. Nếu OK → Merge vào `main` production
7. Nếu lỗi → Fix tiếp trên branch, không ảnh hưởng production

---

## 4. Bảng Theo Dõi Tiến Độ Tổng Thể (Progress Tracker)

| Mã Task | Hạng mục | Độ ưu tiên | Người thực hiện | Trạng thái | Ghi chú |
|---|---|---|---|---|---|
| **T1.1** | Sửa async JSX trong TopNavbar | 🔴 Critical | Frontend Dev | - [ ] Chưa bắt đầu | Dùng useState + useEffect |
| **T1.2** | Tạo component ErrorBoundary | 🟠 High | Frontend Dev | - [ ] Chưa bắt đầu | Fallback UI êm dịu |
| **T1.3** | Bọc TopNavbar + AlertMarquee bằng ErrorBoundary | 🟠 High | Frontend Dev | - [ ] Chưa bắt đầu | Tích hợp trong App.tsx |
| **T2.1** | Thêm try/catch cho loadAlerts trong AlertMarquee | 🟠 High | Frontend Dev | - [ ] Chưa bắt đầu | Bắt lỗi bất đồng bộ |
| **T2.2** | Bổ sung error handler cho Firestore onSnapshot | 🟠 High | Frontend Dev | - [ ] Chưa bắt đầu | Dập tắt lỗi PERMISSION_DENIED |
| **T2.3** | Xác nhận giữ nguyên cấu hình firestore.rules | ℹ️ Info | Security / Dev | - [ ] Chưa bắt đầu | Tuân thủ bảo mật dữ liệu |
| **T3.1** | Điều chỉnh kích thước icon trong 2 file manifest.json | 🟡 Medium | Frontend Dev | - [ ] Chưa bắt đầu | Sửa về 64x64 |
| **T3.2** | Kiểm tra & cấu hình Tailwind trong postcss.config.cjs | 🟡 Medium | DevOps / Frontend | - [ ] Chưa bắt đầu | Tránh vỡ UI khi bỏ CDN |
| **T3.3** | Xóa script CDN Tailwind và inline config trong index.html | 🟡 Medium | Frontend Dev | - [ ] Chưa bắt đầu | Chỉ xóa sau khi T3.2 passed |
| **T3.4** | Xóa fetch event listener rỗng trong sw-pwa.js | 🟡 Low | PWA Dev | - [ ] Chưa bắt đầu | Xóa ở cả 2 thư mục public |
| **T4.1** | Kiểm tra TypeScript compilation (npx tsc --noEmit) | 🔴 Quality Gate | QA / Lead | - [ ] Chưa bắt đầu | Yêu cầu 0 lỗi Type |
| **T4.2** | Thực hiện build production (npm run build) | 🔴 Quality Gate | DevOps | - [ ] Chưa bắt đầu | Bundle tối ưu |
| **T4.3** | Xác minh runtime console trên preview (npm run preview) | 🔴 Quality Gate | QA / Lead | - [ ] Chưa bắt đầu | Test Guest + Logged in |

---

## 5. Tiêu Chí Hoàn Thành (Definition of Done - DoD)
Một task hoặc phase chỉ được coi là hoàn thành khi đáp ứng đủ các tiêu chí sau:
1. **Kiểm tra cú pháp & kiểu (Typecheck)**: Lệnh 
px tsc --noEmit chạy sạch, không phát sinh bất kỳ lỗi TypeScript nào.
2. **Đóng gói production (Build)**: Lệnh 
pm run build tạo bundle thành công, không có lỗi import hay CSS resolver.
3. **Kiểm thử trải nghiệm thực tế (Runtime Verification)**:
   - Trạng thái 1: Mở ứng dụng ở tab Ẩn danh (Guest, chưa đăng nhập) → Console không có bất kỳ dòng log màu đỏ nào (Uncaught Error, FirebaseError).
   - Trạng thái 2: Đăng nhập tài khoản Học viên / Giáo viên → Navbar hiển thị đúng số phiên bản thực tế (ví dụ 3.19.2), thông báo chạy mượt mà.
4. **Hồi quy giao diện (Visual Non-Regression)**: Các class giao diện Tailwind (màu sắc, flex, grid, dark mode, modal) hiển thị chính xác 100% như trước khi gỡ CDN.

---

## 6. Kế Hoạch Ứng Phó Rủi Ro (Risk Mitigation Plan)

| Rủi ro | Mức độ | Khả năng xảy ra | Biện pháp phòng ngừa & Xử lý |
|---|---|---|---|
| Gỡ Tailwind CDN làm vỡ giao diện hệ thống | 🔴 Cao | Trung bình | Kiểm tra kỹ cấu hình PostCSS & import CSS trước. Build thử nghiệm và so sánh giao diện trước/sau. Nếu lỗi, rollback dòng CDN ngay lập tức. |
| AlertMarquee nuốt lỗi làm giấu luôn lỗi hệ thống khác | 🟡 Trung bình | Thấp | Chỉ nuốt lỗi permission-denied của Firestore hoặc ghi log cảnh báo mức debug (console.debug) thay vì crash UI. |
| ErrorBoundary chặn nhầm các lỗi cần hiển thị | 🟢 Thấp | Thấp | ErrorBoundary chỉ bọc độc lập cụm Header/Marquee, không bọc đè lên phần routes chính để đảm bảo các màn hình khác báo lỗi chuẩn xác. |
