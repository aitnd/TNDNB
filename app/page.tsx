import Image from 'next/image'
import Link from 'next/link' // 1. "Triệu hồi" cái link "xịn"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-700">
        Chào mừng cưng đến "Biệt thự" Next.js! 💖
      </h1>
      <p className="mt-4 text-lg mb-8">
        "Kho báu" Supabase của cưng đã kết nối!
      </p>

      {/* 2. Thêm cái nút "xịn" nè */}
      <Link 
        href="/thi-online" 
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg text-xl shadow-lg hover:bg-blue-700 transition-colors"
      >
        Vào Phòng Chờ Thi
      </Link>
    </main>
  )
}