import React, { useEffect, useState } from 'react';
import { BADGE_DEFINITIONS, BadgeDefinition } from '../../constants/badges';
import { BadgeService, UserBadgeProgress } from '../../services/badgeService';
import { BadgeIcon } from './BadgeIcon';
import { useAppStore } from '../../stores/useAppStore';

interface BadgeListProps {
  userId: string;
}

export const BadgeList: React.FC<BadgeListProps> = ({ userId }) => {
  const [progressData, setProgressData] = useState<Record<string, UserBadgeProgress>>({});
  const [loading, setLoading] = useState(true);
  
  // Need to clear "new" badges when viewed
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
        // Mark as read after 3 seconds
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
    return <div className="animate-pulse flex gap-4 p-4"><div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div><div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div></div>;
  }

  // Filter out roles unless they are unlocked (or we only show achievements)
  const achievements = BADGE_DEFINITIONS.filter(b => b.group !== 'role');
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4 dark:text-white">Thành Tích Của Bạn</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {achievements.map(badge => {
            const progress = progressData[badge.id];
            const isUnlocked = progress?.isUnlocked || false;
            const isNew = newBadgeIds.includes(badge.id);

            return (
              <div key={badge.id} className="flex flex-col items-center text-center relative">
                {isNew && (
                  <span className="absolute -top-2 -right-2 flex h-3 w-3 z-20">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
                
                <BadgeIcon 
                  icon={badge.fallbackIcon} 
                  colorClass={badge.color} 
                  isUnlocked={isUnlocked} 
                  size="md" 
                />
                
                <div className="mt-3">
                  <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {badge.description}
                  </p>
                </div>
                
                {/* Progress Bar (if applicable and locked) */}
                {!isUnlocked && badge.targetValue && (
                  <div className="w-full mt-2 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, ((progress?.currentProgress || 0) / badge.targetValue) * 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
