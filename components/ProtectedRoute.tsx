// Đánh dấu đây là "Client Component"
'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext' // "Bộ não" Auth

// Định nghĩa "kiểu" props
interface ProtectedRouteProps {
  children: ReactNode; // "children" là "Nội dung trang"
  allowedRoles?: string[]; // (Nâng cao) Danh sách vai trò được phép
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth() // Hút dữ liệu từ "Bộ não"
  const router = useRouter()

  // 1. Kiểm tra trạng thái "Đang tải"
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">Đang kiểm tra bảo mật...</p>
      </div>
    )
  }

  // 2. Kiểm tra "Đã đăng nhập chưa?"
  if (!user) {
    // Nếu chưa đăng nhập, "Đá" về trang /login
    router.replace('/login') // Dùng replace để không lưu vào lịch sử
    return null // Không "vẽ" gì cả
  }

  // 3. (Nâng cao) Kiểm tra "Vai trò" (nếu được yêu cầu)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Nếu vai trò không khớp
      // (Tạm thời "đá" về trang chủ, sau này làm trang "Cấm")
      console.warn(`Truy cập bị cấm! Vai trò [${user.role}] không được phép.`)
      router.replace('/') 
      return null // Không "vẽ" gì cả
    }
  }

  // 4. "Ngon"! Đã đăng nhập VÀ đúng vai trò!
  // "Vẽ" nội dung trang (children) ra
  return <>{children}</>
}