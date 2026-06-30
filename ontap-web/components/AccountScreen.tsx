import React, { useState, useEffect, FormEvent } from 'react';
import { UserProfile } from '../types';
import { useAppStore } from '../stores/useAppStore';
import { BadgeList } from './Badges/BadgeList';
import { MiniRoleBadge } from './Badges/MiniRoleBadge';
import { db } from '../services/firebaseClient';
import { uploadAvatar } from '../services/userService';
import { doc, updateDoc } from 'firebase/firestore'; 
import { FaUser, FaSave, FaArrowLeft, FaCamera, FaLock, FaHistory, FaLaptop, FaMobileAlt, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../services/firebaseClient';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

interface AccountScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
    onNavigate: (screen: string) => void;
    usageConfig?: any;
}

const allRoles = [
    { id: 'admin', name: 'Quản trị viên' },
    { id: 'lanh_dao', name: 'Lãnh đạo' },
    { id: 'quan_ly', name: 'Quản lý' },
    { id: 'giao_vien', name: 'Giáo viên' },
    { id: 'hoc_vien', name: 'Học viên' },
];

// Component phụ hiển thị danh sách phiên đăng nhập hoạt động cá nhân
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
                        {(s.deviceName || '').toLowerCase().includes('windows') ? <FaLaptop className="text-blue-500 text-xs" /> : <FaMobileAlt className="text-green-500 text-xs" />}
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

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onBack, onNavigate, usageConfig }) => {
    // --- PERSONAL INFO STATE ---
    const [myInfo, setMyInfo] = useState<UserProfile>(userProfile);
    const [isSavingMyInfo, setIsSavingMyInfo] = useState(false);

    // --- CHANGE PASSWORD STATE ---
    const [showChangePassModal, setShowChangePassModal] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loadingChangePass, setLoadingChangePass] = useState(false);

    const handleSaveMyInfo = async (e: FormEvent) => {
        e.preventDefault();
        setIsSavingMyInfo(true);
        try {
            const clean = (val: any) => (val === undefined ? null : val);
            await updateDoc(doc(db, 'users', userProfile.id), {
                fullName: clean(myInfo.full_name),
                full_name: clean(myInfo.full_name), // Đồng bộ field cũ
                phoneNumber: clean(myInfo.phoneNumber),
                birthDate: clean(myInfo.birthDate),
                address: clean(myInfo.address),
                cccd: clean(myInfo.cccd),
                cccdDate: clean(myInfo.cccdDate),
                cccdPlace: clean(myInfo.cccdPlace),
                class: clean(myInfo.class) // Cho phép học viên cập nhật lớp tự điền
            });
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu thông tin.');
        } finally {
            setIsSavingMyInfo(false);
        }
    };

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

            // Cập nhật Firestore
            await updateDoc(doc(db, 'users', userProfile.id), {
                photoURL: publicUrl
            });

            // Cập nhật Local State
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
                <div>
                    <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                        <FaUser className="text-teal-600" /> Tài khoản của tôi
                    </h1>
                    <p className="text-gray-500 text-xs dark:text-gray-400">Xem và chỉnh sửa thông tin hồ sơ cá nhân</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 mb-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <img 
                            src={myInfo.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(myInfo.fullName || '')}`} 
                            className="w-28 h-28 rounded-full border-4 border-teal-500/10 object-cover shadow-lg transition-transform group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + (myInfo.fullName || ''); }} loading="lazy" alt="" />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <FaCamera className="text-white text-xl" />
                        </div>
                        {uploadingAvatar && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <h2 className="text-xl font-bold mt-4 dark:text-white flex items-center gap-2 justify-center">
                        {myInfo.fullName}
                        {myInfo.role && <MiniRoleBadge role={myInfo.role} />}
                    </h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{allRoles.find(r => r.id === myInfo.role)?.name || myInfo.role}</p>
                </div>

                <form onSubmit={handleSaveMyInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Họ và Tên</label>
                            <input
                                className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                value={myInfo.full_name || myInfo.fullName || ''}
                                onChange={e => setMyInfo({ ...myInfo, full_name: e.target.value, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (Không đổi)</label>
                            <input className="w-full p-2.5 border rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-500" value={myInfo.email || ''} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ngày sinh</label>
                            <input type="date" className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.birthDate || ''} onChange={e => setMyInfo({ ...myInfo, birthDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số điện thoại</label>
                            <input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.phoneNumber || ''} onChange={e => setMyInfo({ ...myInfo, phoneNumber: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Số CCCD</label>
                            <input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.cccd || ''} onChange={e => setMyInfo({ ...myInfo, cccd: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ngày cấp</label>
                                <input type="date" className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.cccdDate || ''} onChange={e => setMyInfo({ ...myInfo, cccdDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nơi cấp</label>
                                <input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.cccdPlace || ''} onChange={e => setMyInfo({ ...myInfo, cccdPlace: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Địa chỉ / Quê quán</label>
                            <input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.address || ''} onChange={e => setMyInfo({ ...myInfo, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Lớp học (tự điền)</label>
                            <input className="w-full p-2.5 border rounded-xl dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition" value={myInfo.class || ''} onChange={e => setMyInfo({ ...myInfo, class: e.target.value })} placeholder="VD: Thợ máy K2" />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end mt-4 gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate('login_history')}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow-md font-bold text-sm"
                        >
                            <FaHistory /> Lịch sử đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowChangePassModal(true)}
                            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition shadow-md font-bold text-sm"
                        >
                            <FaLock /> Đổi mật khẩu
                        </button>
                        <button type="submit" disabled={isSavingMyInfo} className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-xl hover:bg-teal-700 transition shadow-md font-bold text-sm disabled:opacity-50">
                            <FaSave /> {isSavingMyInfo ? 'Đang lưu...' : 'Cập nhật thông tin'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Badge List Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 mb-6">
                <BadgeList userId={userProfile.id} userRole={userProfile.role} />
            </div>

            {/* Phiên hoạt động cá nhân */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FaHistory className="text-teal-600" /> Phiên đăng nhập hoạt động cá nhân
                </h3>
                <AdminSessionList userId={userProfile.id} />
            </div>

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
