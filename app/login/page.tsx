// Đánh dấu đây là "Client Component"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../utils/firebaseClient' 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext' 

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

export default function LoginPage() {
  // 💖 THÊM "NÃO" MỚI: phoneNumber, birthDate 💖
  const [fullName, setFullName] = useState('') 
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false)
  
  const [isRegistering, setIsRegistering] = useState(false) 

  const router = useRouter() 
  const { user } = useAuth() 

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Đăng nhập thành công, điều hướng...')
      router.push('/quan-ly') 

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập.')
      setLoading(false)
    }
  }

  // --- HÀM XỬ LÝ ĐĂNG KÝ (Nâng cấp) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      setLoading(false)
      return
    }
    // (Kiểm tra Họ tên)
    if (fullName.length < 3) {
      setError('Vui lòng nhập Họ và Tên đầy đủ.')
      setLoading(false)
      return
    }

    try {
      // 1. Tạo tài khoản trong "Bảo vệ" (Auth)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Đăng ký Auth thành công:', user.uid)

      // 2. 💖 TẠO "HỒ SƠ" NÂNG CẤP (LƯU SĐT, NĂM SINH) 💖
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        email: user.email,
        fullName: fullName, 
        phoneNumber: phoneNumber, // 💖 LƯU SĐT 💖
        birthDate: birthDate,     // 💖 LƯU NĂM SINH 💖
        role: 'hoc_vien', // Mặc định là 'hoc_vien'
        createdAt: serverTimestamp()
      })
      
      console.log('Tạo hồ sơ Firestore thành công. Đang đăng nhập...')
      // 3. Đăng ký xong, "đẩy" về trang "Quản lý"
      router.push('/quan-ly')

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Có lỗi xảy ra khi đăng ký.')
      setLoading(false)
    }
  }

  // (Logic "đá" về trang quản lý - Giữ nguyên)
  if (user && !loading) {
    router.push('/quan-ly')
    return (
      <div className={styles.container}>
        <p className={styles.loadingText}>Đang điều hướng...</p>
      </div>
    )
  }

  // 2. GIAO DIỆN FORM (Đã cập nhật)
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>
          {isRegistering ? 'Đăng ký Tài khoản' : 'Đăng nhập Hệ thống'}
        </h1>
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          
          {/* 💖 ẨN/HIỆN CÁC Ô MỚI KHI ĐĂNG KÝ 💖 */}
          {isRegistering && (
            <>
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
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Số điện thoại (Tuỳ chọn)
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

              <div className={styles.formGroup}>
                <label htmlFor="birthDate" className={styles.label}>
                  Ngày sinh (Tuỳ chọn)
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className={styles.input}
                />
              </div>
            </>
          )}

          {/* Ô Email */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="email@example.com"
            />
          </div>

          {/* Ô Mật khẩu */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="•••••••• (Ít nhất 6 ký tự)"
            />
          </div>

          {/* Thông báo Lỗi */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* Các nút bấm */}
          <div className={styles.buttonContainer}>
            {isRegistering ? (
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            )}
            
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              disabled={loading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              {isRegistering ? 'Quay lại Đăng nhập' : 'Tạo tài khoản mới (Đăng ký)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}