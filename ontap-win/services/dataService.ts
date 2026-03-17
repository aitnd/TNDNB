import type { License, Subject } from '../types';
import giamKhaoLtcData from '../data/giam_khao_ltc.json';
import giamKhaoCmData from '../data/giam_khao_cm.json';

// Helper function for natural sorting of questions (e.g., q2 before q10)
const naturalSortQuestions = (a: { id: string }, b: { id: string }): number => {
  const getNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getNum(a.id) - getNum(b.id);
};

// GHI CHÚ: Bản Offline (ontap-win) chỉ dùng data JSON.
export const fetchLicenses = async (): Promise<License[]> => {
  console.log('⚡ [DataService] Running in Offline App - Using LOCAL JSON Data');
  
  // Import offlineData
  const data = (await import('../data/questions_db.json')).default;
  const formattedData = data as any as License[];

  // Append Giám khảo data if not present
  const hasGiamKhao = formattedData.some(l => l.id.includes('giam-khao') || l.name.toLowerCase().includes('giám khảo'));
  
  if (!hasGiamKhao) {
    console.log('Adding local Giám khảo fallback data to Offline App');
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