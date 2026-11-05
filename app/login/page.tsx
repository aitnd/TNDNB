'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth, db } from '../../utils/firebaseClient'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'
import { recordLoginSession } from '../services/authSessionService'
import { FaGoogle } from 'react-icons/fa'
import styles from './page.module.css'

const resolveEmailFromUsername = (input: string): string => {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (trimmed.includes('@')) {
    return trimmed
  }
  return `${trimmed}@gmail.com`
}

const getRedirectTarget = (redirectParam: string | null): string => {
  if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
    return redirectParam
  }
  return '/quan-ly'
}

const getFriendlyErrorMessage = (err: any): string => {
  const code = err?.code || ''
  if (code === 'auth/unauthorized-domain') {
    return 'Tên miền hiện tại chưa được cấp phép trong Firebase Auth (thường gặp trên preview .vercel.app). Vui lòng đăng nhập bằng Email/Tài khoản hoặc truy cập tên miền chính thức daotaothuyenvien.com.'
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Tên đăng nhập hoặc mật khẩu không chính xác.'
  }
  if (code === 'auth/user-not-found') {
    return 'Tài khoản không tồn tại trên hệ thống.'
  }
  if (code === 'auth/email-already-in-use') {
    return 'Email hoặc tên tài khoản này đã được sử dụng. Vui lòng chọn tên khác.'
  }
  if (code === 'auth/weak-password') {
    return 'Mật khẩu quá yếu (yêu cầu tối thiểu 6 ký tự).'
  }
  if (code === 'auth/too-many-requests') {
    return 'Thao tác quá nhiều lần liên tiếp. Vui lòng thử lại sau ít phút.'
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Cửa sổ đăng nhập Google đã bị đóng trước khi hoàn tất.'
  }
  return err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.'
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [isRegistering, setIsRegistering] = useState(false)
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [className, setClassName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  const targetRedirect = getRedirectTarget(searchParams.get('redirect'))

  useEffect(() => {
    if (user && !loading) {
      router.push(targetRedirect)
    }
  }, [user, loading, router, targetRedirect])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResetMsg(null)
    setLoading(true)

    try {
      const resolvedEmail = resolveEmailFromUsername(emailOrUsername)
      const userCredential = await signInWithEmailAndPassword(auth, resolvedEmail, password)
      await recordLoginSession(userCredential.user.uid)
      router.push(targetRedirect)
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err)
      setError(getFriendlyErrorMessage(err))
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResetMsg(null)
    setLoading(true)

    try {
      const resolvedEmail = resolveEmailFromUsername(emailOrUsername)
      const userCredential = await createUserWithEmailAndPassword(auth, resolvedEmail, password)
      const uid = userCredential.user.uid
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername

      await setDoc(doc(db, 'users', uid), {
        uid,
        email: resolvedEmail,
        username: username.trim(),
        fullName: fullName.trim(),
        class: className.trim(),
        phoneNumber: phoneNumber.trim(),
        birthDate: birthDate || '',
        role: 'hoc_vien',
        createdAt: serverTimestamp(),
      })

      await recordLoginSession(uid)
      router.push(targetRedirect)
    } catch (err: any) {
      console.error('Lỗi đăng ký:', err)
      setError(getFriendlyErrorMessage(err))
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setResetMsg(null)
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const googleUser = result.user

      const userDocRef = doc(db, 'users', googleUser.uid)
      const userDocSnap = await getDoc(userDocRef)

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: googleUser.uid,
          email: googleUser.email || '',
          username: googleUser.email ? googleUser.email.split('@')[0] : 'user',
          fullName: googleUser.displayName || 'Học viên',
          class: '',
          phoneNumber: googleUser.phoneNumber || '',
          birthDate: '',
          role: 'hoc_vien',
          createdAt: serverTimestamp(),
        })
      }

      await recordLoginSession(googleUser.uid)
      router.push(targetRedirect)
    } catch (err: any) {
      console.error('Lỗi Google Sign-in:', err)
      setError(getFriendlyErrorMessage(err))
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError(null)
    setResetMsg(null)

    if (!emailOrUsername.trim()) {
      setError('Vui lòng nhập Email hoặc Tên tài khoản vào ô bên dưới trước khi bấm "Quên mật khẩu".')
      return
    }

    setLoading(true)
    try {
      const targetEmail = resolveEmailFromUsername(emailOrUsername)
      await sendPasswordResetEmail(auth, targetEmail)
      setResetMsg(`Đã gửi liên kết khôi phục mật khẩu tới email: ${targetEmail}. Vui lòng kiểm tra hộp thư!`)
    } catch (err: any) {
      console.error('Lỗi khôi phục mật khẩu:', err)
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (user && !loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingText}>Đang chuyển hướng tới cổng quản lý...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>
          {isRegistering ? 'Đăng ký Tài khoản' : 'Đăng nhập Hệ thống'}
        </h1>
        <p className={styles.subtitle}>
          {isRegistering
            ? 'Tạo tài khoản học viên để truy cập cổng thông tin và hồ sơ'
            : 'Cổng thông tin đào tạo & sát hạch thuyền viên thủy nội địa'}
        </p>

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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
                <label htmlFor="className" className={styles.label}>
                  Lớp học (Ví dụ: K45 Thuyền trưởng H3)
                </label>
                <input
                  type="text"
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Nhập tên khóa hoặc lớp học"
                />
              </div>

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
            </>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="emailOrUsername" className={styles.label}>
              Email hoặc Tên tài khoản
            </label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className={styles.input}
              placeholder="tennguoidung hoặc email@example.com"
              autoComplete="username"
            />
          </div>

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
              placeholder={isRegistering ? 'Tối thiểu 6 ký tự' : '••••••••'}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {resetMsg && <div className={styles.success}>{resetMsg}</div>}

          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              className={`${styles.button} ${styles.buttonPrimary}`}
            >
              {loading ? 'Đang xử lý...' : isRegistering ? 'Hoàn tất Đăng ký' : 'Đăng nhập'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError(null)
                setResetMsg(null)
              }}
              disabled={loading}
              className={`${styles.button} ${styles.buttonSecondary}`}
            >
              {isRegistering ? 'Đã có tài khoản? Đăng nhập ngay' : 'Tạo tài khoản học viên mới'}
            </button>
          </div>
        </form>

        {!isRegistering && (
          <>
            <div className={styles.divider}>
              <span>Hoặc</span>
            </div>

            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`${styles.button} ${styles.buttonGoogle}`}
              >
                <FaGoogle style={{ color: '#EA4335' }} />
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <p className={styles.loadingText}>Đang tải trang đăng nhập...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
