import React from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { HelmIcon3D, BookOpenIcon3D, ClipboardListIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';

import { useState, useEffect } from 'react';

import OnlineStatsWidget from './OnlineStatsWidget';
import CustomAnalyticsWidget from './CustomAnalyticsWidget';
import NativeSettingsModal from './NativeSettingsModal';
import { Settings } from 'lucide-react';

interface DashboardProps {
    userProfile: UserProfile;
    onStart: () => void;
    onHistoryClick: () => void;
    onClassClick: () => void;
    onOnlineExamClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onStart, onHistoryClick, onClassClick, onOnlineExamClick }) => {
    const { theme } = useTheme();
    const isMobileApp = useAppStore(state => state.isMobileApp);
    const [isNativeSettingsOpen, setIsNativeSettingsOpen] = useState(false);

    // === PREMIUM v2 THEME ===
    if (theme === 'premium') {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center p-4 animate-slide-in-right overflow-hidden transition-colors duration-500">
                {/* Background Decorations */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse-slow" />
                    <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-violet-500/10 blur-[120px] rounded-full animate-bounce-slow" />
                </div>

                <div className="relative z-10 w-full max-w-6xl">
                    {/* Top Widgets */}
                    <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
                        <CustomAnalyticsWidget userRole={userProfile?.role || 'hoc_vien'} />
                        <OnlineStatsWidget userRole={userProfile?.role || 'hoc_vien'} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* LEFT: Student Card */}
                        <div className="lg:col-span-4 flex flex-col items-center">
                            <div className="relative w-full group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 rounded-[32px] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                                <div className="relative">
                                    <StudentCard user={userProfile} />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Main Actions */}
                        <div className="lg:col-span-8">
                            <div className="glass-premium rounded-[40px] p-8 md:p-12 border-white/10 shadow-3xl">
                                <h1 className="text-4xl md:text-5xl font-black mb-4">
                                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                        Xin chào, {userProfile.full_name || 'Học viên'}!
                                    </span>
                                </h1>
                                <p className="text-xl font-medium mb-10 text-slate-500 dark:text-slate-400">
                                    Chúc bạn có một buổi ôn tập hiệu quả và đạt kết quả cao! 🚀
                                </p>

                                {isMobileApp && (
                                    <button 
                                        onClick={() => {
                                            triggerHaptic('light');
                                            setIsNativeSettingsOpen(true);
                                        }}
                                        className="absolute top-8 right-8 p-3 rounded-2xl glass-premium border-white/20 text-slate-400 hover:text-blue-500 transition-all active:scale-90"
                                    >
                                        <Settings size={24} />
                                    </button>
                                )}

                                <div className="grid grid-cols-1 gap-6">
                                    <button
                                        onClick={() => {
                                            triggerHaptic('medium');
                                            onStart();
                                        }}
                                        className="w-full relative group overflow-hidden py-6 px-4 md:px-10 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-2xl hover:shadow-cyan-500/40"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
                                        <div className="relative z-10 flex items-center justify-center gap-4 text-white">
                                            <BookOpenIcon3D className="w-10 h-10 drop-shadow-lg" />
                                            <span className="text-xl md:text-2xl font-black uppercase tracking-tight">Vào Ôn Tập / Thi Thử</span>
                                        </div>
                                    </button>

                                    {/* Admin/Teacher Actions */}
                                    {['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(userProfile?.role || 'hoc_vien') && (
                                        <button
                                            onClick={onOnlineExamClick}
                                            className="w-full relative group overflow-hidden py-5 px-8 rounded-2xl glass-premium border-white/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            <div className="relative z-10 flex items-center justify-center gap-4 text-slate-800 dark:text-white">
                                                <ClipboardListIcon3D className="w-8 h-8 opacity-80 group-hover:opacity-100" />
                                                <span className="text-xl font-bold">Quản lý Thi Trực Tuyến</span>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Secondary Actions Grid */}
                                <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6">
                                    <button 
                                        onClick={() => {
                                            triggerHaptic('light');
                                            onHistoryClick();
                                        }} 
                                        className="group rounded-[32px] p-4 md:p-6 glass-premium border-white/5 hover:bg-white/10 transition-all active:scale-95 text-left relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <ClipboardListIcon3D className="w-16 h-16" />
                                        </div>
                                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-cyan-500 mb-1 md:mb-2">📊 Lịch sử</p>
                                        <p className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100">Xem kết quả</p>
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            triggerHaptic('light');
                                            onClassClick();
                                        }} 
                                        className="group rounded-[32px] p-4 md:p-6 glass-premium border-white/5 hover:bg-white/10 transition-all active:scale-95 text-left relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <HelmIcon3D className="w-16 h-16" />
                                        </div>
                                        <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-violet-500 mb-1 md:mb-2">👥 Lớp học</p>
                                        <p className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                                            {['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(userProfile?.role || 'hoc_vien') ? 'Quản lý' : 'Lớp của con'}
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Native Settings Modal */}
                <NativeSettingsModal 
                    isOpen={isNativeSettingsOpen} 
                    onClose={() => setIsNativeSettingsOpen(false)} 
                />
            </div>
        );
    }

    // === THEME CŨ (giữ nguyên) ===
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-slide-in-right">
            {/* Custom Analytics Widget */}
            <CustomAnalyticsWidget userRole={userProfile?.role || 'hoc_vien'} />

            {/* Realtime Stats for Admin */}
            <OnlineStatsWidget userRole={userProfile?.role || 'hoc_vien'} />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                {/* Left Column: Student Card */}
                <div className="flex flex-col items-center">
                    <StudentCard user={userProfile} />
                </div>

                {/* Right Column: Actions */}
                <div className="bg-card/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-border">
                    <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                        Xin chào, {userProfile.full_name || 'Học viên'}!
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        Chúc bạn có một buổi ôn tập hiệu quả và đạt kết quả cao.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={onStart}
                            className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 px-6 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <BookOpenIcon3D className="w-8 h-8" />
                            <span>Vào Ôn Tập / Thi Thử</span>
                        </button>

                        {/* Admin/Teacher Actions */}
                        {['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(userProfile?.role || 'hoc_vien') && (
                            <button
                                onClick={onOnlineExamClick}
                                className="w-full bg-blue-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                            >
                                <ClipboardListIcon3D className="w-8 h-8" />
                                <span>Quản lý Thi Trực Tuyến</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
