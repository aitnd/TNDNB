import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardList, BarChart3, Users, Bell, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/nativeUX';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant: 'primary' | 'secondary' | 'tile';
    badge?: number;
    visibleFor?: string[];
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
            triggerHaptic('medium');
            action.onClick();
        }}
        className="w-full relative group overflow-hidden py-4 px-6 rounded-xl transition-all duration-200 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 min-h-[52px]"
    >
        <div className="flex items-center justify-center gap-3">
            {action.icon}
            <span className="text-base md:text-lg font-bold tracking-tight">{action.label}</span>
        </div>
    </motion.button>
);

// === COMPONENT TILE NHỎ (2x2 GRID) ===
const ActionTile: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 + index * 0.04 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
            triggerHaptic('light');
            action.onClick();
        }}
        className="relative group rounded-xl p-3.5 bg-secondary/70 hover:bg-secondary border border-border transition-all duration-200 text-left min-h-[46px]"
    >
        {action.badge && action.badge > 0 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px] font-bold">
                <span>{action.badge > 9 ? '9+' : action.badge}</span>
            </div>
        )}

        <div className="flex items-center gap-2.5">
            <div className="text-primary">
                {action.icon}
            </div>
            <span className="text-sm font-semibold text-foreground line-clamp-1">{action.label}</span>
        </div>
    </motion.button>
);

// === COMPONENT NÚT PHỤ (DƯỚI STUDENT CARD) ===
const SecondaryButton: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => (
    <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 + index * 0.04 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
            triggerHaptic('light');
            action.onClick();
        }}
        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border hover:bg-secondary/60 text-card-foreground transition-all shadow-xs min-h-[44px]"
    >
        <div className="text-primary">
            {action.icon}
        </div>
        <span className="text-sm font-semibold text-foreground">{action.label}</span>
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
        icon: <BookOpen size={22} />,
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
            badge: 0,
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
            label: 'Lịch sử kết quả',
            icon: <BarChart3 size={16} />,
            onClick: props.onHistoryClick,
            variant: 'secondary',
        },
        {
            id: 'class',
            label: isAdmin ? 'Quản lý Lớp' : 'Lớp của tôi',
            icon: <Users size={16} />,
            onClick: props.onClassClick,
            variant: 'secondary',
        },
        isAdmin && props.onUserManagerClick ? {
            id: 'usermanager',
            label: 'Quản lý Thành viên',
            icon: <Users size={16} />,
            onClick: props.onUserManagerClick,
            variant: 'secondary',
            visibleFor: adminRoles,
        } : null,
    ].filter(Boolean) as QuickAction[];

    return { primaryAction, rightTiles, leftButtons };
};

export { PrimaryButton, ActionTile, SecondaryButton };
export type { QuickAction, QuickActionsGridProps };
