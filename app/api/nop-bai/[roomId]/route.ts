// File: app/api/nop-bai/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../utils/supabaseClient' 
// 1. 💖 "TRIỆU HỒI" TỔNG ĐÀI ADMIN 💖
import { adminDb } from '../../../../utils/firebaseAdmin' 

// (Định nghĩa "kiểu" - Giữ nguyên)
type StudentAnswers = Record<string, string>
type CorrectAnswer = { id: string; correct_answer_id: string }

// --- HÀM API CHÍNH (POST) ---
export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId
    const studentAnswers: StudentAnswers = await request.json()
    const studentAnswerKeys = Object.keys(studentAnswers); 

    console.log(`[API Chấm Bài] Nhận được bài làm cho phòng: ${roomId}`)

    // 2. 💖 DÙNG "TỔNG ĐÀI ADMIN" (adminDb) 💖
    //    (Nó sẽ "bỏ qua" (bypass) Luật Bảo vệ)
    const roomRef = adminDb.collection('exam_rooms').doc(roomId)
    const roomSnap = await roomRef.get()
    
    if (!roomSnap.exists) {
      throw new Error('Phòng thi không tồn tại.')
    }
    const roomData = roomSnap.data()
    const licenseId = roomData?.license_id // (Thêm ? cho an toàn)

    console.log(`[API Chấm Bài] Phòng thi hạng: ${licenseId}`)

    // 3. "Mở khóa" Supabase (Giữ nguyên)
    const { data: correctAnswers, error: supabaseError } = await supabase
      .from('questions')
      .select('id, correct_answer_id') 
      .eq('license_id', licenseId) 
      .in('id', studentAnswerKeys) 
    
    if (supabaseError) throw supabaseError
    if (!correctAnswers) {
      throw new Error('Không thể lấy đáp án từ CSDL Supabase.')
    }

    // 4. "CHẤM BÀI" (Giữ nguyên)
    let score = 0
    const totalQuestions = correctAnswers.length
    console.log(`[API Chấm Bài] Đang so sánh ${totalQuestions} câu trả lời...`)

    correctAnswers.forEach((correctAnswer: CorrectAnswer) => {
      const studentAnswer = studentAnswers[correctAnswer.id]
      if (studentAnswer === correctAnswer.correct_answer_id) {
        score++
      }
    })

    console.log(`[API Chấm Bài] Điểm số: ${score} / ${totalQuestions}`)

    // 5. LƯU KẾT QUẢ VÀO FIRESTORE (DÙNG "TỔNG ĐÀI ADMIN")
    const { userId, userEmail, ...actualAnswers } = studentAnswers;

    if (userId && userEmail) {
      const resultId = `${roomId}_${userId}`;
      // 💖 DÙNG "TỔNG ĐÀI ADMIN" (adminDb) 💖
      const resultRef = adminDb.collection('exam_results').doc(resultId);

      await resultRef.set({
        roomId: roomId,
        licenseId: licenseId,
        studentId: userId,
        studentEmail: userEmail,
        score: score,
        totalQuestions: totalQuestions,
        submittedAnswers: actualAnswers,
        submitted_at: admin.firestore.FieldValue.serverTimestamp() // (Cú pháp Admin)
      });

      console.log(`[API Chấm Bài] Đã lưu kết quả cho: ${userEmail}`)
    }

    // 6. TRẢ KẾT QUẢ (Giữ nguyên)
    return NextResponse.json({
      message: 'Nộp bài thành công!',
      score: score,
      totalQuestions: totalQuestions
    })

  } catch (error: any) {
    console.error('[API Chấm Bài] Lỗi nghiêm trọng:', error)
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định khi chấm bài." },
      { status: 500 } 
    )
  }
}