// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
// 💖 THÊM 'getDoc' 💖
import { doc, onSnapshot, DocumentData, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import styles from './page.module.css'
import Link from 'next/link'
import StudentCard from '../../../components/StudentCard' // 💖 IMPORT STUDENT CARD 💖

// (Định nghĩa "kiểu" - Giữ nguyên)
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string;
  room_name: string;
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  exam_data?: any;
  duration?: number; // (Phút)
  started_at?: any; // Timestamp
  allow_review?: boolean;
}
type Answer = { id: string; text: string }
type Question = { id: string; text: string; image: string | null; answers: Answer[] }

// --- Component Chính: Trang Chờ & Làm Bài ---
export default function ExamRoomPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const roomId = params.roomId as string

  // (Não trạng thái - Giữ nguyên)
  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState<{ score: number, total: number } | null>(null)

  // 💖 THÊM STATE CHO TIMER & SECURITY 💖
  const [timeLeft, setTimeLeft] = useState<number | null>(null) // (Giây)
  const [violationCount, setViolationCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  // 💖 THÊM STATE REVIEW 💖
  const [reviewData, setReviewData] = useState<Record<string, string> | null>(null)

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


  // 4. 💖 "GHI DANH" KHI VÀO PHÒNG (NÂNG CẤP) 💖
  useEffect(() => {
    if (user && roomId) {
      const runAsync = async () => {
        console.log(`[HV] Ghi danh vào phòng ${roomId}...`)
        const participantRef = doc(db, 'exam_rooms', roomId, 'participants', user.uid);

        // (Kiểm tra trạng thái hiện tại trước)
        const docSnap = await getDoc(participantRef);

        // (Chỉ "ghi danh" (set) nếu là 'người mới'
        //  hoặc nếu trạng thái đang là 'waiting'
        //  -> Tránh F5 "reset" trạng thái 'in_progress')
        if (!docSnap.exists() || docSnap.data().status === 'waiting') {
          console.log('[HV] Ghi danh MỚI hoặc "waiting"... Đặt trạng thái.')
          await setDoc(participantRef, {
            fullName: user.fullName,
            email: user.email,
            status: 'waiting',
            joinedAt: serverTimestamp()
          }, { merge: true });
        } else {
          console.log(`[HV] Đã "ghi danh" (trạng thái: ${docSnap.data().status}). Không ghi đè.`)
        }
      }
      runAsync();
    }
  }, [roomId, user]); // (Phụ thuộc vào roomId và user)

  // 3.1 💖 TIMER LOGIC 💖
  useEffect(() => {
    if (room && room.status === 'in_progress' && room.started_at && room.duration) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const startTime = room.started_at.toMillis();
        const endTime = startTime + room.duration! * 60 * 1000;
        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          alert('Hết giờ làm bài! Hệ thống sẽ tự động nộp bài.');
          handleSubmitExam();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [room]);

  // 3.2 💖 TAB SECURITY LOGIC 💖
  useEffect(() => {
    if (room && room.status === 'in_progress' && !finalScore) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setViolationCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              alert('Bạn đã vi phạm quy chế thi (chuyển tab) quá 3 lần. Hệ thống sẽ tự động nộp bài.');
              handleSubmitExam();
            } else {
              setShowWarning(true);
            }
            return newCount;
          });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [room, finalScore]);

  // 5. HÀM CHỌN ĐÁP ÁN (Giữ nguyên)
  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  }

  // 6. HÀM NỘP BÀI (Giữ nguyên)
  const handleSubmitExam = async () => {
    if (!user || !room) return;

    const answeredCount = Object.keys(selectedAnswers).length;
    // Chỉ hỏi nếu chưa hết giờ (nếu hết giờ thì timeLeft = 0, không hỏi)
    if (timeLeft !== 0 && answeredCount < questions.length) {
      if (!confirm(`Bạn mới trả lời ${answeredCount} / ${questions.length} câu. Bạn có chắc chắn muốn nộp bài không?`)) {
        return;
      }
    }

    setIsSubmitting(true)
    setError(null)
    console.log(`[HV] Đang nộp bài cho phòng: ${roomId}`)

    try {
      const submission = { ...selectedAnswers, userId: user.uid, userEmail: user.email };
      const res = await fetch(`/api/nop-bai/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Lỗi khi nộp bài.');
      console.log('[HV] Nộp bài thành công! Kết quả:', result)
      setFinalScore({ score: result.score, total: result.totalQuestions });

      // 💖 LƯU DATA REVIEW NẾU CÓ 💖
      if (result.correctAnswers) {
        setReviewData(result.correctAnswers);
      }

    } catch (err: any) {
      console.error('[HV] Lỗi khi nộp bài:', err)
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  // 7. GIAO DIỆN (Giữ nguyên toàn bộ)
  // (Phần JSX từ đây trở xuống không thay đổi)
  if (loading || authLoading) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1 className={styles.title} style={{ fontSize: '1.5rem' }}>Đang vào phòng thi...</h1>
      </div>
    )
  }
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Lỗi: {error}</h1>
      </div>
    )
  }
  if (room && room.status === 'waiting') {
    return (
      <div className={styles.container}>
        {/* 💖 HEADER NGANG: THÔNG TIN PHÒNG + THẺ HỌC VIÊN 💖 */}
        <div className={styles.headerContainer}>
          {/* CỘT TRÁI: THÔNG TIN PHÒNG */}
          <div className={styles.headerLeft}>
            <h1 className={styles.roomTitle}>Thông tin Phòng Thi</h1>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tên phòng:</span>
              <span className={styles.infoValue} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{room.room_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Hạng thi:</span>
              <span className={styles.infoValue}>{room.license_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Giáo viên:</span>
              <span className={styles.infoValue}>{room.teacher_name}</span>
            </div>
            {/* 💖 MỚI: KHÓA THI 💖 */}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Khóa thi:</span>
              <span className={styles.infoValue}>{user?.courseName || 'Chưa cập nhật'}</span>
            </div>

            <div className={styles.infoItem} style={{ marginTop: '0.5rem' }}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span className={styles.statusBadge}>
                Đang chờ phát đề... <div className={styles.loadingSpinner}></div>
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#6b7280', fontStyle: 'italic', marginTop: '0.5rem' }}>
              * Vui lòng giữ màn hình này và chờ giáo viên bắt đầu.
            </p>
          </div>

          {/* CỘT PHẢI: THẺ HỌC VIÊN */}
          <div className={styles.headerRight}>
            <StudentCard />
          </div>
        </div>
      </div>
    )
  }
  if (finalScore) {
    return (
      <div className={styles.errorContainer} style={{ backgroundColor: '#f3f4f6' }}>
        <h1 className={styles.title} style={{ color: '#16a34a' }}>Nộp bài thành công!</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginTop: '1rem' }}>
          Kết quả của bạn là:
        </p>
        <p style={{ fontSize: '4rem', fontWeight: 'bold', color: '#1e3a8a', margin: '1rem 0' }}>
          {finalScore.score} / {finalScore.total}
        </p>
        <Link href="/quan-ly" className={styles.backButton}>
          Quay về Trang Quản lý
        </Link>

        {/* 💖 HIỂN THỊ REVIEW NẾU CÓ 💖 */}
        {reviewData && (
          <div style={{ marginTop: '2rem', width: '100%', textAlign: 'left' }}>
            <h2 style={{ borderTop: '2px solid #ddd', paddingTop: '1rem', marginTop: '1rem' }}>
              Xem lại bài làm:
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[q.id];
                const correctAnswer = reviewData[q.id];
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div key={q.id} style={{
                    border: '1px solid #eee', padding: '1rem', borderRadius: '8px',
                    backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2'
                  }}>
                    <h3 style={{ fontWeight: 'bold' }}>
                      Câu {index + 1}: {q.text}
                      {isCorrect ? <span style={{ color: 'green', marginLeft: '10px' }}>✅ ĐÚNG</span> : <span style={{ color: 'red', marginLeft: '10px' }}>❌ SAI</span>}
                    </h3>
                    {q.image && (
                      <div style={{ margin: '1rem 0' }}>
                        <img src={q.image} alt={`Hình ảnh cho câu ${index + 1}`} style={{ maxWidth: '200px', borderRadius: '5px' }} />
                      </div>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                      {q.answers.map(ans => {
                        let style: any = { padding: '5px', borderRadius: '4px', margin: '2px 0' };
                        if (ans.id === correctAnswer) {
                          style = { ...style, backgroundColor: '#bbf7d0', border: '1px solid green', fontWeight: 'bold' }; // Đáp án đúng (Xanh lá)
                        } else if (ans.id === userAnswer && ans.id !== correctAnswer) {
                          style = { ...style, backgroundColor: '#fecaca', border: '1px solid red', textDecoration: 'line-through' }; // Chọn sai (Đỏ)
                        }

                        return (
                          <div key={ans.id} style={style}>
                            {ans.text} {ans.id === userAnswer ? '(Bạn chọn)' : ''}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (room && room.status === 'in_progress' && questions.length > 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{ textAlign: 'center', fontSize: '2rem' }}>
          Đề Thi: {room.license_name}
        </h1>
        <p className={styles.subtitle} style={{ textAlign: 'center' }}>
          (Tổng cộng: {questions.length} câu)
        </p>

        {/* 💖 HIỂN THỊ TIMER & CẢNH BÁO 💖 */}
        <div style={{
          position: 'sticky', top: '10px', zIndex: 100,
          backgroundColor: 'white', padding: '10px',
          borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: timeLeft && timeLeft < 300 ? 'red' : '#1e3a8a' }}>
            ⏱ Thời gian còn lại: {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : '--:--'}
          </div>
          {violationCount > 0 && (
            <div style={{ color: 'red', fontWeight: 'bold' }}>
              ⚠️ Cảnh báo vi phạm: {violationCount}/3
            </div>
          )}
        </div>

        {/* 💖 MODAL CẢNH BÁO 💖 */}
        {showWarning && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '400px', textAlign: 'center' }}>
              <h2 style={{ color: 'red', marginBottom: '10px' }}>CẢNH BÁO VI PHẠM!</h2>
              <p>Bạn vừa chuyển tab hoặc rời khỏi màn hình thi.</p>
              <p>Nếu vi phạm <strong>3 lần</strong>, bài thi sẽ bị nộp tự động.</p>
              <button
                onClick={() => setShowWarning(false)}
                style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đã hiểu, tôi sẽ không tái phạm
              </button>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {questions.map((q, index) => (
              <div key={q.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Câu {index + 1}: {q.text}
                </h2>
                {q.image && (
                  <div style={{ margin: '1rem 0' }}>
                    <img src={q.image} alt={`Hình ảnh cho câu ${index + 1}`} style={{ maxWidth: '300px', borderRadius: '5px', border: '1px solid #eee' }} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {q.answers.map((answer) => (
                    <label
                      key={answer.id}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '5px', border: '1px solid #ddd', cursor: 'pointer', backgroundColor: selectedAnswers[q.id] === answer.id ? '#e6f0ff' : '#fff' }}
                    >
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        value={answer.id}
                        onChange={() => handleSelectAnswer(q.id, answer.id)}
                        checked={selectedAnswers[q.id] === answer.id}
                        style={{ width: '1.2rem', height: '1.2rem' }}
                      />
                      <span style={{ marginLeft: '1rem', color: '#333' }}>{answer.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.backButtonContainer} style={{ marginTop: '2.5rem' }}>
            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={styles.backButton}
              style={{ backgroundColor: '#16a34a' }}
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