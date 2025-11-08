// File: utils/firebaseAdmin.ts

import * as admin from 'firebase-admin'

// 1. Đọc "Chìa khóa Kho" từ "Két sắt" Vercel
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

if (!serviceAccountKey) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env')
}

// 2. "Cắm điện" (Khởi tạo)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // 3. "Dùng chìa khóa"
      credential: admin.credential.cert(JSON.parse(serviceAccountKey))
      // 4. (ĐÃ XÓA DÒNG 'databaseURL' BỊ SAI Ở ĐÂY)
    });
    console.log('[AdminSDK] Firebase Admin initialized.');
  } catch (e: any) {
    console.error('[AdminSDK] Firebase Admin initialization error:', e.stack);
  }
}

// 5. "Gửi" các "đồ nghề" cho các API Route xài
export const adminDb = admin.firestore(); // "Tủ" (Firestore)
export const FieldValue = admin.firestore.FieldValue; // Công cụ "Dấu thời gian"