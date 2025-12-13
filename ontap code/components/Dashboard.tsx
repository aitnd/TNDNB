import React from 'react';
import type { UserProfile } from '../types';
import { BookOpenIcon3D, PracticeIcon3D } from './icons';

interface DashboardProps {
    userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile }) => {
    const isAdmin = userProfile.role === 'admin';

    const handleDisabledClick = () => {
        alert('Tài khoản của anh/chị không có quyền truy cập chức năng này.');
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right">
             <div className="relative text-center mb-10">
                <h1 className="text-4xl font-bold text-foreground">
                    Bảng điều khiển
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                    Chào mừng trở lại, {userProfile.email}!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quản lý lớp học */}
                <button
                    className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-ring"
                >
                    <BookOpenIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-110" />
                    <h2 className="text-xl font-bold text-card-foreground">Quản lý Lớp học</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Tạo, xem và quản lý các lớp học của anh/chị.</p>
                </button>

                {/* Quản lý Học viên */}
                <button
                    className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-ring"
                >
                    <PracticeIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-110" />
                    <h2 className="text-xl font-bold text-card-foreground">Quản lý Học viên</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Thêm, xóa và xem tiến độ của học viên trong lớp.</p>
                </button>

                {/* Quản lý Giáo viên (Admin only) */}
                <button
                    onClick={!isAdmin ? handleDisabledClick : undefined}
                    disabled={!isAdmin}
                    className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center transition-all duration-300 focus:outline-none 
                               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                               hover:bg-primary/10 transform hover:-translate-y-2 focus:ring-4 focus:ring-ring"
                >
                    <PracticeIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-110" />
                    <h2 className="text-xl font-bold text-card-foreground">Quản lý Giáo viên</h2>
                    <p className="text-muted-foreground mt-2 text-sm">Tạo và quản lý tài khoản cho các giáo viên khác (chỉ Admin).</p>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;