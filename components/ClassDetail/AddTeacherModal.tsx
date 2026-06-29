'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserTie } from 'react-icons/fa';  
import { db } from '@/utils/firebaseClient';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import Modal from './Modal';
import { Course, UserProfile } from '@/types/classManagement';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: Course;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, classData }) => {
  const [allTeachers, setAllTeachers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'giao_vien'));
      const snap = await getDocs(q);
      const list = snap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as UserProfile[];
      setAllTeachers(list);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = allTeachers.filter(t => {
    const isAlreadyIn = classData.teacherIds?.includes(t.id);
    const matchesSearch = (t.fullName || t.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return !isAlreadyIn && matchesSearch;
  });

  const handleAddTeacher = async (teacherId: string) => {
    setAddingId(teacherId);
    try {
      await updateDoc(doc(db, 'courses', classData.id), {
        teacherIds: arrayUnion(teacherId)
      });
      // Logic for adding teacher to class
      // In the original app, it adds to teacherIds array in courses collection
    } catch (e) {
      console.error(e);
      alert("Lỗi khi thêm giáo viên");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm giáo viên vào lớp">
      <div className="space-y-6">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email giáo viên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">
               Đang tải danh sách...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-10 text-center text-gray-400 italic">
               Không tìm thấy giáo viên nào khả dụng.
            </div>
          ) : (
            filteredTeachers.map((t) => (
              <div 
                key={t.id} 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl hover:bg-teal-50/50 dark:hover:bg-teal-500/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                     <FaUserTie />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                      {t.fullName || t.full_name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{t.email}</p>
                  </div>
                </div>
                <button
                  disabled={addingId === t.id}
                  onClick={() => handleAddTeacher(t.id)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${addingId === t.id 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-white dark:bg-slate-800 text-teal-600 border border-teal-100 dark:border-teal-500/20 hover:bg-teal-600 hover:text-white shadow-sm'}
                  `}
                >
                  {addingId === t.id ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddTeacherModal;
