import React, { useCallback } from 'react';
import { MONETAG_CONFIG, getMonetagLimits } from '../services/monetagConfig';

interface MonetagDirectLinkProps {
    children: React.ReactNode;
    onOriginalAction: () => void;
    enabled: boolean;
    directLinkUrl: string;  // URL động từ Firebase config
    className?: string;
}

/**
 * 🔗 MonetagDirectLink — Wrapper component
 * Bọc bất kỳ nút nào để mở Monetag Direct Link trước khi thực hiện hành động gốc.
 * 
 * Cơ chế:
 * 1. User click nút → mở Direct Link ở tab mới
 * 2. Sau 300ms → gọi hành động gốc (navigate, submit, etc.)
 * 3. Giới hạn 1 lần / 30 phút (lưu timestamp vào sessionStorage)
 * 4. Tự disable trên Electron (Windows App)
 */
const MonetagDirectLink: React.FC<MonetagDirectLinkProps> = ({
    children,
    onOriginalAction,
    enabled,
    directLinkUrl,
    className,
}) => {
    const handleClick = useCallback(() => {
        // Bỏ qua trên Electron
        if ((window as any).electron) {
            onOriginalAction();
            return;
        }

        // Kiểm tra xem tính năng có bật không hoặc URL rỗng
        if (!enabled || !directLinkUrl) {
            onOriginalAction();
            return;
        }

        // Kiểm tra cooldown (30 phút)
        const lastTrigger = sessionStorage.getItem(MONETAG_CONFIG.SESSION_KEYS.DIRECT_LINK_LAST);
        const now = Date.now();
        const limits = getMonetagLimits();
        if (lastTrigger && now - parseInt(lastTrigger, 10) < limits.directLinkCooldownMs) {
            // Chưa hết cooldown → chạy hành động gốc luôn
            onOriginalAction();
            return;
        }

        // Mở Direct Link ở tab mới
        try {
            window.open(directLinkUrl, '_blank');
            sessionStorage.setItem(MONETAG_CONFIG.SESSION_KEYS.DIRECT_LINK_LAST, now.toString());
        } catch {
            // Nếu popup bị chặn → bỏ qua, chạy hành động gốc
        }

        // Delay nhẹ rồi chạy hành động gốc
        setTimeout(() => {
            onOriginalAction();
        }, 300);
    }, [enabled, directLinkUrl, onOriginalAction]);

    return (
        <div onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
            {children}
        </div>
    );
};

export default MonetagDirectLink;
