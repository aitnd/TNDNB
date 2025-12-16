import React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Newspaper, History, UserCog, LogOut, GraduationCap, School, AlertTriangle, Settings, CheckCircle, Mail } from 'lucide-react';
import UsageConfigPanel from './UsageConfigPanel';
import ChangelogModal from './ChangelogModal';
import NotificationBell from './NotificationBell';

interface TopNavbarProps {
    userProfile: UserProfile | null;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout }) => {
    const [showConfigPanel, setShowConfigPanel] = React.useState(false);
    const [showChangelog, setShowChangelog] = React.useState(false);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 z-40 px-4 shadow-sm flex items-center justify-between transition-colors duration-300">

                {/* LEFT: Navigation Links */}
                <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar">

                    {/* 1. Ôn tập (Về Dashboard) */}
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                        <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-sm md:text-base">Ôn tập</span>
                    </button>

                    {/* 2. Trang chủ (Link ngoài) */}
                    <a
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap decoration-0"
                    >
                        <Newspaper size={18} className="text-teal-600 dark:text-teal-400" />
                        <span className="font-medium text-sm md:text-base">Tin tức</span>
                    </a>

                    {/* 3. Tài khoản */}
                    <button
                        onClick={() => onNavigate('account')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                        <UserCog size={18} className="text-orange-600 dark:text-orange-400" />
                        <span className="font-medium text-sm md:text-base">Tài khoản</span>
                    </button>

                    {/* 3.1 Hộp thư */}
                    <button
                        onClick={() => onNavigate('mailbox')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                        <Mail size={18} className="text-pink-600 dark:text-pink-400" />
                        <span className="font-medium text-sm md:text-base">Hộp thư</span>
                    </button>

                    {/* 4. Lịch sử / Lớp học (Chỉ hiện khi đã đăng nhập) */}
                    {userProfile && (
                        <>
                            {/* Class Navigation based on Role */}
                            {['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role) ? (
                                <button
                                    onClick={() => onNavigate('class_management')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                                >
                                    <School size={18} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="font-medium text-sm md:text-base">Quản lý lớp</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => onNavigate('my_class')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                                >
                                    <GraduationCap size={18} className="text-green-600 dark:text-green-400" />
                                    <span className="font-medium text-sm md:text-base">Lớp của tôi</span>
                                </button>
                            )}

                            {/* Notification Management (Admin/Leader/Manager/Teacher) */}
                            {['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role) && (
                                <button
                                    onClick={() => onNavigate('notification_mgmt')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap border-l border-gray-200 dark:border-gray-700 ml-2 pl-4"
                                >
                                    <AlertTriangle size={18} className="text-red-500 animate-pulse-slow" />
                                    <span className="font-bold text-sm md:text-base text-red-600 dark:text-red-400">Quản lý TB</span>
                                </button>
                            )}

                            {/* Admin Config Button (ONLY ADMIN) */}
                            {userProfile.role === 'admin' && (
                                <button
                                    onClick={() => setShowConfigPanel(true)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap border-l border-gray-200 dark:border-gray-700 ml-2 pl-4"
                                >
                                    <Settings size={18} className="text-purple-600 animate-spin-slow" />
                                    <span className="font-bold text-sm md:text-base text-purple-600 dark:text-purple-400">Cấu hình</span>
                                </button>
                            )}

                            <button
                                onClick={() => onNavigate('history')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                            >
                                <History size={18} className="text-purple-600 dark:text-purple-400" />
                                <span className="font-medium text-sm md:text-base">Lịch sử</span>
                            </button>
                        </>
                    )}
                </div>

                {/* RIGHT: User Info & Logout */}
                <div className="flex items-center gap-3 md:gap-4 ml-4 flex-shrink-0">
                    {userProfile ? (
                        <>
                            <div className="mr-2">
                                <NotificationBell />
                            </div>
                            <div className="hidden md:flex flex-col items-end mr-4">
                                <button
                                    onClick={() => setShowChangelog(true)}
                                    className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    v3.6.0
                                </button>
                            </div>

                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Xin chào,</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white max-w-[150px] truncate">
                                    {userProfile.isVerified || userProfile.courseId ? (
                                        <span className="flex items-center gap-1 text-blue-600">
                                            {userProfile.full_name || userProfile.fullName || '---'} <CheckCircle size={14} className="text-green-500" />
                                        </span>
                                    ) : (
                                        userProfile.full_name || userProfile.fullName || '---'
                                    )}
                                </span>
                            </div>

                            {/* Mobile Icon for User */}
                            <div className="md:hidden text-gray-700 dark:text-gray-200">
                                <GraduationCap size={20} />
                            </div>

                            <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1"></div>

                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-full transition-colors"
                                title="Đăng xuất"
                            >
                                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                <span className="hidden md:inline font-medium text-sm">Thoát</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-md"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
            {showConfigPanel && <UsageConfigPanel onClose={() => setShowConfigPanel(false)} />}
            {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        </>
    );
};

export default TopNavbar;
