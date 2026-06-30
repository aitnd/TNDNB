import React, { useState } from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';

// Component mới (Phương án C - Hybrid Smart)
import AdminStatsBar from './AdminStatsBar';
import WeatherWidget from './WeatherWidget';
import WelcomeHeader from './WelcomeHeader';
import { useQuickActions, PrimaryButton, ActionTile, SecondaryButton } from './QuickActionsGrid';

// Giữ lại cho trang thống kê, nhưng không import trực tiếp trên dashboard nữa
// import OnlineStatsWidget from './OnlineStatsWidget';
// import CustomAnalyticsWidget from './CustomAnalyticsWidget';

import NativeSettingsModal from './NativeSettingsModal';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load GA Analytics widget (chỉ khi user bấm mở)
const CustomAnalyticsWidget = React.lazy(() => import('./CustomAnalyticsWidget'));

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
    const isMobileApp = useAppStore(state => state.isMobileApp);
    const [isNativeSettingsOpen, setIsNativeSettingsOpen] = useState(false);
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
        onSettingsClick: onSettingsClick || (isMobileApp ? () => setIsNativeSettingsOpen(true) : undefined),
        onUserManagerClick,
    });

    // === PREMIUM THEME — PHƯƠNG ÁN C "HYBRID SMART" ===
    if (theme === 'premium') {
        return (
            <div className="relative min-h-screen flex flex-col items-center px-4 pt-2 pb-6 animate-slide-in-right overflow-hidden transition-colors duration-500">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-violet-500/10 blur-[120px] rounded-full animate-bounce-slow" />
                </div>

                <div className="relative z-10 w-full max-w-6xl">
                    {/* === ROW 1: Weather & Online Stats Banner (Stacked Vertically) === */}
                    <div className="w-full flex flex-col gap-2.5 mb-4">
                        <WeatherWidget />
                        {['admin', 'quan_ly', 'lanh_dao'].includes(userRole) && (
                            <AdminStatsBar userRole={userRole} />
                        )}
                    </div>

                    {/* === ROW 2: Main Content (2 cột) === */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* === CỘT TRÁI (4 col): StudentCard + Nút phụ === */}
                        <div className="lg:col-span-4 flex flex-col items-center gap-4">
                            {/* Thẻ Giáo viên/Học viên — GIỮ NGUYÊN */}
                            <div className="relative w-full group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 rounded-[32px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                                <div className="relative">
                                    <StudentCard user={userProfile} />
                                </div>
                            </div>

                            {/* Nút phụ dưới thẻ: Lịch sử + Quản lý Lớp */}
                            <div className="w-full space-y-2 mt-2">
                                {leftButtons.map((action, idx) => (
                                    <SecondaryButton key={action.id} action={action} index={idx} />
                                ))}
                            </div>
                        </div>

                        {/* === CỘT PHẢI (8 col): Welcome + CTA + Tiles === */}
                        <div className="lg:col-span-8">
                            <div className="glass-premium rounded-[32px] p-6 md:p-10 border-white/10 shadow-3xl relative">
                                {/* Nút Settings (Mobile App) */}
                                {isMobileApp && (
                                    <button
                                        onClick={() => {
                                            triggerHaptic('light');
                                            setIsNativeSettingsOpen(true);
                                        }}
                                        className="absolute top-6 right-6 p-2.5 rounded-xl glass-premium border-white/20 text-slate-400 hover:text-blue-500 transition-all active:scale-90"
                                    >
                                        <Settings size={20} />
                                    </button>
                                )}

                                {/* Lời chào thông minh */}
                                <WelcomeHeader
                                    userName={userProfile.full_name || 'Bạn'}
                                    userRole={userRole}
                                />

                                {/* Nút CTA chính: Vào Ôn Tập */}
                                <div className="mb-6">
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
                                className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md border border-gray-200/30 dark:border-zinc-700/30 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">📊 Tổng quan truy cập</span>
                                    <span className="text-xs text-slate-400">Google Analytics</span>
                                </div>
                                {isAnalyticsOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>

                            <AnimatePresence>
                                {isAnalyticsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden mt-2"
                                    >
                                        <React.Suspense fallback={
                                            <div className="text-center py-8 text-slate-400 text-sm">Đang tải thống kê...</div>
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
    }

    // === THEME CŨ (cũng áp dụng layout Phương án C nhưng đơn giản hơn) ===
    return (
        <div className="min-h-screen flex flex-col items-center px-4 pt-2 pb-6 animate-slide-in-right">
            {/* Thanh Weather & Online Stats (Stacked Vertically) */}
            <div className="w-full max-w-4xl flex flex-col gap-2.5 mb-4">
                <WeatherWidget />
                {['admin', 'quan_ly', 'lanh_dao'].includes(userRole) && (
                    <AdminStatsBar userRole={userRole} />
                )}
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                {/* Cột trái: StudentCard + nút phụ */}
                <div className="flex flex-col items-center gap-4">
                    <StudentCard user={userProfile} />

                    {/* Nút phụ */}
                    <div className="w-full space-y-2">
                        {leftButtons.map((action, idx) => (
                            <SecondaryButton key={action.id} action={action} index={idx} />
                        ))}
                    </div>
                </div>

                {/* Cột phải: Welcome + Actions */}
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

            {/* GA Analytics thu gọn */}
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
