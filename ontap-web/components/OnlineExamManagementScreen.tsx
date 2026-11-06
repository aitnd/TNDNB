import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseClient';
import { collection, addDoc, query, orderBy, serverTimestamp, getDocs, where } from 'firebase/firestore'; 
import { toast } from 'sonner';
import { FaPlus, FaEye, FaArrowLeft, FaLaptopCode } from 'react-icons/fa';
import ExamRoomDetailScreen from './ExamRoomDetailScreen';
import { UserProfile } from '../types';

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
    duration: number;
    created_at: any;
    password?: string;
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
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    // Mock Data for Licenses
    const [licenses, setLicenses] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    useEffect(() => {
        fetchRooms();
        import('../services/dataService').then(({ fetchLicenses }) => {
            fetchLicenses().then(setLicenses);
        });

        const fetchCourses = async () => {
            const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        };
        fetchCourses();
    }, []);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            let q;
            if (['admin', 'quan_ly', 'lanh_dao'].includes(userProfile?.role || '')) {
                q = query(collection(db, 'exam_rooms'), orderBy('created_at', 'desc'));
            } else {
                q = query(collection(db, 'exam_rooms'), where('teacher_id', '==', userProfile.id), orderBy('created_at', 'desc'));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any } as ExamRoom));
            setRooms(data);
        } catch (error: any) {
            console.error("Error fetching rooms:", error);
            if (error?.code === 'permission-denied') {
                toast.error("Bạn không có quyền truy cập danh sách phòng thi.");
            } else if (error?.message?.includes('index')) {
                toast.warning("Hệ thống đang khởi tạo dữ liệu (Tạo Index). Vui lòng đợi 1-2 phút rồi tải lại trang.");
            } else {
                toast.error("Không thể tải danh sách phòng thi. Vui lòng kiểm tra kết nối.");
            }
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
        const selectedCourse = courses.find(c => c.id === selectedCourseId);

        try {
            await addDoc(collection(db, 'exam_rooms'), {
                room_name: roomName,
                license_id: selectedLicenseId,
                license_name: selectedLicense?.name || '',
                course_id: selectedCourseId || null,
                course_name: selectedCourse?.name || null,
                teacher_id: userProfile.id,
                teacher_name: userProfile.fullName,
                status: 'waiting',
                duration: Number(duration),
                password: password || null,
                created_at: serverTimestamp()
            });

            toast.success("Tạo phòng thi thành công!");
            setShowCreateModal(false);
            setRoomName('');
            setPassword('');
            fetchRooms();
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Không thể tạo phòng thi.");
        }
    };

    if (selectedRoomId) {
        return (
            <ExamRoomDetailScreen 
                roomId={selectedRoomId} 
                onBack={() => {
                    setSelectedRoomId(null);
                    fetchRooms();
                }} 
            />
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-24 pt-20 tabular-nums">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors font-medium min-h-[44px]"
                    >
                        <FaArrowLeft /> Quay lại Dashboard
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2.5">
                        <FaLaptopCode className="text-primary" /> Quản lý Thi Trực Tuyến
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 flex items-center gap-2 min-h-[44px] transition shadow-sm"
                    >
                        <FaPlus /> Tạo Phòng Thi
                    </button>
                </div>
            </div>

            {/* Room List */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Tên Phòng</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Hạng Bằng</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Giáo Viên</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Trạng Thái</th>
                                <th className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Đang tải dữ liệu phòng thi...</td></tr>
                            ) : rooms.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground font-medium">Chưa có phòng thi nào.</td></tr>
                            ) : (
                                rooms.map(room => (
                                    <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-5 py-4 whitespace-nowrap font-bold text-foreground text-sm">{room.room_name}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-muted-foreground">{room.license_name}</td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground font-medium">{room.teacher_name}</td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full border
                                                ${room.status === 'waiting' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                                                    room.status === 'in_progress' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                                                        'bg-muted text-muted-foreground border-border'}`}>
                                                {room.status === 'waiting' ? 'Đang chờ' :
                                                    room.status === 'in_progress' ? 'Đang thi' : 'Kết thúc'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedRoomId(room.id)}
                                                className="text-primary hover:underline flex items-center gap-1.5 font-bold min-h-[44px]"
                                            >
                                                <FaEye /> Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-card text-card-foreground p-6 rounded-2xl w-full max-w-md border border-border shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-foreground">Tạo Phòng Thi Mới</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Tên phòng thi</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={e => setRoomName(e.target.value)}
                                    className="w-full border border-border rounded-xl bg-card text-foreground p-2.5 outline-none focus:ring-2 focus:ring-primary transition"
                                    placeholder="Ví dụ: Thi thử M1 - Lần 1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Hạng bằng</label>
                                <select
                                    value={selectedLicenseId}
                                    onChange={e => setSelectedLicenseId(e.target.value)}
                                    className="w-full border border-border rounded-xl bg-card text-foreground p-2.5 outline-none focus:ring-2 focus:ring-primary transition"
                                    required
                                >
                                    <option value="">-- Chọn hạng bằng --</option>
                                    {licenses.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Lớp (Tùy chọn - Để tự động vào phòng)</label>
                                <select
                                    value={selectedCourseId}
                                    onChange={e => setSelectedCourseId(e.target.value)}
                                    className="w-full border border-border rounded-xl bg-card text-foreground p-2.5 outline-none focus:ring-2 focus:ring-primary transition"
                                >
                                    <option value="">-- Không chọn lớp --</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Thời gian làm bài (phút)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={e => setDuration(Number(e.target.value))}
                                    className="w-full border border-border rounded-xl bg-card text-foreground p-2.5 tabular-nums outline-none focus:ring-2 focus:ring-primary transition"
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-1">Mật khẩu (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full border border-border rounded-xl bg-card text-foreground p-2.5 outline-none focus:ring-2 focus:ring-primary transition"
                                    placeholder="Để trống nếu không cần mật khẩu"
                                />
                            </div>
                            <div className="flex justify-end gap-2.5 mt-6 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2.5 bg-card border border-border text-foreground rounded-xl hover:bg-muted font-semibold min-h-[44px] transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 font-semibold min-h-[44px] transition"
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
