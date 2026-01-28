import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebaseClient';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pCode = searchParams.get('province_code'); // Script gửi tên tỉnh lên

  if (!pCode) return NextResponse.json([]);

  try {
    const q = query(collection(db, "administrative_units"), where("province_name", "==", pCode));
    const snapshot = await getDocs(q);
    let wards: any[] = [];

    snapshot.forEach(doc => {
      const d = doc.data();
      // Thêm xã mới
      wards.push({ ward_code: d.ward_name, name: d.ward_name });
      // Thêm cả xã cũ (nếu có) để người dân chọn
      if (d.has_merger && d.old_units) {
         d.old_units.forEach((old: string) => {
             wards.push({ ward_code: old, name: old + " (Cũ)" });
         });
      }
    });

    // Lọc trùng
    const unique = Array.from(new Map(wards.map(item => [item.name, item])).values());
    return NextResponse.json(unique);
  } catch (error) {
    return NextResponse.json([]);
  }
}