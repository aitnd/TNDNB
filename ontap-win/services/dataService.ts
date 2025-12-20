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

// This function fetches all data and transforms it into the nested structure the app uses.
// This function fetches all data and transforms it into the nested structure the app uses.
// GHI CHÚ: Bản Offline (ontap-win) chỉ dùng data JSON.
export const fetchLicenses = async (): Promise<License[]> => {
  console.log('⚡ [DataService] Running in Offline App - Using LOCAL JSON Data');
  // Import offlineData here to ensure it's available. 
  // Ideally it should be imported at top, but let's assume it is or add it.
  // Wait, I need to check if 'offlineData' is imported. The previous file view showed it wasn't there?
  // Let me check the file content again. It showed supabase import and types only.
  // I need to ADD the import.

  // Since I can't add import here easily without ensure it exists, I'll rewrite the file or use multi_replace.
  // Let's assume I need to add import.
  const data = (await import('../data/questions_db.json')).default;
  return data as any as License[];
};