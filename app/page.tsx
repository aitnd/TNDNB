// 💖 1. SERVER COMPONENT (Mặc định)
import React from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import FeaturedSlider from '../components/FeaturedSlider'
import PostImage from '../components/PostImage' // 💖 Import Component Mới
import styles from './page.module.css'

// (Hàm tạo tóm tắt - ĐÃ NÂNG CẤP)
function taoTomTat(htmlContent: string, length: number = 150): string {
  if (!htmlContent) return '';

  // 1. Xóa thẻ HTML
  let text = htmlContent.replace(/<[^>]+>/g, '');

  // 2. ✨ GIẢI MÃ HTML ENTITIES (Thủ công) ✨
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
    '&agrave;': 'à', '&Agrave;': 'À', '&aacute;': 'á', '&Aacute;': 'Á',
    '&acirc;': 'â', '&Acirc;': 'Â', '&atilde;': 'ã', '&Atilde;': 'Ã',
    '&egrave;': 'è', '&Egrave;': 'È', '&eacute;': 'é', '&Eacute;': 'É',
    '&ecirc;': 'ê', '&Ecirc;': 'Ê', '&igrave;': 'ì', '&Igrave;': 'Ì',
    '&iacute;': 'í', '&Iacute;': 'Í', '&ograve;': 'ò', '&Ograve;': 'Ò',
    '&oacute;': 'ó', '&Oacute;': 'Ó', '&ocirc;': 'ô', '&Ocirc;': 'Ô',
    '&otilde;': 'õ', '&Otilde;': 'Õ', '&ugrave;': 'ù', '&Ugrave;': 'Ù',
    '&uacute;': 'ú', '&Uacute;': 'Ú', '&ygrave;': 'ỳ', '&Ygrave;': 'Ỳ',
    '&yacute;': 'ý', '&Yacute;': 'Ý', '&yuml;': 'ÿ', '&Yuml;': 'Ÿ',
    '&ndash;': '-', '&mdash;': '—', '&lsquo;': '‘', '&rsquo;': '’',
    '&ldquo;': '“', '&rdquo;': '”'
  };
  text = text.replace(/&[a-zA-Z]+;/g, (match) => entities[match] || match);

  // 3. Xóa khoảng trắng thừa
  text = text.trim().replace(/\s+/g, ' ');

  // 4. Cắt ngắn
  if (text.length <= length) return text;

  const subText = text.substring(0, length);
  const lastSpaceIndex = subText.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return subText.substring(0, lastSpaceIndex) + '...';
  }

  return subText + '...';
}

// (Hàm lấy bài viết mới nhất - Giữ nguyên)
async function getLatestPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Lỗi lấy bài viết:', error);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <div className={styles.container}>

      <section className={styles.featuredSection}>
        <FeaturedSlider />
      </section>

      <div className={styles.layoutGrid}>

        {/* === CỘT 1: NỘI DUNG CHÍNH === */}
        <div className={styles.mainContent}>

          <section className={styles.latestNews}>
            <h2 className={styles.sectionTitle}>Tin tức mới nhất</h2>

            <div className={styles.newsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.newsItemLarge}>
                  <div className={styles.imageWrapper}>
                    {/* 💖 DÙNG COMPONENT MỚI THAY VÌ IMG THƯỜNG 💖 */}
                    <PostImage
                      src={post.thumbnail_url || '/assets/img/logo.png'}
                      alt={post.title}
                      className={styles.postThumb}
                    />
                  </div>
                  <div className={styles.postContent}>
                    <h3>
                      <Link href={`/bai-viet/${post.id}`} className={styles.postTitle}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className={styles.postDate}>
                      <i className="far fa-calendar-alt"></i>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {/* 💖 SỬA LỖI HIỂN THỊ MÃ HTML Ở ĐÂY 💖 */}
                    <p className={styles.postExcerpt}>
                      {taoTomTat(post.content)}
                    </p>

                    <Link href={`/bai-viet/${post.id}`} className={styles.readMore}>
                      Xem chi tiết »
                    </Link>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <p>Chưa có bài viết nào.</p>
              )}
            </div>
          </section>

        </div>

        {/* === CỘT 2: SIDEBAR === */}
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>

      </div>
    </div>
  )
}