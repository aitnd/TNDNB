import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { UserProfile } from '../types';
import {
    Send, Search, MoreHorizontal, Phone, Video, Image as ImageIcon, Smile,
    ChevronLeft, Info, Circle, PhoneIncoming
} from 'lucide-react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseClient';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: any;
    createdAt?: number;
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
    const { socket, isConnected } = useSocket();
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersList, setUsersList] = useState<ChatUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const isAdmin = ['admin', 'quan_ly', 'giao_vien'].includes(userProfile.role);

    // 1. Fetch Users
    useEffect(() => {
        if (!isAdmin) {
            const adminPlaceholder: ChatUser = {
                id: 'admin_placeholder',
                name: 'Ban Quản Trị',
                role: 'admin',
                photoURL: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
            };
            setSelectedUser(adminPlaceholder);
            return;
        }

        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const q = query(collection(db, 'users'), limit(50));
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
                            lastMessage: '',
                            lastMessageTime: ''
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
    }, [isAdmin]);

    // 2. Socket Listeners
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (payload: any) => {
            if (selectedUser && payload.senderId === selectedUser.id) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    senderId: payload.senderId,
                    senderName: 'Sender',
                    content: payload.content,
                    timestamp: new Date()
                }]);
            }
        };

        const handleStatusChange = (payload: { userId: string, isOnline: boolean }) => {
            console.log("Status change:", payload);
            setUsersList(prev => prev.map(u => {
                if (u.id === payload.userId) {
                    return { ...u, isOnline: payload.isOnline };
                }
                return u;
            }));

            // Also update selectedUser if needed
            if (selectedUser && selectedUser.id === payload.userId) {
                setSelectedUser(prev => prev ? { ...prev, isOnline: payload.isOnline } : null);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('user_status_change', handleStatusChange);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('user_status_change', handleStatusChange);
        };
    }, [socket, selectedUser]);

    // 3. Clear/Init Chat
    useEffect(() => {
        if (selectedUser) {
            setMessages([]);
            // Fake initial welcome message
            setTimeout(() => {
                setMessages([{
                    id: 'welcome',
                    senderId: selectedUser.id,
                    senderName: selectedUser.name,
                    content: `Xin chào! Tôi có thể giúp gì cho bạn?`,
                    timestamp: new Date()
                }]);
            }, 500);
        }
    }, [selectedUser]);

    // 4. Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!messageInput.trim() || !selectedUser || !socket) return;

        const content = messageInput;
        setMessageInput('');

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: userProfile.id,
            senderName: userProfile.full_name || 'Me',
            content: content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        socket.emit('send_message', {
            to: selectedUser.id,
            content: content
        });
    };

    const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full h-[calc(100vh-64px)] bg-white dark:bg-black flex">
            {/* LEFT SIDEBAR - Users List */}
            {isAdmin && (
                <div className={`w-full md:w-[360px] border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-black ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {/* Header Sidebar */}
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Đoạn chat</h1>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                    <Video size={20} className="text-gray-600 dark:text-gray-300" />
                                </button>
                                <button className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                                    <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm trên Messenger"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto px-2">
                        {loadingUsers ? (
                            <div className="flex justify-center p-4"><div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div></div>
                        ) : (
                            filteredUsers.map(u => (
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
                                            <span className="truncate max-w-[120px]">{u.lastMessage}</span>
                                            <span>•</span>
                                            <span>{u.lastMessageTime}</span>
                                        </div>
                                    </div>
                                    {u.unreadCount ? (
                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white">{u.unreadCount}</span>
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100"></div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* RIGHT MAIN CHAT AREA */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-black transition-all ${!selectedUser && isAdmin ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                                    <ChevronLeft size={24} className="text-blue-600" />
                                </button>
                                <div className="relative">
                                    <img src={selectedUser.photoURL} alt="Avt" className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700" />
                                    {selectedUser.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{selectedUser.name}</h2>
                                    <span className="text-xs text-green-600 font-medium">Đang hoạt động</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-blue-600">
                                <Phone size={24} className="cursor-pointer hover:opacity-80" />
                                <Video size={24} className="cursor-pointer hover:opacity-80" />
                                <Info size={24} className="cursor-pointer hover:opacity-80" />
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white dark:bg-black">
                            {/* Placeholder Intro */}
                            <div className="flex flex-col items-center mt-8 mb-8 opacity-60">
                                <img src={selectedUser.photoURL} className="w-24 h-24 rounded-full mb-4 object-cover shadow-lg" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                <p className="text-sm text-gray-500">Các bạn là bạn bè trên Facebook</p>
                            </div>

                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === userProfile.id;
                                const showAvatar = !isMe && (idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId);

                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {!isMe && (
                                            <div className="w-8 flex flex-col justify-end">
                                                {showAvatar ? (
                                                    <img src={selectedUser.photoURL} className="w-8 h-8 rounded-full border border-gray-200" />
                                                ) : <div className="w-8" />}
                                            </div>
                                        )}

                                        <div className={`max-w-[70%] px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm ${isMe
                                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md'
                                            : 'bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-md'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-black flex items-center gap-3">
                            <div className="flex gap-2 text-blue-600">
                                <PlusIconBtn icon={<MoreHorizontal size={24} />} />
                                <PlusIconBtn icon={<ImageIcon size={24} />} />
                                <PlusIconBtn icon={<Smile size={24} />} />
                            </div>

                            <form onSubmit={handleSendMessage} className="flex-1 relative">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={e => setMessageInput(e.target.value)}
                                    placeholder="Aa"
                                    className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-400 hover:scale-110 transition-transform"
                                >
                                    <Send size={20} />
                                </button>
                            </form>

                            <div className="text-blue-600 cursor-pointer hover:scale-110 transition-transform">
                                <span className="text-2xl">👍</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Send size={40} className="text-blue-600 -ml-1 mt-1" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Chào mừng đến với Chat</h3>
                        <p className="text-gray-500">Chọn một cuộc hội thoại để bắt đầu</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlusIconBtn = ({ icon }: { icon: React.ReactNode }) => (
    <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
        {icon}
    </button>
);

export default MailboxScreen;
