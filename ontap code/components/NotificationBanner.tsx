import React, { useEffect, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { Notification } from '../services/notificationService';

interface NotificationBannerProps {
    notification: Notification | null;
    userId: string;
    onDismiss: () => void; // Just hide form view
    onOpenInbox: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, userId, onDismiss, onOpenInbox }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notification && !notification.readBy.includes(userId)) {
            setVisible(true);
            // Auto hide after 8 seconds if not system
            if (notification.type !== 'system') {
                const timer = setTimeout(() => setVisible(false), 8000);
                return () => clearTimeout(timer);
            }
        }
    }, [notification, userId]);

    if (!notification || !visible) return null;

    return (
        <div className="fixed top-20 right-4 z-40 max-w-sm w-full animate-slide-in-right cursor-pointer" onClick={onOpenInbox}>
            <div className={`rounded-xl shadow-2xl border-l-4 p-4 flex items-start gap-3 relative overflow-hidden backdrop-blur-md bg-white/90 dark:bg-slate-800/90
                ${notification.type === 'system' ? 'border-red-500' : 'border-blue-500'}
            `}>
                <button
                    onClick={(e) => { e.stopPropagation(); setVisible(false); onDismiss(); }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                >
                    <FaTimes size={12} />
                </button>

                <div className={`p-2 rounded-full ${notification.type === 'system' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    <FaBell />
                </div>
                <div className="flex-1 pr-6">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{notification.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">Nhấn để xem chi tiết</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationBanner;
