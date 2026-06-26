'use client'
import Image from 'next/image';

import React, { useState, useEffect, useMemo } from 'react';
import {    FaUsers, FaThLarge, FaList, FaSearch, FaUserPlus,    FaFileExcel, FaPlus, FaSortAmountDown, FaSortAmountUp,   FaCheckCircle, FaLaptop, FaPaperPlane, FaEdit, FaHistory,   FaTrash, FaChevronLeft, FaChevronRight} from 'react-icons/fa'; 





import { db } from '@/utils/firebaseClient';
import {    collection, query, where, onSnapshot, updateDoc, deleteDoc, getDoc, QuerySnapshot, DocumentData, QueryDocumentSnapshot  } from 'firebase/firestore'; 



import { motion, AnimatePresence } from 'framer-motion';
import { Course, UserProfile } from '@/types/classManagement';
import * as XLSX from '@sheetjs/xlsx';
import CreateStudentModal from './CreateStudentModal';

interface StudentStats {
  resultCount: number;
  deviceCount: number;
  avgScore: number;
}


interface StudentsTabProps {
  classData: Course;
  onAddStudent?: () => void;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ classData, onAddStudent }) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortKey, setSortKey] = useState<'fullName' | 'createdAt'>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Stats
  const [statsMap, setStatsMap] = useState<Record<string, StudentStats>>({});


  // Real-time Fetch
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'users'),
      where('courseId', '==', classData.id),
      where('role', '==', 'hoc_vien')
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const list = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setStudents(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classData.id]);

  // Fetch Stats (Results & Devices)
  useEffect(() => {
    if (students.length === 0) return;

    const studentIds = students.map(s => s.id);
    
    // Listen for login sessions (devices)
    const qDevices = query(
      collection(db, 'login_sessions'),
      where('userId', 'in', studentIds.slice(0, 30)), // Firestore 'in' limit
      where('status', '==', 'active')
    );

    // Listen for exam results
    const qResults = query(
      collection(db, 'exam_results'),
      where('studentId', 'in', studentIds.slice(0, 30))
    );

    const unsubDevices = onSnapshot(qDevices, (snapshot: QuerySnapshot<DocumentData>) => {
      const deviceCounts: Record<string, number> = {};
      snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        deviceCounts[data.userId] = (deviceCounts[data.userId] || 0) + 1;
      });
      
      setStatsMap(prev => {
        const newMap = { ...prev };
        studentIds.forEach(id => {
          if (!newMap[id]) newMap[id] = { resultCount: 0, deviceCount: 0, avgScore: 0 };
          newMap[id].deviceCount = deviceCounts[id] || 0;
        });
        return newMap;
      });
    });

    const unsubResults = onSnapshot(qResults, (snapshot: QuerySnapshot<DocumentData>) => {
      const resultData: Record<string, { count: number, totalScore: number }> = {};
      snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        if (!resultData[data.studentId]) resultData[data.studentId] = { count: 0, totalScore: 0 };
        resultData[data.studentId].count++;
        resultData[data.studentId].totalScore += data.score || 0;
      });

      setStatsMap(prev => {
        const newMap = { ...prev };
        studentIds.forEach(id => {
          if (!newMap[id]) newMap[id] = { resultCount: 0, deviceCount: 0, avgScore: 0 };
          const data = resultData[id];
          newMap[id].resultCount = data?.count || 0;
          newMap[id].avgScore = data?.count ? Math.round(data.totalScore / data.count) : 0;
        });
        return newMap;
      });
    });

    return () => {
      unsubDevices();
      unsubResults();
    };
  }, [students]);


  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(st => 
        (st.fullName || st.full_name || '').toLowerCase().includes(s) || 
        (st.email || '').toLowerCase().includes(s) ||
        (st.phoneNumber || '').includes(s)
      );
    }

    // Filter
    if (filterRole === 'verified') result = result.filter(st => st.isVerified);
    if (filterRole === 'unverified') result = result.filter(st => !st.isVerified);

    // Sort
    result.sort((a, b) => {
      const valA = (a[sortKey as keyof UserProfile] as string || '').toLowerCase();
      const valB = (b[sortKey as keyof UserProfile] as string || '').toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, filterRole, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getAvatar = (st: UserProfile) => {
    const name = st.fullName || st.full_name || 'Học viên';
    return st.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStudents.map((st, index) => ({
        'STT': index + 1,
        'Họ và Tên': st.fullName || st.full_name || '---',
        'Email': st.email || '---',
        'Số điện thoại': st.phoneNumber || '---',
        'Trạng thái': st.isVerified ? 'Đã xác minh' : 'Chưa xác minh',
        'Ngày tham gia': st.createdAt?.toDate ? st.createdAt.toDate().toLocaleDateString('vi-VN') : (st.createdAt instanceof Date ? st.createdAt.toLocaleDateString('vi-VN') : '---')
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách học viên");
      XLSX.writeFile(wb, `Danh_sach_lop_${classData.name}_${new Date().getTime()}.xlsx`);
    } catch (e) {
      console.error("Export error:", e);
      alert("Lỗi khi xuất file Excel");
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm học viên..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-medium"
            />
          </div>
          
          <div className="flex bg-gray-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-gray-400'}`}
            >
              <FaThLarge />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-gray-400'}`}
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-xs font-extrabold uppercase tracking-tight hover:bg-emerald-100 transition-colors"
          >
            <FaFileExcel />
            <span>Excel</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-xl text-xs font-extrabold uppercase tracking-tight hover:bg-indigo-100 transition-colors"
          >
            <FaUserPlus />
            <span>Thêm mới</span>
          </button>

          <button 
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-tight hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
          >
            <FaPlus />
            <span>Chọn từ danh sách</span>
          </button>
        </div>
      </div>

      {/* Content Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 animate-pulse space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
             <FaUsers className="text-3xl" />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Không tìm thấy học viên nào phù hợp.</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-teal-600 text-sm font-bold hover:underline">Xóa tìm kiếm</button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {paginatedStudents.map((st) => (
              <motion.div
                key={st.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="relative">
                    <Image width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      src={getAvatar(st)} 
                      alt="" 
                      className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-slate-800 group-hover:ring-teal-500/20 transition-all"
                    />
                    {st.isVerified && (
                      <div className="absolute -top-1 -right-1 bg-teal-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                        <FaCheckCircle className="text-[10px]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors" title="Nhắn tin">
                      <FaPaperPlane className="text-sm" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors" title="Chỉnh sửa">
                      <FaEdit className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate">
                    {st.fullName || st.full_name}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-slate-500 truncate font-medium">
                    {st.email || 'Chưa cập nhật email'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50 dark:border-slate-800">
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Kết quả</p>
                    <p className="text-sm font-black text-teal-600">
                      {statsMap[st.id]?.resultCount || 0} bài
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Thiết bị</p>
                    <p className="text-sm font-black text-indigo-600 flex items-center justify-center gap-1">
                      <FaLaptop size={10} /> {statsMap[st.id]?.deviceCount || 0}
                    </p>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Học viên</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hidden sm:table-cell">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center">Bài làm</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center">Thiết bị</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {paginatedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image width={100} height={100} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={getAvatar(st)} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{st.fullName || st.full_name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${st.isVerified ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                      {st.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-teal-600">{statsMap[st.id]?.resultCount || 0}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Bài làm</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                        <FaLaptop size={12} /> {statsMap[st.id]?.deviceCount || 0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Thiết bị</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-teal-600 rounded-lg"><FaPaperPlane size={14} /></button>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg"><FaEdit size={14} /></button>
                      <button className="p-2 text-gray-400 hover:text-rose-600 rounded-lg"><FaTrash size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-white dark:bg-slate-900 text-gray-400 border border-gray-100 dark:border-slate-800 hover:bg-gray-50'}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}

      {/* Create Student Modal */}
      <CreateStudentModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        course={classData}
        onSuccess={() => {
          // No need to manual refresh as we have onSnapshot listener
        }}
      />
    </div>

  );
};

export default StudentsTab;
