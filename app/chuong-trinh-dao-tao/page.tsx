import React from 'react'
import Link from 'next/link'
import styles from './page.module.css' // (Triệu hồi CSS MỚI)

// (Đây là Server Component Tĩnh)
export default function ChuongTrinhDaoTaoLobby() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chương trình đào tạo</h1>

      {/* (Phần Máy trưởng) */}
      <h2 className={styles.categoryTitle}>Máy trưởng</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/maytruong-h1" className={styles.linkItem}>
          1. GCNKNCM Máy trưởng hạng nhất (M1)
        </Link>
        <Link href="/chuong-trinh-dao-tao/maytruong-h2" className={styles.linkItem}>
          2. GCNKNCM Máy trưởng hạng nhì (M2)
        </Link>
        <Link href="/chuong-trinh-dao-tao/maytruong-h3" className={styles.linkItem}>
          3. GCNKNCM Máy trưởng hạng ba (M3)
        </Link>
        {/* (Anh copy-paste thêm các hạng khác vào đây) */}
      </div>

      {/* (Phần Thuyền trưởng) */}
      <h2 className={styles.categoryTitle}>Thuyền trưởng</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h1" className={styles.linkItem}>
          4. GCNKNCM Thuyền trưởng hạng nhất (T1)
        </Link>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h2" className={styles.linkItem}>
          5. GCNKNCM Thuyền trưởng hạng nhì (T2)
        </Link>
        <Link href="/chuong-trinh-dao-tao/thuyentruong-h3" className={styles.linkItem}>
          6. GCNKNCM Thuyền trưởng hạng ba (T3)
        </Link>
      </div>

      {/* (Phần Chứng chỉ) */}
      <h2 className={styles.categoryTitle}>Chứng chỉ chuyên môn</h2>
      <div className={styles.grid}>
        <Link href="/chuong-trinh-dao-tao/chung-chi-thuy-thu" className={styles.linkItem}>
          7. Chứng chỉ Thủy thủ
        </Link>
        {/* (Anh copy-paste thêm các chứng chỉ còn lại vào đây) */}
      </div>

    </div>
  )
}