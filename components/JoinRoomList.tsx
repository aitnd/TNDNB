// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// "Tổng đài" Firebase (Realtime)
import { db } from '@/utils/firebaseClient' 
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore'

// 1. Định nghĩa "kiểu" của Phòng thi (đọc từ Firestore)
interface ExamRoom {
  id: string; // ID của document
  license_id: string;
  teacher_name: string;
  status: string;
  created_at: Timestamp;
}

// 💖 DÒNG QUAN TRỌNG NHẤT LÀ DÒNG NÀY 💖
export default function JoinRoomList() {
  const router = useRouter() // "Điều hướng"

  // "Não" trạng thái
  const [rooms, setRooms] = useState<ExamRoom[]>([]) // Danh sách phòng
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 2. "Phép thuật" Realtime (useEffect)
  useEffect(() => {
    console.log('Bắt đầu "lắng nghe" phòng chờ...')
    
    // 2.1. Tạo "câu truy vấn" (query):
    const roomCollection = collection(db, 'exam_rooms')
    const q = query(roomCollection, where('status', '==', 'waiting'))

    // 2.2. "Gắn tai nghe" (onSnapshot)
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        // "Có biến!" (Có dữ liệu mới)
        const waitingRooms: ExamRoom[] = []
        querySnapshot.forEach((doc) => {
          waitingRooms.push({
            id: doc.id,
            ...doc.data()
          } as ExamRoom)
        })
        
        // Sắp xếp cho phòng mới nhất lên đầu
        waitingRooms.sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis())
        
        setRooms(waitingRooms) // Cập nhật "não"
        setLoading(false)
        console.log('Đã cập nhật danh sách phòng chờ:', waitingRooms)
      }, 
      (err) => {
        // "Lỗi!"
        console.error('Lỗi khi "lắng nghe" phòng chờ:', err)
        setError('Không thể tải danh sách phòng thi.')
        setLoading(false)
      }
    )

    // 2.3. "Tháo tai nghe"
    return () => {
      console.log('Ngừng "lắng nghe" phòng chờ.')
      unsubscribe()
    }
  }, []) // Chạy 1 lần duy nhất

  // 3. Hàm xử lý khi Học viên bấm "Vào Phòng"
  const handleJoinRoom = (roomId: string) => {
    console.log(`Học viên yêu cầu vào phòng: ${roomId}`)
    router.push(`/thi-online/${roomId}`)
  }

  // 4. GIAO DIỆN
  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md border border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Danh sách Phòng Thi Đang Chờ
      </h2>

      {loading && <p>Đang tìm phòng thi...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && rooms.length === 0 && (
        <p className="text-gray-600">
          Hiện chưa có phòng thi nào. Vui lòng chờ giáo viên tạo phòng.
        </p>
      )}

      {/* "Vẽ" danh sách phòng */}
      <div className="space-y-4">
        {rooms.map((room) => (
          <div 
            key={room.id}
            className="flex flex-col md:flex-row justify-between items-center rounded-lg border border-gray-300 p-4"
          >
            <div>
              <h3 className="text-xl font-semibold text-blue-700">
                Phòng thi: {room.license_id}
              </h3>
              <p className="text-gray-600">
                Giáo viên: {room.teacher_name}
              </p>
              <p className="text-sm text-gray-500">
                (ID Phòng: {room.id})
              </p>
            </div>
            <button
              onClick={() => handleJoinRoom(room.id)}
              className="mt-3 md:mt-0 w-full md:w-auto rounded-md bg-blue-600 px-6 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Vào Phòng
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}