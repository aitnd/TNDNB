import React from 'react'
import Link from 'next/link'
import styles from '../tu-van.module.css' // (Dùng CSS Chung)

export default function TuVanThuyThuPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tư vấn: Chứng chỉ thủy thủ
      </h1>
      
      <div className={styles.content}>
        
        <h3>I. Điều kiện dự học, thi và khả năng đảm nhiệm trên phương tiện của chứng chỉ thủy thủ</h3>
        
        <p>Thủy thủ là người chịu sự lãnh đạo của thuyền trưởng và người phụ trách ca, có trách nhiệm:</p>
        <ul>
          <li>Thực hiện các công việc cần thiết cho phương tiện rời bến, cập bến; kiểm tra cầu cho hành khách lên, xuống phương tiện được an toàn.</li>
          <li>Thường xuyên có mặt ở vị trí đã được phân công để sẵn sàng ứng phó với mọi tình huống có thể xảy ra.</li>
          <li>Trực tiếp điều khiển phương tiện và thực hiện một số nhiệm vụ khác khi được thuyền trưởng hoặc người phụ trách trực tiếp giao.</li>
        </ul>
        
        <p>Để đăng ký học được chứng chỉ thủy thủ thì điều kiện là Công dân việt nam đủ 16 tuổi có đủ sức khỏe do cơ quan y tế có thẩm quyền xác nhận.</p>

        <h3>II. Hồ sơ dự học</h3>
        <ul>
            {/* (Anh thay '...' bằng link file PDF đơn đề nghị) */}
            <li>Đơn đề nghị;</li>
            <li>01 Bản photo Căn cước công dân;</li>
            <li>08 ảnh 2x3 nền trắng, ảnh chụp không quá 6 tháng;</li>
            <li>Giấy chứng nhận sức khỏe do cơ sở y tế có thẩm quyền cấp;</li>
        </ul>

        <h3>III. Khả năng đảm nhiệm:</h3>
        <p>
          Thuyền viên có chứng chỉ thủy thủ được đảm nhiệm chức danh thủy thủ của các loại phương tiện.
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