import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    FaArrowLeft, FaSchool, FaPaperPlane, FaUserTie, FaPlus, 
    FaGraduationCap, FaTrash, FaUsers, FaThLarge, FaList, 
    FaSearch, FaUserPlus, FaFileImport, FaHistory,
    FaEdit, FaCheckCircle, FaLaptop, FaWifi, FaFileExcel,
    FaSync, FaTimes, FaChevronLeft, FaChevronRight, FaKey
} from 'react-icons/fa';
import { TbPlaneOff } from 'react-icons/tb';
import { Course, UserProfile } from '../../types';
import { db } from '../../services/firebaseClient';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { toast } from 'sonner';

interface UserData extends UserProfile {
    uid: string;
}

interface ClassDetailProps {
    selectedCourse: Course | null;
    studentList: UserData[];
    loadingStudents: boolean;
    studentSearchTerm: string;
    setStudentSearchTerm: (s: string) => void;
    studentSortKey: 'fullName' | 'createdAt' | 'birthDate' | 'recentExam' | 'time' | 'score';
    setStudentSortKey: (s: 'fullName' | 'createdAt' | 'birthDate' | 'recentExam' | 'time' | 'score') => void;
    studentSortOrder: 'asc' | 'desc';
    setStudentSortOrder: (s: 'asc' | 'desc') => void;
    studentFilterRole: 'all' | 'hoc_vien' | 'giao_vien';
    setStudentFilterRole: (s: 'all' | 'hoc_vien' | 'giao_vien') => void;
    currentPage: number;
    setCurrentPage: (n: number) => void;
    itemsPerPage: number;
    setItemsPerPage: (n: number) => void;
    totalPages: number;
    paginatedStudents: UserData[];
    viewMode: 'grid' | 'list';
    setViewMode: (m: 'grid' | 'list') => void;
    onBack: () => void;
    onAddStudent: () => void;
    onImportExcel: () => void;
    onManualCreate: () => void;
    onEditStudent: (s: UserData) => void;
    onDeleteStudent: (id: string) => void;
    onViewHistory: (s: UserData) => void;
    onViewSessions: (s: UserData) => void;
    userProfile: UserProfile | null;
    teachers: UserData[];
    onAddTeacher: () => void;
    onRemoveTeacher: (id: string) => void;
    onSendBulkNotification: () => void;
    studentLatestResults: Record<string, any>;
    deviceCounts: Record<string, number>;
}

const ClassDetail: React.FC<ClassDetailProps> = ({
    selectedCourse,
    studentList,
    loadingStudents,
    studentSearchTerm,
    setStudentSearchTerm,
    studentSortKey,
    setStudentSortKey,
    studentSortOrder,
    setStudentSortOrder,
    studentFilterRole,
    setStudentFilterRole,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedStudents,
    viewMode,
    setViewMode,
    onBack,
    onAddStudent,
    onImportExcel,
    onManualCreate,
    onEditStudent,
    onDeleteStudent,
    onViewHistory,
    onViewSessions,
    userProfile,
    teachers,
    onAddTeacher,
    onRemoveTeacher,
    onSendBulkNotification,
    studentLatestResults,
    deviceCounts
}) => {
    // Local selection state for bulk actions
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [isProcessingBulk, setIsProcessingBulk] = useState(false);
    const [showBulkNotifModal, setShowBulkNotifModal] = useState(false);
    const [bulkNotifType, setBulkNotifType] = useState<'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention'>('personal');
    const [bulkNotifTitle, setBulkNotifTitle] = useState('');
    const [bulkNotifMessage, setBulkNotifMessage] = useState('');
    const [isSendingBulkNotif, setIsSendingBulkNotif] = useState(false);

    if (!selectedCourse) return null;

    const canManage = userProfile?.role === 'admin' || (userProfile?.role as string) === 'super_admin';

    const toggleSelectUser = (uid: string) => {
        const next = new Set(selectedUsers);
        if (next.has(uid)) next.delete(uid);
        else next.add(uid);
        setSelectedUsers(next);
    };

    const toggleSelectAll = () => {
        if (selectedUsers.size === paginatedStudents.length && paginatedStudents.length > 0) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(paginatedStudents.map(s => s.uid)));
        }
    };

    const handleBulkToggleOffline = async (enable: boolean) => {
        if (selectedUsers.size === 0) return;
        setIsProcessingBulk(true);
        try {
            const batch = writeBatch(db);
            selectedUsers.forEach(uid => {
                batch.update(doc(db, 'users', uid), { offlineAccess: enable });
            });
            await batch.commit();
            toast.success(`${enable ? 'Đã bật' : 'Đã tắt'} quyền Offline cho ${selectedUsers.size} học viên`);
            setSelectedUsers(new Set());
        } catch (e) {
            console.error("Error bulk toggling offline access:", e);
            toast.error("Lỗi khi cập nhật quyền Offline hàng loạt");
        } finally {
            setIsProcessingBulk(false);
        }
    };

    const handleBulkSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUsers.size === 0 || !bulkNotifTitle || !bulkNotifMessage) return;

        setIsSendingBulkNotif(true);
        try {
            // This would typically call a cloud function or API endpoint
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast.success(`Đã gửi thông báo tới ${selectedUsers.size} học viên`);
            setShowBulkNotifModal(false);
            setBulkNotifTitle('');
            setBulkNotifMessage('');
            setSelectedUsers(new Set());
        } catch (error) {
            console.error("Error sending bulk notification:", error);
            toast.error("Lỗi khi gửi thông báo hàng loạt");
        } finally {
            setIsSendingBulkNotif(false);
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin': return 'Quản trị viên';
            case 'giao_vien': return 'Giáo viên';
            case 'hoc_vien': return 'Học viên';
            default: return role;
        }
    };

    const getSortIcon = (key: string) => {
        if (studentSortKey !== key) return null;
        return studentSortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right relative">
            {/* HEADER DETAIL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors font-medium">
                        <FaArrowLeft /> Quay lại danh sách
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FaSchool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                {selectedCourse.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{selectedCourse.description}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onSendBulkNotification} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center gap-2 font-medium">
                        <FaPaperPlane /> Thông báo cả lớp
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* TEACHERS COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 sticky top-20">
                        <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-slate-700 mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
                                <FaUserTie className="text-green-500" /> Giáo viên
                            </h3>
                            {canManage && <button onClick={onAddTeacher} className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition-colors"><FaPlus size={14} /></button>}
                        </div>

                        <div className="space-y-3">
                            {teachers.map(t => (
                                <div key={t.uid} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group relative cursor-pointer">
                                    <div className="relative">
                                        <img
                                            src={t.fullName ? (t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}`) : (t.photoURL || `https://ui-avatars.com/api/?name=User`)}
                                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName || 'User')}`; }}
                                            className="w-10 h-10 rounded-full border border-gray-200"
                                        />
                                        {selectedCourse.headTeacherId === t.uid && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 border-2 border-white"><FaGraduationCap size={10} /></div>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{t.fullName}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{getRoleDisplayName(t.role)}</p>
                                        {selectedCourse.headTeacherId === t.uid && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 mt-1 inline-block">GVCN</span>}
                                    </div>

                                    {canManage && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemoveTeacher(t.uid); }}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all absolute right-2"
                                            title="Xóa giáo viên"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Chưa có giáo viên.</p>}
                        </div>
                    </div>
                </div>

                {/* STUDENTS COLUMN */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 min-h-[500px]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-700 gap-4">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white">
                                    <FaUsers className="text-blue-500" /> Học viên ({studentList.length})
                                </h3>
                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 ml-4">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                                        title="Dạng lưới"
                                    >
                                        <FaThLarge />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                                        title="Dạng danh sách"
                                    >
                                        <FaList />
                                    </button>
                                </div>
                            </div>

                            {canManage && (
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={onImportExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 hover:shadow-lg transition flex items-center gap-2 text-sm font-medium">
                                        <FaFileExcel /> Import Excel
                                    </button>
                                    <button onClick={onManualCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 hover:shadow-lg transition flex items-center gap-2 text-sm font-medium">
                                        <FaUserPlus /> Thêm thủ công
                                    </button>
                                    <button onClick={onAddStudent} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition flex items-center gap-2 text-sm font-medium">
                                        <FaPlus /> Thêm Học Viên (Có sẵn)
                                    </button>
                                </div>
                            )}
                        </div>

                        {loadingStudents ? (
                            <div className="flex justify-center py-20"><FaSync className="animate-spin text-blue-500 w-10 h-10" /></div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {paginatedStudents.map(s => {
                                    const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                    return (
                                        <div key={s.uid} className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>

                                            <div className="flex items-start gap-4 relative z-10">
                                                <div className="relative">
                                                    <img
                                                        src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || s.full_name || 'Học viên')}&background=random`}
                                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || s.full_name || 'Học viên')}&background=random`; }}
                                                        alt={s.fullName || s.full_name}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm group-hover:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors text-base flex items-center gap-1">
                                                        {s.fullName || s.full_name || 'Học viên'}
                                                        {(s.isVerified || s.courseId) && <FaCheckCircle className="text-green-500 text-xs shrink-0" />}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">{s.email}</p>

                                                    {/* Mini Result in Card */}
                                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-600 text-xs">
                                                        <div className="flex justify-between text-gray-500">
                                                            <span>Kết quả mới:</span>
                                                            <span className="font-bold text-teal-600">{result.score}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => onViewSessions(s)}
                                                            className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${(deviceCounts[s.uid || s.id] || deviceCounts[s.id]) > 0 ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50'}`}
                                                            title={`Thiết bị: ${(deviceCounts[s.uid || s.id] || deviceCounts[s.id]) || 0}`}
                                                        >
                                                            <FaLaptop /> {(deviceCounts[s.uid || s.id] || deviceCounts[s.id]) || 0}
                                                        </button>
                                                        {/* <button onClick={() => handleOpenNotifModal('user', s.uid || s.id, s.fullName || s.full_name)} className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 p-1.5 rounded text-xs flex items-center gap-1" title="Nhắn tin">
                                                            <FaPaperPlane />
                                                        </button> */}

                                                        <button onClick={() => onEditStudent(s)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded text-xs flex items-center gap-1" title="Sửa thông tin">
                                                            <FaEdit />
                                                        </button>
                                                        {/* {canManageStudents && (
                                                            <button onClick={() => handleResetPassword(s.uid, s.fullName)} className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 p-1.5 rounded text-xs flex items-center gap-1" title="Reset Mật khẩu">
                                                                <FaKey />
                                                            </button>
                                                        )} */}

                                                        <button onClick={() => onViewHistory(s)} className="text-purple-600 bg-purple-50 hover:bg-purple-100 p-1.5 rounded text-xs flex items-center gap-1" title="Xem lịch sử">
                                                            <FaHistory />
                                                        </button>

                                                        {canManage && (
                                                            <button onClick={() => onDeleteStudent(s.uid)} className="text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded text-xs flex items-center gap-1" title="Xóa">
                                                                <FaTrash />
                                                            </button>
                                                        )}

                                                        {/* <button
                                                            onClick={() => toggleOfflineAccess(s.uid, !!(s as any).offlineAccess)}
                                                            className={`p-1.5 rounded text-xs flex items-center gap-1 transition ${(s as any).offlineAccess ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                                                            title={(s as any).offlineAccess ? "Đã bật Offline" : "Chưa bật Offline"}
                                                        >
                                                            {(s as any).offlineAccess ? <FaWifi /> : <TbPlaneOff />}
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300 select-none">
                                        <tr>
                                            <th className="px-2 py-3 w-10">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                    checked={selectedUsers.size === paginatedStudents.length && paginatedStudents.length > 0}
                                                    onChange={toggleSelectAll}
                                                    title="Chọn tất cả"
                                                />
                                            </th>
                                            <th onClick={() => setStudentSortKey('fullName')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Học viên {getSortIcon('fullName')}</div>
                                            </th>
                                            <th onClick={() => setStudentSortKey('birthDate')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Ngày sinh {getSortIcon('birthDate')}</div>
                                            </th>
                                            <th onClick={() => setStudentSortKey('recentExam')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Bài làm gần nhất {getSortIcon('recentExam')}</div>
                                            </th>
                                            <th onClick={() => setStudentSortKey('time')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Thời gian {getSortIcon('time')}</div>
                                            </th>
                                            <th onClick={() => setStudentSortKey('score')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Điểm {getSortIcon('score')}</div>
                                            </th>
                                            <th className="px-4 py-3 text-center">Thiết bị</th>
                                            <th className="px-4 py-3 text-center rounded-r-lg">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {paginatedStudents.map(s => {
                                            const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                            const devCount = deviceCounts[s.uid] || 0;
                                            return (
                                                <tr key={s.uid} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-2 py-3 w-10">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                            checked={selectedUsers.has(s.uid)}
                                                            onChange={() => toggleSelectUser(s.uid)}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={s.fullName ? (s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`) : (s.photoURL || `https://ui-avatars.com/api/?name=User`)}
                                                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName || 'User')}`; }}
                                                                className="w-8 h-8 rounded-full border border-gray-100"
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[150px]">{s.fullName}</p>
                                                                <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{s.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                                                        {s.birthDate || '--/--/----'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{result.type}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                                        {result.time}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-bold text-blue-600 dark:text-blue-400">{result.score}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => onViewSessions(s)}
                                                            className={`flex items-center gap-1 mx-auto px-2 py-1 rounded-full text-[10px] font-bold transition-all ${devCount > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400'}`}
                                                        >
                                                            <FaLaptop size={10} /> {devCount}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center gap-1">
                                                            {/* <button onClick={() => handleOpenNotifModal('user', s.uid, s.fullName)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition" title="Nhắn tin"><FaPaperPlane size={12} /></button> */}
                                                            <button onClick={() => onEditStudent(s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Sửa"><FaEdit size={12} /></button>
                                                            <button onClick={() => onViewHistory(s)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition" title="Lịch sử"><FaHistory size={12} /></button>

                                                            {canManage && (
                                                                <button onClick={() => onDeleteStudent(s.uid)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition" title="Xóa"><FaTrash size={12} /></button>
                                                            )}
                                                            {/* <button
                                                                onClick={() => toggleOfflineAccess(s.uid, !!(s as any).offlineAccess)}
                                                                className={`p-1.5 rounded transition ${(s as any).offlineAccess ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                                                title={(s as any).offlineAccess ? "Đã bật Offline" : "Chưa bật Offline"}
                                                            >
                                                                {(s as any).offlineAccess ? <FaWifi size={12} /> : <TbPlaneOff size={12} />}
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Bulk Action Bar */}
                        {selectedUsers.size > 0 && (
                            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-2 border border-gray-200 dark:border-slate-700 flex-wrap justify-center max-w-[95vw]">
                                <span className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    Đã chọn <span className="text-blue-600 font-bold">{selectedUsers.size}</span>
                                </span>

                                <button
                                    onClick={() => handleBulkToggleOffline(true)}
                                    disabled={isProcessingBulk}
                                    className="bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition flex items-center gap-1 text-sm disabled:opacity-50"
                                    title="Bật Offline"
                                >
                                    <FaWifi />
                                </button>
                                <button
                                    onClick={() => handleBulkToggleOffline(false)}
                                    disabled={isProcessingBulk}
                                    className="bg-gray-500 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition flex items-center gap-1 text-sm disabled:opacity-50"
                                    title="Tắt Offline"
                                >
                                    <TbPlaneOff />
                                </button>

                                <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1" />

                                {canManage && (
                                    <button
                                        // onClick={handleBulkResetPassword} // This action is not implemented in the new snippet
                                        disabled={isProcessingBulk}
                                        className="bg-yellow-500 text-white px-3 py-1.5 rounded-full hover:bg-yellow-600 transition flex items-center gap-1 text-sm disabled:opacity-50"
                                        title="Reset mật khẩu"
                                    >
                                        <FaKey /> Reset
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowBulkNotifModal(true)}
                                    className="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                                    title="Gửi thông báo"
                                >
                                    <FaPaperPlane /> Thông báo
                                </button>

                                {canManage && (
                                    <button
                                        // onClick={handleBulkRemoveFromClass} // This action is not implemented in the new snippet
                                        disabled={isProcessingBulk}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition flex items-center gap-1 text-sm disabled:opacity-50"
                                        title="Xóa khỏi lớp"
                                    >
                                        <FaTrash /> Xóa
                                    </button>
                                )}

                                <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1" />

                                <button
                                    onClick={() => setSelectedUsers(new Set())}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                                    title="Bỏ chọn tất cả"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}

                        {/* Bulk Notification Modal */}
                        {showBulkNotifModal && createPortal(
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                        <FaPaperPlane className="text-blue-500" />
                                        Gửi thông báo cho {selectedUsers.size} học viên
                                    </h2>
                                    <form onSubmit={handleBulkSendNotification} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Loại thông báo</label>
                                            <select
                                                className="w-full p-2 border rounded dark:bg-slate-700"
                                                value={bulkNotifType}
                                                onChange={e => setBulkNotifType(e.target.value as any)}
                                            >
                                                <option value="personal">Cá nhân</option>
                                                <option value="reminder">Nhắc nhở</option>
                                                <option value="special">Đặc biệt</option>
                                                <option value="attention">Chú ý</option>
                                            </select>
                                        </div>
                                        <input
                                            className="w-full p-2 border rounded dark:bg-slate-700"
                                            placeholder="Tiêu đề thông báo"
                                            value={bulkNotifTitle}
                                            onChange={e => setBulkNotifTitle(e.target.value)}
                                            required
                                        />
                                        <textarea
                                            className="w-full p-2 border rounded dark:bg-slate-700 min-h-[100px]"
                                            placeholder="Nội dung thông báo..."
                                            value={bulkNotifMessage}
                                            onChange={e => setBulkNotifMessage(e.target.value)}
                                            required
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowBulkNotifModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Hủy</button>
                                            <button type="submit" disabled={isSendingBulkNotif} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                                                {isSendingBulkNotif ? 'Đang gửi...' : <><FaPaperPlane /> Gửi</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>,
                            document.body
                        )}

                        {/* PAGINATION */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                            <p className="text-sm text-gray-500">
                                Hiển thị <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold">{Math.min(currentPage * itemsPerPage, studentList.length)}</span> trong <span className="font-bold">{studentList.length}</span> học viên
                            </p>
                            <div className="flex items-center gap-2">
                                <select
                                    className="border border-gray-300 dark:border-slate-600 rounded-md text-sm p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value={5}>5 / trang</option>
                                    <option value={10}>10 / trang</option>
                                    <option value={12}>12 / trang</option>
                                    <option value={20}>20 / trang</option>
                                    <option value={50}>50 / trang</option>
                                </select>
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border rounded-lg hover:bg-gray-50 dark:bg-slate-700 disabled:opacity-30 transition-all font-bold"
                                >
                                    <FaChevronLeft size={14} />
                                </button>
                                <div className="flex gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold shrink-0 transition-all ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border rounded-lg hover:bg-gray-50 dark:bg-slate-700 disabled:opacity-30 transition-all font-bold"
                                >
                                    <FaChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetail;
