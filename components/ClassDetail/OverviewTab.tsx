'use client'
import Image from 'next/image';

import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, 
  FaUserTie, FaQrcode, FaChartPie, FaPercent, FaRegLightbulb 
} from 'react-icons/fa';
import { db } from '@/utils/firebaseClient';
import { collection, query, where, onSnapshot, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Course, UserProfile } from '@/types/classManagement';

interface OverviewTabProps {
  classData: Course;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ classData }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    unverifiedStudents: 0,
    activeDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for basic stats
    const q = query(collection(db, 'users'), where('courseId', '==', classData.id));
    const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
      const all = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => d.data() as UserProfile);
      setStats({
        totalStudents: all.length,
        verifiedStudents: all.filter(s => s.isVerified).length,
        unverifiedStudents: all.filter(s => !s.isVerified).length,
        activeDevices: 0 // Placeholder
      });
      setLoading(false);
    });
    return () => unsub();
  }, [classData.id]);

  const verifyPercent = stats.totalStudents > 0 
    ? Math.round((stats.verifiedStudents / stats.totalStudents) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaUsers />} 
          label="Tổng học viên" 
          value={stats.totalStudents} 
          color="teal" 
          subLabel="Tăng 4% tháng này"
        />
        <StatCard 
          icon={<FaCheckCircle />} 
          label="Đã xác minh" 
          value={stats.verifiedStudents} 
          color="emerald" 
          subLabel={`${verifyPercent}% hoàn thành`}
        />
        <StatCard 
          icon={<FaExclamationTriangle />} 
          label="Chưa xác minh" 
          value={stats.unverifiedStudents} 
          color="rose" 
          subLabel="Cần nhắc nhở"
        />
        <StatCard 
          icon={<FaCalendarAlt />} 
          label="Ngày hết hạn" 
          value={classData.expiryDate?.toDate ? classData.expiryDate.toDate().toLocaleDateString('vi-VN') : (classData.expiryDate instanceof Date ? classData.expiryDate.toLocaleDateString('vi-VN') : '---')} 
          color="indigo" 
          subLabel="Gói Standard"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Charts Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex justify-between items-start mb-10 relative">
                 <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                       <FaChartPie className="text-teal-600" /> Tỉ trọng xác minh
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">Theo dõi tiến độ chuẩn bị hồ sơ học viên</p>
                 </div>
                 <div className="text-right">
                    <span className="text-4xl font-black text-teal-600 block">{verifyPercent}%</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">Xu hướng tốt</span>
                 </div>
              </div>

              <div className="space-y-6 relative">
                 <div className="h-6 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${verifyPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-lg shadow-teal-500/20"
                    />
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Hoàn thành</p>
                       <p className="text-lg font-black text-gray-900 dark:text-white">{stats.verifiedStudents}</p>
                    </div>
                    <div className="space-y-1 border-x border-gray-100 dark:border-slate-800 px-4">
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Đang chờ</p>
                       <p className="text-lg font-black text-gray-900 dark:text-white">{stats.unverifiedStudents}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Tiêu chuẩn</p>
                       <p className="text-lg font-black text-gray-900 dark:text-white">85%</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/20">
                       <FaRegLightbulb />
                    </div>
                    <div>
                       <h4 className="font-black text-lg uppercase tracking-tight leading-none mb-1">Gợi ý quản lý</h4>
                       <p className="text-xs text-white/70 font-medium">Dành cho chủ nhiệm lớp & quản lý</p>
                    </div>
                 </div>
                 <p className="text-sm leading-relaxed text-indigo-50/90 font-medium italic">
                    &quot;Hiện tại lớp có {stats.unverifiedStudents} học viên chưa xác minh danh tính. 
                    Bạn nên thông báo yêu cầu bổ sung thông tin trước kỳ thi sắp tới để tránh gián đoạn truy cập.&quot;
                 </p>
                 <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                    Gửi thông báo ngay
                 </button>
              </div>
           </div>
        </div>

        {/* Sidebar Mini Section */}
        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <FaUserTie className="text-teal-500" /> Giáo viên phụ trách
              </h4>
              <div className="space-y-4">
                 {(classData.teacherIds || []).slice(0, 3).map((tid, idx) => (
                    <div key={tid} className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700">
                          <Image width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`https://ui-avatars.com/api/?name=Teacher&background=random`} alt="" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Chưa cập nhật tên</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase">Giảng viên {idx + 1}</p>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-3 bg-gray-50 dark:bg-slate-800/50 text-teal-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-50 transition-all border border-transparent hover:border-teal-100">
                    Xem tất cả
                 </button>
              </div>
           </div>

           <div className="bg-slate-900 dark:bg-black rounded-3xl p-6 text-white text-center space-y-4">
              <FaQrcode className="text-4xl mx-auto text-teal-400" />
              <h4 className="font-black text-sm uppercase tracking-tight">QR Truy cập lớp</h4>
              <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto shadow-inner border-4 border-slate-800">
                 <Image width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=class-${classData.id}`} alt="QR" className="w-full h-full" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium px-4">Quét để đăng nhập nhanh học viên (Nếu được quyền)</p>
           </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'teal' | 'emerald' | 'rose' | 'indigo';
    subLabel: string;
}

const StatCard = ({ icon, label, value, color, subLabel }: StatCardProps) => {
  const colors: Record<string, string> = {
    teal: 'bg-teal-500 text-teal-600',
    emerald: 'bg-emerald-500 text-emerald-600',
    rose: 'bg-rose-500 text-rose-600',
    indigo: 'bg-indigo-500 text-indigo-600'
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl ${colors[color].replace('text-', 'bg-opacity-10 ')} flex items-center justify-center text-xl mb-4`}>
        {React.cloneElement(icon as React.ReactElement, { className: colors[color] })}
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{label}</p>
      <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2 truncate">
        {value}
      </h4>
      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
         <FaPercent className="text-[8px]" /> {subLabel}
      </p>
    </div>
  );
};

export default OverviewTab;
