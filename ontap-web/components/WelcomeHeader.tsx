import React from 'react';
import { motion } from 'framer-motion';

/**
 * WelcomeHeader — Lời chào thông minh theo giờ + context
 * Hiện "Chào buổi sáng/chiều/tối" + thông tin tổng quan nhanh tùy role
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
    const greeting = getGreeting();
    const subtext = getSubtext(userRole);
    const emoji = getEmoji();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
        >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2">
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    {greeting}, {userName || 'Bạn'}!
                </span>
                <span className="ml-2">{emoji}</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
                {subtext}
            </p>
        </motion.div>
    );
};

export default WelcomeHeader;
