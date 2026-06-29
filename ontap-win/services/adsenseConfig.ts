// Chống Lượt Truy Cập Không Hợp Lệ (Invalid Traffic) Cho Google AdSense
export const ADSENSE_CONFIG = {
    MAX_CLICKS_PER_DAY: 2,
    COOLDOWN_MS: 24 * 60 * 60 * 1000, // 24 giờ
    STORAGE_KEY: 'adsense_click_tracker',
};

let currentMaxClicks = ADSENSE_CONFIG.MAX_CLICKS_PER_DAY;
let currentCooldownMs = ADSENSE_CONFIG.COOLDOWN_MS;

export const setAdSenseLimits = (maxClicks: number, cooldownMinutes: number) => {
    currentMaxClicks = maxClicks;
    currentCooldownMs = cooldownMinutes * 60 * 1000;
};

interface AdSenseClickData {
    clicks: number;
    firstClickTime: number;
}

export const incrementAdSenseClick = (): void => {
    try {
        const now = Date.now();
        const stored = localStorage.getItem(ADSENSE_CONFIG.STORAGE_KEY);
        let data: AdSenseClickData = { clicks: 0, firstClickTime: now };

        if (stored) {
            const parsed = JSON.parse(stored) as AdSenseClickData;
            // Nếu đã qua thời gian cooldown, reset lại bộ đếm
            if (now - parsed.firstClickTime > currentCooldownMs) {
                data = { clicks: 1, firstClickTime: now };
            } else {
                data = { clicks: parsed.clicks + 1, firstClickTime: parsed.firstClickTime };
            }
        } else {
            data.clicks = 1;
        }

        localStorage.setItem(ADSENSE_CONFIG.STORAGE_KEY, JSON.stringify(data));
        console.log(`AdSense click tracked. Total: ${data.clicks}`);
    } catch (error) {
        console.error("Error updating AdSense click tracker", error);
    }
};

export const isAdSenseBlocked = (): boolean => {
    try {
        const stored = localStorage.getItem(ADSENSE_CONFIG.STORAGE_KEY);
        if (!stored) return false;

        const parsed = JSON.parse(stored) as AdSenseClickData;
        const now = Date.now();

        // Đã qua thời gian cooldown -> Hết block
        if (now - parsed.firstClickTime > currentCooldownMs) {
            return false;
        }

        return parsed.clicks >= currentMaxClicks;
    } catch {
        return false;
    }
};
