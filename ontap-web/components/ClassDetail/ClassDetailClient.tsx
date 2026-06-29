import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher, FaInfoCircle, FaCog, FaChevronLeft } from 'react-icons/fa';
import { Course, UserProfile } from '../../types';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseClient';
import StudentsTab from './StudentsTab';
import TeachersTab from './TeachersTab';
import OverviewTab from './OverviewTab';

interface ClassDetailClientProps {
  course: Course;
  onBack: () => void;
  userProfile: UserProfile;
  studentLatestResults?: Record<string, any>;
  deviceCounts?: Record<string, number>;
  subjectStats?: any[];
  creatorProfiles?: Record<string, {name: string, role: string}>;
  canAssignMembers?: boolean;
  canFinishClass?: boolean;
  canDisableAccounts?: boolean;
  onFinishCourse?: (courseId: string) => Promise<void>;
  onReopenCourse?: (courseId: string) => Promise<void>;
}

type TabType = 'overview' | 'students' | 'teachers' | 'settings';

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'overview', label: 'Tổng quan', icon: FaInfoCircle },
  { id: 'students', label: 'Học viên', icon: FaUserGraduate },
  { id: 'teachers', label: 'Giáo viên', icon: FaChalkboardTeacher },
  { id: 'settings', label: 'Cài đặt', icon: FaCog },
];

const ClassDetailClient: React.FC<ClassDetailClientProps> = ({ 
  course, 
  onBack, 
  userProfile,
  studentLatestResults = {},
  deviceCounts = {},
  subjectStats = [],
  creatorProfiles = {},
  canAssignMembers = false,
  canFinishClass = false,
  canDisableAccounts = false,
  onFinishCourse,
  onReopenCourse
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [studentCount, setStudentCount] = useState(0);

  const handleFinish = () => {
    if (!onFinishCourse) return;
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: 'Kết thúc lớp học?',
        text: 'Hành động này sẽ vô hiệu hoá tài khoản của TẤT CẢ học viên thuộc lớp này. Họ sẽ không thể đăng nhập được nữa. Bạn có chắc chắn?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đồng ý, kết thúc',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          onFinishCourse(course.id);
        }
      });
    });
  };

  const handleReopen = () => {
    if (!onReopenCourse) return;
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: 'Mở lại lớp học?',
        text: 'Hành động này sẽ kích hoạt lại lớp học. Lưu ý: tài khoản các học viên cũ vẫn ở trạng thái vô hiệu hoá, bạn cần kích hoạt lại thủ công từng tài khoản nếu muốn.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Đồng ý, mở lại',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          onReopenCourse(course.id);
        }
      });
    });
  };

  React.useEffect(() => {
    if (!course.id) return;
    const q = query(collection(db, 'users'), where('courseId', '==', course.id), where('role', '==', 'hoc_vien'));
    getDocs(q).then(snap => setStudentCount(snap.size));
  }, [course.id]);

  return (
    <div className="w-full space-y-6">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center gap-4 mb-2 flex-wrap">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-gray-400 hover:text-teal-600 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-slate-800"
          >
            <FaChevronLeft />
          </button>
          <div className="text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black dark:text-white tracking-tight leading-none">{course.name}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  course.status === 'finished' 
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              }`}>
                  {course.status === 'finished' ? '🔴 Đã kết thúc' : '🟢 Đang hoạt động'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mt-1">Quản lý chi tiết lớp học</p>
          </div>
        </div>

        {/* Action Buttons for Finish / Reopen Class */}
        {canFinishClass && (
          <div className="flex gap-2">
            {course.status === 'finished' ? (
              <button
                onClick={handleReopen}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all text-sm flex items-center gap-1.5"
              >
                Mở lại lớp
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all text-sm flex items-center gap-1.5"
              >
                Kết thúc lớp
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-900/80 rounded-2xl w-fit border border-gray-200 dark:border-slate-800 shadow-inner overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300
                ${activeTab === tab.id 
                  ? 'text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-800 shadow-sm' 
                  : 'text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-200/50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <Icon />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-xl ring-2 ring-teal-500/20 dark:ring-teal-500/10 pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[500px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {activeTab === 'overview' && (
              <OverviewTab course={course} studentCount={studentCount} subjectStats={subjectStats} creatorProfiles={creatorProfiles} />
            )}

            {activeTab === 'students' && (
              <StudentsTab 
                course={course} 
                studentLatestResults={studentLatestResults}
                deviceCounts={deviceCounts}
                canAssignMembers={canAssignMembers}
                canDisableAccounts={canDisableAccounts}
                currentUserRole={userProfile?.role || ''}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersTab 
                course={course} 
                canAssignMembers={canAssignMembers}
              />
            )}

            {activeTab === 'settings' && (
              <div className="p-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 text-center space-y-6 shadow-sm">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <FaCog className="text-4xl" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">Cài đặt lớp học</h3>
                   <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                     Tùy chỉnh thông tin lớp, phân quyền truy cập và các thiết lập hệ thống khác.
                   </p>
                </div>
                <div className="pt-4 flex justify-center gap-2">
                   <div className="px-6 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest">COMING SOON</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassDetailClient;
