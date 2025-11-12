// 💖 1. ĐÁNH DẤU CLIENT COMPONENT 💖
// (Vì mình cần đọc cái "đuôi" ?q=... (useSearchParams)
//  và cần "não" (useState, useEffect) để tải kết quả)
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'
import styles from './page.module.css' // (Dùng CSS của chính nó)

// (Kiểu 'Post' y như trang Danh mục)
type Post = {
  id: string;
  created_at: string;
  title: string;
  image_url: string | null;
  content: string; 
  thumbnail_url: string | null;
}

// 💖 2. HÀM "THẦN KỲ" TẠO TÓM TẮT (Copy từ file "danh-muc") 💖
function taoTomTat(htmlContent: string, length: number = 120): string {
  if (!htmlContent) {
    return '';
  }
  let text = htmlContent.replace(/<[^>]+>/g, '');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.trim(); 
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
}

// 💖 3. "BỘ NÃO" CỦA TRANG TÌM KIẾM 💖
function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // (Lấy từ khóa ?q=... ra)

  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 💖 4. "PHÉP THUẬT" TỰ ĐỘNG TÌM KIẾM 💖
  useEffect(() => {
    // (Nếu không có từ khóa, hoặc từ khóa rỗng thì không làm gì)
    if (!query || !query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function fetchResults() {
      console.log(`Đang tìm kiếm với từ khóa: ${query}`);
      setLoading(true);
      
      try {
        // (Đây là "câu thần chú" tìm kiếm Full-text-search)
        // (Mình sẽ tìm từ khóa (đã xử lý) trong 2 cột 'title' và 'content')
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          // (Mình dùng 'ilike' (không phân biệt hoa-thường) 
          //  và '%' (đại diện cho ký tự bất kỳ))
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        setResults(data || []);

      } catch (err: any) {
        console.error('Lỗi khi tìm kiếm:', err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]); // (Tự chạy lại khi 'query' thay đổi)


  // 💖 5. GIAO DIỆN TRANG KẾT QUẢ 💖
  return (
    <div className={styles.container}>
      <div className={styles.layoutGrid}>

        {/* ===== CỘT TRÁI (KẾT QUẢ) ===== */}
        <main className={styles.mainContent}>
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>
              {query ? (
                <>
                  Kết quả tìm kiếm cho: <span>"{query}"</span>
                </>
              ) : (
                'Vui lòng nhập từ khóa để tìm kiếm'
              )}
            </h2>
            
            {loading && (
              <p className={styles.emptyMessage}>Đang tìm...</p>
            )}

            {!loading && results.length === 0 && (
              <p className={styles.emptyMessage}>
                Không tìm thấy bài viết hoặc tài liệu nào khớp.
              </p>
            )}

            {!loading && results.length > 0 && (
              <div className={styles.newsList}>
                {results.map((post) => (
                  <div key={post.id} className={styles.newsItemLarge}>
                    <img
                      src={post.thumbnail_url || 'https://via.placeholder.com/150x100'}
                      alt={post.title}
                    />
                    <div>
                      <h3>
                        <Link href={`/bai-viet/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p>
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                      <p className={styles.excerpt}>
                        {taoTomTat(post.content, 120)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        <Sidebar />

      </div>
    </div>
  )
}

// 💖 6. BỌC BẰNG "SUSPENSE" (Bắt buộc) 💖
// (Vì 'useSearchParams' cần "thời gian" để "tỉnh dậy",
//  nên Next.js bắt mình bọc nó trong Suspense)
export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.emptyMessage}>Đang tải trang tìm kiếm...</div>}>
      <SearchResults />
    </Suspense>
  )
}