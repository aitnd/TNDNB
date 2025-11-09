import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // (CSS "Sạch")
import 'suneditor/dist/css/suneditor.min.css'; // (CSS SunEditor)

import { AuthProvider } from '../context/AuthContext' 
import Navbar from '../components/Navbar' 
import Footer from '../components/Footer' 

// 1. 💖 "TRIỆU HỒI" COMPONENT BÌNH LUẬN MỚI 💖
import FacebookComments from '../components/FacebookComments'

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
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning={true}>
        <AuthProvider>
          
          <Navbar />
          
          <main>
            {children}
          </main>

          {/* 2. 💖 "ĐẶT" BOX BÌNH LUẬN Ở ĐÂY 💖 */}
          {/* (Nó sẽ tự động xuất hiện ở MỌI TRANG) */}
          <FacebookComments />

          <Footer />

        </AuthProvider>
      </body>
    </html>
  )
}