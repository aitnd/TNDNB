import React, { useState } from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpenIcon3D } from './icons';

// Component mới (Phương án C - Hybrid Smart)
import AdminStatsBar from './AdminStatsBar';
import WelcomeHeader from './WelcomeHeader';
import { useQuickActions, PrimaryButton, ActionTile, SecondaryButton } from './QuickActionsGrid';

// Lazy load GA Analytics widget (chỉ khi user bấm mở)
const CustomAnalyticsWidget = React.lazy(() => import('./CustomAnalyticsWidget'));

import { ChevronDown, ChevronUp } from 'lucide-react';

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
    const { theme } = useTheme();
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

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
        <div className="min-h-screen flex flex-col items-center p-4 pt-6 animate-slide-in-right">
            {/* === Thanh Online Stats Slim === */}
            <AdminStatsBar userRole={userRole} />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* === Cột trái: StudentCard + nút phụ === */}
                <div className="flex flex-col items-center gap-4">
                    <StudentCard user={userProfile} />

                    {/* Nút phụ dưới thẻ */}
                    <div className="w-full space-y-2">
                        {leftButtons.map((action, idx) => (
                            <SecondaryButton key={action.id} action={action} index={idx} />
                        ))}
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
