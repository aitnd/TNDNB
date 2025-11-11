import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // (CSS "Sạch")

// 1. 💖 (XÓA DÒNG 'react-quill-new' BỊ LỖI) 💖
// import 'react-quill-new/dist/quill.snow.css'; 

// 2. 💖 "TRIỆU HỒI" CSS CỦA "SUNEDITOR" (MỚI) 💖
import 'suneditor/dist/css/suneditor.min.css';

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