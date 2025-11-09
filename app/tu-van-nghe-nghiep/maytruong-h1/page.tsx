import React from 'react'
import Link from 'next/link'
import styles from '../tu-van.module.css' // (Dùng CSS Chung)

export default function TuVanM1Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tư vấn: Máy trưởng hạng nhất (M1)
      </h1>
      
      <div className={styles.content}>
        
        <h3>I. Điều kiện dự học và thi cấp GCNKNCM Máy trưởng hạng nhất (M1)</h3>
        
        <p><strong>Điều kiện chung:</strong></p>
        <ul>
          <li>Là công dân Việt Nam, người nước ngoài đã hoàn thành chương trình đào tạo, bồi dưỡng nghề tương ứng với từng loại, hạng GCNKNCM, CCCM (trừ các trường hợp cụ thể quy định tại điểm b khoản 7, điểm b khoản 8, điểm b khoản 9, điểm b khoản 10, điểm b khoản 11 và điểm b khoản 12 Điều 6 của Thông tư này).</li>
          <li>Đủ tuổi, đủ thời gian đảm nhiệm chức danh hoặc thời gian tập sự tính đến thời điểm ra quyết định thành lập Hội đồng thi, kiểm tra tương ứng với từng loại, hạng GCNKNCM, CCCM quy định tại Điều 6 của Thông tư này.</li>
          <li>Có giấy chứng nhận sức khỏe do cơ sở y tế có thẩm quyền cấp.</li>
        </ul>
        
        <p><strong>Điều kiện cụ thể:</strong></p>
        <p>Ngoài các điều kiện chung trên, người dự thi, kiểm tra để được cấp GCNKNCM Máy trưởng hạng nhất phải bảo đảm điều kiện cụ thể sau:</p>
        <ul>
          <li>a) Có bằng tốt nghiệp trung học phổ thông hoặc tương đương trở lên, có GCNKNCM máy trưởng hạng nhì, có thời gian đảm nhiệm chức danh máy trưởng hạng nhì đủ 18 tháng trở lên;</li>
          <li>b) Đối với người đã có bằng tốt nghiệp cao đẳng trở lên được đào tạo nghề máy tàu thủy hoặc máy tàu biển, hoàn thành thời gian tập sự theo chức danh máy trưởng hạng nhì đủ 12 tháng trở lên được dự thi để cấp GCNKNCM máy trưởng hạng nhất, không phải dự học chương trình tương ứng.</li>
        </ul>

        <h3>II. Đảm nhiệm chức danh thuyền viên</h3>
        <p>
          Thuyền viên có giấy chứng nhận khả năng chuyên môn máy trưởng hạng nhất được đảm nhiệm chức danh máy trưởng của các loại phương tiện.
        </p>

        <h3>III. Học phí và lệ phí:</h3>
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