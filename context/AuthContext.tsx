// 'use client' (Rất quan trọng)
// File này quản lý trạng thái đăng nhập,
// nó cần chạy ở phía Client (trình duyệt).
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/firebaseClient' // "Tổng đài" Firebase

// 1. Định nghĩa "kiểu" của người dùng trong "biệt thự"
interface AuthUser {
  uid: string
  email: string | null
  role: string // 'hoc_vien', 'giao_vien', 'admin', 'lanh_dao'
}

// 2. Định nghĩa "kiểu" của "Bộ não" (Context)
interface AuthContextType {
  user: AuthUser | null // Người dùng đang đăng nhập (hoặc null)
  loading: boolean // Trạng thái đang tải (kiểm tra xem ai đăng nhập)
}

// 3. Tạo "Bộ não" (Context)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 4. Tạo "Nhà cung cấp" (AuthProvider)
//    Đây là "cái máy" sẽ "bơm" thông tin đăng nhập cho toàn bộ "biệt thự"
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true) // Ban đầu luôn tải

  // 5. "Phép thuật" tự động "lắng nghe"
  //    Nó sẽ tự chạy 1 lần khi "biệt thự" tải
  useEffect(() => {
    // "Lắng nghe" dịch vụ "Bảo vệ" của Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // --- Có người đăng nhập! ---
        console.log('Phát hiện người dùng đăng nhập:', firebaseUser.uid)
        
        // Lấy "hồ sơ" vai trò từ "Tủ" Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          // Nếu có "hồ sơ"
          const userData = userDoc.data()
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role || 'hoc_vien' // Mặc định là 'hoc_vien'
          }
          setUser(authUser)
          console.log('Vai trò người dùng:', authUser.role)
        } else {
          // Nếu không có "hồ sơ" (tài khoản cũ?) -> Gán tạm
           const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'hoc_vien' // Mặc định là 'hoc_vien'
          }
          setUser(authUser)
          console.warn('Không tìm thấy hồ sơ vai trò (role) cho user này!')
        }
        
      } else {
        // --- Không có ai đăng nhập ---
        setUser(null)
      }
      setLoading(false) // Tải xong!
    })

    // "Tắt tai nghe" khi "rời khỏi biệt thự"
    return () => unsubscribe()
  }, [])

  // 6. "Bơm" dữ liệu (user, loading) cho "biệt thự"
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 7. Tạo một "Móc" (hook)
//    Giúp các "căn phòng" (component) dễ dàng "hút" dữ liệu từ "Bộ não"
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider')
  }
  return context
}