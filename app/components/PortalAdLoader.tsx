'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseClient';
import { ADSENSE_SELECTIVE_BLOCK_CSS } from '../../ontap-web/services/adBlockerStyles';

/**
 * PortalAdLoader - Tải quảng cáo động cho trang chủ tin tức (Next.js Portal).
 * Đọc các cấu hình độc lập từ Firestore (settings/usage_config) theo thời gian thực:
 * - showPortalAdSense
 * - showPortalAdsterra
 * - showPortalMonetag
 */
const PortalAdLoader: React.FC = () => {
    const [adSenseEnabled, setAdSenseEnabled] = useState<boolean | null>(null);
    const [adsterraEnabled, setAdsterraEnabled] = useState<boolean | null>(null);
    const [monetagEnabled, setMonetagEnabled] = useState<boolean | null>(null);

    // IVT Shield States
    const [adsenseMaxClicks, setAdsenseMaxClicks] = useState<number>(2);
    const [adsenseCooldownMinutes, setAdsenseCooldownMinutes] = useState<number>(30);
    const [isAdSenseBlocked, setIsAdSenseBlocked] = useState<boolean>(false);

    useEffect(() => {
        // Lắng nghe cấu hình quảng cáo theo thời gian thực từ Firestore
        const unsubscribe = onSnapshot(
            doc(db, 'settings', 'usage_config'),
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const showPortalAdsLegacy = data.showPortalAds ?? true;
                    
                    setAdSenseEnabled(data.showPortalAdSense ?? showPortalAdsLegacy);
                    setAdsterraEnabled(data.showPortalAdsterra ?? showPortalAdsLegacy);
                    setMonetagEnabled(data.showPortalMonetag ?? false);

                    // IVT Shield Config
                    setAdsenseMaxClicks(data.adsenseMaxClicks ?? 2);
                    setAdsenseCooldownMinutes(data.adsenseCooldownMinutes ?? 30);
                } else {
                    setAdSenseEnabled(true);
                    setAdsterraEnabled(true);
                    setMonetagEnabled(false);
                }
            },
            (error) => {
                console.warn('⚠️ [PortalAdLoader] Lỗi đọc cấu hình:', error.message);
                setAdSenseEnabled(true);
                setAdsterraEnabled(true);
                setMonetagEnabled(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // 1. Google AdSense logic
    useEffect(() => {
        if (adSenseEnabled === null) return;

        if (adSenseEnabled) {
            if (isAdSenseBlocked) {
                console.log('Portal AdSense is blocked due to invalid traffic protection');
                injectHideAdSenseStyle();
            } else {
                removeHideAdSenseStyle();
                loadAdSenseScript();
            }
        } else {
            removeAdSenseScript();
            injectHideAdSenseStyle();
        }
    }, [adSenseEnabled, isAdSenseBlocked]);

    // Blur listener for AdSense clicks (IVT Tracking)
    const [isMouseOverAd, setIsMouseOverAd] = useState(false);

    // Helper functions for IVT
    const getCooldownMs = useCallback(() => adsenseCooldownMinutes * 60 * 1000, [adsenseCooldownMinutes]);

    const incrementAdSenseClick = useCallback(() => {
        try {
            const now = Date.now();
            const stored = localStorage.getItem('portal_adsense_click_tracker');
            let data = { clicks: 0, firstClickTime: now };

            if (stored) {
                const parsed = JSON.parse(stored);
                if (now - parsed.firstClickTime > getCooldownMs()) {
                    data = { clicks: 1, firstClickTime: now };
                } else {
                    data = { clicks: parsed.clicks + 1, firstClickTime: parsed.firstClickTime };
                }
            } else {
                data.clicks = 1;
            }

            localStorage.setItem('portal_adsense_click_tracker', JSON.stringify(data));
            console.log(`Portal AdSense click tracked. Total: ${data.clicks}`);
        } catch (error) {
            console.error("Error updating AdSense click tracker", error);
        }
    }, [getCooldownMs]);

    const checkIsAdSenseBlocked = useCallback((): boolean => {
        try {
            const stored = localStorage.getItem('portal_adsense_click_tracker');
            if (!stored) return false;

            const parsed = JSON.parse(stored);
            const now = Date.now();

            if (now - parsed.firstClickTime > getCooldownMs()) {
                return false;
            }

            return parsed.clicks >= adsenseMaxClicks;
        } catch {
            return false;
        }
    }, [adsenseMaxClicks, getCooldownMs]);

    useEffect(() => {
        const blurHandler = () => {
            if (isMouseOverAd) {
                incrementAdSenseClick();
                if (checkIsAdSenseBlocked()) {
                    setIsAdSenseBlocked(true);
                }
            }
        };

        window.addEventListener('blur', blurHandler);
        return () => window.removeEventListener('blur', blurHandler);
    }, [isMouseOverAd, incrementAdSenseClick, checkIsAdSenseBlocked]);

    // Global mouse tracker for AdSense iframe detection
    useEffect(() => {
        const mouseMoveHandler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.classList.contains('adsbygoogle') || target.closest('.adsbygoogle') || target.tagName.toLowerCase() === 'ins')) {
                setIsMouseOverAd(true);
            } else {
                setIsMouseOverAd(false);
            }
        };

        window.addEventListener('mousemove', mouseMoveHandler);
        return () => window.removeEventListener('mousemove', mouseMoveHandler);
    }, []);

    // Initial check for block status
    useEffect(() => {
        setIsAdSenseBlocked(checkIsAdSenseBlocked());
    }, [checkIsAdSenseBlocked]);

    // 2. Adsterra logic
    useEffect(() => {
        if (adsterraEnabled === null) return;

        if (adsterraEnabled) {
            loadAdsterraScript();
        } else {
            removeAdsterraScript();
        }
    }, [adsterraEnabled]);

    // 3. Monetag logic
    useEffect(() => {
        if (monetagEnabled === null) return;

        if (monetagEnabled) {
            loadMonetagScript();
        } else {
            removeMonetagScript();
        }
    }, [monetagEnabled]);

    /** --- Script Load / Remove Helpers --- */

    const loadAdSenseScript = () => {
        if (document.getElementById('portal-adsense-script')) return;
        const script = document.createElement('script');
        script.id = 'portal-adsense-script';
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6121118706628509';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    };

    const removeAdSenseScript = () => {
        const el = document.getElementById('portal-adsense-script');
        if (el) el.remove();
    };

    const loadAdsterraScript = () => {
        if (document.getElementById('portal-adsterra-script')) return;
        const script = document.createElement('script');
        script.id = 'portal-adsterra-script';
        script.async = true;
        script.src = 'https://pl28592472.effectivegatecpm.com/40/38/4c/40384cc1f853bc02181ba010564ff378.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    };

    const removeAdsterraScript = () => {
        const el = document.getElementById('portal-adsterra-script');
        if (el) el.remove();
        // Gỡ bỏ thêm các phần tử DOM tự sinh của Adsterra nếu có
        const adsterraContainers = document.querySelectorAll('[id^="adsterra"], [class*="adsterra"], #pl28592472');
        adsterraContainers.forEach(el => el.remove());
    };

    const loadMonetagScript = () => {
        if (document.getElementById('portal-monetag-script')) return;
        const script = document.createElement('script');
        script.id = 'portal-monetag-script';
        script.async = true;
        script.src = 'https://quge5.com/88/tag.min.js';
        script.setAttribute('data-zone', '254797');
        script.setAttribute('data-cfasync', 'false');
        script.defer = true;
        document.body.appendChild(script);
    };

    const removeMonetagScript = () => {
        const el = document.getElementById('portal-monetag-script');
        if (el) el.remove();
    };

    // 🛡️ Chặn click CHỌN LỌC: Chỉ khóa In-page ads, mở khóa Overlay (Anchor/Vignette)
    // để user vẫn bấm Close/Ẩn bình thường. Quảng cáo In-page vẫn hiện → giữ Impression.
    const injectHideAdSenseStyle = () => {
        if (document.getElementById('portal-adsense-blocker-style')) return;
        const style = document.createElement('style');
        style.id = 'portal-adsense-blocker-style';
        style.innerHTML = ADSENSE_SELECTIVE_BLOCK_CSS;
        document.head.appendChild(style);
    };

    const removeHideAdSenseStyle = () => {
        const style = document.getElementById('portal-adsense-blocker-style');
        if (style) style.remove();
    };

    return null; // Component chỉ xử lý logic, không render UI
};

export default PortalAdLoader;
