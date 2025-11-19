// app/api/search/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

// Hàm xóa dấu tiếng Việt (Copy từ code gốc)
function removeVietnameseTones(str: string) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json([]);

  try {
    // 1. Đọc file dữ liệu
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    // Lưu ý: Đảm bảo anh đã copy file data-new.json và đổi tên thành data.json ở bước 2
    const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');
    const data = JSON.parse(fileContents);

    const keyword = q.toLowerCase();
    const keywordNoSign = removeVietnameseTones(keyword);
    let results: any[] = [];

    // 2. Logic tìm kiếm (Mô phỏng lại logic của họ)
    // Kiểm tra xem cấu trúc data là mảng [] hay object {data: []}
    const list = Array.isArray(data) ? data : (data.data || []);

    list.forEach((item: any) => {
        // Tìm theo tên Mới
        const nameNew = item.ward_name || '';
        const nameNewLower = nameNew.toLowerCase();
        const nameNewNoSign = removeVietnameseTones(nameNewLower);

        // Tìm theo tên Cũ (nếu có)
        let matchOld = false;
        if (item.old_units && Array.isArray(item.old_units)) {
            matchOld = item.old_units.some((old: string) => {
                const oldLower = old.toLowerCase();
                const oldNoSign = removeVietnameseTones(oldLower);
                return oldLower.includes(keyword) || oldNoSign.includes(keywordNoSign);
            });
        }

        if (nameNewLower.includes(keyword) || nameNewNoSign.includes(keywordNoSign) || matchOld) {
            results.push({
                type: 'ward',
                name: item.ward_name,
                province_name: item.province_name,
                district_name: item.district_name || '',
                old_units: item.old_units,
                has_merger: item.has_merger
            });
        }
    });

    // Giới hạn kết quả
    return NextResponse.json(results.slice(0, 20));

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}