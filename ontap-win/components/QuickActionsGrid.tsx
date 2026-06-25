import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, BarChart3, Users, Bell, Settings } from 'lucide-react';

/**
 * QuickActionsGrid — Grid tiles quick actions (phiên bản Win)
 * Không có triggerHaptic, không có isMobileApp
 */

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'tile';
    badge?: number;
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
}

// Nút CTA chính
const PrimaryButton: React.FC<{ action: QuickAction }> = ({ action }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={action.onClick}
        className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 px-6 rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
    >
        {action.icon}
        <span>{action.label}</span>
    </motion.button>
);

// Tile nhỏ
const ActionTile: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={action.onClick}
        className="relative group rounded-xl p-3.5 bg-card/80 border border-border hover:border-primary/50 transition-all duration-300 text-left shadow-sm hover:shadow-md"
    >
        {action.badge && action.badge > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{action.badge > 9 ? '9+' : action.badge}</span>
            </div>
        )}
        <div className="flex items-center gap-2.5">
            <div className="text-primary/70 group-hover:text-primary transition-colors">
                {action.icon}
            </div>
            <span className="text-sm font-semibold text-foreground line-clamp-1">{action.label}</span>
        </div>
    </motion.button>
);

// Nút phụ (dưới StudentCard)
const SecondaryButton: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={action.onClick}
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card/80 border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
    >
        <div className="text-muted-foreground">{action.icon}</div>
        <span className="text-sm font-semibold text-foreground">{action.label}</span>
    </motion.button>
);

// Hook tính toán actions theo role
const useQuickActions = (props: QuickActionsGridProps) => {
    const adminRoles = ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'];
    const adminOnlyRoles = ['admin', 'quan_ly', 'lanh_dao'];
    const isAdmin = adminRoles.includes(props.userRole);
    const isAdminOnly = adminOnlyRoles.includes(props.userRole);

    const primaryAction: QuickAction = {
        id: 'start',
        label: 'Vào Ôn Tập / Thi Thử',
        icon: <BookOpen size={24} />,
        onClick: props.onStart,
        variant: 'primary',
    };

    const rightTiles: QuickAction[] = [
        isAdmin && props.onOnlineExamClick ? {
            id: 'exam', label: 'Quản lý Thi', icon: <ClipboardList size={18} />,
            onClick: props.onOnlineExamClick, variant: 'tile' as const,
        } : null,
        props.onNotificationClick ? {
            id: 'notification', label: 'Thông Báo', icon: <Bell size={18} />,
            onClick: props.onNotificationClick, variant: 'tile' as const, badge: 0,
        } : null,
        props.onStatsClick ? {
            id: 'stats', label: 'Thống kê', icon: <BarChart3 size={18} />,
            onClick: props.onStatsClick, variant: 'tile' as const,
        } : null,
        isAdminOnly && props.onSettingsClick ? {
            id: 'settings', label: 'Cấu hình', icon: <Settings size={18} />,
            onClick: props.onSettingsClick, variant: 'tile' as const,
        } : null,
    ].filter(Boolean) as QuickAction[];

    const leftButtons: QuickAction[] = [
        {
            id: 'history', label: '📊 Lịch sử kết quả', icon: <BarChart3 size={16} />,
            onClick: props.onHistoryClick, variant: 'secondary',
        },
        {
            id: 'class', label: isAdmin ? '👥 Quản lý Lớp' : '👥 Lớp của tôi',
            icon: <Users size={16} />, onClick: props.onClassClick, variant: 'secondary',
        },
    ];

    return { primaryAction, rightTiles, leftButtons };
};

export { PrimaryButton, ActionTile, SecondaryButton, useQuickActions };
export type { QuickAction, QuickActionsGridProps };
