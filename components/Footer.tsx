import React from 'react'

// 1. "Triệu hồi" file CSS Module
import styles from './Footer.module.css'

// 2. Dùng `className={styles.footer}`
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH.
        </p>
        <p>
          Địa chỉ: Đường Triệu Việt Vương - Phường Bích Đào - TP. Ninh Bình - Tỉnh Ninh Bình | MST: 2700960947
        </p>
      </div>
    </footer>
  )
}