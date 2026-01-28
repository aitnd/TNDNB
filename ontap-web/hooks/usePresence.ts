import { useEffect } from 'react';
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { rtdb } from '../services/firebaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';

const usePresence = () => {
    const { user } = useAuth();
    const userProfile = useAppStore(state => state.userProfile);

    useEffect(() => {
        if (!rtdb) return;

        const connectedRef = ref(rtdb, '.info/connected');
        let userStatusDatabaseRef: any;
        let isOnlineForDatabase: any;

        if (user && userProfile) {
            // Authenticated User
            userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);
            isOnlineForDatabase = {
                state: 'online',
                last_changed: serverTimestamp(),
                role: userProfile.role || 'unknown',
                name: userProfile.full_name || userProfile.fullName || 'User',
                photoURL: userProfile.photoURL || '',
                device: 'web'
            };
        } else {
            // Guest User
            let guestId = localStorage.getItem('guest_session_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('guest_session_id', guestId);
            }
            userStatusDatabaseRef = ref(rtdb, '/status/' + guestId);
            isOnlineForDatabase = {
                state: 'online',
                last_changed: serverTimestamp(),
                role: 'guest',
                name: 'Khách',
                device: 'web'
            };
        }

        const unsubscribe = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                return;
            };

            const isOfflineForDatabase = {
                state: 'offline',
                last_changed: serverTimestamp(),
            };

            onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
                set(userStatusDatabaseRef, isOnlineForDatabase);
            });
        });

        return () => {
            unsubscribe();
            // Optional: Set offline on unmount if needed, but onDisconnect handles tab close
            // set(userStatusDatabaseRef, { state: 'offline', last_changed: serverTimestamp() });
        };
    }, [user, userProfile]);
};

export default usePresence;
