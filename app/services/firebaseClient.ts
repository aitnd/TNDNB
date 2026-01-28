import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Optional if needed directly
import { getStorage } from 'firebase/storage';

// Helper to safely access Vite Env (if in Vite/Capacitor context)
const getViteEnv = (key: string) => {
    try {
        // @ts-ignore
        if (import.meta && import.meta.env) {
            // @ts-ignore
            return import.meta.env[key];
        }
    } catch (e) {
        return undefined;
    }
    return undefined;
};

// Use explicit process.env access for Next.js to ensure string replacement at build time.
// Fallback to Vite env for legacy/mobile wrapper updates.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || getViteEnv('VITE_FIREBASE_API_KEY'),
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || getViteEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || getViteEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || getViteEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || getViteEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || getViteEnv('VITE_FIREBASE_APP_ID'),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || getViteEnv('VITE_FIREBASE_DATABASE_URL'),
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Enforce Local Persistence to share session with Ontap Web
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Auth Persistence Error:', error);
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
