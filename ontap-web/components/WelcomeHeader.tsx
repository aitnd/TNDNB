import React from 'react';
import { motion } from 'framer-motion';

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
            return 'Chúc anh/chị có một ngày làm việc hiệu quả!';
        case 'giao_vien':
            return 'Chúc thầy/cô có buổi giảng dạy tuyệt vời!';
        default:
            return 'Chúc bạn ôn tập hiệu quả và đạt kết quả cao!';
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
            transition={{ duration: 0.4 }}
            className="mb-6"
        >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-2 flex items-center flex-wrap gap-2">
                <span>{greeting}, {userName || 'Bạn'}!</span>
                <span className="text-xl md:text-2xl">{emoji}</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
                {subtext}
            </p>
        </motion.div>
    );
};

export default WelcomeHeader;
