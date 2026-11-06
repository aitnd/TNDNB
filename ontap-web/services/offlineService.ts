import Dexie, { Table } from 'dexie';
import type { License } from '../types';

export interface OfflineConfigRow {
  key: string;
  value: unknown;
  updatedAt: number;
}

export class OnTapWebDatabase extends Dexie {
  licenses!: Table<License & { displayOrder?: number }>;
  config!: Table<OfflineConfigRow>;

  constructor() {
    super('OnTapWebDB');
    this.version(1).stores({
      licenses: 'id',
      config: 'key'
    });
  }
}

export const db_offline = new OnTapWebDatabase();

const MEMORY_FALLBACK_KEY = 'ontap_licenses_offline_backup';
const META_STORAGE_KEY = 'ontap_questions_sync_meta';

export const sanitizeLicensesForStorage = (licenses: License[]): License[] => {
  if (!licenses || !Array.isArray(licenses)) return [];
  return licenses.map((lic) => ({
    ...lic,
    subjects: (lic.subjects || []).map((sub) => ({
      ...sub,
      questions: (sub.questions || []).map((q) => {
        let image = q.image;
        if (image) {
          const trimmed = String(image).trim();
          if (trimmed) {
            image = `https://cdn.daotaothuyenvien.com/question-images/${q.id}.png`;
          } else {
            image = null;
          }
        }
        return {
          ...q,
          image
        };
      })
    }))
  }));
};

export const saveLicensesOffline = async (
  licenses: License[],
  meta?: { version?: number; contentHash?: string }
): Promise<void> => {
  const sanitized = sanitizeLicensesForStorage(licenses);
  try {
    await db_offline.licenses.clear();
    await db_offline.licenses.bulkPut(sanitized);
  } catch {
    try {
      localStorage.setItem(MEMORY_FALLBACK_KEY, JSON.stringify(sanitized));
    } catch {
      // Bỏ qua nếu vượt quota localStorage
    }
  }

  if (meta) {
    try {
      localStorage.setItem(
        META_STORAGE_KEY,
        JSON.stringify({
          version: meta.version ?? 1,
          contentHash: meta.contentHash ?? '',
          syncedAt: Date.now()
        })
      );
    } catch {
      // Bỏ qua nếu storage bị lỗi
    }
  }
};

export const getLicensesOffline = async (): Promise<License[]> => {
  try {
    const list = await db_offline.licenses.toArray();
    if (list && list.length > 0) {
      return sanitizeLicensesForStorage(list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    }
  } catch {
    // Fallback xuống localStorage nếu IndexedDB bị chặn trong Private Mode
  }

  try {
    const raw = localStorage.getItem(MEMORY_FALLBACK_KEY);
    if (raw) return sanitizeLicensesForStorage(JSON.parse(raw) as License[]);
  } catch {
    // Bỏ qua
  }
  return [];
};

export const getLocalSyncMeta = (): { version: number; contentHash: string; syncedAt: number } => {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Bỏ qua
  }
  return { version: 0, contentHash: '', syncedAt: 0 };
};
