import React, { useEffect, useState } from 'react';
import { getExamHistory, ExamResult } from '../services/historyService';
import { UserProfile } from '../types';
import { FaHistory } from 'react-icons/fa';

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
        <div className="w-full max-w-5xl mx-auto p-4 animate-slide-in-right">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <FaHistory className="text-primary" />
                    Lịch sử Ôn tập & Thi
                </h1>
                <button
                    onClick={onBack}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors shadow-sm"
                >
                    Quay lại
                </button>
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
                <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                                    <th className="p-4 font-semibold">Loại</th>
                                    <th className="p-4 font-semibold">Bài thi</th>
                                    <th className="p-4 font-semibold text-center">Điểm số</th>
                                    <th className="p-4 font-semibold">Giờ nộp</th> {/* Changed from Duration to Completion Time */}
                                    <th className="p-4 font-semibold">Ngày nộp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {history.map((item) => {
                                    const type = getExamType(item);
                                    return (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 align-middle">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTypeStyles(type)}`}>
                                                    {type}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle font-medium text-foreground">
                                                {getDisplayName(item)}
                                            </td>
                                            <td className="p-4 align-middle text-center">
                                                <span className="font-bold text-primary">{item.score}</span>
                                                <span className="text-muted-foreground text-sm"> / {item.totalQuestions}</span>
                                            </td>
                                            <td className="p-4 align-middle text-sm">
                                                {new Date(item.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 align-middle text-sm text-muted-foreground">
                                                {new Date(item.completedAt).toLocaleDateString('vi-VN')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryScreen;
