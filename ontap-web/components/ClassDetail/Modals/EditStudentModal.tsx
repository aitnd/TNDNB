import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { UserProfile } from '../../../types';

interface EditStudentModalProps {
    isOpen: boolean;
    student: UserProfile | null;
    onClose: () => void;
    onSave: (id: string, data: any) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, student, onClose, onSave }) => {
    // We only initialize state when student is present
    const [name, setName] = useState(student?.full_name || student?.fullName || '');
    const [phone, setPhone] = useState(student?.phoneNumber || '');
    const [birthDate, setBirthDate] = useState(student?.birthDate || '');
    const [isVerified, setIsVerified] = useState(!!student?.isVerified);

    // Update state when student changes
    React.useEffect(() => {
        if (student) {
            setName(student?.full_name || student?.fullName || '');
            setPhone(student?.phoneNumber || '');
            setBirthDate(student?.birthDate || '');
            setIsVerified(!!student?.isVerified);
        }
    }, [student]);

    if (!isOpen || !student) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
                        <h2 className="text-xl font-bold dark:text-white">Chỉnh sửa Học viên</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-gray-400 dark:text-slate-500 transition-all shadow-sm"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-300">Họ và Tên</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-teal-500 transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 dark:text-gray-300">Email (Đăng nhập)</label>
                            <input 
                                type="email" 
                                value={student.email || ''} 
                                className="w-full p-3 border rounded-xl bg-gray-100 dark:bg-slate-800/50 dark:border-slate-700 text-gray-500 cursor-not-allowed outline-none" 
                                disabled 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Số điện thoại</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-teal-500 transition-colors" 
                                    placeholder="0xxx..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Ngày sinh</label>
                                <input 
                                    type="text" 
                                    value={birthDate} 
                                    onChange={e => setBirthDate(e.target.value)} 
                                    className="w-full p-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-teal-500 transition-colors" 
                                    placeholder="DD/MM/YYYY" 
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="verify-chk" 
                                checked={isVerified} 
                                onChange={e => setIsVerified(e.target.checked)} 
                                className="w-4 h-4 rounded text-teal-600" 
                            />
                            <label htmlFor="verify-chk" className="text-sm font-bold dark:text-gray-300 cursor-pointer">
                                Đã xác minh tài khoản
                            </label>
                        </div>
                        
                        <div className="pt-4 flex gap-3 justify-end">
                            <button 
                                onClick={onClose} 
                                className="px-5 py-2.5 font-bold text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={() => {
                                    onSave(student.id, { 
                                        fullName: name, 
                                        full_name: name, // For backward compatibility depending on their schema
                                        phone, 
                                        phoneNumber: phone, 
                                        birthDate, 
                                        isVerified 
                                    });
                                    onClose();
                                }} 
                                className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all"
                            >
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditStudentModal;
