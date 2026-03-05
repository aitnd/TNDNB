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
    getDoc,
    setDoc,
    writeBatch
} from 'firebase/firestore';
import { getDeviceInfo } from './deviceService';

export interface LoginSession {
    id?: string;
    userId: string;
    deviceName: string;
    browser: string;
    ip: string;
    location?: string; // 💖 Địa chỉ từ IP (MỚI)
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

        // 💖 GỬi thông báo khi đăng nhập mới (MỚI) 💖
        try {
            const now = new Date();
            const loginTime = now.toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const notifData = {
                title: '🔐 Đăng nhập mới',
                message: `Tài khoản của bạn vừa đăng nhập từ thiết bị "${deviceInfo.deviceName}" (${deviceInfo.browser}) lúc ${loginTime}. Vị trí: ${deviceInfo.location || deviceInfo.ip}. Nếu không phải là bạn, hãy đổi mật khẩu ngay!`,
                type: 'system',
                senderId: 'system',
                senderName: 'Hệ thống bảo mật',
                targetType: 'user',
                targetId: userId,
                createdAt: serverTimestamp(),
                read: false,
                readBy: [],
                deletedBy: []
            };

            // Ghi thông báo vào subcollection của user
            await addDoc(collection(db, 'users', userId, 'notifications'), notifData);
        } catch (notifError) {
            // Không ảnh hưởng đến việc đăng nhập nếu gửi thông báo thất bại
            console.warn('Failed to send login notification:', notifError);
        }

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
        const currentSessionId = localStorage.getItem(CURRENT_SESSION_ID_KEY);

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

// --- Các role bị giới hạn chỉ đăng nhập 1 thiết bị ---
const SINGLE_SESSION_ROLES = ['hoc_vien'];

// Ngưỡng số thiết bị khác nhau trong 24h để cảnh báo
const SUSPICIOUS_DEVICE_THRESHOLD = 3;

/**
 * Enforce single-device login for restricted roles, then record the new session.
 * - Nếu role nằm trong SINGLE_SESSION_ROLES hoặc là verified_user (có lớp nhưng role vẫn là hoc_vien)
 *   → Logout tất cả session cũ trước khi tạo session mới
 * - Các role khác (VIP, giáo viên, quản lý, admin) → chỉ tạo session mới, không đuổi session cũ
 * 
 * Features:
 * 1. Hiện cảnh báo cho user khi đuổi session cũ (mỗi TK chỉ dùng 1 máy)
 * 2. Nếu đổi máy từ 3 thiết bị trở lên trong 24h → thông báo cho admin + giáo viên lớp
 */
export const enforceAndRecordSession = async (userId: string): Promise<string | null> => {
    try {
        // 1. Lấy profile để kiểm tra role
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);

        let needEnforce = true; // Mặc định enforce cho user mới (chưa có profile)
        let userProfile: any = null;

        if (userSnap.exists()) {
            userProfile = userSnap.data();
            const role = userProfile.role || 'hoc_vien';

            // Các role ĐẶC BIỆT (không bị enforce)
            const exemptRoles = ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'];
            if (exemptRoles.includes(role)) {
                needEnforce = false;
            }

            // VIP cũng được miễn
            if (userProfile.isVip) {
                needEnforce = false;
            }
        }

        // 2. Nếu cần enforce → logout tất cả session cũ
        let hadOldSessions = false;
        if (needEnforce) {
            const q = query(
                collection(db, SESSION_COLLECTION),
                where('userId', '==', userId),
                where('status', '==', 'active')
            );

            const snapshot = await getDocs(q);

            if (snapshot.size > 0) {
                hadOldSessions = true;
                const batch = writeBatch(db);
                snapshot.forEach((docSnap) => {
                    batch.update(docSnap.ref, {
                        status: 'logged_out',
                        loggedOutAt: serverTimestamp(),
                        loggedOutReason: 'new_device_login'
                    });
                });
                await batch.commit();
                console.log(`[Session] Logged out ${snapshot.size} old session(s) for user ${userId}`);
            }
        }

        // 3. Tạo session mới
        const sessionId = await recordLoginSession(userId);

        // 4. Hiện cảnh báo nếu đã đuổi session cũ
        if (hadOldSessions) {
            showSingleDeviceWarning();
        }

        // 5. Kiểm tra đổi máy đáng ngờ (chạy nền, không block)
        if (needEnforce) {
            checkSuspiciousDeviceSwitching(userId, userProfile).catch(err => {
                console.warn('[Session] Suspicious check failed:', err);
            });
        }

        return sessionId;
    } catch (error) {
        console.error('Failed to enforce session:', error);
        // Fallback: vẫn record session dù enforce thất bại
        return await recordLoginSession(userId);
    }
};

/**
 * Hiện cảnh báo cho user biết mỗi tài khoản chỉ dùng 1 máy
 */
const showSingleDeviceWarning = async () => {
    try {
        const { default: Swal } = await import('sweetalert2');
        Swal.fire({
            title: '⚠️ Cảnh báo đăng nhập',
            html: `
                <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                    <p>Tài khoản của bạn vừa được đăng nhập trên thiết bị này.</p>
                    <p><strong>Thiết bị cũ đã bị đăng xuất tự động.</strong></p>
                    <hr style="margin: 10px 0; border-color: #444;" />
                    <p>📌 <strong>Lưu ý quan trọng:</strong></p>
                    <ul style="margin-left: 16px;">
                        <li>Mỗi tài khoản chỉ được sử dụng trên <strong>1 thiết bị</strong> tại một thời điểm.</li>
                        <li><strong>Không chia sẻ</strong> tài khoản cho người khác.</li>
                        <li>Việc đổi máy liên tục sẽ bị hệ thống ghi nhận và <strong>thông báo cho giáo viên</strong>.</li>
                    </ul>
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Tôi đã hiểu',
            confirmButtonColor: '#3085d6',
        });
    } catch (err) {
        console.warn('Failed to show warning:', err);
    }
};

/**
 * Kiểm tra xem user có đổi máy đáng ngờ không (3+ thiết bị khác nhau trong 24h)
 * Nếu có → gửi thông báo cho admin + giáo viên lớp
 */
const checkSuspiciousDeviceSwitching = async (userId: string, userProfile: any) => {
    // Lấy tất cả sessions trong 24h qua
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const q = query(
        collection(db, SESSION_COLLECTION),
        where('userId', '==', userId),
        where('loginAt', '>=', twentyFourHoursAgo),
        orderBy('loginAt', 'desc')
    );

    const snapshot = await getDocs(q);

    // Đếm số thiết bị duy nhất (dựa trên userAgent hoặc deviceName)
    const uniqueDevices = new Set<string>();
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Dùng combo deviceName + browser để xác định thiết bị
        const deviceKey = `${data.deviceName || 'unknown'}_${data.browser || 'unknown'}`;
        uniqueDevices.add(deviceKey);
    });

    console.log(`[Session] User ${userId} used ${uniqueDevices.size} device(s) in last 24h`);

    if (uniqueDevices.size >= SUSPICIOUS_DEVICE_THRESHOLD) {
        console.warn(`[Session] ⚠️ Suspicious: User ${userId} switched ${uniqueDevices.size} devices in 24h!`);
        await notifyAdminsAndTeachers(userId, userProfile, uniqueDevices.size);
    }
};

/**
 * Gửi thông báo cho tất cả admin + giáo viên lớp khi phát hiện đổi máy đáng ngờ
 */
const notifyAdminsAndTeachers = async (userId: string, userProfile: any, deviceCount: number) => {
    try {
        const userName = userProfile?.full_name || userProfile?.fullName || userProfile?.email || userId;
        const userEmail = userProfile?.email || '';
        const courseId = userProfile?.courseId || '';

        const notifMessage = `⚠️ Phát hiện tài khoản "${userName}" (${userEmail}) đã đăng nhập từ ${deviceCount} thiết bị khác nhau trong 24 giờ qua. Có thể tài khoản đang bị chia sẻ cho nhiều người.`;

        const notifData = {
            title: '🔴 Cảnh báo: Chia sẻ tài khoản',
            message: notifMessage,
            type: 'system',
            senderId: 'system',
            senderName: 'Hệ thống bảo mật',
            createdAt: serverTimestamp(),
            read: false,
            readBy: [],
            deletedBy: []
        };

        // 1. Lấy danh sách admin
        const adminQuery = query(
            collection(db, 'users'),
            where('role', '==', 'admin')
        );
        const adminSnap = await getDocs(adminQuery);
        const recipientIds: string[] = [];

        adminSnap.forEach((docSnap) => {
            recipientIds.push(docSnap.id);
        });

        // 2. Lấy giáo viên lớp (nếu học viên thuộc lớp nào)
        if (courseId) {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            if (courseSnap.exists()) {
                const courseData = courseSnap.data();
                const teacherIds: string[] = courseData.teacherIds || [];
                teacherIds.forEach(tid => {
                    if (!recipientIds.includes(tid)) {
                        recipientIds.push(tid);
                    }
                });
            }
        }

        // 3. Gửi thông báo cho từng người nhận
        const batch = writeBatch(db);
        for (const recipientId of recipientIds) {
            const notifRef = doc(collection(db, 'users', recipientId, 'notifications'));
            batch.set(notifRef, {
                ...notifData,
                targetType: 'user',
                targetId: recipientId,
            });
        }

        await batch.commit();
        console.log(`[Session] Sent suspicious activity alert to ${recipientIds.length} recipient(s)`);
    } catch (error) {
        console.error('[Session] Failed to send suspicious activity notification:', error);
    }
};
