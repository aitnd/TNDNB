import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { UserProfile } from '../types';
import { db } from '../services/firebaseClient';
import { getDefaultAvatar, uploadAvatar } from '../services/userService';
import { doc, updateDoc, collection, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { FaUser, FaSave, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaArrowLeft, FaCamera, FaSort, FaSortUp, FaSortDown, FaFilter, FaInfoCircle, FaArrowRight, FaTimes, FaKey, FaLock, FaHistory, FaLaptop, FaMobileAlt, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../services/firebaseClient';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

interface AccountScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

// Reuse logic from UserAccountManager
interface UserAccount {
    id: string;
    fullName: string;
    email: string;
    role: string;
    phoneNumber?: string;
    birthDate?: string;
    class?: string;
    courseId?: string;
    courseName?: string;
    cccd?: string;
    cccdDate?: string;
    cccdPlace?: string;
    address?: string;
    createdAt?: any;
    isVerified?: boolean;
    photoURL?: string; // Added for Detail Modal
}

const allRoles = [
    { id: 'admin', name: 'Quản trị viên' },
    { id: 'lanh_dao', name: 'Lãnh đạo' },
    { id: 'quan_ly', name: 'Quản lý' },
    { id: 'giao_vien', name: 'Giáo viên' },
    { id: 'hoc_vien', name: 'Học viên' },
];

const staffRoles = ['giao_vien', 'lanh_dao', 'quan_ly'];

// 💖 COMPONENT PHỤ CHO ADMIN QUẢN LÝ SESSION (MỚI) 💖
const AdminSessionList: React.FC<{ userId: string }> = ({ userId }) => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const { getActiveSessions } = await import('../services/authSessionService');
            const data = await getActiveSessions(userId);
            setSessions(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [userId]);

    const handleLogout = async (sid: string) => {
        if (!confirm('Đăng xuất thiết bị này?')) return;
        try {
            const { logoutRemoteSession } = await import('../services/authSessionService');
            await logoutRemoteSession(sid);
            fetchSessions();
        } catch (e) {
            alert('Lỗi khi đăng xuất.');
        }
    };

    if (loading) return <div className="text-xs text-gray-400 animate-pulse">Đang tải phiên...</div>;
    if (sessions.length === 0) return <div className="text-xs text-gray-400 italic">Không có phiên hoạt động.</div>;

    return (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/30 rounded border border-gray-100 dark:border-slate-600">
                    <div className="flex items-center gap-2">
                        {s.deviceName.toLowerCase().includes('windows') ? <FaLaptop className="text-blue-500 text-xs" /> : <FaMobileAlt className="text-green-500 text-xs" />}
                        <div className="text-[11px]">
                            <div className="font-bold truncate max-w-[120px]">{s.deviceName}</div>
                            <div className="text-gray-400">{s.ip}</div>
                        </div>
                    </div>
                    <button onClick={() => handleLogout(s.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition" title="Đăng xuất thiết bị này">
                        <FaSignOutAlt size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
};

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onBack, onNavigate }) => {
    // --- PERSONAL INFO STATE ---
    const [myInfo, setMyInfo] = useState<UserProfile>(userProfile);
    const [isSavingMyInfo, setIsSavingMyInfo] = useState(false);

    // --- MANAGER STATE ---
    const isManager = userProfile.role !== 'hoc_vien';
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'staff' | 'hoc_vien'>('all');
    const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
    const [filterClass, setFilterClass] = useState<string>('all');

    // Edit Other User Modal
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Detail Modal State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

    // --- PAGINATION & SORTING STATE ---
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof UserAccount>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // --- CHANGE PASSWORD STATE ---
    const [showChangePassModal, setShowChangePassModal] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loadingChangePass, setLoadingChangePass] = useState(false);

    useEffect(() => {
        if (isManager) {
            fetchUsers();
        }
    }, [isManager]);

    // --- HELPER FUNCTIONS ---
    const getFilteredAndSortedUsers = useMemo(() => {
        let result = users;

        // 1. Filter Role
        if (filterRole === 'staff') result = result.filter(u => staffRoles.includes(u.role));
        else if (filterRole === 'hoc_vien') result = result.filter(u => u.role === 'hoc_vien');

        // 1.5 Filter Verified
        if (filterVerified === 'verified') result = result.filter(u => u.isVerified || u.courseId);
        else if (filterVerified === 'unverified') result = result.filter(u => !u.isVerified && !u.courseId);

        // 1.6 Filter Class
        if (filterClass !== 'all') {
            if (filterClass === 'no_class') result = result.filter(u => !u.courseId && !u.courseName);
            else result = result.filter(u => u.courseName === filterClass);
        }

        // 2. Search
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.fullName.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower) ||
                (u.phoneNumber && u.phoneNumber.includes(lower))
            );
        }

        // 3. Sort
        result.sort((a, b) => {
            let valA: any = a[sortField];
            let valB: any = b[sortField];

            // Handle date strings if needed, but assuming mostly strings
            if (!valA) valA = '';
            if (!valB) valB = '';

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, filterRole, filterVerified, filterClass, searchTerm, sortField, sortDirection]);

    const totalPages = Math.ceil(getFilteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = getFilteredAndSortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: keyof UserAccount) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: keyof UserAccount) => {
        if (sortField !== field) return <FaSort className="ml-1 text-gray-300 inline" />;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-blue-500 inline" /> : <FaSortDown className="ml-1 text-blue-500 inline" />;
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const list = snap.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, ...data, photoURL: data.photoURL || getDefaultAvatar(data.photoURL ? undefined : data.role) } as unknown as UserAccount;
            });
            setUsers(list);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleSaveMyInfo = async (e: FormEvent) => {
        e.preventDefault();
        setIsSavingMyInfo(true);
        try {
            const clean = (val: any) => (val === undefined ? null : val);
            await updateDoc(doc(db, 'users', userProfile.id), {
                fullName: clean(myInfo.full_name),
                full_name: clean(myInfo.full_name), // Sync legacy field
                phoneNumber: clean(myInfo.phoneNumber),
                birthDate: clean(myInfo.birthDate),
                address: clean(myInfo.address),
                cccd: clean(myInfo.cccd),
                cccdDate: clean(myInfo.cccdDate),
                cccdPlace: clean(myInfo.cccdPlace),
                class: clean(myInfo.class) // Allow student to update their self-filled class
            });
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu thông tin.');
        } finally {
            setIsSavingMyInfo(false);
        }
    };

    // Manager Actions
    const handleDeleteUser = async (uid: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
        try {
            await deleteDoc(doc(db, 'users', uid));
            setUsers(prev => prev.filter(u => u.id !== uid));
        } catch (e) {
            console.error(e);
            alert('Lỗi khi xóa.');
        }
    };

    const handleSaveOtherUser = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const clean = (val: any) => (val === undefined ? null : val);
            await updateDoc(doc(db, 'users', editingUser.id), {
                fullName: editingUser.fullName,
                phoneNumber: clean(editingUser.phoneNumber),
                birthDate: clean(editingUser.birthDate),
                role: editingUser.role,
                class: clean(editingUser.class),
                cccd: clean(editingUser.cccd),
                cccdDate: clean(editingUser.cccdDate),
                cccdPlace: clean(editingUser.cccdPlace),
                address: clean(editingUser.address)
            });
            alert('Đã cập nhật!');
            setShowEditModal(false);
            fetchUsers();
        } catch (e) {
            console.error(e);
            alert('Lỗi khi lưu.');
        }
    };

    // Admin Reset Password Logic
    const handleResetPassword = async (targetUserId: string, targetUserName: string) => {
        const newPassword = prompt(`Nhập mật khẩu mới cho ${targetUserName}:`, '123456');
        if (newPassword === null) return; // Cancelled
        if (!newPassword || newPassword.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                alert('Lỗi xác thực: Không tìm thấy token admin.');
                return;
            }

            // Call Server API
            const response = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetUserId, newPassword })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Đã đổi mật khẩu cho ${targetUserName} thành công!`);
            } else {
                alert(`Lỗi: ${data.error || 'Không xác định'}`);
            }
        } catch (error) {
            console.error('Reset password error:', error);
            alert('Lỗi kết nối đến server.');
        }
    };

    const roleName = (r: string) => allRoles.find(x => x.id === r)?.name || r;

    // --- CHANGE PASSWORD LOGIC ---
    const handleChangeMyPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        if (newPass.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        setLoadingChangePass(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                alert('Lỗi xác thực.');
                return;
            }

            // 1. Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);

            // 2. Update Password
            await updatePassword(user, newPass);

            alert('Đổi mật khẩu thành công!');
            setShowChangePassModal(false);
            setOldPass('');
            setNewPass('');
            setConfirmPass('');
        } catch (error: any) {
            console.error('Change password error:', error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert('Mật khẩu cũ không đúng.');
            } else if (error.code === 'auth/weak-password') {
                alert('Mật khẩu quá yếu.');
            } else {
                alert('Lỗi khi đổi mật khẩu: ' + error.message);
            }
        } finally {
            setLoadingChangePass(false);
        }
    };

    // --- AVATAR UPLOAD LOGIC ---
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }

        try {
            setUploadingAvatar(true);
            const publicUrl = await uploadAvatar(file, userProfile.id);

            // Update Firestore
            await updateDoc(doc(db, 'users', userProfile.id), {
                photoURL: publicUrl
            });

            // Update Local State
            setMyInfo(prev => ({ ...prev, photoURL: publicUrl }));
            alert('Tải ảnh đại diện thành công!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Có lỗi xảy ra khi tải ảnh.');
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200"><FaArrowLeft /></button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <FaUser /> Tài khoản của tôi
                </h1>
            </div>

            {/* MY INFO SECTION */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-lg font-bold mb-4 text-blue-600 border-b pb-2">Thông tin cá nhân</h2>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-slate-600 shadow-lg relative">
                            <img
                                src={myInfo.photoURL || getDefaultAvatar(myInfo.role)}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md text-gray-600 dark:text-gray-200 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <FaCamera size={16} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Chạm để đổi ảnh đại diện</p>
                </div>

                <form onSubmit={handleSaveMyInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Họ và Tên</label>
                            <input
                                className="w-full p-2 border rounded dark:bg-slate-700"
                                value={myInfo.full_name || myInfo.fullName || ''}
                                onChange={e => setMyInfo({ ...myInfo, full_name: e.target.value, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (Không đổi)</label>
                            <input className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-900 text-gray-500" value={myInfo.email || ''} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ngày sinh</label>
                            <input type="date" className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.birthDate || ''} onChange={e => setMyInfo({ ...myInfo, birthDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số điện thoại</label>
                            <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.phoneNumber || ''} onChange={e => setMyInfo({ ...myInfo, phoneNumber: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số CCCD</label>
                            <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.cccd || ''} onChange={e => setMyInfo({ ...myInfo, cccd: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ngày cấp</label>
                                <input type="date" className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.cccdDate || ''} onChange={e => setMyInfo({ ...myInfo, cccdDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nơi cấp</label>
                                <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.cccdPlace || ''} onChange={e => setMyInfo({ ...myInfo, cccdPlace: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Địa chỉ / Quê quán</label>
                            <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.address || ''} onChange={e => setMyInfo({ ...myInfo, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Lớp học (tự điền)</label>
                            <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.class || ''} onChange={e => setMyInfo({ ...myInfo, class: e.target.value })} placeholder="VD: Thợ máy K2" />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4 gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate('login_history')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            <FaHistory /> Lịch sử đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowChangePassModal(true)}
                            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition shadow-md"
                        >
                            <FaLock /> Đổi mật khẩu
                        </button>
                        <button type="submit" disabled={isSavingMyInfo} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition shadow-md disabled:opacity-50">
                            <FaSave /> {isSavingMyInfo ? 'Đang lưu...' : 'Cập nhật thông tin'}
                        </button>
                    </div>
                </form>
            </div>

            {/* MANAGER SECTION */}
            {isManager && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 animate-fade-in-up">
                    <h2 className="text-lg font-bold mb-4 text-orange-600 border-b pb-2 flex items-center justify-between">
                        <span>Quản lý người dùng</span>
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 rounded-full px-2 py-1">Admin/Lãnh đạo/QL/GV</span>
                    </h2>

                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-4 py-2 border rounded-full dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tìm học viên, giáo viên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2 pr-8 rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                value={filterVerified}
                                onChange={(e) => setFilterVerified(e.target.value as any)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="verified">Đã xác thực (Vào lớp)</option>
                                <option value="unverified">Chưa xác thực</option>
                            </select>
                            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none text-xs" />
                        </div>

                        {/* Class Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2 pr-8 rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[200px]"
                                value={filterClass}
                                onChange={(e) => setFilterClass(e.target.value)}
                            >
                                <option value="all">Tất cả lớp học</option>
                                <option value="no_class">Chưa vào lớp</option>
                                {Array.from(new Set(users.map(u => u.courseName).filter(Boolean))).sort().map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none text-xs" />
                        </div>

                        <div className="relative">
                            <select
                                className="appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2 pr-8 rounded-full shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value as any)}
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="hoc_vien">Học viên</option>
                                <option value="staff">Nhân sự (GV/QL/Admin)</option>
                            </select>
                            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none text-xs" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-sm uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="p-3 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('fullName')}>
                                        Họ và Tên {getSortIcon('fullName')}
                                    </th>
                                    <th className="p-3 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('class')}>
                                        Lớp học {getSortIcon('class')}
                                    </th>
                                    <th className="p-3 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('email')}>
                                        Liên hệ {getSortIcon('email')}
                                    </th>
                                    <th className="p-3 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleSort('role')}>
                                        Vai trò {getSortIcon('role')}
                                    </th>
                                    <th className="p-3 border-b dark:border-slate-700 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {loadingUsers ? (
                                    <tr><td colSpan={5} className="p-4 text-center">Đang tải...</td></tr>
                                ) : paginatedUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center italic text-gray-500">Không tìm thấy người dùng.</td></tr>
                                ) : (
                                    paginatedUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                            {/* Name - Click to View Detail */}
                                            <td className="p-3 font-medium text-gray-900 dark:text-white cursor-pointer group" onClick={() => { setSelectedUser(u); setShowDetailModal(true); }}>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={u.photoURL}
                                                        alt={u.fullName}
                                                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
                                                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + u.fullName; }}
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1">
                                                            {u.role === 'hoc_vien' && (u.isVerified || u.courseId) ? (
                                                                <span className="flex items-center gap-1 text-blue-600 font-semibold group-hover:underline">
                                                                    {u.fullName} <FaCheckCircle className="text-blue-500 text-xs" />
                                                                </span>
                                                            ) : u.role === 'giao_vien' ? (
                                                                <span className="font-bold text-yellow-600 dark:text-yellow-400 group-hover:underline">
                                                                    {u.fullName}
                                                                </span>
                                                            ) : u.role === 'quan_ly' || u.role === 'lanh_dao' ? (
                                                                <span className="font-bold text-red-600 dark:text-red-400 group-hover:underline">
                                                                    {u.fullName}
                                                                </span>
                                                            ) : u.role === 'admin' ? (
                                                                <span className="font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                                                                    {u.fullName}
                                                                </span>
                                                            ) : (
                                                                <span className="group-hover:underline">{u.fullName}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <FaInfoCircle className="opacity-0 group-hover:opacity-100 text-gray-400 text-xs ml-auto" />
                                                </div>
                                            </td>

                                            {/* Course/Class - Click to Navigate (if exists) */}
                                            <td className="p-3 text-sm">
                                                {(u.courseName || u.courseId) ? (
                                                    <span
                                                        className="cursor-pointer text-blue-600 hover:underline hover:text-blue-800 flex items-center gap-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate('class_management');
                                                        }}
                                                        title="Đi tới quản lý lớp"
                                                    >
                                                        {u.courseName || u.courseId} <FaArrowRight className="text-xs" />
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">--</span>
                                                )}
                                            </td>

                                            <td className="p-3 text-sm">
                                                <div>{u.email}</div>
                                                <div className="text-xs text-gray-500">{u.phoneNumber}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'hoc_vien' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {roleName(u.role)}
                                                </span>
                                            </td>
                                            <td className="p-3 flex justify-center gap-2">
                                                <button onClick={() => { setEditingUser(u); setShowEditModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Sửa thông tin"><FaEdit /></button>
                                                {userProfile.role === 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleResetPassword(u.id, u.fullName)}
                                                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                                                            title="Đổi mật khẩu"
                                                        >
                                                            <FaKey />
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Xóa tài khoản"><FaTrash /></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 gap-4">
                            <div className="text-sm text-gray-500">
                                Hiển thị trang <span className="font-bold text-gray-900 dark:text-gray-200">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                                <span className="mx-2">|</span>
                                Tổng <span className="font-bold text-blue-600">{getFilteredAndSortedUsers.length}</span> kết quả
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    className="border border-gray-300 dark:border-slate-600 rounded-md text-sm p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value={5}>5 / trang</option>
                                    <option value={10}>10 / trang</option>
                                    <option value={20}>20 / trang</option>
                                    <option value={50}>50 / trang</option>
                                </select>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                    >
                                        Đầu
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                    >
                                        Sau
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                    >
                                        Cuối
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* EDIT MODAL FOR MANAGER */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4">Sửa tài khoản: {editingUser.fullName}</h2>
                        <form onSubmit={handleSaveOtherUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold mb-1">Họ tên</label><input className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.fullName} onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">SĐT</label><input className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.phoneNumber || ''} onChange={e => setEditingUser({ ...editingUser, phoneNumber: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Ngày sinh</label><input type="date" className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.birthDate || ''} onChange={e => setEditingUser({ ...editingUser, birthDate: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Lớp học (tự điền)</label><input className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.class || ''} onChange={e => setEditingUser({ ...editingUser, class: e.target.value })} /></div>

                                <div><label className="block text-sm font-bold mb-1">CCCD</label><input className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.cccd || ''} onChange={e => setEditingUser({ ...editingUser, cccd: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Địa chỉ</label><input className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.address || ''} onChange={e => setEditingUser({ ...editingUser, address: e.target.value })} /></div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold mb-1">Vai trò</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-700" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                                        {allRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDetailModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-0 relative overflow-hidden animate-bounce-in" onClick={e => e.stopPropagation()}>

                        {/* Header Image */}
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                            <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40"><FaTimes /></button>
                            <div className="absolute -bottom-10 left-6">
                                <img
                                    src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName)}`}
                                    className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white"
                                />
                            </div>
                        </div>

                        <div className="pt-12 px-6 pb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        {selectedUser.fullName}
                                        {selectedUser.isVerified && <FaCheckCircle className="text-blue-500 text-lg" />}
                                    </h2>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{allRoles.find(r => r.id === selectedUser.role)?.name || selectedUser.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingUser(selectedUser);
                                        setShowDetailModal(false);
                                        setShowEditModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                                >
                                    <FaEdit /> Sửa
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Lớp học</p>
                                        <p className="font-semibold">{selectedUser.courseName || selectedUser.class || 'Chưa có'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Ngày sinh</p>
                                        <p className="font-semibold">{selectedUser.birthDate || '--/--/----'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Số điện thoại</p>
                                        <p className="font-semibold">{selectedUser.phoneNumber || '---'}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                        <p className="font-semibold text-sm truncate" title={selectedUser.email}>{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Địa chỉ</p>
                                    <p className="font-semibold text-sm">{selectedUser.address || selectedUser.cccdPlace || '---'}</p>
                                </div>

                                {selectedUser.cccd && (
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">CCCD</p>
                                            <p className="font-semibold text-sm">{selectedUser.cccd}</p>
                                        </div>
                                        {selectedUser.cccdDate && (
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 uppercase font-bold">Ngày cấp</p>
                                                <p className="font-semibold text-sm">{selectedUser.cccdDate}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 💖 ADMIN: LOGIN SESSIONS TAB (MỚI) 💖 */}
                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                        <FaHistory className="text-blue-500" /> Phiên đăng nhập hoạt động
                                    </h3>
                                    <AdminSessionList userId={selectedUser.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* CHANGE PASSWORD MODAL */}
            {showChangePassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowChangePassModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                            <FaLock className="text-blue-600" /> Đổi mật khẩu
                        </h2>
                        <form onSubmit={handleChangeMyPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    required
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    required
                                    placeholder="Ít nhất 6 ký tự"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    required
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowChangePassModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition">Hủy</button>
                                <button
                                    type="submit"
                                    disabled={loadingChangePass}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loadingChangePass ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountScreen;
