// Đánh dấu đây là "Client Component"
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // "Điều hướng" của Next.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/utils/firebaseClient' // "Tổng đài" Firebase
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext' // "Bộ não" Auth

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null) // Thông báo lỗi
  const [loading, setLoading] = useState(false)
  
  const router = useRouter() // "Điều hướng"
  const { user } = useAuth() // Lấy thông tin người dùng từ "Bộ não"

  // --- HÀM XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // 1. Gọi "Bảo vệ" Firebase
      await signInWithEmailAndPassword(auth, email, password)
      
      // 2. Đăng nhập thành công, "đẩy" người dùng
      console.log('Đăng nhập thành công, điều hướng...')
      router.push('/quan-ly') // Tạm thời đẩy về trang "Quản lý"

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
      //    (Giống hệt code ở "nhà" HTML/JS cũ)
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
  // (Lưu ý: phần này có thể gây ra vòng lặp render nếu 'user' được cập nhật
  // trong khi component đang render. Chúng ta sẽ tối ưu sau).
  if (user && !loading) {
    router.push('/quan-ly')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Đã đăng nhập, đang điều hướng...</p>
      </div>
    )
  }

  // --- GIAO DIỆN FORM ĐĂNG NHẬP ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">
          Đăng nhập Hệ thống
        </h1>
        
        <form onSubmit={handleLogin}>
          {/* Ô Email */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          {/* Ô Mật khẩu */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {/* Thông báo Lỗi */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Các nút bấm */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký (Test)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}