import { db, auth } from './firebaseClient';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    orderBy,
    onSnapshot,
    getDoc
} from 'firebase/firestore';
import { getDeviceInfo } from './deviceService';

export interface LoginSession {
    id?: string;
    userId: string;
    deviceName: string;
    browser: string;
    ip: string;
    userAgent: string;
    loginAt: any;
    lastActive: any;
    status: 'active' | 'logged_out';
    isCurrent?: boolean;
}

const SESSION_COLLECTION = 'login_sessions';
const CURRENT_SESSION_ID_KEY = 'ontap_current_session_id';

export const recordLoginSession = async (userId: string) => {
    try {
        const deviceInfo = await getDeviceInfo();
        const sessionData = {
            userId,
            ...deviceInfo,
            loginAt: serverTimestamp(),
            lastActive: serverTimestamp(),
            status: 'active'
        };

        const docRef = await addDoc(collection(db, SESSION_COLLECTION), sessionData);
        localStorage.setItem(CURRENT_SESSION_ID_KEY, docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Failed to record login session:', error);
        return null;
    }
};

export const getActiveSessions = async (userId: string): Promise<LoginSession[]> => {
    try {
        const q = query(
            collection(db, SESSION_COLLECTION),
            where('userId', '==', userId),
            where('status', '==', 'active'),
            orderBy('loginAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem(CURRENT_SESSION_ID_KEY) : null;

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isCurrent: doc.id === currentSessionId
        } as LoginSession));
    } catch (error) {
        console.error('Failed to get active sessions:', error);
        return [];
    }
};

export const logoutRemoteSession = async (sessionId: string) => {
    try {
        const docRef = doc(db, SESSION_COLLECTION, sessionId);
        await updateDoc(docRef, {
            status: 'logged_out',
            loggedOutAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Failed to logout remote session:', error);
        return false;
    }
};

export const checkCurrentSessionStatus = (callback: (isLoggedOut: boolean) => void) => {
    if (typeof window === 'undefined') return () => { };
    const sessionId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
    if (!sessionId) return () => { };

    const docRef = doc(db, SESSION_COLLECTION, sessionId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.status === 'logged_out') {
                callback(true);
            }
        } else {
            // Session document deleted
            callback(true);
        }
    });
};

export const updateLastActive = async () => {
    if (typeof window === 'undefined') return;
    const sessionId = localStorage.getItem(CURRENT_SESSION_ID_KEY);
    if (!sessionId) return;

    try {
        const docRef = doc(db, SESSION_COLLECTION, sessionId);
        await updateDoc(docRef, {
            lastActive: serverTimestamp()
        });
    } catch (error) {
        // Ignore errors for background updates
    }
};

export const getDeviceCount = async (userId: string): Promise<number> => {
    try {
        const q = query(
            collection(db, SESSION_COLLECTION),
            where('userId', '==', userId),
            where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error('Error getting device count:', error);
        return 0;
    }
};
