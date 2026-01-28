// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState, useEffect } from 'react' // (Thêm "não")
import { supabase } from '../../utils/supabaseClient' // (Triệu hồi kho)
import { useAuth } from '../../context/AuthContext' // (Triệu hồi "bảo vệ")
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi "trang điểm")
import { FaTrash } from 'react-icons/fa' // (Triệu hồi Icon "Thùng rác")

// (Kiểu 'MediaItem' - Giữ nguyên)
type MediaItem = {
  id: number;
  post_id: string;
  post_title: string;
  media_url: string;
  media_type: string;
  created_at: string; // (Thêm created_at để sắp xếp)
};

// (Kiểu 'Album' - Giữ nguyên)
type Album = {
  postId: string;
  postTitle: string;
  media: MediaItem[]; 
};

// 💖 2. TRANG "MẶT TIỀN" (ĐÃ NÂNG CẤP) 💖
export default function ThuVienPage() {
  
  // (Thêm "não" trạng thái)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // (Lấy thông tin người dùng)

  // (Kiểm tra xem ông này có "quyền lực" không)
  const canDelete = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role);

  // 💖 3. "PHÉP THUẬT": LẤY DỮ LIỆU (Chuyển vào useEffect) 💖
  useEffect(() => {
    async function getGroupedMedia() {
      console.log('[Thư viện] Đang lấy tất cả media từ kho...');
      setLoading(true);
      
      const { data: mediaData, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false }); // (Lấy cái mới nhất lên đầu)

      if (error) {
        console.error('[Thư viện] Lỗi khi lấy media:', error.message);
        setLoading(false);
        return;
      }
      if (!mediaData) {
        setLoading(false);
        return;
      }

      // (Gom nhóm - Giữ nguyên logic)
      const albumsMap = new Map<string, Album>();
      for (const item of mediaData as MediaItem[]) {
        if (!albumsMap.has(item.post_id)) {
          albumsMap.set(item.post_id, {
            postId: item.post_id,
            postTitle: item.post_title,
            media: [], 
          });
        }
        albumsMap.get(item.post_id)!.media.push(item);
      }
      
      const albumsArray = Array.from(albumsMap.values());
      
      // (Sắp xếp Album: Album nào có ảnh mới nhất sẽ lên đầu)
      // (Cái này hơi "ảo" xíu nhưng nó chạy đúng á anh)
      albumsArray.sort((a, b) => {
        const aNewest = new Date(a.media[0].created_at).getTime();
        const bNewest = new Date(b.media[0].created_at).getTime();
        return bNewest - aNewest;
      });

      console.log(`[Thư viện] Đã gom nhóm thành ${albumsArray.length} albums.`);
      setAlbums(albumsArray); // (Nhét vào "não")
      setLoading(false);
    }
    
    getGroupedMedia(); // (Chạy phép thuật)
  }, []); // (Chạy 1 lần duy nhất)


  // 💖 4. HÀM XÓA 1 ẢNH 💖
  const handleDeleteImage = async (mediaId: number, albumPostId: string) => {
    if (!canDelete) return;
    
    if (confirm('Anh có chắc muốn xóa ảnh này khỏi Thư viện không? (Ảnh trong bài viết gốc vẫn còn)')) {
      try {
        // 4.1. Xóa trên Supabase
        const { error } = await supabase
          .from('media_library')
          .delete()
          .eq('id', mediaId);
          
        if (error) throw error;

        // 4.2. Xóa trong "não" (state) để giao diện cập nhật ngay
        setAlbums(prevAlbums => {
          return prevAlbums.map(album => {
            // (Tìm đúng cái album chứa ảnh đó)
            if (album.postId === albumPostId) {
              // (Tạo lại mảng media mới, bỏ cái ảnh bị xóa ra)
              const updatedMedia = album.media.filter(item => item.id !== mediaId);
              return { ...album, media: updatedMedia };
            }
            return album;
          })
          // (Lọc bỏ luôn album nào bị rỗng)
          .filter(album => album.media.length > 0); 
        });

      } catch (err: any) {
        console.error('Lỗi khi xóa ảnh:', err);
        alert('Lỗi: ' + err.message);
      }
    }
  }

  // 💖 5. HÀM XÓA 1 ALBUM 💖
  const handleDeleteAlbum = async (albumPostId: string, albumTitle: string) => {
    if (!canDelete) return;

    if (confirm(`Anh có chắc muốn XÓA TOÀN BỘ album "${albumTitle}" khỏi Thư viện không? (Bài viết gốc không bị ảnh hưởng)`)) {
      try {
        // 5.1. Xóa trên Supabase (xóa tất cả media có post_id đó)
        const { error } = await supabase
          .from('media_library')
          .delete()
          .eq('post_id', albumPostId);
          
        if (error) throw error;

        // 5.2. Xóa trong "não" (state)
        setAlbums(prevAlbums => 
          prevAlbums.filter(album => album.postId !== albumPostId)
        );

      } catch (err: any) {
        console.error('Lỗi khi xóa album:', err);
        alert('Lỗi: ' + err.message);
      }
    }
  }

  // 💖 6. "VẼ" GIAO DIỆN (ĐÃ THÊM NÚT XÓA) 💖
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thư viện Ảnh & Video</h1>
      
      {/* (Báo "Đang tải...") */}
      {loading && (
        <p className={styles.emptyMessage}>Đang tải Thư viện...</p>
      )}

      {/* (Báo "Rỗng") */}
      {!loading && albums.length === 0 && (
         <p className={styles.emptyMessage}>
            Chưa có media nào trong thư viện. 
            Hãy thử đăng bài viết mới có chèn ảnh nhé!
          </p>
      )}

      {/* (Vẽ các album ra) */}
      {!loading && albums.length > 0 && (
        <div className={styles.albumList}>
          {albums.map((album) => (
            <section key={album.postId} className={styles.albumBox}>
              
              {/* Tiêu đề Album (Đã thêm nút Xóa) */}
              <div className={styles.albumHeader}>
                <h2 className={styles.albumTitle}>
                  <Link href={`/bai-viet/${album.postId}`}>
                    {album.postTitle} 
                    <span>({album.media.length} media)</span>
                  </Link>
                </h2>
                
                {/* (Chỉ sếp mới thấy nút này) */}
                {canDelete && (
                  <button 
                    onClick={() => handleDeleteAlbum(album.postId, album.postTitle)}
                    className={styles.albumDeleteButton}
                    title="Xóa toàn bộ album này khỏi thư viện"
                  >
                    <i><FaTrash /></i> Xóa Album
                  </button>
                )}
              </div>
              
              {/* Lưới chứa các ảnh/video */}
              <div className={styles.mediaGrid}>
                {album.media.map((item) => (
                  // (Bọc cái ảnh bằng "container" mới)
                  <div key={item.id} className={styles.mediaItemContainer}>
                    {/* (Cái ảnh) */}
                    {item.media_type === 'image' && (
                      <a 
                        href={item.media_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.mediaItem}
                      >
                        <img 
                          src={item.media_url} 
                          alt={`Ảnh của bài ${album.postTitle}`} 
                          loading="lazy"
                        />
                      </a>
                    )}
                    
                    {/* (Lớp mờ và Nút xóa - Chỉ sếp mới thấy) */}
                    {canDelete && (
                      <div className={styles.mediaItemOverlay}>
                        <button 
                          onClick={() => handleDeleteImage(item.id, album.postId)}
                          className={styles.mediaDeleteButton}
                          title="Xóa ảnh này khỏi thư viện"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}