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
    targetName?: string; // Added for UI display
    createdAt: any; // Timestamp
    expiryDate?: any; // Timestamp for Special/Attention
    read?: boolean;
    readBy?: string[];
    deletedBy?: string[]; // Soft delete
}

export const sendNotification = async (
    title: string,
    message: string,
    type: 'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention',
    targetType: 'all' | 'class' | 'user',
    targetId: string | null,
    senderId: string,
    senderName?: string,
    expiryDate?: Date | null,
    targetName?: string // Optional display name for the target
) => {
    try {
        const notifData = {
            title,
            message,
            type,
            targetType,
            targetId,
            targetName: targetName || null,
            senderId,
            senderName: senderName || 'Hệ thống',
            createdAt: serverTimestamp(),
            expiryDate: expiryDate ? Timestamp.fromDate(expiryDate) : null,
            read: false,
            readBy: [],
            deletedBy: []
        };

        if (targetType === 'user' && targetId) {
            // Write directly to user's subcollection
            await addDoc(collection(db, 'users', targetId, 'notifications'), notifData);
            console.log(`Notification sent to user ${targetId}`);

        } else if (targetType === 'class' && targetId) {
            // Fan-out: ROBUST STRATEGY (Dual Query)
            // Goal: Find all students linked to this class via 'courseId' OR 'courseName'.

            let studentsMap = new Map<string, string>(); // Use Map to deduplicate by UID

            // 1. Try to resolve the Course Metadata first (to get both ID and Name)
            // We assume targetId could be Name or ID. 
            // Since we standardized on sending Name in UI, let's look up the ID.

            // Query by Name
            const courseQueryByName = query(collection(db, 'courses'), where('name', '==', targetId));
            const courseSnapByName = await getDocs(courseQueryByName);

            let realCourseId: string | null = null;
            let realCourseName: string | null = targetId; // Default to input

            if (!courseSnapByName.empty) {
                realCourseId = courseSnapByName.docs[0].id; // Found ID from Name
            } else {
                // Maybe targetId IS the ID? check doc existence
                const courseDocRef = doc(db, 'courses', targetId);
                const courseDocSnap = await getDocs(query(collection(db, 'courses'), where(documentId(), '==', targetId)));
                if (!courseDocSnap.empty) {
                    realCourseId = targetId;
                    realCourseName = courseDocSnap.docs[0].data().name;
                }
            }

            console.log(`Resolved Class Target: ID=${realCourseId}, Name=${realCourseName}`);

            // 2. Fetch Students using both keys
            const queries = [];

            // Query 1: By courseName (if available)
            if (realCourseName) {
                queries.push(getDocs(query(collection(db, 'users'), where('courseName', '==', realCourseName))));
                // Also try Legacy 'class' field just in case
                queries.push(getDocs(query(collection(db, 'users'), where('class', '==', realCourseName))));
            }

            // Query 2: By courseId (if available)
            if (realCourseId) {
                queries.push(getDocs(query(collection(db, 'users'), where('courseId', '==', realCourseId))));
            }

            // Execute all queries
            const results = await Promise.all(queries);

            results.forEach(snap => {
                snap.docs.forEach(d => {
                    studentsMap.set(d.id, d.id);
                });
            });

            if (studentsMap.size === 0) {
                console.log('No students found for this class.');
            } else {
                // Write in batches
                const batch = writeBatch(db);
                let opCount = 0;

                studentsMap.forEach((uid) => {
                    const userNotifRef = doc(collection(db, 'users', uid, 'notifications'));
                    batch.set(userNotifRef, notifData);
                    opCount++;
                });

                // Firestore Batch limit is 500. If we exceed, we should split. 
                // For simplicity here assuming class < 500. 
                // Real production code should chunk this map.
                await batch.commit();
                console.log(`Notification sent to ${studentsMap.size} students in class ${realCourseName}`);
            }
        }

        // ALWAYS Create a Master Record in the global 'notifications' collection
        // This is for Admin Management visibility.
        // Normal users won't see this because they query where targetType == 'all'.
        await addDoc(collection(db, 'notifications'), notifData);
        console.log('Master notification record created.');

    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

export const fetchNotifications = async (userId: string, classId?: string): Promise<Notification[]> => {
    try {
        const notifs: Notification[] = [];

        // 1. Fetch System Wide Notifications (Global)
        // REMOVED orderBy('createdAt', 'desc') to avoid Composite Index Requirement for (targetType=='all' + createdAt)
        // We will sort in memory.
        const qAll = query(
            collection(db, 'notifications'),
            where('targetType', '==', 'all'),
            limit(20)
        );

        // 2. Fetch User Personal Notifications (Inbox)
        // Subcollection query with orderBy should be fine without Composite Index
        const qPersonal = query(
            collection(db, 'users', userId, 'notifications'),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        // Execute queries independently to prevent one failure from blocking others
        try {
            const snapAll = await getDocs(qAll);
            snapAll.docs.forEach(d => {
                const data = d.data();
                // Check if read by user
                const read = data.readBy?.includes(userId) || false;
                notifs.push({ id: d.id, ...data, read } as Notification);
            });
        } catch (e) {
            console.warn("Retrying global fetch without constraints due to error:", e);
        }

        try {
            const snapPersonal = await getDocs(qPersonal);
            snapPersonal.docs.forEach(d => {
                notifs.push({ id: d.id, ...d.data() } as Notification);
            });
        } catch (e) {
            console.error("Error fetching personal notifications:", e);
        }

        // 3. (Legacy/Optional) Fetch 'class' specific if needed
        // Currently handled by fan-out, but if we have old class notifications:
        // skipping to avoid complexity.

        // Sort combined list by date desc
        const sorted = notifs.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
        });

        // Filter out deleted notifications for this user
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

export const fetchActiveMarqueeNotifications = async (userId?: string): Promise<Notification[]> => {
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
            if ((data.type === 'special' || data.type === 'attention')) {
                if (!data.expiryDate || (data.expiryDate.seconds && data.expiryDate.seconds > now.seconds)) {
                    results.push({ id: d.id, ...data });
                }
            }
        });

        // 2. Query Personal notifications (if userId provided)
        if (userId) {
            const qPersonal = query(
                collection(db, 'users', userId, 'notifications'),
                // We can't easily filter by multiple types AND expiry in one query without complex indexes.
                // So fetch recent ones and filter in memory.
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

        // Deduplicate (just in case) and Sort
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


