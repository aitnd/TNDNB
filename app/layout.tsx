import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Merriweather, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import dynamic from 'next/dynamic'

const MobileBottomNav = dynamic(() => import('../components/MobileBottomNav'), { ssr: false })
const CapacitorDetector = dynamic(() => import('./components/CapacitorDetector'), { ssr: false })
const GlobalNotificationHandler = dynamic(() => import('./components/GlobalNotificationHandler'), { ssr: false })
const PortalAdLoader = dynamic(() => import('./components/PortalAdLoader'), { ssr: false })
const PortalMaintenanceWrapper = dynamic(() => import('../components/PortalMaintenanceWrapper'), { ssr: false })

// Cấu hình các phông chữ chuẩn hỗ trợ đầy đủ tiếng Việt (Zero Fallback)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

// Các mã Tracking
const GA_TRACKING_ID = 'G-8NETMXL60S';
const AW_TRACKING_ID = 'AW-16621935811';


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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${merriweather.variable} ${jetbrainsMono.variable}`}>
      <head />
      <body className={beVietnamPro.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <Navbar />

          <main style={{ minHeight: '80vh', position: 'relative', paddingBottom: '64px' }}>
            <PortalMaintenanceWrapper>
              {children}
            </PortalMaintenanceWrapper>
          </main>

          <MobileBottomNav />
          <CapacitorDetector />
          <GlobalNotificationHandler />
          <PortalAdLoader />

          <Footer />
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
        <SpeedInsights />
      </body>
    </html>
  )
}
