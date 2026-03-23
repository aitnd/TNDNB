import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserClock } from 'react-icons/fa';
import { UserProfile } from '../../../types';

interface SessionModalProps {
    isOpen: boolean;
    student: UserProfile | null;
    sessions: any[];
    loading: boolean;
    onClose: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ isOpen, student, sessions, loading, onClose }) => {
    if (!isOpen || !student) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh]"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Lịch sử truy cập</h2>
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
                                <p className="text-gray-500 dark:text-slate-400 font-medium">Đang tải dữ liệu phiên...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((s, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex justify-between items-center group hover:border-teal-200 dark:hover:border-teal-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                                                <FaUserClock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                    {s.device || 'Thiết bị không xác định'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                                    {s.lastActive?.toDate ? s.lastActive.toDate().toLocaleString('vi-VN') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
                                            {s.browser || 'Browser'}
                                        </span>
                                    </div>
                                ))}
                                {sessions.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-slate-600">
                                            <FaUserClock size={24} />
                                        </div>
                                        <p className="text-gray-500 dark:text-slate-400 font-medium">Không có dữ liệu phiên truy cập.</p>
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

export default SessionModal;
