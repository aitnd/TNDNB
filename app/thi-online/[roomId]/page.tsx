// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
// 💖 THÊM 'setDoc', 'serverTimestamp' 💖
import { doc, onSnapshot, DocumentData, setDoc, serverTimestamp } from 'firebase/firestore'
import styles from './page.module.css'
import Link from 'next/link'

// --- (Định nghĩa "kiểu" - Giữ nguyên) ---
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string; 
  room_name: string; 
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  exam_data?: any; 
}
type Answer = { id: string; text: string }
type Question = { id: string; text: string; image: string | null; answers: Answer[] }

// --- Component Chính: Trang Chờ & Làm Bài ---
export default function ExamRoomPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth() 
  const roomId = params.roomId as string

  // "Não" trạng thái (Giữ nguyên)
  const [room, setRoom] = useState<ExamRoom | null>(null) 
  const [questions, setQuestions] = useState<Question[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState<{ score: number, total: number } | null>(null)

  // 3. "Phép thuật" Realtime (Lắng nghe phòng) - (Giữ nguyên)
  useEffect(() => {
    if (!roomId || !user) return 
    console.log(`[HV] Bắt đầu "lắng nghe" phòng thi: ${roomId}`)
    const roomRef = doc(db, 'exam_rooms', roomId)

    const unsubscribe = onSnapshot(roomRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const roomData = { id: docSnap.id, ...docSnap.data() } as ExamRoom
          setRoom(roomData)
          setLoading(false)
          if (roomData.status === 'in_progress' && roomData.exam_data) {
            console.log('[HV] Giáo viên đã phát đề! Tải bộ đề...')
            setQuestions(roomData.exam_data.questions || [])
          }
          if (roomData.status === 'finished') {
            alert('Phòng thi này đã kết thúc.')
            router.push('/quan-ly')
          }
        } else {
          setError('Không tìm thấy phòng thi. Vui lòng kiểm tra lại.')
          setLoading(false)
        }
      },
      (err) => {
        setError('Lỗi kết nối thời gian thực.')
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [roomId, user, router])


  // 4. 💖 "PHÉP THUẬT" MỚI: "GHI DANH" KHI VÀO PHÒNG 💖
  useEffect(() => {
    // (Chỉ "ghi danh" 1 lần khi 'user' và 'roomId' đã sẵn sàng)
    if (user && roomId) {
      console.log(`[HV] Ghi danh vào phòng ${roomId}...`)
      
      // (Tạo đường dẫn đến "ngăn con" participants, 
      //  dùng 'user.uid' làm ID document)
      const participantRef = doc(db, 'exam_rooms', roomId, 'participants', user.uid);
      
      // (Dùng 'setDoc' với 'merge: true' để "ghi đè" 
      //  hoặc "tạo mới" thông tin)
      setDoc(participantRef, {
        fullName: user.fullName,
        email: user.email,
        status: 'waiting', // (Trạng thái ban đầu)
        joinedAt: serverTimestamp()
      }, { merge: true }); // (Merge = true rất quan trọng)
    }
  }, [roomId, user]); // (Phụ thuộc vào roomId và user)


  // 5. HÀM CHỌN ĐÁP ÁN (Giữ nguyên)
  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  }

  // 6. HÀM NỘP BÀI (Giữ nguyên)
  const handleSubmitExam = async () => {
    if (!user || !room) return;

    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      if (!confirm(`Bạn mới trả lời ${answeredCount} / ${questions.length} câu. Bạn có chắc chắn muốn nộp bài không?`)) {
        return; 
      }
    }

    setIsSubmitting(true)
    setError(null)
    console.log(`[HV] Đang nộp bài cho phòng: ${roomId}`)

    try {
      const submission = {
        ...selectedAnswers,
        userId: user.uid,
        userEmail: user.email,
      };

      const res = await fetch(`/api/nop-bai/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Lỗi khi nộp bài.');

      console.log('[HV] Nộp bài thành công! Kết quả:', result)
      setFinalScore({ score: result.score, total: result.totalQuestions });

    } catch (err: any) {
      console.error('[HV] Lỗi khi nộp bài:', err)
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  // 7. GIAO DIỆN (Giữ nguyên toàn bộ)
  if (loading || authLoading) {
    return (
      <div className={styles.container} style={{justifyContent: 'center', alignItems: 'center'}}>
        <h1 className={styles.title} style={{fontSize: '1.5rem'}}>Đang vào phòng thi...</h1>
      </div>
    )
  }
  // (Phần còn lại của giao diện không thay đổi...)
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Lỗi: {error}</h1>
      </div>
    )
  }
  if (room && room.status === 'waiting') {
    return (
      <div className={styles.errorContainer} style={{backgroundColor: '#f3f4f6'}}>
        <h1 className={styles.title} style={{color: '#1e3a8a'}}>
          Phòng Thi: {room.room_name} 
        </h1>
        <p style={{fontSize: '1.2rem', color: '#555'}}>
          (Hạng thi: {room.license_name})
        </p>
        <p style={{fontSize: '1.2rem', color: '#555'}}>Giáo viên: {room.teacher_name}</p>
        <div style={{margin: '2rem 0', width: '3rem', height: '3rem', borderTop: '4px solid #004a99', borderBottom: '4px solid #004a99', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        <p style={{fontSize: '1.5rem', fontWeight: 600}}>Đang chờ giáo viên phát đề...</p>
        <style jsx global>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }
  if (finalScore) {
     return (
      <div className={styles.errorContainer} style={{backgroundColor: '#f3f4f6'}}>
        <h1 className={styles.title} style={{color: '#16a34a'}}>Nộp bài thành công!</h1>
        <p style={{fontSize: '1.2rem', color: '#555', marginTop: '1rem'}}>
          Kết quả của bạn là:
        </p>
        <p style={{fontSize: '4rem', fontWeight: 'bold', color: '#1e3a8a', margin: '1rem 0'}}>
          {finalScore.score} / {finalScore.total}
        </p>
        <Link href="/quan-ly" className={styles.backButton}>
          Quay về Trang Quản lý
        </Link>
      </div>
    )
  }
  if (room && room.status === 'in_progress' && questions.length > 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{textAlign: 'center', fontSize: '2rem'}}>
          Đề Thi: {room.license_name}
        </h1>
        <p className={styles.subtitle} style={{textAlign: 'center'}}>
          (Tổng cộng: {questions.length} câu)
        </p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '2.5rem'}}>
            {questions.map((q, index) => (
              <div key={q.id} style={{borderBottom: '1px solid #eee', paddingBottom: '1.5rem'}}>
                <h2 style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem'}}>
                  Câu {index + 1}: {q.text}
                </h2>
                {q.image && (
                  <div style={{margin: '1rem 0'}}>
                    <img src={q.image} alt={`Hình ảnh cho câu ${index + 1}`} style={{maxWidth: '300px', borderRadius: '5px', border: '1px solid #eee'}} />
                  </div>
                )}
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem'}}>
                  {q.answers.map((answer) => (
                    <label 
                      key={answer.id} 
                      style={{display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: selectedAnswers[q.id] === answer.id ? '#e6f0ff' : '#fff'}}
                    >
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        value={answer.id}
                        onChange={() => handleSelectAnswer(q.id, answer.id)}
                        checked={selectedAnswers[q.id] === answer.id}
                        style={{width: '1.2rem', height: '1.2rem'}}
                      />
                      <span style={{marginLeft: '1rem', color: '#333'}}>{answer.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.backButtonContainer} style={{marginTop: '2.5rem'}}>
            <button 
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={styles.backButton} 
              style={{backgroundColor: '#16a34a'}}
            >
              {isSubmitting ? 'Đang chấm bài...' : 'NỘP BÀI'}
            </button>
          </div>
        </form>
      </div>
    )
  }
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Trạng thái phòng thi không xác định.</h1>
    </div>
  )
}