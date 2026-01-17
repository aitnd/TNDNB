import React from 'react'
import Link from 'next/link'
import styles from '../tu-van.module.css' // (Dùng CSS Chung)

export default function TuVanT2Page() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Tư vấn: Thuyền trưởng hạng nhì (T2)
      </h1>
      
      <div className={styles.content}>
        
        <h3>I. Điều kiện dự học và thi cấp GCNKNCM Thuyền trưởng hạng nhì (T2)</h3>
        
        <p><strong>Điều kiện chung:</strong></p>
        <ul>
          <li>Là công dân Việt Nam, người nước ngoài đã hoàn thành chương trình đào tạo, bồi dưỡng nghề tương ứng với từng loại, hạng GCNKNCM, CCCM (trừ các trường hợp cụ thể quy định tại điểm b khoản 7, điểm b khoản 8, điểm b khoản 9, điểm b khoản 10, điểm b khoản 11 và điểm b khoản 12 Điều 6 của Thông tư này).</li>
          <li>Đủ tuổi, đủ thời gian đảm nhiệm chức danh hoặc thời gian tập sự tính đến thời điểm ra quyết định thành lập Hội đồng thi, kiểm tra tương ứng với từng loại, hạng GCNKNCM, CCCM quy định tại Điều 6 của Thông tư này.</li>
          <li>Có giấy chứng nhận sức khỏe do cơ sở y tế có thẩm quyền cấp.</li>
        </ul>
        
        <p><strong>Điều kiện cụ thể:</strong></p>
        <p>Ngoài các điều kiện chung trên, người dự thi, kiểm tra để được cấp GCNKNCM Thuyền trưởng hạng nhì phải bảo đảm điều kiện cụ thể sau:</p>
        <ul>
          <li>a) Có GCNKNCM thuyền trưởng hạng ba, có thời gian đảm nhiệm chức danh thuyền trưởng hạng ba đủ 18 tháng trở lên hoặc có chứng chỉ sơ cấp nghề thuyền trưởng hạng ba, có thời gian tập sự đủ 12 tháng trở lên;</li>
          <li>b) Đối với người đã có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 12 tháng trở lên được dự thi để cấp GCNKNCM thuyền trưởng hạng nhì, không phải dự học chương trình tương ứng.</li>
        </ul>

        <h3>II. Đảm nhiệm chức danh thuyền viên</h3>
        <p>
          Thuyền viên có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng nhì được đảm nhiệm chức danh thuyền trưởng của các loại phương tiện sau đây:
        </p>
        <ul>
            <li>a) Phương tiện chở khách có sức chở đến 100 (một trăm) khách;</li>
            <li>b) Phà có sức chở đến 100 (một trăm) khách và đến 350 tấn hàng hóa;</li>
            <li>c) Phương tiện chở hàng có trọng tải toàn phần đến 1000 tấn;</li>
            <li>d) Đoàn lai có trọng tải toàn phần đến 1500 tấn;</li>
            <li>đ) Phương tiện không thuộc các điểm a, b, c, d khoản này lắp máy trong có tổng công suất máy chính đến 1000 sức ngựa hoặc phương tiện lắp máy ngoài có tổng công suất máy chính đến 3000 sức ngựa.</li>
        </ul>


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