import React from 'react';
import Sidebar from '../../components/Sidebar'; // (Server Component "xịn")
import styles from './page.module.css'; // (Mượn CSS của trang tim-kiem)

// Đây là "Server Component" làm cái khung
export default function TimKiemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Dùng .container của trang tìm kiếm luôn cho chuẩn
    <div className={styles.container}>
      <div className={styles.layoutGrid}>
        {/* Cột trái (chính là file page.tsx) */}
        <main className={styles.mainContent}>
          {children} 
        </main>
        
        {/* Cột phải (Sidebar nè) */}
        <Sidebar />
      </div>
    </div>
  );
}