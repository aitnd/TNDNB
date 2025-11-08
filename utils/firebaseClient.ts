import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Lấy "chìa khóa" từ "két sắt" (.env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// 2. "Cắm điện" (Khởi tạo)
//    (Code này kiểm tra xem đã "cắm" chưa, nếu rồi thì dùng lại)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. "Mở" các dịch vụ chúng ta cần
const auth = getAuth(app); // Dịch vụ "Bảo vệ" (Đăng nhập)
const db = getFirestore(app); // Dịch vụ "Tủ" (Firestore Realtime)

// 4. "Gửi" các dịch vụ này cho cả "biệt thự" xài
export { app, auth, db };