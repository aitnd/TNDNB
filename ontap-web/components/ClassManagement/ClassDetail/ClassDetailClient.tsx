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
  deviceCounts = {}
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [studentCount, setStudentCount] = useState(0);

  React.useEffect(() => {
    if (!course.id) return;
    const q = query(collection(db, 'users'), where('courseId', '==', course.id), where('role', '==', 'hoc_vien'));
    getDocs(q).then(snap => setStudentCount(snap.size));
  }, [course.id]);

  return (
    <div className="w-full space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-3 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-gray-400 hover:text-teal-600 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-slate-800"
        >
          <FaChevronLeft />
        </button>
        <div className="text-left">
          <h1 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">{course.name}</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Quản lý chi tiết lớp học</p>
        </div>
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
              <OverviewTab course={course} studentCount={studentCount} />
            )}

            {activeTab === 'students' && (
              <StudentsTab 
                course={course} 
                studentLatestResults={studentLatestResults}
                deviceCounts={deviceCounts}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersTab 
                course={course} 
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
