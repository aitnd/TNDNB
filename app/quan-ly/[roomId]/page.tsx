// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
import { doc, onSnapshot, updateDoc, Timestamp, DocumentData, serverTimestamp } from 'firebase/firestore'
import ProtectedRoute from '../../../components/ProtectedRoute'

// 1. "Triệu hồi" file CSS Module
import styles from './page.module.css' 

// 2. Định nghĩa "kiểu" của Phòng thi (Nâng cấp)
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string; // 💖 TÊN ĐẦY ĐỦ (Req 3.1) 💖
  room_name: string; // 💖 TÊN PHÒNG (Req 3.2) 💖
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  created_at: Timestamp;
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

  // 3. "Phép thuật" Realtime (useEffect) - (Nâng cấp)
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
      console.error('[GV] Lỗi khi "lắng nghe" phòng:', err)
      setError('Lỗi kết nối thời gian thực.')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [roomId, user])

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
  
  // 5. GIAO DIỆN (Đã cập nhật CSS Module)

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
      {/* 💖 (Req 3.2) Hiển thị Tên Phòng 💖 */}
      <h1 className={styles.title}>
        Phòng: {room.room_name}
      </h1>
      
      {/* 💖 (Req 3.1) Hiển thị Tên Hạng Bằng 💖 */}
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
      
      {/* (Live Dashboard (Req 3.3) sẽ được thêm vào đây ở bước sau) */}

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