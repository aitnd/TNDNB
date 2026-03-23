'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaUserTie, FaPlus, FaTrash, FaGraduationCap, 
  FaMailBulk, FaPhone, FaCheckCircle 
} from 'react-icons/fa';
import { db } from '@/utils/firebaseClient';
import { 
  collection, query, where, documentId, 
  getDocs, onSnapshot, doc, updateDoc, arrayRemove 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, UserProfile } from '@/types/classManagement';

interface TeachersTabProps {
  classData: Course;
  onAddTeacher?: () => void;
}

const TeachersTab: React.FC<TeachersTabProps> = ({ classData, onAddTeacher }) => {
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCourse, setCurrentCourse] = useState<Course>(classData);

  // Sync current course data in real-time to get updated teacherIds
  useEffect(() => {
    const unsubCourse = onSnapshot(doc(db, 'courses', classData.id), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      }
    });
    return () => unsubCourse();
  }, [classData.id]);

  // Fetch teachers based on currentCourse.teacherIds
  useEffect(() => {
    const teacherIds = currentCourse.teacherIds || [];
    if (teacherIds.length === 0) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Firestore 'in' query supports up to 30 values
    const q = query(
      collection(db, 'users'),
      where(documentId(), 'in', teacherIds.slice(0, 30)) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setTeachers(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching teachers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentCourse.teacherIds]);

  const handleRemoveTeacher = async (teacherId: string) => {
    if (!window.confirm("BẠN CÓ CHẮC MUỐN GỠ GIÁO VIÊN NÀY?")) return;
    try {
      await updateDoc(doc(db, 'courses', currentCourse.id), {
        teacherIds: arrayRemove(teacherId)
      });
    } catch (e) {
      console.error(e);
      alert("Lỗi khi gỡ giáo viên");
    }
  };

  const getAvatar = (t: UserProfile) => {
      const name = t.fullName || t.full_name || 'Giáo viên';
      return t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`;
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-teal-500/10 rounded-xl text-teal-600">
             <FaUserTie />
          </div>
          Giáo viên giảng dạy ({teachers.length})
        </h3>
        <button 
          onClick={onAddTeacher}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
        >
          <FaPlus /> Thêm giáo viên
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-gray-100 dark:border-slate-800" />
           ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-20 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
             <FaUserTie className="text-3xl" />
          </div>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Lớp học này chưa được phân bổ giáo viên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {teachers.map((t) => {
              const isHead = currentCourse.headTeacherId === t.id;
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`
                    relative group bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all duration-300
                    ${isHead ? 'border-teal-500/50 shadow-lg shadow-teal-500/5' : 'border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl'}
                  `}
                >
                  {isHead && (
                    <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 shadow-sm z-10">
                      <FaGraduationCap /> CN
                    </div>
                  )}

                  <div className="flex items-center gap-5 mb-6">
                     <div className="relative">
                        <img 
                          src={getAvatar(t)} 
                          alt="" 
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-slate-800"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-gray-900 dark:text-white truncate text-lg tracking-tight">
                          {t.fullName || t.full_name}
                        </h4>
                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-0.5">
                          {isHead ? 'Giáo viên chủ nhiệm' : 'Giáo viên bộ môn'}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-50 dark:border-slate-800">
                     <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400 font-medium">
                        <FaMailBulk className="text-gray-300" />
                        <span className="truncate">{t.email || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400 font-medium">
                        <FaPhone className="text-gray-300" />
                        <span>{t.phoneNumber || 'N/A'}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 pt-4">
                     <button className="flex-1 py-2.5 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-100 dark:border-slate-700">
                        Chi tiết
                     </button>
                     <button 
                       onClick={() => handleRemoveTeacher(t.id)}
                       className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                     >
                        <FaTrash size={14} />
                     </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TeachersTab;
