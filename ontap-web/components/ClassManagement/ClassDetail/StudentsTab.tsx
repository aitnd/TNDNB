import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, query, where, onSnapshot, 
  doc, updateDoc, getDocs, arrayUnion 
} from 'firebase/firestore';
import { db } from '../../services/firebaseClient';
import { 
  FaUsers, FaThLarge, FaList, FaSearch, FaUserPlus, 
  FaFileExcel, FaPlus, FaCheckCircle, FaLaptop, 
  FaPaperPlane, FaEdit, FaHistory, FaTrash, 
  FaChevronLeft, FaChevronRight, FaUserClock, 
  FaUserGraduate
} from 'react-icons/fa';
import { Course, UserProfile } from '../../types';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import CreateStudentModal from '../CreateStudentModal';
import { EditStudentModal, HistoryModal, SessionModal, AddStudentModal } from './Modals';
import { getExamHistory } from '../../services/historyService';

interface StudentsTabProps {
  course: Course;
  studentLatestResults?: Record<string, any>;
  deviceCounts?: Record<string, number>;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ 
  course, 
  studentLatestResults = {},
  deviceCounts = {}
}) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<UserProfile[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

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
    return result;
  }, [students, searchTerm]);

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
        'Trạng thái': st.isVerified ? 'Đã xác minh' : 'Chưa xác minh',
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

  const fetchAvailableStudents = async () => {
    setLoadingAvailable(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'hoc_vien'));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
      const filtered = all.filter(s => s.courseId !== course.id);
      setAvailableStudents(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleAddExistingStudent = async (studentId: string) => {
    try {
      await updateDoc(doc(db, 'users', studentId), {
        courseId: course.id,
        courseName: course.name
      });
      Swal.fire('Thành công', 'Đã thêm học viên vào lớp.', 'success');
      setShowAddExistingModal(false);
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể thêm học viên.', 'error');
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

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-emerald-100 transition-colors"
          >
            <FaFileExcel /> Excel
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-indigo-100 transition-colors"
          >
            <FaUserPlus /> Thêm mới
          </button>
          <button 
            onClick={() => { setShowAddExistingModal(true); fetchAvailableStudents(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-black uppercase tracking-tight hover:bg-teal-700 shadow-lg shadow-teal-600/20 active:scale-95 transition-all"
          >
            <FaPlus /> Gán học viên
          </button>
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
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="relative">
                    <img src={getAvatar(st)} alt="" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-slate-800" />
                    {st.isVerified && (
                      <div className="absolute -top-1 -right-1 bg-teal-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                        <FaCheckCircle className="text-[10px]" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleViewHistory(st)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors" title="Lịch sử thi"><FaHistory /></button>
                    <button onClick={() => handleViewSessions(st)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Lịch sử truy cập"><FaUserClock /></button>
                    <button onClick={() => handleEditStudent(st)} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg transition-colors" title="Chỉnh sửa"><FaEdit /></button>
                  </div>
                </div>

                <div className="space-y-1 mb-4 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">{st.fullName || st.full_name}</h4>
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
                
                <button 
                  onClick={() => handleRemoveStudent(st.id, st.fullName || st.full_name || '')}
                  className="absolute top-4 right-4 text-xs text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Học viên</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:table-cell">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center">Bài làm gần nhất</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden lg:table-cell text-center">Thời gian</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-center">Điểm</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {paginatedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={getAvatar(st)} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{st.fullName || st.full_name}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${st.isVerified ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                      {st.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                    </span>
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
                      <button className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors" title="Nhắn tin"><FaPaperPlane size={14} /></button>
                      <button onClick={() => handleViewHistory(st)} className="p-2 text-gray-400 hover:text-purple-600 rounded-lg" title="Lịch sử thi"><FaHistory size={14} /></button>
                      <button onClick={() => handleViewSessions(st)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg" title="Lịch sử truy cập"><FaUserClock size={14} /></button>
                      <button onClick={() => handleEditStudent(st)} className="p-2 text-gray-400 hover:text-teal-600 rounded-lg" title="Chỉnh sửa"><FaEdit size={14} /></button>
                      <button onClick={() => handleRemoveStudent(st.id, st.fullName || st.full_name || '')} className="p-2 text-gray-400 hover:text-rose-600 rounded-lg" title="Gỡ học viên"><FaTrash size={14} /></button>
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

      {showAddExistingModal && (
          <AddStudentModal 
              students={availableStudents} 
              onClose={() => setShowAddExistingModal(false)}
              onAdd={handleAddExistingStudent}
              loading={loadingAvailable}
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
    </div>
  );
};

export default StudentsTab;
