// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext' 
import ProtectedRoute from '../../../components/ProtectedRoute' 
import { db } from '../../../utils/firebaseClient' 
import { doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'

// (Import CSS Module - Mình mượn tạm style của trang Đăng bài)
import styles from '../dang-bai/page.module.css' 

// 1. TẠO "NỘI DUNG" TRANG
function HoSoCaNhan() {
  const { user } = useAuth() // Lấy thông tin user hiện tại

  // "Não" trạng thái cho form
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // 2. "Phép thuật" Tự động điền thông tin cũ vào form
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhoneNumber(user.phoneNumber || '');
      setBirthDate(user.birthDate || '');
    }
  }, [user]); // (Chạy lại khi "user" được tải xong)

  // 3. HÀM CẬP NHẬT HỒ SƠ
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFormError('Bạn phải đăng nhập để thực hiện việc này.');
      return;
    }
    if (!fullName || fullName.length < 3) {
      setFormError('Họ và tên không được để trống.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      // "Chỉ đường" tới "tủ" hồ sơ của user
      const userDocRef = doc(db, 'users', user.uid);

      // "Ghi" đè thông tin mới
      await updateDoc(userDocRef, {
        fullName: fullName,
        phoneNumber: phoneNumber,
        birthDate: birthDate
      });

      setFormSuccess('Cập nhật hồ sơ thành công! Thông tin sẽ được làm mới ở lần tải trang sau.');

    } catch (err: any) {
      console.error('Lỗi khi cập nhật hồ sơ:', err);
      setFormError(err.message || 'Lỗi không xác định.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Giao diện
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <h1 className={styles.title}>
          Cập nhật Hồ sơ cá nhân
        </h1>

        <div className={styles.formBox}>
          <form onSubmit={handleUpdateProfile} className={styles.form}>
            
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

            {/* Thông báo Lỗi/Thành công */}
            {formError && (
              <div className={styles.error}>{formError}</div>
            )}
            {formSuccess && (
              <div className={styles.success}>{formSuccess}</div>
            )}

            {/* Nút bấm */}
            <div className={styles.buttonContainer} style={{justifyContent: 'space-between', display: 'flex'}}>
              <Link href="/quan-ly" style={{color: '#555', textDecoration: 'underline'}}>
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