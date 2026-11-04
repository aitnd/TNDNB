import { fetchMetaVersion, fetchQuestionsSnapshot } from './d1Client';
import type { License } from '../types';
import { getLicensesOffline, saveLicensesOffline } from './offlineService';

// Helper function for natural sorting of questions (e.g., q2 before q10)
export const naturalSortQuestions = (a: { id: string }, b: { id: string }): number => {
  const getNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNum(a.id) - getNum(b.id);
};

// This function fetches all data and transforms it into the nested structure the app uses.
// GHI CHÚ: Bản Offline (ontap-win) ưu tiên dùng IndexedDB (nếu đã đồng bộ), fallback sang D1 hoặc file JSON tĩnh.
export const fetchLicenses = async (): Promise<License[]> => {
  // 1. Cố gắng đọc từ IndexedDB trước (dữ liệu mới nhất đã sync)
  const localLicenses = await getLicensesOffline();
  if (localLicenses && localLicenses.length > 0) {
    return localLicenses;
  }

  // 2. Nếu có mạng, tải Snapshot từ D1
  try {
    const snapshot = await fetchQuestionsSnapshot();
    if (snapshot && snapshot.licenses && snapshot.licenses.length > 0) {
      await saveLicensesOffline(snapshot.licenses);
      return snapshot.licenses;
    }
  } catch (err) {
    console.warn('[D1 fetchLicenses] Fallback to local questions_db.json:', err);
  }

  // 3. Nếu IndexedDB chưa có gì và không có mạng, đọc từ file JSON tĩnh làm dữ liệu khởi tạo
  const data = (await import('../data/questions_db.json')).default;
  const initialLicenses = data as any as License[];
  
  // Lưu vào IndexedDB cho lần sau
  await saveLicensesOffline(initialLicenses);

  return initialLicenses;
};

export const shouldUpdateQuestions = async (): Promise<boolean> => {
  try {
    const remoteMeta = await fetchMetaVersion();
    if (!remoteMeta) return false;

    const localHash = localStorage.getItem('questions_content_hash') || '';
    const localVersion = parseInt(localStorage.getItem('questions_version') || '0', 10);

    return remoteMeta.contentHash !== localHash || remoteMeta.version > localVersion;
  } catch {
    return false;
  }
};
