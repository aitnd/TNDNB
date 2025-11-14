import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // (CSS "Sạch")

// 💖 (ĐÃ XÓA DÒNG 'suneditor/dist/css/suneditor.min.css' Ở ĐÂY) 💖

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
        
        {/* (Chỗ này anh dán Chatbot Script nè) */}
        
      </body>
    </html>
  )
}