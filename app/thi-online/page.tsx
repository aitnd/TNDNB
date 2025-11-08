// "Phòng Chờ" - Nơi chọn "Hạng Bằng" để thi

// 1. "Nhấc máy" gọi "tổng đài" Supabase của mình
import { supabase } from '@/utils/supabaseClient'
import Link from 'next/link'

// 2. Định nghĩa "kiểu" của Hạng Bằng
//    (Mình "dặn" TypeScript "xịn" là data trông như vầy nè)
type License = {
  id: string;   // Ví dụ: 'maytruong-h1'
  name: string; // Ví dụ: 'Máy trưởng hạng nhất - M1'
  display_order: number;
}

// 3. "Phép thuật" Siêu An Toàn của Next.js (Server Component)
//    Code trong hàm này CHẠY TRÊN MÁY CHỦ, 100% BÍ MẬT!
//    Nên mình "vô tư" gọi Supabase ở đây mà không sợ "lộ chìa khóa"
async function layDanhSachHangBang() {
  console.log('Đang gọi "kho báu" Supabase từ máy chủ...')

  const { data, error } = await supabase
    .from('licenses') // Lấy từ "ngăn" licenses
    .select('*')      // Lấy hết các cột
    .order('display_order', { ascending: true }) // Sắp xếp theo thứ tự

  if (error) {
    console.error('Lỗi khi lấy "hạng bằng":', error)
    return [] // Trả về mảng rỗng nếu lỗi
  }

  console.log('Lấy "hạng bằng" thành công!')
  return data as License[] // "Hứa" với TS là data này là mảng License
}


// 4. "Phòng chờ" chính (chữ "async" là "chìa khóa" đó)
export default async function ThiOnlinePage() {
  
  // 5. "Chờ" máy chủ lấy "hạng bằng" về
  const licenses = await layDanhSachHangBang()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">
        Phòng Chờ Thi Online
      </h1>
      <p className="text-center text-lg text-gray-700 mb-12">
        Cưng ơi, chọn "Hạng Bằng" mà cưng muốn thi nha:
      </p>

      {/* 6. "Vẽ" danh sách "hạng bằng" ra nè */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {licenses.map((license) => (
          <Link
            // Đây là link "xịn" nè cưng, nó sẽ đi tới:
            // /thi-online/maytruong-h1 (ví dụ)
            href={`/thi-online/${license.id}`}
            key={license.id}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-blue-700">
              {license.name}
            </h2>
            <p className="text-gray-600 mt-2">
              (ID: {license.id})
            </p>
          </Link>
        ))}

        {licenses.length === 0 && (
          <p className="text-center text-red-500 col-span-2">
            Ui, không lấy được danh sách "hạng bằng" rồi cưng ơi!
            (Kiểm tra lại "chìa khóa" Supabase trong file .env.local nha!)
          </p>
        )}
      </div>
    </div>
  )
}