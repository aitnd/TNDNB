import React, { useEffect, useState } from 'react';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const SweetAlertPopup: React.FC = () => {
    const [popupNotif, setPopupNotif] = useState<Notification | null>(null);

    useEffect(() => {
        const check = async () => {
            // Fetch special/attention
            const notifs = await fetchActiveMarqueeNotifications();
            if (notifs.length > 0) {
                // Determine priority (Special > Attention)
                const special = notifs.find(n => n.type === 'special');
                const attention = notifs.find(n => n.type === 'attention');
                const target = special || attention;

                if (target) {
                    // Check if already seen in this session to avoid annoyance
                    const seen = sessionStorage.getItem(`seen_alert_${target.id}`);
                    if (!seen) {
                        setPopupNotif(target);
                    }
                }
            }
        };

        check();
    }, []);

    const handleClose = () => {
        if (popupNotif) {
            sessionStorage.setItem(`seen_alert_${popupNotif.id}`, 'true');
            setPopupNotif(null);
        }
    };

    if (!popupNotif) return null;

    const isSpecial = popupNotif.type === 'special';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-bounce-in border-t-8 ${isSpecial ? 'border-red-500' : 'border-orange-500'}`}>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSpecial ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
                        <FaExclamationTriangle className="text-4xl animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {isSpecial ? 'THÔNG BÁO ĐẶC BIỆT' : 'CHÚ Ý'}
                    </h2>

                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                        {popupNotif.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        {popupNotif.message}
                    </p>

                    <button
                        onClick={handleClose}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all ${isSpecial ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-orange-400 to-yellow-500'}`}
                    >
                        Đã Hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SweetAlertPopup;
