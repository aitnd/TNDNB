import React from 'react';
import { UserProfile } from '../types';
import StudentCard from './StudentCard';
import { useTheme } from '../contexts/ThemeContext';
import { HelmIcon3D, BookOpenIcon3D, ClipboardListIcon3D } from './icons';
import { FaBell } from 'react-icons/fa';
import { Notification, fetchNotifications } from '../services/notificationService';
import InboxModal from './InboxModal';
import NotificationBanner from './NotificationBanner';
import { useState, useEffect } from 'react';

interface DashboardProps {
    userProfile: UserProfile;
    onStart: () => void;
    onHistoryClick: () => void;
    onClassClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, onStart, onHistoryClick, onClassClick }) => {
    const { theme } = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestUnread, setLatestUnread] = useState<Notification | null>(null);

    useEffect(() => {
        const loadNotifs = async () => {
            if (userProfile?.id) {
                // @ts-ignore
                const notifs = await fetchNotifications(userProfile.id, userProfile.class);
                setNotifications(notifs);

                // Use the 'read' property computed by fetchNotifications
                const unread = notifs.filter(n => !n.read);
                setUnreadCount(unread.length);
                if (unread.length > 0) {
                    setLatestUnread(unread[0]);
                }
            }
        };
        loadNotifs();
    }, [userProfile]);

    const handleMarkRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true, readBy: [...(n.readBy || []), userProfile.id] } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
        // Hide banner if the read one was the latest
        if (latestUnread?.id === id) {
            setLatestUnread(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-slide-in-right">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left Column: Student Card */}
                <div className="flex flex-col items-center">
                    <div className="w-full flex justify-end mb-4 md:mb-0 relative md:absolute md:top-4 md:right-4 gap-2">
                        <button
                            onClick={() => setIsInboxOpen(true)}
                            className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-full shadow-lg hover:scale-110 transition-transform relative"
                        >
                            <FaBell className="text-xl text-yellow-500" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <StudentCard user={userProfile} />
                </div>

                <InboxModal
                    isOpen={isInboxOpen}
                    onClose={() => setIsInboxOpen(false)}
                    notifications={notifications}
                    userId={userProfile.id}
                    onMarkRead={handleMarkRead}
                />

                <NotificationBanner
                    notification={latestUnread}
                    userId={userProfile.id}
                    onDismiss={() => setLatestUnread(null)}
                    onOpenInbox={() => setIsInboxOpen(true)}
                />

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
