'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseClient';

/**
 * PortalAdLoader - Tải quảng cáo động cho trang chủ tin tức (Next.js Portal).
 * Đọc cấu hình showPortalAds từ Firestore (settings/usage_config) theo thời gian thực.
 * Nếu showPortalAds === true → Load script Adsterra.
 * Nếu showPortalAds === false → Gỡ script và ẩn quảng cáo bằng CSS.
 */
const PortalAdLoader: React.FC = () => {
    const [showAds, setShowAds] = useState<boolean | null>(null);

    useEffect(() => {
        // Lắng nghe cấu hình quảng cáo theo thời gian thực từ Firestore
        const unsubscribe = onSnapshot(
            doc(db, 'settings', 'usage_config'),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Mặc định bật quảng cáo nếu chưa có trường này trong Firestore
                    setShowAds(data.showPortalAds ?? true);
                } else {
                    setShowAds(true); // Mặc định bật
                }
            },
            (error) => {
                console.warn('⚠️ [PortalAdLoader] Lỗi đọc cấu hình:', error.message);
                setShowAds(true); // Fail-safe: bật quảng cáo khi lỗi
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (showAds === null) return; // Chưa load xong cấu hình

        if (showAds) {
            removeHideAdsStyle();
            loadAdsterraScript();
        } else {
            removeAdsterraScript();
            injectHideAdsStyle();
        }
    }, [showAds]);

    /** Tải script quảng cáo Adsterra */
    const loadAdsterraScript = () => {
        if (document.getElementById('portal-adsterra-script')) return;
        const script = document.createElement('script');
        script.id = 'portal-adsterra-script';
        script.async = true;
        script.src = 'https://pl28592472.effectivegatecpm.com/40/38/4c/40384cc1f853bc02181ba010564ff378.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        console.log('🟢 [Portal] Adsterra Script Loaded');
    };

    /** Gỡ bỏ script quảng cáo Adsterra */
    const removeAdsterraScript = () => {
        const el = document.getElementById('portal-adsterra-script');
        if (el) el.remove();
        console.log('🔴 [Portal] Adsterra Script Removed');
    };

    /** Inject CSS ẩn toàn bộ phần tử quảng cáo (xử lý DOM thừa sau khi gỡ script) */
    const injectHideAdsStyle = () => {
        if (document.getElementById('portal-ads-blocker-style')) return;
        const style = document.createElement('style');
        style.id = 'portal-ads-blocker-style';
        style.innerHTML = `
            [id^="adsterra"], [class*="adsterra"],
            .at-social-bar, #pl28592472 {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                pointer-events: none !important;
                z-index: -9999 !important;
            }
        `;
        document.head.appendChild(style);
    };

    /** Gỡ CSS ẩn quảng cáo */
    const removeHideAdsStyle = () => {
        const style = document.getElementById('portal-ads-blocker-style');
        if (style) style.remove();
    };

    return null; // Component chỉ xử lý logic, không render UI
};

export default PortalAdLoader;
