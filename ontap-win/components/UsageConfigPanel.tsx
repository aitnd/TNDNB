import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getUsageConfig, saveUsageConfig, UsageConfig, RoleConfig, getGitHubConfig, saveGitHubConfig, GitHubConfig } from '../services/adminConfigService';
import { FaCog, FaSave, FaUserSecret, FaUserGraduate, FaUserTie, FaUserShield, FaUser, FaChalkboardTeacher, FaUserAstronaut, FaTools, FaBroom, FaDownload, FaArrowLeft, FaShieldAlt, FaMobileAlt, FaServer, FaCheckCircle, FaRocket, FaGithub, FaKey, FaUpload, FaFileAlt } from 'react-icons/fa';
import { db } from '../services/firebaseClient';
import { collection, getDocs, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { createRelease, uploadReleaseAsset, getLatestRelease, validateToken, GitHubRelease } from '../services/githubService';

const UsageConfigPanel: React.FC<{ userProfile?: any }> = ({ userProfile }) => {
    const navigate = useNavigate();
    const [config, setConfig] = useState<UsageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Kiểm tra quyền truy cập của người dùng
    useEffect(() => {
        if (userProfile) {
            const role = userProfile.role;
            if (!['admin', 'lanh_dao'].includes(role)) {
                Swal.fire('Bị chặn', 'Bạn không có quyền truy cập trang cấu hình hệ thống!', 'error');
                navigate('/ontap/dashboard');
            }
        }
    }, [userProfile]);

    // Main Tabs: 'limits' | 'system' | 'app_links'
    const [activeMainTab, setActiveMainTab] = useState<'limits' | 'system' | 'app_links'>('limits');

    // Sub Tab for Roles (only used when activeMainTab === 'limits')
    type RoleKey = Exclude<keyof UsageConfig, 'app_links'>;
    const [activeRole, setActiveRole] = useState<RoleKey>('guest');

    // Phân quyền sửa cấu hình vai trò Admin
    const isLanhDao = userProfile?.role === 'lanh_dao';
    const isReadOnly = isLanhDao && activeRole === 'admin';

    // --- SYSTEM UTILS ---
    const [orphanCount, setOrphanCount] = useState<number | null>(null);
    const [scanning, setScanning] = useState(false);
    const [fixing, setFixing] = useState(false);

    // --- RELEASE MANAGER ---
    const [githubConfig, setGithubConfig] = useState<GitHubConfig>({ owner: 'aitnd', repo: 'TNDNB' });
    const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
    const [releaseVersion, setReleaseVersion] = useState('');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [exeFile, setExeFile] = useState<File | null>(null);
    const [ymlFile, setYmlFile] = useState<File | null>(null);
    const [blockmapFile, setBlockmapFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [publishing, setPublishing] = useState(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        const data = await getUsageConfig();
        setConfig(data);
        // Load GitHub config
        const ghConfig = await getGitHubConfig();
        setGithubConfig(ghConfig);
        // Validate token if exists
        if (ghConfig.token) {
            const valid = await validateToken(ghConfig.token);
            setTokenValid(valid);
            if (valid) {
                const latest = await getLatestRelease(ghConfig.token);
                setLatestRelease(latest);
            }
        }
        setLoading(false);
    };

    // --- RELEASE MANAGER FUNCTIONS ---
    const handleSaveGitHubToken = async () => {
        if (!githubConfig.token) return;
        try {
            const valid = await validateToken(githubConfig.token);
            setTokenValid(valid);
            if (valid) {
                await saveGitHubConfig(githubConfig);
                const latest = await getLatestRelease(githubConfig.token);
                setLatestRelease(latest);
                Swal.fire('Thành công', 'Token hợp lệ và đã lưu!', 'success');
            } else {
                Swal.fire('Lỗi', 'Token không hợp lệ hoặc không có quyền repo.', 'error');
            }
        } catch (err) {
            Swal.fire('Lỗi', 'Không thể kiểm tra token', 'error');
        }
    };

    const handlePublishRelease = async () => {
        if (!githubConfig.token || !releaseVersion) {
            Swal.fire('Lỗi', 'Vui lòng nhập phiên bản và cấu hình token.', 'error');
            return;
        }
        if (!exeFile || !ymlFile) {
            Swal.fire('Lỗi', 'Vui lòng chọn file .exe và latest.yml', 'error');
            return;
        }

        setPublishing(true);
        setUploadProgress(0);

        try {
            // 1. Tạo Release
            const release = await createRelease(githubConfig.token, {
                tag_name: `v${releaseVersion}`,
                name: `Version ${releaseVersion}`,
                body: releaseNotes || `Phát hành phiên bản ${releaseVersion}`,
                draft: false,
                prerelease: false
            });

            // 2. Upload file .exe và lấy browser_download_url
            setUploadProgress(10);
            const exeAsset = await uploadReleaseAsset(githubConfig.token, release.id, exeFile, (p) => {
                setUploadProgress(10 + Math.round(p * 0.6)); // 10-70%
            });

            // 3. Upload file latest.yml
            setUploadProgress(75);
            await uploadReleaseAsset(githubConfig.token, release.id, ymlFile, (p) => {
                setUploadProgress(75 + Math.round(p * 0.15)); // 75-90%
            });

            // 4. Upload blockmap nếu có
            if (blockmapFile) {
                setUploadProgress(90);
                await uploadReleaseAsset(githubConfig.token, release.id, blockmapFile, (p) => {
                    setUploadProgress(90 + Math.round(p * 0.1)); // 90-100%
                });
            }

            setUploadProgress(100);

            // 5. Cập nhật app_links trong config
            // 💖 Sử dụng browser_download_url trực tiếp từ asset thay vì tự tạo URL (SỬA LỖI)
            const windowsUrl = exeAsset.browser_download_url;
            if (config) {
                const updatedConfig = {
                    ...config,
                    app_links: {
                        ...config.app_links,
                        version: releaseVersion,
                        windows: windowsUrl
                    }
                };
                await saveUsageConfig(updatedConfig);
                setConfig(updatedConfig);
            }


            // 6. Cập nhật latest release
            setLatestRelease(release);

            Swal.fire({
                title: 'Phát hành thành công!',
                html: `<p>Phiên bản <strong>v${releaseVersion}</strong> đã được đẩy lên GitHub.</p><a href="${release.html_url}" target="_blank" class="text-blue-600 underline">Xem trên GitHub</a>`,
                icon: 'success'
            });

            // Reset form
            setReleaseVersion('');
            setReleaseNotes('');
            setExeFile(null);
            setYmlFile(null);
            setBlockmapFile(null);

        } catch (err: any) {
            console.error('Publish error:', err);
            Swal.fire('Lỗi phát hành', err.message || 'Không thể phát hành release', 'error');
        } finally {
            setPublishing(false);
        }
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
                                    {isReadOnly && (
                                        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-xl text-sm font-medium border border-amber-200 dark:border-amber-700/50 flex items-center gap-2 animate-fade-in">
                                            ⚠️ Bạn đang xem cấu hình của vai trò Quản trị viên (Admin). Chỉ tài khoản Admin mới có quyền chỉnh sửa cấu hình này.
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            {React.createElement(roles.find(r => r.id === activeRole)!.icon, { className: roles.find(r => r.id === activeRole)!.color })}
                                            {roles.find(r => r.id === activeRole)!.label}
                                        </h3>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={currentRoleConfig.isEnabled}
                                                disabled={isReadOnly}
                                                onChange={(e) => updateRoleConfig(activeRole, 'isEnabled', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 disabled:opacity-50"></div>
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
                                                        disabled={isReadOnly}
                                                        onChange={(e) => updateRoleConfig(activeRole, 'limit', parseInt(e.target.value) || 0)}
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2 dark:text-gray-300">Chu kỳ reset</label>
                                                    <select
                                                        value={currentRoleConfig.period}
                                                        disabled={isReadOnly}
                                                        onChange={(e) => updateRoleConfig(activeRole, 'period', e.target.value)}
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
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
                                                    disabled={isReadOnly}
                                                    onChange={(e) => updateRoleConfig(activeRole, 'message', e.target.value)}
                                                    className="w-full p-3 border rounded-lg dark:bg-slate-800 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none disabled:opacity-50"
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

                                    {/* Bảo mật & Quảng cáo Toggles */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-red-700 dark:text-red-400">Cấm sao chép & bôi đen đề thi</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngăn học viên bôi đen, copy và dùng chuột phải khi thi.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={currentRoleConfig.preventCopy || false}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => updateRoleConfig(activeRole, 'preventCopy', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600 disabled:opacity-50"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-orange-700 dark:text-orange-400">Hiển thị Quảng Cáo (Google Adsense)</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Bật để hiện quảng cáo cho nhóm này (Không phụ thuộc giới hạn).</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={currentRoleConfig.showAds}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => updateRoleConfig(activeRole, 'showAds', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500 disabled:opacity-50"></div>
                                            </label>
                                        </div>
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
                                    {/* 💖 Phiên bản Windows - Tự động từ GitHub (MỚI) */}
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-blue-200 dark:border-slate-600">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                                <FaRocket className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 dark:text-white">Windows App</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Tự động từ GitHub Releases</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Phiên bản:</span>
                                                <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                                                    {latestRelease?.tag_name || config.app_links?.version || 'Chưa có'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Trạng thái:</span>
                                                <span className={`ml-2 font-bold ${tokenValid ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {tokenValid ? '✅ Đã kết nối GitHub' : '⚠️ Chưa cấu hình'}
                                                </span>
                                            </div>
                                        </div>
                                        {config.app_links?.windows && (
                                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 truncate">
                                                🔗 <a href={config.app_links.windows} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{config.app_links.windows}</a>
                                            </div>
                                        )}
                                    </div>

                                    {/* 💖 Link Android - Thủ công */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">📱 Link Tải Android (.apk / Play Store)</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.android || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, android: e.target.value }
                                            })}
                                            placeholder="https://play.google.com/... hoặc link APK"
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Nhập link Google Play Store hoặc link tải trực tiếp APK</p>
                                    </div>

                                    {/* 💖 Link iOS - Thủ công */}
                                    <div>
                                        <label className="block text-sm font-bold mb-2 dark:text-gray-300">🍎 Link Tải iOS (TestFlight / App Store)</label>
                                        <input
                                            type="text"
                                            value={config.app_links?.ios || ''}
                                            onChange={(e) => setConfig({
                                                ...config,
                                                app_links: { ...config.app_links, ios: e.target.value }
                                            })}
                                            placeholder="https://testflight.apple.com/... hoặc App Store"
                                            className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Nhập link TestFlight hoặc App Store</p>
                                    </div>
                                </div>


                                {/* Release Manager Section */}
                                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-600">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <FaRocket className="text-green-600" />
                                        Phát hành bản cập nhật mới
                                    </h3>

                                    {/* GitHub Token Config */}
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-200 dark:border-slate-600">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaGithub className="text-xl" />
                                            <span className="font-bold">Cấu hình GitHub</span>
                                            {tokenValid === true && <span className="text-green-500 text-sm flex items-center gap-1"><FaCheckCircle /> Đã kết nối</span>}
                                            {tokenValid === false && <span className="text-red-500 text-sm">Token không hợp lệ</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="password"
                                                value={githubConfig.token || ''}
                                                onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                                                placeholder="GitHub Personal Access Token..."
                                                className="flex-1 p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <button
                                                onClick={handleSaveGitHubToken}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 flex items-center gap-2"
                                            >
                                                <FaKey /> Lưu Token
                                            </button>
                                        </div>
                                        {latestRelease && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                Release mới nhất: <a href={latestRelease.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{latestRelease.tag_name}</a>
                                            </p>
                                        )}
                                    </div>

                                    {/* Publish Form */}
                                    {tokenValid && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Phiên bản mới</label>
                                                    <input
                                                        type="text"
                                                        value={releaseVersion}
                                                        onChange={(e) => setReleaseVersion(e.target.value)}
                                                        placeholder="VD: 3.8.8"
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">Ghi chú</label>
                                                    <input
                                                        type="text"
                                                        value={releaseNotes}
                                                        onChange={(e) => setReleaseNotes(e.target.value)}
                                                        placeholder="Tùy chọn..."
                                                        className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-green-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">File .exe *</label>
                                                    <label className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer ${exeFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'}`}>
                                                        <input type="file" accept=".exe" className="hidden" onChange={(e) => setExeFile(e.target.files?.[0] || null)} />
                                                        <FaUpload className={exeFile ? 'text-green-600' : ''} />
                                                        <span className="text-sm truncate">{exeFile ? exeFile.name : 'Chọn file...'}</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">latest.yml *</label>
                                                    <label className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer ${ymlFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'}`}>
                                                        <input type="file" accept=".yml,.yaml" className="hidden" onChange={(e) => setYmlFile(e.target.files?.[0] || null)} />
                                                        <FaFileAlt className={ymlFile ? 'text-green-600' : ''} />
                                                        <span className="text-sm truncate">{ymlFile ? ymlFile.name : 'Chọn file...'}</span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-2">.blockmap</label>
                                                    <label className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer ${blockmapFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-blue-400'}`}>
                                                        <input type="file" accept=".blockmap" className="hidden" onChange={(e) => setBlockmapFile(e.target.files?.[0] || null)} />
                                                        <FaFileAlt className={blockmapFile ? 'text-green-600' : ''} />
                                                        <span className="text-sm truncate">{blockmapFile ? blockmapFile.name : 'Tùy chọn'}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {publishing && (
                                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                                                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                            )}

                                            <button
                                                onClick={handlePublishRelease}
                                                disabled={publishing || !releaseVersion || !exeFile || !ymlFile}
                                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {publishing ? `Đang phát hành... ${uploadProgress}%` : <><FaRocket /> Phát hành lên GitHub</>}
                                            </button>
                                        </div>
                                    )}
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
