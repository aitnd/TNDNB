import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseClient';

export const initializeFCM = async (userId: string) => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
        return;
    }


    // 1. Request Permission
    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        const newStatus = await PushNotifications.requestPermissions();
        if (newStatus.receive !== 'granted') {
            console.error('FCM: User denied permissions');
            return;
        }
    } else if (permStatus.receive !== 'granted') {
        console.error('FCM: Permissions not granted');
        return;
    }

    // 2. Register for Push
    await PushNotifications.register();

    // 3. Listen for Token Registration
    PushNotifications.addListener('registration', async (token) => {
        // Save token to Firestore
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                fcmTokens: arrayUnion(token.value),
                lastFcmUpdate: new Date()
            });
        } catch (error) {
            console.error('FCM: Error saving token:', error);
        }
    });

    // 4. Listen for Errors
    PushNotifications.addListener('registrationError', (error) => {
        console.error('FCM: Registration failed:', error);
    });

    // 5. Listen for Received Notifications (Foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        // Optional: Show a toast or update Badge
    });

    // 6. Listen for Notification Actions (Tap)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        // Navigate to specific screen if needed
        // e.g. window.location.href = '/notification-screen';
    });
};
