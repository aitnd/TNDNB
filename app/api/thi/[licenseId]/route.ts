// File: app/api/thi/[licenseId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
// 1. 💖 "TRIỆU HỒI" SUPABASE 💖
import { supabase } from '../../../../utils/supabaseClient'

// --- CÔNG THỨC TRỘN ĐỀ (Giữ nguyên) ---
const CONG_THUC_TRON_DE: Record<string, number> = {
  'default_so_cau_moi_mon': 5,
  'maytruong-h1': 3,
};

// Hàm "xáo" bài (Giữ nguyên)
function xaoTronBai(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- HÀM API CHÍNH (GET) ---
export async function GET(
  request: NextRequest,
  { params }: { params: { licenseId: string } }
) {
  try {
    const licenseId = params.licenseId


    // 2. 💖 LẤY "KHO" CÂU HỎI TỪ SUPABASE 💖
    // Truy vấn: licenses -> subjects -> questions -> answers
    const { data, error } = await supabase
      .from('licenses')
      .select(`
        name,
        subjects (
          questions (
            id,
            text,
            image,
            correct_answer_id,
            answers (
              id,
              text
            )
          )
        )
      `)
      .eq('id', licenseId)
      .single()

    if (error || !data) {
      console.error('[API Trộn Đề] Lỗi Supabase:', error)
      throw new Error(`Không tìm thấy hạng bằng ${licenseId} hoặc lỗi kết nối.`)
    }

    const licenseName = data.name;

    // 3. "LÀM PHẲNG" DỮ LIỆU (Flatten)
    // Supabase trả về dạng lồng nhau, ta cần gom hết câu hỏi lại thành 1 mảng
    let allQuestions: any[] = [];
    if (data.subjects) {
      data.subjects.forEach((subject: any) => {
        if (subject.questions) {
          allQuestions = allQuestions.concat(subject.questions);
        }
      });
    }



    if (allQuestions.length === 0) {
      throw new Error(`Hạng bằng ${licenseName} chưa có câu hỏi nào.`);
    }

    // 4. "TRỘN" ĐỀ (Giữ nguyên logic)
    let deThiCuoiCung = xaoTronBai(allQuestions);

    // 💖 XỬ LÝ GIỚI HẠN CÂU HỎI 💖
    const url = new URL(request.url);
    const limitStr = url.searchParams.get('limit');
    let limit = 30; // Mặc định 30 câu
    if (limitStr) {
      const parsedLimit = parseInt(limitStr);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }


    deThiCuoiCung = deThiCuoiCung.slice(0, limit);

    // 5. "LỌC" ĐÁP ÁN ĐÚNG & XÁO ĐÁP ÁN (Bảo mật)
    const deThiAnToan = deThiCuoiCung.map((q: any) => {
      // Tách correct_answer_id ra khỏi object trả về (để lộ là toang!)
      const { correct_answer_id, ...safeQuestion } = q;

      // Xáo trộn thứ tự đáp án (a, b, c, d)
      if (safeQuestion.answers) {
        safeQuestion.answers = xaoTronBai(safeQuestion.answers);
      }

      return safeQuestion;
    });



    // 6. "Gửi" bộ đề
    return NextResponse.json({
      licenseName: licenseName,
      questions: deThiAnToan,
    })

  } catch (error: any) {
    console.error('[API Trộn Đề] Lỗi nghiêm trọng:', error)
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định khi trộn đề." },
      { status: 500 }
    )
  }
}