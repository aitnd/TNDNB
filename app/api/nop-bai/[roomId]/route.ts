// File: app/api/nop-bai/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
// 1. 💖 "TRIỆU HỒI" ĐÚNG "ĐỒ NGHỀ" ADMIN 💖
import { adminDb, FieldValue } from '../../../../utils/firebaseAdmin'
import { FieldPath } from 'firebase-admin/firestore' // (Import FieldPath của Admin)

// (Định nghĩa "kiểu" - Giữ nguyên)
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



    // 💖 CHECK ADMIN DB 💖
    if (!adminDb) {
      throw new Error('Lỗi cấu hình server: Thiếu FIREBASE_SERVICE_ACCOUNT_KEY hoặc lỗi khởi tạo Admin SDK.');
    }

    // 2. "Mở khóa" Firestore, lấy thông tin phòng thi (Dùng Admin SDK)
    const roomRef = adminDb.collection('exam_rooms').doc(roomId)
    const roomSnap = await roomRef.get()

    if (!roomSnap.exists) throw new Error('Phòng thi không tồn tại.')
    const roomData = roomSnap.data()
    const licenseId = roomData?.license_id



    // 3. 💖 LẤY "ĐÁP ÁN ĐÚNG" (DÙNG CÚ PHÁP ADMIN "XỊN") 💖
    const questionsRef = adminDb.collection('questions_master');

    let correctAnswers: CorrectAnswer[] = [];

    // 💖 FIX: CHỈ QUERY NẾU CÓ CÂU TRẢ LỜI 💖
    if (studentAnswerKeys.length > 0) {
      // (Đây là cú pháp query của Admin SDK)
      const q = questionsRef
        .where('license_id', '==', licenseId) // (Lọc theo hạng bằng)
        .where(FieldPath.documentId(), 'in', studentAnswerKeys) // (Lọc theo các câu đã nộp)

      const questionsSnapshot = await q.get(); // (Chạy "câu hỏi")

      if (!questionsSnapshot.empty) {
        questionsSnapshot.forEach((doc: any) => {
          correctAnswers.push({
            id: doc.id,
            correct_answer_id: doc.data().correct_answer_id
          });
        });
      }
    } else {

    }

    // 4. "CHẤM BÀI" (Giữ nguyên)
    let score = 0
    const totalQuestions = correctAnswers.length


    correctAnswers.forEach((correctAnswer: CorrectAnswer) => {
      const studentAnswer = studentAnswers[correctAnswer.id]
      if (studentAnswer === correctAnswer.correct_answer_id) {
        score++
      }
    })



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


    // 6. CẬP NHẬT "NGĂN CON" 'participants' (Cho Live Dashboard)
    try {
      const participantRef = adminDb.collection('exam_rooms').doc(roomId).collection('participants').doc(userId);
      await participantRef.update({
        status: 'submitted',
        score: score,
        totalQuestions: totalQuestions
      });

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
      const correctAnswersMap: Record<string, string> = {};
      correctAnswers.forEach(ca => {
        correctAnswersMap[ca.id] = ca.correct_answer_id;
      });
      responseData.correctAnswers = correctAnswersMap;
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
