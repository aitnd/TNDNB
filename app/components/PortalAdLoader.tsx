'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseClient';
import { ADSENSE_SELECTIVE_BLOCK_CSS, ADSENSE_HIDE_ALL_CSS } from '../../ontap-web/services/adBlockerStyles';

/**
 * PortalAdLoader - Tải quảng cáo động cho trang chủ tin tức (Next.js Portal).
 * Đọc các cấu hình độc lập từ Firestore (settings/usage_config) theo thời gian thực:
 * - showPortalAdSense
 * - showPortalAdsterra
 * - showPortalMonetag
 * 
 * 🛡️ IVT Shield: Phát hiện click quảng cáo bằng document.activeElement (blur + iframe check)
 */
const PortalAdLoader: React.FC = () => {
    const [adSenseEnabled, setAdSenseEnabled] = useState<boolean | null>(null);
    const [adsterraEnabled, setAdsterraEnabled] = useState<boolean | null>(null);
    const [monetagEnabled, setMonetagEnabled] = useState<boolean | null>(null);

    // IVT Shield States
    const [adsenseMaxClicks, setAdsenseMaxClicks] = useState<number>(2);
    const [adsenseCooldownMinutes, setAdsenseCooldownMinutes] = useState<number>(30);
    const [isAdSenseBlocked, setIsAdSenseBlocked] = useState<boolean>(false);

    // === FIRESTORE REALTIME LISTENER ===
    useEffect(() => {
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

    // === 1. GOOGLE ADSENSE LOGIC ===
    useEffect(() => {
        if (adSenseEnabled === null) return;

        if (adSenseEnabled) {
            if (isAdSenseBlocked) {
                // IVT Shield CHẶN → pointer-events: none (giữ hiển thị = giữ Impression)
                console.log('🛡️ [PortalAdLoader] AdSense bị chặn click do bảo vệ IVT');
                injectSelectiveBlockStyle();
            } else {
                // Bình thường → gỡ style chặn, load script
                removeAllAdSenseStyles();
                loadAdSenseScript();
            }
        } else {
            // Admin TẮT AdSense → ẩn hoàn toàn + gỡ script
            removeAdSenseScript();
            injectHideAdSenseCompletely();
        }
    }, [adSenseEnabled, isAdSenseBlocked]);

    // === IVT SHIELD: HELPER FUNCTIONS ===
    const getCooldownMs = useCallback(() => adsenseCooldownMinutes * 60 * 1000, [adsenseCooldownMinutes]);

    const incrementAdSenseClick = useCallback(() => {
        try {
            const now = Date.now();
            const stored = localStorage.getItem('portal_adsense_click_tracker');
            let data = { clicks: 0, firstClickTime: now };

            if (stored) {
                const parsed = JSON.parse(stored);
                if (now - parsed.firstClickTime > getCooldownMs()) {
                    // Cooldown hết → reset bộ đếm
                    data = { clicks: 1, firstClickTime: now };
                } else {
                    data = { clicks: parsed.clicks + 1, firstClickTime: parsed.firstClickTime };
                }
            } else {
                data.clicks = 1;
            }

            localStorage.setItem('portal_adsense_click_tracker', JSON.stringify(data));
            console.log(`🛡️ [PortalAdLoader] AdSense click tracked. Total: ${data.clicks}/${adsenseMaxClicks}`);
        } catch (error) {
            console.error("Error updating AdSense click tracker", error);
        }
    }, [getCooldownMs, adsenseMaxClicks]);

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

    // === 🛡️ PHÁT HIỆN CLICK QUẢNG CÁO BẰNG document.activeElement ===
    // Kỹ thuật: Khi user click vào iframe quảng cáo Google → window mất focus (blur)
    // → Kiểm tra document.activeElement có phải iframe Google Ads không
    // Ưu điểm: Chính xác hơn mousemove vì không bị ảnh hưởng bởi cross-origin iframe
    useEffect(() => {
        const blurHandler = () => {
            // setTimeout(0) để đảm bảo document.activeElement đã được cập nhật
            setTimeout(() => {
                const activeEl = document.activeElement;
                if (activeEl && activeEl.tagName === 'IFRAME') {
                    const iframe = activeEl as HTMLIFrameElement;
                    // Nhận diện iframe Google Ads bằng nhiều dấu hiệu
                    const isGoogleAd =
                        iframe.closest('.adsbygoogle') !== null ||
                        iframe.closest('ins.adsbygoogle') !== null ||
                        (iframe.id && (iframe.id.includes('google_ads') || iframe.id.includes('aswift'))) ||
                        (iframe.src && (iframe.src.includes('googlesyndication') || iframe.src.includes('doubleclick')));

                    if (isGoogleAd) {
                        console.log('🛡️ [PortalAdLoader] Phát hiện click vào quảng cáo AdSense!');
                        incrementAdSenseClick();
                        if (checkIsAdSenseBlocked()) {
                            setIsAdSenseBlocked(true);
                        }
                        // Re-focus trang chính để tiếp tục phát hiện click tiếp theo
                        setTimeout(() => window.focus(), 150);
                    }
                }
            }, 0);
        };

        window.addEventListener('blur', blurHandler);
        return () => window.removeEventListener('blur', blurHandler);
    }, [incrementAdSenseClick, checkIsAdSenseBlocked]);

    // Kiểm tra trạng thái block khi component mount
    useEffect(() => {
        setIsAdSenseBlocked(checkIsAdSenseBlocked());
    }, [checkIsAdSenseBlocked]);

    // === 2. ADSTERRA LOGIC ===
    useEffect(() => {
        if (adsterraEnabled === null) return;

        if (adsterraEnabled) {
            loadAdsterraScript();
        } else {
            removeAdsterraScript();
        }
    }, [adsterraEnabled]);

    // === 3. MONETAG LOGIC ===
    useEffect(() => {
        if (monetagEnabled === null) return;

        if (monetagEnabled) {
            loadMonetagScript();
        } else {
            removeMonetagScript();
        }
    }, [monetagEnabled]);

    return null; // Component chỉ xử lý logic, không render UI
};

// === SCRIPT LOAD / REMOVE HELPERS ===

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
    // 1. Gỡ script chính (cả dynamic lẫn static nếu còn sót)
    const el = document.getElementById('portal-monetag-script');
    if (el) el.remove();
    // 2. Dọn dẹp TẤT CẢ DOM elements mà Monetag tạo ra (overlay, iframe, popup...)
    document.querySelectorAll(
        'script[src*="quge5.com"], script[src*="monetag"], ' +
        'iframe[src*="quge5"], iframe[src*="monetag"], ' +
        '[id*="monetag"], [class*="monetag"]'
    ).forEach(node => node.remove());
};

// === QUẢN LÝ STYLE ADSENSE ===

/** 🛡️ IVT Shield CHẶN → pointer-events: none (quảng cáo vẫn hiện, giữ Impression) */
const injectSelectiveBlockStyle = () => {
    if (document.getElementById('portal-adsense-blocker-style')) return;
    removeAllAdSenseStyles();
    const style = document.createElement('style');
    style.id = 'portal-adsense-blocker-style';
    style.innerHTML = ADSENSE_SELECTIVE_BLOCK_CSS;
    document.head.appendChild(style);
};

/** 🚫 Admin TẮT AdSense → display: none (ẩn hoàn toàn, không Impression) */
const injectHideAdSenseCompletely = () => {
    if (document.getElementById('portal-adsense-hide-style')) return;
    removeAllAdSenseStyles();
    const style = document.createElement('style');
    style.id = 'portal-adsense-hide-style';
    style.innerHTML = ADSENSE_HIDE_ALL_CSS;
    document.head.appendChild(style);
};

/** Gỡ tất cả style liên quan AdSense (dọn dẹp trước khi inject mới) */
const removeAllAdSenseStyles = () => {
    ['portal-adsense-blocker-style', 'portal-adsense-hide-style'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
};

export default PortalAdLoader;
