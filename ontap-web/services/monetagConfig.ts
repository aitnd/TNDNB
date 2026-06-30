// 💰 Monetag Configuration — Single Source of Truth
// Tập trung tất cả config Monetag vào 1 file thay vì hardcode ở nhiều nơi

export const MONETAG_CONFIG = {
    // Zone & Domain
    ZONE_ID: 254797,
    DOMAIN: 'quge5.com',

    // Script URLs
    SMART_TAG_URL: 'https://quge5.com/88/tag.min.js',

    // Fallback Direct Link URL (dùng khi chưa cấu hình trong Firebase)
    DEFAULT_DIRECT_LINK_URL: 'https://quge5.com/4/254797',

    // Service Worker
    SW_URL: '/sw.js',

    // Giới hạn tần suất mặc định
    POPUNDER_COOLDOWN_MS: 30 * 60 * 1000, // 30 phút
    DIRECT_LINK_COOLDOWN_MS: 30 * 60 * 1000, // 30 phút

    // Session keys (sessionStorage / localStorage)
    SESSION_KEYS: {
        POPUNDER_FIRED: 'monetag_pop_fired',
        DIRECT_LINK_LAST: 'monetag_dl_last',
        POPUNDER_COUNT: 'monetag_pop_count',
        DIRECT_LINK_COUNT: 'monetag_dl_count',
        COUNTDOWN_COUNT: 'monetag_cd_count',
    },
} as const;

let currentPopunderCooldownMs = MONETAG_CONFIG.POPUNDER_COOLDOWN_MS;
let currentDirectLinkCooldownMs = MONETAG_CONFIG.DIRECT_LINK_COOLDOWN_MS;

export const setMonetagLimits = (popunderMins: number, directLinkMins: number) => {
    currentPopunderCooldownMs = popunderMins * 60 * 1000;
    currentDirectLinkCooldownMs = directLinkMins * 60 * 1000;
};

export const getMonetagLimits = () => ({
    popunderCooldownMs: currentPopunderCooldownMs,
    directLinkCooldownMs: currentDirectLinkCooldownMs
});

/**
 * Lấy Direct Link URL — ưu tiên URL động từ Firebase, fallback về mặc định
 * @param firebaseUrl - URL từ config.monetagDirectLinkUrl (Firebase)
 */
export const getDirectLinkUrl = (firebaseUrl?: string): string => {
    return firebaseUrl?.trim() || MONETAG_CONFIG.DEFAULT_DIRECT_LINK_URL;
};

// --- Session Count Management ---

export const getSessionCount = (key: string): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(sessionStorage.getItem(key) || '0', 10);
};

export const incrementSessionCount = (key: string): void => {
    if (typeof window === 'undefined') return;
    const current = getSessionCount(key);
    sessionStorage.setItem(key, (current + 1).toString());
};
