import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Optional if needed directly
import { getStorage } from 'firebase/storage';

const isTestEnv = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || (process.env as any)?.VITEST === 'true');

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isTestEnv ? 'AIzaSyMockKeyForTestOnly123456789' : ''),
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (isTestEnv ? 'mock-test-project' : ''),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || (isTestEnv ? 'https://mock-test-db.firebaseio.com' : undefined),
};

import { getDatabase } from 'firebase/database';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
// Enforce Local Persistence to share session with Next.js (Home)
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Auth Persistence Error:', error);
});
const db = getFirestore(app); // Firestore
const rtdb = getDatabase(app); // Realtime Database
const storage = getStorage(app);

export { app, auth, db, rtdb, storage };
