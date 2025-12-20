import React, { useEffect, useState } from 'react';
import { getUsageConfig, UsageConfig } from '../services/adminConfigService';
import { getUserRoleConfig } from '../services/usageService';

interface AdSenseLoaderProps {
    userProfile: any | null;
}

const AdSenseLoader: React.FC<AdSenseLoaderProps> = ({ userProfile }) => {
    const [shouldLoadAds, setShouldLoadAds] = useState(false);

    useEffect(() => {
        const checkConfig = async () => {
            try {
                const config: UsageConfig = await getUsageConfig();
                const { param } = getUserRoleConfig(config, userProfile);

                if (param.showAds) {
                    setShouldLoadAds(true);
                    loadAdSenseScript();
                    removeHideAdsStyle(); // Allow ads to show
                } else {
                    setShouldLoadAds(false);
                    removeAdSenseScript();
                    injectHideAdsStyle(); // Force hide any existing ads
                }
            } catch (error) {
                console.error("Error checking AdSense config:", error);
            }
        };

        checkConfig();
    }, [userProfile]); // Re-check when user changes (e.g. login/logout)

    const loadAdSenseScript = () => {
        // Check if already exists
        const existingScript = document.getElementById('google-adsense-script');
        if (existingScript) return;

        const script = document.createElement('script');
        script.id = 'google-adsense-script';
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6121118706628509';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        console.log("🟢 Google AdSense Script Loaded (Allowed for this role)");
    };

    const removeAdSenseScript = () => {
        // Note: This won't remove ads already rendered by the script, 
        // but prevents further loading if the user switches context implies a refresh often.
        // For Single Page Apps, fully unloading Adsense is tricky without refresh.
        // But preventing the *initial* load is the main goal.
        const existingScript = document.getElementById('google-adsense-script');
        if (existingScript) {
            existingScript.remove();
            console.log("🔴 Google AdSense Script Removed (Blocked for this role)");
        }
    };

    // NUCLEAR OPTION: CSS Hiding
    // Because removing the script doesn't remove iframes/DOM elements already created.
    const injectHideAdsStyle = () => {
        if (document.getElementById('adsense-blocker-style')) return;

        const style = document.createElement('style');
        style.id = 'adsense-blocker-style';
        style.innerHTML = `
            .adsbygoogle, .google-auto-placed, ins.adsbygoogle {
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
