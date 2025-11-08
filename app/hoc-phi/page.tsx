import React from 'react'

// "Triệu hồi" file CSS Module
import styles from './page.module.css' 

export default function HocPhiPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Biểu mục thu học phí</h1>
      <p className={styles.subtitle}>
        Đào tạo cấp CCCM, GCNKNCM Phương tiện thủy nội địa (Kèm theo Quyết định số: 119/2023/QĐ-CĐSP ngày 11/10/2023)
      </p>

      {/* Bảng học phí */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Loại đào tạo</th>
            <th>Số tiền (đồng)</th>
          </tr>
        </thead>
        <tbody>
          {/* Mục I */}
          <tr className={styles.sectionHeader}>
            <td>I</td>
            <td colSpan={2}>Bồi dưỡng nâng hạng giấy CNKNCM</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Giấy CNKNCM Thuyền trưởng hạng nhất (T1)</td>
            <td>9.000.000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Giấy CNKNCM Thuyền trưởng hạng nhì (T2)</td>
            <td>7.500.000</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Giấy CNKNCM Thuyền trưởng hạng ba (T3)</td>
            <td>5.500.000</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Giấy CNKNCM Máy trưởng hạng nhất (M1)</td>
            <td>7.000.000</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Giấy CNKNCM Máy trưởng hạng nhì (M2)</td>
            <td>5.500.000</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Giấy CNKNCM Máy trưởng hạng ba (M3)</td>
            <td>4.500.000</td>
          </tr>
          
          {/* Mục II */}
          <tr className={styles.sectionHeader}>
            <td>II</td>
            <td colSpan={2}>Đào tạo cấp CCCM nghiệp vụ</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Chứng chỉ thủy thủ (TT)</td>
            <td>3.500.000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Chứng chỉ thợ máy (TM)</td>
            <td>3.500.000</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Chứng chỉ lái phương tiện (LPT)</td>
            <td>4.000.000</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Chứng chỉ An toàn làm việc trên phương tiện đi ven biển (ATVB)</td>
            <td>2.500.000</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Chứng chỉ An toàn làm việc trên phương tiện chở xăng dầu (ATXD)</td>
            <td>3.000.000</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Chứng chỉ An toàn làm việc trên phương tiện chở Hoá chất (ATHC)</td>
            <td>3.000.000</td>
          </tr>
          <tr>
            <td>7</td>
            <td>Chứng chỉ An toàn làm việc trên phương tiện chở Khí (ATKHL)</td>
            <td>3.000.000</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Chứng chỉ điều khiển phương tiện tốc độ cao (ĐKCT)</td>
            <td>3.500.000</td>
          </tr>
          
          {/* Mục III */}
          <tr className={styles.sectionHeader}>
            <td>III</td>
            <td colSpan={2}>Dự thi, sát hạch lại GCNKNCM</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Dự thi, sát hạch lại thuyền, máy trưởng hạng ba (2 môn)</td>
            <td>1.500.000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Dự thi, sát hạch lại thuyền trưởng hạng ba (3 môn)</td>
            <td>2.000.000</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Dự thi, sát hạch lại thuyền, máy trưởng hạng nhì (2 môn)</td>
            <td>2.000.000</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Dự thi, sát hạch lại thuyền trưởng hạng nhì (3 môn)</td>
            <td>2.500.000</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Dự thi, sát hạch lại thuyền, máy trưởng hạng nhất (2 môn)</td>
            <td>2.000.000</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Dự thi, sát hạch lại thuyền trưởng hạng nhất (3 môn)</td>
            <td>2.500.000</td>
          </tr>
          <tr>
            <td>7</td>
            <td>An toàn cơ bản</td>
            <td>100.000</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Cấp lại chứng chỉ chuyên môn</td>
            <td>200.000</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Xét cấp chứng chỉ chuyên môn</td>
            <td>400.000</td>
          </tr>
          <tr>
            <td>10</td>
            <td>GCN bồi dưỡng pháp luật về giao thông đường thuỷ nội địa</td>
            <td>200.000</td>
          </tr>
        </tbody>
      </table>

      {/* Ghi chú */}
      <div className={styles.notes}>
        <h4>Ghi chú:</h4>
        <ul>
          <li>Học phí trên chưa bao gồm phí, lệ phí sát hạch và phí, lệ phí cấp bằng, chứng chỉ.</li>
          <li>Mức học phí trên không áp dụng cho các chương trình liên kết đào tạo giữa Cơ sở đào tạo với các cơ quan, đơn vị, tổ chức.</li>
        </ul>
      </div>
    </div>
  )
}