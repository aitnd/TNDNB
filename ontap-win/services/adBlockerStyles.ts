/**
 * 🛡️ AdSense Selective Block CSS — Shared Styles for Windows App
 * 
 * Chiến lược 2 tầng:
 *   Tầng 1: Chặn click TẤT CẢ quảng cáo AdSense (pointer-events: none)
 *   Tầng 2: Mở khóa lại cho Overlay ads (Anchor neo đầu/cuối, Vignette toàn màn hình)
 *            để user bấm Close/Ẩn bình thường.
 */

// CSS chặn click chọn lọc — dùng khi user đạt giới hạn click
export const ADSENSE_SELECTIVE_BLOCK_CSS = `
    /* === TẦNG 1: Chặn click tất cả AdSense mặc định === */
    .adsbygoogle, ins.adsbygoogle {
        pointer-events: none !important;
    }

    /* === TẦNG 2: Mở khóa Overlay ads (position: fixed) === */

    /* Anchor Ad: container fixed ở đầu/cuối màn hình */
    div[style*="position: fixed"] > .adsbygoogle,
    div[style*="position: fixed"] > ins.adsbygoogle,
    div[style*="position: fixed"] .adsbygoogle,
    div[style*="position:fixed"] > .adsbygoogle,
    div[style*="position:fixed"] > ins.adsbygoogle,
    div[style*="position:fixed"] .adsbygoogle {
        pointer-events: auto !important;
    }

    /* Vignette Ad: Google tạo div#google-vignette toàn màn hình */
    #google-vignette, #google-vignette * {
        pointer-events: auto !important;
    }

    /* Google auto-placed ads nằm trong container fixed (Anchor) */
    div[style*="position: fixed"] > .google-auto-placed,
    div[style*="position: fixed"] > .google-auto-placed *,
    div[style*="position:fixed"] > .google-auto-placed,
    div[style*="position:fixed"] > .google-auto-placed * {
        pointer-events: auto !important;
    }

    /* Tất cả iframe Google trong container fixed — đảm bảo nút Close/Hide hoạt động */
    div[style*="position: fixed"] iframe,
    div[style*="position:fixed"] iframe {
        pointer-events: auto !important;
    }
`;

// CSS ẩn hoàn toàn tất cả AdSense — dùng khi admin TẮT quảng cáo (không phải block click)
export const ADSENSE_HIDE_ALL_CSS = `
    .adsbygoogle, ins.adsbygoogle, .google-auto-placed {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
    }
`;
