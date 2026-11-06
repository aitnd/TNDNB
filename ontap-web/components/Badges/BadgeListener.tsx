import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { BadgeService } from '../../services/badgeService';
import { BadgeUnlockPopup } from './BadgeUnlockPopup';
import { auth } from '../../services/firebaseClient';

export const BadgeListener: React.FC = () => {
  const userProfile = useAppStore(state => state.userProfile);
  const [unlockedBadgeId, setUnlockedBadgeId] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile || !userProfile.id || userProfile.id === 'guest' || !auth?.currentUser) {
      return;
    }

    let isPolling = true;
    let intervalId: any = null;

    const checkNewBadges = async () => {
      if (!isPolling || !auth?.currentUser) return;
      try {
        const badges = await BadgeService.getUserBadges(userProfile.id);
        const newBadges = badges.filter(b => b.isNew && b.isUnlocked);
        
        if (newBadges.length > 0) {
          setUnlockedBadgeId(newBadges[0].badgeId);
          await BadgeService.markAsRead(userProfile.id, [newBadges[0].badgeId]);
        }
      } catch (err: any) {
        if (err?.code === 'permission-denied' || err?.message?.includes('permission')) {
          isPolling = false;
          if (intervalId) clearInterval(intervalId);
        }
      }
    };

    checkNewBadges();
    intervalId = setInterval(checkNewBadges, 30000);

    return () => {
      isPolling = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [userProfile?.id]);

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
