import React from 'react'
import styles from './page.module.css' // (Triệu hồi CSS)

// --- (CƠ SỞ DỮ LIỆU "TĨNH") ---
// (Em "code cứng" (hardcode) dữ liệu M1 (ảnh anh gửi) vào đây)
const CURRICULUM_DATA: Record<string, any> = {
  
  // (Dữ liệu cho Hạng M1)
  'maytruong-h1': {
    title: 'GCNKNCM MÁY TRƯỞNG HẠNG NHẤT',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MĐ 01", ten: "Điện tàu thủy", thoi_gian: "15" },
      { ma: "MĐ 02", ten: "Máy tàu thủy", thoi_gian: "90" },
      { ma: "MĐ 03", ten: "Công nghệ thông tin, tự động hoá trong điều khiển", thoi_gian: "30" },
      { ma: "MH 04", ten: "Kinh tế vận tải", thoi_gian: "45" },
      { ma: "MH 05", ten: "Nghiệp vụ máy trưởng", thoi_gian: "45" },
    ],
    module_total: "225",
    final_tests: [
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Lý thuyết chuyên môn", hinh_thuc: "Vấn đáp" },
      { stt: 3, noi_dung: "Vận hành, sửa chữa máy, điện", hinh_thuc: "Thực hành" },
    ]
  },
  
  // (Anh em mình sẽ thêm 'maytruong-h2', 'thuyentruong-h1'... vào đây sau)
  'maytruong-h2': {
    title: 'GCNKNCM MÁY TRƯỞNG HẠNG NHÌ',
    subtitle: 'DANH MỤC MÔN HỌC...',
    modules: [
        { ma: "MĐ 01", ten: "(Dữ liệu mẫu M2)", thoi_gian: "10" },
    ],
    module_total: "10",
    final_tests: [
        { stt: 1, noi_dung: "(Dữ liệu mẫu M2)", hinh_thuc: "Trắc nghiệm" },
    ]
  }
};
// --- (HẾT CSDL "TĨNH") ---


// (Đây là Server Component)
export default function CurriculumDetailPage({ params }: { params: { slug: string } }) {
  
  // 1. Lấy "slug" (ví dụ: 'maytruong-h1') từ URL
  const slug = params.slug;
  
  // 2. "Tra" CSDL "Tĩnh"
  const data = CURRICULUM_DATA[slug];

  // 3. Xử lý nếu "tra" không thấy (Lỗi 404)
  if (!data) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Lỗi 404</h1>
        <p className={styles.subtitle}>Không tìm thấy chương trình đào tạo cho hạng bằng này.</p>
      </div>
    )
  }

  // 4. "Vẽ" Giao diện (khi "tra" thấy)
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
          {/* Dòng Tổng cộng */}
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
      
    </div>
  )
}