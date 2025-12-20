import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const AlertMarquee: React.FC = () => {
    const [alerts, setAlerts] = useState<Notification[]>([]);
    // const { socket } = useSocket(); // Removed
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
        // Realtime Listener for Global Alerts
        const qGlobal = query(
            collection(db, 'notifications'),
            where('targetType', '==', 'all'),
            where('type', 'in', ['special', 'attention'])
        );

        const unsubGlobal = onSnapshot(qGlobal, () => {
            loadAlerts(); // Reload all alerts (including personal) when global changes
        });

        // Realtime Listener for Personal Alerts (if user exists)
        let unsubPersonal = () => { };
        if (user) {
            const qPersonal = query(
                collection(db, 'users', user.uid, 'notifications'),
                where('type', 'in', ['special', 'attention'])
            );
            unsubPersonal = onSnapshot(qPersonal, () => {
                loadAlerts();
            });
        }

        return () => {
            unsubGlobal();
            unsubPersonal();
        };
    }, [user]);

    if (alerts.length === 0) return null;

    return (
        <div className="w-full z-30 sticky top-16">
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
