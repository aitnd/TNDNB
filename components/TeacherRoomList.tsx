// File: components/TeacherRoomList.tsx
// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, Timestamp, doc, updateDoc, orderBy } from 'firebase/firestore'
import styles from './TeacherRoomList.module.css' 

// (Định nghĩa "kiểu" - Giữ nguyên)
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string;
  room_name: string;
  teacher_id: string; 
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  created_at: Timestamp;
}

export default function TeacherRoomList() {
  const { user } = useAuth()
  const router = useRouter()

  // "Não" trạng thái
  const [rooms, setRooms] = useState<ExamRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // (Lỗi sẽ được lưu ở đây)

  // 1. "Phép thuật" Realtime (Nâng cấp)
  useEffect(() => {
    if (!user) return; 

    console.log(`[GV] Bắt đầu "lắng nghe" Dashboard... Vai trò: ${user.role}`)
    
    const roomCollection = collection(db, 'exam_rooms');
    let q; // (Biến query)
    
    // (Phân quyền Admin / Giáo viên)
    if (user.role === 'admin' || user.role === 'lanh_dao') {
      q = query(roomCollection, orderBy('created_at', 'desc'));
    } else {
      q = query(
        roomCollection, 
        where('teacher_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
    }

    // "Gắn tai nghe" (onSnapshot)
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        // "Có biến!" (Có dữ liệu mới)
        const roomList: ExamRoom[] = []
        querySnapshot.forEach((doc) => {
          roomList.push({ id: doc.id, ...doc.data() } as ExamRoom)
        })
        
        setRooms(roomList) 
        setLoading(false)
        
        // 💖 SỬA LỖI Ở ĐÂY (Vấn đề B): XÓA LỖI CŨ KHI TẢI THÀNH CÔNG 💖
        setError(null) 
        
        console.log('[GV] Đã cập nhật Dashboard:', roomList.length)
      }, 
      (err) => {
        // (Nếu "tai nghe" thật sự bị lỗi - Mất mạng, Lỗi Bảo mật...)
        console.error('Lỗi khi "lắng nghe" Dashboard:', err)
        setError('Không thể tải danh sách phòng thi.')
        setLoading(false)
      }
    )
    return () => unsubscribe() // (Tháo tai nghe khi rời)
  }, [user]) // (Chạy lại nếu 'user' thay đổi)

  // (Hàm "Đóng phòng" - Đã bị xóa)

  // 3. HÀM (Vào xem phòng chi tiết)
  const handleViewRoom = (roomId: string) => {
    router.push(`/quan-ly/${roomId}`)
  }

  // 4. GIAO DIỆN (Dashboard)
  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>
        Danh sách Phòng thi
      </h2>

      {/* (Chỉ hiện "Đang tải..." lúc đầu) */}
      {loading && <p>Đang tải danh sách phòng...</p>}
      
      {/* 💖 SỬA LỖI (Vấn đề B): Lỗi CHỈ hiện khi CÓ lỗi 💖 */}
      {error && !loading && (
        <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>
      )}

      {/* (Chỉ hiện "Không có phòng" khi: 
          KHÔNG Lỗi VÀ KHÔNG Loading VÀ List rỗng) */}
      {!loading && rooms.length === 0 && !error && (
        <p>
          {user?.role === 'admin' ? 'Chưa có phòng thi nào trong hệ thống.' : 'Bạn chưa tạo phòng thi nào.'}
        </p>
      )}

      {/* "Vẽ" Bảng Dashboard */}
      {rooms.length > 0 && (
        <table className={styles.roomTable}>
          <thead>
            <tr>
              <th>Tên Phòng</th>
              <th>Giáo viên</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                {/* Tên Phòng & Tên Hạng Bằng */}
                <td>
                  <div className={styles.roomName}>{room.room_name}</div>
                  <div className={styles.licenseName}>{room.license_name}</div>
                </td>
                {/* Giáo viên */}
                <td>{room.teacher_name}</td>
                {/* Trạng thái */}
                <td>
                  {room.status === 'waiting' && (
                    <span className={`${styles.pill} ${styles.pillWaiting}`}>Đang chờ</span>
                  )}
                  {room.status === 'in_progress' && (
                    <span className={`${styles.pill} ${styles.pillInProgress}`}>Đang thi</span>
                  )}
                  {room.status === 'finished' && (
                    <span className={`${styles.pill} ${styles.pillFinished}`}>Đã kết thúc</span>
                  )}
                </td>
                {/* Hành động */}
                <td style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                  <button
                    onClick={() => handleViewRoom(room.id)}
                    className={styles.actionButton}
                  >
                    Xem
                  </button>
                  {/* (Đã xóa nút "Đóng") */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}