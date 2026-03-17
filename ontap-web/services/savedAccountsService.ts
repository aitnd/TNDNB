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
 * Helper để tạo key từ chuỗi key định sẵn (ENCRYPTION_KEY)
 * Sử dụng PBKDF2 để tạo key mạnh từ chuỗi
 */
const getCryptoKey = async (salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(ENCRYPTION_KEY);
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

/**
 * Mã hóa mật khẩu bằng AES-GCM (Web Crypto API)
 * Trả về chuỗi kết hợp: salt (16 bytes) + iv (12 bytes) + encryptedData (Base64)
 */
const encryptPassword = async (password: string): Promise<string> => {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await getCryptoKey(salt);

        const encryptedContent = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        // Kết hợp và convert sang Base64 để lưu trữ
        const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

        return btoa(String.fromCharCode(...combined));
    } catch (e) {
        console.error("Encryption failed:", e);
        return '';
    }
};

/**
 * Giải mã mật khẩu bằng AES-GCM
 */
const decryptPassword = async (encryptedBase64: string): Promise<string> => {
    try {
        const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);
        
        const key = await getCryptoKey(salt);
        const decryptedContent = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        return new TextDecoder().decode(decryptedContent);
    } catch (e) {
        console.error("Decryption failed:", e);
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
export const saveAccount = async (
    email: string,
    displayName: string,
    password?: string,
    photoURL?: string
): Promise<void> => {
    const accounts = getSavedAccounts();

    // Tìm tài khoản đã tồn tại
    const existingIndex = accounts.findIndex(acc => acc.email.toLowerCase() === email.toLowerCase());

    const encryptedPwd = password ? await encryptPassword(password) : undefined;

    const newAccount: SavedAccount = {
        email,
        displayName,
        photoURL,
        hasPassword: !!password,
        encryptedPassword: encryptedPwd,
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
export const getAccountPassword = async (email: string): Promise<string | null> => {
    const accounts = getSavedAccounts();
    const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

    if (account?.hasPassword && account.encryptedPassword) {
        return await decryptPassword(account.encryptedPassword);
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
