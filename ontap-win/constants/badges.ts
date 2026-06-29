export type BadgeLevel = 'dong' | 'bac' | 'vang' | 'kim_cuong' | 'role';
export type BadgeGroup = 'on_tap' | 'thi_thu' | 'role';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  level: BadgeLevel;
  group: BadgeGroup;
  fallbackIcon: string;
  lottieUrl?: string; // URL to Lottie JSON if available
  targetValue?: number; // Target progress value (e.g. 50 questions)
  color: string; // Tailwind color classes for glow/border
  roleId?: string; // Specific role required to unlock (for role badges)
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- NHÓM 1: ÔN TẬP & HỌC TẬP ---
  {
    id: 'tan_binh_tren_bo',
    name: 'Tân Binh Trên Bờ',
    description: 'Hoàn thành bài ôn tập đầu tiên',
    level: 'dong',
    group: 'on_tap',
    fallbackIcon: '🚢',
    targetValue: 1,
    color: 'from-orange-400 to-amber-600',
  },
  {
    id: 'thuy_thu_cham_chi',
    name: 'Thủy Thủ Chăm Chỉ',
    description: 'Hoàn thành 50 câu ôn tập',
    level: 'bac',
    group: 'on_tap',
    fallbackIcon: '📖',
    targetValue: 50,
    color: 'from-slate-300 to-gray-400',
  },
  {
    id: 'hoa_tieu_kien_thuc',
    name: 'Hoa Tiêu Kiến Thức',
    description: 'Hoàn thành 200 câu ôn tập',
    level: 'vang',
    group: 'on_tap',
    fallbackIcon: '🧭',
    targetValue: 200,
    color: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'bach_khoa_hang_hai',
    name: 'Bách Khoa Hàng Hải',
    description: 'Hoàn thành ôn tập ở tất cả các môn',
    level: 'kim_cuong',
    group: 'on_tap',
    fallbackIcon: '📚',
    color: 'from-cyan-300 to-blue-500',
  },
  {
    id: 'nguoi_khong_ngai_sai',
    name: 'Người Không Ngại Sai',
    description: 'Làm lại 10 câu đã từng sai và trả lời đúng',
    level: 'bac',
    group: 'on_tap',
    fallbackIcon: '💪',
    targetValue: 10,
    color: 'from-slate-300 to-gray-400',
  },
  {
    id: 'bac_thay_on_luyen',
    name: 'Bậc Thầy Ôn Luyện',
    description: 'Hoàn thành 1000 câu ôn tập (tích lũy)',
    level: 'kim_cuong',
    group: 'on_tap',
    fallbackIcon: '🎯',
    targetValue: 1000,
    color: 'from-cyan-300 to-blue-500',
  },

  // --- NHÓM 2: THI THỬ & THÀNH TÍCH ---
  {
    id: 'lan_dau_ra_khoi',
    name: 'Lần Đầu Ra Khơi',
    description: 'Hoàn thành bài thi thử đầu tiên',
    level: 'dong',
    group: 'thi_thu',
    fallbackIcon: '⛵',
    targetValue: 1,
    color: 'from-orange-400 to-amber-600',
  },
  {
    id: 'vuot_song_thanh_cong',
    name: 'Vượt Sóng Thành Công',
    description: 'Đạt điểm ≥ 70% trong 1 bài thi thử',
    level: 'bac',
    group: 'thi_thu',
    fallbackIcon: '🌊',
    color: 'from-slate-300 to-gray-400',
  },
  {
    id: 'thuyen_truong_xuat_sac',
    name: 'Thuyền Trưởng Xuất Sắc',
    description: 'Đạt điểm ≥ 90% trong 1 bài thi thử',
    level: 'vang',
    group: 'thi_thu',
    fallbackIcon: '⭐',
    color: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'diem_tuyet_doi',
    name: 'Điểm Tuyệt Đối',
    description: 'Đạt 100% điểm trong 1 bài thi thử',
    level: 'kim_cuong',
    group: 'thi_thu',
    fallbackIcon: '💯',
    color: 'from-cyan-300 to-blue-500',
  },
  {
    id: 'chinh_phuc_bien_ca',
    name: 'Chinh Phục Biển Cả',
    description: 'Hoàn thành 10 bài thi thử (bất kể điểm)',
    level: 'vang',
    group: 'thi_thu',
    fallbackIcon: '🏴‍☠️',
    targetValue: 10,
    color: 'from-yellow-300 to-amber-500',
  },

  // --- NHÓM 6: ROLE BADGES ---
  {
    id: 'role_admin',
    name: 'Quản Trị Viên',
    description: 'Huy hiệu đặc quyền dành cho Admin',
    level: 'role',
    group: 'role',
    fallbackIcon: '👑',
    color: 'from-yellow-400 to-red-500',
    roleId: 'admin',
  },
  {
    id: 'role_super_admin',
    name: 'Quản Trị Tối Cao',
    description: 'Huy hiệu đặc quyền dành cho Super Admin',
    level: 'role',
    group: 'role',
    fallbackIcon: '👑',
    color: 'from-yellow-400 to-red-500',
    roleId: 'super_admin',
  },
  {
    id: 'role_lanh_dao',
    name: 'Lãnh Đạo',
    description: 'Huy hiệu đặc quyền dành cho Lãnh Đạo',
    level: 'role',
    group: 'role',
    fallbackIcon: '🦅',
    color: 'from-amber-400 to-orange-600',
    roleId: 'lanh_dao',
  },
  {
    id: 'role_quan_ly',
    name: 'Quản Lý',
    description: 'Huy hiệu đặc quyền dành cho Quản Lý',
    level: 'role',
    group: 'role',
    fallbackIcon: '🛡️',
    color: 'from-slate-300 to-blue-500',
    roleId: 'quan_ly',
  },
  {
    id: 'role_giao_vien',
    name: 'Giáo Viên',
    description: 'Huy hiệu đặc quyền dành cho Giáo Viên',
    level: 'role',
    group: 'role',
    fallbackIcon: '👨‍🏫',
    color: 'from-teal-300 to-emerald-500',
    roleId: 'giao_vien',
  },
];
