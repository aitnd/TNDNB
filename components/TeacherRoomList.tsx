// File: components/TeacherRoomList.tsx
// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, Timestamp, doc, updateDoc, orderBy, deleteDoc } from 'firebase/firestore'
import styles from './TeacherRoomList.module.css'
import Link from 'next/link'

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
  course_name?: string; // Tên khóa học
}

export default function TeacherRoomList() {
  const { user } = useAuth()
  const router = useRouter()

  // "Não" trạng thái
  const [rooms, setRooms] = useState<ExamRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // (Lỗi sẽ được lưu ở đây)

  // Helper function to translate status
  const dichTrangThai = (status: 'waiting' | 'in_progress' | 'finished') => {
    switch (status) {
      case 'waiting': return 'Đang chờ';
      case 'in_progress': return 'Đang thi';
      case 'finished': return 'Đã kết thúc';
      default: return status;
    }
  };

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

  // 2. HÀM XÓA PHÒNG (Mới)
  const handleDeleteRoom = async (roomId: string, roomName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng thi "${roomName}" không? Hành động này không thể hoàn tác!`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'exam_rooms', roomId));
      alert(`Đã xóa phòng thi "${roomName}" thành công.`);
    } catch (err: any) {
      console.error('Lỗi khi xóa phòng:', err);
      alert('Lỗi khi xóa phòng: ' + err.message);
    }
  }

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
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
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
              <th>Tên phòng</th>
              <th>Khóa học (Lớp)</th> {/* Cột mới */}
              <th>Hạng bằng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>
                  <strong>{room.room_name}</strong>
                  <br />
                  <span className={styles.teacherName}>GV: {room.teacher_name}</span>
                </td>
                <td>
                  {room.course_name ? (
                    <span style={{ background: '#e6f7ff', color: '#0070f3', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {room.course_name}
                    </span>
                  ) : (
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>Tự do</span>
                  )}
                </td>
                <td>{room.license_name}</td>
                <td>
                  <span className={`${styles.status} ${styles[room.status]}`}>
                    {dichTrangThai(room.status)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <Link href={`/quan-ly/${room.id}`} className={styles.manageBtn}>
                      Quản lý
                    </Link>
                    {/* Nút Xóa (Chỉ hiện nếu có quyền) */}
                    {(user?.role === 'admin' || user?.role === 'lanh_dao' || (user?.role === 'giao_vien' && room.teacher_id === user.uid)) && (
                      <button
                        onClick={() => handleDeleteRoom(room.id, room.room_name)}
                        className={styles.deleteBtn}
                        title="Xóa phòng thi"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}