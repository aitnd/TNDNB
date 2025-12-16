import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { FaBell } from 'react-icons/fa';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    body: string;
    link?: string;
    timestamp: Date;
    read: boolean;
}

const NotificationBell: React.FC = () => {
    const { socket } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_notification', (payload: any) => {
            console.log("New notification:", payload);
            const newNotif: Notification = {
                id: Date.now().toString(),
                ...payload,
                timestamp: new Date(payload.timestamp || Date.now())
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Sonner Toast
            toast(newNotif.title, {
                description: newNotif.body,
                action: newNotif.link ? {
                    label: 'Xem ngay',
                    onClick: () => window.location.href = newNotif.link!
                } : undefined,
                duration: 5000,
            });
        });

        return () => {
            socket.off('receive_notification');
        };
    }, [socket]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Mark all as read when opening (simplified logic)
            setUnreadCount(0);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                title="Thông báo"
            >
                <FaBell className={`text-xl ${unreadCount > 0 ? 'text-yellow-500 animate-swing' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700 animate-fade-in-down">
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Thông báo</h3>
                        <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => setNotifications([])}>Xóa tất cả</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>Không có thông báo mới</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{notif.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{notif.body}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">
                                            {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {notif.link && (
                                            <a href={notif.link} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                Xem chi tiết
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
