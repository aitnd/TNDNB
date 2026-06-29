import React, { useEffect, useState } from 'react';
import { getExamHistory, ExamResult } from '../services/historyService';
import { UserProfile } from '../types';
import { FaHistory, FaCheckCircle, FaExclamationCircle, FaBook, FaGlobe, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { triggerHaptic } from '../utils/nativeUX';
import { ArrowLeftIcon3D } from './icons';

interface HistoryScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ userProfile, onBack }) => {
    const [history, setHistory] = useState<ExamResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [roomDetails, setRoomDetails] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadHistory = async () => {
            const data = await getExamHistory(userProfile.id);
            // Sort by completedAt desc
            data.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
            setHistory(data);
            setLoading(false);

            // Fetch Room Details for Online Exams
            const roomIds = Array.from(new Set(data.filter(item => item.roomId).map(item => item.roomId!)));
            if (roomIds.length > 0) {
                const details: Record<string, any> = {};
                // Fetch in parallel
                await Promise.all(roomIds.map(async (rid) => {
                    try {
                        // Assuming 'db' is available via imports or we import it.
                        // We need to ensure 'db' is imported. Check imports.
                        // Importing db here if not present in file would be tricky with replace_file_content partial.
                        // But I will check imports first.
                        // Assuming I can't easily see imports here, I will add logic and rely on auto-imports or explicit imports in separate step if needed.
                        // Actually, I can use the import from services/firebaseClient if exported, or just assume it is imported. 
                        // Note: HistoryScreen imports 'getExamHistory'. It doesn't import 'db' yet.
                        // I will add 'db' import in a separate step or assume I need to do it.
                        // Let's assume I need to add imports.
                        const { doc, getDoc } = await import('firebase/firestore');
                        const { db } = await import('../services/firebaseClient');

                        const roomSnap = await getDoc(doc(db, 'exam_rooms', rid));
                        if (roomSnap.exists()) {
                            details[rid] = roomSnap.data();
                        }
                    } catch (err) {
                        console.error(`Error fetching room ${rid}`, err);
                    }
                }));
                setRoomDetails(details);
            }
        };
        loadHistory();
    }, [userProfile.id]);

    const getExamType = (item: ExamResult) => {
        if (item.roomId) return 'Thi Trực Tuyến';
        if (item.quizId === 'exam-quiz' || item.quizId === 'thithu2' || item.type === 'Thi thử') return 'Thi thử';
        return 'Ôn tập';
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Thi Trực Tuyến':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Thi thử':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} phút ${secs} giây`;
    };

    const getDisplayName = (item: ExamResult) => {
        if (item.roomId && roomDetails[item.roomId]) {
            const r = roomDetails[item.roomId];
            return `Phòng thi ${r.name} / ${r.course_name || 'Tự do'} / ${r.license_name || ''}`;
        }
        return item.quizTitle || (item.roomId ? `Phòng thi ${item.roomId}` : item.type);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right pb-24">
            <div className="relative text-center mb-8 pt-4">
                <button 
                  onClick={() => { triggerHaptic('light'); onBack(); }} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600"
                  aria-label="Quay lại"
                >
                    <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
                </button>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <FaHistory className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Nhật ký Học tập</h1>
                <p className="text-sm text-slate-500 mt-1 font-medium">Theo dõi quá trình rèn luyện của bạn.</p>
            </div>

            {loading ? (
                <div className="text-center p-8">
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center p-8 bg-card rounded-xl shadow-sm border border-border">
                    <p className="text-muted-foreground">Chưa có lịch sử làm bài nào.</p>
                </div>
            ) : (
            <div className="space-y-4">
                {history.map((item) => {
                    const type = getExamType(item);
                    const isPass = item.score / (item.totalQuestions || 1) >= 0.7; // Basic pass visual
                    
                    return (
                        <div key={item.id} className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-xl p-5 active:scale-[0.98] transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        type === 'Thi Trực Tuyến' ? 'bg-rose-100 text-rose-600' : 
                                        type === 'Thi thử' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {type === 'Thi Trực Tuyến' ? <FaGlobe /> : type === 'Thi thử' ? <FaBook /> : <FaBook />}
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            type === 'Thi Trực Tuyến' ? 'text-rose-500' : 
                                            type === 'Thi thử' ? 'text-amber-500' : 'text-blue-500'
                                        }`}>
                                            {type}
                                        </span>
                                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                                            {getDisplayName(item)}
                                        </h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black ${isPass ? 'text-green-600' : 'text-rose-600'}`}>
                                        {item.score}
                                        <span className="text-xs text-slate-400 font-bold ml-0.5">/{item.totalQuestions}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1">
                                        {isPass ? <FaCheckCircle className="text-green-500 text-xs" /> : <FaExclamationCircle className="text-rose-500 text-xs" />}
                                        <span className={`text-[10px] font-bold uppercase ${isPass ? 'text-green-500' : 'text-rose-500'}`}>
                                            {isPass ? 'Hoàn thành' : 'Cố gắng lên'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-700/50 pt-4">
                                <div className="flex items-center gap-1 text-slate-400">
                                    <FaClock className="text-xs" />
                                    <span className="text-[11px] font-bold">
                                        {new Date(item.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-400">
                                    <FaCalendarAlt className="text-xs" />
                                    <span className="text-[11px] font-bold">
                                        {new Date(item.completedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default HistoryScreen;
