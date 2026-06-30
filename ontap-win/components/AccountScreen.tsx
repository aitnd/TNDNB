import React, { useState, FormEvent } from 'react';
import { UserProfile } from '../types';
import { db, auth } from '../services/firebaseClient';
import { getDefaultAvatar, uploadAvatar } from '../services/userService';
import { doc, updateDoc } from 'firebase/firestore';
import { FaUser, FaSave, FaArrowLeft, FaCamera, FaLock, FaHistory } from 'react-icons/fa';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { BadgeList } from './Badges/BadgeList';
import { MiniRoleBadge } from './Badges/MiniRoleBadge';

interface AccountScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
    onNavigate: (screen: string) => void;
    usageConfig?: any;
}

const AccountScreen: React.FC<AccountScreenProps> = ({ userProfile, onBack, onNavigate, usageConfig }) => {
    // --- TRẠNG THÁI THÔNG TIN CÁ NHÂN ---
    const [myInfo, setMyInfo] = useState<UserProfile>(userProfile);
    const [isSavingMyInfo, setIsSavingMyInfo] = useState(false);

    // --- TRẠNG THÁI ĐỔI MẬT KHẨU ---
    const [showChangePassModal, setShowChangePassModal] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loadingChangePass, setLoadingChangePass] = useState(false);

    // --- LƯU THÔNG TIN CÁ NHÂN ---
    const handleSaveMyInfo = async (e: FormEvent) => {
        e.preventDefault();
        setIsSavingMyInfo(true);
        try {
            const clean = (val: any) => (val === undefined ? null : val);
            await updateDoc(doc(db, 'users', userProfile.id), {
                fullName: clean(myInfo.full_name),
                full_name: clean(myInfo.full_name), // Đồng bộ trường cũ
                phoneNumber: clean(myInfo.phoneNumber),
                birthDate: clean(myInfo.birthDate),
                address: clean(myInfo.address),
                cccd: clean(myInfo.cccd),
                cccdDate: clean(myInfo.cccdDate),
                cccdPlace: clean(myInfo.cccdPlace),
                class: clean(myInfo.class) // Cho phép học viên tự điền lớp học
            });
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi lưu thông tin.');
        } finally {
            setIsSavingMyInfo(false);
        }
    };

    // --- ĐỔI MẬT KHẨU ---
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

            // 1. Xác thực lại người dùng
            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);

            // 2. Cập nhật mật khẩu mới
            await updatePassword(user, newPass);

            alert('Đổi mật khẩu thành công!');
            setShowChangePassModal(false);
            setOldPass('');
            setNewPass('');
            setConfirmPass('');
        } catch (error: any) {
            console.error('Lỗi đổi mật khẩu:', error);
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

    // --- XỬ LÝ TẢI ẢNH ĐẠI DIỆN ---
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

            // Cập nhật lên Firestore
            await updateDoc(doc(db, 'users', userProfile.id), {
                photoURL: publicUrl
            });

            // Cập nhật trạng thái cục bộ
            setMyInfo(prev => ({ ...prev, photoURL: publicUrl }));
            alert('Tải ảnh đại diện thành công!');
        } catch (error) {
            console.error('Lỗi tải ảnh đại diện:', error);
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

            {/* PHẦN THÔNG TIN CÁ NHÂN */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-slate-700">
                <h2 className="text-lg font-bold mb-4 text-blue-600 border-b pb-2">Thông tin cá nhân</h2>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-slate-600 shadow-lg relative">
                            <img
                                src={myInfo.photoURL || getDefaultAvatar(myInfo.role)}
                                alt="Avatar"
                                className="w-full h-full object-cover" loading="lazy" />
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
                    <h2 className="text-xl font-bold mt-3 dark:text-white flex items-center gap-2 justify-center">
                        {myInfo.full_name || myInfo.fullName}
                        {myInfo.role && <MiniRoleBadge role={myInfo.role} />}
                    </h2>
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

            {/* Badge List Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 mb-6 mt-6">
                <BadgeList userId={userProfile.id} userRole={userProfile.role} />
            </div>

            {/* MODAL ĐỔI MẬT KHẨU */}
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
