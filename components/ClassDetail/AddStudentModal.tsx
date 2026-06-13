'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserGraduate } from 'react-icons/fa';  
import { db } from '@/utils/firebaseClient';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import Modal from './Modal';
import { Course, UserProfile } from '@/types/classManagement';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Course;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, classData }) => {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all students (hoc_vien) 
      const q = query(collection(db, 'users'), where('role', '==', 'hoc_vien'));
      const snap = await getDocs(q);
      const list = snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as UserProfile[];
      setAllStudents(list);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = allStudents.filter(s => {
    const isAlreadyInCurrentClass = s.courseId === classData.id;
    const matchesSearch = (s.fullName || s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.phoneNumber || '').includes(searchTerm);
    return !isAlreadyInCurrentClass && matchesSearch;
  });

  const handleAddStudent = async (student: UserProfile) => {
    if (student.courseId && student.courseId !== classData.id) {
        if (!window.confirm(`Học viên này đang ở lớp khác (${student.courseName || 'Lớp cũ'}). Chuyển sang lớp này?`)) return;
    }
    
    setAddingId(student.id);
    try {
      await updateDoc(doc(db, 'users', student.id), {
        courseId: classData.id,
        courseName: classData.name
      });
      // Optionally update studentCount in classData, but we use real-time count in StudentsTab
    } catch (e) {
      console.error(e);
      alert("Lỗi khi thêm học viên");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm học viên vào lớp">
      <div className="space-y-6">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email hoặc số điện thoại..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500/50 rounded-2xl outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">
               Đang tải danh sách...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">
               Không tìm thấy học viên nào khả dụng.
            </div>
          ) : (
            filteredStudents.map((s) => (
              <div 
                key={s.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                     <FaUserGraduate />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                      {s.fullName || s.full_name}
                      {s.courseId && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">LỚP: {s.courseName || '---'}</span>}
                    </h4>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{s.email || s.phoneNumber || 'Không có liên hệ'}</p>
                  </div>
                </div>
                <button
                  disabled={addingId === s.id}
                  onClick={() => handleAddStudent(s)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${addingId === s.id 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-white dark:bg-slate-800 text-indigo-600 border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-600 hover:text-white shadow-sm'}
                  `}
                >
                  {addingId === s.id ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
