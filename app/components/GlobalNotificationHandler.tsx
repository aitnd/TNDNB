'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { fetchActiveMarqueeNotifications, Notification } from '../services/notificationService';

const GlobalNotificationHandler = () => {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            initNotifications();
            checkAndSchedule();
        }
    }, []);

    const initNotifications = async () => {
        try {
            const perm = await LocalNotifications.checkPermissions();
            if (perm.display !== 'granted') {
                await LocalNotifications.requestPermissions();
            }
        } catch (error) {
            console.error("Error asking permission:", error);
        }
    };

    const checkAndSchedule = async () => {
        try {
            // Fetch active 'special' or 'attention' notifications
            const activeNotifs = await fetchActiveMarqueeNotifications();

            // Cancel all existing scheduled notifications to avoid duplicates
            // (In a real app, manage IDs smarter)
            await LocalNotifications.cancel({ notifications: [] }); // Cancel requires IDs, but clearer to just clear pending

            // Actually, we should check pending first? 
            // Simplified logic: Just clear old schedules and re-schedule based on current active data.
            const pending = await LocalNotifications.getPending();
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel(pending);
            }

            const notificationsToSchedule: any[] = [];
            let idCounter = 100;

            activeNotifs.forEach((n: Notification) => {
                if (n.type === 'special' || n.type === 'attention') {
                    // Logic: Schedule every 6 hours
                    // Note: Capacitor Local Notifications basic 'every' options are: year, month, two_weeks, week, day, hour, minute, second
                    // To do "Every 6 hours", we need to schedule multiple fixed times or use a custom interval logic if supported.
                    // Capacitor 5/6 'on' property supports 'hour', 'minute'.

                    // Workaround for "Every X hours": Schedule 4 times a day? 
                    // Or simple recurring: every: 'hour' is too frequent.

                    // Let's schedule one for NOW (if not read) and then let the user open the app to reschedule?
                    // OR: Schedule 4 fixed times: 8am, 2pm, 8pm, 2am.

                    const times = [8, 14, 20]; // 8h, 14h, 20h

                    times.forEach((hour, index) => {
                        notificationsToSchedule.push({
                            id: idCounter + index,
                            title: n.title,
                            body: n.message,
                            schedule: {
                                on: { hour: hour, minute: 0 },
                                allowWhileIdle: true
                            },
                            extra: { originalId: n.id }
                        });
                    });
                    idCounter += 10;
                }
            });

            if (notificationsToSchedule.length > 0) {
                await LocalNotifications.schedule({ notifications: notificationsToSchedule });
                console.log(`Scheduled ${notificationsToSchedule.length} local notifications.`);
            }

        } catch (error) {
            console.error("Error scheduling notifications:", error);
        }
    };

    return null; // Logic component only, no UI
};

export default GlobalNotificationHandler;
