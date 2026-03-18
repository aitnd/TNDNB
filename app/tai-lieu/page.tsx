// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState, useEffect } from 'react' // (Thêm "não")
import { supabase } from '../../utils/supabaseClient' // (Triệu hồi kho)
import { useAuth } from '../../context/AuthContext' // (Triệu hồi "bảo vệ")
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi "trang điểm" MỚI)
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile, FaDownload, FaTrash } from 'react-icons/fa' // (Triệu hồi Icon)

// (Kiểu 'Attachment' - Copy từ file 'tao-moi')
type Attachment = {
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

// (Kiểu 'Album' - Giờ 'media' là Attachment[])
type Album = {
  postId: string;
  postTitle: string;
  media: Attachment[]; // (Chứa PDF, Word...)
};

// 💖 2. TRANG "MẶT TIỀN" (ĐÃ NÂNG CẤP) 💖
export default function TaiLieuPage() {
  
  // (Thêm "não" trạng thái)
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // (Lấy thông tin người dùng)

  // (Kiểm tra xem ông này có "quyền lực" không)
  const canDelete = user && ['admin', 'lanh_dao', 'quan_ly'].includes(user.role);

  // 💖 3. "PHÉP THUẬT": LẤY DỮ LIỆU (Đã "phẫu thuật") 💖
  useEffect(() => {
    async function getGroupedFiles() {

      setLoading(true);
      
      const { data: postData, error } = await supabase
        .from('posts')
        .select('id, title, attachments, created_at') // (Lấy cột 'attachments')
        .not('attachments', 'is', null) // (Bỏ qua bài nào không có tệp)
        .order('created_at', { ascending: false }); // (Bài mới nhất lên đầu)

      if (error) {
        console.error('[Tài liệu] Lỗi khi lấy posts:', error.message);
        setLoading(false);
        return;
      }
      if (!postData) {
        setLoading(false);
        return;
      }

      // (Gom nhóm)
      const albumsArray: Album[] = postData
        .map(post => ({
          postId: post.id,
          postTitle: post.title,
          media: (post.attachments || []) as Attachment[], // (Lấy "túi" tệp)
        }))
        // (Lọc bỏ bài nào có 'attachments' mà lại rỗng [])
        .filter(album => album.media.length > 0); 
      

      setAlbums(albumsArray); // (Nhét vào "não")
      setLoading(false);
    }
    
    getGroupedFiles(); // (Chạy phép thuật)
  }, []); // (Chạy 1 lần duy nhất)


  // 💖 4. HÀM XÓA 1 FILE (Nâng cấp) 💖
  const handleDeleteFile = async (postId: string, fileUrlToDelete: string, fileName: string) => {
    if (!canDelete) return;
    
    if (confirm(`Anh có chắc muốn xóa tệp "${fileName}" khỏi bài viết này không?`)) {
      try {
        // 4.1. Lấy "túi" tệp hiện tại
        const currentAlbum = albums.find(a => a.postId === postId);
        if (!currentAlbum) throw new Error('Không tìm thấy album?');

        // 4.2. Tạo "túi" mới (bỏ file bị xóa ra)
        const updatedAttachments = currentAlbum.media.filter(
          file => file.file_url !== fileUrlToDelete
        );

        // 4.3. Cập nhật "túi" mới vào Supabase
        const { error } = await supabase
          .from('posts')
          .update({ attachments: updatedAttachments }) // (Ghi đè "túi" mới)
          .eq('id', postId);
          
        if (error) throw error;

        // 4.4. Cập nhật "não" (state) để giao diện "biến mất"
        setAlbums(prevAlbums => {
          return prevAlbums.map(album => {
            if (album.postId === postId) {
              return { ...album, media: updatedAttachments };
            }
            return album;
          })
          .filter(album => album.media.length > 0); // (Lọc bỏ album rỗng)
        });

      } catch (err: any) {
        console.error('Lỗi khi xóa tệp:', err);
        alert('Lỗi: ' + err.message);
      }
    }
  }

  // 💖 5. HÀM XÓA 1 ALBUM (Nâng cấp) 💖
  const handleDeleteAlbum = async (postId: string, albumTitle: string) => {
    if (!canDelete) return;

    if (confirm(`Anh có chắc muốn XÓA TOÀN BỘ ${albums.find(a => a.postId === postId)?.media.length} tệp đính kèm trong album "${albumTitle}" không?`)) {
      try {
        // 5.1. Cập nhật "túi" rỗng [] vào Supabase
        const { error } = await supabase
          .from('posts')
          .update({ attachments: [] }) // (Set nó về rỗng)
          .eq('id', postId);
          
        if (error) throw error;

        // 5.2. Xóa trong "não" (state)
        setAlbums(prevAlbums => 
          prevAlbums.filter(album => album.postId !== postId)
        );

      } catch (err: any) {
        console.error('Lỗi khi xóa album tệp:', err);
        alert('Lỗi: ' + err.message);
      }
    }
  }
  
  // (Hàm "dịch" kích thước file - Giữ nguyên)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // (Hàm "dịch" icon cho file - Giữ nguyên)
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className={styles.fileIcon} />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={styles.fileIcon} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={styles.fileIcon} />;
    return <FaFile className={styles.fileIcon} />;
  }


  // 💖 6. "VẼ" GIAO DIỆN (ĐÃ THAY BẰNG DANH SÁCH TỆP) 💖
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tài liệu</h1>
      
      {/* (Báo "Đang tải...") */}
      {loading && (
        <p className={styles.emptyMessage}>Đang tải Tài liệu...</p>
      )}

      {/* (Báo "Rỗng") */}
      {!loading && albums.length === 0 && (
         <p className={styles.emptyMessage}>
            Chưa có tài liệu nào được đính kèm. 
            Hãy thử đăng bài viết mới và đính kèm file PDF hoặc Word nhé!
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
                    <span>({album.media.length} tệp)</span>
                  </Link>
                </h2>
                
                {/* (Chỉ sếp mới thấy nút này) */}
                {canDelete && (
                  <button 
                    onClick={() => handleDeleteAlbum(album.postId, album.postTitle)}
                    className={styles.albumDeleteButton}
                    title="Xóa toàn bộ tệp trong album này"
                  >
                    <i><FaTrash /></i> Xóa Album
                  </button>
                )}
              </div>
              
              {/* Danh sách tệp đính kèm (Thay cho lưới ảnh) */}
              <ul className={styles.fileList}>
                {album.media.map((file, index) => (
                  <li key={index}>
                    <a 
                      href={file.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.fileItem}
                      download={file.file_name}
                      title={`Tải về ${file.file_name}`}
                    >
                      {getFileIcon(file.file_type)}
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{file.file_name}</span>
                        <span className={styles.fileSize}>
                          ({formatFileSize(file.file_size)})
                        </span>
                      </div>
                      <FaDownload className={styles.fileDownloadIcon} />
                      
                      {/* (Nút xóa tệp - Chỉ sếp mới thấy) */}
                      {canDelete && (
                        <button
                          className={styles.fileDeleteButton}
                          title="Xóa tệp này"
                          // (Ngăn bấm vào link cha)
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteFile(album.postId, file.file_url, file.file_name);
                          }}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </a>
                  </li>
                ))}
              </ul>

            </section>
          ))}
        </div>
      )}
    </div>
  );
}