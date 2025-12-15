import Swal from 'sweetalert2';
import { getUsageConfig, UsageConfig, RoleConfig } from './adminConfigService';

interface UsageData {
    date: string;
    count: number;
}

// Cache local
let cachedConfig: UsageConfig | null = null;

const getConfig = async (): Promise<UsageConfig> => {
    if (cachedConfig) return cachedConfig;
    cachedConfig = await getUsageConfig();
    return cachedConfig;
};

// --- HELPER: Determine User Role Config ---
const getUserRoleConfig = (config: UsageConfig, userProfile: any | null): { param: RoleConfig, type: 'guest' | 'free' | 'verified' | 'vip' | 'teacher' | 'manager' | 'admin' } => {
    if (!userProfile) return { param: config.guest, type: 'guest' };

    const role = userProfile.role;

    // Admin
    if (role === 'admin') {
        return { param: config.admin, type: 'admin' };
    }

    // Manager (Quan Ly, Lanh Dao)
    if (['lanh_dao', 'quan_ly'].includes(role)) {
        return { param: config.manager, type: 'manager' };
    }

    // Teacher
    if (role === 'giao_vien') {
        return { param: config.teacher, type: 'teacher' };
    }

    // VIP (Placeholder condition)
    if (userProfile.isVip) {
        return { param: config.vip_user, type: 'vip' };
    }

    // Verified (Class member)
    if (userProfile.class && userProfile.class.length > 0 || userProfile.isVerified) {
        return { param: config.verified_user, type: 'verified' };
    }

    // Free User (Logged in but no class)
    return { param: config.free_user, type: 'free' };
};

// --- HELPER: Get Date/Week Key ---
const getPeriodKey = (period: 'daily' | 'weekly') => {
    const d = new Date();
    if (period === 'daily') {
        return d.toLocaleDateString('vi-VN'); // Reset at 00:00
    } else {
        // Weekly: Reset Monday 00:00
        // Get Monday of current week
        const day = d.getDay() || 7; // Sun=0 -> 7, Mon=1...Sat=6
        if (day !== 1) d.setHours(-24 * (day - 1));
        else d.setHours(0, 0, 0, 0); // Is Monday
        // Format: W-YYYY-MM-DD (Date of Monday)
        return `W-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
};

export const checkUsage = async (userProfile: any | null): Promise<'ALLOWED' | 'BLOCKED'> => {
    const config = await getConfig();
    const { param } = getUserRoleConfig(config, userProfile);

    // 0. If disabled for this role -> Allow
    if (!param.isEnabled) return 'ALLOWED';

    // 1. Get Storage Key
    const baseKey = userProfile ? `usage_user_${userProfile.id}` : 'usage_guest';
    const storageKey = `${baseKey}_${param.period}`; // e.g. usage_guest_daily

    // 2. Get Period Key (Today or This Week)
    const currentPeriodKey = getPeriodKey(param.period);

    let data: UsageData = { date: currentPeriodKey, count: 0 };
    const stored = localStorage.getItem(storageKey);

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.date === currentPeriodKey) {
                data = parsed;
            }
        } catch (e) {
            console.error('Error parsing usage data', e);
        }
    }

    console.log(`[Usage Check] ${storageKey} - Used: ${data.count}/${param.limit}`);

    if (data.count >= param.limit) {
        return 'BLOCKED';
    }

    return 'ALLOWED';
};

export const incrementUsage = async (userProfile: any | null) => {
    const config = await getConfig();
    const { param } = getUserRoleConfig(config, userProfile);

    if (!param.isEnabled) return;

    const baseKey = userProfile ? `usage_user_${userProfile.id}` : 'usage_guest';
    const storageKey = `${baseKey}_${param.period}`;
    const currentPeriodKey = getPeriodKey(param.period);

    let data: UsageData = { date: currentPeriodKey, count: 0 };
    const stored = localStorage.getItem(storageKey);

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed.date === currentPeriodKey) {
                data = parsed;
            }
        } catch (e) { }
    }

    data.count++;
    console.log(`[Usage] Incremented usage for ${storageKey}: ${data.count}`);
    localStorage.setItem(storageKey, JSON.stringify(data));
};

export const showLimitAlert = async (userProfile: any | null, onLogin: () => void) => {
    const config = await getConfig();
    const { param, type } = getUserRoleConfig(config, userProfile);

    const message = param.message.replace('{limit}', param.limit.toString());
    const isGuest = type === 'guest';

    Swal.fire({
        title: 'Hết lượt làm bài!',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: isGuest ? 'Đăng nhập ngay' : 'Liên hệ thầy',
        cancelButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            if (isGuest) {
                onLogin();
            } else {
                // Open Zalo
                window.open('https://zalo.me/02296282969', '_blank');
            }
        }
    });
};
