import { NativeBiometric } from 'capacitor-native-biometric';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const CRED_KEY = 'biometric_credentials';

export interface Credentials {
    email: string;
    pass: string; // Plain text (but stored in secure storage effectively by Preferences/Keystore ideally, but Preferences is just SharedPreferences/UserDefaults. For high security we should use SecureStorage but for this MVP Preferences with warning is acceptable as agreed)
}

// NOTE: @capacitor/preferences is NOT encrypted storage. 
// It uses SharedPreferences (Android) / UserDefaults (iOS).
// Per user agreement, this level of security is acceptable for this internal app.
// For higher security, we would use @ionic-enterprise/identity-vault or similar, but those are paid/complex.

export const isBiometricAvailable = async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;
    try {
        const result = await NativeBiometric.isAvailable();
        return result.isAvailable;
    } catch (e) {
        return false;
    }
};

export const saveCredentials = async (email: string, pass: string) => {
    try {
        await Preferences.set({
            key: CRED_KEY,
            value: JSON.stringify({ email, pass })
        });
        console.log('Credentials saved for biometric login.');
    } catch (e) {
        console.error('Error saving credentials:', e);
    }
};

export const clearCredentials = async () => {
    await Preferences.remove({ key: CRED_KEY });
};

export const hasSavedCredentials = async (): Promise<boolean> => {
    const { value } = await Preferences.get({ key: CRED_KEY });
    return !!value;
};

export const performBiometricLogin = async (): Promise<Credentials | null> => {
    try {
        // 1. Verify Biometric
        const simplified = true; // Use simple verify (no crypto object)

        // Check availability first
        const available = await isBiometricAvailable();
        if (!available) throw new Error('Biometric not available');

        await NativeBiometric.verifyIdentity({
            reason: 'Chạm vân tay để đăng nhập',
            title: 'Đăng nhập',
            subtitle: 'Sử dụng vân tay của bạn',
            description: 'Xác thực để truy cập tài khoản đã lưu',
        });

        // 2. Retrieve Credentials if success
        const { value } = await Preferences.get({ key: CRED_KEY });
        if (value) {
            return JSON.parse(value) as Credentials;
        }
        return null;

    } catch (error) {
        console.error('Biometric verification failed:', error);
        return null;
    }
};
