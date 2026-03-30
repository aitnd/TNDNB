const crypto = require('crypto').webcrypto;

// Khai báo lại logic để test độc lập trong Node.js (CommonJS)
const ENCRYPTION_KEY = 'tndnb_secret_key_2024_@#$';

const getCryptoKey = async (salt) => {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(ENCRYPTION_KEY);
    const baseKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

const encryptPassword = async (password) => {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await getCryptoKey(salt);

        const encryptedContent = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            data
        );

        const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

        return Buffer.from(combined).toString('base64');
    } catch (e) {
        console.error("Encryption failed:", e);
        return '';
    }
};

const decryptPassword = async (encryptedBase64) => {
    try {
        const combined = new Uint8Array(Buffer.from(encryptedBase64, 'base64'));
        
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);
        
        const key = await getCryptoKey(salt);
        const decryptedContent = await crypto.subtle.decrypt(
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

async function runTest() {
    console.log("🧪 Đang kiểm tra logic AES-GCM (Worker thread)...");
    const secret = "Antigravity_Secret_2026!";
    const encrypted = await encryptPassword(secret);
    console.log("Encrypted:", encrypted);
    
    const decrypted = await decryptPassword(encrypted);
    console.log("Decrypted:", decrypted);
    
    if (secret === decrypted) {
        console.log("✅ SUCCESS: Logic mã hóa hoạt động hoàn hảo!");
    } else {
        console.log("❌ FAILED: Lỗi logic mã hóa.");
        process.exit(1);
    }
}

runTest();
