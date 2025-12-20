import React, { useEffect, useState } from 'react';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';
import Marquee from 'react-fast-marquee';
import { FaExclamationTriangle, FaBell } from 'react-icons/fa';

// Augment JSX to support marquee
declare global {
    namespace JSX {
        interface IntrinsicElements {
            marquee: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                behavior?: string;
                direction?: string;
                scrollamount?: string | number;
                width?: string;
            };
        }
    }
}

const MarqueeNotifier: React.FC = () => {
    const [activeNotifs, setActiveNotifs] = useState<Notification[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await fetchActiveMarqueeNotifications();
            // Client-side sort desc
            data.sort((a, b) => {
                const ta = a.createdAt?.seconds || 0;
                const tb = b.createdAt?.seconds || 0;
                return tb - ta;
            });
            setActiveNotifs(data);
        };
        load(); // Initial load

        // Poll every 30 seconds
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);

    if (activeNotifs.length === 0) return null;

    return (
        <div className="fixed top-16 left-0 right-0 z-[30] pointer-events-none">
            {activeNotifs.map(n => {
                const isSpecial = n.type === 'special';
                const bgClass = isSpecial
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-b border-red-800 shadow-red-500/50'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-b border-orange-700 shadow-orange-500/50';

                return (
                    <div key={n.id} className={`${bgClass} shadow-lg py-3 relative`}>
                        {/* 
                            // @ts-ignore - marquee tag is deprecated but explicitly requested by user 
                        */}
                        <marquee behavior="scroll" direction="left" scrollamount="5" width="100%">
                            <div className="inline-flex items-center gap-4 mx-8 font-bold text-sm md:text-base uppercase tracking-wider">
                                {isSpecial ? <FaExclamationTriangle className="animate-pulse" /> : <FaBell className="animate-bounce" />}
                                <span>{n.title}:</span>
                                <span className="font-medium normal-case">{n.message}</span>
                            </div>
                        </marquee>
                    </div>
                );
            })}
        </div>
    );
};

export default MarqueeNotifier;
