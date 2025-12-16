import { useEffect } from 'react';
import { ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { rtdb } from '../services/firebaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore } from '../stores/useAppStore';

const usePresence = () => {
    const { user } = useAuth();
    const userProfile = useAppStore(state => state.userProfile);

    useEffect(() => {
        if (!user || !userProfile || !rtdb) return;

        const connectedRef = ref(rtdb, '.info/connected');
        const userStatusDatabaseRef = ref(rtdb, '/status/' + user.uid);

        const unsubscribe = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                return;
            };

            const isOnlineForDatabase = {
                state: 'online',
                last_changed: serverTimestamp(),
                role: userProfile.role || 'unknown',
                name: userProfile.full_name || userProfile.fullName || 'User',
                photoURL: userProfile.photoURL || '',
                device: 'web' // Could add more info
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
        };
    }, [user, userProfile]);
};

export default usePresence;
