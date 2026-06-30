import React, { useEffect, useState } from 'react';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getUserRoleConfig } from '../services/usageService';
import { MONETAG_CONFIG, getDirectLinkUrl, setMonetagLimits, getMonetagLimits, getSessionCount, incrementSessionCount } from '../services/monetagConfig';
import { isAdSenseBlocked, incrementAdSenseClick, setAdSenseLimits } from '../services/adsenseConfig';

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
                    removeHideAdsStyle(); // Allow ads
                    
                    // Lazy load trigger: Phanh phui script khi cuộn đến vùng quảng cáo
                    // Chúng ta quan sát body hoặc một thẻ cắm mốc
                    observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            if (showAdSense) {
                                if (isAdSenseBlocked()) {
                                    console.log('AdSense is blocked due to invalid traffic protection');
                                    injectHideAdsStyle();
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
                    injectHideAdsStyle(); // Force hide
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
            window.removeEventListener('blur', blurHandler);
        };
    }, [userProfile]); // Re-check when user changes (e.g. login/logout)

    // Blur listener for AdSense clicks
    const [isMouseOverAd, setIsMouseOverAd] = useState(false);

    useEffect(() => {
        window.addEventListener('blur', blurHandler);
        return () => {
            window.removeEventListener('blur', blurHandler);
        };
    }, [isMouseOverAd]);

    const blurHandler = () => {
        if (isMouseOverAd) {
            incrementAdSenseClick();
            if (isAdSenseBlocked()) {
                injectHideAdsStyle();
            }
        }
    };

    // Global mouse tracker for AdSense (since it's an iframe)
    useEffect(() => {
        const mouseMoveHandler = (e: MouseEvent) => {
            // Find if mouse is over an element with class adsbygoogle or ins
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

    // NUCLEAR OPTION: CSS Hiding/Blocking
    // Thay vì ẩn hoàn toàn (làm mất doanh thu hiển thị - Impression),
    // chúng ta chỉ khóa khả năng click chuột (pointer-events: none).
    // Quảng cáo vẫn hiện rành rành trên màn hình, vẫn được Google tính Viewability, nhưng không thể click được nữa.
    const injectHideAdsStyle = () => {
        if (document.getElementById('adsense-blocker-style')) return;

        const style = document.createElement('style');
        style.id = 'adsense-blocker-style';
        style.innerHTML = `
            .adsbygoogle, .google-auto-placed, ins.adsbygoogle {
                /* Khóa click hoàn toàn, mọi click chuột / cảm ứng sẽ xuyên qua quảng cáo */
                pointer-events: none !important;
                /* Không ẩn, không giảm opacity để đảm bảo ActiveView của Google vẫn tính 100% Viewable */
            }
        `;
        document.head.appendChild(style);
    };

    const removeHideAdsStyle = () => {
        const style = document.getElementById('adsense-blocker-style');
        if (style) {
            style.remove();
        }
    };

    return null; // This component handles logic only, no UI
};

export default AdSenseLoader;
