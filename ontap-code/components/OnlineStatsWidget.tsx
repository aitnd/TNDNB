import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../services/firebaseClient';
import { motion } from 'framer-motion';

const OnlineStatsWidget = ({ userRole }: { userRole: string }) => {
    // Only show for Admin/Management
    if (!['admin', 'quan_ly', 'lanh_dao'].includes(userRole)) return null;

    const [stats, setStats] = useState({ total: 0, admins: 0, teachers: 0, students: 0 });

    useEffect(() => {
        if (!rtdb) return;
        const statusRef = ref(rtdb, 'status');

        // Listen to ALL users' status
        const unsubscribe = onValue(statusRef, (snapshot) => {
            if (!snapshot.exists()) {
                setStats({ total: 0, admins: 0, teachers: 0, students: 0 });
                return;
            }

            const data = snapshot.val();
            let total = 0, admins = 0, teachers = 0, students = 0;

            Object.values(data).forEach((user: any) => {
                if (user.state === 'online') {
                    total++;
                    if (['admin', 'quan_ly', 'lanh_dao'].includes(user.role)) admins++;
                    else if (user.role === 'giao_vien') teachers++;
                    else students++;
                }
            });

            setStats({ total, admins, teachers, students });
        });

        return () => unsubscribe();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
            <StatCard label="Trực tuyến" count={stats.total} color="bg-blue-600" />
            <StatCard label="Học viên" count={stats.students} color="bg-green-600" />
            <StatCard label="Giáo viên" count={stats.teachers} color="bg-orange-600" />
            <StatCard label="Quản lý" count={stats.admins} color="bg-purple-600" />
        </motion.div>
    );
};

const StatCard = ({ label, count, color }: { label: string, count: number, color: string }) => (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{count}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${color} animate-pulse`}></div>
    </div>
);

export default OnlineStatsWidget;
