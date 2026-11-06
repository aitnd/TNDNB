import { supabase } from '../../../utils/supabaseClient' // (Kho Supabase)
import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css' // (Triệu hồi CSS)
import { adminDb } from '../../../utils/firebaseAdmin' // (Kho Firestore)

// (Triệu hồi Icon)
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile, FaDownload } from 'react-icons/fa'
// (Triệu hồi Box Bình luận)
import FacebookComments from '../../../components/FacebookComments'
// (Triệu hồi Nút bấm)
import PostFooterActions from '../../../components/PostFooterActions'

// BẬT ISR 60 GIÂY ĐỂ ĐẠT HIỆU NĂNG ĐIỀU HƯỚNG DƯỚI 50MS
export const revalidate = 60;

// (Kiểu 'Attachment' - Giữ nguyên)
type Attachment = {
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

// (Kiểu 'Post' - Giữ nguyên)
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
  thumbnail_url: string | null;
  category_id: string;
  is_featured: boolean;
  author_id: string;
  attachments: Attachment[] | null;
}

// BỘ ĐỆM BỘ NHỚ TÁC GIẢ KÈM TTL 10 PHÚT VÀ TIMEOUT 1500MS
const AUTHOR_CACHE_TTL_MS = 10 * 60 * 1000;
const authorCache = new Map<string, { name: string; expiresAt: number }>();

async function resolveAuthorName(authorId: string | null | undefined): Promise<string | null> {
  if (!authorId) return null;

  const now = Date.now();
  const cached = authorCache.get(authorId);
  if (cached && cached.expiresAt > now) {
    return cached.name;
  }

  if (!adminDb) {
    return 'Ban Biên Tập';
  }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  try {
    const lookupPromise = adminDb
      .collection('users')
      .doc(authorId)
      .get()
      .then((userDoc) => (userDoc.exists ? userDoc.data()?.fullName || 'Ban Biên Tập' : 'Ban Biên Tập'));

    const timeoutPromise = new Promise<string>((resolve) => {
      timeoutHandle = setTimeout(() => resolve('Ban Biên Tập'), 1500);
    });

    const resolvedName = await Promise.race([lookupPromise, timeoutPromise]);
    authorCache.set(authorId, { name: resolvedName, expiresAt: now + AUTHOR_CACHE_TTL_MS });
    return resolvedName;
  } catch (firestoreError) {
    console.warn('Timeout/lỗi nhẹ khi tải tên tác giả từ Firestore:', firestoreError);
    return 'Ban Biên Tập';
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

// Hàm lấy dữ liệu bài viết từ Supabase
async function getPost(postId: string): Promise<Post | null> {
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (postError || !postData) {
    console.error('Lỗi Supabase (lấy post):', postError);
    return null;
  }

  return postData as Post;
}

// (Hàm lấy bài viết liên quan - Giữ nguyên)
async function getRelatedPosts(categoryId: string, currentPostId: string): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, thumbnail_url')
      .eq('category_id', categoryId)
      .neq('id', currentPostId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;
    return (data as Post[]) || [];
  } catch (err: any) {
    console.error('Lỗi khi lấy bài viết liên quan:', err.message);
    return [];
  }
}

// (Hàm "dịch" file - Giữ nguyên)
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// (Hàm "dịch" icon - Giữ nguyên)
function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return <FaFilePdf className={styles.downloadIcon} />;
  if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={styles.downloadIcon} />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={styles.downloadIcon} />;
  return <FaFile className={styles.downloadIcon} />;
}

// (TRANG ĐỌC BÀI VIẾT)
export default async function PostPage({ params }: { params: { postId: string } }) {
  const post = await getPost(params.postId);

  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Lỗi 404</h1>
        <p className={styles.errorMessage}>Không tìm thấy bài viết này.</p>
        <div className={styles.backButtonContainer} style={{ borderTop: 'none', marginTop: '1.5rem' }}>
          <Link href="/" className={styles.backButton}>
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Tải đồng thời Tác giả và Bài viết liên quan (Promise.all - Xóa bỏ Waterfall)
  const [authorName, relatedPosts] = await Promise.all([
    resolveAuthorName(post.author_id),
    getRelatedPosts(post.category_id, post.id),
  ]);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {post.title}
        </h1>

        <p className={styles.meta}>
          Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
          {' | '}
          <span>{post.category_id.replace('-', ' ')}</span>
        </p>

        {post.thumbnail_url && (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            width={800}
            height={450}
            style={{ objectFit: 'cover' }}
            className={styles.image}
          />
        )}

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* (KHU VỰC TỆP ĐÍNH KÈM - Giữ nguyên) */}
        {post.attachments && post.attachments.length > 0 && (
          <section className={styles.attachmentSection}>
            <h2 className={styles.attachmentTitle}>Tệp đính kèm</h2>
            <ul className={styles.attachmentList}>
              {post.attachments.map((file, index) => (
                <li key={index}>
                  {/* (Nếu là PDF -> Hiện khung xem) */}
                  {file.file_type === 'application/pdf' ? (
                    <div className={styles.pdfViewerContainer}>
                      <h3 className={styles.pdfViewerTitle}>{file.file_name}</h3>
                      <iframe
                        src={file.file_url}
                        className={styles.pdfViewer}
                        title={file.file_name}
                      >
                        Trình duyệt của bạn không hỗ trợ xem PDF.
                        <a href={file.file_url} download={file.file_name} rel="noopener noreferrer">
                          Tải tệp về
                        </a>
                      </iframe>
                    </div>
                  ) : (
                    /* (Nếu là file khác -> Hiện link tải) */
                    <a
                      href={file.file_url}
                      download={file.file_name}
                      className={styles.downloadLink}
                      rel="noopener noreferrer"
                    >
                      {getFileIcon(file.file_type)}
                      <div className={styles.downloadInfo}>
                        <span className={styles.downloadName}>{file.file_name}</span>
                        <span className={styles.downloadSize}>
                          ({formatFileSize(file.file_size)})
                        </span>
                      </div>
                      <FaDownload style={{ marginLeft: 'auto', color: '#555' }} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        {/* HẾT KHU VỰC TỆP ĐÍNH KÈM */}

        {authorName && (
          <p className={styles.authorName}>
            Đăng bởi: {authorName}
          </p>
        )}

        {/* KHU VỰC "BÀI VIẾT KHÁC" */}
        {relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Bài viết khác</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className={styles.relatedCard}>
                  <Link href={`/bai-viet/${relatedPost.id}`}>
                    <Image
                      src={relatedPost.thumbnail_url || 'https://via.placeholder.com/300x150?text=TND+Ninh+Binh'}
                      alt={relatedPost.title}
                      width={300}
                      height={150}
                      style={{ objectFit: 'cover' }}
                      className={styles.relatedImage}
                    />
                  </Link>

                  <div className={styles.relatedInfo}>
                    <h3>
                      <Link href={`/bai-viet/${relatedPost.id}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p>{new Date(relatedPost.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Nút Bấm Cuối bài */}
        <PostFooterActions />
      </div>

      {/* Box Bình luận Facebook */}
      <FacebookComments />
    </>
  );
}
