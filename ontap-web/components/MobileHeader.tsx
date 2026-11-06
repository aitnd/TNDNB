import React from 'react';
import { UserProfile } from '../types';

interface MobileHeaderProps {
  userProfile: UserProfile | null;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ userProfile }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm text-foreground">
      <div className="flex items-center justify-between px-4 h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]">
        {/* Logo and Title */}
        <div className="flex items-center gap-2.5">
          <img src="/assets/img/logo_viwa.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-base md:text-lg text-foreground tracking-tight">
            Ôn thi đường thủy
          </span>
        </div>

        {/* User Info */}
        {userProfile && (
          <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted-foreground font-semibold text-xs">
                {(userProfile.fullName || userProfile.full_name) ? (userProfile.fullName || userProfile.full_name).split(' ')[0] : 'HV'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
