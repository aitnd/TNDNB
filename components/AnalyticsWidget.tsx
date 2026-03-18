// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
// (Mình mượn tạm "áo" của trang Quản lý luôn nha)
import styles from '../app/quan-ly/page.module.css' 

// (Kiểu dữ liệu mình "hứa" là sẽ nhận về)
type AnalyticsData = {
  totalUsers: string;
  totalPageViews: string;
};

export default function AnalyticsWidget() {
  // (Ba cái "não" cho nó: Data, Đang tải, Bị lỗi)
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // (Phép thuật "tự động gọi" đường hầm khi trang tải)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // (Gọi vào 'đường hầm bí mật' mình vừa làm)
        const res = await fetch('/api/analytics');
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Lỗi khi lấy dữ liệu từ API');
        }
        
        const analyticsData = await res.json();
        setData(analyticsData);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData(); // (Chạy!)
  }, []); // (Chạy 1 lần duy nhất khi "màn hình" được gắn lên)

  
  // --- GIAO DIỆN CÁI "HỘP" NÈ ANH ---

  // (Nếu đang tải)
  if (loading) {
    return (
      <div className={styles.infoBox} style={{ fontStyle: 'italic', color: '#555' }}>
        <h2 className={styles.analyticsTitle}>📊 Thống kê 7 ngày qua</h2>
        <p>Đang tải số liệu từ Google Analytics...</p>
      </div>
    )
  }

  // (Nếu bị lỗi)
  if (error) {
     return (
      <div className={styles.infoBox} style={{ borderColor: '#f9bdbb', backgroundColor: '#fde8e8' }}>
        <h2 className={styles.analyticsTitle} style={{ color: '#9b2c2c' }}>Lỗi khi tải Thống kê</h2>
        <p style={{ color: '#9b2c2c' }}>{error}</p>
        <p style={{ color: '#9b2c2c', fontSize: '0.9rem', fontStyle: 'italic' }}>
          (Anh kiểm tra lại 2 &apos;chìa khóa&apos; GOOGLE_... trên Vercel và quyền &apos;Viewer&apos; của robot email nha)
        </p>
      </div>
    )
  }

  // (Nếu thành công!)
  return (
    <div className={styles.infoBox}>
      <h2 className={styles.analyticsTitle}>📊 Thống kê 7 ngày qua</h2>
      
      {/* (Mình chia 2 cột cho đẹp) */}
      <div className={styles.analyticsGrid}>
        
        {/* Cột 1: Người dùng */}
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>
            {data?.totalUsers}
          </div>
          <div className={styles.analyticsLabel}>
            Tổng người dùng
          </div>
        </div>
        
        {/* Cột 2: Lượt xem */}
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>
            {data?.totalPageViews}
          </div>
          <div className={styles.analyticsLabel}>
            Tổng lượt xem trang
          </div>
        </div>
        
      </div>
    </div>
  )
}