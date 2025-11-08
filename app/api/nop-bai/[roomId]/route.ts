// File: app/api/nop-bai/[roomId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../utils/supabaseClient' 
import { adminDb, FieldValue } from '../../../../utils/firebaseAdmin' 

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
    // "Bóc tách" gói nộp bài
    const { userId, userEmail, ...studentAnswers } = await request.json();
    
    // (Lấy danh sách ID câu hỏi mà HV đã làm)
    const studentAnswerKeys = Object.keys(studentAnswers); 

    if (!userId || !userEmail) {
      throw new Error('Bài nộp không hợp lệ, thiếu thông tin học viên (userId/userEmail).')
    }
    
    console.log(`[API Chấm Bài] Nhận được bài làm cho phòng: ${roomId}`)

    // 1. "Mở khóa" Firestore, lấy thông tin phòng thi
    const roomRef = adminDb.collection('exam_rooms').doc(roomId)
    const roomSnap = await roomRef.get()
    
    if (!roomSnap.exists) {
      throw new Error('Phòng thi không tồn tại.')
    }
    const roomData = roomSnap.data()
    const licenseId = roomData?.license_id 

    console.log(`[API Chấm Bài] Phòng thi hạng: ${licenseId}`)

    // 2. 💖 (BƯỚC SỬA 1) LẤY DANH SÁCH MÔN HỌC (subjects)
    //    (Dùng 'licenseId' để lấy các 'subject_id' liên quan)
    
    const { data: subjects, error: subjectError } = await supabase
      .from('subjects')
      .select('id') // (Chỉ cần lấy ID môn học)
      .eq('license_id', licenseId);

    if (subjectError) throw subjectError;
    if (!subjects || subjects.length === 0) {
      throw new Error(`Không tìm thấy môn học (subjects) nào cho hạng bằng ${licenseId}`);
    }

    // (Tạo 1 mảng các ID môn học: [ 'subject_id_1', 'subject_id_2' ])
    const subjectIds = subjects.map(s => s.id); 
    console.log(`[API Chấm Bài] Hạng bằng này có các môn: ${subjectIds.join(', ')}`)

    // 3. 💖 (BƯỚC SỬA 2) LẤY "ĐÁP ÁN ĐÚNG" (master data)
    //    (Dùng 'subjectIds' thay vì 'licenseId')
    
    const { data: correctAnswers, error: supabaseError } = await supabase
      .from('questions')
      .select('id, correct_answer_id') 
      // (Sửa 'license_id' thành 'subject_id')
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

    // 5. LƯU KẾT QUẢ VÀO FIRESTORE (Giữ nguyên)
    const resultId = `${roomId}_${userId}`;
    const resultRef = adminDb.collection('exam_results').doc(resultId);

    await resultRef.set({
      roomId: roomId,
      licenseId: licenseId,
      studentId: userId,
      studentEmail: userEmail,
      score: score,
      totalQuestions: totalQuestions,
      submittedAnswers: studentAnswers, // (Lưu lại bài làm của HV)
      submitted_at: FieldValue.serverTimestamp()
    });

    console.log(`[API Chấm Bài] Đã lưu kết quả cho: ${userEmail}`)
    
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