import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' 
import Script from 'next/script' 

import { AuthProvider } from '../context/AuthContext' 
// 1. Import thêm cái này nha anh
import { ThemeProvider } from '../context/ThemeContext' 

import Navbar from '../components/Navbar' 
import Footer from '../components/Footer' 

const inter = Inter({ subsets: ['latin'] })

const GA_TRACKING_ID = 'G-8NETMXL60S'; 
const AW_TRACKING_ID = 'AW-16621935811'; 
const ADSENSE_CLIENT_ID = 'ca-pub-6121118706628509';

export const metadata: Metadata = {
  title: {
    template: '%s | TĐNB', 
    default: 'Trang chủ | Công ty CP Tư vấn và Giáo dục Ninh Bình', 
  },
  description: 'Chuyên đào tạo, bồi dưỡng cấp GCNKNCM...',
  openGraph: {
    title: 'Công ty CP Tư vấn và Giáo dục Ninh Bình',
    description: 'Đào tạo thuyền, máy trưởng và chứng chỉ chuyên môn PTTNĐ.',
    images: ['/trang-chu-banner.jpg'], 
    url: 'https://tndnb.vercel.app', 
    siteName: 'TĐNB Ninh Bình',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <AuthProvider>
          {/* 2. Bọc ThemeProvider ở đây, ngay trong AuthProvider */}
          <ThemeProvider>
            
            <Navbar />
            
            <main style={{ minHeight: '80vh' }}>
              {children}
            </main>

            <Footer />

          </ThemeProvider>
        </AuthProvider>
        
        {/* Scripts giữ nguyên */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
              gtag('config', '${AW_TRACKING_ID}');
            `,
          }}
        />
        <Script
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}