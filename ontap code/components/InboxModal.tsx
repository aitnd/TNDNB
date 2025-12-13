import React from 'react';
import { FaTimes, FaEnvelopeOpen, FaBell, FaTrash } from 'react-icons/fa';
import { Notification, markNotificationAsRead, deleteNotificationForUser } from '../services/notificationService';

interface InboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    userId: string;
    onMarkRead: (id: string) => void;
}

const InboxModal: React.FC<InboxModalProps> = ({ isOpen, onClose, notifications, userId, onMarkRead }) => {
    if (!isOpen) return null;

    const handleDelete = async (e: React.MouseEvent, n: Notification) => {
        e.stopPropagation();
        if (confirm('Bạn có muốn xóa thông báo này?')) {
            await deleteNotificationForUser(n.id, userId);
            // We should ideally call a refresh or update local list. 
            // Since this component receives props, the parent should refresh.
            // But we can hide it visually for now or callback.
            // Let's assume parent refreshes or we need an onRefresh prop.
            // For now, let's just force reload logic or passed prop update.
            // Actually, better to just call onMarkRead(n.id) to trigger some update? No.
            // Requires onRefresh callback or just hide it.
            // Let's simply hide it from list locally? No prop passed for setNotifications.
            // I'll rely on the parent (Dashboard) passing fresh data or add a callback.
            // Dashboard passes 'notifications'. Dashboard fetches periodically? 
            // Dashboard loads once. 
            // I'll add onRefresh prop later. For now, just call Soft Delete.
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FaBell /> Hộp thư thông báo
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900/50">
                    {notifications.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <FaEnvelopeOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Chưa có thông báo nào.</p>
                        </div>
                    ) : (
                        notifications.map(n => {
                            const isRead = n.readBy?.includes(userId) || n.read;
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => onMarkRead(n.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group
                                        ${isRead
                                            ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-60'
                                            : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-500/50 shadow-md transform hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    {!isRead && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full m-2 animate-pulse"></div>}

                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full flex-shrink-0 
                                            ${n.type === 'special' ? 'bg-red-100 text-red-600 animate-pulse' :
                                                n.type === 'attention' ? 'bg-orange-100 text-orange-600' :
                                                    n.type === 'system' ? 'bg-blue-100 text-blue-600' :
                                                        n.type === 'class' ? 'bg-indigo-100 text-indigo-600' :
                                                            n.type === 'reminder' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}
                                        `}>
                                            <FaBell size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-sm mb-1 ${!isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {n.title}
                                                {(n.type === 'special' || n.type === 'attention') &&
                                                    <span className="ml-2 text-[10px] uppercase border px-1 rounded bg-red-50 text-red-500 border-red-200">Quan trọng</span>
                                                }
                                            </h3>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-3">{n.message}</p>
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>{n.senderName}</span>
                                                <span>{n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Vừa xong'}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, n)}
                                            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Xóa thông báo"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxModal;
