import type { License } from '../types';
import { fetchMetaVersion, fetchQuestionsSnapshot } from './d1Client';
import { getLicensesOffline, saveLicensesOffline, getLocalSyncMeta } from './offlineService';
import { precacheAllQuestionImages } from '../utils/imageHelper';

export const naturalSortQuestions = (a: { id: string }, b: { id: string }): number => {
  const getNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNum(a.id) - getNum(b.id);
};

export const syncQuestionsInBackground = async (): Promise<License[] | null> => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return null;
  }
  try {
    const remoteMeta = await fetchMetaVersion();
    if (!remoteMeta) return null;

    const localMeta = getLocalSyncMeta();
    const isOutdated =
      remoteMeta.contentHash !== localMeta.contentHash ||
      remoteMeta.version > localMeta.version;

    if (!isOutdated) {
      return null;
    }

    const snapshot = await fetchQuestionsSnapshot();
    if (snapshot && Array.isArray(snapshot.licenses) && snapshot.licenses.length > 0) {
      await saveLicensesOffline(snapshot.licenses, {
        version: snapshot.version,
        contentHash: snapshot.contentHash
      });
      precacheAllQuestionImages(snapshot.licenses);
      return snapshot.licenses;
    }
    return null;
  } catch (err) {
    console.warn('[D1 Sync] Background check skipped:', err);
    return null;
  }
};

export const fetchLicensesFromSupabaseFallback = async (): Promise<License[]> => {
  try {
    const { supabase } = await import('./supabaseClient');
    const { data, error } = await supabase
      .from('licenses')
      .select('id, name, subjects(id, name, questions(id, text, image, correct_answer_id, answers(id, text)))')
      .order('id')
      .order('id', { foreignTable: 'subjects' });

    if (error || !data) {
      console.warn('[Supabase Fallback] Error fetching licenses:', error);
      return [];
    }

    const normalizedLicenses: License[] = (data || []).map((lic: any) => ({
      id: lic.id,
      name: lic.name,
      subjects: (lic.subjects || []).map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        questions: (sub.questions || []).map((q: any) => ({
          id: q.id,
          text: q.text,
          image: q.image,
          answers: q.answers || [],
          correctAnswerId: q.correctAnswerId || q.correct_answer_id
        }))
      }))
    }));

    return normalizedLicenses;
  } catch (err) {
    console.warn('[Supabase Fallback] Failed:', err);
    return [];
  }
};

export const fetchLicenses = async (): Promise<License[]> => {
  // 1. Ưu tiên đọc từ IndexedDB / Local Cache trước (<5ms, hỗ trợ 100% Offline)
  const cachedLicenses = await getLicensesOffline();
  if (cachedLicenses && cachedLicenses.length > 0) {
    precacheAllQuestionImages(cachedLicenses);
    // Kiểm tra version hash ngầm không chặn UI
    syncQuestionsInBackground().catch(() => {});
    return cachedLicenses;
  }

  // 2. Lần đầu mở app: Tải Snapshot từ Cloudflare D1 Worker API
  try {
    const snapshot = await fetchQuestionsSnapshot();
    if (snapshot && Array.isArray(snapshot.licenses) && snapshot.licenses.length > 0) {
      await saveLicensesOffline(snapshot.licenses, {
        version: snapshot.version,
        contentHash: snapshot.contentHash
      });
      precacheAllQuestionImages(snapshot.licenses);
      return snapshot.licenses;
    }
  } catch (err) {
    console.warn('[D1 Snapshot] Fetch failed, falling back to Supabase:', err);
  }

  // 3. Fallback sang Supabase
  const fallbackLicenses = await fetchLicensesFromSupabaseFallback();
  if (fallbackLicenses && fallbackLicenses.length > 0) {
    await saveLicensesOffline(fallbackLicenses);
    precacheAllQuestionImages(fallbackLicenses);
    return fallbackLicenses;
  }

  return [];
};
