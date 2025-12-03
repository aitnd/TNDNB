// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
import { doc, onSnapshot, DocumentData, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import styles from './page.module.css'
import Link from 'next/link'
import StudentCard from '../../../components/StudentCard'

// (Định nghĩa "kiểu")
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
  password?: string;
  is_paused?: boolean; // Tạm dừng toàn phòng
  auto_distribute?: boolean;
}
type Answer = { id: string; text: string }
type Question = { id: string; text: string; image: string | null; answers: Answer[] }

// --- Component Chính: Trang Chờ & Làm Bài ---
export default function ExamRoomPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const roomId = params.roomId as string

  // (Não trạng thái)
  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState<{ score: number, total: number } | null>(null)

  // STATE CHO TIMER & SECURITY
  const [timeLeft, setTimeLeft] = useState<number | null>(null) // (Giây)
  const [violationCount, setViolationCount] = useState(0)
  const [reviewData, setReviewData] = useState<Record<string, string> | null>(null)

  // STATE BẢO MẬT & ĐIỀU KHIỂN
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [isPaused, setIsPaused] = useState(false) // Trạng thái tạm dừng (Global OR Individual)

  // STATE MỚI CHO UI REDESIGN
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // STATE TRẠNG THÁI CÁ NHÂN
  const [participantStatus, setParticipantStatus] = useState<string>('waiting');
  const [individualStartTime, setIndividualStartTime] = useState<any>(null);

  // 💖 STATE PAUSE CÁ NHÂN 💖
  const [isIndividualPaused, setIsIndividualPaused] = useState(false);
  const [totalPausedDuration, setTotalPausedDuration] = useState(0);

  // 3. "Phép thuật" Realtime (Lắng nghe phòng)
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

          if (roomData.password) {
            const savedPass = sessionStorage.getItem(`pass_${roomId}`);
            if (savedPass === roomData.password) {
              setIsAuthorized(true);
            }
          } else {
            setIsAuthorized(true);
          }

          // setIsPaused(roomData.is_paused || false); // Logic cũ: chỉ check global
          // Logic mới: check cả global và individual ở useEffect dưới

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


  // 4. "GHI DANH" & LẮNG NGHE TRẠNG THÁI CÁ NHÂN
  useEffect(() => {
    if (user && roomId) {
      const participantRef = doc(db, 'exam_rooms', roomId, 'participants', user.uid);

      // 1. Ghi danh (nếu chưa có)
      const register = async () => {
        const docSnap = await getDoc(participantRef);
        if (!docSnap.exists()) {
          console.log('[HV] Ghi danh MỚI...');
          await setDoc(participantRef, {
            fullName: user.fullName,
            email: user.email,
            status: 'waiting',
            joinedAt: serverTimestamp()
          }, { merge: true });
        }
      };
      register();

      // 2. Lắng nghe thay đổi cá nhân
      const unsub = onSnapshot(participantRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setParticipantStatus(data.status || 'waiting');
          setIndividualStartTime(data.startedAt || null);

          // 💖 CẬP NHẬT STATE PAUSE CÁ NHÂN 💖
          setIsIndividualPaused(data.isPaused || false);
          setTotalPausedDuration(data.totalPausedDuration || 0);

          // Xử lý KICK
          if (data.status === 'kicked') {
            alert('Bạn đã bị giáo viên mời ra khỏi phòng thi!');
            router.push('/');
            return;
          }

          // Xử lý RESET
          if (data.status === 'waiting' && (Object.keys(selectedAnswers).length > 0 || finalScore)) {
            alert('Giáo viên đã reset bài thi của bạn. Bạn sẽ thi lại từ đầu.');
            setSelectedAnswers({});
            setTimeLeft(null);
            setViolationCount(0);
            setFinalScore(null);
            setIsSubmitting(false);
            setReviewData(null);
            setCurrentQuestionIndex(0);
            // Reset pause state
            setIsIndividualPaused(false);
            setTotalPausedDuration(0);
          }

          // Xử lý SUBMITTED
          if (data.status === 'submitted' && data.score !== undefined) {
            setFinalScore({ score: data.score, total: data.totalQuestions });
          }
        }
      });
      return () => unsub();
    }
  }, [roomId, user, selectedAnswers, finalScore]);

  // 💖 CẬP NHẬT TRẠNG THÁI PAUSE TỔNG HỢP 💖
  useEffect(() => {
    if (room) {
      // Pause nếu: Phòng pause HOẶC Cá nhân pause
      setIsPaused(room.is_paused || isIndividualPaused);
    }
  }, [room, isIndividualPaused]);

  // 3.1 TIMER LOGIC (INDIVIDUAL + GLOBAL + PAUSE)
  useEffect(() => {
    const shouldRunTimer = room && room.status === 'in_progress' && !finalScore && participantStatus !== 'submitted';

    if (shouldRunTimer) {
      const interval = setInterval(() => {
        // 💖 NẾU ĐANG PAUSE -> KHÔNG ĐẾM NGƯỢC (GIỮ NGUYÊN TIMELEFT HOẶC HIỆN --) 💖
        if (isPaused) {
          // Khi pause, ta không update timeLeft. 
          // Tuy nhiên, để UX tốt, ta có thể không làm gì ở đây, 
          // vì UI sẽ hiển thị màn hình Pause che mất timer rồi.
          return;
        }

        const now = new Date().getTime();

        let startTime = 0;
        if (individualStartTime) {
          startTime = individualStartTime.toMillis();
        } else if (room.started_at) {
          startTime = room.started_at.toMillis();
        } else {
          return;
        }

        // 💖 TÍNH TOÁN THỜI GIAN KẾT THÚC VỚI BÙ GIỜ (TOTAL PAUSED DURATION) 💖
        // endTime = startTime + duration + totalPausedDuration
        const durationMillis = room.duration! * 60 * 1000;
        const endTime = startTime + durationMillis + totalPausedDuration;

        const remaining = Math.floor((endTime - now) / 1000);

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          if (!finalScore && !isSubmitting) {
            alert('Hết giờ làm bài! Hệ thống sẽ tự động nộp bài.');
            handleSubmitExam();
          }
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [room, individualStartTime, finalScore, isSubmitting, participantStatus, isPaused, totalPausedDuration]);

  // 3.2 TAB SECURITY LOGIC
  useEffect(() => {
    // Không check security khi đang PAUSE
    if (room && room.status === 'in_progress' && !finalScore && user && participantStatus !== 'waiting' && !isPaused) {
      const handleVisibilityChange = async () => {
        if (document.hidden) {
          console.log('[HV] Phát hiện chuyển tab! Ghi nhận vi phạm...');
          setViolationCount(prev => prev + 1);
          alert('⚠️ CẢNH BÁO: Bạn đang rời khỏi màn hình thi!\nHệ thống đã ghi nhận vi phạm. Vui lòng quay lại làm bài ngay.');
          try {
            const participantRef = doc(db, 'exam_rooms', roomId, 'participants', user.uid);
            await updateDoc(participantRef, {
              violationCount: violationCount + 1,
              lastViolationAt: serverTimestamp()
            });
          } catch (err) {
            console.error('[HV] Lỗi ghi nhận vi phạm:', err);
          }
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [room, finalScore, user, roomId, violationCount, participantStatus, isPaused]);

  // 5. HÀM CHỌN ĐÁP ÁN
  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerId }));
  }

  // 6. HÀM NỘP BÀI
  const handleSubmitExam = async () => {
    if (!user || !room) return;

    const answeredCount = Object.keys(selectedAnswers).length;
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

      if (result.correctAnswers) {
        setReviewData(result.correctAnswers);
      }

    } catch (err: any) {
      console.error('[HV] Lỗi khi nộp bài:', err)
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  // XỬ LÝ NHẬP MẬT KHẨU
  const handleLoginRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (room?.password && passwordInput === room.password) {
      setIsAuthorized(true);
      sessionStorage.setItem(`pass_${roomId}`, passwordInput);
    } else {
      alert('Mật khẩu không đúng!');
    }
  }

  // --- RENDER ---

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

  // UI: NHẬP MẬT KHẨU
  if (room && !isAuthorized) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLoginRoom} className={styles.errorContainer} style={{ padding: '2rem', width: '100%', maxWidth: '400px', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h2 className={styles.title} style={{ textAlign: 'center', marginBottom: '1rem' }}>🔒 Phòng thi có mật khẩu</h2>
          <input
            type="password"
            placeholder="Nhập mật khẩu phòng..."
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '5px' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Vào phòng thi
          </button>
        </form>
      </div>
    )
  }

  // 💖 UI: TẠM DỪNG (GLOBAL HOẶC INDIVIDUAL) 💖
  if (isPaused) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff7ed' }}>
        <h1 style={{ fontSize: '3rem' }}>⏸️</h1>
        <h2 style={{ color: '#c2410c', marginTop: '1rem' }}>Bài thi đang tạm dừng</h2>
        <p style={{ color: '#7c2d12' }}>
          {isIndividualPaused ? 'Giáo viên đã tạm dừng bài thi của bạn.' : 'Vui lòng chờ giáo viên mở lại...'}
        </p>
      </div>
    )
  }

  // UI: KẾT QUẢ THI
  if (finalScore) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '600px',
          width: '90%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🏆</div>
          <h1 style={{ color: '#0369a1', fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Hoàn thành bài thi!</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '30px' }}>Chúc mừng bạn đã hoàn thành bài thi.</p>

          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Điểm số</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0ea5e9' }}>{finalScore.score}</div>
            </div>
            <div style={{ width: '1px', height: '50px', backgroundColor: '#cbd5e1' }}></div>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Tổng câu</div>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#334155' }}>{finalScore.total}</div>
            </div>
          </div>

          <Link href="/quan-ly" style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '50px',
            textDecoration: 'none',
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.4)',
            transition: 'transform 0.2s'
          }}>
            Quay về Trang chủ
          </Link>

          {/* REVIEW SECTION */}
          {reviewData && (
            <div style={{ marginTop: '40px', textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <h3 style={{ color: '#334155', marginBottom: '15px' }}>Xem lại chi tiết:</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[q.id] === reviewData[q.id];
                  return (
                    <div key={q.id} style={{
                      padding: '10px',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
                      border: isCorrect ? '1px solid #bbf7d0' : '1px solid #fecaca',
                      fontSize: '0.9rem'
                    }}>
                      <strong>Câu {idx + 1}:</strong> {isCorrect ? '✅ Đúng' : '❌ Sai'}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // UI: CHỜ PHÁT ĐỀ (WAITING)
  const showWaitingScreen = room && (room.status === 'waiting' || (room.status === 'in_progress' && participantStatus === 'waiting'));

  if (showWaitingScreen) {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <h1 className={styles.roomTitle}>Thông tin Phòng Thi</h1>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Tên phòng:</span>
              <span className={styles.infoValue} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{room?.room_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Hạng thi:</span>
              <span className={styles.infoValue}>{room?.license_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Giáo viên:</span>
              <span className={styles.infoValue}>{room?.teacher_name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Khóa thi:</span>
              <span className={styles.infoValue}>{user?.courseName || 'Chưa cập nhật'}</span>
            </div>
            <div className={styles.infoItem} style={{ marginTop: '0.5rem' }}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span className={styles.statusBadge}>
                {room?.status === 'waiting' ? 'Đang chờ giáo viên...' : 'Đang chờ phát đề...'}
                <div className={styles.loadingSpinner}></div>
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#6b7280', fontStyle: 'italic', marginTop: '0.5rem' }}>
              * Vui lòng giữ màn hình này và chờ giáo viên bắt đầu.
            </p>
          </div>
          <div className={styles.headerRight}>
            <StudentCard />
          </div>
        </div>
      </div>
    )
  }

  // UI: LÀM BÀI (IN PROGRESS)
  if (room && room.status === 'in_progress' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <div className={styles.studentCardWrapper}>
            <StudentCard />
          </div>
          <div className={styles.timerWrapper}>
            <div className={styles.timerBox}>
              <span className={styles.timerLabel}>Đang thi</span>
              <span className={styles.timerValue}>
                Còn lại: {timeLeft ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` : '--:--'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.splitLayout}>
          <div className={styles.leftColumn}>
            <div className={styles.questionBox}>
              <h2 className={styles.questionTitle}>Nội dung câu hỏi</h2>
              <div className={styles.questionContent}>
                <h3 className={styles.questionText}>
                  <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Câu {currentQuestionIndex + 1}: </span>
                  {currentQuestion.text}
                </h3>
                {currentQuestion.image && (
                  <div className={styles.questionImage}>
                    <img src={currentQuestion.image} alt="Question Image" />
                  </div>
                )}
                <div className={styles.optionsList}>
                  {currentQuestion.answers.map((ans, idx) => (
                    <div key={ans.id} className={styles.optionItem}>
                      <div className={`${styles.optionCircle} ${selectedAnswers[currentQuestion.id] === ans.id ? styles.selected : ''}`}>
                        {String.fromCharCode(97 + idx)}
                      </div>
                      <span className={styles.optionText}>{ans.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.navButtons}>
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className={styles.navButton}
                >
                  &lt; Trở lại
                </button>
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className={`${styles.navButton} ${styles.nextButton}`}
                >
                  Tiếp tục &gt;
                </button>
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.answerSheetContainer}>
              <div className={styles.answerSheetSubCol}>
                <div className={styles.answerGridHeader}>
                  <div>Câu</div>
                  <div>a</div>
                  <div>b</div>
                  <div>c</div>
                  <div>d</div>
                </div>
                <div className={styles.answerGridBody}>
                  {questions.slice(0, Math.ceil(questions.length / 2)).map((q, idx) => (
                    <div key={q.id} className={`${styles.answerRow} ${currentQuestionIndex === idx ? styles.activeRow : ''}`}>
                      <div className={styles.questionNumber} onClick={() => setCurrentQuestionIndex(idx)}>{idx + 1}</div>
                      {q.answers.map((ans) => (
                        <div key={ans.id} className={styles.answerCell}>
                          <div className={`${styles.answerBubble} ${selectedAnswers[q.id] === ans.id ? styles.filledBubble : ''}`} onClick={() => handleSelectAnswer(q.id, ans.id)}></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.answerSheetSubCol}>
                <div className={styles.answerGridHeader}>
                  <div>Câu</div>
                  <div>a</div>
                  <div>b</div>
                  <div>c</div>
                  <div>d</div>
                </div>
                <div className={styles.answerGridBody}>
                  {questions.slice(Math.ceil(questions.length / 2)).map((q, idx) => {
                    const realIdx = idx + Math.ceil(questions.length / 2);
                    return (
                      <div key={q.id} className={`${styles.answerRow} ${currentQuestionIndex === realIdx ? styles.activeRow : ''}`}>
                        <div className={styles.questionNumber} onClick={() => setCurrentQuestionIndex(realIdx)}>{realIdx + 1}</div>
                        {q.answers.map((ans) => (
                          <div key={ans.id} className={styles.answerCell}>
                            <div className={`${styles.answerBubble} ${selectedAnswers[q.id] === ans.id ? styles.filledBubble : ''}`} onClick={() => handleSelectAnswer(q.id, ans.id)}></div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={styles.submitContainer}>
              <button onClick={handleSubmitExam} disabled={isSubmitting} className={styles.submitButton}>
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Trạng thái phòng thi không xác định.</h1>
    </div>
  )
}