import { supabase } from './supabaseClient';
import type { License, Subject, Question, Answer } from '../types';

// Helper function for natural sorting of questions (e.g., q2 before q10)
const naturalSortQuestions = (a: { id: string }, b: { id: string }): number => {
  // Extracts the number from an ID like 'prefix_q123' or 'nvmt_10'
  const getNum = (id: string): number => {
    const match = id.match(/(\d+)$/); // Use a more general regex to find trailing numbers
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNum(a.id) - getNum(b.id);
};

import { getLicensesOffline, saveLicensesOffline } from './offlineService';

// This function fetches all data and transforms it into the nested structure the app uses.
// GHI CHÚ: Bản Offline (ontap-win) ưu tiên dùng IndexedDB (nếu đã đồng bộ), fallback sang file JSON tĩnh.
export const fetchLicenses = async (): Promise<License[]> => {
  // 1. Cố gắng đọc từ IndexedDB trước (dữ liệu mới nhất đã sync)
  const localLicenses = await getLicensesOffline();
  if (localLicenses && localLicenses.length > 0) {
    return localLicenses;
  }

  // 2. Nếu IndexedDB chưa có gì, đọc từ file JSON tĩnh làm dữ liệu khởi tạo
  const data = (await import('../data/questions_db.json')).default;
  const initialLicenses = data as any as License[];
  
  // Lưu vào IndexedDB cho lần sau
  await saveLicensesOffline(initialLicenses);

  return initialLicenses;
};

export const shouldUpdateQuestions = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
      const localCount = parseInt(localStorage.getItem('questions_last_count') || '0', 10);
      return (count || 0) > localCount;
    }
    
    const serverTs = new Date(data.created_at).getTime();
    const localTs = parseInt(localStorage.getItem('questions_last_sync') || '0', 10);
    
    return serverTs > localTs;
  } catch { return false; }
};