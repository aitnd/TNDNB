# Cổng Thông Tin & Hệ Thống Ôn Tập Thuyền Viên Ninh Bình (TNDNB)

> **Cổng thông tin chính thức:** https://www.daotaothuyenvien.com  
> **App Ôn tập & Thi thử Trực tuyến:** https://www.daotaothuyenvien.com/ontap  
> **Cập nhật lần cuối:** 2026-11-06  
> **Phiên bản hiện tại:** v3.21.0  
> **Mục tiêu:** Hệ thống đào tạo, ôn tập, thi thử và quản lý học viên chuyên nghiệp dành cho người lái, thuyền viên phương tiện thủy nội địa, vận hành đồng bộ trên cả nền tảng Web PWA và ứng dụng Desktop Windows.

---

## 📂 Cấu Trúc Hệ Thống (Workspace Architecture)

Dự án là một monorepo bao gồm 4 thành phần chính:

1. **Root Portal (Next.js 14 App Router):**
   - Đóng vai trò là cổng thông tin chính thức của **Công ty Cổ phần Tư vấn và Giáo dục Ninh Bình** tại `https://www.daotaothuyenvien.com`.
   - Giao diện Editorial Hallmark chuẩn mực, quản lý tin tức, tuyển sinh, văn bản pháp quy và tra cứu học phí. Tối ưu SEO Google với Next.js ISR (`< 50ms`).
   - Reverse proxy / rewrite `/ontap/:path*` tải ứng dụng ôn tập một cách liền mạch.

2. **ontap-web (Vite SPA - React 19 + TailwindCSS):**
   - Phân hệ chính dành cho học viên và cán bộ thực hiện ôn tập, thi thử, nộp bài, xem kết quả và quản trị hệ thống tại `https://www.daotaothuyenvien.com/ontap`.
   - Giao diện Dual-Theme Sáng/Tối (Maritime EdTech), lưu trữ Offline-First với IndexedDB (`OnTapWebDB`), đồng bộ đề thi qua Cloudflare Edge API / Supabase.

3. **ontap-win (Vite + Electron App):**
   - Ứng dụng Desktop chạy ngoại tuyến 100% cho Windows, đóng gói bằng Electron.
   - Đồng bộ 100% dữ liệu đề thi cục bộ (`questions_db.json`), chống gian lận trong phòng thi (khóa chuột phải, vô hiệu hóa DevTools).

4. **cloudflare-worker (tndnb-edge-api):**
   - API phân phối đề thi, đồng bộ cấu hình và proxy cập nhật ứng dụng Desktop tại Cloudflare Edge VN (< 30ms).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend:** React 19, Next.js 14, TypeScript, TailwindCSS v4, Vite
- **Database & Storage:** Supabase (PostgreSQL), Google Firebase Firestore, Cloudflare D1 (SQLite), Cloudflare R2
- **Desktop Container:** Electron
- **Testing:** Vitest (18/18 test suites passed 100%)
- **Build & Package:** npm, Next Build, Electron Builder

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
npm run build:portal
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

## 📈 Lịch Sử Cập Nhật
Chi tiết lịch sử thay đổi của dự án được ghi nhận đầy đủ tại [CHANGELOG.md](./CHANGELOG.md).
