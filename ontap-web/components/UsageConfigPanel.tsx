import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getUsageConfig, saveUsageConfig, UsageConfig, RoleConfig } from '../services/adminConfigService';
import { FaCog, FaSave, FaUserSecret, FaUserGraduate, FaUserTie, FaUserShield, FaUser, FaChalkboardTeacher, FaUserAstronaut, FaTools, FaBroom } from 'react-icons/fa';
import { db } from '../services/firebaseClient';
import { collection, getDocs, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';

interface UsageConfigPanelProps {
    onClose: () => void;
}

const UsageConfigPanel: React.FC<UsageConfigPanelProps> = ({ onClose }) => {
    const [config, setConfig] = useState<UsageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<keyof UsageConfig | 'system'>('guest');

    // --- SYSTEM UTILS (Moved here to avoid Conditional Hook Error) ---
    const [orphanCount, setOrphanCount] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [fixing, setFixing] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        const data = await getUsageConfig();
        setConfig(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        try {
            await saveUsageConfig(config);
            Swal.fire({
                title: 'Thành công!',
                text: 'Cấu hình đã được lưu.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể lưu cấu hình', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateRoleConfig = (role: keyof UsageConfig | 'system', field: keyof RoleConfig, value: any) => {
        if (!config || role === 'system') return;
        setConfig({
            ...config,
            [role]: {
                ...config[role],
                [field]: value
            }
        });
    };

    if (loading) return <div className="p-8 text-center">Đang tải cấu hình...</div>;
    if (!config) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu</div>;

    const tabs: { id: keyof UsageConfig | 'system', label: string, icon: any, color: string }[] = [
        { id: 'guest', label: 'Khách Vãng Lai', icon: FaUser, color: 'text-gray-500' },
        { id: 'free_user', label: 'Thành Viên Tự Do', icon: FaUserGraduate, color: 'text-green-500' },
        { id: 'verified_user', label: 'Học Viên Lớp', icon: FaUserShield, color: 'text-blue-500' },
        { id: 'vip_user', label: 'Thành Viên VIP', icon: FaUserSecret, color: 'text-yellow-500' },
        { id: 'teacher', label: 'Giáo Viên', icon: FaChalkboardTeacher, color: 'text-purple-500' },
        { id: 'manager', label: 'Cán Bộ Quản Lý', icon: FaUserTie, color: 'text-red-500' },
        { id: 'admin', label: 'Quản Trị Viên', icon: FaUserAstronaut, color: 'text-indigo-600' },
        { id: 'system', label: 'Hệ Thống & Dữ Liệu', icon: FaTools, color: 'text-gray-600' },
    ];

    // --- SYSTEM UTILS ---
    // Moved to top level


    const handleScanOrphans = async () => {
        setScanning(true);
        try {
            // 1. Get all courses IDs
            const coursesSnap = await getDocs(collection(db, 'courses'));
            const courseIds = new Set(coursesSnap.docs.map(d => d.id));

            // 2. Get all users with courseId
            const q = query(collection(db, 'users'), where('courseId', '!=', null));
            const usersSnap = await getDocs(q);

            // 3. Find orphans
            let count = 0;
            usersSnap.forEach(doc => {
                const data = doc.data();
                if (data.courseId && !courseIds.has(data.courseId)) {
                    count++;
                }
            });
            setOrphanCount(count);
            if (count === 0) Swal.fire('Tốt', 'Dữ liệu sạch sẽ! Không có học viên lỗi.', 'success');
        } catch (e) {
            console.error(e);
            Swal.fire('Lỗi', 'Không thể quét dữ liệu', 'error');
        } finally {
            setScanning(false);
        }
    };

    const handleFixOrphans = async () => {
        if (!orphanCount) return;
        setFixing(true);
        try {
            const coursesSnap = await getDocs(collection(db, 'courses'));
            const courseIds = new Set(coursesSnap.docs.map(d => d.id));
            const q = query(collection(db, 'users'), where('courseId', '!=', null));
            const usersSnap = await getDocs(q);

            const batch = writeBatch(db);
            let count = 0;

            usersSnap.forEach(d => {
                const data = d.data();
                if (data.courseId && !courseIds.has(data.courseId)) {
                    const ref = doc(db, 'users', d.id);
                    batch.update(ref, {
                        courseId: null,
                        courseName: null,
                        class: null,
                        isVerified: false
                    });
                    count++;
                }
            });

            if (count > 0) {
                await batch.commit();
                setOrphanCount(0);
                Swal.fire('Thành công', `Đã sửa lỗi cho ${count} học viên!`, 'success');
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Lỗi', 'Không thể sửa dữ liệu', 'error');
        } finally {
            setFixing(false);
        }
    };

    const currentRoleConfig = activeTab === 'system' ? { isEnabled: false } as any : config[activeTab as keyof UsageConfig];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaCog className="text-2xl animate-spin-slow" />
                        <h2 className="text-xl font-bold">Cấu Hình Giới Hạn & Quyền Truy Cập</h2>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body - Split View */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-1/3 bg-gray-50 dark:bg-slate-900 border-r dark:border-slate-700 overflow-y-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left p-4 border-b dark:border-slate-700 flex items-center gap-3 transition-colors ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 border-l-4 border-l-purple-500 shadow-sm'
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <tab.icon className={`text-xl ${activeTab === tab.id ? tab.color : ''}`} />
                                <div>
                                    <div className={`font-bold ${activeTab === tab.id ? 'text-gray-800 dark:text-white' : ''}`}>{tab.label}</div>
                                    <div className="text-xs mt-1">
                                        <div className="text-xs mt-1">
                                            {tab.id === 'system' ? (
                                                <span className="text-blue-600 font-bold">Công cụ quản trị</span>
                                            ) : (
                                                config[tab.id as keyof UsageConfig].isEnabled ?
                                                    <span className="text-green-600 font-bold">Limit: {config[tab.id as keyof UsageConfig].limit} ({config[tab.id as keyof UsageConfig].period === 'daily' ? 'Ngày' : 'Tuần'})</span>
                                                    : <span className="text-gray-400">Không giới hạn (Tắt)</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="w-2/3 p-6 overflow-y-auto bg-white dark:bg-slate-800">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: tabs.find(t => t.id === activeTab)!.color })}
                                {tabs.find(t => t.id === activeTab)!.label}
                            </h3>

                            {/* Toggle Switch (Hide for System Tab) */}
                            {activeTab !== 'system' && (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentRoleConfig.isEnabled}
                                        onChange={(e) => updateRoleConfig(activeTab, 'isEnabled', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {currentRoleConfig.isEnabled ? 'Đang bật giới hạn' : 'Không giới hạn (Tắt)'}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* SYSTEM TAB CONTENT */}
                        {activeTab === 'system' ? (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="p-6 bg-orange-50 dark:bg-slate-700/50 rounded-xl border border-orange-200 dark:border-slate-600">
                                    <h4 className="font-bold text-lg mb-2 text-orange-800 dark:text-orange-400 flex items-center gap-2"><FaBroom /> Dọn dẹp dữ liệu rác</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        Tìm và sửa các tài khoản học viên vẫn còn liên kết với lớp học đã bị xóa (Orphaned Data).
                                        Lỗi này khiến học viên hiển thị "Đã xác thực" nhưng thông tin lớp không tồn tại.
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleScanOrphans}
                                            disabled={scanning || fixing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {scanning ? 'Đang quét...' : '1. Quét lỗi'}
                                        </button>

                                        {orphanCount !== null && orphanCount > 0 && (
                                            <div className="flex items-center gap-4 animate-fade-in">
                                                <span className="font-bold text-red-500">Tìm thấy {orphanCount} tài khoản lỗi!</span>
                                                <button
                                                    onClick={handleFixOrphans}
                                                    disabled={fixing}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {fixing ? 'Đang sửa...' : '2. Sửa ngay'}
                                                </button>
                                            </div>
                                        )}

                                        {orphanCount === 0 && (
                                            <span className="text-green-600 font-bold animate-fade-in">Không có lỗi nào!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* REGULAR ROLE CONFIG CONTENT */}
                                {currentRoleConfig.isEnabled && (
                                    <div className="space-y-6 animate-fade-in-up">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Số lượt tối đa</label>
                                                <input
                                                    type="number"
                                                    value={currentRoleConfig.limit}
                                                    onChange={(e) => updateRoleConfig(activeTab, 'limit', parseInt(e.target.value) || 0)}
                                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-1 dark:text-gray-300">Chu kỳ reset</label>
                                                <select
                                                    value={currentRoleConfig.period}
                                                    onChange={(e) => updateRoleConfig(activeTab, 'period', e.target.value)}
                                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                                >
                                                    <option value="daily">Hàng Ngày (00:00)</option>
                                                    <option value="weekly">Hàng Tuần (Thứ 2)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-1 dark:text-gray-300">Tin nhắn báo chặn</label>
                                            <textarea
                                                rows={3}
                                                value={currentRoleConfig.message}
                                                onChange={(e) => updateRoleConfig(activeTab, 'message', e.target.value)}
                                                className="w-full p-3 border rounded-lg dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"
                                                placeholder="Nhập tin nhắn..."
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                💡 Mẹo: Dùng <code>{'{limit}'}</code> để hiển thị số lượt tự động.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* AdSense Toggle - Always Visible */}
                                <div className="mt-6 flex items-center justify-between bg-orange-50 dark:bg-slate-700/50 p-3 rounded-lg border border-orange-200 dark:border-slate-600">
                                    <div>
                                        <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm">Hiển thị Quảng Cáo (Google Adsense)</h4>
                                        <p className="text-xs text-orange-600/80 dark:text-gray-400">Bật để hiện quảng cáo cho nhóm này (Không phụ thuộc giới hạn).</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={currentRoleConfig.showAds}
                                            onChange={(e) => updateRoleConfig(activeTab, 'showAds', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>

                                {!currentRoleConfig.isEnabled && (
                                    <div className="p-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 text-center text-gray-500">
                                        <FaCheckCircle className="text-4xl mx-auto mb-2 text-green-500 opacity-50" />
                                        <p>Người dùng thuộc nhóm này được truy cập không giới hạn.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : <><FaSave /> Lưu Cấu Hình</>}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Quick helper Icon
const FaCheckCircle = ({ className }: { className?: string }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"></path></svg>
);

export default UsageConfigPanel;
