import React from 'react'
import Link from 'next/link'
import styles from '../chuong-trinh.module.css' // (Dùng CSS Chung)

export default function ThuyThuPage() {
  // 💖 (DỮ LIỆU MỚI CHO "THỦY THỦ" - TỪ ẢNH) 💖
  const data = {
    title: 'CHỨNG CHỈ THỦY THỦ',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MĐ 01", ten: "An toàn cơ bản, đạo đức nghề nghiệp và bảo vệ môi trường", thoi_gian: "50" },
      { ma: "MH 02", ten: "Pháp luật về giao thông đường thủy nội địa", thoi_gian: "30" },
      { ma: "MH 03", ten: "Luồng đường thủy nội địa", thoi_gian: "15" },
      { ma: "MĐ 04", ten: "Điều động phương tiện", thoi_gian: "40" },
      { ma: "MĐ 05", ten: "Thủy nghiệp cơ bản", thoi_gian: "65" },
      { ma: "MH 06", ten: "Vận tải hàng hóa và hành khách", thoi_gian: "15" },
      { ma: "MĐ 07", ten: "Bảo dưỡng phương tiện", thoi_gian: "15" },
    ],
    module_total: "230",
    final_tests: [
      // (Bảng 2 không có trong ảnh, em "phỏng đoán")
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Thực hành thủy nghiệp", hinh_thuc: "Thực hành" },
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