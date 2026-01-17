import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaDesktop, FaMobileAlt, FaTabletAlt, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

interface AnalyticsPageProps {
    onBack: () => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onBack }) => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'today'>('7d');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dateRange: timeRange })
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    setError("Failed to fetch data");
                }
            } catch (err) {
                console.error(err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8 pb-24"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={onBack}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors shadow-sm bg-white dark:bg-zinc-900"
                    >
                        <FaArrowLeft className="text-xl text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Thống kê chi tiết
                        </h1>
                        <p className="text-sm text-gray-500">
                            Phân tích dữ liệu truy cập website
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <FaCalendarAlt className="text-gray-400 ml-2" />
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer outline-none"
                    >
                        <option value="7d">7 ngày qua</option>
                        <option value="30d">30 ngày qua</option>
                        <option value="today">Hôm nay</option>
                    </select>
                </div>
            </div>

            {loading && !data && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            )}

            {data && (
                <div className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Người dùng mới" value={data.metrics.newUsers} color="blue" />
                        <StatCard label="Phiên truy cập" value={data.metrics.totalSessions} color="purple" />
                        <StatCard label="Thời gian TB" value={`${Math.floor(data.metrics.avgSessionDuration / 60)}m ${Math.floor(data.metrics.avgSessionDuration % 60)}s`} color="green" />
                        <StatCard label="Tỷ lệ thoát" value={`${data.metrics.bounceRate.toFixed(1)}%`} color="orange" />
                    </div>

                    {/* Main Chart */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">Xu hướng truy cập</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.chart}>
                                    <defs>
                                        <linearGradient id="colorVisitsPage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitsPage)" name="Lượt truy cập" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Top Pages */}
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                <FaFileAlt className="text-blue-500" /> Trang được xem nhiều nhất
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-semibold text-gray-500 border-b border-gray-100 dark:border-zinc-800">
                                            <th className="pb-3 pl-2">Tiêu đề trang</th>
                                            <th className="pb-3 text-right pr-2">Lượt xem</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.topPages.map((page: any, idx: number) => (
                                            <tr key={idx} className="border-b border-gray-50 dark:border-zinc-800/50 last:border-none hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="py-3 pl-2 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]" title={page.name}>
                                                    {page.name}
                                                </td>
                                                <td className="py-3 pr-2 text-right text-sm font-bold text-gray-800 dark:text-white">
                                                    {page.value.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Devices & Geo */}
                        <div className="space-y-6">
                            {/* Devices */}
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaDesktop className="text-purple-500" /> Thiết bị
                                </h3>
                                <div className="h-[200px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.devices}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {data.devices.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cities */}
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-red-500" /> Địa điểm (Top 5)
                                </h3>
                                <div className="space-y-3">
                                    {data.cities.slice(0, 5).map((city: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{city.name}</span>
                                            <div className="flex items-center gap-3 flex-1 justify-end">
                                                <div className="w-24 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(city.value / data.cities[0].value) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold w-8 text-right">{city.value}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

const StatCard = ({ label, value, color }: any) => {
    const colorClasses: any = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</p>
        </div>
    );
};

export default AnalyticsPage;
