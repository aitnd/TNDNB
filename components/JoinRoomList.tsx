// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../utils/firebaseClient' // (Sửa đường dẫn ../)
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore'

// 1. "Triệu hồi" file CSS Module MỚI
import styles from './JoinRoomList.module.css' 

// 2. Định nghĩa "kiểu" của Phòng thi (NÂNG CẤP)
interface ExamRoom {
  id: string; // ID của document
  license_id: string;
  license_name: string; // (Tên đầy đủ: Máy trưởng...)
  room_name: string; // (Tên phòng: 123)
  teacher_name: string;
  status: string;
  created_at: Timestamp;
}

export default function JoinRoomList() {
  const router = useRouter() // "Điều hướng"

  // "Não" trạng thái
  const [rooms, setRooms] = useState<ExamRoom[]>([]) 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. "Phép thuật" Realtime (useEffect) - (Giữ nguyên)
  useEffect(() => {
    console.log('[HV] Bắt đầu "lắng nghe" phòng chờ...')
    
    const roomCollection = collection(db, 'exam_rooms')
    const q = query(roomCollection, where('status', '==', 'waiting'))

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const waitingRooms: ExamRoom[] = []
        querySnapshot.forEach((doc) => {
          waitingRooms.push({
            id: doc.id,
            ...doc.data()
          } as ExamRoom)
        })
        
        waitingRooms.sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis())
        
        setRooms(waitingRooms) 
        setLoading(false)
        console.log('[HV] Đã cập nhật danh sách phòng chờ:', waitingRooms)
      }, 
      (err) => {
        console.error('Lỗi khi "lắng nghe" phòng chờ:', err)
        setError('Không thể tải danh sách phòng thi.')
        setLoading(false)
      }
    )
    return () => {
      console.log('Ngừng "lắng nghe" phòng chờ.')
      unsubscribe()
    }
  }, []) 

  // 4. Hàm xử lý khi Học viên bấm "Vào Phòng" (Giữ nguyên)
  const handleJoinRoom = (roomId: string) => {
    console.log(`Học viên yêu cầu vào phòng: ${roomId}`)
    router.push(`/thi-online/${roomId}`)
  }

  // 5. GIAO DIỆN (Đã "mặc" CSS mới và sửa Tên)
  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>
        Danh sách Phòng Thi Đang Chờ
      </h2>

      {loading && <p>Đang tìm phòng thi...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!loading && rooms.length === 0 && (
        <p>
          Hiện chưa có phòng thi nào. Vui lòng chờ giáo viên tạo phòng.
        </p>
      )}

      {/* "Vẽ" danh sách phòng */}
      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div 
            key={room.id}
            className={styles.roomItem}
          >
            <div className={styles.roomInfo}>
              {/* 💖 (Req 1) HIỂN THỊ TÊN PHÒNG VÀ TÊN HẠNG BẰNG 💖 */}
              <h3>{room.room_name}</h3>
              <p>Hạng thi: {room.license_name}</p>
              <p>Giáo viên: {room.teacher_name}</p>
              <p className={styles.roomId}>
                (ID Phòng: {room.id})
              </p>
            </div>
            <button
              onClick={() => handleJoinRoom(room.id)}
              className={styles.joinButton}
            >
              Vào Phòng
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}