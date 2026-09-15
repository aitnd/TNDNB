import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {    collection, query, where, onSnapshot,    doc, updateDoc} from 'firebase/firestore'; 



import { db, auth } from '../../services/firebaseClient';
import {    FaUsers, FaThLarge, FaList, FaSearch, FaUserPlus,    FaFileExcel, FaFileImport, FaPlus, FaCheckCircle, FaLaptop,    FaPaperPlane, FaEdit, FaHistory, FaTrash,    FaChevronLeft, FaChevronRight, FaUserClock, FaKey, FaWifi,   FaSortUp, FaSortDown, FaSort, FaBan } from 'react-icons/fa'; 







import { TbPlaneOff } from 'react-icons/tb';
import { Course, UserProfile } from '../../types';
import * as XLSX from '@sheetjs/xlsx';
import Swal from 'sweetalert2';
import CreateStudentModal from '../CreateStudentModal';
import ImportStudentModal from '../ImportStudentModal';
import { EditStudentModal, HistoryModal, SessionModal, AddStudentModal } from './Modals';
import { getExamHistory } from '../../services/historyService';
import { AdminBadgeManager } from '../Badges/AdminBadgeManager';

interface StudentsTabProps {
  course: Course;
  studentLatestResults?: Record<string, any>;
  deviceCounts?: Record<string, number>;
  canAssignMembers?: boolean;
  canDisableAccounts?: boolean;
  currentUserRole?: string;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ 
  course, 
  studentLatestResults = {},
  deviceCounts = {},
  canAssignMembers = false,
  canDisableAccounts = false,
  currentUserRole = ''
}) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  type SortColumn = 'name' | 'type' | 'time' | 'score';
  type SortDirection = 'asc' | 'desc';
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = useCallback((column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  }, [sortColumn]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBadgeManager, setShowBadgeManager] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  // Real-time Fetch Students in Class
  useEffect(() => {
    if (!course.id) return;
    setLoading(true);
    const q = query(
      collection(db, 'users'),
      where('courseId', '==', course.id),
      where('role', '==', 'hoc_vien')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
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
  }, [course.id]);

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    let result = [...students];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(st => 
        (st.fullName || st.full_name || '').toLowerCase().includes(s) || 
        (st.email || '').toLowerCase().includes(s) ||
        (st.phoneNumber || '').includes(s)
      );
    }

    // Sắp xếp toàn bộ danh sách
    if (sortColumn) {
      result.sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (sortColumn) {
          case 'name':
            valA = (a.fullName || a.full_name || '').toLowerCase();
            valB = (b.fullName || b.full_name || '').toLowerCase();
            break;
          case 'type':
            valA = (studentLatestResults[a.id]?.type || '').toLowerCase();
            valB = (studentLatestResults[b.id]?.type || '').toLowerCase();
            break;
          case 'time':
            valA = studentLatestResults[a.id]?.time || '';
            valB = studentLatestResults[b.id]?.time || '';
            break;
          case 'score': {
            // Parse score dạng "26/30 câu" thành số
            const parseScore = (s: string) => {
              if (!s || s === '--') return -1;
              const match = s.match(/(\d+)\s*\/\s*(\d+)/);
              if (match) return parseInt(match[1]) / parseInt(match[2]);
              const num = parseFloat(s);
              return isNaN(num) ? -1 : num;
            };
            valA = parseScore(studentLatestResults[a.id]?.score || '');
            valB = parseScore(studentLatestResults[b.id]?.score || '');
            break;
          }
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [students, searchTerm, sortColumn, sortDirection, studentLatestResults]);

  // Component hiển thị icon sắp xếp
  const SortIcon: React.FC<{ column: SortColumn }> = ({ column }) => {
    if (sortColumn !== column) return <FaSort className="inline ml-1 opacity-30" size={10} />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="inline ml-1 text-teal-400" size={10} />
      : <FaSortDown className="inline ml-1 text-teal-400" size={10} />;
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getAvatar = (st: UserProfile) => {
    return st.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(st.fullName || st.full_name || 'Học viên')}&background=random&color=fff`;
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = filteredStudents.map((st, index) => ({
        'STT': index + 1,
        'Họ và Tên': st.fullName || st.full_name || '---',
        'Email': st.email || '---',
        'Số điện thoại': st.phoneNumber || '---',
        'Điểm bài mới nhất': studentLatestResults[st.id]?.score || 0,
        'Số thiết bị': deviceCounts[st.id] || 0
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách học viên");
      XLSX.writeFile(wb, `Danh_sach_lop_${course.name}_${new Date().getTime()}.xlsx`);
    } catch (e) {
      console.error("Export error:", e);
      Swal.fire('Lỗi', 'Không thể xuất file Excel', 'error');
    }
  };

  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    const result = await Swal.fire({
      title: 'Xác nhận gỡ?',
      text: `Gỡ học viên ${studentName} khỏi lớp này? (Tài khoản không bị xóa)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Gỡ ngay',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, 'users', studentId), {
          courseId: null,
          courseName: null
        });
        Swal.fire('Thành công', 'Đã gỡ học viên khỏi lớp.', 'success');
      } catch (e) {
        Swal.fire('Lỗi', 'Không thể gỡ học viên.', 'error');
      }
    }
  };


  const handleResetPassword = async (targetUserId: string, targetUserName: string) => {
    const newPassword = prompt(`Nhập mật khẩu mới cho ${targetUserName}:`, '123456');
    if (newPassword === null) return;
    if (!newPassword || newPassword.length < 6) {
      Swal.fire('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.', 'error');
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        Swal.fire('Lỗi', 'Không tìm thấy token admin.', 'error');
        return;
      }

      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Thành công', `Đã đổi mật khẩu cho ${targetUserName} thành công!`, 'success');
      } else {
        Swal.fire('Lỗi', data.error || 'Không xác định', 'error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Swal.fire('Lỗi', 'Lỗi kết nối đến server.', 'error');
    }
  };

  const toggleOfflineAccess = async (studentId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', studentId), { offlineAccess: !currentStatus });
      Swal.fire('Thành công', `Đã ${!currentStatus ? 'bật' : 'tắt'} quyền truy cập Offline.`, 'success');
    } catch (e) {
      console.error(e);
      Swal.fire('Lỗi', 'Không thể cập nhật quyền offline.', 'error');
    }
  };

  const handleEditStudent = (student: UserProfile) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleSaveStudent = async (id: string, data: any) => {
    try {
      await updateDoc(doc(db, 'users', id), data);
      Swal.fire('Thành công', 'Đã cập nhật thông tin học viên', 'success');
      setShowEditModal(false);
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể cập nhật', 'error');
    }
  };

  const handleViewHistory = async (student: UserProfile) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    try {
      const history = await getExamHistory(student.id);
      setStudentHistory(history);
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể tải lịch sử thi', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleViewSessions = async (student: UserProfile) => {
    setSelectedStudent(student);
    setShowSessionModal(true);
    setLoadingSessions(true);
    try {
      const { getDocs, limit, orderBy } = await import('firebase/firestore');
      const q = query(collection(db, 'sessions'), where('uid', '==', student.id), orderBy('startTime', 'desc'), limit(20));
      const snap = await getDocs(q);
      setStudentSessions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể tải lịch sử truy cập', 'error');
    } finally {
      setLoadingSessions(false);
    }
  };



  const handleDisableStudent = async (studentId: string, studentName: string) => {
    const result = await Swal.fire({
      title: 'Vô hiệu hóa tài khoản?',
      text: `Vô hiệu hóa tài khoản của học viên ${studentName}? Họ sẽ bị đăng xuất và không thể đăng nhập lại.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Vô hiệu hóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, 'users', studentId), {
          status: 'disabled',
          updatedAt: Date.now()
        });
        Swal.fire('Thành công', 'Tài khoản đã bị vô hiệu hóa.', 'success');
      } catch (e) {
        Swal.fire('Lỗi', 'Không thể vô hiệu hóa tài khoản.', 'error');
      }
    }
  };

  const handleActivateStudent = async (studentId: string, studentName: string) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        status: 'active',
        updatedAt: Date.now()
      });
      Swal.fire('Thành công', `Đã kích hoạt lại tài khoản của ${studentName}.`, 'success');
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể kích hoạt lại tài khoản.', 'error');
    }
  };

  const handleBatchDisableStudents = async () => {
    if (selectedStudentIds.size === 0) return;
    const result = await Swal.fire({
      title: 'Vô hiệu hóa hàng loạt?',
      text: `Vô hiệu hóa tài khoản của ${selectedStudentIds.size} học viên đã chọn?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        const { writeBatch } = await import('firebase/firestore');
        const batch = writeBatch(db);
        selectedStudentIds.forEach(id => {
          batch.update(doc(db, 'users', id), {
            status: 'disabled',
            updatedAt: Date.now()
          });
        });
        await batch.commit();
        setSelectedStudentIds(new Set());
        Swal.fire('Thành công', 'Đã vô hiệu hóa các tài khoản đã chọn.', 'success');
      } catch (e) {
        Swal.fire('Lỗi', 'Không thể vô hiệu hóa hàng loạt.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Tìm kiếm học viên..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-medium text-gray-900 dark:text-white"
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

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          {canDisableAccounts && selectedStudentIds.size > 0 && (
            <button 
              onClick={handleBatchDisableStudents}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-rose-100 transition-colors shadow-sm"
            >
              <FaBan /> Vô hiệu hóa hàng loạt ({selectedStudentIds.size})
            </button>
          )}
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-emerald-100 transition-colors"
          >
            <FaFileExcel /> Xuất Excel
          </button>
          {canAssignMembers && (
            <>
              <button 
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-green-100 transition-colors"
              >
                <FaFileImport /> Import Excel
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-indigo-100 transition-colors"
              >
                <FaUserPlus /> Thêm mới
              </button>
              <button 
                onClick={() => { setShowAddExistingModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-tight hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
              >
                <FaPlus /> Gán học viên
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <FaUsers size={48} className="mx-auto text-gray-200" />
          <p className="text-gray-400 font-medium">Không tìm thấy học viên nào phù hợp.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {paginatedStudents.map((st) => (
              <motion.div
                key={st.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 ${st.status === 'disabled' ? 'opacity-60 bg-gray-50/50 dark:bg-slate-950/20' : ''}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {canDisableAccounts && (
                      <input 
                        type="checkbox" 
                        checked={selectedStudentIds.has(st.id)}
                        onChange={(e) => {
                          const next = new Set(selectedStudentIds);
                          if (e.target.checked) next.add(st.id);
                          else next.delete(st.id);
                          setSelectedStudentIds(next);
                        }}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
                      />
                    )}
                    <div className="relative">
                      <img src={getAvatar(st)} alt="" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-slate-800" loading="lazy" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleOfflineAccess(st.id, !!st.offlineAccess)} className={`p-2 rounded-lg transition-colors ${st.offlineAccess ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`} title={st.offlineAccess ? "Đã bật Offline" : "Chưa bật Offline"}>{st.offlineAccess ? <FaWifi /> : <TbPlaneOff />}</button>
                    <button onClick={() => handleResetPassword(st.id, st.fullName || st.full_name || '')} className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-lg transition-colors" title="Reset Mật khẩu"><FaKey /></button>
                    <button onClick={() => handleViewHistory(st)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors" title="Lịch sử thi"><FaHistory /></button>
                    <button onClick={() => handleViewSessions(st)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Lịch sử truy cập"><FaUserClock /></button>
                    <button onClick={() => handleEditStudent(st)} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors" title="Chỉnh sửa"><FaEdit /></button>
                    <button onClick={() => { setSelectedStudent(st); setShowBadgeManager(true); }} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title="Huy hiệu">🏅</button>
                    {canDisableAccounts && (
                      st.status === 'disabled' ? (
                        <button onClick={() => handleActivateStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Kích hoạt lại tài khoản"><FaCheckCircle /></button>
                      ) : (
                        <button onClick={() => handleDisableStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Vô hiệu hóa tài khoản"><FaBan /></button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{st.fullName || st.full_name}</h4>
                    {st.status === 'disabled' && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-100 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Vô hiệu hóa</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 truncate font-medium">{st.email || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50 dark:border-slate-800">
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl flex flex-col items-center justify-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">Kết quả</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${(studentLatestResults[st.id]?.type || '').includes('Ôn') ? 'bg-blue-100 text-blue-700' : (studentLatestResults[st.id]?.type || '').includes('Thử') ? 'bg-purple-100 text-purple-700' : (studentLatestResults[st.id]?.type === '--' || !studentLatestResults[st.id]) ? 'bg-gray-200 text-gray-500' : 'bg-emerald-100 text-emerald-700'}`}>
                      {studentLatestResults[st.id]?.type || '--'}
                    </span>
                    <p className="text-sm font-black text-teal-600 mt-1">{studentLatestResults[st.id]?.score || '--'}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{studentLatestResults[st.id]?.time || '--'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-xl text-center flex flex-col items-center justify-center">
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter mb-1">Thiết bị</p>
                    <p className="text-lg font-black text-indigo-600 flex items-center justify-center gap-1"><FaLaptop size={14} /> {deviceCounts[st.id] || 0}</p>
                  </div>
                </div>
                
                {canAssignMembers && (
                  <button 
                    onClick={() => handleRemoveStudent(st.id, st.fullName || st.full_name || '')}
                    className="absolute top-4 right-4 text-xs text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                {canDisableAccounts && (
                  <th className="px-6 py-4 w-12">
                    <input 
                      type="checkbox"
                      checked={paginatedStudents.length > 0 && paginatedStudents.every(st => selectedStudentIds.has(st.id))}
                      onChange={(e) => {
                        const next = new Set(selectedStudentIds);
                        paginatedStudents.forEach(st => {
                          if (e.target.checked) next.add(st.id);
                          else next.delete(st.id);
                        });
                        setSelectedStudentIds(next);
                      }}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
                    />
                  </th>
                )}
                <th onClick={() => handleSort('name')} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer select-none hover:text-teal-500 transition-colors">Học viên <SortIcon column="name" /></th>
                <th onClick={() => handleSort('type')} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center cursor-pointer select-none hover:text-teal-500 transition-colors">Bài làm gần nhất <SortIcon column="type" /></th>
                <th onClick={() => handleSort('time')} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden lg:table-cell text-center cursor-pointer select-none hover:text-teal-500 transition-colors">Thời gian <SortIcon column="time" /></th>
                <th onClick={() => handleSort('score')} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center cursor-pointer select-none hover:text-teal-500 transition-colors">Điểm <SortIcon column="score" /></th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {paginatedStudents.map((st) => (
                <tr key={st.id} className={`hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group ${st.status === 'disabled' ? 'opacity-60 bg-gray-50/30 dark:bg-slate-900/10' : ''}`}>
                  {canDisableAccounts && (
                    <td className="px-6 py-4 w-12">
                      <input 
                        type="checkbox"
                        checked={selectedStudentIds.has(st.id)}
                        onChange={(e) => {
                          const next = new Set(selectedStudentIds);
                          if (e.target.checked) next.add(st.id);
                          else next.delete(st.id);
                          setSelectedStudentIds(next);
                        }}
                        className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-gray-300 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={getAvatar(st)} alt="" className="w-10 h-10 rounded-xl object-cover" loading="lazy" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{st.fullName || st.full_name}</p>
                          {st.status === 'disabled' && (
                            <span className="text-[9px] font-bold text-red-600 bg-red-100 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Vô hiệu hóa</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${(studentLatestResults[st.id]?.type || '').includes('Ôn') ? 'bg-blue-50 text-blue-600' : (studentLatestResults[st.id]?.type || '').includes('Thử') ? 'bg-purple-50 text-purple-600' : (studentLatestResults[st.id]?.type === '--' || !studentLatestResults[st.id]) ? 'bg-gray-50 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}>
                      {studentLatestResults[st.id]?.type || '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">{studentLatestResults[st.id]?.time || '--'}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-center">
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                      {studentLatestResults[st.id]?.score || '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleOfflineAccess(st.id, !!st.offlineAccess)} className={`p-2 rounded-lg transition-colors ${st.offlineAccess ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`} title={st.offlineAccess ? "Đã bật Offline" : "Chưa bật Offline"}>{st.offlineAccess ? <FaWifi size={14} /> : <TbPlaneOff size={14} />}</button>
                      <button onClick={() => handleResetPassword(st.id, st.fullName || st.full_name || '')} className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-lg transition-colors" title="Reset Mật khẩu"><FaKey size={14} /></button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors" title="Nhắn tin"><FaPaperPlane size={14} /></button>
                      <button onClick={() => handleViewHistory(st)} className="p-2 text-gray-400 hover:text-purple-600 rounded-lg" title="Lịch sử thi"><FaHistory size={14} /></button>
                      <button onClick={() => handleViewSessions(st)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg" title="Lịch sử truy cập"><FaUserClock size={14} /></button>
                      <button onClick={() => handleEditStudent(st)} className="p-2 text-gray-400 hover:text-teal-600 rounded-lg" title="Chỉnh sửa"><FaEdit size={14} /></button>
                      <button onClick={() => { setSelectedStudent(st); setShowBadgeManager(true); }} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg" title="Huy hiệu"><span className="text-sm">🏅</span></button>
                      {canDisableAccounts && (
                        st.status === 'disabled' ? (
                          <button onClick={() => handleActivateStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-green-600 hover:text-green-700 rounded-lg transition-colors" title="Kích hoạt lại tài khoản"><FaCheckCircle size={14} /></button>
                        ) : (
                          <button onClick={() => handleDisableStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-red-600 hover:text-red-700 rounded-lg transition-colors" title="Vô hiệu hóa tài khoản"><FaBan size={14} /></button>
                        )
                      )}
                      {canAssignMembers && (
                        <button onClick={() => handleRemoveStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-gray-400 hover:text-rose-600 rounded-lg" title="Gỡ học viên"><FaTrash size={14} /></button>
                      )}
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
          ><FaChevronLeft size={10} /></button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-teal-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-400'}`}>{i + 1}</button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          ><FaChevronRight size={10} /></button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateStudentModal
          courseId={course.id}
          courseName={course.name}
          licenseId={course.licenseId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

      {showImportModal && (
        <ImportStudentModal
          courseId={course.id}
          courseName={course.name}
          licenseId={course.licenseId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => setShowImportModal(false)}
        />
      )}

      {showAddExistingModal && (
          <AddStudentModal 
              isOpen={showAddExistingModal}
              onClose={() => setShowAddExistingModal(false)}
              classData={course}
          />
      )}

      {showEditModal && selectedStudent && (
        <EditStudentModal student={selectedStudent} onClose={() => setShowEditModal(false)} onSave={handleSaveStudent} />
      )}

      {showHistoryModal && selectedStudent && (
        <HistoryModal student={selectedStudent} history={studentHistory} loading={loadingHistory} onClose={() => setShowHistoryModal(false)} />
      )}

      {showSessionModal && selectedStudent && (
        <SessionModal student={selectedStudent} sessions={studentSessions} loading={loadingSessions} onClose={() => setShowSessionModal(false)} />
      )}

      {showBadgeManager && selectedStudent && (
        <AdminBadgeManager
          userId={selectedStudent.id}
          userName={selectedStudent.fullName || selectedStudent.full_name || '---'}
          userRole={selectedStudent.role || 'hoc_vien'}
          currentUserRole={currentUserRole}
          onClose={() => setShowBadgeManager(false)}
        />
      )}
    </div>
  );
};

export default StudentsTab;
