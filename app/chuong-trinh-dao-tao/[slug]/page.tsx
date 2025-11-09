import React from 'react'
import styles from './page.module.css' // (Triệu hồi CSS)

// --- (CƠ SỞ DỮ LIỆU "TĨNH") ---
const CURRICULUM_DATA: Record<string, any> = {
  
  // (Dữ liệu cho Hạng M1 - Đã có)
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
  
  // 💖 (DỮ LIỆU MỚI CHO M2) 💖
  'maytruong-h2': {
    title: '2- GCNKNCM MÁY TRƯỞNG HẠNG NHÌ',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MĐ 01", ten: "Điện tàu thủy", thoi_gian: "60" },
      { ma: "MĐ 02", ten: "Máy tàu thủy và hệ thống phục vụ", thoi_gian: "75" },
      { ma: "MH 03", ten: "Kinh tế vận tải", thoi_gian: "15" },
      { ma: "MĐ 04", ten: "Thực hành vận hành máy tàu thuỷ", thoi_gian: "45" },
      { ma: "MH 05", ten: "Nghiệp vụ máy trưởng", thoi_gian: "30" },
    ],
    module_total: "225",
    final_tests: [
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Lý thuyết chuyên môn", hinh_thuc: "Vấn đáp" },
      { stt: 3, noi_dung: "Vận hành, sửa chữa máy, điện", hinh_thuc: "Thực hành" },
    ]
  },
  
  // 💖 (DỮ LIỆU MỚI CHO M3) 💖
  'maytruong-h3': {
    title: '1- GCNKNCM MÁY TRƯỞNG HẠNG BA',
    subtitle: 'DANH MỤC MÔN HỌC, MÔ ĐUN VÀ THỜI GIAN ĐÀO TẠO',
    modules: [
      { ma: "MH 01", ten: "Vẽ kỹ thuật", thoi_gian: "25" },
      { ma: "MĐ 02", ten: "Điện tàu thủy", thoi_gian: "45" },
      { ma: "MĐ 03", ten: "Máy tàu thủy và bảo dưỡng, sửa chữa máy tàu thủy", thoi_gian: "90" },
      { ma: "MH 04", ten: "Kinh tế vận tải", thoi_gian: "15" },
      { ma: "MĐ 05", ten: "Thực hành vận hành máy tàu thủy", thoi_gian: "90" },
      { ma: "MH 06", ten: "Nghiệp vụ máy trưởng", thoi_gian: "15" },
    ],
    module_total: "280",
    final_tests: [
      { stt: 1, noi_dung: "Lý thuyết tổng hợp", hinh_thuc: "Trắc nghiệm" },
      { stt: 2, noi_dung: "Lý thuyết chuyên môn", hinh_thuc: "Vấn đáp" },
      { stt: 3, noi_dung: "Vận hành, sửa chữa máy, điện", hinh_thuc: "Thực hành" },
    ]
  }
  
  // (Anh em mình sẽ thêm các hạng T1, T2, T3... vào đây sau)
};
// --- (HẾT CSDL "TĨNH") ---


// (Đây là Server Component)
export default async function CurriculumDetailPage({ params }: { params: { slug: string } }) {
  
  const slug = params.slug;
  const data = CURRICULUM_DATA[slug];

  // (Xử lý nếu "tra" không thấy (Lỗi 404) - Giữ nguyên)
  if (!data) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Lỗi 404</h1>
        <p className={styles.subtitle}>Không tìm thấy chương trình đào tạo cho hạng bằng này.</p>
      </div>
    )
  }

  // ( "Vẽ" Giao diện - Giữ nguyên)
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