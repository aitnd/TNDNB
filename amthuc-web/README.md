# 🍜 Amthuc Web - Đói Ăn Gì?

Web app tổng hợp menu quán ăn Ninh Bình, phong cách Gen Z hiện đại.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

## ⚙️ Cấu hình Firebase

Tạo file `.env` trong thư mục này với nội dung:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Lấy giá trị từ**: File `.env.local` của dự án chính, hoặc từ Firebase Console.

## 🏗️ Build

```bash
npm run build
# Output: ../public/amthuc/
```

## 📁 Cấu trúc

```
src/
├── App.tsx          # Router chính
├── firebase.ts      # Firebase config
├── index.css        # Design system Gen Z
├── types/           # TypeScript interfaces
├── components/      # UI components
└── pages/           # Các trang
```
