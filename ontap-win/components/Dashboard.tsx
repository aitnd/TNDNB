import React, { useState } from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpenIcon3D } from './icons';
import { useAppStore } from '../stores/useAppStore';

// Component mới (Phương án C - Hybrid Smart)
import AdminStatsBar from './AdminStatsBar';
import WeatherWidget from './WeatherWidget';
import WelcomeHeader from './WelcomeHeader';
import { useQuickActions, PrimaryButton, ActionTile, SecondaryButton } from './QuickActionsGrid';

// Lazy load GA Analytics widget (chỉ khi user bấm mở)
const CustomAnalyticsWidget = React.lazy(() => import('./CustomAnalyticsWidget'));

import { ChevronDown, ChevronUp } from 'lucide-react';

import { ProgressDashboard } from './ProgressDashboard';
import { getExamHistory } from '../services/historyService';
import type { ExamResult } from '../services/historyService';

interface DashboardProps {
    userProfile: UserProfile;
    onStart: () => void;
    onHistoryClick: () => void;
    onClassClick: () => void;
    onOnlineExamClick?: () => void;
    onNotificationClick?: () => void;
    onStatsClick?: () => void;
    onSettingsClick?: () => void;
    onUserManagerClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    userProfile, onStart, onHistoryClick, onClassClick,
    onOnlineExamClick, onNotificationClick, onStatsClick, onSettingsClick,
    onUserManagerClick
}) => {
    const isMobileApp = useAppStore(state => state.isMobileApp);
    const [isNativeSettingsOpen, setIsNativeSettingsOpen] = useState(false);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

    const userId = useAppStore(s => s.userProfile?.id ?? 'guest');
    const [history, setHistory] = React.useState<ExamResult[]>([]);
    React.useEffect(() => { getExamHistory(userId).then(setHistory); }, [userId]);

    const { theme } = useTheme();

    const userRole = userProfile?.role || 'hoc_vien';
    const isAdminOnly = ['admin', 'quan_ly', 'lanh_dao'].includes(userRole);

    // Hook tính toán quick actions theo role
    const { primaryAction, rightTiles, leftButtons } = useQuickActions({
        userRole,
        onStart,
        onOnlineExamClick,
        onHistoryClick,
        onClassClick,
        onNotificationClick,
        onStatsClick,
        onSettingsClick,
        onUserManagerClick,
    });

    return (
        <div className="min-h-screen flex flex-col items-center px-4 pt-24 pb-6 animate-slide-in-right">
            {/* === Thanh Weather & Online Stats (Stacked Vertically) === */}
            <div className="w-full max-w-4xl flex flex-col gap-2.5 mb-4">
                <WeatherWidget />
                {['admin', 'quan_ly', 'lanh_dao'].includes(userRole) && (
                    <AdminStatsBar userRole={userRole} />
                )}
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* === Cột trái: StudentCard + nút phụ === */}
                <div className="flex flex-col items-center gap-4">
                    <StudentCard user={userProfile} />

                    {/* Nút phụ dưới thẻ: Lịch sử + Quản lý Lớp */}
                    <div className="w-full space-y-2 mt-2">
                        {leftButtons.map((action, idx) => (
                            <SecondaryButton key={action.id} action={action} index={idx} />
                        ))}
                    </div>

                    <div className="w-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl p-4 border border-gray-200/30 dark:border-zinc-700/30">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Tiến bộ học tập</h3>
                        <ProgressDashboard history={history} />
                    </div>
                </div>

                {/* === Cột phải: Welcome + CTA + Tiles === */}
                <div className="bg-card/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-border">
                    {/* Lời chào thông minh */}
                    <WelcomeHeader
                        userName={userProfile.full_name || 'Học viên'}
                        userRole={userRole}
                    />

                    {/* Nút CTA chính */}
                    <div className="mb-4">
                        <PrimaryButton action={primaryAction} />
                    </div>

                    {/* Grid tiles cho admin */}
                    {rightTiles.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {rightTiles.map((action, idx) => (
                                <ActionTile key={action.id} action={action} index={idx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* === GA Analytics thu gọn (chỉ admin) === */}
            {isAdminOnly && (
                <div className="w-full max-w-4xl mt-6">
                    <button
                        onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-card/90 border border-border hover:bg-card transition-all"
                    >
                        <span className="text-sm font-semibold text-muted-foreground">📊 Tổng quan truy cập</span>
                        {isAnalyticsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isAnalyticsOpen && (
                        <div className="mt-2">
                            <React.Suspense fallback={<div className="text-center py-8 text-muted-foreground text-sm">Đang tải...</div>}>
                                <CustomAnalyticsWidget userRole={userRole} />
                            </React.Suspense>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
