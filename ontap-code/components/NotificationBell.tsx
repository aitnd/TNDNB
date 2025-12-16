import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';
import { fetchNotifications, markNotificationAsRead, deleteNotificationForUser } from '../services/notificationService';
import { FaBell, FaTrash, FaCircle, FaCheckDouble } from 'react-icons/fa';
import { toast } from 'sonner';

interface NotificationItem {
    id: string;
    title: string;
    body: string;
    link?: string;
    timestamp: Date;
    read: boolean;
    type?: string;
}

const NotificationBell: React.FC = () => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const { userProfile } = useAppStore(state => state);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

    // Load initial notifications
    useEffect(() => {
        if (user && userProfile) {
            fetchNotifications(user.uid, undefined, userProfile.role).then(data => {
                const mapped: NotificationItem[] = data.map(n => ({
                    id: n.id,
                    title: n.title,
                    body: n.message,
                    link: undefined,
                    timestamp: n.createdAt ? new Date(n.createdAt.seconds * 1000) : new Date(),
                    read: n.read || false,
                    type: n.type
                }));
                setNotifications(mapped);
                setUnreadCount(mapped.filter(n => !n.read).length);
            });
        }
    }, [user, userProfile]);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_notification', (payload: any) => {
            console.log("New notification:", payload);
            const newNotif: NotificationItem = {
                id: Date.now().toString(),
                title: payload.title,
                body: payload.body,
                link: payload.link,
                timestamp: new Date(payload.timestamp || Date.now()),
                read: false,
                type: payload.type || 'system'
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
    };

    const handleMarkAllRead = async () => {
        if (!user || unreadCount === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);

        // Update in DB
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        for (const id of unreadIds) {
            await markNotificationAsRead(id, user.uid);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!user) return;

        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== id));

        await deleteNotificationForUser(id, user.uid);
    };

    const handleClearAll = async () => {
        if (!user) return;

        // Only clear READ notifications that are NOT special/attention
        const deletableIds = notifications
            .filter(n => n.read && n.type !== 'special' && n.type !== 'attention')
            .map(n => n.id);

        if (deletableIds.length === 0) {
            toast.info('Không có thông báo đã đọc nào để xóa.');
            return;
        }

        // Optimistic update: Keep unread OR special/attention
        setNotifications(prev => prev.filter(n => !n.read || n.type === 'special' || n.type === 'attention'));

        for (const id of deletableIds) {
            await deleteNotificationForUser(id, user.uid);
        }
        toast.success(`Đã xóa ${deletableIds.length} thông báo đã đọc.`);
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
                        <div className="flex gap-3 text-xs">
                            <span
                                className="text-blue-500 cursor-pointer hover:underline flex items-center gap-1"
                                onClick={handleMarkAllRead}
                                title="Đánh dấu tất cả là đã đọc"
                            >
                                <FaCheckDouble /> Đã đọc
                            </span>
                            <span
                                className="text-red-500 cursor-pointer hover:underline flex items-center gap-1"
                                onClick={handleClearAll}
                                title="Xóa các thông báo đã đọc"
                            >
                                <FaTrash /> Xóa đã đọc
                            </span>
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <p>Không có thông báo mới</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className={`p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group relative ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pr-6">
                                            <p className={`text-sm text-gray-800 dark:text-gray-100 mb-1 ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                                                {!notif.read && <FaCircle className="inline-block text-[8px] text-blue-500 mr-1 mb-0.5" />}
                                                {notif.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{notif.body}</p>
                                        </div>

                                        {/* Delete Button - Only for non-special/attention */}
                                        {(notif.type !== 'special' && notif.type !== 'attention') && (
                                            <button
                                                onClick={(e) => handleDelete(e, notif.id)}
                                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                title="Xóa thông báo"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        )}
                                    </div>

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
