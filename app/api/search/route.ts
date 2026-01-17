import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebaseClient';
import { collection, getDocs, query } from 'firebase/firestore';

// Hàm xóa dấu tiếng Việt
function removeVietnameseTones(str: string) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json([]);

  try {
    // Lấy dữ liệu từ Firebase
    const qSnap = await getDocs(collection(db, "administrative_units"));
    let results: any[] = [];
    
    const keyword = q.toLowerCase();
    const keywordNoSign = removeVietnameseTones(keyword);

    qSnap.forEach(doc => {
      const item = doc.data();
      const nameNew = (item.ward_name || '').toLowerCase();
      const nameNewNoSign = removeVietnameseTones(nameNew);
      
      let matchOld = false;
      if (item.old_units && Array.isArray(item.old_units)) {
         matchOld = item.old_units.some((old: string) => {
             const o = old.toLowerCase();
             const oNoSign = removeVietnameseTones(o);
             return o.includes(keyword) || oNoSign.includes(keywordNoSign);
         });
      }

      if (nameNew.includes(keyword) || nameNewNoSign.includes(keywordNoSign) || matchOld) {
        // Trả về đúng định dạng script.min.js cần
        results.push({
           type: 'ward',
           name: item.ward_name, // Tên hiển thị
           ward_code: item.ward_name, // Dùng tên làm mã
           province_name: item.province_name,
           province_code: item.province_name, // Dùng tên làm mã tỉnh
        });
      }
    });

    return NextResponse.json(results.slice(0, 20));
  } catch (error) {
    return NextResponse.json([]);
  }
}