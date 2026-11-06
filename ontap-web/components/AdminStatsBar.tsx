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
    const isAdmin = ['admin', 'quan_ly', 'lanh_dao'].includes(userRole);

    const [stats, setStats] = useState<OnlineStats>({ total: 0, guests: 0, students: 0, teachers: 0, admins: 0 });

    useEffect(() => {
        if (!isAdmin || !rtdb) return;
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
    }, [isAdmin]);

    if (!isAdmin) return null;

    const items = [
        { label: 'Trực tuyến', value: stats.total, icon: Users, color: 'text-primary', dot: 'bg-emerald-500' },
        { label: 'Khách', value: stats.guests, icon: UserCheck, color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
        { label: 'Học viên', value: stats.students, icon: GraduationCap, color: 'text-emerald-500', dot: 'bg-emerald-500' },
        { label: 'Giáo viên', value: stats.teachers, icon: UserCheck, color: 'text-amber-500', dot: 'bg-amber-500' },
        { label: 'Quản lý', value: stats.admins, icon: Shield, color: 'text-violet-500', dot: 'bg-violet-500' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 px-3 py-1.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-sm text-foreground">
                {/* Chấm xanh nhấp nháy */}
                <div className="flex items-center gap-1.5 mr-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
                </div>

                {/* Separator */}
                <div className="w-px h-4 bg-border hidden md:block" />

                {items.map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        <span className="text-xs text-muted-foreground">{item.label}:</span>
                        <span className={`text-xs md:text-sm font-bold tabular-nums ${item.color}`}>{item.value}</span>
                        {idx < items.length - 1 && (
                            <div className="w-px h-3 bg-border ml-1 hidden sm:block" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminStatsBar;
