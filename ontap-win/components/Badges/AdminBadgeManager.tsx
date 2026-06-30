import React, { useEffect, useState } from 'react';
import { BADGE_DEFINITIONS, BadgeDefinition } from '../../constants/badges';
import { BadgeService, UserBadgeProgress } from '../../services/badgeService';
import { BadgeIcon } from './BadgeIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminBadgeManagerProps {
  userId: string;
  userName: string;
  userRole: string;
  currentUserRole: string; // Role của admin đang đăng nhập
  onClose: () => void;
}

/**
 * Modal cho Admin xem / cấp phát / thu hồi huy hiệu của một user
 * - Admin + Lãnh đạo: Toàn quyền Grant/Revoke
 * - Giáo viên + Quản lý: Chỉ xem (read-only)
 */
export const AdminBadgeManager: React.FC<AdminBadgeManagerProps> = ({ 
  userId, userName, userRole, currentUserRole, onClose 
}) => {
  const [progressData, setProgressData] = useState<Record<string, UserBadgeProgress>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Chỉ admin và lãnh đạo có quyền Grant/Revoke
  const canManage = ['admin', 'lanh_dao'].includes(currentUserRole);

  const fetchBadges = async () => {
    setLoading(true);
    const badges = await BadgeService.getUserBadges(userId);
    const progressMap: Record<string, UserBadgeProgress> = {};
    badges.forEach(b => {
      progressMap[b.badgeId] = b;
    });
    setProgressData(progressMap);
    setLoading(false);
  };

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const handleGrant = async (badgeId: string) => {
    if (!canManage) return;
    setActionLoading(badgeId);
    const success = await BadgeService.unlockBadge(userId, badgeId);
    if (success) {
      await fetchBadges();
    }
    setActionLoading(null);
  };

  const handleRevoke = async (badgeId: string) => {
    if (!canManage) return;
    if (!confirm(`Bạn có chắc muốn thu hồi huy hiệu này?`)) return;
    setActionLoading(badgeId);
    const success = await BadgeService.revokeBadge(userId, badgeId);
    if (success) {
      await fetchBadges();
    }
    setActionLoading(null);
  };

  // Tách Role badges và Achievement badges
  const roleBadges = BADGE_DEFINITIONS.filter(b => b.group === 'role' && b.roleId === userRole);
  const achievementBadges = BADGE_DEFINITIONS.filter(b => b.group !== 'role');

  const renderBadgeRow = (badge: BadgeDefinition, isRoleBadge: boolean = false) => {
    const progress = progressData[badge.id];
    const isUnlocked = isRoleBadge ? true : (progress?.isUnlocked || false);
    const isCurrentAction = actionLoading === badge.id;

    return (
      <div 
        key={badge.id} 
        className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
          isUnlocked 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' 
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
        }`}
      >
        {/* Icon */}
        <BadgeIcon 
          icon={badge.fallbackIcon} 
          colorClass={badge.color} 
          isUnlocked={isUnlocked} 
          size="md" 
        />

        {/* Thông tin */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {badge.name}
            </h4>
            {isUnlocked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                ✅ Đã mở
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{badge.description}</p>
          {/* Thanh tiến trình */}
          {!isRoleBadge && !isUnlocked && badge.targetValue && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all" 
                  style={{ width: `${Math.min(100, ((progress?.currentProgress || 0) / badge.targetValue) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-gray-400">{progress?.currentProgress || 0}/{badge.targetValue}</span>
            </div>
          )}
        </div>

        {/* Nút hành động (chỉ cho Thành tích, không cho Role) */}
        {!isRoleBadge && canManage && (
          <div className="flex-shrink-0">
            {isUnlocked ? (
              <button
                onClick={() => handleRevoke(badge.id)}
                disabled={isCurrentAction}
                className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-700/50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCurrentAction ? '...' : 'Thu hồi'}
              </button>
            ) : (
              <button
                onClick={() => handleGrant(badge.id)}
                disabled={isCurrentAction}
                className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-700/50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCurrentAction ? '...' : 'Cấp'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🏅 Quản lý Huy hiệu
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Học viên: <span className="font-semibold text-gray-700 dark:text-gray-300">{userName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-5 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Section: Chức danh */}
                {roleBadges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      🎖️ Chức Danh (Tự động theo Role)
                    </h3>
                    <div className="space-y-2">
                      {roleBadges.map(b => renderBadgeRow(b, true))}
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 italic">
                      * Huy hiệu chức danh tự động gắn theo vai trò của tài khoản, không thể cấp/thu hồi thủ công.
                    </p>
                  </div>
                )}

                {/* Section: Thành tích */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    🏆 Thành Tích ({achievementBadges.filter(b => progressData[b.id]?.isUnlocked).length}/{achievementBadges.length} đã mở)
                  </h3>
                  <div className="space-y-2">
                    {achievementBadges.map(b => renderBadgeRow(b, false))}
                  </div>
                </div>

                {/* Ghi chú quyền hạn */}
                {!canManage && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                    <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <span>🔒</span> Bạn chỉ có quyền xem. Liên hệ Admin để cấp/thu hồi huy hiệu.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
