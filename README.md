# TNDNB - Hệ thống Ôn tập & Thi nâng định hạng thuyền viên

> **Cập nhật lần cuối:** 2026-06-25  
> **Phiên bản hiện tại:** v3.11.0  
> **Mục tiêu:** Hệ thống ôn tập, thi thử và quản lý học viên chuyên nghiệp dành cho thuyền viên, vận hành đồng bộ trên cả nền tảng Web và ứng dụng Desktop Windows.

---

## 📂 Cấu Trúc Hệ Thống (Workspace Architecture)

Dự án là một monorepo bao gồm 3 thành phần chính:

1. **Root Portal (Next.js App Router):**
   - Đóng vai trò là trang giới thiệu, cổng tin tức, tài liệu học tập và tra cứu.
   - Sử dụng Next.js, tối ưu hóa SEO, tích hợp cơ chế tải quảng cáo động `PortalAdLoader` từ Firestore.

2. **ontap-web (Vite SPA - React + TailwindCSS):**
   - Phân hệ chính dành cho học viên và quản trị viên thực hiện ôn tập, thi thử, nộp bài, xem kết quả và cấu hình hệ thống.
   - Tích hợp đầy đủ Firebase/Firestore, các bộ chặn chống sao chép đề thi và tối ưu hóa hiệu năng bundle (vendor chunking).

3. **ontap-win (Vite + Electron App):**
   - Ứng dụng Desktop chạy ngoại tuyến/cửa sổ cho Windows, đóng gói bằng Electron.
   - Đồng bộ 100% giao diện và tính năng từ `ontap-web`.
   - Bổ sung các tính năng kiểm soát phần cứng như khóa chuột phải toàn cục và vô hiệu hóa phím tắt kiểm tra của trình duyệt để chống gian lận trong phòng thi.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** React 18, TypeScript, TailwindCSS, Vite (cho web/win), Next.js (cho portal)
- **Database & Auth:** Google Firebase (Authentication, Firestore, Cloud Storage)
- **Desktop Container:** Electron
- **Testing:** Vitest + React Testing Library (10/10 test cases passed)
- **Build & Package:** npm, Next Build, Electron Builder

---

## 🚀 Tính Năng Nổi Bật Gần Đây (v3.11.0)

### 1. 💰 Chiến Lực Tối Ưu Hóa MMO & Mạng Quảng Cáo Monetag
- **Popunder & Direct Links:** Tích hợp cơ chế tự động mở tab Popunder ẩn khi người dùng tương tác lần đầu (giới hạn 1 lần/phiên) và chèn **Direct Link** vào các nút tải tài liệu/xem đáp án để tối ưu doanh thu click sạch.
- **Trang Chờ Đếm Ngược:** Màn hình chờ đếm ngược 5 giây (`CountdownAdScreen`) trước khi xem kết quả thi để hiển thị quảng cáo chuyển tiếp (Interstitial) hiệu quả (tự động vô hiệu hóa trên app Windows).
- **Cấu hình động qua Firestore:** Admin có thể thay đổi link quảng cáo Monetag động trực tiếp từ trang cấu hình hệ thống mà không cần chỉnh sửa source code.
- **Xác minh qua Service Worker:** File `sw.js` đặt ở root web hỗ trợ cơ chế Anti-Adblock và đẩy tin nhắn quảng cáo Push.

### 2. 👥 Quản Lý Thành Viên Chuyên Biệt (`/ontap/usermanager`)
- Tách biệt hoàn toàn tính năng quản trị thành viên ra khỏi màn hình Profile cá nhân.
- Tích hợp 3 thẻ KPI Stats thống kê nhanh và bộ lọc vai trò, tìm kiếm thông minh.
- Cho phép Admin theo dõi danh sách thiết bị/phiên đăng nhập hoạt động và kích hoạt đăng xuất từ xa (Force Logout).

### 3. 🛡️ Bảo Mật Đề Thi & Phân Quyền Vai Trò
- Khóa chuột phải, bôi đen, copy và các phím tắt hệ thống (`Ctrl+C`, `Ctrl+U`) trong các màn hình thi/làm bài dựa trên cài đặt động `preventCopy` theo vai trò.
- Thiết lập Trọng số Vai trò (Role Hierarchy) để tránh việc giáo viên/quản lý cấp thấp thao tác trên tài khoản cấp cao hơn.

---

## 💻 Hướng Dẫn Chạy & Phát Triển (Development Guide)

### Cài đặt ban đầu
1. Tạo file `.env.local` ở thư mục gốc và điền các cấu hình Firebase/Supabase (tham khảo `.env.example`).
2. Chạy lệnh cài đặt thư viện ở thư mục gốc:
   ```bash
   npm install
   ```

### 1. Chạy Portal chính (Next.js)
```bash
npm run dev
# Build production
npx next build
```

### 2. Phát triển bản Web (`ontap-web`)
```bash
cd ontap-web
npm run dev
# Chạy Unit Tests
npm run test:run
```

### 3. Phát triển bản Windows (`ontap-win`)
```bash
cd ontap-win
# Chạy ở chế độ Development với Electron
npm run electron:dev
# Build bản cài đặt Windows (.exe)
npm run build:win
```

---

## 📈 Lịch Sử Cập Nhật Gần Nhất
Chi tiết lịch sử thay đổi của dự án được ghi nhận đầy đủ tại [CHANGELOG.md](./CHANGELOG.md).
