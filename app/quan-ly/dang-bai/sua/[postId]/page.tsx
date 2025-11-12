// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation' 
import dynamic from 'next/dynamic' 
// 💖 1. "TRIỆU HỒI" ICON (cho file PDF/Word) 💖
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile } from 'react-icons/fa'
import { useAuth } from '../../../../../context/AuthContext' 
import ProtectedRoute from '../../../../../components/ProtectedRoute' 
import { supabase } from '../../../../../utils/supabaseClient' 
import Link from 'next/link' 

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; 
import vi from 'suneditor/src/lang/en';

// "Triệu hồi" file CSS Module (Mượn của trang Tạo Mới)
import styles from '../../tao-moi/page.module.css' 

type Category = {
  id: string;
  name: string;
}

// 💖 2. ĐỊNH NGHĨA "KIỂU" TỆP ĐÍNH KÈM (CHO SUPABASE) 💖
type Attachment = {
  file_name: string; // (Tên gốc của file)
  file_url: string;  // (Link Supabase)
  file_size: number; // (Kích thước file - tính bằng byte)
  file_type: string; // (Loại file: 'application/pdf')
};

function EditPostForm() {
  const router = useRouter()
  const params = useParams() 
  const postId = params.postId as string 

  // (Não trạng thái - Giữ nguyên)
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // 💖 3. "NÃO" TRẠNG THÁI MỚI (CHIA LÀM 2 LOẠI TỆP) 💖
  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>([]); // (Tệp cũ)
  const [newAttachmentFiles, setNewAttachmentFiles] = useState<File[]>([]); // (Tệp mới)
  const [isUploadingFiles, setIsUploadingFiles] = useState(false); // (Trạng thái đang upload)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  // (Lấy danh mục - Giữ nguyên)
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      if (error) {
        console.error('Lỗi khi lấy danh mục:', error)
      } else {
        setCategories(data as Category[])
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) 
  
  // 💖 4. LẤY DỮ LIỆU CŨ (Nâng cấp để lấy tệp đính kèm) 💖
  useEffect(() => {
    if (!postId) return; 

    async function fetchPostData() {
      setIsLoadingPost(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*') // (Lấy hết cột, bao gồm 'attachments')
        .eq('id', postId) 
        .single(); 

      if (error) {
        setFormError('Không tìm thấy bài viết này hoặc có lỗi xảy ra.');
      } else if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.category_id);
        setIsFeatured(data.is_featured);
        setThumbnailPreview(data.thumbnail_url || null);
        
        // (Nhét tệp cũ vào "não")
        setExistingAttachments(data.attachments || []); 
      }
      setIsLoadingPost(false);
    }
    fetchPostData();
  }, [postId]); 

  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file)); 
    }
  }

  // (Hàm xóa ảnh đại diện - Giữ nguyên)
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }

  // 💖 5. CÁC HÀM XỬ LÝ TỆP ĐÍNH KÈM (Copy y hệt file "Tạo mới") 💖

  // (Khi người dùng chọn tệp MỚI)
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setNewAttachmentFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.target.value = '';
    }
  }

  // (Khi người dùng xóa 1 tệp MỚI (chưa upload))
  const handleRemoveNewAttachment = (fileToRemove: File) => {
    setNewAttachmentFiles(prevFiles => 
      prevFiles.filter(file => file !== fileToRemove) 
    );
  }

  // (Khi người dùng xóa 1 tệp CŨ (đã upload))
  const handleRemoveExistingAttachment = (fileToRemove: Attachment) => {
    if (confirm(`Anh có chắc chắn muốn xóa tệp "${fileToRemove.file_name}" không? Bấm "Lưu thay đổi" để xác nhận.`)) {
      setExistingAttachments(prevFiles =>
        prevFiles.filter(file => file.file_url !== fileToRemove.file_url)
      );
    }
  }

  // (Hàm "dịch" kích thước file cho đẹp)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // (Hàm "dịch" icon cho file)
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className={styles.attachmentIcon} />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FaFileWord className={styles.attachmentIcon} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FaFileArchive className={styles.attachmentIcon} />;
    return <FaFile className={styles.attachmentIcon} />;
  }


  // (Hàm upload ảnh SunEditor - Giữ nguyên)
  const handleImageUploadBefore = (
    files: File[], 
    info: object,
    uploadHandler: (response: any) => void
  ) => {
    console.log(`[SunEditor] Nhận được ${files.length} ảnh.`);

    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const fileName = `content_${Date.now()}_${file.name}`;
        console.log(`[SunEditor] Đang tải: ${fileName}`);

        supabase.storage
          .from('post_images')
          .upload(fileName, file)
          .then(({ error: uploadError }) => {
            if (uploadError) {
              console.error(`Lỗi tải ảnh ${fileName}:`, uploadError.message);
              return reject(new Error(uploadError.message)); 
            }
            
            const { data: publicUrlData } = supabase.storage
              .from('post_images')
              .getPublicUrl(fileName);

            resolve({
              url: publicUrlData.publicUrl,
              name: file.name,
              size: file.size,
            });
          })
          .catch(err => {
             console.error(`Lỗi ngoại lệ khi tải ${fileName}:`, err);
             return reject(err);
          });
      });
    }); 

    Promise.allSettled(uploadPromises) 
      .then(results => {
        const successResults: any[] = [];
        let errorCount = 0;
        results.forEach(res => {
          if (res.status === 'fulfilled') {
            successResults.push(res.value); 
          } else {
            errorCount++; 
          }
        });

        if (successResults.length > 0) {
          const response = {
            result: successResults,
          };
          uploadHandler(response); 
        }
        if (errorCount > 0) {
           alert(`Đã tải lên ${successResults.length} ảnh. Có ${errorCount} ảnh bị lỗi, anh xem lại nhé.`);
        }
        if (successResults.length === 0 && errorCount > 0) {
           uploadHandler(null);
        }
      });
    return false; 
  }

  // (Hàm "Lưu thư viện" - Giữ nguyên)
  const extractMediaAndSave = async (
    postId: string,
    postTitle: string,
    content: string,
    thumbnailUrl: string | null
  ) => {
    console.log(`[Thư viện] Bắt đầu quét media cho bài: ${postTitle}`);
    
    // 1. "Lục lọi" (parse) HTML để tìm tất cả thẻ <img>
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const mediaToInsert: any[] = [];
    let match;
    
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];
      console.log(`[Thư viện] Tìm thấy ảnh nội dung: ${url}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: url,
        media_type: 'image'
      });
    }

    // 2. Thêm "ảnh đại diện" (thumbnail) vào danh sách (nếu có)
    if (thumbnailUrl) {
      console.log(`[Thư viện] Thêm ảnh đại diện: ${thumbnailUrl}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: thumbnailUrl,
        media_type: 'image'
      });
    }

    // 3. "Cất" tất cả vào "ngăn tủ" media_library
    if (mediaToInsert.length > 0) {
      console.log(`[Thư viện] Đang cất ${mediaToInsert.length} media vào kho...`);
      const { error: mediaError } = await supabase
        .from('media_library') 
        .insert(mediaToInsert);

      if (mediaError) {
        console.error('[Thư viện] Lỗi khi lưu vào media_library:', mediaError.message);
        setFormError('Sửa bài OK, nhưng lỗi khi đồng bộ thư viện media.');
      } else {
        console.log('[Thư viện] Đã cất media thành công!');
      }
    } else {
      console.log('[Thư viện] Không tìm thấy media nào để cất.');
    }
  };

  // 💖 6. HÀM "CẬP NHẬT" (ĐÃ NÂNG CẤP) 💖
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsUploadingFiles(true); // (Bật quay tròn)
    setFormError(null)
    setFormSuccess(null)

    if (!title || !content || !categoryId) {
      setFormError('Tiêu đề, Nội dung, và Danh mục không được để trống!')
      setIsSubmitting(false)
      setIsUploadingFiles(false);
      return
    }
    
    try {
      const updateData: any = { 
        title: title, 
        content: content, 
        category_id: categoryId, 
        is_featured: isFeatured 
      };

      // 1. "Đẩy" ảnh đại diện (Giữ nguyên)
      if (thumbnailFile) {
        const fileName = `thumbnail_${Date.now()}_${thumbnailFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(fileName, thumbnailFile);
        if (uploadError) throw new Error(`Lỗi tải ảnh đại diện: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
        updateData.thumbnail_url = publicUrlData.publicUrl; 
      }
      
      // (Xử lý trường hợp Bấm nút Xóa ảnh đại diện)
      if (!thumbnailFile && !thumbnailPreview) {
         updateData.thumbnail_url = null;
      }
     
      // 💖 7. "ĐẨY" TỆP ĐÍNH KÈM MỚI (LOGIC MỚI) 💖
      const newlyUploadedAttachments: Attachment[] = [];
      if (newAttachmentFiles.length > 0) {
        console.log(`Đang tải ${newAttachmentFiles.length} tệp đính kèm MỚI...`);
        for (const file of newAttachmentFiles) {
          const fileName = `file_${Date.now()}_${file.name}`;
          const { error: fileUploadError } = await supabase.storage
            .from('post_files') // (Upload vào "thùng" mới)
            .upload(fileName, file);
          if (fileUploadError) throw new Error(`Lỗi khi tải tệp ${file.name}: ${fileUploadError.message}`);
          
          const { data: publicUrlData } = supabase.storage
            .from('post_files')
            .getPublicUrl(fileName);
            
          newlyUploadedAttachments.push({
            file_name: file.name,
            file_url: publicUrlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
          });
        }
      }

      // 💖 8. GOM TÚI "THẦN KỲ" (Tệp cũ + Tệp mới) 💖
      const finalAttachments = [...existingAttachments, ...newlyUploadedAttachments];
      updateData.attachments = finalAttachments; // (Gán "túi" cuối cùng)

      // 💖 9. CẬP NHẬT BÀI VIẾT VÀO "KHO" 💖
      const { error } = await supabase
        .from('posts') 
        .update(updateData) 
        .eq('id', postId); 

      if (error) throw error 

      // (Logic "Dọn dẹp" Thư viện - Giữ nguyên)
      const finalThumbnailUrl = updateData.thumbnail_url || (thumbnailPreview && !thumbnailFile ? thumbnailPreview : null);

      console.log(`[Thư viện] Đang xóa media cũ của bài: ${postId}`);
      const { error: deleteError } = await supabase
        .from('media_library')
        .delete()
        .eq('post_id', postId);

      if (deleteError) {
        console.error('[Thư viện] Lỗi khi xóa media cũ:', deleteError.message);
      }

      extractMediaAndSave(postId, title, content, finalThumbnailUrl);
      
      setFormSuccess('Cập nhật bài viết thành công! Thư viện đang được đồng bộ...');
      
      setTimeout(() => {
        router.push('/quan-ly/dang-bai');
      }, 1000);

    } catch (err: any) {
      console.error('Lỗi khi cập nhật bài:', err)
      setFormError(err.message || 'Lỗi không xác định khi cập nhật.')
    } finally {
      setIsSubmitting(false)
      setIsUploadingFiles(false); // (Tắt quay tròn)
    }
  }

  // (Giao diện JSX - Giữ nguyên)
  if (isLoadingPost) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Đang tải dữ liệu bài viết...</h1>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Chỉnh sửa bài viết
        </h1>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* (Tiêu đề) */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Tiêu đề bài viết
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
            </div>
            
            {/* Ô UPLOAD ẢNH ĐẠI DIỆN */}
            <div className={styles.formGroup}>
              <label htmlFor="thumbnail" className={styles.label}>
                Ảnh đại diện (Thumbnail)
              </label>
              <input
                type="file"
                id="thumbnail"
                onChange={handleThumbnailChange}
                accept="image/png, image/jpeg, image/webp"
                className={styles.fileInput}
              />
              {/* KHỐI XEM TRƯỚC VÀ NÚT XÓA ẢNH */}
              {thumbnailPreview && (
                <div className={styles.thumbnailPreviewContainer}>
                  <img 
                    src={thumbnailPreview} 
                    alt="Xem trước" 
                    className={styles.thumbnailPreview} 
                  />
                  <button
                    type="button" 
                    onClick={handleRemoveThumbnail}
                    className={styles.buttonRemove}
                    title="Xóa ảnh này"
                  >
                    &times; 
                  </button>
                </div>
              )}
            </div>

            {/* 💖 10. Ô UPLOAD TỆP ĐÍNH KÈM (KHỐI MỚI) 💖 */}
            <div className={styles.formGroup}>
              <label htmlFor="attachments" className={styles.label}>
                Tệp đính kèm (PDF, Word, Zip...)
              </label>
              <input
                type="file"
                id="attachments"
                multiple // (Cho phép chọn nhiều tệp)
                onChange={handleAttachmentChange}
                accept=".pdf,.doc,.docx,.zip,.rar" // (Chỉ nhận các tệp này)
                className={styles.fileInput}
              />
              
              {/* (Danh sách tệp đã chọn - GỒM CẢ CŨ LẪN MỚI) */}
              {(existingAttachments.length > 0 || newAttachmentFiles.length > 0) && (
                <ul className={styles.attachmentList}>
                  
                  {/* (Vẽ tệp CŨ) */}
                  {existingAttachments.map((file, index) => (
                    <li key={`existing-${index}`} className={styles.attachmentItem}>
                      {getFileIcon(file.file_type)}
                      <span className={styles.attachmentName} title={file.file_name}>
                        {file.file_name}
                      </span>
                      <span className={styles.attachmentSize}>
                        ({formatFileSize(file.file_size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingAttachment(file)}
                        className={styles.attachmentRemoveButton}
                        title="Xóa tệp này"
                      >
                        &times;
                      </button>
                    </li>
                  ))}

                  {/* (Vẽ tệp MỚI) */}
                  {newAttachmentFiles.map((file, index) => (
                    <li key={`new-${index}`} className={styles.attachmentItem}>
                      {getFileIcon(file.type)}
                      <span className={styles.attachmentName} title={file.name}>
                        {file.name}
                      </span>
                      <span className={styles.attachmentSize}>
                        ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewAttachment(file)}
                        className={styles.attachmentRemoveButton}
                        title="Xóa tệp này"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* 💖 HẾT KHỐI MỚI 💖 */}

            {/* (Danh mục) */}
            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Danh mục
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={loadingCategories}
                className={styles.select}
              >
                {loadingCategories ? (
                  <option>Đang tải...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* (Checkbox) */}
            <div className={styles.checkboxGroup}>
              <input
                id="is_featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="is_featured" className={styles.label}>
                Đánh dấu là "Tin tiêu điểm" (Sẽ hiện ở Slider)
              </label>
            </div>
            
            {/* (Trình soạn thảo SunEditor) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nội dung bài viết
              </label>
              <SunEditor 
                lang={vi} 
                setContents={content} 
                onChange={setContent}
                onImageUploadBefore={handleImageUploadBefore}
                setOptions={{
                  height: '300px',
                  imageMultipleFile: true, 
                  imageWidth: '500px',       
                  imageHeight: 'auto',       
                  buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    '/', 
                    ['fontColor', 'hiliteColor'],
                    ['outdent', 'indent'],
                    ['align', 'horizontalRule', 'list', 'lineHeight'],
                    ['table', 'link', 'image', 'video'], 
                    ['fullScreen', 'showBlocks', 'codeView'],
                  ],
                }}
              />
            </div>

            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}
            
            <div className={styles.buttonContainer} style={{justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
              <Link href="/quan-ly/dang-bai" style={{color: '#555', textDecoration: 'underline'}}>
                « Quay về Danh sách
              </Link>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                {/* (Icon quay tròn khi đang upload) */}
                {(isSubmitting || isUploadingFiles) && (
                  <div className={styles.uploadSpinner} title="Đang tải tệp lên..."></div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || loadingCategories || isUploadingFiles}
                  className={styles.button}
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function EditPostPage() {
  return (
    // 💖 11. "TRIỆU HỒI" CÁI "LÍNH GÁC" ICON 💖
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan-ly']}>
      <EditPostForm /> 
    </ProtectedRoute>
  )
}