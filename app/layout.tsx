import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // (CSS "Sạch" của v3)

// (CSS của Trình soạn thảo Ổn định "react-quill" v3)

import { AuthProvider } from '../context/AuthContext' 
import Navbar from '../components/Navbar' 
import Footer from '../components/Footer' 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hệ thống Đào tạo Thuyền viên',
  description: 'Trường CĐ TV và GD Ninh Bình',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      {/* 💖 "THẦN CHÚ" SỬA LỖI LÀ ĐÂY 💖
        (Thêm 'suppressHydrationWarning={true}' vào thẻ <body>
         để "bịt" lỗi "bẩn" (Hydration Error) do Extension)
      */}
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning={true}>
        <AuthProvider>
          
          <Navbar />
          
          <main>
            {children}
          </main>

          <Footer />

        </AuthProvider>
      </body>
    </html>
  )
}