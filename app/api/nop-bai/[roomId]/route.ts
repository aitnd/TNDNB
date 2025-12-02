// File: app/api/nop-bai/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
// 1. 💖 "TRIỆU HỒI" ĐÚNG "ĐỒ NGHỀ" ADMIN 💖
import { adminDb, FieldValue } from '../../../../utils/firebaseAdmin'
// 2. 💖 "TRIỆU HỒI" SUPABASE 💖
import { supabase } from '../../../../utils/supabaseClient'

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
    const { userId, userEmail, ...studentAnswers } = await request.json();
    const studentAnswerKeys = Object.keys(studentAnswers);

    if (!userId || !userEmail) {
      throw new Error('Bài nộp không hợp lệ, thiếu thông tin học viên (userId/userEmail).')
    }

    console.log(`[API Chấm Bài] Nhận được bài làm cho phòng: ${roomId}`)

    // 💖 KIỂM TRA SERVER CONFIG 💖
    if (!adminDb) {
      console.error('[API Chấm Bài] Lỗi: adminDb chưa được khởi tạo (Thiếu Key).');
      throw new Error('Lỗi cấu hình máy chủ (Firebase Admin Key missing). Vui lòng báo Admin.');
    }

    // 2. "Mở khóa" Firestore, lấy thông tin phòng thi (Dùng Admin SDK)
    const roomRef = adminDb.collection('exam_rooms').doc(roomId)
    const roomSnap = await roomRef.get()

    if (!roomSnap.exists) throw new Error('Phòng thi không tồn tại.')
    const roomData = roomSnap.data()
    const licenseId = roomData?.license_id

    console.log(`[API Chấm Bài] Phòng thi hạng: ${licenseId}`)

    // 3. 💖 LẤY "ĐÁP ÁN ĐÚNG" TỪ SUPABASE 💖
    const { data, error } = await supabase
      .from('licenses')
      .select(`
        subjects (
          questions (
            id,
            correct_answer_id
          )
        )
      `)
      .eq('id', licenseId)
      .single()

    if (error || !data) {
      console.error('[API Chấm Bài] Lỗi Supabase:', error)
      throw new Error('Không thể lấy đáp án từ Supabase.')
    }

    // Flatten data để lấy danh sách correct answers
    let allCorrectAnswers: CorrectAnswer[] = [];
    if (data.subjects) {
      data.subjects.forEach((subject: any) => {
        if (subject.questions) {
          allCorrectAnswers = allCorrectAnswers.concat(subject.questions);
        }
      });
    }

    // Lọc ra các câu hỏi có trong bài làm của học viên (để tối ưu và chính xác)
    const correctAnswersMap = new Map<string, string>();
    allCorrectAnswers.forEach(q => {
      correctAnswersMap.set(q.id, q.correct_answer_id);
    });

    // 4. "CHẤM BÀI"
    let score = 0
    const totalQuestions = studentAnswerKeys.length // Hoặc lấy từ roomData.question_limit
    console.log(`[API Chấm Bài] Đang chấm ${totalQuestions} câu trả lời...`)

    studentAnswerKeys.forEach((questionId) => {
      const studentAnswer = studentAnswers[questionId]
      const correctAnswer = correctAnswersMap.get(questionId)

      if (correctAnswer && studentAnswer === correctAnswer) {
        score++
      }
    })

    console.log(`[API Chấm Bài] Điểm số: ${score} / ${totalQuestions}`)

    // 5. LƯU KẾT QUẢ VÀO FIRESTORE (Ngăn 'exam_results')
    const resultId = `${roomId}_${userId}`;
    const resultRef = adminDb.collection('exam_results').doc(resultId);
    await resultRef.set({
      roomId: roomId,
      licenseId: licenseId,
      studentId: userId,
      studentEmail: userEmail,
      score: score,
      totalQuestions: totalQuestions,
      submittedAnswers: studentAnswers,
      submitted_at: FieldValue.serverTimestamp() // (Dùng FieldValue của Admin)
    });
    console.log(`[API Chấm Bài] Đã lưu kết quả cho: ${userEmail}`)

    // 6. CẬP NHẬT "NGĂN CON" 'participants' (Cho Live Dashboard)
    try {
      const participantRef = adminDb.collection('exam_rooms').doc(roomId).collection('participants').doc(userId);
      await participantRef.update({
        status: 'submitted',
        score: score,
        totalQuestions: totalQuestions,
        submittedAt: FieldValue.serverTimestamp() // 💖 Cập nhật thời gian nộp bài 💖
      });
      console.log(`[API Chấm Bài] Đã cập nhật trạng thái 'participants' cho: ${userEmail}`)
    } catch (participantError) {
      console.warn(`[API Chấm Bài] Lỗi (nhẹ): Không thể cập nhật 'participants': ${participantError}`)
    }

    // 7. TRẢ KẾT QUẢ
    const responseData: any = {
      message: 'Nộp bài thành công!',
      score: score,
      totalQuestions: totalQuestions
    }

    // 💖 NẾU CHO PHÉP XEM LẠI -> TRẢ VỀ ĐÁP ÁN ĐÚNG 💖
    if (roomData?.allow_review) {
      const correctAnswersObj: Record<string, string> = {};
      studentAnswerKeys.forEach(qid => {
        const correct = correctAnswersMap.get(qid);
        if (correct) {
          correctAnswersObj[qid] = correct;
        }
      });
      responseData.correctAnswers = correctAnswersObj;
    }

    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error('[API Chấm Bài] Lỗi nghiêm trọng:', error)
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định khi chấm bài." },
      { status: 500 }
    )
  }
}