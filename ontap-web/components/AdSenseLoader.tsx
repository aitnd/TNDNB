import React, { useEffect, useState } from 'react';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getUserRoleConfig } from '../services/usageService';

interface AdSenseLoaderProps {
    userProfile: any | null;
}

const AdSenseLoader: React.FC<AdSenseLoaderProps> = ({ userProfile }) => {
    const [shouldLoadAds, setShouldLoadAds] = useState(false);

    useEffect(() => {
        let observer: IntersectionObserver | null = null;

        const checkConfig = async () => {
            try {
                const config: UsageConfig = await getUsageConfig();
                const { param } = getUserRoleConfig(config, userProfile);

                const showAdSense = param.showAdSense || false;
                const showAdsterra = param.showAdsterra || false;

                if (showAdSense || showAdsterra) {
                    removeHideAdsStyle(); // Allow ads
                    
                    // Lazy load trigger: Phanh phui script khi cuộn đến vùng quảng cáo
                    // Chúng ta quan sát body hoặc một thẻ cắm mốc
                    observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            if (showAdSense) loadAdSenseScript();
                            if (showAdsterra) loadAdsterraScript();
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
            } catch (error) {
                console.error("Error checking AdSense config:", error);
            }
        };

        checkConfig();

        return () => {
            observer?.disconnect();
        };
    }, [userProfile]); // Re-check when user changes (e.g. login/logout)

    const loadAdSenseScript = () => {
        if (document.getElementById('adsense-script')) return;
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6121118706628509';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        console.log("🟢 Google AdSense Script Loaded");
    };

    const loadAdsterraScript = () => {
        if (document.getElementById('adsterra-script')) return;
        const script = document.createElement('script');
        script.id = 'adsterra-script';
        script.async = true;
        script.src = 'https://pl28592472.effectivegatecpm.com/40/38/4c/40384cc1f853bc02181ba010564ff378.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        console.log("🟢 Adsterra Script Loaded");
    };

    const removeScripts = () => {
        ['adsense-script', 'adsterra-script'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
        console.log("🔴 All Ad Scripts Removed");
    };

    // NUCLEAR OPTION: CSS Hiding
    // Because removing the script doesn't remove iframes/DOM elements already created.
    const injectHideAdsStyle = () => {
        if (document.getElementById('adsense-blocker-style')) return;

        const style = document.createElement('style');
        style.id = 'adsense-blocker-style';
        style.innerHTML = `
            .adsbygoogle, .google-auto-placed, ins.adsbygoogle, 
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
        console.log("🛡️ AdSense Blocker Style Injected");
    };

    const removeHideAdsStyle = () => {
        const style = document.getElementById('adsense-blocker-style');
        if (style) {
            style.remove();
            console.log("🔓 AdSense Blocker Style Removed");
        }
    };

    return null; // This component handles logic only, no UI
};

export default AdSenseLoader;
