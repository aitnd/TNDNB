// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
import { doc, onSnapshot, updateDoc, Timestamp, DocumentData, serverTimestamp, collection, query, getDocs, where } from 'firebase/firestore'
import ProtectedRoute from '../../../components/ProtectedRoute'
import styles from './page.module.css' 

// (Định nghĩa "kiểu" - Giữ nguyên)
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string; 
  room_name: string; 
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  created_at: Timestamp;
}
interface Participant {
  id: string;
  fullName: string;
  email: string;
  status: 'waiting' | 'in_progress' | 'submitted'; 
  score?: number; 
  totalQuestions?: number;
  joinedAt: Timestamp;
}

// --- Component "Nội dung" (Bên trong "Lính gác") ---
function RoomControlDashboard() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const roomId = params.roomId as string

  // (Não trạng thái - Giữ nguyên)
  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false) 
  const [participants, setParticipants] = useState<Participant[]>([])

  // (Phép thuật 1: Lắng nghe Phòng thi - Giữ nguyên)
  useEffect(() => {
    if (!roomId || !user) return
    const roomRef = doc(db, 'exam_rooms', roomId)
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = { id: docSnap.id, ...docSnap.data() } as ExamRoom
        setRoom(roomData)
        setLoading(false)
      } else {
        setError('Không tìm thấy phòng thi này!')
        setLoading(false)
      }
    }, (err) => {
      setError('Lỗi kết nối thời gian thực.')
      setLoading(false)
    })
    return () => unsubscribe()
  }, [roomId, user])


  // (Phép thuật 2: Lắng nghe Học viên - Giữ nguyên)
  useEffect(() => {
    if (!roomId) return;
    const participantsRef = collection(db, 'exam_rooms', roomId, 'participants');
    const q = query(participantsRef); 
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const participantList: Participant[] = [];
        querySnapshot.forEach((doc) => {
          participantList.push({ id: doc.id, ...doc.data() } as Participant);
        });
        setParticipants(participantList);
      },
      (err) => {
        console.error('[GV] Lỗi khi "lắng nghe" participants:', err)
        setError('Lỗi kết nối Dashboard thời gian thực.')
      }
    );
    return () => unsubscribe();
  }, [roomId]); 


  // (Hàm "Phát đề" - Giữ nguyên)
  const handleStartExam = async () => {
    if (!room) return
    setIsStarting(true)
    setError(null)
    try {
      const res = await fetch(`/api/thi/${room.license_id}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Lỗi máy chủ: ${res.status}`)
      }
      const examData = await res.json()
      const roomRef = doc(db, 'exam_rooms', roomId)
      await updateDoc(roomRef, {
        status: 'in_progress',
        exam_data: examData, 
        started_at: serverTimestamp()
      })
      
      // "Hét" (UPDATE) cho TẤT CẢ học viên đang 'waiting'
      const participantsRef = collection(db, 'exam_rooms', roomId, 'participants');
      const q = query(participantsRef, where('status', '==', 'waiting'));
      const waitingParticipants = await getDocs(q);
      const updatePromises: Promise<void>[] = [];
      waitingParticipants.forEach((participantDoc) => {
        const participantRef = doc(db, 'exam_rooms', roomId, 'participants', participantDoc.id);
        updatePromises.push(
          updateDoc(participantRef, { status: 'in_progress' })
        );
      });
      await Promise.all(updatePromises);
      console.log(`[GV] Đã cập nhật ${waitingParticipants.size} học viên sang "in_progress".`)

    } catch (err: any) {
      console.error('[GV] Lỗi khi "phát đề":', err)
      setError(err.message)
    } finally {
      setIsStarting(false)
    }
  }
  
  // 5. GIAO DIỆN (Đã cập nhật)

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Đang tải phòng điều khiển...</h1>
      </div>
    )
  }
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.titleError}>Lỗi: {error}</h1>
      </div>
    )
  }
  if (!room) return null; 

  return (
    <div className={styles.container}>
      {/* (Thông tin phòng - Giữ nguyên) */}
      <h1 className={styles.title}>
        Phòng: {room.room_name}
      </h1>
      <p className={styles.info}>
        <span className={styles.label}>Hạng thi:</span> {room.license_name}
      </p>
      <p className={styles.info}>
        <span className={styles.label}>Giáo viên:</span> {room.teacher_name}
      </p>
      <p className={styles.info}>
        <span className={styles.label}>ID Phòng:</span> {room.id}
      </p>
      
      {/* 💖 (Req 1) THU GỌN TRẠNG THÁI VÀ NÚT BẤM 💖 */}
      <div className={styles.statusBox}>
        <div className={styles.statusLeft}>
          <h2 className={styles.label}>Trạng thái</h2>
          {room.status === 'waiting' && (
            <p className={`${styles.status} ${styles.statusWaiting}`}>ĐANG CHỜ</p>
          )}
          {room.status === 'in_progress' && (
            <p className={`${styles.status} ${styles.statusInProgress}`}>ĐANG THI</p>
          )}
          {room.status === 'finished' && (
            <p className={`${styles.status} ${styles.statusFinished}`}>ĐÃ KẾT THÚC</p>
          )}
        </div>
        
        {/* Nút "PHÁT ĐỀ" (Chỉ hiện khi đang "chờ") */}
        <div className={styles.statusRight}>
          {room.status === 'waiting' && (
            <button
              onClick={handleStartExam}
              disabled={isStarting}
              className={`${styles.button} ${styles.buttonStart}`}
            >
              {isStarting ? 'Đang trộn đề...' : 'BẮT ĐẦU PHÁT ĐỀ'}
            </button>
          )}
          
          {/* 💖 (Req 2) ĐÃ XÓA NÚT "ĐÓNG PHÒNG THI" 💖 */}
        </div>
      </div>
      
      {/* BẢNG LIVE DASHBOARD (Giữ nguyên) */}
      <div className={styles.dashboard}>
        <h2 className={styles.dashboardTitle}>
          Bảng điều khiển (Realtime) - ({participants.length} người tham gia)
        </h2>
        
        <table className={styles.participantTable}>
          <thead>
            <tr>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={4} style={{textAlign: 'center'}}>Đang chờ học viên vào phòng...</td>
              </tr>
            ) : (
              participants.map((p) => (
                <tr key={p.id}>
                  <td>{p.fullName}</td>
                  <td>{p.email}</td>
                  <td>
                    {p.status === 'waiting' && (
                      <span className={`${styles.pill} ${styles.pillWaiting}`}>
                        Đang chờ
                      </span>
                    )}
                    {p.status === 'in_progress' && (
                      <span className={`${styles.pill} ${styles.pillInProgress}`}>
                        Đang thi
                      </span>
                    )}
                    {p.status === 'submitted' && (
                      <span className={`${styles.pill} ${styles.pillSubmitted}`}>
                        Đã nộp bài
                      </span>
                    )}
                  </td>
                  <td>
                    {p.status === 'submitted' ? (
                      <strong>{p.score} / {p.totalQuestions}</strong>
                    ) : (
                      '...'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function QuanLyRoomPage() {
  return (
    <ProtectedRoute allowedRoles={['giao_vien', 'admin', 'lanh_dao']}>
      <RoomControlDashboard /> 
    </ProtectedRoute>
  )
}