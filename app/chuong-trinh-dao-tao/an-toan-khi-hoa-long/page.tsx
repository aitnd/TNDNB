import React from 'react'
import Link from 'next/link'
import styles from '../chuong-trinh.module.css' // (Dùng CSS Chung)

export default function AnToanKhiHoaLongPage() {
  // 💖 (DỮ LIỆU MỚI CHO "AN TOÀN KHÍ HÓA LỎNG" - TỪ ẢNH) 💖
  const data = {
    title: '7- CHỨNG CHỈ AN TOÀN LÀM VIỆC TRÊN PHƯƠNG TIỆN CHỞ KHÍ HÓA LỎNG',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MH 01", ten: "Giới thiệu về khí hoá lỏng", thoi_gian: "10" },
      { ma: "MĐ 02", ten: "An toàn làm việc trên phương tiện chở khí hoá lỏng", thoi_gian: "15" },
      { ma: "MH 03", ten: "Vận hành hệ thống làm hàng trên phương tiện chở khí hoá lỏng", thoi_gian: "15" },
    ],
    module_total: "40",
    final_tests: [
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Vận hành hệ thống làm hàng trên phương tiện", hinh_thuc: "Thực hành" },
    ]
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.subtitle}>{data.subtitle}</p>

      {/* Bảng 1: Môn học */}
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
      <h3 className={styles.sectionTitle}>KIỂM TRA KẾT THÚC KHÓA HỌC</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Môn kiểm tra</th>
            <th>Hình thức kiểm tra</th>
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