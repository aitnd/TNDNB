// Đánh dấu đây là "Client Component"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../utils/firebaseClient' // (Sửa đường dẫn ../)
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext' // (Sửa đường dẫn ../)

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false)
  
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
      router.push('/quan-ly') // Đẩy về trang "Quản lý"

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập.')
      setLoading(false)
    }
  }

  // --- HÀM XỬ LÝ ĐĂNG KÝ (Tạm thời) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      setLoading(false)
      return
    }

    try {
      // 1. Tạo tài khoản trong "Bảo vệ" (Auth)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      console.log('Đăng ký Auth thành công:', user.uid)

      // 2. Tạo "hồ sơ" vai trò trong "Tủ" (Firestore)
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        email: user.email,
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

  // Nếu "Bộ não" báo đã đăng nhập rồi, "đá" về trang quản lý
  if (user && !loading) {
    router.push('/quan-ly')
    return (
      <div className={styles.container}>
        <p className={styles.loadingText}>Đã đăng nhập, đang điều hướng...</p>
      </div>
    )
  }

  // 2. GIAO DIỆN FORM (Đã dùng CSS Module)
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>
          Đăng nhập Hệ thống
        </h1>
        
        <form onSubmit={handleLogin}>
          {/* Ô Email */}
          <div className={styles.formGroup}>
            <label 
              htmlFor="email" 
              className={styles.label}
            >
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
            <label 
              htmlFor="password" 
              className={styles.label}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
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
            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký (Test)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}