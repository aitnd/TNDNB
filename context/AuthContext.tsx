// 'use client'
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebaseClient' // (Sửa đường dẫn ../)

// 1. Định nghĩa "kiểu" của người dùng (THÊM fullName)
interface AuthUser {
  uid: string
  email: string | null
  role: string 
  fullName: string // 💖 "HỌ VÀ TÊN" 💖
}

// 2. Định nghĩa "kiểu" của "Bộ não" (Context)
interface AuthContextType {
  user: AuthUser | null 
  loading: boolean 
}

// 3. Tạo "Bộ não" (Context)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 4. Tạo "Nhà cung cấp" (AuthProvider)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true) 

  // 5. "Phép thuật" tự động "lắng nghe" (ĐÃ NÂNG CẤP)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // --- Có người đăng nhập! ---
        console.log('Phát hiện người dùng đăng nhập:', firebaseUser.uid)
        
        // Lấy "hồ sơ" vai trò từ "Tủ" Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        let authUser: AuthUser; // (Khai báo ở ngoài)

        if (userDoc.exists()) {
          // Nếu có "hồ sơ"
          const userData = userDoc.data()
          authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role || 'hoc_vien',
            fullName: userData.fullName || 'Người dùng mới' // 💖 LẤY "HỌ TÊN" 💖
          }
          setUser(authUser)
          console.log(`Vai trò: ${authUser.role}, Tên: ${authUser.fullName}`)
        } else {
          // Nếu không có "hồ sơ"
           authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'hoc_vien',
            fullName: 'Người dùng (chưa có hồ sơ)' // (Tạm)
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

    // "Tắt tai nghe"
    return () => unsubscribe()
  }, [])

  // 6. "Bơm" dữ liệu
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 7. Tạo một "Móc" (hook)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider')
  }
  return context
}