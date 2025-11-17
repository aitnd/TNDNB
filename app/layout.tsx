import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' 
import Script from 'next/script' 

import { AuthProvider } from '../context/AuthContext' 
import Navbar from '../components/Navbar' 
import Footer from '../components/Footer' 

const inter = Inter({ subsets: ['latin'] })

// (Mã GA4 của anh)
const GA_TRACKING_ID = 'G-8NETMXL60S'; 
// (Mã Ads mới của anh)
const AW_TRACKING_ID = 'AW-16621935811'; // 💖 THÊM DÒNG NÀY 💖

// ("Biển hiệu" SEO mình làm lúc nãy)
export const metadata: Metadata = {
  title: {
    template: '%s | TĐNB', 
    default: 'Trang chủ | Công ty CP Tư vấn và Giáo dục Ninh Bình', 
  },
  description: 'Chuyên đào tạo, bồi dưỡng cấp GCNKNCM và Chứng chỉ chuyên môn Thuyền, Máy trưởng hạng Nhất, Nhì, Ba và các chứng chỉ thủy thủ, thợ máy...',
  openGraph: {
    title: 'Công ty CP Tư vấn và Giáo dục Ninh Bình',
    description: 'Đào tạo thuyền, máy trưởng và chứng chỉ chuyên môn PTTNĐ.',
    images: ['/trang-chu-banner.jpg'], 
    url: 'https://tndnb.vercel.app', // (Địa chỉ web "xịn" của mình)
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
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning={true}>
        <AuthProvider>
          
          <Navbar />
          
          <main>
            {children}
          </main>

          <Footer />

        </AuthProvider>
        
        {/* (Chỗ này anh dán Chatbot Script nè) */}

        {/* 💖 GẮN "MÁY ĐẾM" (ĐÃ CẬP NHẬT) 💖 */}
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
              
              // 💖 THÊM DÒNG "CONFIG" CỦA ADS VÀO ĐÂY NÈ ANH 💖
              gtag('config', '${AW_TRACKING_ID}');
            `,
          }}
        />
        {/* 💖 HẾT PHẦN "MÁY ĐẾM" 💖 */}
        
      </body>
    </html>
  )
}