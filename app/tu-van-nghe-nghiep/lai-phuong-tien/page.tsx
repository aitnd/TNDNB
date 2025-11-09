import React from 'react'
import Link from 'next/link'
import styles from '../tu-van.module.css' // (Dùng CSS Chung)

export default function TuVanLaiPhuongTienPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tư vấn: Chứng chỉ lái phương tiện
      </h1>
      
      <div className={styles.content}>
        
        <h3>I. Điều kiện dự học, thi và khả năng đảm nhiệm trên phương tiện của chứng chỉ lái phương tiện</h3>
        
        <p>
          {/* (Em đã sửa "thủy thủ" thành "lái phương tiện" theo đúng tiêu đề) */}
          Để đăng ký học được chứng chỉ lái phương tiện thì điều kiện là Công dân việt nam đủ 18 tuổi có đủ sức khỏe do cơ quan y tế có thẩm quyền xác nhận.
        </p>

        <h3>II. Hồ sơ dự học</h3>
        <ul>
            {/* (Anh thay '...' bằng link file PDF đơn đề nghị) */}
            <li>Đơn đề nghị;</li>
            <li>01 Bản photo Căn cước công dân;</li>
            <li>08 ảnh 2x3 nền trắng, ảnh chụp không quá 6 tháng;</li>
            <li>Giấy chứng nhận sức khỏe do cơ sở y tế có thẩm quyền cấp;</li>
        </ul>

        <h3>III. Khả năng đảm nhiệm</h3>
        <p>
          Người có chứng chỉ lái phương tiện được trực tiếp điều khiển phương tiện không có động cơ trọng tải toàn phần đến 15 tấn hoặc phương tiện có động cơ tổng công suất máy chính đến 15 sức ngựa hoặc phương tiện có sức chở đến 12 (mười hai) người hoặc bè.
        </p>

        <h3>IV. Học Phí lệ phí</h3>
        <Link href="/hoc-phi" className={styles.linkButton}>
          Xem Biểu học phí chi tiết
        </Link>

      </div>

      {/* Nút Quay về */}
      <div className={styles.backButtonContainer}>
        <Link href="/tu-van-nghe-nghiep" className={styles.linkButton}>
          « Quay về trang Tư vấn
        </Link>
      </div>
    </div>
  )
}