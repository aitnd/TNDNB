import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { getActiveSessions, logoutRemoteSession, LoginSession } from '../services/authSessionService';
import { FaLaptop, FaMobileAlt, FaGlobe, FaSignOutAlt, FaHistory, FaShieldAlt } from 'react-icons/fa';
import { ArrowLeftIcon3D } from './icons';
import { toast } from 'sonner';

interface LoginHistoryScreenProps {
    onBack: () => void;
}

const LoginHistoryScreen: React.FC<LoginHistoryScreenProps> = ({ onBack }) => {
    const userProfile = useAppStore(state => state.userProfile);
    const [sessions, setSessions] = useState<LoginSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userProfile) {
            fetchSessions();
        }
    }, [userProfile]);

    const fetchSessions = async () => {
        if (!userProfile) return;
        setLoading(true);
        const data = await getActiveSessions(userProfile.id);
        setSessions(data);
        setLoading(false);
    };

    const handleLogoutSession = async (sessionId: string, isCurrent: boolean) => {
        if (isCurrent) {
            toast.info('Đây là phiên đăng nhập hiện tại của bạn.');
            return;
        }

        const confirm = window.confirm('Bạn có chắc chắn muốn đăng xuất thiết bị này từ xa không?');
        if (!confirm) return;

        const success = await logoutRemoteSession(sessionId);
        if (success) {
            toast.success('Đã đăng xuất thiết bị thành công.');
            fetchSessions();
        } else {
            toast.error('Không thể đăng xuất thiết bị. Vui lòng thử lại.');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right">
            <div className="relative text-center mb-8">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted transition-all duration-300"
                >
                    <ArrowLeftIcon3D className="h-8 w-8 text-primary" />
                </button>
                <div className="h-16 w-16 mx-auto text-primary mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                    <FaShieldAlt className="text-3xl" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Lịch sử đăng nhập</h1>
                <p className="text-sm text-muted-foreground mt-2">
                    Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.
                </p>
            </div>

            <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaHistory className="text-primary" />
                        Các thiết bị đang hoạt động
                    </h2>
                </div>

                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-10 text-center text-muted-foreground">Đang tải dữ liệu...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">Không tìm thấy phiên đăng nhập nào.</div>
                    ) : (
                        sessions.map((session) => (
                            <div key={session.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        {session.deviceName.toLowerCase().includes('windows') || session.deviceName.toLowerCase().includes('mac') ? (
                                            <FaLaptop className="text-2xl" />
                                        ) : (
                                            <FaMobileAlt className="text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground flex items-center gap-2">
                                            {session.deviceName}
                                            {session.isCurrent && (
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold">
                                                    Hiện tại
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex flex-col gap-0.5">
                                            <span className="flex items-center gap-1">
                                                <FaGlobe className="text-[10px]" /> {session.browser} • {session.ip}
                                            </span>
                                            <span>
                                                Đăng nhập: {session.loginAt?.seconds ? new Date(session.loginAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {!session.isCurrent && (
                                    <button
                                        onClick={() => handleLogoutSession(session.id!, false)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                        title="Đăng xuất thiết bị này"
                                    >
                                        <FaSignOutAlt className="text-xl" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                <p className="font-semibold mb-1">💡 Mẹo bảo mật:</p>
                <p>Nếu bạn thấy thiết bị lạ, hãy đăng xuất nó ngay lập tức và đổi mật khẩu để bảo vệ tài khoản.</p>
            </div>
        </div>
    );
};

export default LoginHistoryScreen;
