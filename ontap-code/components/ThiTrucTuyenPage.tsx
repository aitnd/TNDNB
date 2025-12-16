import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseClient';

const ThiTrucTuyenPage: React.FC = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Giả sử username là email, nếu không phải email thì cần xử lý thêm logic map username -> email
            // Ở đây tạm thời coi username nhập vào là email hoặc xử lý đơn giản
            let email = username;
            if (!email.includes('@')) {
                email = `${username}@thitructuyen.vn`; // Fallback nếu nhập username
            }

            await signInWithEmailAndPassword(auth, email, password);
            // Sau khi login thành công, App.tsx sẽ tự chuyển hướng dựa trên auth state
            // window.location.href = '/'; // Không redirect cứng nữa
            // App.tsx sẽ tự động cập nhật state khi auth thay đổi
        } catch (err: any) {
            console.error(err);
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#333]">
            {/* HEADER */}
            <div className="bg-white">
                {/* Banner Image */}
                <div className="w-full h-[150px] bg-cover bg-center relative" style={{ backgroundImage: "url('/ontap/assets/img/banner_thitructuyen.jpg')" }}>
                    {/* Fallback gradient if no image */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-200 opacity-50"></div>

                    <div className="container mx-auto h-full flex items-center px-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <img src="/ontap/assets/img/logo_viwa.png" alt="Logo" className="h-24 w-24 object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'} />
                            <div className="text-blue-800 uppercase font-bold drop-shadow-sm">
                                <h1 className="text-3xl">CÔNG TY CP TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h1>
                                <h2 className="text-xl text-red-600 mt-1">NINH BINH CONSULTING AND EDUCATION JOINT STOCK COMPANY</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-grow bg-white flex justify-center pt-10 pb-20">
                <div className="w-full max-w-4xl px-4">
                    {!user ? (
                        <>
                            <div className="text-center mb-8 text-sm text-gray-700 space-y-1">
                                <p>Vui lòng nhập tài khoản và mật khẩu để đăng nhập.</p>
                                <p>Nếu bạn chưa có tài khoản hoặc quên mật khẩu vui lòng liên hệ giám thị coi thi!</p>
                                <p>Nếu bạn muốn tra kết quả học tập, hãy vào <a href="/ontap" className="text-blue-600 font-bold hover:underline">TRA CỨU ĐIỂM</a></p>
                                <p>Nếu bạn muốn ôn tập hoặc thi thử, hãy vào <a href="/ontap" className="text-blue-600 font-bold hover:underline">THI THỬ</a></p>
                            </div>

                            <div className="max-w-md mx-auto">
                                <fieldset className="border border-gray-300 p-6 rounded-sm shadow-sm">
                                    <legend className="px-2 text-gray-700 font-bold text-sm">Thông tin đăng nhập</legend>

                                    <form onSubmit={handleLogin} className="space-y-4 mt-2">
                                        <div className="flex items-center">
                                            <label className="w-32 text-sm font-bold text-gray-700">Tên đăng nhập:</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="flex-1 border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 rounded-sm"
                                                required
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
                                            />
                                        </div>

                                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#2962ff] text-white px-6 py-1.5 text-sm font-bold rounded-sm hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                            </button>
                                        </div>
                                    </form>
                                </fieldset>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-blue-700 uppercase">Khu vực Thi Trực Tuyến</h2>
                                <p className="text-gray-600 mt-2">Xin chào, <strong className="text-blue-900">{user.displayName || user.email}</strong></p>
                            </div>
                            <fieldset className="border border-gray-300 p-6 rounded-sm shadow-sm bg-blue-50/30">
                                <legend className="px-2 text-blue-800 font-bold text-sm bg-white border border-gray-200 rounded shadow-sm">Vào Phòng Thi</legend>
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mã phòng thi (Room ID):</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã phòng do giám thị cung cấp..."
                                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 rounded-sm shadow-inner"
                                        />
                                    </div>
                                    <button className="w-full bg-[#2962ff] text-white px-4 py-2.5 text-sm font-bold rounded-sm hover:bg-blue-700 transition-all shadow-md flex justify-center items-center gap-2">
                                        <span>VÀO THI NGAY</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </fieldset>
                            <div className="mt-6 text-center">
                                <a href="/" className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
                                    &larr; Quay lại Trang chủ
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-[#0d47a1] text-white py-4 text-center text-xs space-y-1">
                <div className="flex justify-center mb-2">
                    <img src="/ontap/assets/img/logo_viwa_white.png" alt="Logo Footer" className="h-16 w-16 object-contain opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
                <p className="uppercase font-bold">Công ty cổ phần Tư vấn và Giáo dục Ninh Bình</p>
                <p>Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình</p>
                <p>022.96.282.969</p>
                <p>ninhbinheduco.jsc@gmail.com</p>
                <p>giaoducninhbinh@daotaothuyenvien.com</p>
            </div>
        </div>
    );
};

export default ThiTrucTuyenPage;
