import React, { useState, useEffect, FormEvent } from 'react';
import { UserProfile } from '../types';
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

    if (loading) return <div className="text-xs text-muted-foreground animate-pulse">Đang tải phiên...</div>;
    if (sessions.length === 0) return <div className="text-xs text-muted-foreground italic">Không có phiên hoạt động.</div>;

    return (
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 bg-muted/40 rounded-xl border border-border">
                    <div className="flex items-center gap-2.5">
                        {(s.deviceName || '').toLowerCase().includes('windows') ? <FaLaptop className="text-primary text-xs" /> : <FaMobileAlt className="text-emerald-500 text-xs" />}
                        <div className="text-xs">
                            <div className="font-bold truncate max-w-[140px] text-foreground">{s.deviceName}</div>
                            <div className="text-muted-foreground text-[11px] tabular-nums">{s.ip}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleLogout(s.id)} 
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition min-w-[36px] min-h-[36px] flex items-center justify-center" 
                        title="Đăng xuất thiết bị này"
                        aria-label="Đăng xuất thiết bị"
                    >
                        <FaSignOutAlt size={13} />
                    </button>
                </div>
            ))}
        </div>
    );
};

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onBack, onNavigate }) => {
    const [myInfo, setMyInfo] = useState<UserProfile>(userProfile);
    const [isSavingMyInfo, setIsSavingMyInfo] = useState(false);

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
                full_name: clean(myInfo.full_name),
                phoneNumber: clean(myInfo.phoneNumber),
                birthDate: clean(myInfo.birthDate),
                address: clean(myInfo.address),
                cccd: clean(myInfo.cccd),
                cccdDate: clean(myInfo.cccdDate),
                cccdPlace: clean(myInfo.cccdPlace),
                class: clean(myInfo.class)
            });
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu thông tin.');
        } finally {
            setIsSavingMyInfo(false);
        }
    };

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

            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);
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

            await updateDoc(doc(db, 'users', userProfile.id), {
                photoURL: publicUrl
            });

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
        <div className="w-full max-w-5xl mx-auto p-4 animate-slide-in-right pb-24 pt-20">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={onBack} 
                    className="p-2.5 bg-card border border-border rounded-xl hover:bg-muted text-foreground transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Quay lại"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                        <FaUser className="text-primary" /> Tài khoản của tôi
                    </h1>
                    <p className="text-muted-foreground text-xs mt-0.5">Xem và chỉnh sửa thông tin hồ sơ cá nhân</p>
                </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm p-6 border border-border mb-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick} role="button" aria-label="Thay ảnh đại diện">
                        <img 
                            src={myInfo.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(myInfo.fullName || '')}`} 
                            className="w-28 h-28 rounded-full border-4 border-primary/20 object-cover shadow-sm transition-transform group-hover:scale-105"
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
                    <h2 className="text-xl font-bold mt-4 text-foreground flex items-center gap-2 justify-center">
                        {myInfo.fullName}
                        {myInfo.role && <MiniRoleBadge role={myInfo.role} />}
                    </h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{allRoles.find(r => r.id === myInfo.role)?.name || myInfo.role}</p>
                </div>

                <form onSubmit={handleSaveMyInfo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Họ và Tên</label>
                            <input
                                className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground outline-none focus:ring-2 focus:ring-primary transition"
                                value={myInfo.full_name || myInfo.fullName || ''}
                                onChange={e => setMyInfo({ ...myInfo, full_name: e.target.value, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Email (Không đổi)</label>
                            <input className="w-full p-2.5 border border-border rounded-xl bg-muted text-muted-foreground" value={myInfo.email || ''} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Ngày sinh</label>
                            <input type="date" className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground tabular-nums outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.birthDate || ''} onChange={e => setMyInfo({ ...myInfo, birthDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Số điện thoại</label>
                            <input className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground tabular-nums outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.phoneNumber || ''} onChange={e => setMyInfo({ ...myInfo, phoneNumber: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Số CCCD</label>
                            <input className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground tabular-nums outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.cccd || ''} onChange={e => setMyInfo({ ...myInfo, cccd: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-foreground">Ngày cấp</label>
                                <input type="date" className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground tabular-nums outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.cccdDate || ''} onChange={e => setMyInfo({ ...myInfo, cccdDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-foreground">Nơi cấp</label>
                                <input className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.cccdPlace || ''} onChange={e => setMyInfo({ ...myInfo, cccdPlace: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Địa chỉ / Quê quán</label>
                            <input className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.address || ''} onChange={e => setMyInfo({ ...myInfo, address: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-foreground">Lớp học (tự điền)</label>
                            <input className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground outline-none focus:ring-2 focus:ring-primary transition" value={myInfo.class || ''} onChange={e => setMyInfo({ ...myInfo, class: e.target.value })} placeholder="VD: Thợ máy K2" />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap justify-end mt-4 gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate('login_history')}
                            className="flex items-center gap-2 bg-card text-foreground border border-border hover:bg-muted px-4 py-2.5 rounded-xl transition font-semibold text-sm min-h-[44px]"
                        >
                            <FaHistory /> Lịch sử đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowChangePassModal(true)}
                            className="flex items-center gap-2 bg-card text-foreground border border-border hover:bg-muted px-4 py-2.5 rounded-xl transition font-semibold text-sm min-h-[44px]"
                        >
                            <FaLock /> Đổi mật khẩu
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSavingMyInfo} 
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition font-semibold text-sm disabled:opacity-50 min-h-[44px]"
                        >
                            <FaSave /> {isSavingMyInfo ? 'Đang lưu...' : 'Cập nhật thông tin'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Badge List Section */}
            <div className="bg-card rounded-2xl shadow-sm p-6 border border-border mb-6">
                <BadgeList userId={userProfile.id} userRole={userProfile.role} />
            </div>

            {/* Phiên hoạt động cá nhân */}
            <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <FaHistory className="text-primary" /> Phiên đăng nhập hoạt động cá nhân
                </h3>
                <AdminSessionList userId={userProfile.id} />
            </div>

            {/* CHANGE PASSWORD MODAL */}
            {showChangePassModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" onClick={() => setShowChangePassModal(false)}>
                    <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                            <FaLock className="text-primary" /> Đổi mật khẩu
                        </h2>
                        <form onSubmit={handleChangeMyPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-foreground">Mật khẩu cũ</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    required
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-foreground">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    required
                                    placeholder="Ít nhất 6 ký tự"
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-foreground">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="w-full p-2.5 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    required
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowChangePassModal(false)} className="px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-muted transition text-foreground font-semibold min-h-[44px]">Hủy</button>
                                <button
                                    type="submit"
                                    disabled={loadingChangePass}
                                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2 font-semibold min-h-[44px]"
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
