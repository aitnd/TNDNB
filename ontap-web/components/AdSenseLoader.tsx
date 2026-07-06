import React, { useEffect } from 'react';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getUserRoleConfig } from '../services/usageService';
import { MONETAG_CONFIG, getDirectLinkUrl, setMonetagLimits, getMonetagLimits, getSessionCount, incrementSessionCount } from '../services/monetagConfig';
import { isAdSenseBlocked, incrementAdSenseClick, setAdSenseLimits } from '../services/adsenseConfig';
import { ADSENSE_SELECTIVE_BLOCK_CSS, ADSENSE_HIDE_ALL_CSS } from '../services/adBlockerStyles';

interface AdSenseLoaderProps {
    userProfile: any | null;
}

const AdSenseLoader: React.FC<AdSenseLoaderProps> = ({ userProfile }) => {
    useEffect(() => {
        let observer: IntersectionObserver | null = null;
        let popunderHandler: ((e: MouseEvent) => void) | null = null;

        const checkConfig = async () => {
            try {
                const config: UsageConfig = await getUsageConfig();
                
                // Cập nhật giới hạn từ Firebase config vào state local
                setAdSenseLimits(config.adsenseMaxClicks ?? 2, config.adsenseCooldownMinutes ?? 30);
                setMonetagLimits(config.monetagPopunderCooldownMinutes ?? 30, config.monetagDirectLinkCooldownMinutes ?? 30);
                const { param } = getUserRoleConfig(config, userProfile);
                const showAdSense = param.showAdSense || false;
                const showAdsterra = param.showAdsterra || false;
                const showMonetag = param.showMonetag || false;
                const maxPopunder = showMonetag ? (config.monetagPopunderMaxPerSession ?? 0) : 0;

                if (showAdSense || showAdsterra) {
                    removeAllAdSenseStyles(); // Gỡ style chặn trước khi load quảng cáo
                    
                    // Lazy load trigger: Phanh phui script khi cuộn đến vùng quảng cáo
                    // Chúng ta quan sát body hoặc một thẻ cắm mốc
                    observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            if (showAdSense) {
                                if (isAdSenseBlocked()) {
                                    console.log('🛡️ [AdSenseLoader] AdSense bị chặn click do bảo vệ IVT');
                                    injectSelectiveBlockStyle();
                                } else {
                                    loadAdSenseScript();
                                }
                            }
                            if (showAdsterra) loadAdsterraScript();
                            // Monetag Smart Tag (Push/Vignette) đã được gỡ theo yêu cầu chuyển sang global, 
                            // hiện tại chỉ dùng DirectLink/Popunder/Countdown
                            observer?.disconnect();
                        }
                    }, { rootMargin: '200px' }); // Load trước khi chạm 200px

                    // Thử tìm các placeholder quảng cáo để quan sát
                    const adPlaceholders = document.querySelectorAll('.adsbygoogle, #adsterra-placeholder');
                    if (adPlaceholders.length > 0) {
                        adPlaceholders.forEach(el => observer?.observe(el));
                    } else {
                        // Nếu không thấy placeholder cụ thể, quan sát body để load sau khi user cuộn một chút
                        observer.observe(document.body);
                    }
                } else {
                    removeScripts();
                    injectHideAdsCompletely(); // Admin TẮT → ẩn hoàn toàn
                }

                // 🖱️ Auto-click Popunder: Mở Direct Link khi user click lần đầu trên trang
                if (maxPopunder > 0 && !(window as any).electron) {
                    const directLinkUrl = getDirectLinkUrl(config.monetagDirectLinkUrl);
                    popunderHandler = setupAutoPopunder(directLinkUrl, maxPopunder);
                }
            } catch (error) {
                console.error("Error checking AdSense config:", error);
            }
        };

        checkConfig();

        return () => {
            observer?.disconnect();
            // Dọn dẹp popunder listener
            if (popunderHandler) {
                document.body.removeEventListener('click', popunderHandler);
            }
            // blur handler được quản lý bởi effect riêng bên dưới
        };
    }, [userProfile]); // Re-check when user changes (e.g. login/logout)

    // 🛡️ Phát hiện click quảng cáo AdSense bằng document.activeElement
    // Khi user click vào iframe quảng cáo → window mất focus (blur)
    // → Kiểm tra document.activeElement có phải iframe Google Ads không
    useEffect(() => {
        const blurHandler = () => {
            // setTimeout(0) để đảm bảo document.activeElement đã cập nhật
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
                        console.log('🛡️ [AdSenseLoader] Phát hiện click vào quảng cáo AdSense!');
                        incrementAdSenseClick();
                        if (isAdSenseBlocked()) {
                            injectSelectiveBlockStyle();
                        }
                        // Re-focus trang chính để tiếp tục phát hiện click tiếp theo
                        setTimeout(() => window.focus(), 150);
                    }
                }
            }, 0);
        };

        window.addEventListener('blur', blurHandler);
        return () => window.removeEventListener('blur', blurHandler);
    }, []);

    // 🖱️ Auto Popunder: Gắn click listener, mở Direct Link dựa trên cooldown
    const setupAutoPopunder = (directLinkUrl: string, maxPerSession: number): ((e: MouseEvent) => void) => {
        const handler = () => {
            if (maxPerSession <= 0) return;

            const limits = getMonetagLimits();
            const lastFired = sessionStorage.getItem(MONETAG_CONFIG.SESSION_KEYS.POPUNDER_FIRED);
            const now = Date.now();
            
            if (lastFired && now - parseInt(lastFired, 10) < limits.popunderCooldownMs) return;

            const currentCount = getSessionCount(MONETAG_CONFIG.SESSION_KEYS.POPUNDER_COUNT);
            if (currentCount >= maxPerSession) {
                document.body.removeEventListener('click', handler);
                return;
            }

            try {
                window.open(directLinkUrl, '_blank');
                sessionStorage.setItem(MONETAG_CONFIG.SESSION_KEYS.POPUNDER_FIRED, now.toString());
                incrementSessionCount(MONETAG_CONFIG.SESSION_KEYS.POPUNDER_COUNT);
            } catch {
                // Popup bị chặn → bỏ qua
            }
            
            // Xóa listener nếu đã đạt max
            if (currentCount + 1 >= maxPerSession) {
                document.body.removeEventListener('click', handler);
            }
        };

        document.body.addEventListener('click', handler);
        return handler;
    };

    const loadAdSenseScript = () => {
        if (document.getElementById('adsense-script')) return;
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6121118706628509';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    };

    const loadAdsterraScript = () => {
        if (document.getElementById('adsterra-script')) return;
        const script = document.createElement('script');
        script.id = 'adsterra-script';
        script.async = true;
        script.src = 'https://pl28592472.effectivegatecpm.com/40/38/4c/40384cc1f853bc02181ba010564ff378.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    };

    const removeScripts = () => {
        ['adsense-script', 'adsterra-script', 'monetag-script'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    };

    // === QUẢN LÝ STYLE ADSENSE ===

    /** 🛡️ IVT Shield CHẶN → pointer-events: none (quảng cáo vẫn hiện, giữ Impression) */
    const injectSelectiveBlockStyle = () => {
        if (document.getElementById('adsense-blocker-style')) return;
        removeAllAdSenseStyles();
        const style = document.createElement('style');
        style.id = 'adsense-blocker-style';
        style.innerHTML = ADSENSE_SELECTIVE_BLOCK_CSS;
        document.head.appendChild(style);
    };

    /** 🚫 Admin TẮT quảng cáo → display: none (ẩn hoàn toàn, không Impression) */
    const injectHideAdsCompletely = () => {
        if (document.getElementById('adsense-hide-style')) return;
        removeAllAdSenseStyles();
        const style = document.createElement('style');
        style.id = 'adsense-hide-style';
        style.innerHTML = ADSENSE_HIDE_ALL_CSS;
        document.head.appendChild(style);
    };

    /** Gỡ tất cả style liên quan AdSense (dọn dẹp trước khi inject mới) */
    const removeAllAdSenseStyles = () => {
        ['adsense-blocker-style', 'adsense-hide-style'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    };

    return null; // This component handles logic only, no UI
};

export default AdSenseLoader;
