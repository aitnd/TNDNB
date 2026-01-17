'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import ProtectedRoute from '../../../components/ProtectedRoute'
import Link from 'next/link'
import { FaCamera } from 'react-icons/fa'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../utils/firebaseClient'
import { supabase } from '../../../utils/supabaseClient'
import { optimizeImage } from '../../../utils/imageOptimizer'
import styles from './page.module.css'

// 1. TẠO "NỘI DUNG" TRANG
function HoSoCaNhan() {
  const { user } = useAuth() // Lấy thông tin user hiện tại

  // "Não" trạng thái cho form
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [className, setClassName] = useState(''); // Thêm trường Lớp
  const [courseName, setCourseName] = useState(''); // Thêm trường Khóa học

  // 💖 THÊM TRƯỜNG MỚI 💖
  const [cccd, setCccd] = useState(''); // Số CCCD
  const [cccdDate, setCccdDate] = useState(''); // Ngày cấp
  const [cccdPlace, setCccdPlace] = useState(''); // Nơi cấp
  const [address, setAddress] = useState(''); // Địa chỉ

  // 💖 AVATAR 💖
  const [photoURL, setPhotoURL] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // 2. "Phép thuật" Tự động điền thông tin cũ vào form
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber(user.phoneNumber || '');
      setBirthDate(user.birthDate || '');
      setClassName(user.class || ''); // Load lớp
      setCourseName(user.courseName || ''); // Load khóa học

      // Load thông tin mới
      setCccd(user.cccd || '');
      setCccdDate(user.cccdDate || '');
      setCccdPlace(user.cccdPlace || '');
      setAddress(user.address || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]); // (Chạy lại khi "user" được tải xong)

  // 💖 XỬ LÝ CHỌN ẢNH 💖
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 💖 XỬ LÝ LƯU FORM 💖
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      let newPhotoURL = photoURL;

      // 1. Nếu có chọn ảnh mới -> Upload lên Supabase Storage
      if (avatarFile) {
        // ⚡ Tối ưu ảnh trước khi upload ⚡
        console.log("Đang tối ưu ảnh...");
        const optimizedFile = await optimizeImage(avatarFile);

        // Tạo tên file duy nhất: uid + timestamp + tên file
        const fileExt = "webp"; // Luôn là webp sau khi tối ưu
        const fileName = `${user.uid}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // Lưu thẳng vào root bucket hoặc folder tùy ý

        // Upload
        const { data, error: uploadError } = await supabase
          .storage
          .from('avatars') // ⚠️ Đảm bảo bucket tên là 'avatars'
          .upload(filePath, optimizedFile);

        if (uploadError) {
          throw uploadError;
        }

        // Lấy URL công khai
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);

        newPhotoURL = publicUrl;
      }

      // 2. Cập nhật Firestore (Vẫn dùng Firebase DB để lưu thông tin user)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName,
        phoneNumber,
        birthDate,
        class: className,
        // courseName: courseName,
        cccd,
        cccdDate,
        cccdPlace,
        address,
        photoURL: newPhotoURL
      });

      setFormSuccess('Cập nhật hồ sơ thành công!');
      // Cập nhật lại state photoURL để hiển thị ngay
      setPhotoURL(newPhotoURL);
      setAvatarFile(null); // Reset file đã chọn

    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      setFormError('Có lỗi xảy ra: ' + (error.message || error.error_description || JSON.stringify(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>

      <h1 className={styles.title}>
        Cập nhật Hồ sơ cá nhân
      </h1>

      <div className={styles.formBox}>
        <form onSubmit={handleUpdateProfile} className={styles.form}>

          {/* 💖 AVATAR UPLOAD 💖 */}
          <div className={styles.avatarSection} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '10px' }}>
              <img
                src={previewUrl || photoURL || 'https://via.placeholder.com/100'}
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
              />
              <label htmlFor="avatarInput" style={{
                position: 'absolute', bottom: '0', right: '0',
                backgroundColor: '#1890ff', color: 'white',
                borderRadius: '50%', width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid white'
              }}>
                <FaCamera size={14} />
              </label>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Nhấn vào biểu tượng máy ảnh để thay đổi</p>
          </div>

          {/* Ô Email (Không cho sửa) */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email (Không thể thay đổi)
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled // (Khóa lại)
              className={styles.input}
            />
          </div>

          {/* Ô Họ và Tên */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Họ và Tên
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* Ô Số điện thoại */}
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              placeholder="0912..."
            />
          </div>

          {/* Ô Ngày sinh */}
          <div className={styles.formGroup}>
            <label htmlFor="birthDate" className={styles.label}>
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* 💖 THÔNG TIN CCCD (Gộp chung 1 dòng hoặc tách ra tùy ý, ở đây mình tách ra cho rõ) 💖 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Thông tin CCCD</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Số CCCD"
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                className={styles.input}
                style={{ flex: 2 }}
              />
              <input
                type="date"
                placeholder="Ngày cấp"
                value={cccdDate}
                onChange={(e) => setCccdDate(e.target.value)}
                className={styles.input}
                style={{ flex: 1 }}
              />
              <input
                type="text"
                placeholder="Nơi cấp"
                value={cccdPlace}
                onChange={(e) => setCccdPlace(e.target.value)}
                className={styles.input}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* 💖 ĐỊA CHỈ 💖 */}
          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              Địa chỉ liên hệ
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.input}
              placeholder="Số nhà, đường, phường/xã..."
            />
          </div>

          {/* Ô Lớp (Học viên tự điền) */}
          <div className={styles.formGroup}>
            <label htmlFor="className" className={styles.label}>
              Lớp
            </label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className={styles.input}
              placeholder="Ví dụ: 12A1"
            />
          </div>

          {/* Ô Khóa học (Chỉ hiển thị) */}
          <div className={styles.formGroup}>
            <label htmlFor="courseName" className={styles.label}>
              Khóa học (Được gán)
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              disabled
              className={styles.input}
              placeholder="Chưa có khóa học"
            />
          </div>

          {/* Thông báo Lỗi/Thành công */}
          {formError && (
            <div className={styles.error}>{formError}</div>
          )}
          {formSuccess && (
            <div className={styles.success}>{formSuccess}</div>
          )}

          {/* Nút bấm */}
          <div className={styles.buttonContainer}>
            <Link href="/quan-ly" className={styles.backLink}>
              « Quay về Bảng điều khiển
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.button}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 2. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC"
export default function HoSoPage() {
  return (
    <ProtectedRoute>
      <HoSoCaNhan />
    </ProtectedRoute>
  )
}