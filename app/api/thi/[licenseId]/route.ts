// File: app/api/thi/[licenseId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
// 1. 💖 "TRIỆU HỒI" ĐÚNG "ĐỒ NGHỀ" ADMIN 💖
import { adminDb } from '../../../../utils/firebaseAdmin' 
import { FieldPath } from 'firebase-admin/firestore' // (Import FieldPath của Admin)

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
    console.log(`[API Trộn Đề] Bắt đầu "trộn" đề cho hạng: ${licenseId}`)

    // 2. 💖 LẤY "KHO" CÂU HỎI (DÙNG CÚ PHÁP ADMIN "XỊN") 💖
    const questionsRef = adminDb.collection('questions_master');
    // (Đây là cú pháp query của Admin SDK)
    const q = questionsRef
      .where('license_id', '==', licenseId) // (Lọc theo đúng hạng bằng)
      
    // (Chạy "câu hỏi")
    const questionsSnapshot = await q.get();

    if (questionsSnapshot.empty) {
      throw new Error(`Không tìm thấy câu hỏi (questions_master) nào cho hạng bằng ${licenseId}`);
    }

    let allQuestions: any[] = [];
    questionsSnapshot.forEach(doc => {
      allQuestions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`[API Trộn Đề] Tìm thấy ${allQuestions.length} câu hỏi gốc.`)

    // 3. "TRỘN" ĐỀ (Giữ nguyên)
    let deThiCuoiCung = xaoTronBai(allQuestions);
    
    // (TODO: Giới hạn số câu)
    // deThiCuoiCung = deThiCuoiCung.slice(0, 30); 

    // 4. "LỌC" ĐÁP ÁN ĐÚNG (Giữ nguyên)
    const deThiAnToan = deThiCuoiCung.map(q => {
      const { correct_answer_id, ...safeQuestion } = q;
      if (safeQuestion.answers) {
        safeQuestion.answers = xaoTronBai(safeQuestion.answers);
      }
      return safeQuestion;
    });


    console.log(`[API Trộn Đề] "Trộn" đề thành công! Gửi ${deThiAnToan.length} câu.`)

    // 5. "Gửi" bộ đề (Giữ nguyên)
    return NextResponse.json({
      licenseName: allQuestions[0]?.license_name || licenseId, 
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