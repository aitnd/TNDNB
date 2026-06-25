import React, { useEffect, useState } from 'react';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getUserRoleConfig } from '../services/usageService';

interface AdSenseLoaderProps {
    userProfile: any | null;
}

const AdSenseLoader: React.FC<AdSenseLoaderProps> = ({ userProfile }) => {
    const [shouldLoadAds, setShouldLoadAds] = useState(false);

    useEffect(() => {
        // Skip AdSense in Electron
        if (window.electron) {
            setShouldLoadAds(false);
            injectHideAdsStyle();
            return;
        }

        const checkConfig = async () => {
            try {
                const config: UsageConfig = await getUsageConfig();
                const { param } = getUserRoleConfig(config, userProfile);

                const showAdSense = param.showAdSense || false;
                const showAdsterra = param.showAdsterra || false;
                const showMonetag = param.showMonetag || false;

                if (showAdSense || showAdsterra || showMonetag) {
                    setShouldLoadAds(true);
                    if (showAdSense) loadAdSenseScript();
                    if (showAdsterra) loadAdsterraScript();
                    if (showMonetag) loadMonetagScript();
                    removeHideAdsStyle(); // Allow ads to show
                } else {
                    setShouldLoadAds(false);
                    removeScripts();
                    injectHideAdsStyle(); // Force hide any existing ads
                }
            } catch (error) {
                console.error("Error checking AdSense config:", error);
            }
        };

        checkConfig();
    }, [userProfile]); // Re-check when user changes (e.g. login/logout)

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

    const loadMonetagScript = () => {
        if (document.getElementById('monetag-script')) return;
        const script = document.createElement('script');
        script.id = 'monetag-script';
        script.async = true;
        script.src = 'https://3nbf4.com/act/files/micro.tag.min.js?z=11198611';
        script.setAttribute('data-z', '11198611');
        script.defer = true;
        document.body.appendChild(script);
    };

    const removeScripts = () => {
        ['adsense-script', 'adsterra-script', 'monetag-script'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
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
