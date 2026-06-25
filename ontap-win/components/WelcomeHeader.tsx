import React from 'react';
import { motion } from 'framer-motion';

/**
 * WelcomeHeader — Lời chào thông minh theo giờ (phiên bản Win)
 */

interface WelcomeHeaderProps {
    userName: string;
    userRole: string;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
};

const getSubtext = (role: string): string => {
    switch (role) {
        case 'admin':
        case 'quan_ly':
        case 'lanh_dao':
            return 'Chúc anh/chị có một ngày làm việc hiệu quả! 🎯';
        case 'giao_vien':
            return 'Chúc thầy/cô có buổi giảng dạy tuyệt vời! 📚';
        default:
            return 'Chúc bạn ôn tập hiệu quả và đạt kết quả cao! 🚀';
    }
};

const getEmoji = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 18) return '🌤️';
    return '🌙';
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, userRole }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
        >
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {getGreeting()}, {userName || 'Bạn'}! {getEmoji()}
            </h1>
            <p className="text-sm text-muted-foreground">
                {getSubtext(userRole)}
            </p>
        </motion.div>
    );
};

export default WelcomeHeader;
