import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * ⏱️ CountdownAdScreen — Trang đếm ngược + hiển thị quảng cáo Interstitial
 * 
 * Hiển thị trước khi xem kết quả ôn tập/thi.
 * Trong thời gian đếm ngược, Monetag Interstitial/Vignette tự hiển thị (đã load qua Smart Tag).
 * 
 * Truyền state qua React Router location.state:
 * - redirectPath: đường dẫn chuyển hướng sau đếm ngược
 * - seconds: số giây đếm ngược (mặc định 5)
 * - message: thông báo hiển thị
 * - passthrough: dữ liệu truyền tiếp sang trang kết quả
 */
interface CountdownState {
    redirectPath: string;
    seconds?: number;
    message?: string;
    passthrough?: any;
}

const CountdownAdScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = (location.state || {}) as CountdownState;

    const totalSeconds = state.seconds || 5;
    const redirectPath = state.redirectPath || '/ontap/dashboard';
    const message = state.message || 'Đang tải kết quả...';

    const [timeLeft, setTimeLeft] = useState(totalSeconds);
    const [showSkip, setShowSkip] = useState(false);

    // Đếm ngược
    useEffect(() => {
        if (timeLeft <= 0) {
            navigate(redirectPath, { state: state.passthrough, replace: true });
            return;
        }
        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, navigate, redirectPath, state.passthrough]);

    // Hiện nút "Bỏ qua" sau 3 giây
    useEffect(() => {
        const skipTimer = setTimeout(() => setShowSkip(true), 3000);
        return () => clearTimeout(skipTimer);
    }, []);

    const handleSkip = useCallback(() => {
        navigate(redirectPath, { state: state.passthrough, replace: true });
    }, [navigate, redirectPath, state.passthrough]);

    // Tính toán vòng tròn SVG cho animation
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (timeLeft / totalSeconds) * circumference;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
            {/* Hiệu ứng nền */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative text-center px-6">
                {/* Vòng tròn đếm ngược */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        {/* Vòng nền */}
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="6"
                        />
                        {/* Vòng tiến trình */}
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="white"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    {/* Số giây */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-black text-white drop-shadow-lg">
                            {timeLeft}
                        </span>
                    </div>
                </div>

                {/* Thông báo */}
                <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
                <p className="text-white/70 text-sm mb-8">
                    Vui lòng chờ trong giây lát...
                </p>

                {/* Gợi ý tải app */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 max-w-sm mx-auto">
                    <p className="text-white/90 text-sm">
                        💡 <span className="font-semibold">Mẹo:</span> Tải ứng dụng Windows để ôn tập offline, không quảng cáo!
                    </p>
                </div>

                {/* Nút bỏ qua (xuất hiện sau 3s) */}
                {showSkip && (
                    <button
                        onClick={handleSkip}
                        className="text-white/60 hover:text-white text-sm underline underline-offset-4 transition-colors animate-fade-in"
                    >
                        Bỏ qua →
                    </button>
                )}
            </div>
        </div>
    );
};

export default CountdownAdScreen;
