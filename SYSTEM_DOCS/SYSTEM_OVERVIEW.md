# 🌏 TNDNB - System Overview

Tài liệu này mô tả toàn bộ hệ sinh thái phần mềm của **TNDNB** (Đào Tạo Thuyền Viên & Du Lịch Ninh Bình) để AI hoặc Developer mới có thể nắm bắt nhanh chóng.

---

## 🏗️ Cấu Trúc Dự Án (Monorepo-like)

Thư mục gốc: `e:\TNDNB`

| Thư mục | Loại dự án | Mô tả | Công nghệ chính |
|---------|------------|-------|-----------------|
| **(Root)** | Web Chính | Trang chủ `daotaothuyenvien.com` | **Next.js**, TailwindCSS, Firebase |
| `amthuc-web` | Web Phụ | Trang Ẩm thực & Du lịch (`/amthuc`) | **Vite React**, Firebase, Maps |
| `ontap-web` | Web Phụ | Trang Ôn tập trực tuyến (`/ontap`) | **Vite React**, Firebase Auth |
| `ontap-win` | Web/App | App Ôn tập Desktop (Offline) | **Electron**, React, Vite |
| `androidapp` | Mobile App | App Ôn tập cho Android | **Capacitor** / React Native (cần xác nhận) |
| `N8N` | Automation | Server & Workflow tự động hoá | N8N, Docker (Ubuntu Server) |

---

## 🔗 Mối Liên Hệ & Triển Khai

| Sub-system | URL Public | Deployment Path | Ghi chú |
|------------|------------|-----------------|---------|
| **Trang chủ** | `daotaothuyenvien.com` | `/` (Root) | Chứa `ads.txt` chính |
| **Ẩm thực** | `.../amthuc` | `/public/amthuc` (?) | Đã tích hợp tính năng "Khám Phá Ninh Bình" |
| **Ôn tập** | `.../ontap` | `/public/ontap` | Cần rebuild thủ công sau khi sửa code gốc |

---

## 🛠️ Hướng Dẫn Kỹ Thuật Nhanh

### 1. Ads & Monetization
- **File `ads.txt`**: Đã được đồng bộ tại 3 vị trí để phục vụ Google AdSense:
  - `e:\TNDNB\public\ads.txt` (Trang chủ)
  - `e:\TNDNB\amthuc-web\public\ads.txt`
  - `e:\TNDNB\ontap-web\public\ads.txt`
- **Chiến lược**:
  - Web: Dùng AdSense.
  - App Win/Android: Dùng Donation hoặc Banner (Không dùng AdSense).

### 2. Quy Trình Build/Deploy
- **Ôn tập Web (`ontap-web`)**:
  - Sửa code tại `ontap-web`.
  - Chạy `npm run build`.
  - Copy `dist` -> `/public/ontap` (nếu deploy thủ công).

- **Ẩm thực Web (`amthuc-web`)**:
  - Sửa code tại `amthuc-web`.
  - Dev: `npm run dev` (Port 5174).

### 3. Database
- **Firebase**: Sử dụng chung cho Auth và Firestore (Lưu trữ user, kết quả thi, địa điểm du lịch).
- **Attractions Data**: Nằm trong collection `attractions` (Firestore).

---

## 📝 Nhật Ký Cập Nhật Gần Đây
- **06/2025**: Nâng cấp `amthuc-web` thành "Khám Phá Ninh Bình" (Thêm 14 địa điểm du lịch, Tab switcher).
- **06/2025**: Đồng bộ `ads.txt` toàn hệ thống.
