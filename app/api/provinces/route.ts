import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebaseClient';
import { collection, getDocs, query } from 'firebase/firestore';

export async function GET() {
  try {
    const qSnap = await getDocs(collection(db, "administrative_units"));
    const provincesMap = new Map();

    qSnap.forEach(doc => {
      const d = doc.data();
      const pName = (d.province_name || '').trim();
      if (pName && !provincesMap.has(pName)) {
        provincesMap.set(pName, {
          province_code: pName, // Dùng tên làm mã luôn cho tiện
          name: pName
        });
      }
    });

    const list = Array.from(provincesMap.values()).sort((a:any, b:any) => a.name.localeCompare(b.name));
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json([]);
  }
}