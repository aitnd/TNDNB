import React from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { HelmIcon3D, BookOpenIcon3D, ClipboardListIcon3D } from './icons';
import { HelmIcon3D, BookOpenIcon3D, ClipboardListIcon3D } from './icons';
import { useState, useEffect } from 'react';

import OnlineStatsWidget from './OnlineStatsWidget';

interface DashboardProps {
    userProfile: UserProfile;
    onStart: () => void;
    onHistoryClick: () => void;
    onClassClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onStart, onHistoryClick, onClassClick }) => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-slide-in-right">
            {/* Realtime Stats for Admin */}
            <OnlineStatsWidget userRole={userProfile.role} />

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left Column: Student Card */}
                <div className="flex flex-col items-center">
                    <StudentCard user={userProfile} />
                </div>

                {/* Right Column: Actions */}
                <div className="bg-card/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-border">
                    <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                        Xin chào, {userProfile.full_name || 'Học viên'}!
                    </h1>
                    <p className="text-muted-foreground text-center mb-8">
                        Chúc bạn có một buổi ôn tập hiệu quả và đạt kết quả cao.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={onStart}
                            className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 px-6 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <BookOpenIcon3D className="w-8 h-8" />
                            <span>Vào Ôn Tập / Thi Thử</span>
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
