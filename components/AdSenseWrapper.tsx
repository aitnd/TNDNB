'use client'

import React from 'react'
import Script from 'next/script'
import { useAuth } from '../context/AuthContext'

interface AdSenseWrapperProps {
    clientId: string
}

export default function AdSenseWrapper({ clientId }: AdSenseWrapperProps) {
    const { user } = useAuth()

    // Logic: 
    // 1. Nếu user đã xác thực (isVerified = true) hoặc đã vào lớp (class có dữ liệu)
    //    => LÀ VIP => KHÔNG HIỆN QUẢNG CÁO
    // 2. Ngược lại (Khách, user chưa xác thực) => HIỆN QUẢNG CÁO

    const isVip = user?.isVerified || (user?.class && user.class.length > 0);

    if (isVip) {
        console.log('User is VIP - Blocking AdSense 🛑');
        return null; // Không render gì cả
    }

    return (
        <Script
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
            crossOrigin="anonymous"
        />
    )
}
