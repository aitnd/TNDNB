'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../utils/firebaseClient'
import { supabase } from '../utils/supabaseClient' // 💖 "TRIỆU HỒI" SUPABASE 💖

// 1. 💖 NÂNG CẤP "KIỂU" NGƯỜI DÙNG 💖
interface AuthUser {
  uid: string
  email: string | null
  role: 'hoc_vien' | 'giao_vien' | 'lanh_dao' | 'admin' | 'quan_ly'
  fullName?: string
  phoneNumber?: string
  birthDate?: string
  class?: string // Lớp học (tự điền)
  courseId?: string // ID Khóa học (được gán)
  courseName?: string // Tên Khóa học (được gán)
  isVerified?: boolean // Đã được xác thực vào khóa học chưa
  cccd?: string // Số CCCD
  cccdDate?: string // Ngày cấp
  cccdPlace?: string // Nơi cấp
  address?: string // Địa chỉ
  photoURL?: string // 💖 URL Avatar 💖
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
        try {
          const token = await firebaseUser.getIdToken()
          // (Đưa "vé" cho Supabase để "nâng cấp" quyền)
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: token,
            // (Refresh token đôi khi bị null, mình chỉ cần access_token là đủ)
            refresh_token: firebaseUser.refreshToken || token,
          });
          if (sessionError) {
            console.error("LỖI KHI SETSESSION SUPABASE:", sessionError.message);
            // (Nếu setSession lỗi, mình vẫn tiếp tục để ít nhất web chạy được)
          } else {
          }
        } catch (e: any) {
          console.error("LỖI NGOẠI LỆ khi lấy token/setSession:", e.message);
        }

        // (Lấy "hồ sơ" vai trò từ "Tủ" Firestore)
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)

        let authUser: AuthUser;

        if (userDoc.exists()) {
          const userData = userDoc.data()
          authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userData.role || 'hoc_vien',
            fullName: userData.fullName || 'Người dùng mới',
            phoneNumber: userData.phoneNumber || undefined,
            birthDate: userData.birthDate || undefined,
            class: userData.class || undefined,
            courseId: userData.courseId || undefined,
            courseName: userData.courseName || undefined,
            isVerified: userData.isVerified || false,
            cccd: userData.cccd || undefined,
            cccdDate: userData.cccdDate || undefined,
            cccdPlace: userData.cccdPlace || undefined,
            address: userData.address || undefined,
            photoURL: userData.photoURL || undefined, // 💖 Map Avatar 💖
          }
          setUser(authUser)
        } else {
          authUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'hoc_vien',
            fullName: 'Người dùng (chưa có hồ sơ)',
          }
          setUser(authUser)
          console.warn('Không tìm thấy hồ sơ vai trò (role) cho user này!')
        }

      } else {
        // --- Không có ai đăng nhập ---
        setUser(null)
        // 💖 BƯỚC 2: "BÁO CÁO" ĐĂNG XUẤT 💖
        await supabase.auth.signOut();
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