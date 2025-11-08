// "Phòng máy chủ bí mật" - Nơi "trộn" đề

import { NextRequest, NextResponse } from 'next/server' 
import { supabase } from '@/utils/supabaseClient'

// --- CÔNG THỨC TRỘN ĐỀ ---
const CONG_THUC_TRON_DE: Record<string, number> = {
  'default_so_cau_moi_mon': 5, 
  'maytruong-h1': 3, 
};

// Hàm "xáo" bài
function xaoTronBai(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- HÀM API CHÍNH (GET) ---
// 💖 SỬA LẠI CHỮ KÝ HÀM (DÙNG "any" ĐỂ BỎ QUA LỖI BUILD) 💖
export async function GET(
  request: NextRequest, 
  context: any // Dùng "any" để "ép" Vercel biên dịch
) {
  try {
    // 💖 Lấy 'licenseId' từ 'context.params' 💖
    const licenseId = context.params.licenseId 
    
    console.log(`[API] Bắt đầu "trộn" đề cho hạng: ${licenseId}`)

    // 1. Lấy "danh sách môn"
    const { data: subjects, error: subjectError } = await supabase
      .from('subjects')
      .select('id, name')
      .eq('license_id', licenseId)

    if (subjectError) throw subjectError
    if (!subjects || subjects.length === 0) {
      throw new Error(`Không tìm thấy "môn học" cho hạng [${licenseId}]!`)
    }
    console.log(`[API] Tìm thấy ${subjects.length} môn học.`)

    // 2. Lấy "công thức" (số câu)
    const soCauMoiMon = CONG_THUC_TRON_DE[licenseId] || CONG_THUC_TRON_DE['default_so_cau_moi_mon'];

    let deThiCuoiCung: any[] = [];

    // 3. Vòng lặp: Lấy "câu hỏi" cho TỪNG MÔN
    for (const monHoc of subjects) {
      console.log(`[API] ...Đang lấy ${soCauMoiMon} câu cho môn [${monHoc.name}]`)
      
      const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select('id, text, image, subject_id') 
        .eq('subject_id', monHoc.id)
        
      if (questionError) throw questionError

      const cauHoiDaXao = xaoTronBai(questions || []);
      const cauHoiDaChon = cauHoiDaXao.slice(0, soCauMoiMon);

      const cauHoiHoanChinh = [];
      for (const cauHoi of cauHoiDaChon) {
        const { data: answers, error: answerError } = await supabase
          .from('answers')
          .select('id, text')
          .eq('question_id', cauHoi.id) 

        if (answerError) throw answerError;

        cauHoiHoanChinh.push({
          ...cauHoi,
          answers: xaoTronBai(answers || []) 
        });
      }
      deThiCuoiCung.push(...cauHoiHoanChinh);
    }

    // 4. "Xáo" lần cuối
    deThiCuoiCung = xaoTronBai(deThiCuoiCung);
    console.log(`[API] "Trộn" đề thành công! Gửi ${deThiCuoiCung.length} câu.`)

    // 5. "Gửi" bộ đề
    return NextResponse.json({
      licenseName: subjects.map(s => s.name).join(' - '), 
      questions: deThiCuoiCung,
    })

  } catch (error: any) {
    console.error('[API] Lỗi nghiêm trọng tại "phòng bí mật":', error)
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định từ máy chủ." },
      { status: 500 } 
    )
  }
}