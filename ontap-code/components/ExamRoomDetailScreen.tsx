import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlay, FaStop, FaTrash, FaUsers, FaClock, FaIdCard, FaKey, FaChalkboardTeacher, FaSpinner } from 'react-icons/fa';
import { db } from '../services/firebaseClient';
import { doc, onSnapshot, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'sonner';

interface ExamRoomDetailScreenProps {
    roomId: string;
    onBack: () => void;
}

const ExamRoomDetailScreen: React.FC<ExamRoomDetailScreenProps> = ({ roomId, onBack }) => {
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'exam_rooms', roomId), (doc) => {
            if (doc.exists()) {
                setRoom({ id: doc.id, ...doc.data() });
            } else {
                toast.error("Phòng thi không tồn tại hoặc đã bị xóa.");
                onBack();
            }
            setLoading(false);
        });

        // Fetch participants (Mock or Real if implemented)
        // For now, we can query exam_results to see who has submitted
        // Or if we had a 'participants' subcollection.
        // Let's just mock or leave empty for now as per plan.

        return () => unsubscribe();
    }, [roomId, onBack]);

    const handleUpdateStatus = async (status: 'waiting' | 'in_progress' | 'finished') => {
        try {
            await updateDoc(doc(db, 'exam_rooms', roomId), { status });
            toast.success(`Đã cập nhật trạng thái: ${status === 'in_progress' ? 'Đang thi' : status === 'finished' ? 'Kết thúc' : 'Đang chờ'}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Lỗi cập nhật trạng thái.");
        }
    };

    const handleDeleteRoom = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa phòng thi này không?")) {
            try {
                await deleteDoc(doc(db, 'exam_rooms', roomId));
                toast.success("Đã xóa phòng thi.");
                onBack();
            } catch (error) {
                console.error("Error deleting room:", error);
                toast.error("Lỗi xóa phòng thi.");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-3xl text-blue-600" /></div>;
    }

    if (!room) return null;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 animate-fade-in">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-slate-700 pb-4">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium">
                    <FaArrowLeft /> Quay lại danh sách
                </button>
                <div className="flex gap-2">
                    {room.status === 'waiting' && (
                        <button onClick={() => handleUpdateStatus('in_progress')} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2 font-bold">
                            <FaPlay /> Bắt đầu thi
                        </button>
                    )}
                    {room.status === 'in_progress' && (
                        <button onClick={() => handleUpdateStatus('finished')} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition flex items-center gap-2 font-bold">
                            <FaStop /> Kết thúc thi
                        </button>
                    )}
                    <button onClick={handleDeleteRoom} className="bg-gray-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2 font-medium border border-red-200">
                        <FaTrash /> Xóa phòng
                    </button>
                </div>
            </div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase mb-1 flex items-center gap-2"><FaChalkboardTeacher /> Phòng thi</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{room.name}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-bold uppercase mb-1 flex items-center gap-2"><FaIdCard /> Hạng bằng</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{room.license_id}</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                    <div className="text-orange-600 dark:text-orange-400 text-sm font-bold uppercase mb-1 flex items-center gap-2"><FaClock /> Thời gian</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-100">{room.duration} phút</div>
                </div>
                <div className={`p-4 rounded-xl border ${room.status === 'in_progress' ? 'bg-green-50 border-green-100 text-green-800' : room.status === 'finished' ? 'bg-gray-100 border-gray-200 text-gray-800' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
                    <div className="text-sm font-bold uppercase mb-1 flex items-center gap-2">Trạng thái</div>
                    <div className="text-xl font-bold">
                        {room.status === 'waiting' ? 'Đang chờ' : room.status === 'in_progress' ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </div>
                </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <FaUsers /> Danh sách thí sinh
                    </h3>
                    <div className="text-center py-10 text-gray-500 italic">
                        Tính năng theo dõi thí sinh Real-time đang được phát triển.
                        <br />
                        (Sẽ hiển thị danh sách thí sinh đang làm bài tại đây)
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-gray-200 dark:border-slate-600 shadow-sm">
                        <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2 border-b pb-2">Thông tin thêm</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Mật khẩu:</span>
                                <span className="font-mono font-bold">{room.password || 'Không có'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Lớp:</span>
                                <span className="font-medium">{room.course_name || 'Tự do'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ngày tạo:</span>
                                <span className="font-medium">{room.created_at?.toDate().toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamRoomDetailScreen;
