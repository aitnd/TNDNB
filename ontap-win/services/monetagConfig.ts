// 💰 Monetag Configuration — Single Source of Truth
// Tập trung tất cả config Monetag vào 1 file thay vì hardcode ở nhiều nơi

export const MONETAG_CONFIG = {
    // Zone & Domain
    ZONE_ID: 11198611,
    DOMAIN: '3nbf4.com',

    // Script URLs
    SMART_TAG_URL: 'https://3nbf4.com/act/files/micro.tag.min.js?z=11198611',

    // Fallback Direct Link URL (dùng khi chưa cấu hình trong Firebase)
    DEFAULT_DIRECT_LINK_URL: 'https://3nbf4.com/4/11198611',

    // Service Worker
    SW_URL: '/sw.js',

    // Giới hạn tần suất mặc định
    POPUNDER_COOLDOWN_MS: 30 * 60 * 1000, // 30 phút
    DIRECT_LINK_COOLDOWN_MS: 30 * 60 * 1000, // 30 phút

    // Session keys (sessionStorage / localStorage)
    SESSION_KEYS: {
        POPUNDER_FIRED: 'monetag_pop_fired',
        DIRECT_LINK_LAST: 'monetag_dl_last',
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
