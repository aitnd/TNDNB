import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../services/firebaseClient';
import { FaTimes, FaChalkboardTeacher, FaSearch, FaUserPlus, FaEnvelope, FaIdCard } from 'react-icons/fa';
import { Course, UserProfile } from '../../../types';
import Swal from 'sweetalert2';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Course;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, classData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('role', 'in', ['giao_vien', 'admin', 'quan_ly'])
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
          .filter(user => 
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            !classData.teacherIds?.includes(user.id)
          );
          
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching teachers:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, classData.teacherIds]);

  const handleAddTeacher = async (teacherId: string, teacherName: string) => {
    try {
      await updateDoc(doc(db, 'courses', classData.id), {
        teacherIds: arrayUnion(teacherId)
      });
      
      Swal.fire({
        title: 'Thành công!',
        text: `Đã thêm giáo viên ${teacherName} vào lớp.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error("Error adding teacher:", error);
      Swal.fire('Lỗi', 'Không thể thêm giáo viên.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
      >
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/30 dark:bg-slate-800/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-xl">
              <FaChalkboardTeacher />
            </div>
            <h2 className="text-2xl font-black dark:text-white tracking-tight">Thêm giáo viên</h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl text-gray-400 transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              autoFocus
              type="text"
              placeholder="Tìm theo tên hoặc email giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-medium shadow-inner"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium">Đang tìm kiếm...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => (
                <button 
                  key={user.id}
                  onClick={() => handleAddTeacher(user.id, user.full_name)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold overflow-hidden text-lg">
                      {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.full_name?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-bold dark:text-white text-sm line-clamp-1">{user.full_name}</div>
                      <div className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                         <FaEnvelope size={8} /> {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform group-hover:scale-110 transition-transform">
                    <FaUserPlus size={14} />
                  </div>
                </button>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-10 text-gray-400 italic text-sm">
                Không tìm thấy giáo viên nào chưa có trong lớp.
              </div>
            ) : (
              <div className="text-center py-10 text-gray-300 italic text-sm">
                Nhập ít nhất 2 ký tự để tìm kiếm
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 dark:bg-slate-800/20 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center justify-center gap-2">
               <FaIdCard size={12} /> Chỉ hiển thị người dùng có quyền Giáo viên hoặc Quản trị viên
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTeacherModal;
