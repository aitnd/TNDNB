import React, { useEffect, useState } from 'react';
import { BADGE_DEFINITIONS, BadgeDefinition, BadgeGroup } from '../../constants/badges';
import { BadgeService, UserBadgeProgress } from '../../services/badgeService';
import { BadgeIcon3D } from './BadgeIcon3D';
interface BadgeListProps {
  userId: string;
  userRole?: string; // Role hiện tại của user để hiển thị Role Badge
}

// Cấu hình tiêu đề & icon cho mỗi nhóm
const GROUP_CONFIG: Record<BadgeGroup, { title: string; icon: string }> = {
  role:        { title: 'Chức Danh',                icon: '🎖️' },
  on_tap:      { title: 'Ôn Tập & Học Tập',        icon: '📚' },
  thi_thu:     { title: 'Thi Thử & Thành Tích',    icon: '⛵' },
  streak:      { title: 'Streak & Kiên Trì',       icon: '🔥' },
  interaction: { title: 'Cộng Đồng & Tương Tác',   icon: '🤝' },
  special:     { title: 'Đặc Biệt & Ẩn',          icon: '✨' },
};

// Thứ tự hiển thị nhóm
const GROUP_ORDER: BadgeGroup[] = ['role', 'on_tap', 'thi_thu', 'streak', 'interaction', 'special'];

export const BadgeList: React.FC<BadgeListProps> = ({ userId, userRole }) => {
  const [progressData, setProgressData] = useState<Record<string, UserBadgeProgress>>({});
  const [loading, setLoading] = useState(true);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      const badges = await BadgeService.getUserBadges(userId);
      const progressMap: Record<string, UserBadgeProgress> = {};
      const newIds: string[] = [];
      
      badges.forEach(b => {
        progressMap[b.badgeId] = b;
        if (b.isNew && b.isUnlocked) {
          newIds.push(b.badgeId);
        }
      });
      
      setProgressData(progressMap);
      setNewBadgeIds(newIds);
      setLoading(false);

      if (newIds.length > 0) {
        setTimeout(() => {
          BadgeService.markAsRead(userId, newIds);
        }, 3000);
      }
    };

    if (userId) {
      fetchBadges();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse flex gap-4 p-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        ))}
      </div>
    );
  }

  // Đếm tổng huy hiệu đã mở khóa
  const totalUnlocked = Object.values(progressData).filter(p => p.isUnlocked).length;
  const totalBadges = BADGE_DEFINITIONS.filter(b => b.group !== 'role').length;

  // Phân nhóm badge definitions
  const groupedBadges: Record<string, BadgeDefinition[]> = {};
  GROUP_ORDER.forEach(group => {
    const badges = BADGE_DEFINITIONS.filter(b => {
      if (group === 'role') return b.group === 'role' && b.roleId === userRole;
      return b.group === group;
    });
    if (badges.length > 0) {
      groupedBadges[group] = badges;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header tổng quan */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          🏆 Bộ Sưu Tập Huy Hiệu
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-medium">
          {totalUnlocked}/{totalBadges} đã mở khóa
        </span>
      </div>

      {/* Từng nhóm */}
      {GROUP_ORDER.map(group => {
        const badges = groupedBadges[group];
        if (!badges || badges.length === 0) return null;
        const config = GROUP_CONFIG[group];

        return (
          <div key={group}>
            {/* Tiêu đề nhóm */}
            <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
              <span>{config.icon}</span> {config.title}
            </h3>

            {/* Grid hiển thị chung */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {badges.map(badge => {
                const progress = progressData[badge.id];
                const isUnlocked = group === 'role' ? true : (progress?.isUnlocked || false);
                const isNew = newBadgeIds.includes(badge.id);

                return (
                  <div key={badge.id} className="flex flex-col items-center text-center relative group">
                    {/* Chấm đỏ "Mới" */}
                    {isNew && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border border-white dark:border-gray-800" />
                      </span>
                    )}
                    
                    <BadgeIcon3D 
                      name={badge.name}
                      description={badge.description}
                      fallbackIcon={badge.fallbackIcon}
                      colorClass={badge.color}
                      level={badge.level}
                      isUnlocked={isUnlocked}
                      currentProgress={progress?.currentProgress}
                      targetValue={badge.targetValue}
                      size="md"
                    />
                    
                    <div className="mt-3">
                      <h4 className={`font-semibold text-sm leading-tight ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                        {badge.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
