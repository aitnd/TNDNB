import React, { useEffect, useState } from 'react';
import { Notification, fetchAllGlobalNotifications, hardDeleteNotification, sendNotification } from '../services/notificationService';
import { FaTrash, FaTimes, FaExclamationTriangle, FaInfoCircle, FaClock, FaPaperPlane, FaPlus } from 'react-icons/fa';

interface NotificationManagerProps {
    onClose: () => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

    // Form State
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'system' | 'special' | 'attention'>('system');
    const [expiryHours, setExpiryHours] = useState<number>(24);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchAllGlobalNotifications();
        setNotifications(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn XÓA VĨNH VIỄN thông báo này? Hành động này sẽ gỡ thông báo khỏi màn hình của tất cả người dùng.')) {
            const success = await hardDeleteNotification(id);
            if (success) {
                alert('Đã xóa thông báo!');
                loadData();
            } else {
                alert('Có lỗi xảy ra khi xóa.');
            }
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !message.trim()) return;

        setIsSending(true);
        try {
            // Calculate expiry date if type is special/attention
            let expiryDate: Date | null = null;
            if (type !== 'system') {
                expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + expiryHours);
            }

            // Target: 'all' for System Announcements
            await sendNotification(
                title,
                message,
                type,
                'all',
                null,
                'ADMIN_ID', // Replace with real Admin ID if available
                'Ban Quản Trị',
                expiryDate
            );

            alert('Đã gửi thông báo thành công! 🚀');
            // Reset form
            setTitle('');
            setMessage('');
            setType('system');
            setViewMode('list');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Lỗi khi gửi thông báo: ' + error);
        } finally {
            setIsSending(false);
        }
    };

    const formatDate = (seconds?: number) => {
        if (!seconds) return '--';
        return new Date(seconds * 1000).toLocaleString('vi-VN');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FaExclamationTriangle /> Quản Lý Thông Báo Hệ Thống
                    </h2>
                    <div className="flex items-center gap-2">
                        {viewMode === 'list' ? (
                            <button
                                onClick={() => setViewMode('create')}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                            >
                                <FaPlus /> Tạo mới
                            </button>
                        ) : (
                            <button
                                onClick={() => setViewMode('list')}
                                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Quay lại DS
                            </button>
                        )}
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900/50">

                    {viewMode === 'create' ? (
                        <div className="p-8 max-w-2xl mx-auto">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaPaperPlane className="text-indigo-500" /> Soạn thông báo mới
                                </h3>
                                <form onSubmit={handleSend} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Loại thông báo</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setType('system')}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${type === 'system' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                🔵 Tin thường
                                                <div className="text-[10px] font-normal mt-1 opacity-70">Thông tin chung, cập nhật</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setType('attention')}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${type === 'attention' ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                🟠 Chú ý (Vàng)
                                                <div className="text-[10px] font-normal mt-1 opacity-70">Nhắc nhở, quan trọng vừa</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setType('special')}
                                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${type === 'special' ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                🔴 Khẩn cấp (Đỏ)
                                                <div className="text-[10px] font-normal mt-1 opacity-70">Báo động, bắt buộc xem</div>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white"
                                            placeholder="Ví dụ: Lịch thi mới..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nội dung</label>
                                        <textarea
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:text-white"
                                            placeholder="Nội dung chi tiết..."
                                            required
                                        ></textarea>
                                    </div>

                                    {type !== 'system' && (
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <label className="block text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
                                                <FaClock /> Thời gian hiệu lực (Auto-Nhắc nhở)
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="720"
                                                    value={expiryHours}
                                                    onChange={e => setExpiryHours(Number(e.target.value))}
                                                    className="w-20 px-3 py-1.5 rounded border border-yellow-300 focus:ring-yellow-500 text-center font-bold"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Giờ (App sẽ nhắc lại mỗi 6 tiếng trong khoảng này)</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 dark:border-slate-700 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('list')}
                                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSending}
                                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSending ? 'Đang gửi...' : <><FaPaperPlane /> Gửi ngay</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {/* Existing List View */}
                            {loading ? (
                                <div className="text-center py-10">Đang tải dữ liệu...</div>
                            ) : (
                                <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-200 dark:border-slate-700 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold uppercase">
                                            <tr>
                                                <th className="p-4">Loại</th>
                                                <th className="p-4">Tiêu đề & Nội dung</th>
                                                <th className="p-4">Người tạo</th>
                                                <th className="p-4">Hết hạn (Marquee)</th>
                                                <th className="p-4">Ngày tạo</th>
                                                <th className="p-4 text-center">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                            {notifications.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có thông báo nào.</td>
                                                </tr>
                                            ) : (
                                                notifications.map(n => (
                                                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                        <td className="p-4 align-top">
                                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold
                                                                ${n.type === 'special' ? 'bg-red-100 text-red-600' :
                                                                    n.type === 'attention' ? 'bg-orange-100 text-orange-600' :
                                                                        'bg-blue-100 text-blue-600'}
                                                            `}>
                                                                {n.type === 'special' ? 'ĐẶC BIỆT' : n.type === 'attention' ? 'CHÚ Ý' : 'Thường'}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 align-top max-w-xs">
                                                            <div className="font-bold text-gray-900 dark:text-white mb-1">{n.title}</div>
                                                            <div className="text-gray-500 dark:text-gray-400 line-clamp-2">{n.message}</div>
                                                        </td>
                                                        <td className="p-4 align-top text-gray-700 dark:text-gray-300">
                                                            {n.senderName}
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            {(n.type === 'special' || n.type === 'attention') ? (
                                                                <div className="flex items-center gap-1 text-xs font-mono bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded border">
                                                                    <FaClock className="text-gray-400" />
                                                                    {formatDate(n.expiryDate?.seconds)}
                                                                </div>
                                                            ) : <span className="text-gray-400 text-xs">--</span>}
                                                        </td>
                                                        <td className="p-4 align-top text-gray-500 text-xs">
                                                            {formatDate(n.createdAt?.seconds)}
                                                        </td>
                                                        <td className="p-4 align-top text-center">
                                                            <button
                                                                onClick={() => handleDelete(n.id)}
                                                                className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                                title="Xóa vĩnh viễn"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationManager;
