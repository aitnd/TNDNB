import React, { useState } from 'react';
import { 
    FaTimes, FaSearch, FaClock, FaUserClock, FaExclamationCircle
} from 'react-icons/fa';
import { Course } from '../../../types';

// --- SHARED WRAPPER ---
export const ModalWrapper: React.FC<{ 
    title: string; 
    onClose: () => void; 
    children: React.ReactNode; 
    maxWidth?: string 
}> = ({ title, onClose, children, maxWidth = 'max-w-2xl' }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in text-slate-900 dark:text-slate-100" onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
    }}>
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden transform animate-scale-in`}>
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    {title}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500">
                    <FaTimes />
                </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
                {children}
            </div>
        </div>
    </div>
);

// --- ADD TEACHER MODAL ---
export const AddTeacherModal: React.FC<{ 
    teachers: any[]; 
    onClose: () => void; 
    onAdd: (id: string) => void; 
    loading: boolean 
}> = ({ teachers, onClose, onAdd, loading }) => {
    const [search, setSearch] = useState('');
    const filtered = teachers.filter(t => (t.fullName || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <ModalWrapper title="Gán Giáo Viên" onClose={onClose}>
            <div className="mb-4 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm giáo viên..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="py-10 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {filtered.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                            <div className="flex items-center gap-3">
                                <img src={t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}`} className="w-10 h-10 rounded-full" loading="lazy" alt="" />
                                <div>
                                    <p className="font-bold dark:text-white">{t.fullName}</p>
                                    <p className="text-xs text-gray-500">{t.email}</p>
                                </div>
                            </div>
                            <button onClick={() => onAdd(t.id)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition">Thêm</button>
                        </div>
                    ))}
                    {filtered.length === 0 && <p className="text-center py-4 text-gray-500">Không tìm thấy giáo viên nào.</p>}
                </div>
            )}
        </ModalWrapper>
    );
};

// --- ADD STUDENT MODAL ---
export const AddStudentModal: React.FC<{ 
    students: any[]; 
    onClose: () => void; 
    onAdd: (id: string) => void; 
    loading: boolean 
}> = ({ students, onClose, onAdd, loading }) => {
    const [search, setSearch] = useState('');
    const filtered = students.filter(s => (s.fullName || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <ModalWrapper title="Thêm Học Viên Có Sẵn" onClose={onClose}>
            <div className="mb-4 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm học viên..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="py-10 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {filtered.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                            <div className="flex items-center gap-3">
                                <img src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`} className="w-10 h-10 rounded-full" loading="lazy" alt="" />
                                <div>
                                    <p className="font-bold dark:text-white">{s.fullName}</p>
                                    <p className="text-xs text-gray-500">{s.email || 'No email'}</p>
                                </div>
                            </div>
                            <button onClick={() => onAdd(s.id)} className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-teal-700 transition">Thêm vào lớp</button>
                        </div>
                    ))}
                    {filtered.length === 0 && <p className="text-center py-4 text-gray-500">Không có học viên nào không thuộc lớp khác.</p>}
                </div>
            )}
        </ModalWrapper>
    );
};

// --- HISTORY MODAL ---
export const HistoryModal: React.FC<{ 
    student: any; 
    history: any[]; 
    loading: boolean; 
    onClose: () => void 
}> = ({ student, history, loading, onClose }) => (
    <ModalWrapper title={`Lịch sử làm bài - ${student?.fullName}`} onClose={onClose} maxWidth="max-w-3xl">
        {loading ? (
            <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
        ) : (
            <div className="space-y-3">
                {history.map((h, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-100 dark:border-slate-600 flex justify-between items-center text-slate-900 dark:text-slate-100">
                        <div>
                            <p className="font-bold text-blue-600 dark:text-blue-400">{h.quizTitle || 'Bài kiểm tra'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <FaClock /> {h.completedAt?.toLocaleString('vi-VN') || '--'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-gray-800 dark:text-white">{h.score}/{h.totalQuestions}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${h.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {h.isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                            </span>
                        </div>
                    </div>
                ))}
                {history.length === 0 && <p className="text-center py-10 text-gray-500">Chưa tìm thấy lịch sử bài làm nào.</p>}
            </div>
        )}
    </ModalWrapper>
);

// --- SESSION MODAL ---
export const SessionModal: React.FC<{ 
    student: any; 
    sessions: any[]; 
    loading: boolean; 
    onClose: () => void 
}> = ({ student, sessions, loading, onClose }) => (
    <ModalWrapper title={`Lịch sử truy cập - ${student?.fullName}`} onClose={onClose}>
        {loading ? (
            <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>
        ) : (
            <div className="space-y-3 text-slate-900 dark:text-slate-100">
                {sessions.map((s, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FaUserClock className="text-teal-500" />
                            <div>
                                <p className="text-sm font-medium dark:text-white">{s.device || 'Thiết bị không xác định'}</p>
                                <p className="text-[10px] text-gray-500">{s.lastActive?.toDate().toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-mono uppercase">
                            {s.browser || 'Browser'}
                        </span>
                    </div>
                ))}
                {sessions.length === 0 && <p className="text-center py-10 text-gray-500">Không có dữ liệu phiên truy cập.</p>}
            </div>
        )}
    </ModalWrapper>
);

// --- EDIT STUDENT MODAL ---
export const EditStudentModal: React.FC<{ 
    student: any; 
    onClose: () => void; 
    onSave: (id: string, data: any) => void | Promise<void> 
}> = ({ student, onClose, onSave }) => {
    const [name, setName] = useState(student?.fullName || '');
    const [email] = useState(student?.email || '');
    const [phone, setPhone] = useState(student?.phoneNumber || '');
    const [birthDate, setBirthDate] = useState(student?.birthDate || '');
    const [isVerified, setIsVerified] = useState(!!student?.isVerified);

    return (
        <ModalWrapper title="Chỉnh sửa thông tin Học viên" onClose={onClose}>
            <div className="space-y-4 text-slate-900 dark:text-slate-100">
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Họ và Tên</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Email (Đăng nhập)</label>
                    <input type="email" value={email} className="w-full p-2 border rounded bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed" disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Số điện thoại</label>
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="0xxx..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Ngày sinh</label>
                        <input type="text" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="DD/MM/YYYY" />
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="verify-chk" checked={isVerified} onChange={e => setIsVerified(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <label htmlFor="verify-chk" className="text-sm font-bold dark:text-gray-300">Đã xác minh tài khoản</label>
                </div>
                <button 
                    onClick={() => onSave(student.id, { fullName: name, phone, phoneNumber: phone, birthDate, isVerified })} 
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold mt-4 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                    Lưu Thay Đổi
                </button>
            </div>
        </ModalWrapper>
    );
};

// --- ADD EDIT COURSE MODAL ---
export const AddEditCourseModal: React.FC<{ 
    course: Course | null; 
    licenses: any[]; 
    onClose: () => void; 
    onSave: (data: any) => void 
}> = ({ course, licenses, onClose, onSave }) => {
    const [name, setName] = useState(course?.name || '');
    const [desc, setDesc] = useState(course?.description || '');
    const [licenseId, setLicenseId] = useState(course?.licenseId || '');

    return (
        <ModalWrapper title={course ? "Chỉnh sửa Lớp học" : "Tạo Lớp học mới"} onClose={onClose}>
            <div className="space-y-4 text-slate-900 dark:text-slate-100">
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Tên lớp học</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Vd: Lớp B2-2024A" />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Mô tả</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white h-24" placeholder="Thông tin về lịch học, địa điểm..." />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Hạng bằng</label>
                    <select value={licenseId} onChange={e => setLicenseId(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">-- Chọn hạng bằng --</option>
                        {licenses.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={() => onSave({ name, description: desc, licenseId })} 
                    className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-bold mt-4 hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all"
                >
                    {course ? 'Cập Nhật' : 'Tạo Lớp'}
                </button>
            </div>
        </ModalWrapper>
    );
};

// --- BULK NOTIFICATION MODAL ---
export const BulkNotificationModal: React.FC<{ 
    course: Course; 
    onClose: () => void; 
    onSend: (data: { title: string; message: string; type: string }) => void;
    loading: boolean;
    recipientCount: number;
}> = ({ course, onClose, onSend, loading, recipientCount }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('reminder');

    return (
        <ModalWrapper title="Gửi Thông Báo Hàng Loạt" onClose={onClose}>
            <div className="space-y-4 text-slate-900 dark:text-slate-100">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300 flex gap-2">
                    <FaExclamationCircle className="shrink-0 mt-0.5" />
                    <p>Thông báo sẽ được gửi đồng loạt tới tất cả <strong>{recipientCount}</strong> học viên trong lớp <strong>{course.name}</strong>.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Tiêu đề</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                        placeholder="Nhập tiêu đề thông báo..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Loại thông báo</label>
                    <select 
                        value={type} 
                        onChange={e => setType(e.target.value)} 
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    >
                        <option value="reminder">Nhắc nhở</option>
                        <option value="urgent">Khẩn cấp</option>
                        <option value="info">Thông tin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1 dark:text-gray-300 text-slate-700">Nội dung</label>
                    <textarea 
                        value={message} 
                        onChange={e => setMessage(e.target.value)} 
                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white h-32" 
                        placeholder="Nhập nội dung thông báo chi tiết..."
                    />
                </div>
                <button 
                    onClick={() => onSend({ title, message, type })} 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold mt-4 hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                    {loading ? 'Đang gửi...' : 'Gửi Thông Báo'}
                </button>
            </div>
        </ModalWrapper>
    );
};
