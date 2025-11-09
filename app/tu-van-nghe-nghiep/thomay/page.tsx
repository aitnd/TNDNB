import React from 'react'
import Link from 'next/link'
import styles from '../tu-van.module.css' // (Dùng CSS Chung)

export default function TuVanThoMayPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tư vấn: Chứng chỉ thợ máy
      </h1>
      
      <div className={styles.content}>
        
        <h3>I. Điều kiện dự học, thi và khả năng đảm nhiệm trên phương tiện của chứng chỉ thợ máy</h3>
        <p>
          Để đăng ký học được Chứng chỉ Thợ máy thì điều kiện là Công dân việt nam đủ 16 tuổi có đủ sức khỏe do cơ quan y tế có thẩm quyền xác nhận.
        </p>

        <h3>II. Khả năng đảm nhiệm</h3>
        <p>
          Thuyền viên có chứng chỉ thợ máy được đảm nhiệm chức danh thợ máy của các loại phương tiện.
        </p>
        <p>
          Thợ máy chịu sự lãnh đạo của máy trưởng và người phụ trách ca máy, có trách nhiệm sau đây:
        </p>
        <ul>
          <li>Trong khi đi ca phải thực hiện đầy đủ nhiệm vụ đã được phân công; theo dõi các thông số kỹ thuật, tình hình hoạt động của máy, nếu thấy không bình thường phải báo cáo phụ trách ca máy.</li>
          <li>Thường xuyên làm vệ sinh máy và buồng máy; tham gia bảo dưỡng, sửa chữa theo yêu cầu của máy trưởng.</li>
          <li>Thực hiện một số nhiệm vụ khác khi được máy trưởng hoặc phụ trách ca máy giao.</li>
        </ul>
        <p>
          Theo đó, thợ máy của phương tiện thủy nội địa là người chịu sự lãnh đạo của máy trưởng và người phụ trách ca máy trên phương tiện tàu, thuyền và các cấu trúc nổi khác, có động cơ hoặc không có động cơ, chuyên hoạt động trên đường thuỷ nội địa.
        </p>

        <h3>III. Hồ sơ dự học</h3>
        <ul>
            {/* (Anh thay '...' bằng link file PDF đơn đề nghị) */}
            <li>Đơn đề nghị;</li>
            <li>01 Bản photo Căn cước công dân;</li>
            <li>08 ảnh 2x3 nền trắng, ảnh chụp không quá 6 tháng;</li>
            <li>Giấy chứng nhận sức khỏe do cơ sở y tế có thẩm quyền cấp;</li>
        </ul>

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