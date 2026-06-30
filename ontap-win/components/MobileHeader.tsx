import React from 'react';
import { UserProfile } from '../types';

interface MobileHeaderProps {
  userProfile: UserProfile | null;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ userProfile }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img src="/assets/img/logo_viwa.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            Ôn thi đường thủy
          </span>
        </div>

        {/* User Info (Optional right side content) */}
        {userProfile && (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border-2 border-white dark:border-slate-800">
            {userProfile.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                {(userProfile.fullName || userProfile.full_name) ? (userProfile.fullName || userProfile.full_name).split(' ')[0] : 'Khách'}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader;
