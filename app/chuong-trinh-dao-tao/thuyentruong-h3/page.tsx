import React from 'react'
import Link from 'next/link'
import styles from '../chuong-trinh.module.css' // (Dùng CSS Chung)

export default function ThuyenTruongH3Page() {
  // 💖 (DỮ LIỆU T3 - ĐÃ "SỬA" THEO ẢNH MỚI) 💖
  const data = {
    title: '2- GCNKNCM THUYỀN TRƯỞNG HẠNG BA',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MH 01", ten: "Pháp luật về giao thông đường thủy nội địa", thoi_gian: "25" },
      { ma: "MĐ 02", ten: "Thiết bị hàng hải", thoi_gian: "15" },
      { ma: "MĐ 03", ten: "Điều động phương tiện", thoi_gian: "70" },
      { ma: "MH 04", ten: "Kinh tế vận tải", thoi_gian: "30" },
      { ma: "MH 05", ten: "Luồng đường thủy nội địa", thoi_gian: "20" },
      { ma: "MĐ 06", ten: "Khí tượng thủy văn", thoi_gian: "15" },
      { ma: "MH 07", ten: "Nghiệp vụ thuyền trưởng", thoi_gian: "20" },
    ],
    module_total: "195",
    final_tests: [
      // (Ảnh mới KHÔNG có Bảng 2, em "phỏng đoán" 
      //  từ các hạng Thuyền trưởng khác)
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Lý thuyết chuyên môn", hinh_thuc: "Vấn đáp" },
      { stt: 3, noi_dung: "Điều động tàu", hinh_thuc: "Thực hành" },
    ]
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.subtitle}>{data.subtitle}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã MH, MĐ</th>
            <th>Tên môn học, mô đun</th>
            <th>Thời gian đào tạo (giờ)</th>
          </tr>
        </thead>
        <tbody>
          {data.modules.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.ma}</td>
              <td>{item.ten}</td>
              <td>{item.thoi_gian}</td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td colSpan={2}>Tổng cộng</td>
            <td>{data.module_total}</td>
          </tr>
        </tbody>
      </table>
      <h3 className={styles.sectionTitle}>THI KẾT THÚC KHOÁ HỌC</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Nội dung thi</th>
            <th>Hình thức thi</th>
          </tr>
        </thead>
        <tbody>
          {data.final_tests.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.stt}</td>
              <td>{item.noi_dung}</td>
              <td>{item.hinh_thuc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: '2rem', textAlign: 'center'}}>
        <Link href="/chuong-trinh-dao-tao" className={styles.backButton}>
          « Quay về trang Chọn
        </Link>
      </div>
    </div>
  )
}