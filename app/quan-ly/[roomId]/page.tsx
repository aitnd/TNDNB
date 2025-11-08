// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/utils/firebaseClient' // "Tổng đài" Firebase

// 💖 THÊM 'serverTimestamp' VÀO ĐÂY 💖
import { doc, onSnapshot, updateDoc, Timestamp, DocumentData, serverTimestamp } from 'firebase/firestore'
import ProtectedRoute from '@/components/ProtectedRoute' // "Lính gác"

// Định nghĩa "kiểu" của Phòng thi (đọc từ Firestore)
interface ExamRoom {
  id: string;
  license_id: string;
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
  const [isStarting, setIsStarting] = useState(false) // Trạng thái "đang phát đề"

  // 1. "Phép thuật" Realtime (useEffect)
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

  // 2. HÀM XỬ LÝ "PHÁT ĐỀ" (Nghiệp vụ chính)
  const handleStartExam = async () => {
    if (!room) return
    setIsStarting(true)
    setError(null)
    console.log(`[GV] Yêu cầu "phát đề" cho hạng: ${room.license_id}`)

    try {
      // 2.1. "Gõ cửa" "Phòng bí mật" (API) để "xin" bộ đề
      //    (Dùng link tương đối /api/... để nó tự hiểu)
      const res = await fetch(`/api/thi/${room.license_id}`)
      
      if (!res.ok) {
        // Nếu "phòng bí mật" báo lỗi (lỗi 500, 404)
        const errorData = await res.json()
        throw new Error(errorData.error || `Lỗi máy chủ: ${res.status}`)
      }
      
      const examData = await res.json()

      console.log('[GV] "Xin" đề từ API thành công!')

      // 2.2. "Bật công tắc" trên Firestore
      const roomRef = doc(db, 'exam_rooms', roomId)
      await updateDoc(roomRef, {
        status: 'in_progress',
        exam_data: examData, // Lưu bộ đề đã "trộn"
        started_at: serverTimestamp() // (Giờ đã hợp lệ!)
      })

      console.log('[GV] "PHÁT ĐỀ" THÀNH CÔNG! Học viên sẽ nhận được đề.')
      
    } catch (err: any) {
      console.error('[GV] Lỗi khi "phát đề":', err)
      setError(err.message)
      setIsStarting(false)
    }
  }
  
  // 3. GIAO DIỆN
  // (Phần giao diện không thay đổi... giữ nguyên)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Đang tải phòng điều khiển...
        </h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-red-600">
          Lỗi: {error}
        </h1>
      </div>
    )
  }

  if (!room) {
    return null; // Trường hợp không tìm thấy phòng
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Phòng Điều Khiển
        </h1>
        <p className="text-lg">
          <span className="font-semibold">Hạng thi:</span> {room.license_id}
        </p>
        <p className="text-lg">
          <span className="font-semibold">Giáo viên:</span> {room.teacher_name}
        </p>
        <p className="text-lg">
          <span className="font-semibold">ID Phòng:</span> {room.id}
        </p>
        
        <div className="my-6 border-t border-b border-gray-200 py-4">
          <h2 className="text-2xl font-semibold">Trạng thái</h2>
          {room.status === 'waiting' && (
            <p className="text-2xl font-bold text-yellow-600">ĐANG CHỜ</p>
          )}
          {room.status === 'in_progress' && (
            <p className="text-2xl font-bold text-green-600">ĐANG THI</p>
          )}
          {room.status === 'finished' && (
            <p className="text-2xl font-bold text-gray-500">ĐÃ KẾT THÚC</p>
          )}
        </div>
        
        {/* Nút "PHÁT ĐỀ" (Chỉ hiện khi đang "chờ") */}
        {room.status === 'waiting' && (
          <button
            onClick={handleStartExam}
            disabled={isStarting}
            className="w-full rounded-md bg-green-600 px-6 py-3 text-xl font-semibold text-white shadow-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isStarting ? 'Đang trộn đề...' : 'BẮT ĐẦU PHÁT ĐỀ'}
          </button>
        )}
        
        {/* Nút "ĐÓNG PHÒNG" (Chỉ hiện khi "đang thi") */}
        {room.status === 'in_progress' && (
          <button
            // (Chúng ta sẽ làm hàm 'handleFinishExam' sau)
            className="w-full rounded-md bg-red-600 px-6 py-3 text-xl font-semibold text-white shadow-lg hover:bg-red-700 disabled:opacity-50"
          >
            ĐÓNG PHÒNG THI (Sắp có...)
          </button>
        )}
        
      </div>
    </div>
  )
}


// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function QuanLyRoomPage() {
  return (
    // "Lính gác" sẽ kiểm tra
    <ProtectedRoute allowedRoles={['giao_vien', 'admin', 'lanh_dao']}>
      <RoomControlDashboard /> 
    </ProtectedRoute>
  )
}