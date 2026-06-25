import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../services/firebaseClient';
import { motion } from 'framer-motion';
import { Users, UserCheck, GraduationCap, Shield } from 'lucide-react';

/**
 * AdminStatsBar — Thanh thống kê online slim realtime
 * Hiển thị ở đầu Dashboard cho admin/quản lý/lãnh đạo
 * Dữ liệu từ Firebase RTDB /status (giống OnlineStatsWidget nhưng gọn hơn)
 */

interface AdminStatsBarProps {
    userRole: string;
}

interface OnlineStats {
    total: number;
    guests: number;
    students: number;
    teachers: number;
    admins: number;
}

const AdminStatsBar: React.FC<AdminStatsBarProps> = ({ userRole }) => {
    // Chỉ hiện cho Admin/Quản lý/Lãnh đạo
    if (!['admin', 'quan_ly', 'lanh_dao'].includes(userRole)) return null;

    const [stats, setStats] = useState<OnlineStats>({ total: 0, guests: 0, students: 0, teachers: 0, admins: 0 });

    useEffect(() => {
        if (!rtdb) return;
        const statusRef = ref(rtdb, 'status');

        const unsubscribe = onValue(statusRef, (snapshot) => {
            if (!snapshot.exists()) {
                setStats({ total: 0, guests: 0, students: 0, teachers: 0, admins: 0 });
                return;
            }

            const data = snapshot.val();
            let total = 0, guests = 0, students = 0, teachers = 0, admins = 0;

            Object.values(data).forEach((user: any) => {
                if (user.state === 'online') {
                    total++;
                    if (['admin', 'quan_ly', 'lanh_dao'].includes(user.role)) admins++;
                    else if (user.role === 'giao_vien') teachers++;
                    else if (user.role === 'guest') guests++;
                    else students++;
                }
            });

            setStats({ total, guests, students, teachers, admins });
        }, (error) => {
            console.error("AdminStatsBar RTDB error:", error);
        });

        return () => unsubscribe();
    }, []);

    const items = [
        { label: 'Trực tuyến', value: stats.total, icon: Users, color: 'text-blue-500', dot: 'bg-green-500' },
        { label: 'Khách', value: stats.guests, icon: UserCheck, color: 'text-gray-400', dot: 'bg-gray-400' },
        { label: 'Học viên', value: stats.students, icon: GraduationCap, color: 'text-emerald-500', dot: 'bg-emerald-500' },
        { label: 'Giáo viên', value: stats.teachers, icon: UserCheck, color: 'text-orange-500', dot: 'bg-orange-500' },
        { label: 'Quản lý', value: stats.admins, icon: Shield, color: 'text-violet-500', dot: 'bg-violet-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full mb-6"
        >
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-gray-200/50 dark:border-zinc-700/50 shadow-sm">
                {/* Chấm xanh nhấp nháy */}
                <div className="flex items-center gap-1.5 mr-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live</span>
                </div>

                {/* Separator */}
                <div className="w-px h-4 bg-gray-300 dark:bg-zinc-600 hidden md:block" />

                {items.map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}:</span>
                        <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                        {idx < items.length - 1 && (
                            <div className="w-px h-3 bg-gray-200 dark:bg-zinc-700 ml-1 hidden sm:block" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminStatsBar;
