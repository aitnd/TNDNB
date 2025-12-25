import Dexie, { Table } from 'dexie';
import { UserProfile, License, Subject, Quiz } from '../types';

export interface OfflineUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    hashedPassword?: string; // Để đăng nhập offline
    lastSynced: number;
    updatedAt?: number; // Thời gian cập nhật dữ liệu (từ server hoặc local)
}

export interface OfflineResult {
    id?: number;
    userId: string;
    licenseId: string;
    licenseName: string;
    subjectName: string | null;
    examType: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    createdAt: number;
    isSynced: number; // 0: No, 1: Yes
}

export class OnTapDatabase extends Dexie {
    users!: Table<OfflineUser>;
    licenses!: Table<License>;
    results!: Table<OfflineResult>;
    config!: Table<{ key: string; value: any }>;

    constructor() {
        super('OnTapDB');
        this.version(1).stores({
            users: 'id, email',
            licenses: 'id',
            results: '++id, userId, isSynced, createdAt',
            config: 'key'
        });
    }
}

export const db_offline = new OnTapDatabase();

// --- Offline Service Functions ---

export const saveUserOffline = async (user: UserProfile, password?: string, loginEmail?: string) => {
    const offlineUser: OfflineUser = {
        id: user.id,
        full_name: user.full_name,
        email: loginEmail || user.email || '',
        role: user.role,
        lastSynced: Date.now(),
        updatedAt: user.updatedAt || Date.now()
    };
    if (password) {
        // Trong thực tế nên dùng hash, ở đây tạm thời lưu để demo logic
        offlineUser.hashedPassword = btoa(password);
    }
    await db_offline.users.put(offlineUser);
};

export const getOfflineUser = async (email: string) => {
    return await db_offline.users.where('email').equals(email).first();
};

export const saveLicensesOffline = async (licenses: License[]) => {
    await db_offline.licenses.bulkPut(licenses);
};

export const getLicensesOffline = async () => {
    return await db_offline.licenses.toArray();
};

export const saveResultOffline = async (result: Omit<OfflineResult, 'id' | 'isSynced'>) => {
    await db_offline.results.add({
        ...result,
        isSynced: 0
    });
};

export const getUnsyncedResults = async () => {
    return await db_offline.results.where('isSynced').equals(0).toArray();
};

export const markResultAsSynced = async (id: number) => {
    await db_offline.results.update(id, { isSynced: 1 });
};
