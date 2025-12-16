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

// 3. Socket Logic
io.on('connection', (socket) => {
    // Map userId -> socketId (In-memory - Prod nên dùng Redis)
    const userId = socket.user ? socket.user.uid : 'anonymous';

    if (userId !== 'anonymous') {
        // Track Online User
        socket.join(userId);
        console.log(`User ${userId} CONNECTED (${socket.id})`);

        // Broadcast to ALL clients that this user is now Online
        io.emit('user_status_change', { userId, isOnline: true });
    }

    // --- Mailbox Logic ---
    socket.on('send_message', async (data) => {
        // data: { to: 'userId', content: '...' }
        const { to, content } = data;
        const senderId = socket.user ? socket.user.uid : 'anonymous';

        // Emit to recipient if online/in-room
        io.to(to).emit('receive_message', {
            senderId,
            content,
            timestamp: new Date()
        });
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
