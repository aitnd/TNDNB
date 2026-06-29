'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebaseClient';
import { Settings, Wrench, ShieldAlert, Clock, Mail, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PortalMaintenanceScreen from './PortalMaintenanceScreen';

export default function PortalMaintenanceWrapper({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'usage_config'), (docSnap) => {
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const isBypassed = pathname?.startsWith('/quan-ly') || pathname?.startsWith('/ontap/login-admin');

    if (loading) return <>{children}</>;

    if (config?.isMaintenancePortal && !isBypassed) {
        return (
            <div className="fixed inset-0 z-[9999] overflow-auto">
                <PortalMaintenanceScreen config={config} />
            </div>
        );
    }

    return <>{children}</>;
}
