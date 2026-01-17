import React from 'react'
import styles from './page.module.css' // (Triệu hồi CSS)

// (Đây là Server Component vì nội dung là tĩnh)
export default function GioiThieuPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Giới thiệu chung</h1>
      
      <div className={styles.content}>
        <h3>TÊN ĐƠN VỊ: CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h3>
        
        <h3>CHỨC NĂNG, NHIỆM VỤ:</h3>
        <p>
          Tổ chức đào tạo nâng hạng bằng thuyền, máy trưởng phương tiện thủy nội địa hạng nhất, nhì, ba; đào tạo và cấp các loại chứng chỉ chuyên môn cho người lái, thuyền viên phương tiện thủy nội địa.
        </p>
      </div>
      
    </div>
  )
}