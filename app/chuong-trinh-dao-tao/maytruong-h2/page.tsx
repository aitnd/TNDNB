import React from 'react'
import Link from 'next/link'
import styles from '../chuong-trinh.module.css' // (Dùng CSS Chung)

export default function MayTruongH2Page() {
  // 💖 (DỮ LIỆU M2 - ĐÃ "SỬA" THEO ẢNH MỚI) 💖
  const data = {
    title: '2- GCNKNCM MÁY TRƯỞNG HẠNG NHÌ',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MĐ 01", ten: "Điện tàu thủy", thoi_gian: "55" },
      { ma: "MĐ 02", ten: "Máy tàu thủy", thoi_gian: "75" },
      { ma: "MH 03", ten: "Kinh tế vận tải", thoi_gian: "15" },
      { ma: "MĐ 04", ten: "Thực hành vận hành máy tàu", thoi_gian: "45" },
      { ma: "MH 05", ten: "Nghiệp vụ máy trưởng", thoi_gian: "10" },
    ],
    module_total: "200",
    final_tests: [
      // (Bảng 2 không có trong ảnh mới, em giữ lại
      //  dữ liệu "phỏng đoán" cũ, anh sửa lại nếu sai)
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Lý thuyết chuyên môn", hinh_thuc: "Vấn đáp" },
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