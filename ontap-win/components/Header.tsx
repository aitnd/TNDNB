import React from 'react';
import type { UserProfile } from '../types';
import { UserIcon3D } from './icons';

interface HeaderProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const roleMap = {
    admin: 'Quản trị viên',
    teacher: 'Giáo viên',
    student: 'Học viên'
};


const Header: React.FC<HeaderProps> = ({ userProfile, onLogout }) => {
  return (
    <header className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-8 sticky top-4 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <UserIcon3D className="h-10 w-10 text-primary" />
            <div>
                <p className="font-bold text-foreground">{userProfile.email}</p>
                <p className="text-sm text-muted-foreground font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full inline-block">{roleMap[userProfile.role]}</p>
            </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-destructive text-destructive-foreground font-semibold text-sm py-2 px-4 rounded-lg hover:bg-destructive/90 focus:outline-none focus:ring-4 focus:ring-ring transition-colors duration-300"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;