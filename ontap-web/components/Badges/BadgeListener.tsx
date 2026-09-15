import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { BadgeService } from '../../services/badgeService';
import { BadgeUnlockPopup } from './BadgeUnlockPopup';

export const BadgeListener: React.FC = () => {
  const userProfile = useAppStore(state => state.userProfile);
  const [unlockedBadgeId, setUnlockedBadgeId] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile) return;

    // Check periodically for new badges
    const checkNewBadges = async () => {
      const badges = await BadgeService.getUserBadges(userProfile.id);
      const newBadges = badges.filter(b => b.isNew && b.isUnlocked);
      
      if (newBadges.length > 0) {
        // Show the first new badge
        setUnlockedBadgeId(newBadges[0].badgeId);
        // Mark as read so it doesn't show again
        await BadgeService.markAsRead(userProfile.id, [newBadges[0].badgeId]);
      }
    };

    // Initial check
    checkNewBadges();

    // Set up polling (every 30 seconds)
    const interval = setInterval(checkNewBadges, 30000);
    return () => clearInterval(interval);
  }, [userProfile]);

  return (
    <>
      {unlockedBadgeId && (
        <BadgeUnlockPopup 
          badgeId={unlockedBadgeId} 
          isOpen={true} 
          onClose={() => setUnlockedBadgeId(null)} 
        />
      )}
    </>
  );
};
