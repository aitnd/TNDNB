import React, { useEffect, useState } from 'react';
import { getExamHistory, ExamResult } from '../services/historyService';
import { UserProfile } from '../types';
import { FaHistory, FaCheckCircle, FaExclamationCircle, FaBook, FaGlobe, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { triggerHaptic } from '../utils/nativeUX';
import { ArrowLeftIcon3D } from './icons';
import { calculateIsPass } from '../utils/examUtils';

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
            data.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
            setHistory(data);
            setLoading(false);

            const roomIds = Array.from(new Set(data.filter(item => item.roomId).map(item => item.roomId!)));
            if (roomIds.length > 0) {
                const details: Record<string, any> = {};
                await Promise.all(roomIds.map(async (rid) => {
                    try {
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

    const getDisplayName = (item: ExamResult) => {
        if (item.roomId && roomDetails[item.roomId]) {
            const r = roomDetails[item.roomId];
            return `Phòng thi ${r.name} / ${r.course_name || 'Tự do'} / ${r.license_name || ''}`;
        }
        return item.quizTitle || (item.roomId ? `Phòng thi ${item.roomId}` : item.type);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right pb-24 pt-20">
            <div className="relative text-center mb-8 pt-4">
                <button 
                  onClick={() => { triggerHaptic('light'); onBack(); }} 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-2 rounded-2xl shadow-sm border border-border active:scale-95 transition-all font-bold text-foreground hover:bg-muted"
                  aria-label="Quay lại"
                >
                    <ArrowLeftIcon3D className="h-7 w-7 text-foreground" />
                </button>
                <div className="bg-primary/10 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-primary/20">
                  <FaHistory className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Nhật ký Học tập</h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Theo dõi quá trình rèn luyện của bạn.</p>
            </div>

            {loading ? (
                <div className="text-center p-8">
                    <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center p-8 bg-card rounded-2xl shadow-sm border border-border">
                    <p className="text-muted-foreground">Chưa có lịch sử làm bài nào.</p>
                </div>
            ) : (
            <div className="space-y-4">
                {history.map((item) => {
                    const type = getExamType(item);
                    const examType = item.type === 'Thi thử' ? 'Thi thử' : 'Ôn tập';
                    const isPass = calculateIsPass(item.score, item.totalQuestions || 1, examType);
                    
                    return (
                        <div key={item.id} className="relative overflow-hidden bg-card rounded-2xl border border-border shadow-sm p-5 hover:border-primary/40 active:scale-[0.99] transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                        type === 'Thi Trực Tuyến' ? 'bg-destructive/15 text-destructive' : 
                                        type === 'Thi thử' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-primary/15 text-primary'
                                    }`}>
                                        {type === 'Thi Trực Tuyến' ? <FaGlobe /> : <FaBook />}
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                            type === 'Thi Trực Tuyến' ? 'text-destructive' : 
                                            type === 'Thi thử' ? 'text-amber-600 dark:text-amber-400' : 'text-primary'
                                        }`}>
                                            {type}
                                        </span>
                                        <h3 className="text-base font-black text-foreground leading-tight">
                                            {getDisplayName(item)}
                                        </h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl font-black tabular-nums ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                                        {item.score}
                                        <span className="text-xs text-muted-foreground font-bold ml-0.5">/{item.totalQuestions}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1">
                                        {isPass ? <FaCheckCircle className="text-emerald-500 text-xs" /> : <FaExclamationCircle className="text-destructive text-xs" />}
                                        <span className={`text-[10px] font-bold uppercase ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                                            {isPass ? 'Hoàn thành' : 'Cố gắng lên'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 border-t border-border pt-3">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <FaClock className="text-xs" />
                                    <span className="text-xs font-semibold tabular-nums">
                                        {new Date(item.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <FaCalendarAlt className="text-xs" />
                                    <span className="text-xs font-semibold tabular-nums">
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
