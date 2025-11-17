import React from 'react';
import Sidebar from '../../components/Sidebar'; // (Server Component "xịn")
import styles from './page.module.css'; // (Mượn CSS của trang page.tsx)

// Đây là "Server Component" làm cái khung
export default function LienHeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // (Cái này sẽ tạo bố cục 2 cột y như cũ)
    <div className={styles.layoutGrid}>
      {/* Cột trái (chính là file page.tsx của mình) */}
      <main className={styles.mainContent}>
        {children} 
      </main>
      
      {/* Cột phải (Sidebar nè) */}
      <Sidebar />
    </div>
  );
}