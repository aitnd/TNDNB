'use client';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export default function CapacitorDetector() {
    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            document.body.classList.add('is-mobile-app');
        }
    }, []);
    return null;
}
