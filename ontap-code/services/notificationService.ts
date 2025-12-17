import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp, orderBy, limit, Timestamp, writeBatch, deleteDoc, documentId } from 'firebase/firestore';
import { db } from './firebaseClient';

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
            // ... (Existing class logic) ...
            // Simplified for brevity, assuming existing logic is preserved or we just use the same logic as before
            // For this edit, I will just copy the existing class logic or refer to it.
            // Since I am replacing the whole function, I need to be careful.
            // Let's use the existing logic but wrapped.

            // RE-IMPLEMENTING CLASS LOGIC BRIEFLY TO ENSURE IT WORKS
            let studentsMap = new Map<string, string>();
            const courseQueryByName = query(collection(db, 'courses'), where('name', '==', targetId));
            const courseSnapByName = await getDocs(courseQueryByName);
            let realCourseId: string | null = null;
            let realCourseName: string | null = targetId;

            if (!courseSnapByName.empty) {
                realCourseId = courseSnapByName.docs[0].id;
            } else {
                const courseDocRef = doc(db, 'courses', targetId);
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

export const fetchNotifications = async (userId: string, classId?: string, userRole?: string): Promise<Notification[]> => {
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
        // Try finding in Global first (most likely for shared ones) or Personal
        // Efficient way: Check if it's in Personal subcollection. If so, delete logic optional (can just hard delete or soft delete).
        // Requirement: "ai muốn xóa hay đọc cũng chỉ có hiệu lực ở trong Inbox thôi, ... nó vẫn chạy ngang màn hình"
        // So for Global notifications, we MUST soft delete (add to deletedBy).
        // For Personal notifications (in user's subcollection), we could hard delete, BUT to keep consistent history or "Marquee" if applicable (though personal messages usually don't marquee), let's soft delete too. (Or hard delete is fine if it's personal).

        // Logic: Try Soft Delete on Global first.
        const globalRef = doc(db, 'notifications', notificationId);
        // Check if exists? Or just try update.
        // If it's a global notification, we append to deletedBy.

        // If it's a personal notification (subcollection), we can just hard delete it, because it only affects that user. 
        // BUT wait, "Notification Banner" might fetch from Personal too? Usually Marquee is "Special/Attention" which are likely Global ('all').

        // Let's try soft delete on Global first.
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
        const now = Timestamp.now();
        const results: Notification[] = [];

        // 1. Query Global notifications
        const qGlobal = query(
            collection(db, 'notifications'),
            where('targetType', '==', 'all'),
            limit(20)
        );

        const snapGlobal = await getDocs(qGlobal);
        snapGlobal.forEach(d => {
            const data = d.data() as Notification;

            // Role Filter
            if (data.targetRoles && Array.isArray(data.targetRoles) && data.targetRoles.length > 0) {
                if (!userRole || !data.targetRoles.includes(userRole)) {
                    return;
                }
            }

            if ((data.type === 'special' || data.type === 'attention')) {
                if (!data.expiryDate || (data.expiryDate.seconds && data.expiryDate.seconds > now.seconds)) {
                    results.push({ id: d.id, ...data });
                }
            }
        });

        // 2. Query Personal notifications
        if (userId) {
            const qPersonal = query(
                collection(db, 'users', userId, 'notifications'),
                orderBy('createdAt', 'desc'),
                limit(20)
            );

            const snapPersonal = await getDocs(qPersonal);
            snapPersonal.forEach(d => {
                const data = d.data() as Notification;
                if ((data.type === 'special' || data.type === 'attention')) {
                    if (!data.expiryDate || (data.expiryDate.seconds && data.expiryDate.seconds > now.seconds)) {
                        results.push({ id: d.id, ...data });
                    }
                }
            });
        }

        const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values());

        return uniqueResults.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });

    } catch (e) {
        console.error("Error fetching marquee:", e);
        return [];
    }
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
    try {
        // Try to find it in personal subcollection first
        // Note: We don't know easily if it's Global or Personal just by ID unless we encode it or try both.
        // But typically, the UI calling this knows where it came from.
        // For simplicity, we will try updating the personal doc. IF it fails, we assume it's global.

        // HOWEVER, to be robust: 
        // We can just rely on the fact that 'fetchNotifications' returns objects. 
        // Maybe we should pass the 'type' or 'source' to this function?
        // Let's try updating personal first.

        // Strategy: 
        // 1. Attempt update in `users/{uid}/notifications/{id}` setting `read: true`.
        // 2. If it is a global notification, that path won't exist (assuming IDs don't collide). 
        //    Then we update `notifications/{id}` adding user to `readBy`.

        // Actually, checking existence is better.
        // Use `id` to check personal subcollection.

        // Is it possible to just try both? inefficient.
        // Better: We'll assume personal first as that's the new standard.
        // For Global notifs (legacy or system), they are less frequent.

        // NOTE: In a real app, we should structure the Notification object to have a 'refPath' or 'isGlobal'.
        // For now, let's look at the fetch logic. User Personal notifs come from subcollection.

        // Let's just try updating Personal.
        const personalRef = doc(db, 'users', userId, 'notifications', notificationId);

        // We can use a lightweight check? No, just try update.
        // Firestore update fails if doc doesn't exist.
        try {
            await updateDoc(personalRef, { read: true });
            return; // Success, it was personal
        } catch (e) {
            // If error is "not found", try global
            // console.log("Not found in personal, trying global...");
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


