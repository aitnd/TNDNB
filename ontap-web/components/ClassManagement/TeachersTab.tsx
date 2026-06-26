import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, documentId, onSnapshot, doc, updateDoc, arrayRemove, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '../../services/firebaseClient';
import { FaChalkboardTeacher, FaPlus, FaTrash, FaEnvelope, FaShieldAlt, FaUserTie } from 'react-icons/fa';
import { Course, UserProfile } from '../../types';
import Swal from 'sweetalert2';
import { AddTeacherModal } from './Modals';

interface TeachersTabProps {
  course: Course;
}

const TeachersTab: React.FC<TeachersTabProps> = ({ course }) => {
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Fetch current teachers
  useEffect(() => {
    const teacherIds = course.teacherIds || [];
    if (teacherIds.length === 0) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users'),
      where(documentId(), 'in', teacherIds)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teacherData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setTeachers(teacherData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [course.teacherIds]);

  // Fetch available teachers for the modal
  const fetchAvailableTeachers = async () => {
    setLoadingAvailable(true);
    try {
      const q = query(collection(db, 'users'), where('role', 'in', ['giao_vien', 'admin', 'quan_ly']));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
      const currentIds = course.teacherIds || [];
      const filtered = all.filter(t => !currentIds.includes(t.id));
      setAvailableTeachers(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleAddTeacher = async (teacherId: string) => {
    try {
      await updateDoc(doc(db, 'courses', course.id), {
        teacherIds: arrayUnion(teacherId)
      });
      Swal.fire('Thành công', 'Đã thêm giáo viên vào lớp.', 'success');
      setShowAddModal(false);
    } catch (e) {
      Swal.fire('Lỗi', 'Không thể thêm giáo viên.', 'error');
    }
  };

  const handleRemoveTeacher = async (teacherId: string, teacherName: string) => {
    if (teacherId === course.headTeacherId) {
      Swal.fire('Chú ý', 'Không thể xóa giáo viên chủ nhiệm khỏi danh sách giáo viên phụ trách.', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc muốn gỡ giáo viên ${teacherName} khỏi lớp này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Gỡ ngay',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, 'courses', course.id), {
          teacherIds: arrayRemove(teacherId)
        });
        Swal.fire('Đã gỡ!', 'Giáo viên đã được loại khỏi danh sách phụ trách.', 'success');
      } catch (error) {
        console.error("Error removing teacher:", error);
        Swal.fire('Lỗi', 'Không thể gỡ giáo viên.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <FaChalkboardTeacher className="text-teal-500" /> Danh sách giảng dạy
        </h3>
        <button 
          onClick={() => { setShowAddModal(true); fetchAvailableTeachers(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
        >
          <FaPlus /> Thêm giáo viên
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {loading ? (
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))
          ) : teachers.length > 0 ? (
            teachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  relative p-6 rounded-3xl border transition-all flex items-center gap-5
                  ${teacher.id === course.headTeacherId 
                    ? 'bg-teal-50/50 dark:bg-teal-500/5 border-teal-200 dark:border-teal-500/30' 
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm'
                  }
                `}
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 text-2xl font-bold shrink-0 overflow-hidden">
                  {teacher.photoURL ? (
                    <img src={teacher.photoURL} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    (teacher.full_name || teacher.fullName)?.charAt(0) || <FaUserTie />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {teacher.full_name || teacher.fullName}
                    </h4>
                    {teacher.id === course.headTeacherId && (
                      <span className="px-2 py-0.5 bg-teal-500 text-[9px] font-black text-white rounded-md uppercase tracking-tighter">
                        Chủ nhiệm
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                    <FaEnvelope className="text-[10px]" /> {teacher.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 flex items-center gap-1 uppercase tracking-widest leading-none">
                      <FaShieldAlt size={10} /> {teacher.role === 'admin' ? 'Quản trị viên' : 'Giáo viên'}
                    </span>
                  </div>
                </div>

                {teacher.id !== course.headTeacherId && (
                  <button 
                    onClick={() => handleRemoveTeacher(teacher.id, teacher.full_name || teacher.fullName || '')}
                    className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all"
                    title="Gỡ giáo viên"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-center">
              <FaChalkboardTeacher size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">Chưa có giáo viên phụ trách nào được thêm.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {showAddModal && (
          <AddTeacherModal 
              teachers={availableTeachers} 
              onClose={() => setShowAddModal(false)}
              onAdd={handleAddTeacher}
              loading={loadingAvailable}
          />
      )}
    </div>
  );
};

export default TeachersTab;
