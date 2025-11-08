// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
// 💖 THÊM 'collection', 'query' 💖
import { doc, onSnapshot, updateDoc, Timestamp, DocumentData, serverTimestamp, collection, query } from 'firebase/firestore'
import ProtectedRoute from '../../../components/ProtectedRoute'
import styles from './page.module.css' 

// --- (Định nghĩa "kiểu" - Giữ nguyên) ---
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string; 
  room_name: string; 
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  created_at: Timestamp;
}

// 💖 "KIỂU" MỚI: DÀNH CHO LIVE DASHBOARD 💖
interface Participant {
  id: string; // (Chính là user.uid)
  fullName: string;
  email: string;
  status: 'waiting' | 'submitted';
  score?: number; // (Sẽ xuất hiện khi 'submitted')
  totalQuestions?: number;
  joinedAt: Timestamp;
}


// --- Component "Nội dung" (Bên trong "Lính gác") ---
function RoomControlDashboard() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const roomId = params.roomId as string

  // "Não" trạng thái
  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false) 

  // 1. 💖 "NÃO" MỚI: LIVE DASHBOARD (Req 3.3) 💖
  const [participants, setParticipants] = useState<Participant[]>([])

  // 2. "Phép thuật" 1: (Lắng nghe Phòng thi) - (Giữ nguyên)
  useEffect(() => {
    if (!roomId || !user) return

    console.log(`[GV] Bắt đầu "lắng nghe" phòng: ${roomId}`)
    const roomRef = doc(db, 'exam_rooms', roomId)

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = { id: docSnap.id, ...docSnap.data() } as ExamRoom
        setRoom(roomData)
        setLoading(false)
        if (roomData.status === 'in_progress') {
          console.log('[GV] Phòng này đã được phát đề.')
        }
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


  // 3. 💖 "PHÉP THUẬT" 2: (Lắng nghe Học viên) (Req 3.3) 💖
  useEffect(() => {
    if (!roomId) return;

    console.log(`[GV] Bắt đầu "lắng nghe" ngăn con 'participants' của phòng: ${roomId}`)
    
    // 3.1. Tạo "câu truy vấn" (query) đến "ngăn con"
    const participantsRef = collection(db, 'exam_rooms', roomId, 'participants');
    // (Sắp xếp theo thời gian vào)
    const q = query(participantsRef, /* orderBy('joinedAt', 'asc') */); 

    // 3.2. "Gắn tai nghe"
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        // "Có biến!" (Học viên vừa vào/nộp bài)
        const participantList: Participant[] = [];
        querySnapshot.forEach((doc) => {
          participantList.push({
            id: doc.id,
            ...doc.data()
          } as Participant);
        });
        
        setParticipants(participantList);
        console.log('[GV] Đã cập nhật Live Dashboard:', participantList);
      },
      (err) => {
        console.error('[GV] Lỗi khi "lắng nghe" participants:', err)
        setError('Lỗi kết nối Dashboard thời gian thực.')
      }
    );

    // 3.3. "Tháo tai nghe"
    return () => unsubscribe();
  }, [roomId]); // (Chỉ phụ thuộc vào roomId)


  // 4. HÀM XỬ LÝ "PHÁT ĐỀ" (Logic giữ nguyên)
  const handleStartExam = async () => {
    if (!room) return
    setIsStarting(true)
    setError(null)
    console.log(`[GV] Yêu cầu "phát đề" cho hạng: ${room.license_id}`)

    try {
      const res = await fetch(`/api/thi/${room.license_id}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Lỗi máy chủ: ${res.status}`)
      }
      const examData = await res.json()
      console.log('[GV] "Xin" đề từ API thành công!')

      const roomRef = doc(db, 'exam_rooms', roomId)
      await updateDoc(roomRef, {
        status: 'in_progress',
        exam_data: examData, 
        started_at: serverTimestamp()
      })
      console.log('[GV] "PHÁT ĐỀ" THÀNH CÔNG!')
    } catch (err: any) {
      console.error('[GV] Lỗi khi "phát đề":', err)
      setError(err.message)
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

  if (!room) {
    return null; // Trường hợp không tìm thấy phòng
  }

  return (
    <div className={styles.container}>
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
      
      <div className={styles.statusBox}>
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
      
      {/* Nút "PHÁT ĐỀ" */}
      {room.status === 'waiting' && (
        <button
          onClick={handleStartExam}
          disabled={isStarting}
          className={`${styles.button} ${styles.buttonStart}`}
        >
          {isStarting ? 'Đang trộn đề...' : 'BẮT ĐẦU PHÁT ĐỀ'}
        </button>
      )}
      
      {/* Nút "ĐÓNG PHÒNG" */}
      {room.status === 'in_progress' && (
        <button
          className={`${styles.button} ${styles.buttonStop}`}
        >
          ĐÓNG PHÒNG THI (Sắp có...)
        </button>
      )}
      
      {/* 6. 💖 BẢNG LIVE DASHBOARD (Req 3.3) 💖 */}
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
                    {p.status === 'submitted' && (
                      <span className={`${styles.pill} ${styles.pillSubmitted}`}>
                        Đã nộp bài
                      </span>
                    )}
                  </td>
                  <td>
                    {/* (Chỉ hiển thị điểm nếu đã nộp) */}
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