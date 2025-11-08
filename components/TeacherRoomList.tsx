// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/firebaseClient'
// (Import "đồ nghề" Realtime và "Đóng phòng")
import { collection, query, where, onSnapshot, Timestamp, doc, updateDoc, orderBy } from 'firebase/firestore'

// (Import CSS Module)
import styles from './TeacherRoomList.module.css' 

// (Định nghĩa "kiểu" của Phòng thi - Giống JoinRoomList)
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string;
  room_name: string;
  teacher_id: string; // (Thêm teacher_id để lọc)
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
  const [error, setError] = useState<string | null>(null)

  // 1. "Phép thuật" Realtime (Nâng cấp Req 2+3)
  useEffect(() => {
    if (!user) return; // (Chờ "Bộ não" Auth)

    console.log(`[GV] Bắt đầu "lắng nghe" Dashboard... Vai trò: ${user.role}`)
    
    // 1.1. Tạo "câu truy vấn" (query)
    const roomCollection = collection(db, 'exam_rooms');
    let q; // (Biến query)
    
    // 💖 (Req 3) Phân quyền Admin / Giáo viên 💖
    if (user.role === 'admin' || user.role === 'lanh_dao') {
      // (Admin/Lãnh đạo: Thấy HẾT TẤT CẢ các phòng)
      q = query(roomCollection, orderBy('created_at', 'desc'));
    } else {
      // (Giáo viên: Chỉ thấy phòng CỦA MÌNH)
      q = query(
        roomCollection, 
        where('teacher_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
    }

    // 1.2. "Gắn tai nghe" (onSnapshot)
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const roomList: ExamRoom[] = []
        querySnapshot.forEach((doc) => {
          roomList.push({ id: doc.id, ...doc.data() } as ExamRoom)
        })
        
        setRooms(roomList) 
        setLoading(false)
        console.log('[GV] Đã cập nhật Dashboard:', roomList.length)
      }, 
      (err) => {
        console.error('Lỗi khi "lắng nghe" Dashboard:', err)
        setError('Không thể tải danh sách phòng thi.')
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [user]) // (Chạy lại nếu 'user' thay đổi)

  // 2. 💖 HÀM MỚI: "ĐÓNG PHÒNG" (Req 3) 💖
  const handleCloseRoom = async (roomId: string) => {
    if (!confirm('Bạn có chắc chắn muốn "Đóng" phòng thi này không? (Học viên sẽ không thể vào thi nữa)')) {
      return;
    }

    console.log(`[GV/Admin] Yêu cầu đóng phòng: ${roomId}`)
    const roomRef = doc(db, 'exam_rooms', roomId);
    try {
      await updateDoc(roomRef, {
        status: 'finished'
      });
      console.log('Đóng phòng thành công!')
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đóng phòng.')
    }
  }

  // 3. HÀM MỚI: (Vào xem phòng chi tiết)
  const handleViewRoom = (roomId: string) => {
    router.push(`/quan-ly/${roomId}`)
  }

  // 4. GIAO DIỆN (Dashboard)
  return (
    <div className={styles.listContainer}>
      <h2 className={styles.listTitle}>
        Dashboard: Danh sách Phòng thi
      </h2>

      {loading && <p>Đang tải danh sách phòng...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!loading && rooms.length === 0 && (
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
              <th>Hạng Bằng</th>
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
                <td style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    onClick={() => handleViewRoom(room.id)}
                    className={styles.closeButton}
                    style={{backgroundColor: '#004a99'}} // (Màu xanh)
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => handleCloseRoom(room.id)}
                    className={styles.closeButton}
                    disabled={room.status === 'finished'} // (Nếu đã "Kết thúc" thì vô hiệu hóa)
                  >
                    Đóng
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}