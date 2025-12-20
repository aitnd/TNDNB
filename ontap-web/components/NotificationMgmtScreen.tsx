import React, { useState, useEffect } from 'react';

import { Notification, fetchAllGlobalNotifications, hardDeleteNotification, sendNotification, updateNotification } from '../services/notificationService';
import { getAllClasses, getUserProfile, searchUsersByEmail } from '../services/userService';
import { FaTrash, FaExclamationTriangle, FaClock, FaCheckCircle, FaBan, FaPlus, FaUsers, FaUser, FaGlobe, FaEdit } from 'react-icons/fa';
import { UserProfile } from '../types';

interface NotificationMgmtScreenProps {
    userProfile: UserProfile;
}

const NotificationMgmtScreen: React.FC<NotificationMgmtScreenProps> = ({ userProfile }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchAllGlobalNotifications();
        setNotifications(data);
        setLoading(false);
    };

    const canDelete = (n: Notification) => {
        // Teacher cannot delete Special/Attention
        if (userProfile.role === 'giao_vien') {
            if (n.type === 'special' || n.type === 'attention') return false;
        }
        return true;
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

    const formatDate = (seconds?: number) => {
        if (!seconds) return '--';
        return new Date(seconds * 1000).toLocaleString('vi-VN');
    };

    // --- CREATION LOGIC ---
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'system' | 'special' | 'attention'>('system');
    const [targetType, setTargetType] = useState<'all' | 'class' | 'user' | 'role'>('all');

    // Target Data
    const [availableClasses, setAvailableClasses] = useState<{ id: string, name: string }[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [foundUsers, setFoundUsers] = useState<UserProfile[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const [expiryDate, setExpiryDate] = useState('');
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

    const handleEditClick = (n: Notification) => {
        setEditingNotification(n);
        setTitle(n.title);
        setMessage(n.message);
        setType(n.type as any);
        setTargetType(n.targetType === 'all' && n.targetRoles && n.targetRoles.length > 0 ? 'role' : n.targetType);

        if (n.targetType === 'class') setSelectedClass(n.targetName || '');
        if (n.targetType === 'user') {
            // Can't easily restore selectedUser object without fetching, but we can show the name
            // For simplicity, we might lock target editing or just show current target
        }
        if (n.targetRoles) setSelectedRoles(n.targetRoles);

        if (n.expiryDate) {
            // Format for datetime-local: YYYY-MM-DDTHH:mm
            const d = new Date(n.expiryDate.seconds * 1000);
            const iso = d.toISOString().slice(0, 16);
            // Adjust for timezone offset if needed, but simple ISO slice is UTC. 
            // Better:
            const offset = d.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
            setExpiryDate(localISOTime);
        } else {
            setExpiryDate('');
        }

        setShowCreateModal(true);
    };

    useEffect(() => {
        if (showCreateModal && targetType === 'class') {
            getAllClasses().then(setAvailableClasses);
        }
    }, [showCreateModal, targetType]);

    useEffect(() => {
        if (userSearchTerm.length > 2 && targetType === 'user') {
            const timer = setTimeout(async () => {
                const users = await searchUsersByEmail(userSearchTerm);
                setFoundUsers(users);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [userSearchTerm, targetType]);



    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) return alert('Vui lòng nhập tiêu đề và nội dung');
        if (targetType === 'class' && !selectedClass) return alert('Vui lòng chọn lớp');
        if (targetType === 'user' && !selectedUser && !editingNotification) return alert('Vui lòng chọn người nhận'); // Relax for edit
        if (targetType === 'role' && selectedRoles.length === 0) return alert('Vui lòng chọn ít nhất một vai trò');

        try {
            if (editingNotification) {
                // UPDATE MODE
                const updateData: any = {
                    title,
                    message,
                    type,
                    // We typically don't allow changing targetType/TargetId easily as it implies moving data
                    // But we can update expiryDate
                    expiryDate: expiryDate ? new Date(expiryDate) : null,
                };

                // Only update target roles if it was a role notification
                if (targetType === 'role') {
                    updateData.targetRoles = selectedRoles;
                }

                const success = await updateNotification(editingNotification.id, updateData);
                if (success) {
                    alert('Đã cập nhật thông báo!');
                    setShowCreateModal(false);
                    setEditingNotification(null);
                    loadData();
                } else {
                    alert('Lỗi khi cập nhật.');
                }
            } else {
                // CREATE MODE
                let targetId = null;
                if (targetType === 'class') targetId = selectedClass;
                if (targetType === 'user') targetId = selectedUser!.id;

                // 1. Save to Firestore (Persistence)
                await sendNotification(
                    title,
                    message,
                    type,
                    targetType,
                    targetId,
                    userProfile.id,
                    userProfile.full_name,
                    expiryDate ? new Date(expiryDate) : null,
                    targetType === 'user' && selectedUser ? `${selectedUser.full_name} (${selectedUser.email})` : undefined,
                    targetType === 'role' ? selectedRoles : undefined
                );



                alert('Đã gửi thông báo thành công!');
                setShowCreateModal(false);
                loadData();
            }

            // Reset form
            setTitle('');
            setMessage('');
            setType('system');
            setSelectedRoles([]);
            setEditingNotification(null);
            setExpiryDate('');
            setSelectedClass('');
            setSelectedUser(null);
            setFoundUsers([]);
            setUserSearchTerm('');

        } catch (error) {
            console.error(error);
            alert('Lỗi khi xử lý thông báo');
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in pb-20 max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-teal-500 to-emerald-600 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <FaExclamationTriangle /> Quản Lý Thông Báo Hệ Thống
                        </h1>
                        <p className="text-teal-100 mt-1 opacity-90">
                            {userProfile.role === 'giao_vien'
                                ? 'Bạn có thể xem tất cả và quản lý thông báo thường.'
                                : 'Bạn có toàn quyền quản lý thông báo.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                if (confirm('CẢNH BÁO: Hành động này sẽ xóa TẤT CẢ thông báo trong hộp thư riêng của TẤT CẢ học viên.\nChỉ giữ lại thông báo chung (Toàn hệ thống).\nBạn có chắc chắn muốn dọn dẹp không?')) {
                                    setLoading(true);
                                    try {
                                        const { collection, getDocs, deleteDoc, writeBatch, doc } = await import('firebase/firestore');
                                        const { db } = await import('../services/firebaseClient');

                                        // 1. Get all users
                                        const usersSnap = await getDocs(collection(db, 'users'));
                                        let deletedCount = 0;

                                        // Process in chunks to avoid memory issues, but for now simple loop
                                        for (const userDoc of usersSnap.docs) {
                                            const notifsRef = collection(db, 'users', userDoc.id, 'notifications');
                                            const notifsSnap = await getDocs(notifsRef);

                                            if (!notifsSnap.empty) {
                                                const batch = writeBatch(db);
                                                notifsSnap.docs.forEach(n => {
                                                    batch.delete(n.ref);
                                                    deletedCount++;
                                                });
                                                await batch.commit();
                                            }
                                        }
                                        alert(`Đã dọn dẹp thành công ${deletedCount} thông báo rác từ học viên.`);
                                    } catch (e) {
                                        console.error(e);
                                        alert('Có lỗi xảy ra khi dọn dẹp.');
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold shadow hover:bg-red-200 transition flex items-center gap-2"
                            title="Xóa tất cả thông báo trong hộp thư học viên (dùng khi bị lỗi hiển thị)"
                        >
                            <FaTrash /> Dọn dẹp rác
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-white text-teal-600 px-4 py-2 rounded-lg font-bold shadow hover:bg-teal-50 transition flex items-center gap-2"
                        >
                            <FaPlus /> Tạo mới
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 bg-gray-50 dark:bg-slate-900/50 overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-200 dark:border-slate-700 overflow-hidden min-w-[800px]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold uppercase">
                                    <tr>
                                        <th className="p-4 w-32">Đối tượng</th>
                                        <th className="p-4 w-32">Loại</th>
                                        <th className="p-4">Tiêu đề & Nội dung</th>
                                        <th className="p-4 w-40">Người tạo</th>
                                        <th className="p-4 w-48">Hết hạn (Marquee)</th>
                                        <th className="p-4 w-40">Ngày tạo</th>
                                        <th className="p-4 w-32 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {notifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-10 text-center text-gray-500 text-base">Hệ thống chưa có thông báo nào.</td>
                                        </tr>
                                    ) : (
                                        notifications.map(n => {
                                            const isDeletable = canDelete(n);
                                            return (
                                                <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="p-4 align-top">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold whitespace-nowrap border
                                                            ${n.targetType === 'all' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                                                n.targetType === 'class' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                                                                    'bg-pink-100 text-pink-700 border-pink-200'}
                                                        `}>
                                                            {n.targetType === 'all' && <><FaGlobe /> Tất cả</>}
                                                            {n.targetType === 'class' && <><FaUsers /> Lớp</>}
                                                            {n.targetType === 'user' && <><FaUser /> Cá nhân</>}
                                                        </span>
                                                        {n.targetType !== 'all' && (
                                                            <div className="text-xs text-gray-500 mt-1 font-mono break-words max-w-[150px]">
                                                                {n.targetName ? (
                                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{n.targetName}</span>
                                                                ) : (
                                                                    n.targetId
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold whitespace-nowrap
                                                            ${n.type === 'special' ? 'bg-red-100 text-red-600' :
                                                                n.type === 'attention' ? 'bg-orange-100 text-orange-600' :
                                                                    'bg-blue-100 text-blue-600'}
                                                        `}>
                                                            {n.type === 'special' ? 'ĐẶC BIỆT' : n.type === 'attention' ? 'CHÚ Ý' : 'Thường'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        <div className="font-bold text-gray-900 dark:text-white mb-1 text-base">{n.title}</div>
                                                        <div className="text-gray-600 dark:text-gray-400 line-clamp-2">{n.message}</div>
                                                    </td>
                                                    <td className="p-4 align-top text-gray-700 dark:text-gray-300 font-medium">
                                                        {n.senderName}
                                                        <div className="text-xs text-gray-400 font-normal">{n.senderId === userProfile.id ? '(Bạn)' : ''}</div>
                                                    </td>
                                                    <td className="p-4 align-top">
                                                        {(n.type === 'special' || n.type === 'attention') ? (
                                                            <div className="flex items-center gap-1 text-xs font-mono bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded border whitespace-nowrap">
                                                                <FaClock className="text-gray-400" />
                                                                {formatDate(n.expiryDate?.seconds)}
                                                            </div>
                                                        ) : <span className="text-gray-400 text-xs">--</span>}
                                                    </td>
                                                    <td className="p-4 align-top text-gray-500 text-xs whitespace-nowrap">
                                                        {formatDate(n.createdAt?.seconds)}
                                                    </td>
                                                    <td className="p-4 align-top text-center">
                                                        {isDeletable ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleEditClick(n)}
                                                                    className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                                                                    title="Sửa"
                                                                >
                                                                    <FaEdit size={14} /> <span className="text-xs font-bold">Sửa</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(n.id)}
                                                                    className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                                                                    title="Xóa vĩnh viễn"
                                                                >
                                                                    <FaTrash size={14} /> <span className="text-xs font-bold">Xóa</span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-300 flex justify-center p-2 cursor-not-allowed" title="Bạn không có quyền xóa thông báo cấp cao này">
                                                                <FaBan />
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                                {editingNotification ? <><FaEdit className="text-blue-600" /> Cập nhật thông báo</> : <><FaPlus className="text-teal-600" /> Tạo thông báo mới</>}
                            </h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            {/* Target Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Gửi tới:</label>
                                <div className="flex gap-4">
                                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 justify-center transition-all ${targetType === 'all' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input type="radio" name="target" value="all" checked={targetType === 'all'} onChange={() => setTargetType('all')} className="hidden" />
                                        <FaGlobe /> Tất cả
                                    </label>
                                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 justify-center transition-all ${targetType === 'class' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input type="radio" name="target" value="class" checked={targetType === 'class'} onChange={() => setTargetType('class')} className="hidden" />
                                        <FaUsers /> Lớp học
                                    </label>
                                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 justify-center transition-all ${targetType === 'role' ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input type="radio" name="target" value="role" checked={targetType === 'role'} onChange={() => setTargetType('role')} className="hidden" />
                                        <FaUsers /> Theo Vai trò
                                    </label>
                                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer flex-1 justify-center transition-all ${targetType === 'user' ? 'bg-pink-50 border-pink-500 text-pink-700 ring-1 ring-pink-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input type="radio" name="target" value="user" checked={targetType === 'user'} onChange={() => setTargetType('user')} className="hidden" />
                                        <FaUser /> Cá nhân
                                    </label>
                                </div>
                            </div>

                            {/* Dynamic Target Input */}
                            {targetType === 'class' && (
                                <div>
                                    <label className="block text-sm font-bold mb-1">Chọn lớp:</label>
                                    <select
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700"
                                        value={selectedClass}
                                        onChange={e => setSelectedClass(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Chọn lớp --</option>
                                        {availableClasses.map((c) => (
                                            <option key={c.id} value={c.name}>
                                                {c.name} -- ({c.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {targetType === 'role' && (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Chọn Vai trò:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'hoc_vien', label: 'Học viên' },
                                            { id: 'giao_vien', label: 'Giáo viên' },
                                            { id: 'quan_ly', label: 'Quản lý' },
                                            { id: 'lanh_dao', label: 'Lãnh đạo' },
                                            { id: 'admin', label: 'Admin' }
                                        ].map(role => (
                                            <label key={role.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={role.id}
                                                    checked={selectedRoles.includes(role.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setSelectedRoles([...selectedRoles, role.id]);
                                                        } else {
                                                            setSelectedRoles(selectedRoles.filter(r => r !== role.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-teal-600"
                                                />
                                                <span>{role.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {targetType === 'user' && (
                                <div>
                                    <label className="block text-sm font-bold mb-1">Tìm người nhận (Email):</label>
                                    <input
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700"
                                        placeholder="Nhập email..."
                                        value={userSearchTerm}
                                        onChange={e => setUserSearchTerm(e.target.value)}
                                    />
                                    {foundUsers.length > 0 && (
                                        <div className="mt-2 border rounded max-h-40 overflow-y-auto bg-gray-50 dark:bg-slate-900">
                                            {foundUsers.map(u => (
                                                <div
                                                    key={u.id}
                                                    onClick={() => { setSelectedUser(u); setFoundUsers([]); setUserSearchTerm(u.email); }}
                                                    className="p-2 hover:bg-teal-50 cursor-pointer flex justify-between items-center border-b last:border-0"
                                                >
                                                    <span className="font-medium">{u.full_name}</span>
                                                    <span className="text-xs text-gray-500">{u.email}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedUser && (
                                        <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded flex items-center gap-2">
                                            <FaCheckCircle /> Đã chọn: <b>{selectedUser.full_name}</b> ({selectedUser.email})
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Common Fields */}
                            <div>
                                <label className="block text-sm font-bold mb-1">Tiêu đề:</label>
                                <input className="w-full p-2 border rounded-lg dark:bg-slate-700" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Nội dung:</label>
                                <textarea className="w-full p-2 border rounded-lg dark:bg-slate-700 h-24" value={message} onChange={e => setMessage(e.target.value)} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Loại thông báo:</label>
                                    <select className="w-full p-2 border rounded-lg dark:bg-slate-700" value={type} onChange={e => setType(e.target.value as any)}>
                                        <option value="system">Thường (Xanh)</option>
                                        <option value="attention">Chú ý (Cam)</option>
                                        <option value="special">Đặc biệt (Đỏ - Marquee)</option>
                                    </select>
                                </div>

                                {(type === 'attention' || type === 'special') && (
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Hết hạn chạy chữ (Marquee):</label>
                                        <input type="datetime-local" className="w-full p-2 border rounded-lg dark:bg-slate-700" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">Hủy</button>
                                <button type="submit" className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-lg shadow-teal-500/30 transition transform hover:-translate-y-0.5">
                                    {editingNotification ? 'Cập nhật' : 'Gửi thông báo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationMgmtScreen;
