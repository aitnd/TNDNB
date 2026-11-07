import React, { useState } from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';

// Component mới (Phương án C - Hybrid Smart)
import AdminStatsBar from './AdminStatsBar';
import WeatherWidget from './WeatherWidget';
import WelcomeHeader from './WelcomeHeader';
import { useQuickActions, PrimaryButton, ActionTile, SecondaryButton } from './QuickActionsGrid';

import NativeSettingsModal from './NativeSettingsModal';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ProgressDashboard } from './ProgressDashboard';
import { getExamHistory } from '../services/historyService';
import type { ExamResult } from '../services/historyService';

// Lazy load GA Analytics widget (chỉ khi user bấm mở)
const CustomAnalyticsWidget = React.lazy(() => import('./CustomAnalyticsWidget'));

export interface DashboardProps {
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

    const userRole = userProfile.role || 'hoc_vien';
    const isAdminOnly = ['admin', 'quan_ly', 'lanh_dao'].includes(userRole);

    const [history, setHistory] = React.useState<ExamResult[]>([]);
    React.useEffect(() => {
        if (userProfile?.id) {
            getExamHistory(userProfile.id).then(setHistory).catch(() => {});
        }
    }, [userProfile?.id]);

    const { primaryAction, rightTiles, leftButtons } = useQuickActions({
        userRole,
        onStart,
        onOnlineExamClick,
        onHistoryClick,
        onClassClick,
        onNotificationClick,
        onStatsClick,
        onSettingsClick: onSettingsClick || (isMobileApp ? () => setIsNativeSettingsOpen(true) : undefined),
        onUserManagerClick,
    });

    return (
        <div className="relative min-h-screen flex flex-col items-center px-4 pt-2 pb-6 animate-slide-in-right overflow-hidden transition-colors">
            <div className="relative z-10 w-full max-w-6xl">
                {/* === ROW 1: Weather & Online Stats Banner (Stacked Vertically) === */}
                <div className="w-full flex flex-col gap-2.5 mb-4">
                    <div className="hidden lg:block">
                        <WeatherWidget />
                    </div>
                    {['admin', 'quan_ly', 'lanh_dao'].includes(userRole) && (
                        <AdminStatsBar userRole={userRole} />
                    )}
                </div>

                {/* === ROW 2: Main Content (Bento Asymmetric 12-Col) === */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* === CỘT TRÁI (4 col): StudentCard + Nút phụ + Tiến bộ === */}
                    <div className="lg:col-span-4 flex flex-col items-center gap-4">
                        {/* Thẻ Giáo viên/Học viên */}
                        <div className="w-full">
                            <StudentCard user={userProfile} />
                        </div>

                        {/* Nút Thi Lớn Ưu Tiên Số 1 Cho Mobile: Xuất hiện ngay lập tức dưới Thẻ Học Viên */}
                        <div className="w-full mt-3 mb-2 lg:hidden">
                            <PrimaryButton action={primaryAction} />
                        </div>

                        {/* Nút phụ dưới thẻ: Lịch sử + Quản lý Lớp */}
                        <div className="w-full space-y-2">
                            {leftButtons.map((action, idx) => (
                                <SecondaryButton key={action.id} action={action} index={idx} />
                            ))}
                        </div>

                        {/* Thẻ tiến bộ học tập */}
                        <div className="w-full bg-card text-card-foreground rounded-2xl p-5 border border-border shadow-xs hidden lg:block">
                            <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">Tiến bộ học tập</h3>
                            <ProgressDashboard history={history} />
                        </div>
                    </div>

                    {/* === CỘT PHẢI (8 col): Welcome + CTA + Tiles === */}
                    <div className="lg:col-span-8">
                        <div className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 border border-border shadow-xs relative">
                            {/* Nút Settings (Mobile App) */}
                            {isMobileApp && (
                                <button
                                    onClick={() => {
                                        triggerHaptic('light');
                                        setIsNativeSettingsOpen(true);
                                    }}
                                    className="absolute top-6 right-6 p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-all active:scale-95 border border-border"
                                    aria-label="Cài đặt"
                                >
                                    <Settings size={20} />
                                </button>
                            )}

                            {/* Lời chào thông minh */}
                            <WelcomeHeader
                                userName={userProfile.full_name || 'Bạn'}
                                userRole={userRole}
                            />

                            {/* Nút CTA chính: Vào Ôn Tập (Chỉ hiện ở cột phải trên desktop, mobile đã có ở cột trái) */}
                            <div className="mb-6 hidden lg:block">
                                <PrimaryButton action={primaryAction} />
                            </div>

                            {/* Grid tiles 2x2 cho admin */}
                            {rightTiles.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {rightTiles.map((action, idx) => (
                                        <ActionTile key={action.id} action={action} index={idx} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* === ROW 3: GA Analytics Thu Gọn (chỉ admin) === */}
                {isAdminOnly && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6"
                    >
                        <button
                            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
                            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-card border border-border hover:bg-secondary/60 text-card-foreground transition-all shadow-xs"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">📊 Tổng quan truy cập</span>
                                <span className="text-xs text-muted-foreground">Google Analytics</span>
                            </div>
                            {isAnalyticsOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                        </button>

                        <AnimatePresence>
                            {isAnalyticsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden mt-2 bg-card border border-border rounded-2xl p-4 shadow-xs"
                                >
                                    <React.Suspense fallback={
                                        <div className="text-center py-8 text-muted-foreground text-sm">Đang tải thống kê...</div>
                                    }>
                                        <CustomAnalyticsWidget userRole={userRole} />
                                    </React.Suspense>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Native Settings Modal */}
            <NativeSettingsModal
                isOpen={isNativeSettingsOpen}
                onClose={() => setIsNativeSettingsOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
