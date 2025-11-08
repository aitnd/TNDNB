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
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
    console.log('[AdminSDK] Firebase Admin initialized.');
  } catch (e: any) {
    console.error('[AdminSDK] Firebase Admin initialization error:', e.stack);
  }
}

// 3. "Gửi" các "đồ nghề" cho các API Route xài
export const adminDb = admin.firestore(); // "Tủ" (Firestore)
export const FieldValue = admin.firestore.FieldValue; // 💖 CÔNG CỤ MỚI 💖