import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaClock, FaHistory } from 'react-icons/fa';
import { UserProfile } from '../../../types';

interface HistoryModalProps {
    isOpen: boolean;
    student: UserProfile | null;
    history: any[];
    loading: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, student, history, loading, onClose }) => {
    if (!isOpen || !student) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Lịch sử làm bài</h2>
                            <p className="text-sm text-gray-500 font-medium mt-1">{student.full_name || student.fullName}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-gray-400 dark:text-slate-500 transition-all shadow-sm"
                        >
                            <FaTimes size={16} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
                                <p className="text-gray-500 dark:text-slate-400 font-medium">Đang tải lịch sử thi...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((h, idx) => (
                                    <div key={idx} className="p-5 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex justify-between items-center group hover:border-teal-200 dark:hover:border-teal-500/30 transition-colors">
                                        <div>
                                            <p className="font-bold text-base text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {h.quizTitle || 'Bài kiểm tra'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mt-2">
                                                <FaClock className="text-gray-400" /> {h.completedAt?.toDate ? h.completedAt.toDate().toLocaleString('vi-VN') : '--'}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                                                {h.score}<span className="text-lg text-gray-400 font-semibold tracking-normal">/{h.totalQuestions}</span>
                                            </p>
                                            <span className={`text-[11px] px-3 py-1 rounded-full font-bold tracking-widest uppercase
                                                ${h.isPassed 
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                                    : 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                                }`}>
                                                {h.isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {history.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-slate-600">
                                            <FaHistory size={24} />
                                        </div>
                                        <p className="text-gray-500 dark:text-slate-400 font-medium">Chưa tìm thấy lịch sử bài làm nào.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HistoryModal;
