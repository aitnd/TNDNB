import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc, limit } from 'firebase/firestore';
import { db } from '../../../services/firebaseClient';
import { FaTimes, FaUserPlus, FaSearch, FaCheck, FaUserGraduate, FaInfoCircle } from 'react-icons/fa';
import { Course, UserProfile } from '../../../types';
import Swal from 'sweetalert2';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Course;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, classData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
          where('role', '==', 'hoc_vien'),
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
          .filter(user => 
            (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phoneNumber?.includes(searchTerm)) &&
            user.courseId !== classData.id
          );
          
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching students:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, classData.id]);

  const handleAddStudents = async () => {
    if (selectedIds.length === 0) return;

    try {
      const promises = selectedIds.map(id => 
        updateDoc(doc(db, 'users', id), {
          courseId: classData.id,
          courseName: classData.name
        })
      );

      await Promise.all(promises);
      
      Swal.fire({
        title: 'Thành công!',
        text: `Đã thêm ${selectedIds.length} học viên vào lớp.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      setSelectedIds([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error("Error adding students:", error);
      Swal.fire('Lỗi', 'Không thể thêm học viên.', 'error');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20 text-xl">
              <FaUserPlus />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">Thêm học viên</h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">Lớp: {classData.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl text-gray-400 dark:text-slate-500 transition-all shadow-sm"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="relative group">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              autoFocus
              type="text"
              placeholder="Tìm học viên bằng Tên, Email hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-teal-500 transition-all dark:text-white font-medium"
            />
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10 text-gray-400 dark:text-slate-500 font-medium">Đang tìm kiếm...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map(user => (
                <div 
                  key={user.id}
                  onClick={() => toggleSelect(user.id)}
                  className={`
                    flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2
                    ${selectedIds.includes(user.id) 
                      ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 shadow-md translate-x-1' 
                      : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-teal-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 font-bold overflow-hidden text-lg">
                      {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <FaUserGraduate />}
                    </div>
                    <div className="text-left">
                      <div className="font-bold dark:text-white text-sm line-clamp-1">{user.full_name}</div>
                      <div className="text-xs text-gray-500 dark:text-slate-500 line-clamp-1">{user.email || user.phoneNumber}</div>
                    </div>
                  </div>
                  {selectedIds.includes(user.id) && (
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0">
                      <FaCheck size={12} />
                    </div>
                  )}
                </div>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-12 text-gray-400 space-y-2">
                <FaInfoCircle size={32} className="mx-auto opacity-20" />
                <p>Không tìm thấy học viên nào phù hợp hoặc học viên đã có lớp.</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-300 italic">
                Nhập từ khóa để bắt đầu tìm kiếm
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gray-50 dark:bg-slate-800/30 flex justify-between items-center text-left">
          <div className="text-sm font-bold text-gray-500 dark:text-slate-400">
            {selectedIds.length > 0 ? `Đã chọn ${selectedIds.length} học viên` : 'Chưa chọn học viên nào'}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              disabled={selectedIds.length === 0}
              onClick={handleAddStudents}
              className="px-10 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-xl shadow-teal-500/20 active:scale-95 whitespace-nowrap"
            >
              Thêm vào lớp
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddStudentModal;
