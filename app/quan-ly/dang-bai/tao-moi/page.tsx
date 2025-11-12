// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic' 
// 💖 1. "TRIỆU HỒI" ICON (cho file PDF/Word) 💖
import { FaFilePdf, FaFileWord, FaFileArchive, FaFile } from 'react-icons/fa'
import { useAuth } from '../../../../context/AuthContext' 
import ProtectedRoute from '../../../../components/ProtectedRoute' 
import { supabase } from '../../../../utils/supabaseClient' 
import Link from 'next/link' 

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css'; 
import vi from 'suneditor/src/lang/en';

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// (Kiểu Category - Giữ nguyên)
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

function CreatePostForm() {
  const { user } = useAuth() 
  const router = useRouter()

  // (Não trạng thái - Giữ nguyên)
  const [categories, setCategories] = useState<Category[]>([]) 
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [categoryId, setCategoryId] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // 💖 3. "NÃO" TRẠNG THÁI MỚI CHO TỆP ĐÍNH KÈM 💖
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]); // (Mảng các file đã chọn)
  const [isUploadingFiles, setIsUploadingFiles] = useState(false); // (Trạng thái đang upload)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

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
        if (data && data.length > 0) {
          setCategoryId(data[0].id)
        }
      }
      setLoadingCategories(false)
    }
    fetchCategories()
  }, []) 
  
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

  // 💖 4. CÁC HÀM XỬ LÝ TỆP ĐÍNH KÈM 💖

  // (Khi người dùng chọn tệp)
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // (Biến nó thành mảng rồi "nhét" vào "não" state)
      const newFiles = Array.from(e.target.files);
      setAttachmentFiles(prevFiles => [...prevFiles, ...newFiles]);
      
      // (Reset ô input để anh có thể chọn file y hệt lần nữa)
      e.target.value = '';
    }
  }

  // (Khi người dùng bấm nút "X" để xóa 1 tệp)
  const handleRemoveAttachment = (fileToRemove: File) => {
    setAttachmentFiles(prevFiles => 
      prevFiles.filter(file => file !== fileToRemove) // (Lọc bỏ file đó ra)
    );
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
    if (thumbnailUrl) {
      console.log(`[Thư viện] Thêm ảnh đại diện: ${thumbnailUrl}`);
      mediaToInsert.push({
        post_id: postId,
        post_title: postTitle,
        media_url: thumbnailUrl,
        media_type: 'image'
      });
    }
    if (mediaToInsert.length > 0) {
      console.log(`[Thư viện] Đang cất ${mediaToInsert.length} media vào kho...`);
      const { error: mediaError } = await supabase
        .from('media_library') 
        .insert(mediaToInsert);
      if (mediaError) {
        console.error('[Thư viện] Lỗi khi lưu vào media_library:', mediaError.message);
        setFormError('Đăng bài OK, nhưng lỗi khi lưu vào thư viện media.');
      } else {
        console.log('[Thư viện] Đã cất media thành công!');
      }
    } else {
      console.log('[Thư viện] Không tìm thấy media nào để cất.');
    }
  };


  // 💖 5. HÀM SUBMIT (ĐÃ NÂNG CẤP) 💖
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
    if (!user) { 
      setFormError('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
      setIsSubmitting(false);
      setIsUploadingFiles(false);
      return;
    }
    
    try {
      let thumbnailUrl: string | null = null;
      const attachmentsData: Attachment[] = []; // (Cái túi rỗng)

      // 1. "Đẩy" ảnh đại diện (Giữ nguyên)
      if (thumbnailFile) {
        console.log('Đang tải ảnh đại diện lên...');
        const fileName = `thumbnail_${Date.now()}_${thumbnailFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('post_images') 
          .upload(fileName, thumbnailFile);
        if (uploadError) throw new Error(`Lỗi tải ảnh đại diện: ${uploadError.message}`);
        const { data: publicUrlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(fileName);
        thumbnailUrl = publicUrlData.publicUrl;
      }

      // 💖 6. "ĐẨY" TỆP ĐÍNH KÈM (LOGIC MỚI) 💖
      if (attachmentFiles.length > 0) {
        console.log(`Đang tải ${attachmentFiles.length} tệp đính kèm...`);
        
        // (Tải từng file một)
        for (const file of attachmentFiles) {
          const fileName = `file_${Date.now()}_${file.name}`;
          const { error: fileUploadError } = await supabase.storage
            .from('post_files') // (Upload vào "thùng" mới)
            .upload(fileName, file);

          if (fileUploadError) {
            throw new Error(`Lỗi khi tải tệp ${file.name}: ${fileUploadError.message}`);
          }
          
          // (Lấy link)
          const { data: publicUrlData } = supabase.storage
            .from('post_files')
            .getPublicUrl(fileName);
            
          // (Nhét vào "túi" của mình)
          attachmentsData.push({
            file_name: file.name,
            file_url: publicUrlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
          });
        }
        console.log('Tải tệp đính kèm thành công!');
      }

      // 💖 7. "CẤT" BÀI VIẾT (Thêm cột 'attachments' mới) 💖
      const { data: postData, error } = await supabase
        .from('posts') 
        .insert([
          { 
            title: title, 
            content: content, 
            category_id: categoryId, 
            is_featured: isFeatured,
            author_id: user.uid, 
            thumbnail_url: thumbnailUrl,
            attachments: attachmentsData, // (Nhét "túi" vào cột jsonb)
          }
        ])
        .select() 
        .single(); 

      if (error) throw error; 
      if (!postData) throw new Error('Không nhận được ID bài viết sau khi tạo.');

      console.log('Đăng bài thành công! ID:', postData.id);

      // 4. GỌI "PHÉP THUẬT" (Giữ nguyên) 
      extractMediaAndSave(postData.id, postData.title, content, thumbnailUrl);
      
      setFormSuccess('Đăng bài thành công! Đã tự động quét media.');
      // (Reset form)
      setTitle('');
      setContent('');
      setIsFeatured(false);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setAttachmentFiles([]); // (Dọn dẹp tệp)

      // (Quay về trang danh sách)
      router.push('/quan-ly/dang-bai') 

    } catch (err: any) {
      console.error('Lỗi khi đăng bài:', err)
      setFormError(err.message || 'Lỗi không xác định khi đăng bài.')
    } finally {
      setIsSubmitting(false)
      setIsUploadingFiles(false); // (Tắt quay tròn)
    }
  }

  // 💖 8. (PHẦN GIAO DIỆN JSX - ĐÃ THÊM Ô UPLOAD TỆP) 💖
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>
          Tạo bài viết mới
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
                placeholder="Thông báo tuyển sinh..."
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
                accept="image/png, image/jpeg, image/webp" // (Chỉ nhận ảnh)
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

            {/* 💖 9. Ô UPLOAD TỆP ĐÍNH KÈM (KHỐI MỚI) 💖 */}
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
              
              {/* (Danh sách tệp đã chọn) */}
              {attachmentFiles.length > 0 && (
                <ul className={styles.attachmentList}>
                  {attachmentFiles.map((file, index) => (
                    <li key={index} className={styles.attachmentItem}>
                      {getFileIcon(file.type)}
                      <span className={styles.attachmentName} title={file.name}>
                        {file.name}
                      </span>
                      <span className={styles.attachmentSize}>
                        ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file)}
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
                  <option>Đang tải danh mục...</option>
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
                  {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
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
export default function CreatePostPage() {
  return (
    // 💖 10. "TRIỆU HỒI" CÁI "LÍNH GÁC" ICON 💖
    // (Vì mình dùng react-icons, mà nó là Client Component,
    //  nên mình phải bọc nó bằng "Lính gác" này)
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'giao_vien', 'quan_ly']}>
      <CreatePostForm /> 
    </ProtectedRoute>
  )
}