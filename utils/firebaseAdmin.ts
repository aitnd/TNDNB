// File: utils/firebaseAdmin.ts

import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'; // (Import 'getFirestore')

// 1. Đọc "Chìa khóa Kho" từ "Két sắt" Vercel
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

// 💖 2. KHAI BÁO BIẾN "HỨA" TRƯỚC 💖
let adminDb: admin.firestore.Firestore;
let FieldValue: typeof admin.firestore.FieldValue;

// 3. "Cắm điện" (Khởi tạo)
if (!admin.apps.length) {
  try {
    if (serviceAccountKey) {
      admin.initializeApp({
        // "Dùng chìa khóa"
        credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      });
      console.log('[AdminSDK] Firebase Admin initialized.');
      
      // 💖 4. CHỈ "GÁN" SAU KHI KHỞI TẠO THÀNH CÔNG 💖
      adminDb = getFirestore(); 
      FieldValue = admin.firestore.FieldValue;
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
     FieldValue = admin.firestore.FieldValue;
  } catch (e) {
     console.warn('[AdminSDK] App đã có nhưng không lấy được Firestore (có thể do lỗi init trước đó).');
  }
}

// 6. "Gửi" các "đồ nghề" đã được "gán" an toàn
export { adminDb, FieldValue };