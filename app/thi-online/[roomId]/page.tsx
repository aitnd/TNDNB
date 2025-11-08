// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/utils/firebaseClient'
import { doc, onSnapshot, DocumentData } from 'firebase/firestore'

// Định nghĩa "kiểu" của Phòng thi (đọc từ Firestore)
interface ExamRoom {
  id: string;
  license_id: string;
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  exam_data?: any; // Bộ đề thi (JSON) sẽ xuất hiện ở đây
}

// (Chúng ta sẽ copy-paste các "kiểu" này từ file API cũ)
type Answer = { id: string; text: string }
type Question = { id: string; text: string; image: string | null; answers: Answer[] }

// --- Component Chính: Trang Chờ & Làm Bài ---
export default function ExamRoomPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth() // "Bộ não" Auth
  const roomId = params.roomId as string // ID của phòng thi

  // "Não" trạng thái
  const [room, setRoom] = useState<ExamRoom | null>(null) // Thông tin phòng
  const [questions, setQuestions] = useState<Question[]>([]) // Bộ đề
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. "Phép thuật" Realtime (useEffect)
  //    "Lắng nghe" CHỈ 1 document (phòng thi) này
  useEffect(() => {
    if (!roomId || !user) return // Chờ có ID phòng và ID người dùng

    console.log(`Bắt đầu "lắng nghe" phòng thi: ${roomId}`)

    // 1.1. Tạo "đường dẫn" (tham chiếu) tới phòng thi
    const roomRef = doc(db, 'exam_rooms', roomId)

    // 1.2. "Gắn tai nghe" (onSnapshot)
    const unsubscribe = onSnapshot(roomRef,
      (docSnap) => {
        if (docSnap.exists()) {
          // "Có biến!" (Phòng thi có cập nhật)
          const roomData = { id: docSnap.id, ...docSnap.data() } as ExamRoom
          setRoom(roomData)
          setLoading(false)
          console.log('Thông tin phòng thi đã cập nhật:', roomData.status)

          // 1.3. 💖 PHÉP THUẬT XẢY RA Ở ĐÂY 💖
          // Nếu "công tắc" bật (giáo viên phát đề)
          if (roomData.status === 'in_progress' && roomData.exam_data) {
            console.log('Giáo viên đã phát đề! Tải bộ đề...')
            setQuestions(roomData.exam_data.questions || [])
            // (Chúng ta sẽ thêm logic đếm giờ ở đây sau)
          }

          if (roomData.status === 'finished') {
            alert('Phòng thi này đã kết thúc.')
            router.push('/quan-ly')
          }

        } else {
          // Lỗi: Không tìm thấy phòng
          console.error('Không tìm thấy phòng thi này!')
          setError('Không tìm thấy phòng thi. Vui lòng kiểm tra lại.')
          setLoading(false)
        }
      },
      (err) => {
        // "Lỗi!" (Mất mạng, không có quyền...)
        console.error('Lỗi khi "lắng nghe" phòng:', err)
        setError('Lỗi kết nối thời gian thực.')
        setLoading(false)
      }
    )

    // "Tháo tai nghe" khi "ra khỏi phòng"
    return () => unsubscribe()

  }, [roomId, user, router]) // Chạy lại nếu ID phòng thay đổi

  // 2. GIAO DIỆN

  // 2.1. Đang tải (chờ Auth hoặc chờ "tai nghe")
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Đang vào phòng thi...
        </h1>
      </div>
    )
  }

  // 2.2. Bị Lỗi
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-red-600">
          Lỗi: {error}
        </h1>
      </div>
    )
  }
  
  // 2.3. TRẠNG THÁI "CHỜ"
  if (room && room.status === 'waiting') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
        <h1 className="mb-4 text-4xl font-bold text-blue-800">
          Phòng Thi: {room.license_id}
        </h1>
        <p className="mb-8 text-xl text-gray-700">
          Giáo viên: {room.teacher_name}
        </p>
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-8 text-2xl font-semibold text-gray-800">
          Đang chờ giáo viên phát đề...
        </p>
      </div>
    )
  }

  // 2.4. TRẠNG THÁI "LÀM BÀI"
  if (room && room.status === 'in_progress' && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-4">
            Đề Thi: {room.license_id}
          </h1>
          <p className="text-center text-lg text-gray-700 mb-10">
            (Tổng cộng: {questions.length} câu)
          </p>

          {/* (Đây là giao diện làm bài giống hệt trang lỗi thời cũ) */}
          <div className="space-y-10">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Câu {index + 1}: {q.text}
                </h2>
                {q.image && (
                  <div className="my-4">
                    <img src={q.image} alt={`Hình ảnh cho câu ${index + 1}`} className="rounded-lg max-w-sm mx-auto" />
                  </div>
                )}
                <div className="space-y-3 mt-4">
                  {q.answers.map((answer) => (
                    <label 
                      key={answer.id} 
                      className="flex items-center p-3 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question_${q.id}`}
                        value={answer.id}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-4 text-gray-800">{answer.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Nút "Nộp bài" (bước tiếp theo) */}
          <div className="mt-12 text-center">
            <button className="px-10 py-4 bg-green-600 text-white font-bold rounded-lg text-xl shadow-lg hover:bg-green-700 transition-colors">
              Nộp Bài
            </button>
          </div>

        </div>
      </div>
    )
  }

  // 2.5. Trạng thái không xác định
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-600">
        Trạng thái phòng thi không xác định.
      </h1>
    </div>
  )
}