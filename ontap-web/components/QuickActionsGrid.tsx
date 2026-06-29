import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, BarChart3, Users, Bell, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/nativeUX';

/**
 * QuickActionsGrid — Grid tiles quick actions cho Dashboard
 * Layout: Phân thành 2 khu vực
 *   - primaryActions: nằm bên phải dưới WelcomeHeader (CTA chính + 2x2 tiles)
 *   - secondaryActions: nằm bên trái dưới StudentCard (2 nút phụ)
 */

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'tile';
    badge?: number;
    visibleFor?: string[];  // Role filter, nếu undefined thì hiện cho tất cả
}

interface QuickActionsGridProps {
    userRole: string;
    onStart: () => void;
    onOnlineExamClick?: () => void;
    onHistoryClick: () => void;
    onClassClick: () => void;
    onNotificationClick?: () => void;
    onStatsClick?: () => void;
    onSettingsClick?: () => void;
    onUserManagerClick?: () => void;
}

// === COMPONENT NÚT CHÍNH (CTA TO) ===
const PrimaryButton: React.FC<{ action: QuickAction }> = ({ action }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            triggerHaptic('medium');
            action.onClick();
        }}
        className="w-full relative group overflow-hidden py-5 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-cyan-500/30"
    >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10 flex items-center justify-center gap-3 text-white">
            {action.icon}
            <span className="text-lg md:text-xl font-black uppercase tracking-tight">{action.label}</span>
        </div>
    </motion.button>
);

// === COMPONENT TILE NHỎ (2x2 GRID) ===
const ActionTile: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            triggerHaptic('light');
            action.onClick();
        }}
        className="relative group rounded-2xl p-4 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 text-left shadow-sm hover:shadow-md"
    >
        {/* Badge thông báo */}
        {action.badge && action.badge > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{action.badge > 9 ? '9+' : action.badge}</span>
            </div>
        )}

        {/* Icon nền mờ */}
        <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="w-10 h-10">{action.icon}</div>
        </div>

        <div className="flex items-center gap-2.5">
            <div className="text-blue-500 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                {action.icon}
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{action.label}</span>
        </div>
    </motion.button>
);

// === COMPONENT NÚT PHỤ (DƯỚI STUDENT CARD) ===
const SecondaryButton: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            triggerHaptic('light');
            action.onClick();
        }}
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
    >
        <div className="text-slate-500 dark:text-slate-400 group-hover:text-blue-500">
            {action.icon}
        </div>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{action.label}</span>
    </motion.button>
);

// === MAIN EXPORT: Hàm trả về actions đã filter theo role ===
export const useQuickActions = (props: QuickActionsGridProps) => {
    const adminRoles = ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'];
    const adminOnlyRoles = ['admin', 'quan_ly', 'lanh_dao'];
    const isAdmin = adminRoles.includes(props.userRole);
    const isAdminOnly = adminOnlyRoles.includes(props.userRole);

    // Nút CTA chính
    const primaryAction: QuickAction = {
        id: 'start',
        label: 'Vào Ôn Tập / Thi Thử',
        icon: <BookOpen size={24} />,
        onClick: props.onStart,
        variant: 'primary',
    };

    // Tiles nhỏ 2x2 (bên phải)
    const rightTiles: QuickAction[] = [
        isAdmin && props.onOnlineExamClick ? {
            id: 'exam',
            label: 'Quản lý Thi',
            icon: <ClipboardList size={18} />,
            onClick: props.onOnlineExamClick,
            variant: 'tile' as const,
            visibleFor: adminRoles,
        } : null,
        isAdmin && props.onNotificationClick ? {
            id: 'notification',
            label: 'Thông Báo',
            icon: <Bell size={18} />,
            onClick: props.onNotificationClick,
            variant: 'tile' as const,
            badge: 0, // Sẽ kết nối realtime sau
            visibleFor: adminRoles,
        } : null,
        isAdmin && props.onStatsClick ? {
            id: 'stats',
            label: 'Thống kê',
            icon: <BarChart3 size={18} />,
            onClick: props.onStatsClick,
            variant: 'tile' as const,
            visibleFor: adminRoles,
        } : null,
        isAdminOnly && props.onSettingsClick ? {
            id: 'settings',
            label: 'Cấu hình',
            icon: <Settings size={18} />,
            onClick: props.onSettingsClick,
            variant: 'tile' as const,
            visibleFor: adminOnlyRoles,
        } : null,
    ].filter(Boolean) as QuickAction[];

    // Nút phụ (dưới StudentCard, bên trái)
    const leftButtons: QuickAction[] = [
        {
            id: 'history',
            label: '📊 Lịch sử kết quả',
            icon: <BarChart3 size={16} />,
            onClick: props.onHistoryClick,
            variant: 'secondary',
        },
        {
            id: 'class',
            label: isAdmin ? '👥 Quản lý Lớp' : '👥 Lớp của tôi',
            icon: <Users size={16} />,
            onClick: props.onClassClick,
            variant: 'secondary',
        },
        isAdmin && props.onUserManagerClick ? {
            id: 'usermanager',
            label: '👤 Quản lý Thành viên',
            icon: <Users size={16} />,
            onClick: props.onUserManagerClick,
            variant: 'secondary',
            visibleFor: adminRoles,
        } : null,
    ].filter(Boolean) as QuickAction[];

    return { primaryAction, rightTiles, leftButtons };
};

// Export sub-components cho Dashboard sử dụng
export { PrimaryButton, ActionTile, SecondaryButton };
export type { QuickAction, QuickActionsGridProps };
