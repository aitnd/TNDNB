const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// 1. Init Firebase Admin
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());

// Serve Static Files (Production Build)
const path = require('path');
const buildPath = path.join(__dirname, '../../public/ontap');
app.use('/ontap', express.static(buildPath));

// Redirect root to /ontap (Removed per user request)
// app.get('/', (req, res) => {
//     res.redirect('/ontap');
// });

// Fallback for SPA (React Router) - Using Regex to avoid path-to-regexp errors
app.get([/^\/ontap\/.*$/, /^\/thitructuyen\/?.*$/], (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 2. Middleware xác thực Socket
io.use(async (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        // Cho phép kết nối ẩn danh (nếu cần) hoặc từ chối
        // next(new Error("Authentication error")); 
        // Tạm thời cho phép kết nối để test, nhưng khuyến khích gửi token
        console.log("Anonymous connection:", socket.id);
        return next();
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        socket.user = decodedToken;
        console.log("Authenticated User:", decodedToken.email);
        next();
    } catch (error) {
        console.error("Auth Fail:", error.message);
        next(new Error("Authentication error"));
    }
});

// Middleware xác thực API REST
const authenticateAPI = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("API Auth Fail:", error);
        return res.status(403).json({ error: 'Forbidden' });
    }
};

app.use(express.json()); // Enable JSON body parsing

// API Reset Password
app.post('/api/admin/reset-password', authenticateAPI, async (req, res) => {
    const { targetUserId, newPassword } = req.body;
    const requesterUid = req.user.uid;

    if (!targetUserId || !newPassword) {
        return res.status(400).json({ error: 'Missing targetUserId or newPassword' });
    }

    try {
        // Check requester role (Optional: fetch from Firestore if claims not set)
        // For now, assume if they have valid token and calling this, we check Firestore
        const requesterDoc = await admin.firestore().collection('users').doc(requesterUid).get();
        if (!requesterDoc.exists || !['admin', 'quan_ly', 'lanh_dao'].includes(requesterDoc.data().role)) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        await admin.auth().updateUser(targetUserId, {
            password: newPassword
        });

        console.log(`Admin ${requesterUid} reset password for user ${targetUserId}`);
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Socket Logic
io.on('connection', (socket) => {
    // Map userId -> socketId (In-memory - Prod nên dùng Redis)
    const userId = socket.user ? socket.user.uid : 'anonymous';
    const userRole = socket.user ? socket.user.role : ''; // Claims require setting in Firebase logic
    // Or fetch role from Firestore if not in token

    if (userId !== 'anonymous') {
        // Track Online User
        socket.join(userId);
        console.log(`User ${userId} CONNECTED (${socket.id})`);

        // Update Firestore isOnline = true
        admin.firestore().collection('users').doc(userId).update({
            isOnline: true,
            lastSeen: admin.firestore.FieldValue.serverTimestamp()
        }).catch(err => console.log("Error updating online status:", err.message));

        // ADMIN SUPPORT: If user is admin/teacher, join 'admin_support'
        // Since we might not have role in token claims yet, let's allow client to join.
        // OR: Fetch user role here?
        // Let's rely on client emitting 'join_admin' or just broadacast to specific admins.
        // For now: Simpler - If client says "I am admin", believe them? No.
        // Safest: Check DB.
        admin.firestore().collection('users').doc(userId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                if (['admin', 'quan_ly', 'giao_vien'].includes(data.role)) {
                    socket.join('admin_support');
                    console.log(`User ${userId} joined admin_support`);
                }
            }
        });

        // Broadcast to ALL clients that this user is now Online
        io.emit('user_status_change', { userId, isOnline: true });
    }

    // Handle Disconnect
    socket.on('disconnect', () => {
        if (userId !== 'anonymous') {
            admin.firestore().collection('users').doc(userId).update({
                isOnline: false,
                lastSeen: admin.firestore.FieldValue.serverTimestamp()
            }).catch(err => console.log("Error updating offline status:", err.message));

            io.emit('user_status_change', { userId, isOnline: false });
        }
    });

    // --- Mailbox Logic ---
    socket.on('send_message', async (data, callback) => {
        // data: { to: 'userId', content: '...' }
        const { to, content } = data;
        const senderId = socket.user ? socket.user.uid : 'anonymous';

        // 1. Save to Firestore (Persistence)
        try {
            const conversationId = [senderId, to].sort().join('_');
            const messageData = {
                senderId,
                receiverId: to,
                content,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                visibleTo: [senderId, to], // For "Delete for me" feature
                conversationId
            };

            // Special handling for messages TO 'admin_support'
            // We still need to save it. But conversationId might need care.
            // If sender is Student, to is 'admin_support'. convId = 'admin_support_studentID'.
            // Admins need to query this.

            const docRef = await admin.firestore().collection('messages').add(messageData);

            // Acknowledge success to sender (Optimistic UI)
            if (callback) callback({ status: 'ok', id: docRef.id });

        } catch (error) {
            console.error("Error saving message:", error);
            if (callback) callback({ status: 'error' });
        }

        // 2. Emit to receiver
        if (to === 'admin_support') {
            io.to('admin_support').emit('receive_message', {
                senderId,
                content,
                timestamp: new Date()
            });
        } else {
            io.to(to).emit('receive_message', {
                senderId,
                content,
                timestamp: new Date()
            });
        }
    });

    // --- Typing Indicators ---
    socket.on('typing', (data) => {
        const { to } = data;
        const senderId = socket.user ? socket.user.uid : 'anonymous';
        if (to === 'admin_support') {
            io.to('admin_support').emit('user_typing', { senderId: userId });
        } else {
            io.to(to).emit('user_typing', { senderId: userId });
        }
    });

    socket.on('stop_typing', (data) => {
        const { to } = data;
        const senderId = socket.user ? socket.user.uid : 'anonymous';
        if (to === 'admin_support') {
            io.to('admin_support').emit('user_stop_typing', { senderId: userId });
        } else {
            io.to(to).emit('user_stop_typing', { senderId: userId });
        }
    });


    // --- Delete Message Logic (Delete for Me) ---
    socket.on('delete_message', async (messageId) => {
        const userId = socket.user ? socket.user.uid : 'anonymous';
        if (userId === 'anonymous') return;

        try {
            // Remove user from 'visibleTo' array
            await admin.firestore().collection('messages').doc(messageId).update({
                visibleTo: admin.firestore.FieldValue.arrayRemove(userId)
            });

            // Notify client to remove from UI
            socket.emit('delete_message_success', messageId);
            console.log(`User ${userId} deleted message ${messageId}`);

        } catch (error) {
            console.error("Error deleting message:", error);
            socket.emit('delete_message_error', "Không thể xóa tin nhắn");
        }
    });

    // --- Notification Logic ---
    socket.on('send_notification', (data) => {
        const { to, title, body, link } = data;
        io.to(to).emit('receive_notification', {
            title,
            body,
            link,
            timestamp: new Date(),
            read: false
        });
    });

    socket.on('broadcast_notification', (data) => {
        io.emit('receive_notification', {
            title: data.title,
            body: data.body,
            link: data.link,
            timestamp: new Date(),
            read: false,
            broadcast: true
        });
    });

    // --- Check Online Status ---
    socket.on('check_online_status', (data, callback) => {
        // Client asks if specific users are online
        // For MVP, just return if specific rooms exist
        // Better way: maintain a Map<userId, socketId> global
    });

    socket.on('disconnect', () => {
        if (userId !== 'anonymous') {
            console.log(`User ${userId} DISCONNECTED`);
            // Broadcast Offline
            io.emit('user_status_change', { userId, isOnline: false });
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT}`);
    console.log(`Firebase Admin Initialized for Project: ${serviceAccount.project_id}`);
});
