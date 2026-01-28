import React from 'react'
import Link from 'next/link'
// (Chúng ta "mượn" file CSS của trang "Chương trình đào tạo" vì giống hệt)
import styles from '../chuong-trinh-dao-tao/page.module.css' 

// (Đây là Server Component Tĩnh)
export default function TuVanNgheNghiepLobby() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tư vấn nghề nghiệp</h1>

      {/* (Phần Máy trưởng) */}
      <h2 className={styles.categoryTitle}>Máy trưởng</h2>
      <div className={styles.grid}>
        <Link href="/tu-van-nghe-nghiep/maytruong-h1" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng nhất (M1)
        </Link>
        <Link href="/tu-van-nghe-nghiep/maytruong-h2" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng nhì (M2)
        </Link>
        <Link href="/tu-van-nghe-nghiep/maytruong-h3" className={styles.linkItem}>
          GCNKNCM Máy trưởng hạng ba (M3)
        </Link>
      </div>

      {/* (Phần Thuyền trưởng) */}
      <h2 className={styles.categoryTitle}>Thuyền trưởng</h2>
      <div className={styles.grid}>
        <Link href="/tu-van-nghe-nghiep/thuyentruong-h1" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng nhất (T1)
        </Link>
        <Link href="/tu-van-nghe-nghiep/thuyentruong-h2" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng nhì (T2)
        </Link>
        <Link href="/tu-van-nghe-nghiep/thuyentruong-h3" className={styles.linkItem}>
          GCNKNCM Thuyền trưởng hạng ba (T3)
        </Link>
      </div>

      {/* (Phần Chứng chỉ chuyên môn) */}
      <h2 className={styles.categoryTitle}>Chứng chỉ chuyên môn</h2>
      <div className={styles.grid}>
        <Link href="/tu-van-nghe-nghiep/thuythu" className={styles.linkItem}>
          Chứng chỉ Thủy thủ
        </Link>
        <Link href="/tu-van-nghe-nghiep/thomay" className={styles.linkItem}>
          Chứng chỉ Thợ máy
        </Link>
        <Link href="/tu-van-nghe-nghiep/lai-phuong-tien" className={styles.linkItem}>
          Chứng chỉ Lái phương tiện
        </Link>
      </div>

    </div>
  )
}