'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore'
import StudentCard from './StudentCard' // 💖 IMPORT STUDENT CARD 💖
import styles from './JoinRoomList.module.css'

interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string;
  room_name: string;
  teacher_name: string;
  status: string;
  created_at: Timestamp;
}

export default function JoinRoomList() {
  const { user } = useAuth()
  const router = useRouter()

  const [rooms, setRooms] = useState<ExamRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 💖 KHÔNG CÒN STATE TAB NỮA 💖

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

  const handleJoinRoom = (roomId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/thi-online/${roomId}`)
  }

  if (!user) {
    return <p>Vui lòng đăng nhập để xem danh sách phòng thi.</p>
  }

  return (
    <div className={styles.container}>

      {/* 💖 HIỂN THỊ THẺ HỌC VIÊN LUÔN 💖 */}
      <div style={{ marginBottom: '24px' }}>
        <StudentCard />
      </div>

      <h2 className={styles.listTitle}>
        Danh sách Phòng Thi Đang Chờ
      </h2>

      {loading && <p>Đang tìm phòng thi...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {
        !loading && rooms.length === 0 && (
          <p className={styles.emptyState}>
            Hiện chưa có phòng thi nào. Vui lòng chờ giáo viên tạo phòng.
          </p>
        )
      }

      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div
            key={room.id}
            className={styles.roomItem}
          >
            <div className={styles.roomInfo}>
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
    </div >
  )
}