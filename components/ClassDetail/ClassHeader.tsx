'use client';

import React from 'react';
import { FaSchool, FaArrowLeft, FaBell, FaInfoCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/classManagement';

interface ClassHeaderProps {
  classData: Course;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({ classData }) => {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 transition-all duration-300">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative px-6 py-8 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar Area */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 ring-4 ring-white dark:ring-slate-800 transition-transform hover:scale-105 duration-300 px-4">
              {classData.avatarUrl ? (
                <img src={classData.avatarUrl} alt={classData.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <FaSchool className="text-4xl sm:text-5xl" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-slate-800 rounded-full shadow-sm" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400">
              <button 
                onClick={() => router.back()}
                className="hover:underline flex items-center gap-1 group"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                Danh sách lớp học
              </button>
              <span>•</span>
              <span className="text-gray-400 dark:text-slate-500 uppercase tracking-wider text-xs font-bold">Lớp học</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {classData.name}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-lg line-clamp-2 italic font-medium">
              {classData.description || 'Chưa có mô tả chi tiết cho lớp học này.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 group relative">
            <FaBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </button>
          
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all duration-300 flex items-center gap-2 active:scale-95">
            <FaInfoCircle />
            <span>Thông tin chi tiết</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 px-6 py-3 sm:px-8 flex items-center gap-6 overflow-x-auto text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-slate-500">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          Mã lớp: <span className="text-gray-700 dark:text-slate-300 uppercase">{classData.id.slice(0, 8)}...</span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Sĩ số: <span className="text-gray-700 dark:text-slate-300">Đang cập nhật</span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Khóa: <span className="text-gray-700 dark:text-slate-300">2024 - 2025</span>
        </div>
      </div>
    </div>
  );
};

export default ClassHeader;
