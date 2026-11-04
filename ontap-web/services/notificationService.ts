import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, orderBy, limit, Timestamp, writeBatch, deleteDoc, documentId } from 'firebase/firestore';
import { db } from './firebaseClient';
import { fetchD1Alerts } from './d1Client';

export const MARQUEE_ALERTS_CACHE_KEY = 'ontap_marquee_alerts_cache';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention';
    senderId: string;
    senderName?: string;
    targetType: 'all' | 'class' | 'user' | 'role'; // Added 'role'
    targetId: string | null;
    targetName?: string;
    targetRoles?: string[]; // Added targetRoles
    createdAt: any;
    expiryDate?: any;
    read?: boolean;
    readBy?: string[];
    deletedBy?: string[];
}

export const sendNotification = async (
    title: string,
    message: string,
    type: 'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention',
    targetType: 'all' | 'class' | 'user' | 'role',
    targetId: string | null,
    senderId: string,
    senderName?: string,
    expiryDate?: Date | null,
    targetName?: string,
    targetRoles?: string[] // Added param
) => {
    try {
        const notifData = {
            title,
            message,
            type,
            targetType: targetType === 'role' ? 'all' : targetType, // Store 'role' type as 'all' but with targetRoles for query compatibility
            _originalTargetType: targetType, // Keep track of original intent if needed
            targetId,
            targetName: targetName || null,
            targetRoles: targetRoles || [],
            senderId,
            senderName: senderName || 'Hệ thống',
            createdAt: serverTimestamp(),
            expiryDate: expiryDate ? Timestamp.fromDate(expiryDate) : null,
            read: false,
            readBy: [],
            deletedBy: []
        };

        if (targetType === 'user' && targetId) {
            await addDoc(collection(db, 'users', targetId, 'notifications'), notifData);
        } else if (targetType === 'class' && targetId) {
            let studentsMap = new Map<string, string>();
            const courseQueryByName = query(collection(db, 'courses'), where('name', '==', targetId));
            const courseSnapByName = await getDocs(courseQueryByName);
            let realCourseId: string | null = null;
            let realCourseName: string | null = targetId;

            if (!courseSnapByName.empty) {
                realCourseId = courseSnapByName.docs[0].id;
            } else {
                const courseDocSnap = await getDocs(query(collection(db, 'courses'), where(documentId(), '==', targetId)));
                if (!courseDocSnap.empty) {
                    realCourseId = targetId;
                    realCourseName = courseDocSnap.docs[0].data().name;
                }
            }

            const queries = [];
            if (realCourseName) queries.push(getDocs(query(collection(db, 'users'), where('courseName', '==', realCourseName))));
            if (realCourseId) queries.push(getDocs(query(collection(db, 'users'), where('courseId', '==', realCourseId))));

            const results = await Promise.all(queries);
            results.forEach(snap => {
                snap.docs.forEach(d => studentsMap.set(d.id, d.id));
            });

            if (studentsMap.size > 0) {
                const batch = writeBatch(db);
                studentsMap.forEach((uid) => {
                    const userNotifRef = doc(collection(db, 'users', uid, 'notifications'));
                    batch.set(userNotifRef, notifData);
                });
                await batch.commit();
            }
        }

        // Create Master Record (for 'all', 'role', and 'class' master copy)
        await addDoc(collection(db, 'notifications'), notifData);

    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

export const fetchNotifications = async (userId: string, _classId?: string, userRole?: string): Promise<Notification[]> => {
    try {
        const notifs: Notification[] = [];

        // 1. Fetch System Wide Notifications (Global)
        const qAll = query(
            collection(db, 'notifications'),
            where('targetType', '==', 'all'),
            limit(20)
        );

        // 2. Fetch User Personal Notifications
        const qPersonal = query(
            collection(db, 'users', userId, 'notifications'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        try {
            const snapAll = await getDocs(qAll);
            snapAll.docs.forEach(d => {
                const data = d.data();
                // Filter by Role if targetRoles exists
                if (data.targetRoles && Array.isArray(data.targetRoles) && data.targetRoles.length > 0) {
                    if (!userRole || !data.targetRoles.includes(userRole)) {
                        return; // Skip if role doesn't match
                    }
                }

                const read = data.readBy?.includes(userId) || false;
                notifs.push({ id: d.id, ...data, read } as Notification);
            });
        } catch (e) {
            console.warn("Error fetching global:", e);
        }

        try {
            const snapPersonal = await getDocs(qPersonal);
            snapPersonal.docs.forEach(d => {
                notifs.push({ id: d.id, ...d.data() } as Notification);
            });
        } catch (e) {
            console.error("Error fetching personal:", e);
        }

        const sorted = notifs.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });

        return sorted.filter(n => !n.deletedBy?.includes(userId));

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const deleteNotificationForUser = async (notificationId: string, userId: string) => {
    try {
        const globalRef = doc(db, 'notifications', notificationId);
        const { arrayUnion } = await import('firebase/firestore');
        try {
            await updateDoc(globalRef, {
                deletedBy: arrayUnion(userId)
            });
            return;
        } catch (e) {
            // Not global, try Personal
        }

        const personalRef = doc(db, 'users', userId, 'notifications', notificationId);
        await updateDoc(personalRef, {
            deletedBy: arrayUnion(userId)
        });

    } catch (error) {
    }
};

export const fetchActiveMarqueeNotifications = async (userId?: string, userRole?: string): Promise<Notification[]> => {
    try {
        const remoteAlerts = await fetchD1Alerts({
            marquee: true,
            role: userRole,
            userId
        });

        if (Array.isArray(remoteAlerts) && remoteAlerts.length > 0) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(MARQUEE_ALERTS_CACHE_KEY, JSON.stringify(remoteAlerts));
                }
            } catch {}
            return remoteAlerts as Notification[];
        }

        // Khi online nhưng D1 trả về rỗng, cập nhật cache rỗng
        if (Array.isArray(remoteAlerts) && (typeof navigator === 'undefined' || navigator.onLine)) {
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(MARQUEE_ALERTS_CACHE_KEY, JSON.stringify([]));
                }
            } catch {}
            return [];
        }

        // Mất mạng (offline) hoặc lỗi D1: Đọc từ localStorage cache
        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(MARQUEE_ALERTS_CACHE_KEY);
            if (cached) {
                return JSON.parse(cached) as Notification[];
            }
        }
        return [];
    } catch (e) {
        console.error("Error fetching marquee from D1:", e);
        try {
            if (typeof localStorage !== 'undefined') {
                const cached = localStorage.getItem(MARQUEE_ALERTS_CACHE_KEY);
                if (cached) {
                    return JSON.parse(cached) as Notification[];
                }
            }
        } catch {}
        return [];
    }
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
    try {
        const personalRef = doc(db, 'users', userId, 'notifications', notificationId);
        try {
            await updateDoc(personalRef, { read: true });
            return; // Success, it was personal
        } catch (e) {
            // If error is "not found", try global
        }

        // Try Global
        const globalRef = doc(db, 'notifications', notificationId);
        const { arrayUnion } = await import('firebase/firestore');
        await updateDoc(globalRef, {
            readBy: arrayUnion(userId)
        });

    } catch (error) {
        console.error("Error marking read:", error);
    }
};

// --- MANAGEMENT FUNCTIONS ---

export const fetchAllGlobalNotifications = async (): Promise<Notification[]> => {
    try {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification));
    } catch (e) {
        console.error("Error fetching all notifications:", e);
        return [];
    }
};

export const hardDeleteNotification = async (notificationId: string) => {
    try {
        await deleteDoc(doc(db, 'notifications', notificationId));
        return true;
    } catch (e) {
        console.error("Error deleting notification:", e);
        return false;
    }
};

export const updateNotification = async (id: string, data: any) => {
    try {
        const ref = doc(db, 'notifications', id);
        await updateDoc(ref, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error updating notification:", e);
        return false;
    }
};
