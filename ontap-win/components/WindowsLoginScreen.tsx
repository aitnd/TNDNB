import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebaseClient';
import { getOfflineUser, saveUserOffline } from '../services/offlineService';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { useAppStore } from '../stores/useAppStore';

const WindowsLoginScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true); // Ghi nhớ đăng nhập mặc định bật
    const setUserProfile = useAppStore(state => state.setUserProfile);
    const setUserName = useAppStore(state => state.setUserName);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let email = username.trim();
            if (!email.includes('@')) {
                email = `${email}@daotaothuyenvien.com`;
            }

            if (navigator.onLine) {
                // Đăng nhập Online
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                // 💖 GHI LẠI PHIÊN ĐĂNG NHẬP (MỚI) 💖
                import('../services/authSessionService').then(({ recordLoginSession }) => {
                    recordLoginSession(firebaseUser.uid);
                });

                // Lấy profile từ Firestore và lưu offline
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    const profile = { id: userDoc.id, ...userDoc.data() } as UserProfile;
                    if (profile.offlineAccess) {
                        await saveUserOffline(profile, password, email);
                    }
                    // Lưu session nếu ghi nhớ đăng nhập
                    if (rememberMe) {
                        localStorage.setItem('rememberSession', JSON.stringify({
                            uid: firebaseUser.uid,
                            email: email,
                            timestamp: Date.now()
                        }));
                    }
                }
            } else {
                // Đăng nhập Offline
                console.log("Attempting offline login for:", email);
                const offlineUser = await getOfflineUser(email);

                if (!offlineUser) {
                    console.warn("No offline data found for this email.");
                    throw { code: 'auth/offline-no-data' };
                }

                if (offlineUser.hashedPassword === btoa(password)) {
                    console.log("Offline login successful");
                    const profile: UserProfile = {
                        id: offlineUser.id,
                        full_name: offlineUser.full_name,
                        email: offlineUser.email,
                        role: offlineUser.role as any,
                        offlineAccess: true
                    };
                    setUserProfile(profile);
                    setUserName(profile.full_name);
                    // Lưu session nếu ghi nhớ đăng nhập
                    if (rememberMe) {
                        localStorage.setItem('rememberSession', JSON.stringify({
                            uid: offlineUser.id,
                            email: email,
                            timestamp: Date.now(),
                            offline: true
                        }));
                    }
                } else {
                    console.warn("Offline password mismatch");
                    throw { code: 'auth/offline-wrong-password' };
                }
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            let msg = 'Đăng nhập thất bại.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/offline-wrong-password') {
                msg = 'Sai tên đăng nhập hoặc mật khẩu.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau.';
            } else if (err.code === 'auth/network-request-failed') {
                msg = 'Lỗi kết nối mạng. Vui lòng kiểm tra Internet.';
            } else if (err.code === 'auth/offline-no-data') {
                msg = 'Tài khoản chưa từng đăng nhập Online trên máy này hoặc chưa được cấp quyền Offline.';
            } else if (err.code === 'auth/offline-failed') {
                msg = 'Lỗi đăng nhập Offline.';
            } else {
                msg = `Lỗi: ${err.message || err.code}`;
            }
            setError(msg);
            alert(msg);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#333] bg-gray-50">
            {/* HEADER */}
            <div className="bg-white shadow-sm">
                <div className="w-full h-[150px] bg-cover bg-center relative" style={{ backgroundImage: "url('assets/img/banner1.png')" }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-200 opacity-50"></div>
                    <div className="container mx-auto h-full flex items-center px-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <img src="assets/img/logo1.ico" alt="Logo" className="h-24 w-24 object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'} />
                            <div className="text-blue-800 uppercase font-bold drop-shadow-sm">
                                <h1 className="text-3xl">CÔNG TY CP TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h1>
                                <h2 className="text-xl text-red-600 mt-1">NINH BINH CONSULTING AND EDUCATION JOINT STOCK COMPANY</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-grow flex justify-center items-center py-10">
                <div className="w-full max-w-md px-4">
                    <div className="text-center mb-8 text-sm text-gray-700 space-y-1">
                        <p className="font-bold text-lg mb-2 text-blue-800">ĐĂNG NHẬP ỨNG DỤNG</p>
                        <p>Vui lòng nhập tài khoản và mật khẩu để tiếp tục.</p>
                        <p>Nếu bạn chưa có tài khoản, vui lòng liên hệ quản trị viên.</p>
                    </div>

                    <div className="bg-white p-1">
                        <fieldset className="border border-gray-300 p-6 rounded-sm shadow-sm bg-white">
                            <legend className="px-2 text-gray-700 font-bold text-sm">Thông tin đăng nhập</legend>
                            <form onSubmit={handleLogin} className="space-y-4 mt-2">
                                <div className="flex items-center">
                                    <label className="w-32 text-sm font-bold text-gray-700">Số báo danh:</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="flex-1 border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 rounded-sm"
                                        required
                                        placeholder="Nhập số báo danh..."
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label className="w-32 text-sm font-bold text-gray-700">Mật khẩu:</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1 border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 rounded-sm"
                                        required
                                        placeholder="Nhập mật khẩu..."
                                    />
                                </div>
                                {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded">{error}</p>}
                                <div className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#2962ff] text-white px-8 py-2 text-sm font-bold rounded-sm hover:bg-blue-700 transition-colors shadow-sm uppercase w-full sm:w-auto"
                                    >
                                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-[#0d47a1] text-white py-4 text-center text-xs space-y-1">
                <p className="uppercase font-bold">Công ty cổ phần Tư vấn và Giáo dục Ninh Bình</p>
                <p>022.96.282.969 - giaoducninhbinh@daotaothuyenvien.com</p>
            </div>
        </div>
    );
};

export default WindowsLoginScreen;
