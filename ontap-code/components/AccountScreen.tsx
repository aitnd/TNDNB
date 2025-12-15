import React, { useState, useEffect, FormEvent } from 'react';
import { UserProfile } from '../types';
import { db } from '../services/firebaseClient';
import { getDefaultAvatar, uploadAvatar } from '../services/userService';
import { doc, updateDoc, collection, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { FaUser, FaSave, FaSearch, FaEdit, FaTrash, FaCheckCircle, FaArrowLeft, FaCamera } from 'react-icons/fa';

interface AccountScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
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
}

const allRoles = [
    { id: 'admin', name: 'Quản trị viên' },
    { id: 'lanh_dao', name: 'Lãnh đạo' },
    { id: 'quan_ly', name: 'Quản lý' },
    { id: 'giao_vien', name: 'Giáo viên' },
    { id: 'hoc_vien', name: 'Học viên' },
];

const staffRoles = ['giao_vien', 'lanh_dao', 'quan_ly'];

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onBack }) => {
    // --- PERSONAL INFO STATE ---
    const [myInfo, setMyInfo] = useState<UserProfile>(userProfile);
    const [isSavingMyInfo, setIsSavingMyInfo] = useState(false);

    // --- MANAGER STATE ---
    const isManager = userProfile.role !== 'hoc_vien';
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Edit Other User Modal
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (isManager) {
            fetchUsers();
        }
    }, [isManager]);

    useEffect(() => {
        if (isManager) {
            let result = users;
            if (filterRole === 'staff') result = result.filter(u => staffRoles.includes(u.role));
            else if (filterRole === 'hoc_vien') result = result.filter(u => u.role === 'hoc_vien');

            if (searchTerm.trim()) {
                const lower = searchTerm.toLowerCase();
                result = result.filter(u =>
                    u.fullName.toLowerCase().includes(lower) ||
                    u.email.toLowerCase().includes(lower) ||
                    (u.phoneNumber && u.phoneNumber.includes(lower))
                );
            }
            setFilteredUsers(result);
        }
    }, [users, filterRole, searchTerm, isManager]);

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

    const roleName = (r: string) => allRoles.find(x => x.id === r)?.name || r;

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
                            <input className="w-full p-2 border rounded dark:bg-slate-700" value={myInfo.full_name} onChange={e => setMyInfo({ ...myInfo, full_name: e.target.value })} required />
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

                    <div className="md:col-span-2 flex justify-end mt-4">
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
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                        <div className="relative flex-1 max-w-md w-full">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700"
                                placeholder="Tìm học viên, giáo viên..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select className="p-2 border rounded-lg dark:bg-slate-700 flex-1 md:flex-none" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                            <option value="all">Tất cả vai trò</option>
                            <option value="staff">Giáo viên/Quản lý</option>
                            <option value="hoc_vien">Học viên</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-sm uppercase text-gray-500 font-bold">
                                <tr>
                                    <th className="p-3 border-b dark:border-slate-700">Họ và Tên</th>
                                    <th className="p-3 border-b dark:border-slate-700">Lớp học (Khóa/Tên)</th>
                                    <th className="p-3 border-b dark:border-slate-700">Liên hệ</th>
                                    <th className="p-3 border-b dark:border-slate-700">Vai trò</th>
                                    <th className="p-3 border-b dark:border-slate-700 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {loadingUsers ? (
                                    <tr><td colSpan={5} className="p-4 text-center">Đang tải...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center italic text-gray-500">Không tìm thấy người dùng.</td></tr>
                                ) : (
                                    filteredUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                            <td className="p-3 font-medium text-gray-900 dark:text-white">
                                                {u.fullName}
                                                {u.role === 'hoc_vien' && u.isVerified && <FaCheckCircle className="inline ml-1 text-blue-500 text-xs" />}
                                            </td>
                                            <td className="p-3 text-sm">{u.courseName || u.courseId || '--'}</td>
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
                                                <button onClick={() => { setEditingUser(u); setShowEditModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button>
                                                {userProfile.role === 'admin' && <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
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
        </div>
    );
};

export default AccountScreen;
