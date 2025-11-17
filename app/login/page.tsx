// Đánh dấu đây là "Client Component"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' 
// 💖 1. "TRIỆU HỒI" THÊM ĐỒ NGHỀ CỦA "BẢO VỆ" 💖
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, // (Mời "Bảo vệ" Google)
  signInWithPopup,    // (Cái "cửa" pop-up)
  sendPasswordResetEmail // (Cái "bưu điện" gửi link reset)
} from 'firebase/auth'
import { auth, db } from '../../utils/firebaseClient' 
// 💖 2. "TRIỆU HỒI" THÊM ĐỒ NGHỀ CỦA "TỦ" 💖
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext' 
// 💖 3. "TRIỆU HỒI" ICON GOOGLE 💖
import { FaGoogle } from 'react-icons/fa'

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

export default function LoginPage() {
  // (Não cũ - Giữ nguyên)
  const [fullName, setFullName] = useState('') 
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) 
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false) 
  
  // 💖 4. "NÃO" MỚI CHO CÁI LINK RESET MẬT KHẨU 💖
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const router = useRouter() 
  const { user } = useAuth() 

  // --- HÀM XỬ LÝ ĐĂNG NHẬP (Giữ nguyên) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResetMsg(null) // (Tắt thông báo cũ)
    
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

  // --- HÀM XỬ LÝ ĐĂNG KÝ (Giữ nguyên) ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResetMsg(null) // (Tắt thông báo cũ)

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      setLoading(false)
      return
    }
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

      // 2. TẠO "HỒ SƠ"
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, {
        email: user.email,
        fullName: fullName, 
        phoneNumber: phoneNumber, 
        birthDate: birthDate,     
        role: 'hoc_vien', // Mặc định là 'hoc_vien'
        createdAt: serverTimestamp()
      })
      
      console.log('Tạo hồ sơ Firestore thành công. Đang đăng nhập...')
      router.push('/quan-ly')

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Có lỗi xảy ra khi đăng ký.')
      setLoading(false)
    }
  }

  // 💖 5. HÀM MỚI: ĐĂNG NHẬP BẰNG GOOGLE 💖
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setResetMsg(null);
    
    const provider = new GoogleAuthProvider(); // (Gọi "bảo vệ" Google)

    try {
      // (Mở cửa sổ pop-up)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // (Kiểm tra xem "người quen" hay "người lạ")
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef); // (Phải "hỏi" cái "tủ")

      if (!userDoc.exists()) {
        // (Nếu là "người lạ" - lần đầu đăng nhập Google)
        console.log('Phát hiện người dùng Google mới, đang tạo hồ sơ...');
        await setDoc(userDocRef, {
          email: user.email,
          fullName: user.displayName || 'Người dùng Google', // (Lấy tên từ Google)
          phoneNumber: user.phoneNumber || '', // (Lấy SĐT nếu có)
          birthDate: '',     
          role: 'hoc_vien', // Mặc định là 'hoc_vien'
          createdAt: serverTimestamp()
        });
      } else {
        // (Nếu là "người quen" thì thôi)
        console.log('Người dùng Google đã có hồ sơ, đang đăng nhập...');
      }

      router.push('/quan-ly'); // (Cho vào!)

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi đăng nhập Google.');
      setLoading(false);
    }
  }

  // 💖 6. HÀM MỚI: GỬI LINK RESET MẬT KHẨU 💖
  const handlePasswordReset = async () => {
    setError(null);
    setResetMsg(null);

    // (Kiểm tra xem anh có gõ email vào ô chưa)
    if (!email) {
      setError('Vui lòng nhập email của bạn vào ô Email trước, rồi bấm lại "Quên mật khẩu".');
      return;
    }

    setLoading(true);
    console.log(`Đang gửi link reset tới ${email}...`);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg('Gửi thành công! Anh kiểm tra email để lấy link reset mật khẩu nha.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi gửi email reset.');
    } finally {
      setLoading(false);
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

  // 7. GIAO DIỆN FORM (Đã cập nhật)
  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>
          {isRegistering ? 'Đăng ký Tài khoản' : 'Đăng nhập Hệ thống'}
        </h1>
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          
          {/* (Các ô đăng ký - Giữ nguyên) */}
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
              required={!isRegistering} // (Khi đăng nhập mới cần, đăng ký thì gõ ở dưới)
              className={styles.input}
              placeholder={isRegistering ? "•••••••• (Ít nhất 6 ký tự)" : "••••••••"}
            />
          </div>

          {/* Thông báo Lỗi */}
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {/* 💖 Thông báo Reset Mật khẩu (MỚI) 💖 */}
          {resetMsg && (
            <div className={styles.success}>
              {resetMsg}
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

        {/* 💖 8. KHU VỰC "HOẶC" VÀ NÚT GOOGLE (MỚI) 💖 */}
        {!isRegistering && (
          <>
            <div className={styles.divider}>
              <span>hoặc</span>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`${styles.button} ${styles.buttonGoogle}`}
              >
                <FaGoogle /> {/* Icon nè */}
                Đăng nhập với Google
              </button>
            </div>

            <div className={styles.resetLink}>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading}
                className={styles.linkButton}
              >
                Quên mật khẩu?
              </button>
            </div>
          </>
        )}
        
      </div>
    </div>
  )
}