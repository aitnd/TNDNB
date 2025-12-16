import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const AlertMarquee: React.FC = () => {
    const [alerts, setAlerts] = useState<Notification[]>([]);
    const { socket } = useSocket();
    const { user } = useAuth();
    const { userProfile } = useAppStore(state => state); // Need to import useAppStore

    const loadAlerts = async () => {
        const data = await fetchActiveMarqueeNotifications(user?.uid, userProfile?.role);
        setAlerts(data);
    };

    useEffect(() => {
        loadAlerts();

        // Refresh every 5 minutes to check expiry
        const interval = setInterval(loadAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, userProfile]); // Reload when user/profile changes

    useEffect(() => {
        if (!socket) return;

        // Listen for new global notifications to update marquee immediately
        socket.on('receive_notification', (payload: any) => {
            // We can just reload data to be safe and simple
            // Or check if payload.broadcast is true
            if (payload.broadcast) {
                loadAlerts();
            }
        });

        return () => {
            socket.off('receive_notification');
        };
    }, [socket]);

    if (alerts.length === 0) return null;

    return (
        <div className="w-full z-30 relative">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`
                        w-full py-2 px-4 flex items-center shadow-md
                        ${alert.type === 'special'
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                            : 'bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900'
                        }
                    `}
                >
                    <div className="flex-shrink-0 mr-4 font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
                        {alert.type === 'special' ? <FaExclamationTriangle className="animate-pulse" /> : <FaInfoCircle />}
                        {alert.type === 'special' ? 'Thông báo khẩn' : 'Chú ý'}
                    </div>
                    <Marquee gradient={false} speed={50} className="flex-1 font-medium text-sm md:text-base">
                        <span className="mx-4">{alert.title}: {alert.message}</span>
                        {/* Repeat for visual continuity if short */}
                        <span className="mx-4"> | </span>
                        <span className="mx-4">{alert.title}: {alert.message}</span>
                    </Marquee>
                </div>
            ))}
        </div>
    );
};

export default AlertMarquee;
