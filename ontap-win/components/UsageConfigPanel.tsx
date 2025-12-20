import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getUsageConfig, saveUsageConfig, UsageConfig, RoleConfig } from '../services/adminConfigService';
import { FaCog, FaSave, FaUserSecret, FaUserGraduate, FaUserTie, FaUserShield, FaUser, FaChalkboardTeacher, FaUserAstronaut, FaTools, FaBroom, FaDownload, FaArrowLeft, FaShieldAlt, FaMobileAlt, FaServer, FaCheckCircle } from 'react-icons/fa';
import { db } from '../services/firebaseClient';
import { collection, getDocs, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UsageConfigPanel: React.FC = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState<UsageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Main Tabs: 'limits' | 'system' | 'app_links'
    const [activeMainTab, setActiveMainTab] = useState<'limits' | 'system' | 'app_links'>('limits');

    // Sub Tab for Roles (only used when activeMainTab === 'limits')
    type RoleKey = Exclude<keyof UsageConfig, 'app_links'>;
    const [activeRole, setActiveRole] = useState<RoleKey>('guest');

    // --- SYSTEM UTILS ---
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

    const updateRoleConfig = (role: RoleKey, field: keyof RoleConfig, value: any) => {
        if (!config) return;
        setConfig({
            ...config,
            [role]: {
                ...config[role],
                [field]: value
            }
        });
    };

    const handleScanOrphans = async () => {
        setScanning(true);
        try {
            const coursesSnap = await getDocs(collection(db, 'courses'));
            const courseIds = new Set(coursesSnap.docs.map(d => d.id));
            const q = query(collection(db, 'users'), where('courseId', '!=', null));
            const usersSnap = await getDocs(q);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-500">Đang tải cấu hình...</div>;
    if (!config) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-red-500">Lỗi tải dữ liệu</div>;

    const roles: { id: RoleKey, label: string, icon: any, color: string }[] = [
        { id: 'guest', label: 'Khách Vãng Lai', icon: FaUser, color: 'text-gray-500' },
        { id: 'free_user', label: 'Thành Viên Tự Do', icon: FaUserGraduate, color: 'text-green-500' },
        { id: 'verified_user', label: 'Học Viên Lớp', icon: FaUserShield, color: 'text-blue-500' },
        { id: 'vip_user', label: 'Thành Viên VIP', icon: FaUserSecret, color: 'text-yellow-500' },
        { id: 'teacher', label: 'Giáo Viên', icon: FaChalkboardTeacher, color: 'text-purple-500' },
        { id: 'manager', label: 'Cán Bộ Quản Lý', icon: FaUserTie, color: 'text-red-500' },
        { id: 'admin', label: 'Quản Trị Viên', icon: FaUserAstronaut, color: 'text-indigo-600' },
    ];

    const currentRoleConfig = config[activeRole] as RoleConfig;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white animate-fade-in">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <FaCog className="text-purple-600 animate-spin-slow" />
                            Cấu Hình Hệ Thống
                        </h1>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu...' : <><FaSave /> Lưu Thay Đổi</>}
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <nav className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <button
                            onClick={() => setActiveMainTab('limits')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMainTab === 'limits'
                                ? 'bg-white dark:bg-slate-800 shadow-md text-purple-600 font-bold border-l-4 border-purple-600'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <FaShieldAlt className="text-xl" />
                            Giới hạn truy cập
                        </button>
                        <button
                            onClick={() => setActiveMainTab('app_links')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMainTab === 'app_links'
                                ? 'bg-white dark:bg-slate-800 shadow-md text-blue-600 font-bold border-l-4 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <FaMobileAlt className="text-xl" />
                            Liên kết Tải App
                        </button>
                        <button
                            onClick={() => setActiveMainTab('system')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMainTab === 'system'
                                ? 'bg-white dark:bg-slate-800 shadow-md text-orange-600 font-bold border-l-4 border-orange-600'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <FaServer className="text-xl" />
                            Hệ thống & Dữ liệu
                        </button>
                    </nav>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">

                        {/* 1. ACCESS LIMITS TAB */}
                        {activeMainTab === 'limits' && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 p-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FaShieldAlt className="text-purple-600" />
                                    Cấu hình Giới hạn & Quyền
                                </h2>

                                {/* Role Selector */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chọn nhóm người dùng để cấu hình:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map(role => (
                                            <button
                                                key={role.id}
                                                onClick={() => setActiveRole(role.id)}
                                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all border ${activeRole === role.id
                                                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                                                    : 'bg-gray-50 dark:bg-slate-700 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600'
                                                    }`}
                                            >
                                                <role.icon className={activeRole === role.id ? role.color : ''} />
                                                {role.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Config Form for Selected Role */}
                                <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            {React.createElement(roles.find(r => r.id === activeRole)!.icon, { className: roles.find(r => r.id === activeRole)!.color })}
                                            {roles.find(r => r.id === activeRole)!.label}
                                        </h3>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentRoleConfig.isEnabled}
                                                onChange={(e) => updateRoleConfig(activeRole, 'isEnabled', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                {currentRoleConfig.isEnabled ? 'Đang bật giới hạn' : 'Không giới hạn (Tắt)'}
                                            </span>
                                        </label>
                                    </div>

                                    {currentRoleConfig.isEnabled ? (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 dark:text-gray-300">Số lượt tối đa</label>
                                                    <input
                                                        type="number"
                                                        value={currentRoleConfig.limit}
                                                        onChange={(e) => updateRoleConfig(activeRole, 'limit', parseInt(e.target.value) || 0)}
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 dark:text-gray-300">Chu kỳ reset</label>
                                                    <select
                                                        value={currentRoleConfig.period}
                                                        onChange={(e) => updateRoleConfig(activeRole, 'period', e.target.value)}
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    >
                                                        <option value="daily">Hàng Ngày (00:00)</option>
                                                        <option value="weekly">Hàng Tuần (Thứ 2)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold mb-2 dark:text-gray-300">Tin nhắn báo chặn</label>
                                                <textarea
                                                    rows={3}
                                                    value={currentRoleConfig.message}
                                                    onChange={(e) => updateRoleConfig(activeRole, 'message', e.target.value)}
                                                    className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                                    placeholder="Nhập tin nhắn..."
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    💡 Mẹo: Dùng <code>{'{limit}'}</code> để hiển thị số lượt tự động.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 text-center text-gray-500">
                                            <FaCheckCircle className="text-5xl mx-auto mb-4 text-green-500 opacity-50" />
                                            <p className="text-lg">Người dùng thuộc nhóm này được truy cập không giới hạn.</p>
                                        </div>
                                    )}

                                    {/* AdSense Toggle */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-orange-700 dark:text-orange-400">Hiển thị Quảng Cáo (Google Adsense)</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Bật để hiện quảng cáo cho nhóm này (Không phụ thuộc giới hạn).</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentRoleConfig.showAds}
                                                onChange={(e) => updateRoleConfig(activeRole, 'showAds', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. APP LINKS TAB */}
                        {activeMainTab === 'app_links' && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 p-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FaMobileAlt className="text-blue-600" />
                                    Cấu hình Link Tải App
                                </h2>

                                <div className="space-y-6 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">Phiên bản App hiện tại</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.version || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, version: e.target.value }
                                            })}
                                            placeholder="Ví dụ: 3.7.1"
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">Link Tải Windows (.exe)</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.windows || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, windows: e.target.value }
                                            })}
                                            placeholder="https://..."
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">Link Tải Android (.apk / Play Store)</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.android || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, android: e.target.value }
                                            })}
                                            placeholder="https://..."
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">Link Tải iOS (TestFlight / App Store)</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.ios || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, ios: e.target.value }
                                            })}
                                            placeholder="https://..."
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. SYSTEM TAB */}
                        {activeMainTab === 'system' && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border dark:border-slate-700 p-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <FaServer className="text-orange-600" />
                                    Công cụ Hệ thống
                                </h2>

                                <div className="p-6 bg-orange-50 dark:bg-slate-700/30 rounded-xl border border-orange-200 dark:border-slate-600">
                                    <h4 className="font-bold text-lg mb-2 text-orange-800 dark:text-orange-400 flex items-center gap-2"><FaBroom /> Dọn dẹp dữ liệu rác</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                        Tìm và sửa các tài khoản học viên vẫn còn liên kết với lớp học đã bị xóa (Orphaned Data).
                                        Lỗi này khiến học viên hiển thị "Đã xác thực" nhưng thông tin lớp không tồn tại.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={handleScanOrphans}
                                            disabled={scanning || fixing}
                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                                        >
                                            {scanning ? 'Đang quét...' : '1. Quét tìm lỗi'}
                                        </button>

                                        {orphanCount !== null && orphanCount > 0 && (
                                            <div className="flex items-center gap-4 animate-fade-in">
                                                <span className="font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-100">Tìm thấy {orphanCount} tài khoản lỗi!</span>
                                                <button
                                                    onClick={handleFixOrphans}
                                                    disabled={fixing}
                                                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 shadow-sm"
                                                >
                                                    {fixing ? 'Đang sửa...' : '2. Sửa ngay'}
                                                </button>
                                            </div>
                                        )}

                                        {orphanCount === 0 && (
                                            <span className="text-green-600 font-bold animate-fade-in flex items-center gap-2">
                                                <FaCheckCircle /> Không có lỗi nào!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

// End of component

export default UsageConfigPanel;
