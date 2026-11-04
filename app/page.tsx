import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import FeaturedSlider from '../components/FeaturedSlider'
import PostImage from '../components/PostImage'
import styles from './page.module.css'

function taoTomTat(htmlContent: string, length: number = 160): string {
  if (!htmlContent) return '';
  let text = htmlContent.replace(/<[^>]+>/g, '');
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
  text = text.trim().replace(/\s+/g, ' ');
  if (text.length <= length) return text;
  const subText = text.substring(0, length);
  const lastSpaceIndex = subText.lastIndexOf(' ');
  return lastSpaceIndex > 0 ? subText.substring(0, lastSpaceIndex) + '...' : subText + '...';
}

async function getLatestPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Lỗi lấy bài viết:', error);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const posts = await getLatestPosts();
  const leadPost = posts[0] || null;
  const briefingPosts = posts.slice(1, 5);
  const feedPosts = posts.slice(1);

  return (
    <div className={styles.container}>
      <section className={styles.featuredSection}>
        <FeaturedSlider />
      </section>

      {/* === HALLMARK H2: SPLIT DIPTYCH (TIÊU ĐIỂM ĐÀO TẠO & BẢN TIN HỌC VỤ) === */}
      {leadPost && (
        <section className={styles.editorialDiptych} aria-label="Tiêu điểm đào tạo">
          <article className={styles.leadStory}>
            <div className={styles.leadImageFrame}>
              <PostImage
                src={leadPost.thumbnail_url || '/assets/img/logo.png'}
                alt={leadPost.title}
                className={styles.leadImage}
              />
            </div>
            <div className={styles.leadBody}>
              <div className={styles.leadMeta}>
                <span className={styles.kickerTag}>TIÊU ĐIỂM ĐÀO TẠO</span>
                <span className={styles.metaDate}>
                  {new Date(leadPost.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <h1 className={styles.leadHeadline}>
                <Link href={`/bai-viet/${leadPost.id}`}>{leadPost.title}</Link>
              </h1>
              <p className={styles.leadDeck}>{taoTomTat(leadPost.content, 220)}</p>
              <Link href={`/bai-viet/${leadPost.id}`} className={styles.editorialLink}>
                Đọc toàn văn bản tin →
              </Link>
            </div>
          </article>

          <aside className={styles.briefingColumn}>
            <div className={styles.briefingHeader}>
              <span className={styles.briefingCode}>BẢN TIN HỌC VỤ</span>
              <h2 className={styles.briefingHeading}>Thông báo &amp; Tuyển sinh mới</h2>
            </div>
            <ol className={styles.briefingList}>
              {briefingPosts.map((item, idx) => (
                <li key={item.id} className={styles.briefingItem}>
                  <span className={styles.briefingIndex}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.briefingContent}>
                    <Link href={`/bai-viet/${item.id}`} className={styles.briefingTitle}>
                      {item.title}
                    </Link>
                    <time className={styles.briefingDate}>
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </section>
      )}

      <div className={styles.layoutGrid}>
        {/* === CỘT 1: CHUYÊN MỤC TIN TỨC & SỰ KIỆN (Hallmark S1 Header) === */}
        <div className={styles.mainContent}>
          <section className={styles.latestNews}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIndex}>01</span> — TIN TỨC &amp; SỰ KIỆN ĐÀO TẠO
              </h2>
              <Link href="/danh-muc/tin-tuc-su-kien" className={styles.sectionViewAll}>
                Xem tất cả chuyên mục →
              </Link>
            </div>

            <div className={styles.newsGrid}>
              {(feedPosts.length > 0 ? feedPosts : posts).map((post) => (
                <article key={post.id} className={styles.newsCard}>
                  <div className={styles.imageWrapper}>
                    <PostImage
                      src={post.thumbnail_url || '/assets/img/logo.png'}
                      alt={post.title}
                      className={styles.postThumb}
                    />
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postDate}>
                      <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h3>
                      <Link href={`/bai-viet/${post.id}`} className={styles.postTitle}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className={styles.postExcerpt}>{taoTomTat(post.content, 140)}</p>
                    <Link href={`/bai-viet/${post.id}`} className={styles.readMore}>
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}

              {posts.length === 0 && <p>Chưa có bài viết nào.</p>}
            </div>
          </section>
        </div>

        {/* === CỘT 2: SIDEBAR CHUYÊN MỤC === */}
        <div className={styles.sidebarWrapper}>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
