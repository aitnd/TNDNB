// File: app/api/nop-bai/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../utils/supabaseClient' 
import { adminDb, FieldValue } from '../../../../utils/firebaseAdmin' 
import { doc } from 'firebase/firestore'; // (Chỉ cần 'doc')

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

    // 1. "Mở khóa" Firestore, lấy thông tin phòng thi
    const roomRef = adminDb.collection('exam_rooms').doc(roomId)
    const roomSnap = await roomRef.get()
    
    if (!roomSnap.exists) throw new Error('Phòng thi không tồn tại.')
    const roomData = roomSnap.data()
    const licenseId = roomData?.license_id 

    console.log(`[API Chấm Bài] Phòng thi hạng: ${licenseId}`)

    // 2. LẤY DANH SÁCH MÔN HỌC (subjects)
    const { data: subjects, error: subjectError } = await supabase
      .from('subjects')
      .select('id') 
      .eq('license_id', licenseId);

    if (subjectError) throw subjectError;
    if (!subjects || subjects.length === 0) {
      throw new Error(`Không tìm thấy môn học (subjects) nào cho hạng bằng ${licenseId}`);
    }
    const subjectIds = subjects.map(s => s.id); 

    // 3. LẤY "ĐÁP ÁN ĐÚNG" (master data)
    const { data: correctAnswers, error: supabaseError } = await supabase
      .from('questions')
      .select('id, correct_answer_id') 
      .in('subject_id', subjectIds) 
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
      submitted_at: FieldValue.serverTimestamp()
    });
    console.log(`[API Chấm Bài] Đã lưu kết quả cho: ${userEmail}`)
    
    // 5.5. 💖 CẬP NHẬT "NGĂN CON" 'participants' (Req 3.3) 💖
    //     (Cập nhật trạng thái và điểm số để Giáo viên "nghe" realtime)
    try {
      const participantRef = adminDb.collection('exam_rooms').doc(roomId).collection('participants').doc(userId);
      await participantRef.update({
        status: 'submitted',
        score: score,
        totalQuestions: totalQuestions
      });
      console.log(`[API Chấm Bài] Đã cập nhật trạng thái 'participants' cho: ${userEmail}`)
    } catch (participantError) {
      // (Bỏ qua lỗi này nếu học viên "lén" nộp bài mà chưa "ghi danh")
      console.warn(`[API Chấm Bài] Lỗi (nhẹ): Không thể cập nhật 'participants': ${participantError}`)
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