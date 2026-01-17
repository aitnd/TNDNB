import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaBookOpen, FaUserCog, FaBars, FaHistory, FaSchool, FaUserGraduate, FaExclamationTriangle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
    userProfile: UserProfile | null;
    currentScreen: string;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ userProfile, currentScreen, onNavigate, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (key: string) => {
        if (key === 'dashboard' && (currentScreen === 'dashboard' || currentScreen.startsWith('in_'))) return true;
        if (key === 'account' && currentScreen === 'account') return true;
        return false;
    };

    const handleNavigate = (screen: string) => {
        onNavigate(screen);
        setIsMenuOpen(false);
    };

    // --- MAIN ITEMS (3 Common Buttons) ---
    const primaryItems = [
        {
            name: 'Tin tức',
            icon: FaHome,
            action: () => window.location.href = '/',
            active: false,
            key: 'news'
        },
        {
            name: 'Ôn tập',
            icon: FaBookOpen,
            action: () => handleNavigate('dashboard'),
            active: isActive('dashboard'),
            key: 'dashboard'
        },
        {
            name: 'Tài khoản',
            icon: FaUserCog,
            action: () => handleNavigate('account'),
            active: isActive('account'),
            key: 'account'
        }
    ];

    // --- MENU ITEMS (Hidden behind "More") ---
    const menuItems = [];

    if (userProfile) {
        // 1. History
        menuItems.push({
            name: 'Lịch sử thi',
            icon: FaHistory,
            action: () => handleNavigate('history'),
            color: 'text-purple-600'
        });

        // 2. Class Management (Role based)
        if (['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile.role)) {
            menuItems.push({
                name: 'Quản lý lớp',
                icon: FaSchool,
                action: () => handleNavigate('class_management'),
                color: 'text-indigo-600'
            });
            // Notification Mgmt
            menuItems.push({
                name: 'Quản lý TB',
                icon: FaExclamationTriangle,
                action: () => handleNavigate('notification_mgmt'),
                color: 'text-red-500'
            });
        } else {
            menuItems.push({
                name: 'Lớp của tôi',
                icon: FaUserGraduate,
                action: () => handleNavigate('my_class'),
                color: 'text-green-600'
            });
        }
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            {/* EXPANDABLE MENU (The "Pile") */}
            <div
                ref={menuRef}
                className={`fixed bottom-24 right-4 z-[10000] md:hidden transition-all duration-300 origin-bottom-right ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                    }`}>
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-4 w-56 flex flex-col gap-2">
                    {userProfile ? (
                        <>
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                                Menu mở rộng
                            </div>

                            {menuItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            item.action();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                                    >
                                        <div className={`p-2 rounded-lg bg-gray-50 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 shadow-sm ${item.color}`}>
                                            <Icon />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                                    </button>
                                );
                            })}

                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                            >
                                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <FaSignOutAlt />
                                </div>
                                <span className="text-sm font-medium">Đăng xuất</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                handleNavigate('login');
                                setIsMenuOpen(false);
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            Đăng nhập ngay
                        </button>
                    )}
                </div>
            </div>

            {/* BOTTOM NAVBAR */}
            <div className="fixed bottom-4 left-4 right-4 z-[9999] md:hidden animate-fade-in-up">
                {/* Glassmorphism Container */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-2 flex justify-between items-center relative overflow-hidden">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine pointer-events-none" />

                    {/* 3 Common Items */}
                    {primaryItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.active;

                        return (
                            <button
                                key={item.key}
                                onClick={item.action}
                                className={`relative flex flex-col items-center justify-center w-full py-2 transition-all duration-300 group ${active ? '-translate-y-1' : ''}`}
                            >
                                {active && (
                                    <div className="absolute top-1 w-10 h-10 bg-indigo-500/20 rounded-full blur-md" />
                                )}

                                <Icon
                                    className={`text-2xl mb-1 transition-all duration-300 drop-shadow-sm ${active
                                        ? 'text-indigo-600 dark:text-indigo-400 scale-110 filter drop-shadow-[0_2px_4px_rgba(79,70,229,0.3)]'
                                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                        }`}
                                />

                                <span className={`text-[10px] font-bold transition-all duration-300 ${active
                                    ? 'text-indigo-600 dark:text-indigo-400 opacity-100'
                                    : 'text-gray-400 dark:text-gray-500 opacity-80 group-hover:opacity-100'
                                    }`}>
                                    {item.name}
                                </span>

                                {active && (
                                    <span className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full" />
                                )}
                            </button>
                        );
                    })}

                    {/* 4. MORE BUTTON (Thêm) */}
                    <button
                        onClick={toggleMenu}
                        className={`relative flex flex-col items-center justify-center w-full py-2 transition-all duration-300 group ${isMenuOpen ? '-translate-y-1' : ''}`}
                    >
                        {isMenuOpen && (
                            <div className="absolute top-1 w-10 h-10 bg-orange-500/20 rounded-full blur-md" />
                        )}

                        {isMenuOpen ? (
                            <FaTimes className="text-2xl mb-1 text-orange-600 dark:text-orange-400 scale-110 transition-all duration-300" />
                        ) : (
                            <FaBars className="text-2xl mb-1 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300" />
                        )}


                        <span className={`text-[10px] font-bold transition-all duration-300 ${isMenuOpen
                            ? 'text-orange-600 dark:text-orange-400 opacity-100'
                            : 'text-gray-400 dark:text-gray-500 opacity-80 group-hover:opacity-100'
                            }`}>
                            Thêm
                        </span>
                    </button>

                </div>
            </div>
        </>
    );
};

export default MobileBottomNav;
