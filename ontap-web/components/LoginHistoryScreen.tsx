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
        <div className="w-full max-w-3xl mx-auto p-4 animate-slide-in-right pb-24 pt-20">
            <div className="relative text-center mb-8 pt-4">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-2 rounded-2xl shadow-sm border border-border hover:bg-muted transition-all text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center font-bold"
                    aria-label="Quay lại"
                >
                    <ArrowLeftIcon3D className="h-7 w-7 text-foreground" />
                </button>
                <div className="h-16 w-16 mx-auto text-primary mb-3 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                    <FaShieldAlt className="text-3xl" />
                </div>
                <h1 className="text-2xl font-black text-foreground uppercase tracking-tight">Lịch sử đăng nhập</h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.
                </p>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-border bg-muted/30">
                    <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
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
                                <div className="flex items-center gap-3.5">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                                        {session.deviceName.toLowerCase().includes('windows') || session.deviceName.toLowerCase().includes('mac') ? (
                                            <FaLaptop className="text-xl" />
                                        ) : (
                                            <FaMobileAlt className="text-xl" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-foreground text-sm flex items-center gap-2">
                                            {session.deviceName}
                                            {session.isCurrent && (
                                                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-bold">
                                                    Hiện tại
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex flex-col gap-0.5 mt-0.5">
                                            <span className="flex items-center gap-1 tabular-nums">
                                                <FaGlobe className="text-[10px]" /> {session.browser} • {session.ip}
                                            </span>
                                            <span className="tabular-nums">
                                                Đăng nhập: {session.loginAt?.seconds ? new Date(session.loginAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {!session.isCurrent && (
                                    <button
                                        onClick={() => handleLogoutSession(session.id!, false)}
                                        className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        title="Đăng xuất thiết bị này"
                                        aria-label="Đăng xuất thiết bị này"
                                    >
                                        <FaSignOutAlt className="text-lg" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-sm text-foreground">
                <p className="font-bold text-primary mb-1">💡 Mẹo bảo mật:</p>
                <p className="text-muted-foreground text-xs leading-relaxed">Nếu bạn thấy thiết bị lạ, hãy đăng xuất nó ngay lập tức và đổi mật khẩu để bảo vệ tài khoản.</p>
            </div>
        </div>
    );
};

export default LoginHistoryScreen;
