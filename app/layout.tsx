import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MusicPlayer from '../components/MusicPlayer'
import MobileBottomNav from '../components/MobileBottomNav'

// Cấu hình font Rubik (Hỗ trợ tiếng Việt đầy đủ)
const rubik = Rubik({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
})

// Các mã Tracking
const GA_TRACKING_ID = 'G-8NETMXL60S';
const AW_TRACKING_ID = 'AW-16621935811';
const ADSENSE_CLIENT_ID = 'ca-pub-6121118706628509';

export const metadata: Metadata = {
  // 1. Sửa link gốc website theo yêu cầu của anh
  metadataBase: new URL('https://www.daotaothuyenvien.com'),

  title: {
    template: '%s | TĐNB',
    default: 'Trang chủ | Công ty CP Tư vấn và Giáo dục Ninh Bình',
  },
  description: 'Chuyên đào tạo, bồi dưỡng cấp GCNKNCM và Chứng chỉ chuyên môn Thuyền, Máy trưởng hạng Nhất, Nhì, Ba và các chứng chỉ thủy thủ, thợ máy...',
  openGraph: {
    title: 'Công ty CP Tư vấn và Giáo dục Ninh Bình',
    description: 'Đào tạo thuyền, máy trưởng và chứng chỉ chuyên môn PTTNĐ.',
    images: ['/trang-chu-banner.jpg'],
    url: 'https://www.daotaothuyenvien.com', // Cập nhật link ở đây luôn
    siteName: 'TĐNB Ninh Bình',
    locale: 'vi_VN',
    type: 'website',
  },
};
// ... (Phần trên giữ nguyên) ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={rubik.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ThemeProvider>

            {/* ❄️ HIỆU ỨNG TUYẾT & QUÀ RƠI DÀY ĐẶC ❄️ */}
            <div className="snowflakes" aria-hidden="true">
              {/* Bông tuyết trắng (Tăng số lượng lên 30 bông) */}
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={`snow-${i}`} className="snowflake">
                  {['❅', '❆', '❄'][i % 3]} {/* Chọn ngẫu nhiên ký tự tuyết */}
                </div>
              ))}

              {/* Ảnh quả châu và kẹo rơi cùng (Thêm 8 hình ảnh) */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`img-${i}`} className="snowflake snowflake-img">
                  {/* Chọn ngẫu nhiên ảnh từ icon-1 đến icon-4 */}
                  <img
                    src={`/assets/img/icon-${(i % 4) + 1}.png`}
                    alt=""
                    style={{ width: '25px', height: 'auto' }}
                  />
                </div>
              ))}
            </div>

            <Navbar />{/* Force Rebuild Layout */}
            {/* ... (Phần dưới giữ nguyên) ... */}

            <main style={{ minHeight: '80vh', position: 'relative', paddingBottom: '64px' }}>
              {children}
            </main>

            {/* Gắn nhạc nền Noel */}
            <MusicPlayer />
            <MobileBottomNav />

            <Footer />

          </ThemeProvider>
        </AuthProvider>

        {/* === CÁC SCRIPT THEO DÕI (GA4, ADS) === */}
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
        <SpeedInsights />
      </body>
    </html>
  )
}