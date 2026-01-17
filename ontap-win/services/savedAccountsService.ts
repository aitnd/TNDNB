/**
 * Saved Accounts Service
 * Quản lý lưu trữ tài khoản đăng nhập cục bộ (giống Facebook)
 * Mật khẩu được mã hóa trước khi lưu vào localStorage
 */

// Key lưu trữ trong localStorage
const STORAGE_KEY = 'saved_accounts';

// Key mã hóa đơn giản (trong production nên dùng key phức tạp hơn)
const ENCRYPTION_KEY = 'tnd_secure_key_2026';

/**
 * Interface cho tài khoản đã lưu
 */
export interface SavedAccount {
    email: string;           // Email đăng nhập
    displayName: string;     // Tên hiển thị
    photoURL?: string;       // Ảnh đại diện (URL)
    hasPassword: boolean;    // Có lưu mật khẩu không
    encryptedPassword?: string; // Mật khẩu đã mã hóa (base64)
    lastLogin: number;       // Timestamp đăng nhập cuối
}

/**
 * Mã hóa mật khẩu đơn giản bằng XOR + Base64
 * Lưu ý: Đây không phải mã hóa mạnh, chỉ để tránh hiển thị plaintext
 * Trong production nên dùng Web Crypto API hoặc thư viện mã hóa chuyên dụng
 */
const encryptPassword = (password: string): string => {
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
        const charCode = password.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        encrypted += String.fromCharCode(charCode);
    }
    return btoa(encrypted);
};

/**
 * Giải mã mật khẩu
 */
const decryptPassword = (encrypted: string): string => {
    try {
        const decoded = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
            decrypted += String.fromCharCode(charCode);
        }
        return decrypted;
    } catch {
        return '';
    }
};

/**
 * Lấy danh sách tất cả tài khoản đã lưu
 * Sắp xếp theo lastLogin (mới nhất lên đầu)
 */
export const getSavedAccounts = (): SavedAccount[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const accounts: SavedAccount[] = JSON.parse(data);
        // Sắp xếp theo lastLogin giảm dần
        return accounts.sort((a, b) => b.lastLogin - a.lastLogin);
    } catch {
        return [];
    }
};

/**
 * Lưu hoặc cập nhật tài khoản
 * Nếu email đã tồn tại, sẽ cập nhật thông tin
 */
export const saveAccount = (
    email: string,
    displayName: string,
    password?: string,
    photoURL?: string
): void => {
    const accounts = getSavedAccounts();

    // Tìm tài khoản đã tồn tại
    const existingIndex = accounts.findIndex(acc => acc.email.toLowerCase() === email.toLowerCase());

    const newAccount: SavedAccount = {
        email,
        displayName,
        photoURL,
        hasPassword: !!password,
        encryptedPassword: password ? encryptPassword(password) : undefined,
        lastLogin: Date.now()
    };

    if (existingIndex >= 0) {
        // Cập nhật tài khoản cũ
        accounts[existingIndex] = newAccount;
    } else {
        // Thêm mới vào đầu danh sách
        accounts.unshift(newAccount);
    }

    // Giới hạn tối đa 5 tài khoản
    const maxAccounts = 5;
    if (accounts.length > maxAccounts) {
        accounts.splice(maxAccounts);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
};

/**
 * Xóa tài khoản khỏi danh sách đã lưu
 */
export const removeAccount = (email: string): void => {
    const accounts = getSavedAccounts();
    const filtered = accounts.filter(acc => acc.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Lấy mật khẩu đã giải mã của tài khoản
 * Trả về null nếu không có mật khẩu đã lưu
 */
export const getAccountPassword = (email: string): string | null => {
    const accounts = getSavedAccounts();
    const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

    if (account?.hasPassword && account.encryptedPassword) {
        return decryptPassword(account.encryptedPassword);
    }

    return null;
};

/**
 * Cập nhật thời gian đăng nhập cuối của tài khoản
 */
export const updateLastLogin = (email: string): void => {
    const accounts = getSavedAccounts();
    const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

    if (account) {
        account.lastLogin = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
};

/**
 * Kiểm tra có tài khoản nào đã lưu không
 */
export const hasSavedAccounts = (): boolean => {
    return getSavedAccounts().length > 0;
};

/**
 * Xóa tất cả tài khoản đã lưu
 */
export const clearAllAccounts = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
