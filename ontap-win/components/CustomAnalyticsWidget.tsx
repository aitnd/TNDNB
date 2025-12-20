import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { FaUsers, FaUserClock, FaChartLine, FaGlobeAsia, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAppStore, AppState } from '../stores/useAppStore';

interface CustomAnalyticsWidgetProps {
    userRole: string;
}

const CustomAnalyticsWidget: React.FC<CustomAnalyticsWidgetProps> = ({ userRole }) => {
    // Only show for Admin/Management
    if (!['admin', 'quan_ly', 'lanh_dao'].includes(userRole)) return null;

    const setAppState = useAppStore(state => state.setAppState);

    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'today'>('7d');

    const [chartData, setChartData] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Call Next.js API Route
                // Note: In development, Next.js runs on port 3000. 
                // If this widget is rendered within the Next.js app (which it is, via /ontap route served by Next.js or proxy), 
                // relative path '/api/analytics' should work.

                // Get token if needed (for now, we'll skip token check on the server for simplicity or add it later)
                // const { auth } = await import('../services/firebaseClient');
                // const token = await auth.currentUser?.getIdToken();

                const response = await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ dateRange: timeRange })
                });

                if (response.ok) {
                    const data = await response.json();
                    setChartData(data.chart);
                    setMetrics(data.metrics);
                } else {
                    const errText = await response.text();
                    console.error("Failed to fetch analytics:", errText);
                    setError("Lỗi kết nối API: " + response.status);
                    try {
                        const errJson = JSON.parse(errText);
                        if (errJson.error) setError(errJson.error);
                    } catch (e) { }
                    setChartData([]);
                    setMetrics(null);
                }
            } catch (error: any) {
                console.error("Error fetching analytics:", error);
                setError(error.message || "Lỗi không xác định");
            } finally {
                setLoading(false);
            }

        };

        if (mounted) {
            fetchData();
        }
    }, [timeRange, mounted]);

    if (!mounted) return null;

    // Helper to format duration
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mb-4"
        >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-900 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FaChartLine className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                Tổng quan truy cập
                            </h3>
                            <p className="text-xs text-gray-500">
                                {timeRange === '7d' ? '7 ngày qua' : timeRange === '30d' ? '30 ngày qua' : 'Hôm nay'}
                            </p>
                        </div>
                    </div>


                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setAppState(AppState.ANALYTICS);
                            }}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                            Xem chi tiết
                        </button>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="text-xs border-none bg-gray-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 text-gray-600 dark:text-gray-300 focus:ring-0 cursor-pointer hover:bg-gray-200 transition-colors outline-none"
                        >
                            <option value="7d">7 ngày qua</option>
                            <option value="30d">30 ngày qua</option>
                            <option value="today">Hôm nay</option>
                        </select>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>
                </div>

                {/* Key Metrics Cards (Always Visible) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-zinc-900 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                    {error && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 z-10 flex flex-col items-center justify-center text-red-500 p-4 text-center">
                            <p className="font-bold">Không thể tải dữ liệu</p>
                            <p className="text-sm">{error}</p>
                            <p className="text-xs text-gray-500 mt-2">Vui lòng kiểm tra quyền truy cập Service Account</p>
                        </div>
                    )}

                    <MetricCard
                        icon={<FaUsers className="text-blue-500" />}
                        label="Người dùng mới"
                        value={metrics ? metrics.newUsers.toLocaleString() : '...'}
                        trend="--"
                        trendUp={true}
                        color="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <MetricCard
                        icon={<FaUserClock className="text-green-500" />}
                        label="Thời gian TB"
                        value={metrics ? formatDuration(metrics.avgSessionDuration) : '...'}
                        trend="--"
                        trendUp={true}
                        color="bg-green-50 dark:bg-green-900/20"
                    />
                    <MetricCard
                        icon={<FaGlobeAsia className="text-purple-500" />}
                        label="Phiên truy cập"
                        value={metrics ? metrics.totalSessions.toLocaleString() : '...'}
                        trend="--"
                        trendUp={true}
                        color="bg-purple-50 dark:bg-purple-900/20"
                    />
                    <MetricCard
                        icon={<FaChartLine className="text-orange-500" />}
                        label="Tỷ lệ thoát"
                        value={metrics ? `${metrics.bounceRate.toFixed(1)}%` : '...'}
                        trend="--"
                        trendUp={false}
                        color="bg-orange-50 dark:bg-orange-900/20"
                    />
                </div>

                {/* Expandable Chart Section */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden border-t border-gray-100 dark:border-zinc-800"
                        >
                            <div className="p-6 h-[350px] w-full bg-gray-50/30 dark:bg-zinc-900/30 relative">
                                {loading && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-zinc-900/50 z-10 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                {error && (
                                    <div className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 z-10 flex flex-col items-center justify-center text-red-500 p-4 text-center">
                                        <p className="font-bold">Không thể tải dữ liệu</p>
                                        <p className="text-sm">{error}</p>
                                        <p className="text-xs text-gray-500 mt-2">Vui lòng kiểm tra quyền truy cập Service Account</p>
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            dy={10}
                                            interval={timeRange === '30d' ? 4 : 0}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="visits"
                                            stroke="#3B82F6"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorVisits)"
                                            name="Lượt truy cập"
                                            animationDuration={1000}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            name="Người dùng"
                                            animationDuration={1000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const MetricCard = ({ icon, label, value, trend, trendUp, color }: any) => (
    <div className={`p-4 rounded-xl ${color} transition-all duration-300 hover:shadow-md`}>
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                {trend}
            </span>
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    </div>
);

export default CustomAnalyticsWidget;
