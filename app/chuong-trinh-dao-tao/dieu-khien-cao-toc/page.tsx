import React from 'react'
import Link from 'next/link'
import styles from '../chuong-trinh.module.css' // (Dùng CSS Chung)

export default function DieuKhienCaoTocPage() {
  // 💖 (DỮ LIỆU MỚI CHO "ĐIỀU KHIỂN CAO TỐC" - TỪ ẢNH) 💖
  const data = {
    title: 'CHỨNG CHỈ ĐIỀU KHIỂN PHƯƠNG TIỆN CAO TỐC',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MĐ 01", ten: "Cấu trúc và thiết bị phương tiện cao tốc", thoi_gian: "30" },
      { ma: "MĐ 02", ten: "Điều động phương tiện cao tốc", thoi_gian: "32" },
    ],
    module_total: "62",
    final_tests: [
      // (Bảng 2 không có trong ảnh, em "phỏng đoán")
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Thực hành Điều động phương tiện", hinh_thuc: "Thực hành" },
    ]
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.subtitle}>{data.subtitle}</p>
      
      {/* (Phần thông tin bổ sung) */}
      <div className={styles.content} style={{paddingBottom: '1rem'}}>
        <p>1. Số lượng mô đun đào tạo: 02</p>
        <p>2. Thời gian của khóa học: 65 giờ, bao gồm:</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Thời gian học lý thuyết, thực hành: 59 giờ</li>
          <li>Thời gian kiểm tra đánh giá kết thúc mô đun: 03 giờ</li>
          <li>Thời gian ôn, kiểm tra kết thúc khóa học: 03 giờ.</li>
        </ul>
      </div>

      {/* Bảng 1: Môn học */}
      <h3 className={styles.sectionTitle} style={{marginTop: '1rem'}}>III. THỜI GIAN VÀ PHÂN BỔ THỜI GIAN CỦA KHÓA HỌC:</h3>
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

      {/* Bảng 2: Thi kết thúc */}
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

      {/* Nút Quay về */}
      <div style={{marginTop: '2rem', textAlign: 'center'}}>
        <Link href="/chuong-trinh-dao-tao" className={styles.backButton}>
          « Quay về trang Chọn
        </Link>
      </div>
    </div>
  )
}