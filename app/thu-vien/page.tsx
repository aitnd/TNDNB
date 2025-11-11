import { supabase } from '../../utils/supabaseClient' // (Triệu hồi kho)
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi "trang điểm")

// 💖 "Thần chú" bắt tải lại dữ liệu mới (Checkpoint 7, Lỗi Cache)
export const revalidate = 0; 

// 1. Định nghĩa "kiểu" của media
type MediaItem = {
  id: number;
  post_id: string;
  post_title: string;
  media_url: string;
  media_type: string;
};

// 2. Định nghĩa "kiểu" của Album (sau khi gom nhóm)
type Album = {
  postId: string;
  postTitle: string;
  media: MediaItem[]; // (Một mảng chứa các ảnh/video)
};

// 3. "Phép thuật": Lấy và Gom nhóm Media
async function getGroupedMedia(): Promise<Album[]> {
  console.log('[Thư viện] Đang lấy tất cả media từ kho...');
  
  // 3.1. Lấy tất cả media, sắp xếp theo bài viết
  const { data: mediaData, error } = await supabase
    .from('media_library')
    .select('*')
    .order('post_title', { ascending: true }) // (Sắp xếp theo tên album)
    .order('created_at', { ascending: false }); // (Ảnh mới nhất lên đầu album)

  if (error) {
    console.error('[Thư viện] Lỗi khi lấy media:', error.message);
    return [];
  }
  if (!mediaData) {
    return [];
  }

  // 3.2. "Phép thuật" Gom nhóm (Dùng Map)
  // (Cách này hiệu quả hơn "reduce" em nói lúc trước á anh)
  const albumsMap = new Map<string, Album>();

  for (const item of mediaData as MediaItem[]) {
    // Nếu chưa có album cho bài viết này, tạo album mới
    if (!albumsMap.has(item.post_id)) {
      albumsMap.set(item.post_id, {
        postId: item.post_id,
        postTitle: item.post_title,
        media: [], // (Một rổ rỗng)
      });
    }
    
    // "Nhét" ảnh/video này vào đúng "rổ" (album) của nó
    albumsMap.get(item.post_id)!.media.push(item);
  }

  // 3.3. Chuyển từ Map về mảng (Array) để "vẽ" ra
  const albumsArray = Array.from(albumsMap.values());
  
  console.log(`[Thư viện] Đã gom nhóm thành ${albumsArray.length} albums.`);
  return albumsArray;
}


// 4. Trang "Mặt tiền" Thư viện (Server Component)
export default async function ThuVienPage() {
  
  const albums = await getGroupedMedia();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thư viện Ảnh & Video</h1>
      
      {/* 5. "Vẽ" các album ra */}
      <div className={styles.albumList}>
        {albums.length > 0 ? (
          albums.map((album) => (
            <section key={album.postId} className={styles.albumBox}>
              
              {/* Tiêu đề Album (Bấm vào sẽ nhảy về bài viết gốc) */}
              <h2 className={styles.albumTitle}>
                <Link href={`/bai-viet/${album.postId}`}>
                  {album.postTitle} 
                  <span>({album.media.length} media)</span>
                </Link>
              </h2>
              
              {/* Lưới chứa các ảnh/video */}
              <div className={styles.mediaGrid}>
                {album.media.map((item) => (
                  <div key={item.id} className={styles.mediaItem}>
                    {/* (Mình sẽ làm cho video sau, giờ chỉ hiện ảnh) */}
                    {item.media_type === 'image' && (
                      <a href={item.media_url} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={item.media_url} 
                          alt={`Ảnh của bài ${album.postTitle}`} 
                          loading="lazy"
                        />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className={styles.emptyMessage}>
            Chưa có media nào trong thư viện. 
            Hãy thử đăng bài viết mới có chèn ảnh nhé!
          </p>
        )}
      </div>
    </div>
  );
}