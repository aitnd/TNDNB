import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { UserProfile } from '../types';
import { db, auth } from '../services/firebaseClient';
import { getDefaultAvatar } from '../services/userService';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { FaUser, FaSave, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaArrowLeft, FaSort, FaSortUp, FaSortDown, FaFilter, FaInfoCircle, FaArrowRight, FaTimes, FaKey, FaHistory, FaLaptop, FaMobileAlt, FaSignOutAlt, FaUserCheck, FaUserSlash, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeAdminModal } from './Badges/BadgeAdminModal';

interface UserManagerScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
    onNavigate: (screen: string) => void;
    usageConfig?: any;
}

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
    photoURL?: string;
    status?: 'active' | 'disabled';
}

const allRoles = [
    { id: 'admin', name: 'Quản trị viên' },
    { id: 'lanh_dao', name: 'Lãnh đạo' },
    { id: 'quan_ly', name: 'Quản lý' },
    { id: 'giao_vien', name: 'Giáo viên' },
    { id: 'hoc_vien', name: 'Học viên' },
];

const staffRoles = ['giao_vien', 'lanh_dao', 'quan_ly'];

// --- COMPONENT CON QUẢN LÝ PHIÊN ---
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
        if (!confirm('Đăng xuất thiết bị này từ xa?')) return;
        try {
            const { logoutRemoteSession } = await import('../services/authSessionService');
            await logoutRemoteSession(sid);
            fetchSessions();
        } catch (e) {
            alert('Lỗi khi đăng xuất.');
        }
    };

    if (loading) return <div className="text-xs text-blue-500 animate-pulse">Đang tải các phiên hoạt động...</div>;
    if (sessions.length === 0) return <div className="text-xs text-gray-400 italic">Không có thiết bị/phiên hoạt động.</div>;

    return (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600/50">
                    <div className="flex items-center gap-2">
                        {(s.deviceName || '').toLowerCase().includes('windows') ? <FaLaptop className="text-blue-500 text-sm" /> : <FaMobileAlt className="text-green-500 text-sm" />}
                        <div className="text-[11px] leading-tight">
                            <div className="font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{s.deviceName}</div>
                            <div className="text-gray-400 font-mono mt-0.5">{s.ip}</div>
                        </div>
                    </div>
                    <button onClick={() => handleLogout(s.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition" title="Đăng xuất thiết bị này">
                        <FaSignOutAlt size={12} />
                    </button>
                </div>
            ))}
        </div>
    );
};

const UserManagerScreen: React.FC<UserManagerScreenProps> = ({ userProfile, onBack, onNavigate, usageConfig }) => {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // --- Search & Filter States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'staff' | 'hoc_vien'>('all');
    const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
    const [filterClass, setFilterClass] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'disabled'>('all');

    // --- Modal States ---
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const [badgeUser, setBadgeUser] = useState<UserAccount | null>(null);

    // --- Sorting & Pagination ---
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof UserAccount>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // --- Privilege Logic ---
    const getRoleWeight = (role: string): number => {
        switch (role) {
            case 'admin': return 100;
            case 'lanh_dao': return 80;
            case 'quan_ly': return 60;
            case 'giao_vien': return 40;
            case 'hoc_vien': return 20;
            case 'guest': return 0;
            default: return 20;
        }
    };

    const getRoleConfigKey = (role: string): string => {
        if (role === 'admin') return 'admin';
        if (role === 'lanh_dao') return 'leader';
        if (role === 'quan_ly') return 'manager';
        if (role === 'giao_vien') return 'teacher';
        if (role === 'hoc_vien') return 'verified_user';
        return 'guest';
    };

    const userRole = userProfile?.role || 'guest';
    const roleConfig = usageConfig?.[getRoleConfigKey(userRole)] || {};

    const isAdmin = userProfile?.role === 'admin';
    const canViewEditOthers = isAdmin || (roleConfig.userViewEditOthers || false);
    const canChangeRoleOthers = isAdmin || (roleConfig.userChangeRoleOthers || false);
    const canDeleteOthers = isAdmin || (roleConfig.userDeleteOthers || false);
    const canForceLogoutOthers = isAdmin || (roleConfig.userForceLogoutOthers || false);

    useEffect(() => {
        // Kiểm tra quyền truy cập của người dùng
        if (userProfile) {
            const role = userProfile.role;
            if (!['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(role)) {
                alert('Bạn không có quyền truy cập trang quản lý người dùng!');
                onBack();
            }
        }
        fetchUsers();
    }, [userProfile]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const list = snap.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data, 
                    photoURL: data.photoURL || getDefaultAvatar(data.photoURL ? undefined : data.role) 
                } as unknown as UserAccount;
            });
            setUsers(list);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // --- KPI Stats Calculation ---
    const stats = useMemo(() => {
        const total = users.length;
        const disabled = users.filter(u => u.status === 'disabled').length;
        const active = total - disabled;
        const students = users.filter(u => u.role === 'hoc_vien').length;
        const staff = total - students;
        return { total, active, disabled, students, staff };
    }, [users]);

    // --- Search & Filter Logic ---
    const filteredAndSortedUsers = useMemo(() => {
        let result = users;

        // 1. Lọc Role
        if (filterRole === 'staff') result = result.filter(u => staffRoles.includes(u.role));
        else if (filterRole === 'hoc_vien') result = result.filter(u => u.role === 'hoc_vien');

        // 2. Lọc Trạng thái Xác thực
        if (filterVerified === 'verified') result = result.filter(u => u.isVerified || u.courseId);
        else if (filterVerified === 'unverified') result = result.filter(u => !u.isVerified && !u.courseId);

        // 3. Lọc Lớp học
        if (filterClass !== 'all') {
            if (filterClass === 'no_class') result = result.filter(u => !u.courseId && !u.courseName);
            else result = result.filter(u => u.courseName === filterClass);
        }

        // 4. Lọc Trạng thái Hoạt động
        if (filterStatus === 'active') result = result.filter(u => u.status !== 'disabled');
        else if (filterStatus === 'disabled') result = result.filter(u => u.status === 'disabled');

        // 5. Tìm kiếm
        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u =>
                (u.fullName || '').toLowerCase().includes(lower) ||
                (u.email || '').toLowerCase().includes(lower) ||
                (u.phoneNumber && u.phoneNumber.includes(lower))
            );
        }

        // 6. Sắp xếp
        result.sort((a, b) => {
            let valA: any = a[sortField];
            let valB: any = b[sortField];
            if (!valA) valA = '';
            if (!valB) valB = '';
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, filterRole, filterVerified, filterClass, filterStatus, searchTerm, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
    const paginatedUsers = filteredAndSortedUsers.slice(
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
        if (sortField !== field) return <FaSort className="ml-1 text-gray-300 inline text-xs" />;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-blue-500 inline text-xs" /> : <FaSortDown className="ml-1 text-blue-500 inline text-xs" />;
    };

    // --- Actions ---
    const handleDeleteUser = async (uid: string) => {
        if (!confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? (Tài khoản sẽ không đăng nhập được nữa)')) return;
        try {
            await updateDoc(doc(db, 'users', uid), { status: 'disabled' });
            setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: 'disabled' } : u));
            alert('Đã vô hiệu hóa tài khoản thành công!');
        } catch (e) {
            console.error(e);
            alert('Lỗi khi vô hiệu hóa.');
        }
    };

    const handleEnableUser = async (uid: string) => {
        if (!confirm('Bạn có chắc chắn muốn kích hoạt lại tài khoản này?')) return;
        try {
            await updateDoc(doc(db, 'users', uid), { status: 'active' });
            setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: 'active' } : u));
            alert('Đã kích hoạt lại tài khoản thành công!');
        } catch (e) {
            console.error(e);
            alert('Lỗi khi kích hoạt lại.');
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
            alert('Cập nhật tài khoản thành công!');
            setShowEditModal(false);
            fetchUsers();
        } catch (e) {
            console.error(e);
            alert('Lỗi khi cập nhật.');
        }
    };

    const handleResetPassword = async (targetUserId: string, targetUserName: string) => {
        const newPassword = prompt(`Nhập mật khẩu mới cho ${targetUserName}:`, '123456');
        if (newPassword === null) return; 
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

    return (
        <>
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 md:p-6 pb-20 draggable">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <FaUsers className="text-blue-500" /> Quản lý Người dùng
                    </h1>
                    <p className="text-xs text-gray-400">Xem, phân quyền và khóa tài khoản các thành viên</p>
                </div>
            </div>

            {/* KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <FaUsers size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tổng thành viên</div>
                        <div className="text-xl font-black">{stats.total}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                        <FaUserCheck size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider font-semibold">Tài khoản Hoạt động</div>
                        <div className="text-xl font-black">{stats.active}</div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 flex items-center gap-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                        <FaUserSlash size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tài khoản bị khóa</div>
                        <div className="text-xl font-black">{stats.disabled}</div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700/50 p-4 md:p-6">
                
                {/* Sticky Toolbar Filters */}
                <div className="flex flex-col xl:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Tìm học viên, giáo viên (Họ tên, email, sđt)..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3">
                        {/* Status Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="w-full appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2.5 pr-8 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="disabled">Bị khóa (disabled)</option>
                            </select>
                            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-[10px]" />
                        </div>

                        {/* Verified Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="w-full appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2.5 pr-8 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
                                value={filterVerified}
                                onChange={(e) => { setFilterVerified(e.target.value as any); setCurrentPage(1); }}
                            >
                                <option value="all">Tất cả xác thực</option>
                                <option value="verified">Đã vào lớp</option>
                                <option value="unverified">Chưa vào lớp</option>
                            </select>
                            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-[10px]" />
                        </div>

                        {/* Class Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="w-full appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2.5 pr-8 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm max-w-[200px]"
                                value={filterClass}
                                onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); }}
                            >
                                <option value="all">Tất cả lớp học</option>
                                <option value="no_class">Chưa vào lớp</option>
                                {Array.from(new Set(users.map(u => u.courseName).filter(Boolean))).sort().map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-[10px]" />
                        </div>

                        {/* Role Filter */}
                        <div className="relative flex-1 md:flex-none">
                            <select
                                className="w-full appearance-none bg-white dark:bg-slate-700 border hover:border-blue-500 px-4 py-2.5 pr-8 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
                                value={filterRole}
                                onChange={(e) => { setFilterRole(e.target.value as any); setCurrentPage(1); }}
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="hoc_vien">Học viên</option>
                                <option value="staff">Nhân sự (GV/QL/Admin)</option>
                            </select>
                            <FaFilter className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-[10px]" />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-700/50">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead className="bg-gray-50 dark:bg-slate-900/60 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800 transition" onClick={() => handleSort('fullName')}>
                                    Họ và Tên {getSortIcon('fullName')}
                                </th>
                                <th className="p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800 transition" onClick={() => handleSort('class')}>
                                    Lớp học {getSortIcon('class')}
                                </th>
                                <th className="p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800 transition" onClick={() => handleSort('email')}>
                                    Liên hệ {getSortIcon('email')}
                                </th>
                                <th className="p-4 border-b dark:border-slate-700 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800 transition" onClick={() => handleSort('role')}>
                                    Vai trò {getSortIcon('role')}
                                </th>
                                <th className="p-4 border-b dark:border-slate-700 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                            {loadingUsers ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400 animate-pulse">Đang tải danh sách thành viên...</td></tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center italic text-gray-400">Không tìm thấy người dùng phù hợp.</td></tr>
                            ) : (
                                paginatedUsers.map(u => {
                                    const uWeight = getRoleWeight(u.role);
                                    const myWeight = getRoleWeight(userProfile.role);
                                    const hasHierarchy = myWeight > uWeight;
                                    const canClickDetail = canViewEditOthers && hasHierarchy;

                                    return (
                                        <tr key={u.id} className={`hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition ${u.status === 'disabled' ? 'bg-red-50/10 opacity-70' : ''}`}>
                                            {/* Name - Click to Open Slide panel */}
                                            <td 
                                                className={`p-4 font-semibold text-gray-900 dark:text-white ${canClickDetail ? 'cursor-pointer group' : ''}`} 
                                                onClick={() => { 
                                                    if (canClickDetail) { 
                                                        setSelectedUser(u); 
                                                        setShowDetailPanel(true); 
                                                    } else {
                                                        alert('Bạn chỉ có quyền xem chi tiết các tài khoản có cấp độ phân quyền thấp hơn vai trò của bạn.');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={u.photoURL}
                                                        alt={u.fullName}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-slate-700 shadow-sm"
                                                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + u.fullName; }} loading="lazy" />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            {u.role === 'hoc_vien' && (u.isVerified || u.courseId) ? (
                                                                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:underline">
                                                                    {u.fullName} <FaCheckCircle className="text-blue-500 text-xs" />
                                                                </span>
                                                            ) : u.role === 'giao_vien' ? (
                                                                <span className="font-bold text-yellow-600 dark:text-yellow-400 group-hover:underline">
                                                                    {u.fullName}
                                                                </span>
                                                            ) : u.role === 'quan_ly' || u.role === 'lanh_dao' ? (
                                                                <span className="font-bold text-orange-600 dark:text-orange-400 group-hover:underline">
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
                                                        {u.status === 'disabled' ? (
                                                            <span className="text-[9px] font-black uppercase text-red-600 dark:text-red-400 bg-red-100/60 dark:bg-red-950/30 px-1.5 py-0.5 rounded mt-0.5 w-max">
                                                                Đã bị khóa
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] font-black uppercase text-green-600 dark:text-green-400 bg-green-100/60 dark:bg-green-950/30 px-1.5 py-0.5 rounded mt-0.5 w-max">
                                                                Hoạt động
                                                            </span>
                                                        )}
                                                    </div>
                                                    {canClickDetail && <FaInfoCircle className="opacity-0 group-hover:opacity-100 text-blue-500 text-xs ml-auto transition-opacity" />}
                                                </div>
                                            </td>

                                            {/* Course/Class Link */}
                                            <td className="p-4 text-sm font-medium">
                                                {(u.courseName || u.courseId) ? (
                                                    <span
                                                        className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate('class_management');
                                                        }}
                                                        title="Đi tới quản lý lớp"
                                                    >
                                                        {u.courseName || u.courseId} <FaArrowRight className="text-[10px]" />
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">Chưa vào lớp</span>
                                                )}
                                            </td>

                                            {/* Email & Contact */}
                                            <td className="p-4 text-sm">
                                                <div className="font-medium text-gray-800 dark:text-gray-200">{u.email}</div>
                                                <div className="text-xs text-gray-400 mt-0.5 font-mono">{u.phoneNumber || 'Không có SĐT'}</div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                                    u.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400' :
                                                    u.role === 'lanh_dao' || u.role === 'quan_ly' ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400' :
                                                    u.role === 'giao_vien' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
                                                }`}>
                                                    {roleName(u.role)}
                                                </span>
                                            </td>

                                            {/* Actions column */}
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {(canViewEditOthers && hasHierarchy) && (
                                                        <button onClick={() => { setEditingUser(u); setShowEditModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition" title="Sửa thông tin"><FaEdit size={14} /></button>
                                                    )}
                                                    {(isAdmin && hasHierarchy) && (
                                                        <button
                                                            onClick={() => handleResetPassword(u.id, u.fullName)}
                                                            className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition"
                                                            title="Đổi mật khẩu"
                                                        >
                                                            <FaKey size={14} />
                                                        </button>
                                                    )}
                                                    {(canDeleteOthers && hasHierarchy) && (
                                                        u.status === 'disabled' ? (
                                                            <button onClick={() => handleEnableUser(u.id)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition" title="Kích hoạt lại tài khoản"><FaCheckCircle size={14} /></button>
                                                        ) : (
                                                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" title="Khóa tài khoản"><FaTrash size={14} /></button>
                                                        )
                                                    )}
                                                    {/* Nút quản lý huy hiệu */}
                                                    {(canViewEditOthers && hasHierarchy) && (
                                                        <button
                                                            onClick={() => setBadgeUser(u)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition"
                                                            title="Quản lý huy hiệu"
                                                        >🏅</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/50 gap-4">
                        <div className="text-sm text-gray-400">
                            Hiển thị trang <span className="font-bold text-gray-900 dark:text-gray-200">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                            <span className="mx-2">|</span>
                            Tổng cộng <span className="font-bold text-blue-600">{filteredAndSortedUsers.length}</span> người dùng
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                className="border border-gray-200 dark:border-slate-700 rounded-xl text-sm p-2 outline-none bg-white dark:bg-slate-800 cursor-pointer"
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value="5">5 / trang</option>
                                <option value="10">10 / trang</option>
                                <option value="20">20 / trang</option>
                                <option value="50">50 / trang</option>
                            </select>

                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold"
                                >
                                    Đầu
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold"
                                >
                                    Trước
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold"
                                >
                                    Sau
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3.5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold"
                                >
                                    Cuối
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over Detail Panel (Framer Motion) */}
            <AnimatePresence>
                {showDetailPanel && selectedUser && (
                    <>
                        {/* Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailPanel(false)}
                            className="fixed inset-0 bg-black z-40"
                        />
                        {/* Panel */}
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-800 z-50 shadow-2xl p-6 overflow-y-auto flex flex-col"
                        >
                            {/* Header Panel */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-700/50 mb-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaUser className="text-blue-500" /> Chi tiết Người dùng
                                </h2>
                                <button onClick={() => setShowDetailPanel(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400">
                                    <FaTimes size={16} />
                                </button>
                            </div>

                            {/* User Avatar & Basic Info */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <img 
                                    src={selectedUser.photoURL} 
                                    className="w-24 h-24 rounded-full border-4 border-blue-500/10 object-cover shadow-md mb-3"
                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + selectedUser.fullName; }} loading="lazy" alt="" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 justify-center">
                                    {selectedUser.fullName}
                                    {selectedUser.isVerified && <FaCheckCircle className="text-blue-500 text-base" />}
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 mt-1">{roleName(selectedUser.role)}</p>
                            </div>

                            {/* Details List */}
                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Lớp học</div>
                                        <div className="font-bold text-sm mt-0.5 truncate">{selectedUser.courseName || selectedUser.class || 'Chưa vào lớp'}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Ngày sinh</div>
                                        <div className="font-bold text-sm mt-0.5">{selectedUser.birthDate || '--/--/----'}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Số điện thoại</div>
                                        <div className="font-bold text-sm mt-0.5 truncate">{selectedUser.phoneNumber || 'Chưa cung cấp'}</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Trạng thái</div>
                                        <div className={`font-bold text-sm mt-0.5 ${selectedUser.status === 'disabled' ? 'text-red-500' : 'text-green-500'}`}>
                                            {selectedUser.status === 'disabled' ? 'Bị khóa' : 'Đang hoạt động'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Địa chỉ Email</div>
                                    <div className="font-bold text-sm mt-0.5 truncate" title={selectedUser.email}>{selectedUser.email}</div>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Địa chỉ / Quê quán</div>
                                    <div className="font-bold text-sm mt-0.5">{selectedUser.address || 'Không có dữ liệu'}</div>
                                </div>

                                {selectedUser.cccd && (
                                    <div className="p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl flex justify-between items-center">
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Số CCCD</div>
                                            <div className="font-bold text-sm mt-0.5">{selectedUser.cccd}</div>
                                        </div>
                                        {selectedUser.cccdDate && (
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Ngày cấp</div>
                                                <div className="font-bold text-sm mt-0.5">{selectedUser.cccdDate}</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Admin Session List */}
                                {(canForceLogoutOthers && getRoleWeight(userProfile.role) > getRoleWeight(selectedUser.role)) && (
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                                        <h4 className="text-xs font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                            <FaHistory className="text-blue-500" /> Thiết bị & Phiên đăng nhập
                                        </h4>
                                        <AdminSessionList userId={selectedUser.id} />
                                    </div>
                                )}
                            </div>

                            {/* Actions panel */}
                            {(canViewEditOthers && getRoleWeight(userProfile.role) > getRoleWeight(selectedUser.role)) && (
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700/50 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingUser(selectedUser);
                                            setShowDetailPanel(false);
                                            setShowEditModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow transition"
                                    >
                                        <FaEdit /> Sửa tài khoản
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* EDIT USER MODAL */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-3 border-b dark:border-slate-700 mb-4">
                            <h2 className="text-lg font-bold">Chỉnh sửa tài khoản: {editingUser.fullName}</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSaveOtherUser} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold mb-1">Họ tên</label><input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.fullName} onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} required /></div>
                                <div><label className="block text-sm font-bold mb-1">SĐT</label><input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.phoneNumber || ''} onChange={e => setEditingUser({ ...editingUser, phoneNumber: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Ngày sinh</label><input type="date" className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.birthDate || ''} onChange={e => setEditingUser({ ...editingUser, birthDate: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Lớp học (tự điền)</label><input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.class || ''} onChange={e => setEditingUser({ ...editingUser, class: e.target.value })} /></div>

                                <div><label className="block text-sm font-bold mb-1">CCCD</label><input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.cccd || ''} onChange={e => setEditingUser({ ...editingUser, cccd: e.target.value })} /></div>
                                <div><label className="block text-sm font-bold mb-1">Địa chỉ</label><input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={editingUser.address || ''} onChange={e => setEditingUser({ ...editingUser, address: e.target.value })} /></div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-1">Vai trò</label>
                                    <select 
                                        className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" 
                                        value={editingUser.role} 
                                        onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                        disabled={!canChangeRoleOthers}
                                    >
                                        {allRoles
                                            .filter(r => getRoleWeight(userProfile.role) > getRoleWeight(r.id) || r.id === editingUser.role)
                                            .map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition text-sm">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-bold">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

        {/* Badge Admin Modal */}
        <BadgeAdminModal
            isOpen={!!badgeUser}
            onClose={() => setBadgeUser(null)}
            userId={badgeUser?.id || ''}
            userName={badgeUser?.fullName || ''}
        />
        </>
    );
};

export default UserManagerScreen;

// BadgeAdminModal được render ở cuối component chính, xem dòng badgeUser
