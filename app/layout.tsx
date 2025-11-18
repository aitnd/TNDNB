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
// (Mã Ads Tracking của anh)
const AW_TRACKING_ID = 'AW-16621935811'; 
// 💖 (Mã AdSense "Kiếm tiền" của anh) 💖
const ADSENSE_CLIENT_ID = 'ca-pub-6121118706628509';

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
      <body className={`${inter.className} bg-gray-50`} suppressHydrationWarning={true}>
        <AuthProvider>
          
          <Navbar />
          
          <main>
            {children}
          </main>

          <Footer />

        </AuthProvider>
        
        {/* (Chỗ này anh dán Chatbot Script nè) */}

        {/* 💖 GẮN "MÁY ĐẾM" (GA4) VÀ "THEO DÕI" (ADS) 💖 */}
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
        
        {/* 💖 GẮN "BIỂN CHO THUÊ" (ADSENSE) 💖 */}
        <Script
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        
      </body>
    </html>
  )
}