import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseClient';

export const USAGE_CONFIG_DOC_ID = 'usage_config';
export const SETTINGS_COLLECTION = 'settings';

export interface RoleConfig {
    limit: number;
    period: 'daily' | 'weekly';
    isEnabled: boolean;
    showAds: boolean; // Control Google Adsense
    message: string;
}

export interface UsageConfig {
    guest: RoleConfig;
    free_user: RoleConfig;
    verified_user: RoleConfig;
    vip_user: RoleConfig;
    teacher: RoleConfig; // giao_vien
    manager: RoleConfig; // quan_ly, lanh_dao
    admin: RoleConfig;   // admin
}

const DEFAULT_CONFIG: UsageConfig = {
    guest: {
        limit: 5,
        period: 'daily',
        isEnabled: true,
        showAds: true,
        message: 'Bạn đã sử dụng hết {limit} lượt làm thử miễn phí trong ngày. Vui lòng đăng nhập để tiếp tục ôn tập! Mọi chi tiết liên hệ phòng Đào tạo-Công ty CP Tư vấn và Giáo dục Ninh Bình. SĐT: 022 96 282 969'
    },
    free_user: {
        limit: 10,
        period: 'daily',
        isEnabled: true,
        showAds: true,
        message: 'Bạn đã hết {limit} lượt làm bài miễn phí hôm nay. Hãy đăng ký lớp học để mở khóa toàn bộ tính năng và ôn tập không giới hạn. Mọi chi tiết liên hệ phòng Đào tạo-Công ty CP Tư vấn và Giáo dục Ninh Bình. SĐT: 022 96 282 969'
    },
    verified_user: {
        limit: 50,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Tài khoản lớp của bạn đã đạt giới hạn {limit} lượt truy cập. Vui lòng liên hệ giáo viên hoặc admin để được hỗ trợ.'
    },
    vip_user: {
        limit: 100,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Tài khoản VIP của bạn đã hết {limit} lượt sử dụng. Vui lòng gia hạn hoặc liên hệ hỗ trợ.'
    },
    teacher: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn giáo viên.'
    },
    manager: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn cán bộ quản lý.'
    },
    admin: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn Admin.'
    }
};

// 1. Get Config (with default fallback)
export const getUsageConfig = async (): Promise<UsageConfig> => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            const data = snapshot.data() as Partial<UsageConfig>;
            // DEEP MERGE to ensure new fields in sub-objects are preserved
            return {
                ...DEFAULT_CONFIG,
                guest: { ...DEFAULT_CONFIG.guest, ...(data.guest || {}) },
                free_user: { ...DEFAULT_CONFIG.free_user, ...(data.free_user || {}) },
                verified_user: { ...DEFAULT_CONFIG.verified_user, ...(data.verified_user || {}) },
                vip_user: { ...DEFAULT_CONFIG.vip_user, ...(data.vip_user || {}) },
                teacher: { ...DEFAULT_CONFIG.teacher, ...(data.teacher || {}) },
                manager: { ...DEFAULT_CONFIG.manager, ...(data.manager || {}) },
                admin: { ...DEFAULT_CONFIG.admin, ...(data.admin || {}) },
            };
        } else {
            // Initialize if not exists
            console.log('Initializing default usage config...');
            await setDoc(docRef, DEFAULT_CONFIG);
            return DEFAULT_CONFIG;
        }
    } catch (error) {
        console.error('Error fetching usage config:', error);
        return DEFAULT_CONFIG; // Fail safe
    }
};

// 2. Save Config
export const saveUsageConfig = async (config: UsageConfig): Promise<void> => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, USAGE_CONFIG_DOC_ID);
        await setDoc(docRef, config);
    } catch (error) {
        console.error('Error saving usage config:', error);
        throw error;
    }
};
