import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaIdCard, FaInfoCircle, FaClock, FaUserTie } from 'react-icons/fa';
import { Course } from '../../types';

interface OverviewTabProps {
  course: Course;
  studentCount?: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ course, studentCount = 0 }) => {
  const formatDate = (date: any) => {
    if (!date) return 'Chưa xác định';
    if (date.toDate) return date.toDate().toLocaleDateString('vi-VN');
    if (date instanceof Date) return date.toLocaleDateString('vi-VN');
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getExpiryStatus = (expiryDate: any) => {
    if (!expiryDate) return { label: 'Không thời hạn', color: 'text-gray-500 bg-gray-100' };
    const now = new Date();
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { label: 'Đã hết hạn', color: 'text-rose-600 bg-rose-50' };
    if (days <= 7) return { label: `Sắp hết hạn (${days} ngày)`, color: 'text-amber-600 bg-amber-50' };
    return { label: `Còn hạn (${days} ngày)`, color: 'text-emerald-600 bg-emerald-50' };
  };

  const expiryStatus = getExpiryStatus(course.expiryDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cột trái: Thông tin chính */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
            <FaInfoCircle className="text-teal-500" /> Thông tin cơ bản
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800/50">
              <span className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <FaIdCard className="text-xs" /> Mã lớp / License
              </span>
              <span className="font-bold dark:text-white">{course.licenseId || 'Mặc định'}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800/50">
              <span className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <FaCalendarAlt className="text-xs" /> Ngày tạo
              </span>
              <span className="font-medium dark:text-white">{formatDate(course.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-gray-500 dark:text-slate-400 text-sm flex items-center gap-2">
                <FaClock className="text-xs" /> Thời hạn lớp
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${expiryStatus.color}`}>
                {expiryStatus.label}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-teal-500/20">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <FaUserTie /> Giáo viên chủ nhiệm
          </h3>
          <p className="text-teal-50 opacity-90 text-sm mb-4">
            Người chịu trách nhiệm chính quản lý học viên và nội dung đào tạo của lớp.
          </p>
          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
              GV
            </div>
            <div>
              <div className="font-bold">Chủ nhiệm lớp</div>
              <div className="text-xs opacity-70">Giáo viên phụ trách chính</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cột phải: Mô tả & Trạng thái */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm h-full">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Mô tả lớp học</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed italic">
              {course.description || 'Không có mô tả cho lớp học này.'}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800/50">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Thống kê nhanh</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                  {course.teacherIds?.length || 0}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Giáo viên</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div className="text-2xl font-black text-rose-500">
                  {studentCount}
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase">Học viên</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;
