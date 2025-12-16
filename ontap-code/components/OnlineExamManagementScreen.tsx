import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebaseClient';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile, License } from '../types';
import { toast } from 'sonner';
import { FaPlus, FaTrash, FaPlay, FaPause, FaStop, FaEye, FaEdit } from 'react-icons/fa';

interface OnlineExamManagementScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}

interface ExamRoom {
    id: string;
    room_name: string;
    license_id: string;
    license_name: string;
    course_id?: string;
    course_name?: string;
    teacher_id: string;
    teacher_name: string;
    status: 'waiting' | 'in_progress' | 'finished';
    duration: number; // minutes
    created_at: any;
    password?: string;
    is_paused?: boolean;
}

const OnlineExamManagementScreen: React.FC<OnlineExamManagementScreenProps> = ({ userProfile, onBack }) => {
    const [rooms, setRooms] = useState<ExamRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form State
    const [roomName, setRoomName] = useState('');
    const [duration, setDuration] = useState(45);
    const [password, setPassword] = useState('');
    const [selectedLicenseId, setSelectedLicenseId] = useState('');

    // Mock Data for Licenses (Should fetch from store or API)
    const [licenses, setLicenses] = useState<any[]>([]);

    useEffect(() => {
        fetchRooms();
        // Fetch licenses if needed, or pass from props
        // For now, we'll assume some basic licenses or fetch them
        import('../services/dataService').then(({ fetchLicenses }) => {
            fetchLicenses().then(setLicenses);
        });
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            // Admin sees all, Teacher sees their own
            let q;
            if (['admin', 'quan_ly', 'lanh_dao'].includes(userProfile.role)) {
                q = query(collection(db, 'exam_rooms'), orderBy('created_at', 'desc'));
            } else {
                q = query(collection(db, 'exam_rooms'), where('teacher_id', '==', userProfile.id), orderBy('created_at', 'desc'));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamRoom));
            setRooms(data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            toast.error("Lỗi tải danh sách phòng thi.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName || !selectedLicenseId) {
            toast.error("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const selectedLicense = licenses.find(l => l.id === selectedLicenseId);

        try {
            await addDoc(collection(db, 'exam_rooms'), {
                room_name: roomName,
                license_id: selectedLicenseId,
                license_name: selectedLicense?.name || 'Unknown',
                teacher_id: userProfile.id,
                teacher_name: userProfile.full_name,
                status: 'waiting',
                duration: Number(duration),
                password: password || null,
                created_at: serverTimestamp(),
                is_paused: false
            });
            toast.success("Tạo phòng thi thành công!");
            setShowCreateModal(false);
            setRoomName('');
            setPassword('');
            fetchRooms();
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tạo phòng.");
        }
    };

    const handleUpdateStatus = async (roomId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'exam_rooms', roomId), { status: newStatus });
            toast.success(`Đã chuyển trạng thái sang ${newStatus}`);
            fetchRooms();
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái.");
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phòng thi này?")) return;
        try {
            await deleteDoc(doc(db, 'exam_rooms', roomId));
            toast.success("Đã xóa phòng thi.");
            setRooms(prev => prev.filter(r => r.id !== roomId));
        } catch (error) {
            toast.error("Lỗi khi xóa.");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto font-sans text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800">Quản lý Thi Trực Tuyến</h1>
                <div className="flex gap-2">
                    <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Quay lại</button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        <FaPlus /> Tạo Phòng Thi
                    </button>
                </div>
            </div>

            {/* Room List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Phòng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạng Bằng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giáo Viên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
                        ) : rooms.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-4 text-gray-500">Chưa có phòng thi nào.</td></tr>
                        ) : (
                            rooms.map(room => (
                                <tr key={room.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{room.room_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.license_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{room.teacher_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${room.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                                room.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {room.status === 'waiting' ? 'Đang chờ' :
                                                room.status === 'in_progress' ? 'Đang thi' : 'Kết thúc'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                        {room.status === 'waiting' && (
                                            <button onClick={() => handleUpdateStatus(room.id, 'in_progress')} className="text-green-600 hover:text-green-900" title="Bắt đầu"><FaPlay /></button>
                                        )}
                                        {room.status === 'in_progress' && (
                                            <button onClick={() => handleUpdateStatus(room.id, 'finished')} className="text-red-600 hover:text-red-900" title="Kết thúc"><FaStop /></button>
                                        )}
                                        <button onClick={() => handleDeleteRoom(room.id)} className="text-gray-600 hover:text-red-600" title="Xóa"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Tạo Phòng Thi Mới</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên phòng thi</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={e => setRoomName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="Ví dụ: Thi thử M1 - Lần 1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hạng bằng</label>
                                <select
                                    value={selectedLicenseId}
                                    onChange={e => setSelectedLicenseId(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                >
                                    <option value="">-- Chọn hạng bằng --</option>
                                    {licenses.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thời gian làm bài (phút)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={e => setDuration(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="Để trống nếu không cần mật khẩu"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Tạo phòng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineExamManagementScreen;
