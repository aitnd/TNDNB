# CURRENT_SYSTEM_OVERVIEW — [ontap-web]

## 🏗️ Kiến trúc hiện tại
- **Frontend**: React (Vite) + TypeScript.
- **State Management**: React Hooks.
- **Styling**: Vanilla CSS / Tailwind (Tùy hợp phần).
- **Backend**: Firebase RTDB (Realtime Database).
- **Hosting/Deployment**: Vercel (Auto-deploy from branch `master`).

## 🔧 Cấu hình mạng (Network)
- **Vite Proxy**: Đã cấu hình `/api` trỏ về `localhost:5000` (Dev).
- **BASE_URL**: Tự động chuyển đổi giữa localhost (Dev) và domain production dựa trên môi trường (sử dụng relative path `/api`).

## 📊 Analytics & Monitoring
- **Vercel Analytics**: Đã được tích hợp để theo dõi lưu lượng truy cập và các chỉ số Web Vitals.

## 📁 Cấu trúc thư mục chính
- `src/screens/`: Chứa các màn hình chính (AccountScreen, AdminDashboard).
- `src/components/`: Chứa các component dùng chung (AdminSessionList).
- `public/`: Chứa assets tĩnh.
- `.brain/`: Chứa state và tài liệu hệ thống cho AI Agent.

## ⚠️ Lưu ý kỹ thuật
- Dữ liệu từ Firebase RTDB cần sử dụng optional chaining (`?.`) vì Schema không đồng nhất.
- Middleware Reset Password phụ thuộc vào proxy cấu hình đúng cho `/api`.
