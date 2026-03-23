export interface Course {
  id: string;
  name: string;
  description?: string;
  headTeacherId?: string;
  teacherIds?: string[];
  createdAt?: any;
  createdBy?: string;
  licenseId?: string;
  avatarUrl?: string; // TNDNB uses avatarUrl
  expiryDate?: any;
}

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  fullName?: string;
  role: 'admin' | 'giao_vien' | 'hoc_vien' | 'quan_ly' | 'lanh_dao';
  photoURL?: string;
  birthDate?: string;
  address?: string;
  class?: string;
  phoneNumber?: string;
  courseName?: string;
  courseId?: string;
  cccd?: string;
  cccdDate?: string;
  cccdPlace?: string;
  courseCode?: string;
  defaultLicenseId?: string;
  isVerified?: boolean;
  offlineAccess?: boolean; // Quyền đăng nhập offline
  updatedAt?: number; // Dấu thời gian cập nhật cuối cùng
  createdAt?: any;
}
