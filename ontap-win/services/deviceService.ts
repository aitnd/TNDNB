import { Capacitor } from '@capacitor/core';

export interface DeviceInfo {
    deviceName: string;
    browser: string;
    ip: string;
    location: string; // 💖 Thêm field địa chỉ (MỚI)
    userAgent: string;
    platform: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
    let ip = 'Không xác định';
    let location = 'Không xác định'; // 💖 Địa chỉ từ IP (MỚI)

    try {
        // 💖 Sử dụng ipinfo.io để lấy cả IP và địa chỉ (miễn phí, HTTPS)
        const response = await fetch('https://ipinfo.io/json');
        const data = await response.json();

        if (data.ip) {
            ip = data.ip;
            // Ghép địa chỉ: Thành phố, Vùng, Quốc gia
            const parts = [data.city, data.region, data.country].filter(Boolean);
            location = parts.join(', ') || 'Không xác định';
        } else {
            // Fallback về ipify nếu ipinfo thất bại
            const fallbackResponse = await fetch('https://api.ipify.org?format=json');
            const fallbackData = await fallbackResponse.json();
            ip = fallbackData.ip;
            location = 'Không xác định';
        }

    } catch (error) {
        console.error('Lỗi khi lấy thông tin IP:', error);
        // Thử fallback
        try {
            const fallbackResponse = await fetch('https://api.ipify.org?format=json');
            const fallbackData = await fallbackResponse.json();
            ip = fallbackData.ip;
        } catch {
            ip = 'Không xác định';
        }
    }

    const ua = navigator.userAgent;
    let browser = 'Không xác định';
    let deviceName = 'Thiết bị lạ';
    const platform = Capacitor.getPlatform();

    // Phân tích trình duyệt
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('Trident')) browser = 'Internet Explorer';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    // Phân tích thiết bị/Hệ điều hành
    if (ua.includes('Windows')) deviceName = 'Windows PC';
    else if (ua.includes('Macintosh')) deviceName = 'MacBook/iMac';
    else if (ua.includes('Android')) deviceName = 'Android Device';
    else if (ua.includes('iPhone')) deviceName = 'iPhone';
    else if (ua.includes('iPad')) deviceName = 'iPad';
    else if (ua.includes('Linux')) deviceName = 'Linux PC';

    // Nếu là Electron (Windows App)
    // @ts-ignore
    if (window.electron?.isElectron) {
        deviceName = 'Windows App (TND)';
        browser = 'Electron';
    }

    return {
        deviceName,
        browser,
        ip,
        location, // 💖 Trả về địa chỉ (MỚI)
        userAgent: ua,
        platform
    };
};
