'use client';

import React, { useState } from 'react';
import {    FaUserPlus,    FaSpinner,    FaExclamationCircle,    FaInfoCircle} from 'react-icons/fa'; 






import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebaseClient';
import { Course } from '@/types/classManagement';
import Modal from './Modal';

interface CreateStudentModalProps {
  open: boolean;
  onClose: () => void;
  course: Course;
  onSuccess: () => void;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ open, onClose, course, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cccd: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Kiểm tra email đã tồn tại chưa
      if (formData.email) {
        const q = query(collection(db, 'users'), where('email', '==', formData.email.trim()));
        const snap = await getDocs(q);
        if (!snap.empty) {
          throw new Error('Email này đã được sử dụng bởi một tài khoản khác.');
        }
      }

      // 2. Tạo record user mới
      await addDoc(collection(db, 'users'), {
        fullName: formData.fullName.trim(),
        full_name: formData.fullName.trim(),
        email: formData.email.trim() || null,
        phoneNumber: formData.phoneNumber.trim(),
        cccd: formData.cccd.trim(),
        role: 'hoc_vien',
        courseId: course.id,
        courseName: course.name,
        createdAt: serverTimestamp(),
        isVerified: false,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName.trim())}&background=random&color=fff`
      });

      onSuccess();
      onClose();
      setFormData({ fullName: '', email: '', phoneNumber: '', cccd: '' });
      alert('Đã tạo học viên mới thành công!');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo học viên.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Thêm mới học viên vào lớp" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl text-sm font-medium border border-rose-100 dark:border-rose-500/20">
            <FaExclamationCircle className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn A"
              required
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-bold"
            />
            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">
              * Dùng để đăng nhập hoặc lấy lại mật khẩu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Số điện thoại
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="09xxx..."
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Số CCCD
              </label>
              <input
                name="cccd"
                value={formData.cccd}
                onChange={handleChange}
                placeholder="001..."
                className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-teal-500/50 rounded-2xl outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl text-xs flex items-start gap-3 border border-teal-100 dark:border-teal-500/20">
          <FaInfoCircle className="mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            Học viên mới sẽ được tự động gán vào lớp <strong>{course.name}</strong> và có thể ôn luyện ngay lập tức.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 shadow-xl shadow-teal-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaUserPlus />
            )}
            <span>{loading ? 'Đang xử lý...' : 'Tạo mới'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStudentModal;

