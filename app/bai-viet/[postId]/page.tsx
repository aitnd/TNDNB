import { supabase } from '../../../utils/supabaseClient' // (Kho Supabase)
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi CSS)
import { adminDb } from '../../../utils/firebaseAdmin' // (Kho Firestore)

// 💖 1. "TRIỆU HỒI" ICON (cho file PDF/Word) 💖
// (Mình đã cài 'react-icons' ở bước trước rồi)
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile, FaDownload } from 'react-icons/fa'


// "THẦN CHÚ" BẮT TẢI LẠI DỮ LIỆU MỚI
export const revalidate = 0; 

// 💖 2. ĐỊNH NGHĨA "KIỂU" TỆP ĐÍNH KÈM (Copy từ file "Tạo mới") 💖
type Attachment = {
  file_name: string; // (Tên gốc của file)
  file_url: string;  // (Link Supabase)
  file_size: number; // (Kích thước file - tính bằng byte)
  file_type: string; // (Loại file: 'application/pdf')
};

// 3. ĐỊNH NGHĨA "KIỂU" NÂNG CẤP (Thêm 'attachments')
type Post = {
  id: string;
  created_at: string;
  title: string;
  content: string; 
  image_url: string | null;
  category_id: string;
  is_featured: boolean;
  author_id: string; // (ID của tác giả)
  attachments: Attachment[] | null; // (Cái "túi" mình mới thêm)
}

// (Kiểu dữ liệu mới cho trang)
type PostPageData = {
  post: Post;
  authorName: string | null;
}

// 4. "PHÉP THUẬT": LẤY DỮ LIỆU (Giữ nguyên, vì 'select(*)' đã lấy)
async function getPostDetails(postId: string): Promise<PostPageData | null> {
  
  // 3.1. "Hỏi" Kho Supabase để lấy Bài viết
  console.log(`[Server] Lấy bài viết ID: ${postId} từ Supabase...`);
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select('*') // (Dấu '*' là lấy hết, bao gồm cả 'attachments' rồi)
    .eq('id', postId) 
    .single() 

  if (postError || !postData) {
    console.error('Lỗi Supabase (lấy post):', postError);
    return null
  }

  let authorName: string | null = null;
  
  // 3.2. "Hỏi" Kho Firestore để lấy Tên Tác giả
  if (postData.author_id) {
    try {
      console.log(`[Server] Lấy tác giả ID: ${postData.author_id} từ Firestore...`);
      const userDocRef = adminDb.collection('users').doc(postData.author_id);
      const userDoc = await userDocRef.get();
      
      if (userDoc.exists) { // (Đã sửa lỗi .exists)
        authorName = userDoc.data()?.fullName || 'Tác giả';
      } else {
        authorName = 'Tác giả không xác định';
      }
    } catch (firestoreError) {
      console.error('Lỗi Firestore (lấy user):', firestoreError);
      authorName = 'Lỗi khi tải tác giả'; // (Để mình biết lỗi)
    }
  }

  // (Gói 2 kết quả lại)
  return {
    post: postData as Post,
    authorName: authorName
  };
}


// 💖 5. HÀM "DỊCH" FILE (Copy từ file "Tạo mới") 💖

// (Hàm "dịch" kích thước file cho đẹp)
function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// (Hàm "dịch" icon cho file - Bổ sung icon Tải về)
function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return <FaFilePdf className={styles.downloadIcon} />;
  if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={styles.downloadIcon} />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={styles.downloadIcon} />;
  return <FaFile className={styles.downloadIcon} />;
}


// 6. TRANG ĐỌC BÀI VIẾT (ĐÃ SỬA)
export default async function PostPage({ params }: { params: { postId: string } }) {
  
  const data = await getPostDetails(params.postId)

  if (!data) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Lỗi 404</h1>
        <p className={styles.errorMessage}>Không tìm thấy bài viết này.</p>
        <div className={styles.backButtonContainer} style={{borderTop: 'none', marginTop: '1.5rem'}}>
          <Link href="/" className={styles.backButton}>
            Quay về Trang chủ
          </Link>
        </div>
      </div>
    )
  }

  const { post, authorName } = data;

  return (
    <div className={styles.container}>
      
      <h1 className={styles.title}>
        {post.title}
      </h1>

      <p className={styles.meta}>
        Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
        {' | '}
        <span>{post.category_id.replace('-', ' ')}</span>
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className={styles.image}
        />
      )}

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* 💖 7. KHU VỰC HIỂN THỊ TỆP ĐÍNH KÈM (MỚI) 💖 */}
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
                    download={file.file_name} // (Thuộc tính 'download' giúp tải về)
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
                    <FaDownload style={{marginLeft: 'auto', color: '#555'}} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* 💖 HẾT KHU VỰC MỚI 💖 */}


      {authorName && (
        <p className={styles.authorName}>
          Đăng bởi: {authorName}
        </p>
      )}
      
      <div className={styles.backButtonContainer}>
        <Link href="/" className={styles.backButton}>
          « Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}