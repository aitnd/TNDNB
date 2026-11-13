import React, { useState, useRef, useEffect } from 'react';
import { FaHome, FaUserCog, FaBars, FaHistory, FaSchool, FaUserGraduate, FaExclamationTriangle, FaSignOutAlt, FaTimes, FaEnvelope } from 'react-icons/fa';

import { UserProfile } from '../types';
import { triggerHaptic } from '../utils/nativeUX';
import ThemeSwitcher from './ThemeSwitcher';

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

    const isTeacher = ['admin', 'lanh_dao', 'quan_ly', 'giao_vien'].includes(userProfile?.role || '');

    const isActive = (key: string) => {
        if (key === 'dashboard' && (currentScreen === 'dashboard' || currentScreen.startsWith('in_'))) return true;
        if (key === 'history' && currentScreen === 'history') return true;
        if (key === 'class' && (currentScreen === 'class_management' || currentScreen === 'my_class')) return true;
        return false;
    };

    const handleNavigate = (screen: string) => {
        triggerHaptic('light');
        onNavigate(screen);
        setIsMenuOpen(false);
    };

    // --- MAIN ITEMS (3 Common Buttons) ---
    const primaryItems = [
        {
            name: 'Trang chủ',
            icon: FaHome,
            action: () => handleNavigate('dashboard'),
            active: isActive('dashboard'),
            key: 'dashboard'
        },
        {
            name: 'Lịch sử',
            icon: FaHistory,
            action: () => handleNavigate('history'),
            active: isActive('history'),
            key: 'history'
        },
        {
            name: 'Lớp học',
            icon: isTeacher ? FaSchool : FaUserGraduate,
            action: () => handleNavigate(isTeacher ? 'class_management' : 'my_class'),
            active: isActive('class'),
            key: 'class'
        }
    ];

    // --- MENU ITEMS (Hidden behind "More") ---
    const menuItems = [];

    if (userProfile) {
        menuItems.push({
            name: 'Tài khoản',
            icon: FaUserCog,
            action: () => handleNavigate('account'),
            color: 'text-primary'
        });

        menuItems.push({
            name: 'Hộp thư',
            icon: FaEnvelope,
            action: () => handleNavigate('mailbox'),
            color: 'text-pink-500'
        });

        if (isTeacher) {
            menuItems.push({
                name: 'Quản lý TB',
                icon: FaExclamationTriangle,
                action: () => handleNavigate('notification_mgmt'),
                color: 'text-amber-500'
            });
            if (userProfile?.role === 'admin') {
                menuItems.push({
                    name: 'Cấu hình hệ thống',
                    icon: FaUserCog,
                    action: () => handleNavigate('config'),
                    color: 'text-purple-500'
                });
            }
        }
    }

    const toggleMenu = () => {
        triggerHaptic('light');
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* OVERLAY EXTENDED MENU */}
            <div
                ref={menuRef}
                aria-hidden={!isMenuOpen}
                className={`fixed bottom-20 right-4 z-[10000] transition-all duration-300 origin-bottom-right ${
                    isMenuOpen ? 'opacity-100 scale-100 visible pointer-events-auto' : 'opacity-0 scale-95 invisible pointer-events-none'
                }`}>
                <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-2xl p-4 w-64 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6.5rem)] overflow-y-auto flex flex-col gap-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
                        Menu mở rộng
                    </div>

                    {userProfile && (
                        <>
                            {menuItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            item.action();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-secondary transition-colors group min-h-[44px]"
                                    >
                                        <div className={`p-2 rounded-lg bg-secondary group-hover:bg-card shadow-xs ${item.color}`}>
                                            <Icon />
                                        </div>
                                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                                    </button>
                                );
                            })}

                            <div className="h-px bg-border my-1" />
                        </>
                    )}

                    <ThemeSwitcher variant="menu-item" />

                    <div className="h-px bg-border my-1" />

                    {userProfile ? (
                        <button
                            onClick={() => {
                                triggerHaptic('light');
                                onLogout();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors min-h-[44px]"
                        >
                            <div className="p-2 rounded-lg bg-destructive/15">
                                <FaSignOutAlt />
                            </div>
                            <span className="text-sm font-semibold">Đăng xuất</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                handleNavigate('login');
                                setIsMenuOpen(false);
                            }}
                            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition shadow-sm min-h-[44px]"
                        >
                            Đăng nhập ngay
                        </button>
                    )}
                </div>
            </div>

            {/* BOTTOM NAVBAR */}
            <div className="fixed bottom-4 left-4 right-4 z-[9999] md:hidden animate-fade-in-up" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-2xl p-2 flex justify-between items-center relative overflow-hidden text-foreground">
                    {/* Primary Items */}
                    {primaryItems.map((item) => {
                        const Icon = item.icon;
                        const active = item.active;

                        return (
                            <button
                                key={item.key}
                                onClick={item.action}
                                className={`relative flex flex-col items-center justify-center w-full py-2 min-h-[44px] transition-all duration-200 group ${active ? '-translate-y-0.5' : ''}`}
                            >
                                <Icon
                                    className={`text-xl mb-1 transition-colors ${
                                        active
                                            ? 'text-primary'
                                            : 'text-muted-foreground group-hover:text-foreground'
                                    }`}
                                />

                                <span className={`text-[10px] font-bold transition-colors ${
                                    active
                                        ? 'text-primary'
                                        : 'text-muted-foreground group-hover:text-foreground'
                                }`}>
                                    {item.name}
                                </span>

                                {active && (
                                    <span className="absolute bottom-0 w-1.5 h-1.5 bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}

                    {/* MORE BUTTON */}
                    <button
                        onClick={toggleMenu}
                        className={`relative flex flex-col items-center justify-center w-full py-2 min-h-[44px] transition-all duration-200 group ${isMenuOpen ? '-translate-y-0.5' : ''}`}
                        aria-label="Thêm thao tác"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <FaTimes className="text-xl mb-1 text-primary transition-colors" />
                        ) : (
                            <FaBars className="text-xl mb-1 text-muted-foreground group-hover:text-foreground transition-colors" />
                        )}

                        <span className={`text-[10px] font-bold transition-colors ${
                            isMenuOpen
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover:text-foreground'
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
