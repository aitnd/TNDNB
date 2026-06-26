// 💖 1. ĐÁNH DẤU CLIENT COMPONENT 💖
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../utils/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
// 💖💖💖 ĐÃ XÓA Sidebar ở đây 💖💖💖
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

  // 💖 4. "PHÉP THUẬT" TỰ ĐỘNG TÌM KIẾM (ĐÃ NÂNG CẤP) 💖
  useEffect(() => {
    // (Nếu không có từ khóa, hoặc từ khóa rỗng thì không làm gì)
    if (!query || !query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      
      try {
        // (Đây là "câu thần chú" tìm kiếm Full-text-search)
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%,attachments::text.ilike.%${query}%`)
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


  // 💖 5. GIAO DIỆN TRANG KẾT QUẢ (Đã xóa layout) 💖
  return (
    <section className={styles.widgetBox}>
      <h2 className={styles.widgetTitle}>
        {query ? (
          <>
            Kết quả tìm kiếm cho: <span>&quot;{query}&quot;</span>
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
              <Image
                src={post.thumbnail_url || 'https://via.placeholder.com/150x100'}
                alt={post.title}
                width={150}
                height={100}
                style={{ objectFit: 'cover' }}
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
  ); // 💖💖💖 EM ĐÃ SỬA DẤU ")" THÀNH ";" Ở ĐÂY 💖💖💖
}

// 💖 6. BỌC BẰNG "SUSPENSE" (Bắt buộc) 💖
export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.emptyMessage}>Đang tải trang tìm kiếm...</div>}>
      <SearchResults />
    </Suspense>
  ); // 💖💖💖 VÀ SỬA CẢ Ở ĐÂY NỮA 💖💖💖
}