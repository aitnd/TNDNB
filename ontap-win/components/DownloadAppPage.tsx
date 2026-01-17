import React, { useEffect, useState } from 'react';
import { FaWindows, FaAndroid, FaApple, FaDownload, FaDesktop, FaMobileAlt } from 'react-icons/fa';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getLatestRelease } from '../services/githubService';
import { getGitHubConfig } from '../services/adminConfigService';

const DownloadAppPage: React.FC = () => {
    const [config, setConfig] = useState<UsageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [windowsLink, setWindowsLink] = useState<string>(''); // 💖 Link Windows từ GitHub (MỚI)

    useEffect(() => {
        const fetchConfig = async () => {
            const data = await getUsageConfig();
            setConfig(data);

            // 💖 Nếu config không có link Windows, thử lấy từ GitHub Releases (MỚI)
            if (!data?.app_links?.windows) {
                try {
                    const ghConfig = await getGitHubConfig();
                    if (ghConfig.token) {
                        // getLatestRelease chỉ nhận 1 tham số (token)
                        const release = await getLatestRelease(ghConfig.token);
                        if (release && release.assets) {
                            const exeAsset = release.assets.find((a) => a.name.endsWith('.exe'));
                            if (exeAsset) {
                                setWindowsLink(exeAsset.browser_download_url);
                            }
                        }
                    }
                } catch (e) {
                    console.log('Could not fetch Windows link from GitHub:', e);
                }
            } else {
                setWindowsLink(data.app_links.windows);
            }


            setLoading(false);
        };
        fetchConfig();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const appLinks = {
        windows: windowsLink || config?.app_links?.windows || '',
        android: config?.app_links?.android || '',
        ios: config?.app_links?.ios || '',
        version: config?.app_links?.version || ''
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-fade-in-down">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Tải Ứng Dụng <span className="text-blue-600">Ôn Thi Đường Thuỷ</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Ôn tập mọi lúc, mọi nơi trên mọi thiết bị. Đồng bộ dữ liệu, làm bài thi thử và theo dõi tiến độ học tập của bạn.
                    </p>
                    {appLinks.version && (
                        <div className="mt-4 inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold text-sm">
                            Phiên bản mới nhất: v{appLinks.version}
                        </div>
                    )}
                </div>

                {/* Download Options Grid - Luôn 3 cột */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                    {/* Windows Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700 flex flex-col">
                        <div className="p-8 flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <FaWindows className="text-5xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Phiên bản Windows</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Dành cho máy tính để bàn và laptop. Trải nghiệm ôn thi tốt nhất với màn hình lớn.
                            </p>
                            <ul className="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-8 w-full px-4">
                                <li className="flex items-center gap-2"><FaDesktop className="text-blue-500" /> Hỗ trợ Windows 10/11</li>
                                <li className="flex items-center gap-2"><FaDownload className="text-blue-500" /> Cài đặt nhanh chóng</li>
                                <li className="flex items-center gap-2"><FaWindows className="text-blue-500" /> Hoạt động mượt mà, ổn định</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                            {appLinks.windows ? (
                                <a
                                    href={appLinks.windows}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center transition-colors shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    <FaWindows /> Tải về cho Windows
                                </a>
                            ) : (
                                <button disabled className="block w-full py-3 px-6 bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-bold rounded-xl text-center cursor-not-allowed">
                                    Đang cập nhật link...
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Android Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700 flex flex-col">
                        <div className="p-8 flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                <FaAndroid className="text-5xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Phiên bản Android</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Ôn tập tiện lợi ngay trên điện thoại của bạn. Hỗ trợ đầy đủ tính năng như trên web.
                            </p>
                            <ul className="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-8 w-full px-4">
                                <li className="flex items-center gap-2"><FaMobileAlt className="text-green-500" /> Hỗ trợ Android 8.0 trở lên</li>
                                <li className="flex items-center gap-2"><FaDownload className="text-green-500" /> Tải file APK trực tiếp</li>
                                <li className="flex items-center gap-2"><FaAndroid className="text-green-500" /> Giao diện thân thiện mobile</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                            {appLinks.android ? (
                                <a
                                    href={appLinks.android}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-center transition-colors shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                                >
                                    <FaAndroid /> Tải về cho Android
                                </a>
                            ) : (
                                <button disabled className="block w-full py-3 px-6 bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-bold rounded-xl text-center cursor-not-allowed">
                                    Đang cập nhật link...
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 💖 iOS Card - LUÔN HIỂN THỊ */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700 flex flex-col">
                        <div className="p-8 flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 text-gray-700 dark:text-gray-300">
                                <FaApple className="text-5xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Phiên bản iOS</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Dành cho iPhone và iPad. Trải nghiệm mượt mà trên hệ sinh thái Apple.
                            </p>
                            <ul className="text-left text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-8 w-full px-4">
                                <li className="flex items-center gap-2"><FaMobileAlt className="text-gray-500" /> Hỗ trợ iOS 14.0 trở lên</li>
                                <li className="flex items-center gap-2"><FaDownload className="text-gray-500" /> Tải qua TestFlight/App Store</li>
                                <li className="flex items-center gap-2"><FaApple className="text-gray-500" /> Tối ưu cho iPhone & iPad</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700">
                            {appLinks.ios ? (
                                <a
                                    href={appLinks.ios}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 px-6 bg-gray-800 hover:bg-black text-white font-bold rounded-xl text-center transition-colors shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
                                >
                                    <FaApple /> Tải về cho iOS
                                </a>
                            ) : (
                                <button disabled className="block w-full py-3 px-6 bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 font-bold rounded-xl text-center cursor-not-allowed">
                                    Đang cập nhật link...
                                </button>
                            )}
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default DownloadAppPage;
