import React from 'react'
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi CSS)

// (Đây là Server Component Tĩnh)
export default function ChuongTrinhDaoTaoLobby() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chương trình đào tạo</h1>

      {/* (Phần Máy trưởng) */}
      <h2 className={styles.categoryTitle}>Máy trưởng</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/maytruong-h1" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng nhất (M1)
        </Link>
        <Link href="/chuong-trinh-dao-tao/maytruong-h2" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng nhì (M2)
        </Link>
        <Link href="/chuong-trinh-dao-tao/maytruong-h3" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng ba (M3)
        </Link>
      </div>

      {/* (Phần Thuyền trưởng) */}
      <h2 className={styles.categoryTitle}>Thuyền trưởng</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h1" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng nhất (T1)
        </Link>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h2" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng nhì (T2)
        </Link>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h3" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng ba (T3)
        </Link>
      </div>

      {/* (Phần Chứng chỉ chuyên môn) */}
      <h2 className={styles.categoryTitle}>Chứng chỉ chuyên môn</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/thuythu" className={styles.linkItem}>
          Chứng chỉ Thủy thủ
        </Link>
        <Link href="/chuong-trinh-dao-tao/thomay" className={styles.linkItem}>
          Chứng chỉ Thợ máy
        </Link>
        <Link href="/chuong-trinh-dao-tao/lai-phuong-tien" className={styles.linkItem}>
          Chứng chỉ Lái phương tiện
        </Link>
      </div>

      {/* 💖 (Phần Chứng chỉ đặc biệt - ĐÃ THÊM 3 MỤC MỚI) 💖 */}
      <h2 className={styles.categoryTitle}>Chứng chỉ đặc biệt</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/dieu-khien-cao-toc" className={styles.linkItem}>
          Chứng chỉ Điều khiển phương tiện cao tốc - ĐKCT
        </Link>
        <Link href="/chuong-trinh-dao-tao/dieu-khien-ven-bien" className={styles.linkItem}>
          Chứng chỉ Điều khiển phương tiện thủy nội địa đi ven biển - ĐKVB - SB
        </Link>
        <Link href="/chuong-trinh-dao-tao/an-toan-ven-bien" className={styles.linkItem}>
          Chứng chỉ An toàn làm việc trên phương tiện đi ven biển - ATVB
        </Link>
        <Link href="/chuong-trinh-dao-tao/an-toan-xang-dau" className={styles.linkItem}>
          Chứng chỉ An toàn làm việc trên phương tiện chở xăng dầu - ATXD
        </Link>
        <Link href="/chuong-trinh-dao-tao/an-toan-hoa-chat" className={styles.linkItem}>
          Chứng chỉ An toàn làm việc trên phương tiện chở hoá chất - ATHC
        </Link>
        <Link href="/chuong-trinh-dao-tao/an-toan-khi-hoa-long" className={styles.linkItem}>
          Chứng chỉ An toàn làm việc trên phương tiện chở khí hóa lỏng - ATKHL
        </Link>
      </div>

    </div>
  )
}