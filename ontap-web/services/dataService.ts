import { supabase } from './supabaseClient';
import type { License, Subject, Question, Answer } from '../types';
import giamKhaoLtcData from '../data/giam_khao_ltc.json';
import giamKhaoCmData from '../data/giam_khao_cm.json';

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

  // Transform the data from Supabase.
  const formattedData: License[] = data.map((license: any) => ({
      id: license.id,
      name: license.name,
      subjects: license.subjects
        .map((subject: any) => ({
          id: subject.id,
          name: subject.name,
          questions: subject.questions
            .sort(naturalSortQuestions)
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

  // Append Giám khảo data if not present on server
  const hasGiamKhao = formattedData.some(l => l.id.includes('giam-khao') || l.name.toLowerCase().includes('giám khảo'));
  
  if (!hasGiamKhao) {
    console.log('Adding local Giám khảo fallback data');
    const cm = giamKhaoCmData as any;
    const giamKhaoLicense: License = {
      id: 'giam-khao',
      name: 'Giám khảo',
      subjects: [
        {
          id: 'gk-lt-chung',
          name: 'Lý thuyết chung',
          questions: giamKhaoLtcData as any[]
        },
        {
          id: 'gk-kttv',
          name: 'Khí tượng thủy văn',
          questions: cm.hanghai?.slice(0, 10) || []
        },
        {
          id: 'gk-luong',
          name: 'Luồng chạy tàu thuyền',
          questions: cm.luong || []
        },
        {
          id: 'gk-hanghai',
          name: 'Hàng hải',
          questions: cm.hanghai || []
        },
        {
          id: 'gk-dieudong',
          name: 'Điều động',
          questions: cm.dieudong || []
        },
        {
          id: 'gk-vothuyen',
          name: 'Thông tin vô tuyến',
          questions: cm.vothuyen || []
        },
        {
          id: 'gk-ktvt',
          name: 'Kinh tế vận tải',
          questions: cm.ktvt || []
        },
        {
          id: 'gk-nvtt',
          name: 'Nghiệp vụ thuyền trưởng',
          questions: cm.nvtt || []
        }
      ]
    };
    formattedData.push(giamKhaoLicense);
  }
  
  return formattedData;
};