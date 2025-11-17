// File: utils/firebaseAdmin.ts

import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'; // (Import 'getFirestore')

// 1. Đọc "Chìa khóa Kho" từ "Két sắt" Vercel
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env.local')
}

// 💖 2. KHAI BÁO BIẾN "HỨA" TRƯỚC 💖
let adminDb: admin.firestore.Firestore;
let FieldValue: typeof admin.firestore.FieldValue;

// 3. "Cắm điện" (Khởi tạo)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // "Dùng chìa khóa"
      credential: admin.credential.cert(JSON.parse(serviceAccountKey))
    });
    console.log('[AdminSDK] Firebase Admin initialized.');

    // 💖 4. CHỈ "GÁN" SAU KHI KHỞI TẠO THÀNH CÔNG 💖
    adminDb = getFirestore(); 
    FieldValue = admin.firestore.FieldValue;

  } catch (e: any) {
    console.error('[AdminSDK] Firebase Admin initialization error:', e.stack);
  }
} else {
  // 💖 5. NẾU APP ĐÃ CÓ, "GÁN" LUÔN 💖
  adminDb = getFirestore(); 
  FieldValue = admin.firestore.FieldValue;
}

// 6. "Gửi" các "đồ nghề" đã được "gán" an toàn
export { adminDb, FieldValue };