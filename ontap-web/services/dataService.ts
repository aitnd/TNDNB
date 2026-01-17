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
// GHI CHÚ: Hàm này sẽ tự động tải TẤT CẢ các hạng bằng từ cơ sở dữ liệu Supabase.
// Bất kỳ hạng bằng, môn học, hay câu hỏi nào được anh thêm vào Supabase
// sẽ tự động xuất hiện trong ứng dụng sau khi tải lại trang.
export const fetchLicenses = async (): Promise<License[]> => {
  const { data, error } = await supabase
    .from('licenses')
    .select(`
      id,
      name,
      display_order,
      subjects (
        id,
        name,
        display_order,
        questions (
          *,
          answers (
            id,
            text
          )
        )
      )
    `)
    .order('display_order', { ascending: true }) // Sort licenses on the database
    .order('display_order', { foreignTable: 'subjects', ascending: true }); // Sort subjects on the database

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    throw error;
  }

  // Transform the data from Supabase. Data is already sorted by the DB query.
  const formattedData: License[] = data.map((license: any) => ({
      id: license.id,
      name: license.name,
      subjects: license.subjects
        .map((subject: any) => ({
          id: subject.id,
          name: subject.name,
          questions: subject.questions
            .sort(naturalSortQuestions) // Use natural sort for questions locally
            .map((question: any) => ({
              id: question.id,
              text: question.text,
              image: question.image,
              correctAnswerId: question.correct_answer_id,
              answers: question.answers.map((answer: any) => ({
                  id: answer.id,
                  text: answer.text,
              }))
          }))
        }))
  }));
  
  return formattedData;
};