import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, orderBy, limit, Timestamp, writeBatch, deleteDoc, documentId } from 'firebase/firestore';
import { db } from './firebaseClient';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention';
    senderId: string;
    senderName?: string;
    targetType: 'all' | 'class' | 'user';
    targetId: string | null;
    createdAt: any; // Timestamp
    expiryDate?: any; // Timestamp for Special/Attention
    read?: boolean;
    readBy?: string[];
    deletedBy?: string[]; // Soft delete
}

export const fetchActiveMarqueeNotifications = async (): Promise<Notification[]> => {
    try {
        const now = Timestamp.now();
        // Query Global notifications
        // AVOID complex index requirements by filtering Expiry client-side for now
        const q = query(
            collection(db, 'notifications'),
            where('targetType', '==', 'all'),
            limit(20) // Limit to 20 (doc order)
        );

        const snap = await getDocs(q);
        const results: Notification[] = [];
        snap.forEach(d => {
            const data = d.data() as Notification;
            // Client-side filter for Type and Expiry
            if ((data.type === 'special' || data.type === 'attention')) {
                // Check expiry if exists; if NOT exists, assume active (essential for legacy or simplified creation)
                if (data.expiryDate && data.expiryDate.seconds) {
                    if (data.expiryDate.seconds > now.seconds) {
                        results.push({ id: d.id, ...data });
                    }
                } else {
                    // No expiry set -> Always show (or limit to X days logic if desired, but for now show)
                    results.push({ id: d.id, ...data });
                }
            }
        });
        return results;
    } catch (e) {
        console.error("Error fetching marquee:", e);
        return [];
    }
};
