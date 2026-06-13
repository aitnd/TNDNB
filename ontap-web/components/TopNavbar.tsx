import * as React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Newspaper, History, UserCog, LogOut, GraduationCap, School, AlertTriangle, Settings, CheckCircle, Mail, Download, ChevronDown, Utensils, Gamepad2, Award , Compass, ShieldCheck, FileEdit} from 'lucide-react'; 
import ChangelogModal, { getLatestVersion } from './ChangelogModal';
import NotificationBell from './NotificationBell';

// declare const __APP_VERSION__: string; // Removed in favor of dynamic version

interface TopNavbarProps {
    userProfile: UserProfile | null;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout }) => {
    const [showChangelog, setShowChangelog] = React.useState(false);
    const [showLinksDropdown, setShowLinksDropdown] = React.useState(false);
    const [showSystemDropdown, setShowSystemDropdown] = React.useState(false);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 px-4 flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300">

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

                    {/* 2. Lớp học */}
                    {userProfile && (
                        ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile?.role || 'hoc_vien') ? (
                            <button
                                onClick={() => onNavigate('class_management')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                            >
                                <School size={18} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="font-semibold text-sm md:text-base">Quản lý lớp</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onNavigate('my_class')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                            >
                                <GraduationCap size={18} className="text-green-600 dark:text-green-400" />
                                <span className="font-semibold text-sm md:text-base">Lớp của tôi</span>
                            </button>
                        )
                    )}

                    {/* 3. Thi Trực Tuyến */}
                    <button
                        onClick={() => {
                            if (!userProfile) {
                                onNavigate('thi_truc_tuyen');
                            } else if (['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(userProfile?.role || 'hoc_vien')) {
                                onNavigate('online_exam_management');
                            } else {
                                onNavigate('thi_truc_tuyen');
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                        <FileEdit size={18} className="text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-sm md:text-base">Thi trực tuyến</span>
                    </button>

                    {/* Giám khảo */}
                    {userProfile && ['admin', 'giao_vien', 'quan_ly', 'lanh_dao'].includes(userProfile.role) && (
                        <button
                            onClick={() => onNavigate('giam_khao')}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors whitespace-nowrap border border-amber-200 dark:border-amber-500/20"
                        >
                            <Award size={18} className="text-amber-600 dark:text-amber-400" />
                            <span className="font-bold text-sm md:text-base">Giám khảo</span>
                        </button>
                    )}

                    {/* Dropdown "Khám phá" */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                            onBlur={() => setTimeout(() => setShowLinksDropdown(false), 200)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                        >
                            <Compass size={18} className="text-teal-600 dark:text-teal-400" />
                            <span className="font-semibold text-sm md:text-base">Khám phá</span>
                            <ChevronDown size={16} className={`transition-transform ${showLinksDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showLinksDropdown && (
                            <div className="fixed mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-[100]" style={{ top: '56px' }}>
                                {/* Giải trí */}
                                {userProfile && (
                                    <button onClick={() => { setShowLinksDropdown(false); onNavigate('giaitri'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Gamepad2 size={18} className="text-emerald-500" />
                                        <span className="font-semibold text-sm">Giải trí (VIP)</span>
                                    </button>
                                )}
                                {/* Tin tức */}
                                <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                    <Newspaper size={18} className="text-blue-500" />
                                    <span className="font-medium text-sm">Tin tức</span>
                                </a>
                                {/* Tải App */}
                                <button onClick={() => { setShowLinksDropdown(false); onNavigate('download_app'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                                    <Download size={18} className="text-green-500" />
                                    <span className="font-medium text-sm">Tải App học offline</span>
                                </button>
                                {/* Ẩm thực */}
                                <a href="/amthuc" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                        <Utensils size={18} className="text-orange-500" />
                                        <span className="font-medium text-sm">Ẩm thực Ninh Bình</span>
                                    </a>
                            </div>
                        )}
                    </div>

                    {/* Dropdown "Hệ thống" (chỉ cho quản lý) */}
                    {userProfile && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role) && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSystemDropdown(!showSystemDropdown)}
                                onBlur={() => setTimeout(() => setShowSystemDropdown(false), 200)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap border-l border-gray-200 dark:border-gray-700 md:ml-2 pl-4"
                            >
                                <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
                                <span className="font-semibold text-sm md:text-base">Hệ thống</span>
                                <ChevronDown size={16} className={`transition-transform ${showSystemDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showSystemDropdown && (
                                <div className="fixed mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 min-w-[200px] z-[100]" style={{ top: '56px' }}>
                                    <button onClick={() => { setShowSystemDropdown(false); onNavigate('notification_mgmt'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                                        <AlertTriangle size={18} className="text-red-500" />
                                        <span className="font-medium text-sm">Quản lý TB</span>
                                    </button>
                                    {userProfile.role === 'admin' && (
                                        <button onClick={() => { setShowSystemDropdown(false); onNavigate('config'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                                            <Settings size={18} className="text-purple-500" />
                                            <span className="font-medium text-sm">Cấu hình</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT: User Info & Logout */}
                <div className="flex items-center gap-2 md:gap-4 ml-4 flex-shrink-0">
                    
                    {userProfile ? (
                        <>
                            {/* Actions (Mail, History, Bell) */}
                            <div className="flex items-center gap-1 md:gap-2 mr-0 md:mr-2">
                                <button
                                    onClick={() => onNavigate('mailbox')}
                                    className="p-1.5 md:p-2 text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                                    title="Hộp thư"
                                >
                                    <Mail size={20} />
                                </button>
                                <button
                                    onClick={() => onNavigate('history')}
                                    className="p-1.5 md:p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                                    title="Lịch sử"
                                >
                                    <History size={20} />
                                </button>
                                <NotificationBell />
                            </div>

                            <div className="hidden md:flex flex-col items-end mr-2">
                                <button
                                    onClick={() => setShowChangelog(true)}
                                    className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    v{getLatestVersion()}
                                </button>
                            </div>

                            {/* User Account Button */}
                            <button 
                                onClick={() => onNavigate('account')}
                                className="hidden md:flex flex-col items-end justify-center hover:opacity-80 transition-opacity text-right cursor-pointer"
                                title="Quản lý tài khoản"
                            >
                                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Xin chào,</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white max-w-[150px] truncate leading-tight mt-0.5">
                                    <span className={`flex items-center gap-1 font-bold ${userProfile?.role === 'giao_vien' ? 'text-yellow-600 dark:text-yellow-400' :
                                        userProfile?.role === 'quan_ly' || userProfile?.role === 'lanh_dao' ? 'text-red-600 dark:text-red-400' :
                                            userProfile?.role === 'admin' ? 'text-purple-600 dark:text-purple-400' :
                                                'text-blue-600'
                                        }`}>
                                        {userProfile.full_name || userProfile.fullName || '---'}
                                        {userProfile?.role === 'hoc_vien' && (userProfile.isVerified || userProfile.courseId) && <CheckCircle size={14} className="text-green-500" />}
                                    </span>
                                </span>
                            </button>

                            {/* Mobile Icon for Account */}
                            <button onClick={() => onNavigate('account')} className="md:hidden text-gray-700 dark:text-gray-200 mx-1">
                                <UserCog size={20} />
                            </button>

                            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1 md:mx-2"></div>

                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-2 text-red-500 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 px-3 py-2 md:px-4 rounded-xl transition-all border border-red-500/10"
                                title="Đăng xuất"
                            >
                                <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                <span className="hidden md:inline font-bold text-sm">Thoát</span>
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
            {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        </>
    );
};

export default TopNavbar;
