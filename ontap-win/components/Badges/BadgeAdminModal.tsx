import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BADGE_DEFINITIONS, BadgeDefinition, BadgeGroup } from '../../constants/badges';
import { BadgeService, UserBadgeProgress } from '../../services/badgeService';
import { BadgeIcon3D } from './BadgeIcon3D';
import { X } from 'lucide-react';
import { FaGift, FaBan } from 'react-icons/fa';

interface BadgeAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const GROUP_ORDER: BadgeGroup[] = ['on_tap', 'thi_thu', 'streak', 'interaction', 'special', 'role'];
const GROUP_LABELS: Record<BadgeGroup, string> = {
  on_tap: '📚 Ôn Tập',
  thi_thu: '⛵ Thi Thử',
  streak: '🔥 Streak',
  interaction: '🤝 Tương Tác',
  special: '✨ Đặc Biệt',
  role: '🎖️ Role',
};

export const BadgeAdminModal: React.FC<BadgeAdminModalProps> = ({ isOpen, onClose, userId, userName }) => {
  const [progressData, setProgressData] = useState<Record<string, UserBadgeProgress>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const badges = await BadgeService.getUserBadges(userId);
    const map: Record<string, UserBadgeProgress> = {};
    badges.forEach(b => { map[b.badgeId] = b; });
    setProgressData(map);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
    }
  }, [isOpen, userId]);

  const handleGrant = async (badgeId: string) => {
    setActionLoading(badgeId);
    await BadgeService.unlockBadge(userId, badgeId);
    await fetchData();
    setActionLoading(null);
  };

  const handleRevoke = async (badgeId: string) => {
    if (!confirm(`Thu hồi huy hiệu này khỏi ${userName}?`)) return;
    setActionLoading(badgeId);
    await BadgeService.revokeBadge(userId, badgeId);
    await fetchData();
    setActionLoading(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold dark:text-white">🏅 Quản lý Huy hiệu</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Người dùng: <span className="font-semibold text-gray-700 dark:text-gray-200">{userName}</span></p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              GROUP_ORDER.map(group => {
                const badges = BADGE_DEFINITIONS.filter(b => b.group === group);
                if (badges.length === 0) return null;

                return (
                  <div key={group}>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {GROUP_LABELS[group]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {badges.map(badge => {
                        const progress = progressData[badge.id];
                        const isUnlocked = progress?.isUnlocked || false;
                        const isCurrentAction = actionLoading === badge.id;

                        return (
                          <div
                            key={badge.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                              isUnlocked
                                ? 'border-green-200 dark:border-green-700/50 bg-green-50/50 dark:bg-green-900/10'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
                            }`}
                          >
                            <BadgeIcon3D
                              name={badge.name}
                              description={badge.description}
                              fallbackIcon={badge.fallbackIcon}
                              colorClass={badge.color}
                              level={badge.level}
                              isUnlocked={isUnlocked}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold dark:text-white truncate">{badge.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{badge.description}</p>
                              {progress?.currentProgress !== undefined && badge.targetValue && (
                                <p className="text-xs text-blue-500 mt-0.5">{progress.currentProgress}/{badge.targetValue}</p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {isCurrentAction ? (
                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : isUnlocked ? (
                                <button
                                  onClick={() => handleRevoke(badge.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                                  title="Thu hồi"
                                >
                                  <FaBan size={14} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleGrant(badge.id)}
                                  className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition"
                                  title="Cấp huy hiệu"
                                >
                                  <FaGift size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
