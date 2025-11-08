import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // CSS của Tailwind
import 'react-quill-new/dist/quill.snow.css' // CSS của Trình soạn thảo

// Sửa lại đường dẫn "triệu hồi"
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
          {/* 1. "Bọc" Menu ở trên cùng */}
          <Navbar />
          
          {/* 2. "Vẽ" các "căn phòng" (Nội dung trang) */}
          <main>
            {children}
          </main>

          {/* 3. "Bọc" Chân trang ở dưới cùng */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  )
}