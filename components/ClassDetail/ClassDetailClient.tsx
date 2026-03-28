'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher, FaInfoCircle, FaCog, FaChevronLeft } from 'react-icons/fa';
import { Course } from '@/types/classManagement';
import StudentsTab from './StudentsTab';
import TeachersTab from './TeachersTab';
import AddTeacherModal from './AddTeacherModal';
import AddStudentModal from './AddStudentModal';
import OverviewTab from './OverviewTab';

interface ClassDetailClientProps {
  classData: Course;
  onBack?: () => void;
  onEdit?: () => void;
}

type TabType = 'overview' | 'students' | 'teachers' | 'settings';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Tổng quan', icon: <FaInfoCircle /> },
  { id: 'students', label: 'Học viên', icon: <FaUserGraduate /> },
  { id: 'teachers', label: 'Giáo viên', icon: <FaChalkboardTeacher /> },
  { id: 'settings', label: 'Cài đặt', icon: <FaCog /> },
];

const ClassDetailClient: React.FC<ClassDetailClientProps> = ({ classData, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Header with Back Button */}
      {onBack && (
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-500/10 text-gray-400 hover:text-teal-600 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-slate-800"
          >
            <FaChevronLeft />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">{classData.name}</h1>
            <p className="text-sm text-gray-400 dark:text-slate-500 font-medium tracking-tight">Chi tiết lớp học & Quản lý</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-900/80 rounded-2xl w-fit border border-gray-200 dark:border-slate-800 shadow-inner">
        {tabs.map((tab) => (
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
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 rounded-xl ring-2 ring-teal-500/20 dark:ring-teal-500/10 pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[600px] relative">
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
              <OverviewTab classData={classData} />
            )}

            {activeTab === 'students' && (
              <StudentsTab 
                classData={classData} 
                onAddStudent={() => setShowAddStudent(true)}
              />
            )}

            {activeTab === 'teachers' && (
              <TeachersTab 
                classData={classData} 
                onAddTeacher={() => setShowAddTeacher(true)}
              />
            )}

            {activeTab === 'settings' && (
              <div className="p-12 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-600">
                  <FaCog className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">Cài đặt lớp học</h3>
                <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                  Tùy chỉnh thông tin lớp, phân quyền truy cập và các thiết lập hệ thống khác.
                </p>
                <div className="pt-4 flex justify-center gap-2">
                   <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs font-bold text-gray-400">COMING SOON</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Components */}
      <AddTeacherModal 
        isOpen={showAddTeacher} 
        onClose={() => setShowAddTeacher(false)} 
        classData={classData} 
      />
      <AddStudentModal 
        isOpen={showAddStudent} 
        onClose={() => setShowAddStudent(false)} 
        classData={classData} 
      />
    </div>
  );
};

export default ClassDetailClient;
