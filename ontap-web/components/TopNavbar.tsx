import * as React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Newspaper, History, UserCog, LogOut, GraduationCap, School, AlertTriangle, Settings, CheckCircle, Mail, Download, ChevronDown, Utensils, Gamepad2, Award, Compass, ShieldCheck, FileEdit } from 'lucide-react'; 
import ChangelogModal, { getLatestVersion } from './ChangelogModal';
import NotificationBell from './NotificationBell';
import { MiniRoleBadge } from './Badges/MiniRoleBadge';

interface TopNavbarProps {
    userProfile: UserProfile | null;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout }) => {
    const [showChangelog, setShowChangelog] = React.useState(false);
    const [showLinksDropdown, setShowLinksDropdown] = React.useState(false);
    const [showSystemDropdown, setShowSystemDropdown] = React.useState(false);
    const [latestVersion, setLatestVersion] = React.useState<string>('...');

    React.useEffect(() => {
        getLatestVersion()
            .then((ver) => setLatestVersion(ver && ver !== "0.0.0" ? ver : "3.19.2"))
            .catch(() => setLatestVersion('3.19.2'));
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-md z-50 px-4 flex items-center justify-between h-16 border-b border-border shadow-sm transition-colors text-foreground">

                {/* LEFT: Navigation Links */}
                <div className="flex items-center gap-1 md:gap-3 overflow-x-auto no-scrollbar">

                    {/* 1. Ôn tập (Về Dashboard) */}
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-foreground font-semibold hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                    >
                        <BookOpen size={18} className="text-primary" />
                        <span className="text-sm md:text-base">Ôn tập</span>
                    </button>

                    {/* Dành cho Học viên: Nút Lớp của tôi & Thi trực tuyến gọn nhẹ */}
                    {userProfile && userProfile.role === 'hoc_vien' && (
                        <>
                            <button
                                onClick={() => onNavigate('my_class')}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                            >
                                <GraduationCap size={18} className="text-emerald-600 dark:text-emerald-400" />
                                <span className="font-semibold text-sm md:text-base">Lớp của tôi</span>
                            </button>
                            <button
                                onClick={() => onNavigate('thi_truc_tuyen')}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                            >
                                <FileEdit size={18} className="text-rose-600 dark:text-rose-400" />
                                <span className="font-semibold text-sm md:text-base">Thi trực tuyến</span>
                            </button>
                        </>
                    )}

                    {/* Dropdown "Hệ thống / Quản lý" (Dành cho Giáo viên, Quản lý, Lãnh đạo, Admin) */}
                    {userProfile && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role) && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSystemDropdown(!showSystemDropdown)}
                                onBlur={() => setTimeout(() => setShowSystemDropdown(false), 200)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                            >
                                <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="font-semibold text-sm md:text-base">Hệ thống</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${showSystemDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showSystemDropdown && (
                                <div className="fixed mt-1 bg-card border border-border rounded-xl shadow-xl py-2 min-w-[200px] z-[100] text-card-foreground" style={{ top: '56px' }}>
                                    <button onClick={() => { setShowSystemDropdown(false); onNavigate('class_management'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                        <School size={18} className="text-indigo-500" />
                                        <span className="font-medium text-sm">Quản lý lớp</span>
                                    </button>
                                    <button onClick={() => { setShowSystemDropdown(false); onNavigate('online_exam_management'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                        <FileEdit size={18} className="text-rose-500" />
                                        <span className="font-medium text-sm">Thi trực tuyến</span>
                                    </button>
                                    <button onClick={() => { setShowSystemDropdown(false); onNavigate('giam_khao'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                        <Award size={18} className="text-amber-500" />
                                        <span className="font-medium text-sm">Giám khảo</span>
                                    </button>
                                    <button onClick={() => { setShowSystemDropdown(false); onNavigate('notification_mgmt'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                        <AlertTriangle size={18} className="text-orange-500" />
                                        <span className="font-medium text-sm">Quản lý TB</span>
                                    </button>
                                    {userProfile.role === 'admin' && (
                                        <button onClick={() => { setShowSystemDropdown(false); onNavigate('config'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                            <Settings size={18} className="text-purple-500" />
                                            <span className="font-medium text-sm">Cấu hình</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dropdown "Khám phá" */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                            onBlur={() => setTimeout(() => setShowLinksDropdown(false), 200)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                        >
                            <Compass size={18} className="text-teal-600 dark:text-teal-400" />
                            <span className="font-semibold text-sm md:text-base">Khám phá</span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${showLinksDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showLinksDropdown && (
                            <div className="fixed mt-1 bg-card border border-border rounded-xl shadow-xl py-2 min-w-[200px] z-[100] text-card-foreground" style={{ top: '56px' }}>
                                {/* Giải trí */}
                                {userProfile && (
                                    <button onClick={() => { setShowLinksDropdown(false); onNavigate('giaitri'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                        <Gamepad2 size={18} className="text-emerald-500" />
                                        <span className="font-semibold text-sm">Giải trí</span>
                                    </button>
                                )}
                                {/* Tin tức */}
                                <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                    <Newspaper size={18} className="text-primary" />
                                    <span className="font-medium text-sm">Cổng Tin tức</span>
                                </a>
                                {/* Tải App */}
                                <button onClick={() => { setShowLinksDropdown(false); onNavigate('download_app'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left">
                                    <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    <span className="font-medium text-sm">Tải App học offline</span>
                                </button>
                                {/* Ẩm thực */}
                                <a href="https://thodia.hlstudio.top" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                    <Utensils size={18} className="text-orange-500" />
                                    <span className="font-medium text-sm">Thổ Địa Ninh Bình</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: User Info & Logout */}
                <div className="flex items-center gap-2 md:gap-3 ml-4 flex-shrink-0">
                    
                    {userProfile ? (
                        <>
                            {/* Actions (Mail, History, Bell) */}
                            <div className="flex items-center gap-1 md:gap-2 mr-0 md:mr-1">
                                <button
                                    onClick={() => onNavigate('mailbox')}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary min-h-[40px] min-w-[40px] flex items-center justify-center"
                                    title="Hộp thư"
                                    aria-label="Hộp thư"
                                >
                                    <Mail size={19} />
                                </button>
                                <button
                                    onClick={() => onNavigate('history')}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary min-h-[40px] min-w-[40px] flex items-center justify-center"
                                    title="Lịch sử thi thử"
                                    aria-label="Lịch sử"
                                >
                                    <History size={19} />
                                </button>
                                <NotificationBell />
                            </div>

                            <div className="hidden md:flex flex-col items-end mr-1">
                                <button
                                    onClick={() => setShowChangelog(true)}
                                    className="text-xs font-semibold text-muted-foreground hover:text-primary tabular-nums transition-colors"
                                >
                                    v{latestVersion}
                                </button>
                            </div>

                            {/* User Account Button */}
                            <button 
                                onClick={() => onNavigate('account')}
                                className="hidden md:flex flex-col items-end justify-center hover:opacity-85 transition-opacity text-right cursor-pointer"
                                title="Quản lý tài khoản"
                            >
                                <span className="text-[11px] text-muted-foreground leading-tight">Xin chào,</span>
                                <span className="text-sm font-bold text-foreground max-w-[150px] truncate leading-tight mt-0.5">
                                    <span className={`flex items-center gap-1 font-bold ${
                                        userProfile?.role === 'giao_vien' ? 'text-amber-600 dark:text-amber-400' :
                                        userProfile?.role === 'quan_ly' || userProfile?.role === 'lanh_dao' ? 'text-rose-600 dark:text-rose-400' :
                                        userProfile?.role === 'admin' ? 'text-purple-600 dark:text-purple-400' :
                                        'text-primary'
                                    }`}>
                                        {userProfile.full_name || userProfile.fullName || '---'}
                                        {userProfile?.role === 'hoc_vien' && (userProfile.isVerified || userProfile.courseId) && <CheckCircle size={14} className="text-emerald-500" />}
                                        {userProfile?.role && <MiniRoleBadge role={userProfile.role} className="ml-1" />}
                                    </span>
                                </span>
                            </button>

                            {/* Mobile Icon for Account */}
                            <button onClick={() => onNavigate('account')} className="md:hidden text-foreground p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-secondary" aria-label="Tài khoản">
                                <UserCog size={20} />
                            </button>

                            <div className="h-6 w-[1px] bg-border mx-1"></div>

                            <button
                                onClick={onLogout}
                                className="group flex items-center gap-2 text-destructive bg-destructive/10 hover:bg-destructive/15 px-3 py-2 rounded-xl transition-all border border-destructive/20 min-h-[40px]"
                                title="Đăng xuất"
                            >
                                <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
                                <span className="hidden md:inline font-bold text-sm">Thoát</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm min-h-[40px]"
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
