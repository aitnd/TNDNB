import { supabase } from '../utils/supabaseClient' // "Tổng đài" Supabase
import Link from 'next/link'
import Image from 'next/image'

// 1. Định nghĩa "kiểu" của Bài viết (đọc từ Supabase)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
}

// 2. "Phép thuật": TỰ ĐỘNG LẤY TIN TỨC (Chạy ở Máy chủ)

// Hàm lấy "Tin Tiêu Điểm"
async function getFeaturedPosts(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tiêu Điểm...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_featured', true) // Lấy tin có "dấu" Tiêu điểm
    .order('created_at', { ascending: false })
    .limit(3) // Lấy 3 tin mới nhất

  if (error) {
    console.error('Lỗi lấy Tin Tiêu Điểm:', error)
    return []
  }
  return data || []
}

// Hàm lấy "Tin Tức Mới"
async function getLatestNews(): Promise<Post[]> {
  console.log('[Server] Đang lấy Tin Tức Mới...')
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', 'tin-tuc-su-kien') // Lấy tin thuộc "Tin tức"
    .eq('is_featured', false) // Bỏ qua tin đã ở "Tiêu điểm"
    .order('created_at', { ascending: false })
    .limit(5) // Lấy 5 tin mới nhất

  if (error) {
    console.error('Lỗi lấy Tin Tức Mới:', error)
    return []
  }
  return data || []
}

// 3. TRANG CHỦ (SERVER COMPONENT)
export default async function HomePage() {
  
  // 4. "Chờ" máy chủ lấy 2 loại tin
  const featuredPosts = await getFeaturedPosts()
  const latestNews = await getLatestNews()

  // 5. "Vẽ" Giao diện (dùng Tailwind CSS - y hệt trang tĩnh)
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* BỐ CỤC 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ===== CỘT TRÁI (NỘI DUNG CHÍNH) ===== */}
        <main className="lg:col-span-2 space-y-8">
          
          {/* Box Tin Tiêu Điểm (ĐỘNG) */}
          <section className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold text-blue-800 p-4 border-b">
              Tin tiêu điểm
            </h2>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post) => (
                  <div key={post.id} className="border rounded-md overflow-hidden">
                    <img
                      src={post.image_url || 'https://via.placeholder.com/300x200'}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 hover:text-blue-700">
                        {/* (Link bài viết chi tiết - Sắp làm) */}
                        <Link href={`/bai-viet/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có tin tiêu điểm nào.</p>
              )}
            </div>
          </section>

          {/* Box Tin Tức Mới (ĐỘNG) */}
          <section className="bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold text-blue-800 p-4 border-b">
              Tin tức - Sự kiện
            </h2>
            <div className="p-4 space-y-4">
              {latestNews.length > 0 ? (
                latestNews.map((post) => (
                  <div key={post.id} className="flex gap-4 border-b pb-4 last:border-b-0">
                    <img
                      src={post.image_url || 'https://via.placeholder.com/150x100'}
                      alt={post.title}
                      className="w-1/3 md:w-1/4 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-700">
                        <Link href={`/bai-viet/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Chưa có tin tức nào.</p>
              )}
            </div>
          </section>

        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        {/* (Sidebar này mình làm TĨNH y hệt trang HTML cũ) */}
        <aside className="lg:col-span-1 space-y-8">

          {/* Box Văn bản pháp quy (search) */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 border-b pb-2 mb-4">
              Văn bản pháp quy
            </h3>
            <form className="space-y-3">
              <input 
                type="text" 
                placeholder="Tìm văn bản..." 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
              >
                Xem tiếp
              </button>
            </form>
          </div>
            
          {/* Box Bảng tin */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 border-b pb-2 mb-4">
              Bảng tin
            </h3>
            <ul className="space-y-3">
              {/* (Sau này mình cũng "động" hóa cái này) */}
              <li><Link href="#" className="flex items-center text-gray-700 hover:text-blue-700">
                <i className="fas fa-caret-right text-blue-700 mr-2"></i> Thông báo tuyển sinh TMT, CCCM
              </Link></li>
              <li><Link href="#" className="flex items-center text-gray-700 hover:text-blue-700">
                <i className="fas fa-caret-right text-blue-700 mr-2"></i> Thông báo VEC v/v hồ sơ...
              </Link></li>
              <li><Link href="#" className="flex items-center text-gray-700 hover:text-blue-700">
                <i className="fas fa-caret-right text-blue-700 mr-2"></i> Tuyển dụng nhân viên 2025
              </Link></li>
            </ul>
          </div>
{/* Box Video */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 border-b pb-2 mb-4">
              Video
            </h3>
            <iframe 
                width="100%" 
                height="200" 
                src="https://www.youtube.com/embed/VIDEO_ID_CUA_BAN" 
                frameBorder="0" /* <-- SỬA Ở ĐÂY (chữ B viết hoa) */
                allowFullScreen /* (cũng nên viết hoa chữ S) */
                className="rounded-md"
            ></iframe>
          </div>

        </aside>

      </div>
    </div>
  )
}