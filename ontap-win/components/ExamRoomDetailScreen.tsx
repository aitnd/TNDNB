import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, rtdb } from '../services/firebaseClient';
import { doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, onValue, remove, update } from 'firebase/database';
import { toast } from 'sonner';
import { FaTrash, FaPlay, FaStop, FaUsers, FaUserSlash, FaCheckDouble } from 'react-icons/fa';

interface ExamRoom {
    id: string;
    name: string;
    license_id: string;
    subject_id: string;
    status: 'waiting' | 'in_progress' | 'finished';
    created_at: any;
    duration: number;
    password?: string;
}

interface Participant {
    uid: string;
    user_name: string;
    user_email: string;
    user_sbd: string;
    status: 'joined' | 'doing' | 'submitted' | 'offline';
    score?: number;
    time_left?: number;
    answers_count?: number;
    total_questions?: number;
    joined_at?: number;
}

const ExamRoomDetailScreen: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<ExamRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
        if (!roomId) return;

        // Firestore: Room Details
        const roomRef = doc(db, 'exam_rooms', roomId);
        const unsubscribeRoom = onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
                setRoom({ id: docSnap.id, ...docSnap.data() } as ExamRoom);
            } else {
                toast.error("Phòng thi không tồn tại!");
                navigate('/admin/exam-manager');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching room:", error);
            setLoading(false);
        });

        // RTDB: Participants
        const progressRef = ref(rtdb, `exam_progress/${roomId}`);
        const unsubscribeRTDB = onValue(progressRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list: Participant[] = Object.keys(data).map(key => ({
                    uid: key,
                    ...data[key]
                }));
                setParticipants(list);
            } else {
                setParticipants([]);
            }
        });

        return () => {
            unsubscribeRoom();
            unsubscribeRTDB();
        };
    }, [roomId, navigate]);

    const handleUpdateStatus = async (newStatus: 'waiting' | 'in_progress' | 'finished') => {
        if (!room) return;
        try {
            await updateDoc(doc(db, 'exam_rooms', room.id), { status: newStatus });
            toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const handleDeleteRoom = async () => {
        if (!room || !window.confirm("Bạn có chắc chắn muốn xóa phòng thi này?")) return;
        try {
            await deleteDoc(doc(db, 'exam_rooms', room.id));
            toast.success("Đã xóa phòng thi");
            navigate('/admin/exam-manager');
        } catch (error) {
            toast.error("Lỗi xóa phòng thi");
        }
    };

    const handleKickUser = async (uid: string, name: string) => {
        if (!window.confirm(`Mời thí sinh ${name} ra khỏi phòng?`)) return;
        try {
            await remove(ref(rtdb, `exam_progress/${roomId}/${uid}`));
            toast.success(`Đã mời ${name} ra khỏi phòng`);
        } catch (error) {
            toast.error("Lỗi khi mời thí sinh");
        }
    };

    const handleForceSubmit = async (uid: string, name: string) => {
        if (!window.confirm(`Buộc thí sinh ${name} nộp bài?`)) return;
        try {
            await update(ref(rtdb, `exam_progress/${roomId}/${uid}`), {
                status: 'submitted',
                force_submit: true
            });
            toast.success(`Đã buộc ${name} nộp bài`);
        } catch (error) {
            toast.error("Lỗi khi buộc nộp bài");
        }
    };

    if (loading) return <div className="p-8 text-center">Đang tải thông tin phòng thi...</div>;
    if (!room) return <div className="p-8 text-center">Không tìm thấy phòng thi</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h1>
                        <div className="flex gap-4 text-sm text-gray-600">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                {room.license_id ? `Hạng ${room.license_id}` : 'Tự do'}
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                {room.duration} phút
                            </span>
                            <span className={`px-3 py-1 rounded-full ${room.status === 'in_progress' ? 'bg-green-100 text-green-700' :
                                    room.status === 'finished' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {room.status === 'waiting' ? 'Đang chờ' :
                                    room.status === 'in_progress' ? 'Đang diễn ra' : 'Đã kết thúc'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {room.status === 'waiting' && (
                            <button
                                onClick={() => handleUpdateStatus('in_progress')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <FaPlay /> Bắt đầu
                            </button>
                        )}
                        {room.status === 'in_progress' && (
                            <button
                                onClick={() => handleUpdateStatus('finished')}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                <FaStop /> Kết thúc
                            </button>
                        )}
                        <button
                            onClick={handleDeleteRoom}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <FaTrash /> Xóa phòng
                        </button>
                    </div>
                </div>
            </div>

            {/* Participants Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaUsers className="text-blue-500" />
                        Danh sách thí sinh ({participants.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Thí sinh</th>
                                <th className="px-6 py-4">SBD</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Tiến độ</th>
                                <th className="px-6 py-4">Điểm tạm tính</th>
                                <th className="px-6 py-4">Thời gian còn</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Chưa có thí sinh nào tham gia
                                    </td>
                                </tr>
                            ) : (
                                participants.map((p) => (
                                    <tr key={p.uid} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {p.user_name}
                                            <div className="text-xs text-gray-400 font-normal">{p.user_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{p.user_sbd}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${p.status === 'doing' ? 'bg-blue-100 text-blue-700' :
                                                    p.status === 'submitted' ? 'bg-green-100 text-green-700' :
                                                        p.status === 'offline' ? 'bg-gray-100 text-gray-500' :
                                                            'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {p.status === 'doing' ? 'Đang làm bài' :
                                                    p.status === 'submitted' ? 'Đã nộp' :
                                                        p.status === 'offline' ? 'Mất kết nối' : 'Đã vào'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {p.answers_count || 0}/{p.total_questions || 0} câu
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-600">
                                            {p.score !== undefined ? p.score.toFixed(1) : '--'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {p.time_left ? `${Math.floor(p.time_left / 60)}p ${p.time_left % 60}s` : '--'}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleForceSubmit(p.uid, p.user_name)}
                                                title="Buộc nộp bài"
                                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                                            >
                                                <FaCheckDouble />
                                            </button>
                                            <button
                                                onClick={() => handleKickUser(p.uid, p.user_name)}
                                                title="Mời ra khỏi phòng"
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <FaUserSlash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExamRoomDetailScreen;
