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
    preventCopy?: boolean; // 🔒 Bật/Tắt chặn bôi đen và Ctrl + C khi thi

    // 🏫 Phân quyền Lớp học (Course Management)
    courseCreateDelete?: 'all' | 'managed' | 'none'; // Tạo / Xóa lớp học mới
    courseEdit?: 'all' | 'managed' | 'none';         // Sửa thông tin cơ bản lớp học
    courseAssignMembers?: boolean;                    // Gán/Xóa Giáo viên & Học viên vào lớp
    courseViewList?: 'all' | 'managed' | 'none';      // Xem danh sách lớp học
    courseDisableAccounts?: 'all' | 'managed' | 'none'; // Vô hiệu hóa tài khoản học viên lớp
    courseFinish?: 'all' | 'managed' | 'none';          // Kết thúc / Mở lại lớp học

    // 👤 Phân quyền Quản lý Tài khoản (User Management)
    userViewEditOthers?: boolean;                     // Xem & Sửa thông tin chi tiết tài khoản khác
    userChangeRoleOthers?: boolean;                   // Thay đổi vai trò (role) của tài khoản khác
    userDeleteOthers?: boolean;                       // Xóa vĩnh viễn tài khoản người khác
    userForceLogoutOthers?: boolean;                  // Đăng xuất từ xa tài khoản khác

    // 📰 Phân quyền Tin tức / Bài viết (News Management)
    newsCreateEdit?: 'all' | 'own' | 'none';          // Đăng / Sửa bài viết
    newsDeleteOthers?: boolean;                       // Xóa bài viết của người khác
}

export interface UsageConfig {
    guest: RoleConfig;
    free_user: RoleConfig;
    verified_user: RoleConfig;
    vip_user: RoleConfig;
    teacher: RoleConfig; // giao_vien
    manager: RoleConfig; // quan_ly, lanh_dao
    admin: RoleConfig;   // admin
    app_links?: {        // Added for App Download Links
        version?: string;
        windows?: string;
        android?: string;
        ios?: string;
    };
}

// Cấu hình GitHub cho Release Manager
export interface GitHubConfig {
    token?: string;  // Personal Access Token (mã hóa)
    owner?: string;  // Mặc định: aitnd
    repo?: string;   // Mặc định: TNDNB
}

const DEFAULT_CONFIG: UsageConfig = {
    guest: {
        limit: 5,
        period: 'daily',
        isEnabled: true,
        showAds: true,
        message: 'Bạn đã sử dụng hết {limit} lượt làm thử miễn phí trong ngày. Vui lòng đăng nhập để tiếp tục ôn tập! Mọi chi tiết liên hệ phòng Đào tạo-Công ty CP Tư vấn và Giáo dục Ninh Bình. SĐT: 022 96 282 969',
        preventCopy: true,
        courseCreateDelete: 'none',
        courseEdit: 'none',
        courseAssignMembers: false,
        courseViewList: 'none',
        courseDisableAccounts: 'none',
        courseFinish: 'none',
        userViewEditOthers: false,
        userChangeRoleOthers: false,
        userDeleteOthers: false,
        userForceLogoutOthers: false,
        newsCreateEdit: 'none',
        newsDeleteOthers: false
    },
    free_user: {
        limit: 10,
        period: 'daily',
        isEnabled: true,
        showAds: true,
        message: 'Bạn đã hết {limit} lượt làm bài miễn phí hôm nay. Hãy đăng ký lớp học để mở khóa toàn bộ tính năng và ôn tập không giới hạn. Mọi chi tiết liên hệ phòng Đào tạo-Công ty CP Tư vấn và Giáo dục Ninh Bình. SĐT: 022 96 282 969',
        preventCopy: true,
        courseCreateDelete: 'none',
        courseEdit: 'none',
        courseAssignMembers: false,
        courseViewList: 'none',
        courseDisableAccounts: 'none',
        courseFinish: 'none',
        userViewEditOthers: false,
        userChangeRoleOthers: false,
        userDeleteOthers: false,
        userForceLogoutOthers: false,
        newsCreateEdit: 'none',
        newsDeleteOthers: false
    },
    verified_user: {
        limit: 50,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Tài khoản lớp của bạn đã đạt giới hạn {limit} lượt truy cập. Vui lòng liên hệ giáo viên hoặc admin để được hỗ trợ.',
        preventCopy: true,
        courseCreateDelete: 'none',
        courseEdit: 'none',
        courseAssignMembers: false,
        courseViewList: 'managed',
        courseDisableAccounts: 'none',
        courseFinish: 'none',
        userViewEditOthers: false,
        userChangeRoleOthers: false,
        userDeleteOthers: false,
        userForceLogoutOthers: false,
        newsCreateEdit: 'none',
        newsDeleteOthers: false
    },
    vip_user: {
        limit: 100,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Tài khoản VIP của bạn đã hết {limit} lượt sử dụng. Vui lòng gia hạn hoặc liên hệ hỗ trợ.',
        preventCopy: true,
        courseCreateDelete: 'none',
        courseEdit: 'none',
        courseAssignMembers: false,
        courseViewList: 'managed',
        courseDisableAccounts: 'none',
        courseFinish: 'none',
        userViewEditOthers: false,
        userChangeRoleOthers: false,
        userDeleteOthers: false,
        userForceLogoutOthers: false,
        newsCreateEdit: 'none',
        newsDeleteOthers: false
    },
    teacher: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn giáo viên.',
        preventCopy: false,
        courseCreateDelete: 'none',
        courseEdit: 'managed',
        courseAssignMembers: true,
        courseViewList: 'managed',
        courseDisableAccounts: 'managed',
        courseFinish: 'managed',
        userViewEditOthers: true,
        userChangeRoleOthers: false,
        userDeleteOthers: false,
        userForceLogoutOthers: false,
        newsCreateEdit: 'own',
        newsDeleteOthers: false
    },
    manager: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn cán bộ quản lý.',
        preventCopy: false,
        courseCreateDelete: 'all',
        courseEdit: 'all',
        courseAssignMembers: true,
        courseViewList: 'all',
        courseDisableAccounts: 'all',
        courseFinish: 'all',
        userViewEditOthers: true,
        userChangeRoleOthers: true,
        userDeleteOthers: true,
        userForceLogoutOthers: true,
        newsCreateEdit: 'all',
        newsDeleteOthers: true
    },
    admin: {
        limit: 9999,
        period: 'daily',
        isEnabled: false,
        showAds: false,
        message: 'Giới hạn Admin.',
        preventCopy: false,
        courseCreateDelete: 'all',
        courseEdit: 'all',
        courseAssignMembers: true,
        courseViewList: 'all',
        courseDisableAccounts: 'all',
        courseFinish: 'all',
        userViewEditOthers: true,
        userChangeRoleOthers: true,
        userDeleteOthers: true,
        userForceLogoutOthers: true,
        newsCreateEdit: 'all',
        newsDeleteOthers: true
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
                app_links: data.app_links || DEFAULT_CONFIG.app_links // Include app_links
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

// 3. Get GitHub Config
export const getGitHubConfig = async (): Promise<GitHubConfig> => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, 'github_config');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return snapshot.data() as GitHubConfig;
        }
        return { owner: 'aitnd', repo: 'TNDNB' };
    } catch (error) {
        console.error('Error fetching GitHub config:', error);
        return { owner: 'aitnd', repo: 'TNDNB' };
    }
};

// 4. Save GitHub Config
export const saveGitHubConfig = async (config: GitHubConfig): Promise<void> => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, 'github_config');
        await setDoc(docRef, config);
    } catch (error) {
        console.error('Error saving GitHub config:', error);
        throw error;
    }
};
