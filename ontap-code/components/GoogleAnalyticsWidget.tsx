import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaExternalLinkAlt, FaSync } from 'react-icons/fa';

interface GoogleAnalyticsWidgetProps {
    userRole: string;
}

const GoogleAnalyticsWidget: React.FC<GoogleAnalyticsWidgetProps> = ({ userRole }) => {
    // Only show for Admin/Management
    if (!['admin', 'quan_ly', 'lanh_dao'].includes(userRole)) return null;

    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState(0); // Used to refresh the iframe

    // Embed URL provided by user
    const embedUrl = "https://lookerstudio.google.com/embed/reporting/c901906f-4b6a-41ca-876f-ae61dab80085/page/p_kx1rbu54bd";

    const handleRefresh = () => {
        setIsLoading(true);
        setKey(prev => prev + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mb-8"
        >
            {/* Premium Card Container */}
            <div className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-xl">

                {/* Inner Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden h-full relative">

                    {/* Header Section */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <FaChartLine className="text-orange-600 dark:text-orange-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
                                    Thống kê truy cập
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    Dữ liệu thời gian thực từ Google Analytics 4
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                                title="Làm mới dữ liệu"
                            >
                                <FaSync className={isLoading ? "animate-spin" : ""} />
                            </button>
                            <a
                                href="https://lookerstudio.google.com/reporting/c901906f-4b6a-41ca-876f-ae61dab80085"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all"
                                title="Mở báo cáo đầy đủ"
                            >
                                <FaExternalLinkAlt size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Iframe Container */}
                    <div className="relative w-full h-[600px] bg-white dark:bg-zinc-950 transition-all duration-500">

                        {/* Loading Overlay */}
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900">
                                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                                <p className="text-sm text-gray-500 animate-pulse">Đang tải dữ liệu báo cáo...</p>
                            </div>
                        )}

                        <iframe
                            key={key}
                            src={embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            onLoad={() => setIsLoading(false)}
                            title="Google Analytics Report"
                            className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Overlay to block interaction with Looker Studio header if needed (Optional) */}
                        {/* <div className="absolute top-0 left-0 w-full h-10 bg-transparent pointer-events-none"></div> */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GoogleAnalyticsWidget;
