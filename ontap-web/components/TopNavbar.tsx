import * as React from 'react';
import { UserProfile } from '../types';
import { BookOpen, Newspaper, History, UserCog, LogOut, GraduationCap, School, AlertTriangle, Settings, CheckCircle, Mail, Download, ChevronDown, Utensils, Gamepad2, Award, Compass, ShieldCheck, FileEdit, Menu, X } from 'lucide-react'; 
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
    const [showHamburgerMenu, setShowHamburgerMenu] = React.useState(false);
    const [latestVersion, setLatestVersion] = React.useState<string>('...');
    const hamburgerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        getLatestVersion()
            .then((ver) => setLatestVersion(ver && ver !== "0.0.0" ? ver : "3.19.2"))
            .catch(() => setLatestVersion('3.19.2'));
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
                setShowHamburgerMenu(false);
            }
        };
        if (showHamburgerMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showHamburgerMenu]);

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
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap min-h-[40px]"
                            >
                                <FileEdit size={18} className="text-rose-600 dark:text-rose-400" />
                                <span className="font-semibold text-sm md:text-base">Thi trực tuyến</span>
                            </button>
                        </>
                    )}

                    {/* Dropdown "Hệ thống / Quản lý" (Dành cho Giáo viên, Quản lý, Lãnh đạo, Admin) */}
                    {userProfile && ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role) && (
                        <div className="relative hidden md:flex">
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
                    <div className="relative hidden md:flex">
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
                <div className="flex items-center gap-1.5 md:gap-3 ml-2 md:ml-4 flex-shrink-0">
                    
                    {userProfile ? (
                        <>
                            {/* Actions (Mail, History, Bell) */}
                            <div className="flex items-center gap-1 md:gap-2 mr-0 md:mr-1">
                                <button
                                    onClick={() => onNavigate('mailbox')}
                                    className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary min-h-[40px] min-w-[40px] items-center justify-center"
                                    title="Hộp thư"
                                    aria-label="Hộp thư"
                                >
                                    <Mail size={19} />
                                </button>
                                <button
                                    onClick={() => onNavigate('history')}
                                    className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary min-h-[40px] min-w-[40px] items-center justify-center"
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

                            {/* User Account Button (Desktop) */}
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

                            <div className="h-6 w-[1px] bg-border mx-1 hidden md:block"></div>

                            {/* Standalone Logout Button (Desktop) */}
                            <button
                                onClick={onLogout}
                                className="group hidden md:flex items-center gap-2 text-destructive bg-destructive/10 hover:bg-destructive/15 px-3 py-2 rounded-xl transition-all border border-destructive/20 min-h-[40px]"
                                title="Đăng xuất"
                            >
                                <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
                                <span className="font-bold text-sm">Thoát</span>
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

                    {/* Hamburger Menu 3 gạch (Mobile & Quick Access) */}
                    <div className="relative" ref={hamburgerRef}>
                        <button
                            onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                            className="p-2 rounded-xl text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-border/60"
                            aria-label="Menu"
                            title="Menu tác vụ"
                        >
                            {showHamburgerMenu ? <X size={22} className="text-primary" /> : <Menu size={22} className="text-primary" />}
                        </button>

                        {/* Dropdown Panel */}
                        {showHamburgerMenu && (
                            <div className="fixed right-3 top-16 w-72 max-w-[calc(100vw-24px)] bg-card/98 backdrop-blur-xl border border-border rounded-2xl shadow-2xl py-3 z-[150] text-card-foreground animate-in fade-in zoom-in-95 duration-150">
                                {/* Header thông tin người dùng */}
                                {userProfile && (
                                    <div className="px-4 py-3 border-b border-border mb-2 bg-muted/40 rounded-t-xl">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-base text-foreground truncate">
                                                {userProfile.full_name || userProfile.fullName || 'Học viên'}
                                            </span>
                                            {userProfile?.role === 'hoc_vien' && (userProfile.isVerified || userProfile.courseId) && (
                                                <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {userProfile?.role && <MiniRoleBadge role={userProfile.role} />}
                                            <span className="text-xs text-muted-foreground truncate">
                                                {userProfile.email || userProfile.username || ''}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Menu Items */}
                                <div className="space-y-0.5 px-2">
                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('account'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <UserCog size={18} className="text-primary" />
                                        <span>Quản lý tài khoản</span>
                                    </button>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('mailbox'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Mail size={18} className="text-primary" />
                                        <span>Hộp thư cá nhân</span>
                                    </button>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('history'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <History size={18} className="text-primary" />
                                        <span>Lịch sử thi thử</span>
                                    </button>

                                    {userProfile?.role === 'hoc_vien' && (
                                        <button
                                            onClick={() => { setShowHamburgerMenu(false); onNavigate('thi_truc_tuyen'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                        >
                                            <FileEdit size={18} className="text-rose-600 dark:text-rose-400" />
                                            <span>Kỳ thi trực tuyến</span>
                                        </button>
                                    )}

                                    {/* Nhóm Khám Phá & Tiện Ích */}
                                    <div className="border-t border-border my-2" />
                                    <div className="px-3 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                        Khám phá & Tiện ích
                                    </div>

                                    <a
                                        href="/"
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Newspaper size={18} className="text-primary" />
                                        <span>Cổng Tin tức & Thông báo</span>
                                    </a>

                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); onNavigate('download_app'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Download size={18} className="text-emerald-600 dark:text-emerald-400" />
                                        <span>Tải App học offline</span>
                                    </button>

                                    {userProfile && (
                                        <button
                                            onClick={() => { setShowHamburgerMenu(false); onNavigate('giaitri'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                        >
                                            <Gamepad2 size={18} className="text-indigo-500" />
                                            <span>Khu giải trí & Trò chơi</span>
                                        </button>
                                    )}

                                    <a
                                        href="https://thodia.hlstudio.top"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-secondary transition-colors text-left font-medium text-sm min-h-[44px]"
                                    >
                                        <Utensils size={18} className="text-orange-500" />
                                        <span>Thổ Địa Ninh Bình</span>
                                    </a>

                                    {/* Phiên bản hệ thống */}
                                    <div className="border-t border-border my-2" />
                                    <button
                                        onClick={() => { setShowHamburgerMenu(false); setShowChangelog(true); }}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    >
                                        <span>Phiên bản hệ thống</span>
                                        <span className="tabular-nums font-mono text-primary">v{latestVersion}</span>
                                    </button>

                                    {/* Nút Đăng xuất */}
                                    {userProfile ? (
                                        <>
                                            <div className="border-t border-border my-2" />
                                            <button
                                                onClick={() => { setShowHamburgerMenu(false); onLogout(); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-left font-bold text-sm min-h-[44px]"
                                            >
                                                <LogOut size={18} />
                                                <span>Đăng xuất</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="border-t border-border my-2" />
                                            <button
                                                onClick={() => { setShowHamburgerMenu(false); onNavigate('login'); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm min-h-[44px] justify-center shadow-sm"
                                            >
                                                <span>Đăng nhập</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        </>
    );
};

export default TopNavbar;
