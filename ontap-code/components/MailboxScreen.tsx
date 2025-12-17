import React, { useState, useEffect, useRef } from 'react';
// import { useSocket } from '../contexts/SocketContext'; // Removed
import { UserProfile } from '../types';
import {
    Send, Search, MoreHorizontal, Phone, Video, Image as ImageIcon, Smile,
    ChevronLeft, Info, Trash2, WifiOff, Check, Clock, AlertCircle
} from 'lucide-react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { collection, query, limit, getDocs, where, orderBy, startAfter, QueryDocumentSnapshot, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db, rtdb } from '../services/firebaseClient';
import { ref, set, onValue, remove, onDisconnect, serverTimestamp as rtdbServerTimestamp } from 'firebase/database';
import { motion } from 'framer-motion';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: any;
    createdAt?: number;
    status?: 'sending' | 'sent' | 'error';
}

interface ChatUser {
    id: string;
    name: string;
    photoURL?: string;
    role: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isOnline?: boolean;
}

interface MailboxScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}


const MailboxScreen: React.FC<MailboxScreenProps> = ({ userProfile, onBack }) => {
    // const { socket, isConnected } = useSocket(); // Removed
    const isConnected = true; // Firebase handles connection state internally, or we can listen to .info/connected
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    const [isAdmin, setIsAdmin] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([]); // Displayed list
    const [loadingUsers, setLoadingUsers] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsAdmin(['admin', 'quan_ly', 'giao_vien'].includes(userProfile.role));
    }, [userProfile.role]);

    // 1. Fetch Users / Setup Sidebar
    useEffect(() => {
        if (!isAdmin) {
            // ROLE: STUDENT - Only show Admin/Support
            const adminUser: ChatUser = {
                id: 'admin_support',
                name: 'Ban Quản Trị',
                role: 'admin',
                photoURL: '/assets/img/avatar.webp.webp',
                lastMessage: 'Chào bạn, chúng tôi có thể giúp gì?',
                isOnline: true
            };
            setUsersList([adminUser]);
            setFilteredUsers([adminUser]);
            // Auto select admin for student convenience? Maybe not force it, let them choose.
            // But usually Messenger on mobile opens the list. On web maybe same.
            return;
        }

        // ROLE: STAFF - Fetch All but filter UI
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const q = query(collection(db, 'users'), limit(100)); // Fetch more to search
                const snapshot = await getDocs(q);
                const fetchedUsers: ChatUser[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (doc.id !== userProfile.id) {
                        fetchedUsers.push({
                            id: doc.id,
                            name: data.full_name || data.fullName || 'Người dùng',
                            photoURL: data.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name || 'User')}&background=random`,
                            role: data.role || 'hoc_vien',
                            lastMessage: '', // Initially empty (No persistence yet)
                            lastMessageTime: '',
                            unreadCount: 0
                        });
                    }
                });
                setUsersList(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [isAdmin, userProfile.id]);

    // Filter Logic: Active vs Search
    useEffect(() => {
        if (!isAdmin) return;

        if (searchTerm.trim()) {
            // Search Mode: Show matches
            const lower = searchTerm.toLowerCase();
            setFilteredUsers(usersList.filter(u => u.name.toLowerCase().includes(lower)));
        } else {
            // Default Mode: Show ONLY users with activity (active conversations)
            // Note: Without DB persistence, this resets on reload.
            const activeUsers = usersList.filter(u => u.lastMessage || u.unreadCount);
            setFilteredUsers(activeUsers);
        }
    }, [searchTerm, usersList, isAdmin]);

    // 2. Realtime Listeners (Firestore & RTDB)
    useEffect(() => {
        if (!selectedUser) return;

        // A. Message Listener (Firestore)
        const conversationId = [userProfile.id, selectedUser.id].sort().join('_');
        const q = query(
            collection(db, 'messages'),
            where('conversationId', '==', conversationId),
            where('visibleTo', 'array-contains', userProfile.id),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                msgs.push({
                    id: doc.id,
                    senderId: data.senderId,
                    senderName: '',
                    content: data.content,
                    timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
                    status: 'sent'
                });
            });
            setMessages(msgs.reverse());
        });

        // B. Typing Listener (RTDB)
        // Path: typing/{conversationId}/{otherUserId}
        const typingRef = ref(rtdb, `typing/${conversationId}/${selectedUser.id}`);
        const unsubscribeTyping = onValue(typingRef, (snapshot) => {
            setOtherUserTyping(snapshot.exists() && snapshot.val() === true);
        });

        return () => {
            unsubscribeMessages();
            unsubscribeTyping();
        };
    }, [selectedUser, userProfile.id]);

    // C. Global User Status Listener (RTDB)
    useEffect(() => {
        const statusRef = ref(rtdb, 'status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            if (snapshot.exists()) {
                const statuses = snapshot.val();
                setUsersList(prev => prev.map(u => ({
                    ...u,
                    isOnline: statuses[u.id]?.state === 'online'
                })));
            }
        });
        return () => unsubscribeStatus();
    }, []);

    const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        if (!selectedUser) return;
        const conversationId = [userProfile.id, selectedUser.id].sort().join('_');
        const myTypingRef = ref(rtdb, `typing/${conversationId}/${userProfile.id}`);

        if (!isTyping) {
            setIsTyping(true);
            set(myTypingRef, true);
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            remove(myTypingRef);
        }, 2000);
    };

    const handleSendMessage = async (e?: React.FormEvent, customContent?: string) => {
        e?.preventDefault();
        const content = customContent || messageInput;
        if (!content.trim() || !selectedUser) return;

        if (!customContent) {
            setMessageInput('');
            setIsTyping(false);
            // Stop typing in RTDB
            const conversationId = [userProfile.id, selectedUser.id].sort().join('_');
            remove(ref(rtdb, `typing/${conversationId}/${userProfile.id}`));
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }

        // Optimistic UI (Optional, since Firestore is fast/offline capable)
        // But Firestore listener will update UI anyway.

        try {
            const conversationId = [userProfile.id, selectedUser.id].sort().join('_');
            await addDoc(collection(db, 'messages'), {
                senderId: userProfile.id,
                receiverId: selectedUser.id,
                content: content,
                timestamp: serverTimestamp(),
                visibleTo: [userProfile.id, selectedUser.id],
                conversationId
            });

            // Sidebar update is tricky without a listener on ALL conversations.
            // For now, we can manually update local state for the current user.
            setUsersList(prev => {
                const newList = [...prev];
                const idx = newList.findIndex(u => u.id === selectedUser.id);
                if (idx > -1) {
                    const user = { ...newList[idx] };
                    user.lastMessage = content === '👍' ? 'Đã gửi một like' : content;
                    user.lastMessageTime = 'Vừa xong';
                    newList.splice(idx, 1);
                    newList.unshift(user);
                }
                return newList;
            });

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Lỗi gửi tin nhắn");
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        if (!confirm("Bạn có chắc muốn xóa tin nhắn này ở phía bạn?")) return;
        try {
            await updateDoc(doc(db, 'messages', msgId), {
                visibleTo: arrayRemove(userProfile.id)
            });
        } catch (e) {
            console.error("Error deleting:", e);
        }
    };

    // State for pagination
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    // Initial Fetch (History) - REMOVED because onSnapshot handles it
    // But we might need it for pagination if onSnapshot only gets recent.
    // Actually, onSnapshot with limit(50) is fine for initial.
    // Pagination logic needs to be adjusted to use startAfter with a one-time fetch, not snapshot.
    // For simplicity in this migration, let's rely on the snapshot for the first 50.
    // Load More can still use getDocs.

    // useEffect(() => { ... }, [selectedUser]); // Replaced by onSnapshot effect above

    const loadMoreMessages = async () => {
        if (!selectedUser || !lastVisible || loadingMore) return;
        setLoadingMore(true);
        const conversationId = [userProfile.id, selectedUser.id].sort().join('_');

        try {
            const q = query(
                collection(db, 'messages'),
                where('conversationId', '==', conversationId),
                where('visibleTo', 'array-contains', userProfile.id),
                orderBy('timestamp', 'desc'),
                startAfter(lastVisible),
                limit(20)
            );

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const olderMessages: Message[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    olderMessages.push({
                        id: doc.id,
                        senderId: data.senderId,
                        senderName: '',
                        content: data.content,
                        timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
                        status: 'sent'
                    });
                });

                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

                // Prepend older messages
                setMessages(prev => [...olderMessages.reverse(), ...prev]);
            } else {
                setLastVisible(null); // No more messages
            }
        } catch (error) {
            console.error("Error loading more:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // 3. Auto-scroll
    // Removed messagesEndRef and its useEffect as Virtuoso handles scrolling.



    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleSendMessage(undefined, `[Đã gửi ảnh: ${file.name}]`);
            // Note: Real upload logic would go here
        }
    };

    return (
        <div className="w-full h-[calc(100vh-64px)] bg-white dark:bg-black flex">
            {/* LEFT SIDEBAR - Users List */}
            {/* Show for EVERYONE now, but filtered */}
            <div className={`w-full md:w-[360px] border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-black ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {/* Header Sidebar */}
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Chat</h1>
                        <div className="flex gap-2">
                            {/* Decorative Buttons */}
                            <button className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                <Video size={20} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar - Hidden for students if mostly just Admin */}
                    {isAdmin && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Tìm người dùng..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-gray-700 dark:text-gray-200"
                            />
                        </div>
                    )}
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto px-2">
                    {loadingUsers ? (
                        <div className="flex justify-center p-4"><div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div></div>
                    ) : (
                        <>
                            {isAdmin && !searchTerm && filteredUsers.length === 0 && (
                                <div className="text-center p-8 text-gray-500 text-sm">
                                    <p>Chưa có cuộc trò chuyện nào.</p>
                                    <p className="mt-1">Tìm kiếm để bắt đầu chat!</p>
                                </div>
                            )}

                            {filteredUsers.map(u => (
                                <motion.div
                                    key={u.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedUser(u)}
                                    className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all mb-1 ${selectedUser?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <div className="relative">
                                        <img src={u.photoURL} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-gray-100 dark:border-gray-800" />
                                        {u.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{u.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className={`truncate max-w-[140px] ${u.unreadCount ? 'font-bold text-gray-900 dark:text-gray-100' : ''}`}>
                                                {u.lastMessage || (u.role === 'admin' ? 'Hỗ trợ trực tuyến' : 'Bắt đầu trò chuyện')}
                                            </span>
                                            {u.lastMessageTime && (
                                                <>
                                                    <span className="text-xs">•</span>
                                                    <span className="text-xs">{u.lastMessageTime}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {u.unreadCount ? (
                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                            <span className="text-[10px] font-bold text-white">{u.unreadCount}</span>
                                        </div>
                                    ) : null}
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* RIGHT MAIN CHAT AREA */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-black transition-all ${!selectedUser ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                                    <ChevronLeft size={24} className="text-blue-600" />
                                </button>
                                <div className="relative">
                                    <img src={selectedUser.photoURL} alt="Avt" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                                    {selectedUser.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{selectedUser.name}</h2>
                                    <span className={`text-xs font-medium flex items-center gap-1 ${selectedUser.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                        {selectedUser.isOnline ? <><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Đang hoạt động</> : 'Ngoại tuyến'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-blue-600">
                                <Phone size={24} className="cursor-pointer hover:opacity-80 disabled-opacity" />
                                <Video size={24} className="cursor-pointer hover:opacity-80 disabled-opacity" />
                                <Info size={24} className="cursor-pointer hover:opacity-80" />
                            </div>
                        </div>


                        {/* Connection Warning */}
                        {!isConnected && (
                            <div className="bg-red-500 text-white text-xs py-1 px-4 text-center flex items-center justify-center gap-2 animate-pulse">
                                <WifiOff size={14} /> Mất kết nối máy chủ. Đang thử kết nối lại...
                            </div>
                        )}

                        {/* Messages Area - Virtualized */}
                        <div className="flex-1 p-4 bg-white dark:bg-black overflow-hidden">
                            <Virtuoso
                                ref={virtuosoRef}
                                style={{ height: '100%' }}
                                data={messages}
                                startReached={loadMoreMessages}
                                initialTopMostItemIndex={messages.length - 1} // Start at bottom
                                followOutput={'auto'} // Stick to bottom on new messages
                                alignToBottom={true} // Important for chat
                                itemContent={(index, msg) => {
                                    const isMe = msg.senderId === userProfile.id;
                                    const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId);

                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex gap-2 group mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {!isMe && (
                                                <div className="w-8 flex flex-col justify-end">
                                                    {showAvatar ? (
                                                        <img src={selectedUser.photoURL} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                                                    ) : <div className="w-8" />}
                                                </div>
                                            )}

                                            {/* Action Buttons (Delete) */}
                                            {isMe && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mr-2">
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-zinc-800 rounded-full"
                                                        title="Xóa ở phía tôi"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            {!isMe && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center order-last ml-2">
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-zinc-800 rounded-full"
                                                        title="Xóa ở phía tôi"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-end">
                                                <div className={`px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm ${isMe
                                                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md'
                                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-md border border-gray-200 dark:border-gray-700'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                                {/* Status Icons */}
                                                {isMe && (
                                                    <div className="flex items-center justify-end text-[10px] text-gray-400 mt-1 mr-1 gap-1 h-3">
                                                        {msg.status === 'sending' && <Clock size={10} className="animate-spin" />}
                                                        {msg.status === 'sent' && <Check size={12} className="text-blue-500" />}
                                                        {msg.status === 'error' && <AlertCircle size={12} className="text-red-500" />}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                }}
                                components={{
                                    Header: () => (
                                        <div className="py-4">
                                            {loadingMore && <div className="text-center text-xs text-gray-400">Đang tải tin cũ hơn...</div>}
                                            {/* Placeholder Intro if at top */}
                                            {!loadingMore && !lastVisible && (
                                                <div className="flex flex-col items-center mt-4 mb-8 opacity-60">
                                                    <img src={selectedUser.photoURL} className="w-20 h-20 rounded-full mb-4 object-cover shadow-lg border-2 border-white" />
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {isAdmin ? 'Thông tin học viên / đồng nghiệp' : 'Ban Quản Trị Hệ Thống'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                    Footer: () => otherUserTyping ? (
                                        <div className="flex justify-start mb-2 ml-10 mt-2">
                                            <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-md flex gap-1 items-center">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    ) : null
                                }}
                            />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-black flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 relative">
                            {/* Disabled Input overlay if offline */}
                            {!isConnected && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center cursor-not-allowed"></div>
                            )}

                            <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-full transition-colors relative">
                                <ImageIcon size={20} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                />
                            </button>
                            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 rounded-full px-4 py-2">
                                <input
                                    type="text"
                                    placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối lại..."}
                                    value={messageInput}
                                    onChange={handleTypingInput}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-500"
                                    disabled={!isConnected}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMessageInput(prev => prev + '😊')}
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                >
                                    <Smile size={20} />
                                </button>
                            </form>
                            {messageInput.trim() ? (
                                <button
                                    onClick={handleSendMessage}
                                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center"
                                >
                                    <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSendMessage(undefined, '👍')}
                                    className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <span className="text-xl">👍</span>
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Send size={40} className="text-blue-600 -ml-1 mt-1" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Chào mừng đến với Chat</h3>
                        <p className="text-gray-500 mt-2">Chọn một cuộc hội thoại từ danh sách bên trái</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlusIconBtn = ({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-blue-600">
        {icon}
    </button>
);

export default MailboxScreen;
