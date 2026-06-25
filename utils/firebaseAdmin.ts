// File: utils/firebaseAdmin.ts

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue as AdminFieldValue, Firestore } from 'firebase-admin/firestore';

// 1. Đọc "Chìa khóa Kho" từ "Két sắt" Vercel
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

// 💖 2. KHAI BÁO BIẾN "HỨA" TRƯỚC 💖
let adminDb: Firestore;
let FieldValue: typeof AdminFieldValue;

// 3. "Cắm điện" (Khởi tạo)
const apps = getApps();
if (!apps.length) {
  try {
    if (serviceAccountKey) {
      initializeApp({
        // "Dùng chìa khóa"
        credential: cert(JSON.parse(serviceAccountKey))
      });
      
      // 💖 4. CHỈ "GÁN" SAU KHI KHỞI TẠO THÀNH CÔNG 💖
      adminDb = getFirestore(); 
      FieldValue = AdminFieldValue;
    } else {
      console.warn('[AdminSDK] Thiếu FIREBASE_SERVICE_ACCOUNT_KEY. Các tính năng Admin sẽ không hoạt động.');
    }

  } catch (e: any) {
    console.error('[AdminSDK] Firebase Admin initialization error:', e.stack);
  }
} else {
  // 💖 5. NẾU APP ĐÃ CÓ, "GÁN" LUÔN 💖
  try {
     adminDb = getFirestore(); 
     FieldValue = AdminFieldValue;
  } catch (e) {
     console.warn('[AdminSDK] App đã có nhưng không lấy được Firestore (có thể do lỗi init trước đó).');
  }
}

// 6. "Gửi" các "đồ nghề" đã được "gán" an toàn
export { adminDb, FieldValue };