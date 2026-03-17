import * as React from 'react';
import { UserProfile } from '../types';
import { 
  BookOpen, 
  Newspaper, 
  History, 
  UserCog, 
  LogOut, 
  GraduationCap, 
  School, 
  AlertTriangle, 
  Settings, 
  CheckCircle, 
  Mail, 
  Download, 
  ChevronDown, 
  Link2, 
  Utensils, 
  Gamepad2 
} from 'lucide-react';
import ChangelogModal, { getLatestVersion } from './ChangelogModal';
import NotificationBell from './NotificationBell';
import { AnchorIcon3D } from './icons';

interface TopNavbarProps {
    userProfile: UserProfile | null;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ userProfile, onNavigate, onLogout }) => {
    const [showChangelog, setShowChangelog] = React.useState(false);
    const [showLinksDropdown, setShowLinksDropdown] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItemClass = "relative flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300 group whitespace-nowrap font-medium";
    const activeIndicator = "absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary rounded-full group-hover:w-4 transition-all duration-300";

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-8 py-3 ${
                isScrolled ? 'top-2' : 'top-0'
            }`}>
                <div className={`mx-auto max-w-7xl h-16 rounded-[2rem] flex items-center justify-between px-6 transition-all duration-500 ${
                    isScrolled 
                    ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.1)]' 
                    : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 dark:border-white/5'
                }`}>
                    
                    {/* LEFT: Logo & Main Nav */}
                    <div className="flex items-center gap-2 md:gap-6 overflow-x-auto no-scrollbar py-2">
                        {/* Logo / Home */}
                        <button 
                            onClick={() => onNavigate('dashboard')}
                            className="flex items-center gap-3 mr-4 group"
                        >
                            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-blue-600 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                <AnchorIcon3D className="h-6 w-6 text-white" />
                            </div>
                            <span className="hidden lg:block font-black text-xl tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                TND<span className="text-primary">NB</span>
                            </span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />

                        {/* Navigation Items */}
                        <button onClick={() => onNavigate('dashboard')} className={navItemClass}>
                            <BookOpen size={18} className="text-blue-500" />
                            <span>Ôn tập</span>
                            <div className={activeIndicator} />
                        </button>

                        <button onClick={() => onNavigate('thi_truc_tuyen')} className={navItemClass}>
                            <Newspaper size={18} className="text-red-500" />
                            <span>Thi trực tuyến</span>
                            <div className={activeIndicator} />
                        </button>

                        {/* Giám khảo (VIP/Role-based) */}
                        <button 
                            onClick={() => onNavigate('giam_khao')}
                            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl group transition-all duration-500 transform hover:-translate-y-0.5 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-90 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent_60%)]" />
                            <div className="relative z-10 flex items-center gap-2 text-slate-900">
                                <School size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="font-black text-sm uppercase tracking-wider">Giám khảo</span>
                            </div>
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
                        </button>

                        <div className="relative group">
                            <button 
                                onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                                onBlur={() => setTimeout(() => setShowLinksDropdown(false), 200)}
                                className={navItemClass}
                            >
                                <Link2 size={18} className="text-pink-500" />
                                <span>Tiện ích</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${showLinksDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {showLinksDropdown && (
                                <div className="absolute left-0 mt-4 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl py-3 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <button onClick={() => onNavigate('download_app')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left text-slate-700 dark:text-slate-300">
                                        <Download size={18} className="text-green-500" />
                                        <span className="font-medium text-sm">Tải ứng dụng Offline</span>
                                    </button>
                                    <a href="/amthuc" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-slate-700 dark:text-slate-300">
                                        <Utensils size={18} className="text-orange-500" />
                                        <span className="font-medium text-sm">Ẩm thực Ninh Bình</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {userProfile && (
                            <button onClick={() => onNavigate('giaitri')} className={`${navItemClass} text-emerald-600 dark:text-emerald-400 font-bold`}>
                                <Gamepad2 size={18} className="animate-bounce-slow" />
                                <span>Giải trí</span>
                            </button>
                        )}
                    </div>

                    {/* RIGHT: User Actions */}
                    <div className="flex items-center gap-3 md:gap-5 ml-4 flex-shrink-0">
                        {userProfile ? (
                            <>
                                <NotificationBell />
                                
                                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Thành viên</span>
                                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onNavigate('account')}>
                                        <span className={`text-sm font-black transition-colors ${
                                            userProfile.role === 'admin' ? 'text-purple-500' :
                                            ['lanh_dao', 'quan_ly'].includes(userProfile.role || '') ? 'text-red-500' :
                                            userProfile.role === 'giao_vien' ? 'text-amber-500' : 'text-primary'
                                        }`}>
                                            {userProfile.full_name || userProfile.fullName}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border border-white/10 shadow-sm overflow-hidden transform group-hover:scale-110 transition-transform">
                                            <UserCog size={16} className="text-slate-600 dark:text-slate-400" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onLogout}
                                    className="p-2.5 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 shadow-sm group"
                                    title="Đăng xuất"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => onNavigate('login')}
                                className="relative px-6 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 active:scale-95 overflow-hidden group"
                            >
                                <div className="relative z-10">Đăng nhập</div>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} />}
        </>
    );
};

export default TopNavbar;
