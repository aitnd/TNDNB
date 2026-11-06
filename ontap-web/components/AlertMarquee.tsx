import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const AlertMarquee: React.FC = () => {
    const [alerts, setAlerts] = useState<Notification[]>([]);
    const { user } = useAuth();
    const { userProfile } = useAppStore(state => state);

    const loadAlerts = async () => {
        try {
            const data = await fetchActiveMarqueeNotifications(user?.uid, userProfile?.role);
            setAlerts(data || []);
        } catch (error) {
            setAlerts([]);
        }
    };

    useEffect(() => {
        loadAlerts();

        const interval = setInterval(loadAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user, userProfile]);

    if (alerts.length === 0) return null;

    return (
        <div className="w-full z-30 sticky top-16">
            {alerts.map(alert => {
                const isSpecial = alert.type === 'special';
                return (
                    <div
                        key={alert.id}
                        className={`
                            w-full py-2 px-4 flex items-center border-b shadow-xs transition-colors
                            ${isSpecial
                                ? 'bg-destructive/10 text-destructive border-destructive/25'
                                : 'bg-primary/10 text-foreground border-primary/20'
                            }
                        `}
                    >
                        <div className="flex-shrink-0 mr-4 font-bold flex items-center gap-2 uppercase tracking-wider text-xs md:text-sm">
                            {isSpecial ? <FaExclamationTriangle className="animate-pulse text-destructive" /> : <FaInfoCircle className="text-primary" />}
                            <span>{isSpecial ? 'Thông báo khẩn' : 'Chú ý'}</span>
                        </div>
                        <Marquee gradient={false} speed={50} className="flex-1 font-medium text-xs md:text-sm">
                            <span className="mx-4">{alert.title}: {alert.message}</span>
                            <span className="mx-4 text-muted-foreground"> • </span>
                            <span className="mx-4">{alert.title}: {alert.message}</span>
                        </Marquee>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertMarquee;
