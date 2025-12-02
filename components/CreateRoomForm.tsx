// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// 1. 💖 "TRIỆU HỒI" SUPABASE 💖
import { supabase } from '../utils/supabaseClient'

// 2. 💖 "TRIỆU HỒI" ĐỒ NGHỀ FIRESTORE 💖
import { db } from '../utils/firebaseClient'
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

import styles from '../app/admin/page.module.css'

// 3. 💖 "KIỂU" HẠNG BẰNG (Đọc từ Firestore) 💖
type License = {
  id: string; // (Đây là ID document, ví dụ: 'maytruong-h1')
  name: string;
  display_order: number;
  description?: string;
}

export default function CreateRoomForm() {
  const { user } = useAuth()
  const router = useRouter()

  // (Não trạng thái - Giữ nguyên)
  const [licenses, setLicenses] = useState<License[]>([])
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('')
  const [roomName, setRoomName] = useState('')
  // 💖 THÊM STATE MỚI 💖
  const [duration, setDuration] = useState<number>(45) // Mặc định 45 phút
  const [questionLimit, setQuestionLimit] = useState<number>(30) // Mặc định 30 câu
  const [allowReview, setAllowReview] = useState<boolean>(false)

  // 💖 STATE CHO KHÓA HỌC 💖
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 4. 💖 HÀM LẤY HẠNG BẰNG TỪ SUPABASE (ĐÃ "PHẪU THUẬT" 100%) 💖
  useEffect(() => {
    async function fetchLicenses() {
      console.log('[GV] Đang gọi "kho" Supabase để lấy Hạng Bằng...')

      try {
        // (Truy vấn bảng 'licenses', sắp xếp theo 'display_order')
        const { data, error } = await supabase
          .from('licenses')
          .select('id, name, display_order')
          .order('display_order', { ascending: true })

        if (error) {
          throw error
        }

        if (data) {
          // Map data to match License type if needed, but structure is similar
          const mappedLicenses: License[] = data.map((l: any) => ({
            id: l.id,
            name: l.name,
            display_order: l.display_order
          }))

          setLicenses(mappedLicenses)
          if (mappedLicenses.length > 0) {
            setSelectedLicenseId(mappedLicenses[0].id)
          }
        }

      } catch (err: any) {
        console.error('Lỗi khi lấy Hạng Bằng (Supabase):', err)
        setError('Không thể tải danh sách hạng bằng từ Supabase.')
      } finally {
        setLoadingLicenses(false)
      }
    }

    fetchLicenses()
  }, []) // Chạy 1 lần duy nhất

  // 💖 LẤY DANH SÁCH KHÓA HỌC 💖
  useEffect(() => {
    const fetchCourses = async () => {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const courseData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCourses(courseData)
    }
    fetchCourses()
  }, [])

  // 5. HÀM TẠO PHÒNG THI (Giữ nguyên)
  //    (Vì hàm này VỐN DĨ đã dùng Firestore, nên không cần sửa)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLicenseId || !roomName || !duration || duration <= 0 || !questionLimit || questionLimit <= 0) {
      setError('Vui lòng điền đầy đủ thông tin hợp lệ.')
      return
    }

    setIsCreating(true)
    setError(null)
    console.log(`Đang tạo phòng thi [${roomName}]...`)

    const selectedLicense = licenses.find(l => l.id === selectedLicenseId);
    const licenseFullName = selectedLicense ? selectedLicense.name : selectedLicenseId;
    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    try {
      const roomCollection = collection(db, 'exam_rooms')
      const newRoomDoc = await addDoc(roomCollection, {
        license_id: selectedLicenseId,
        license_name: licenseFullName,
        room_name: roomName,
        teacher_id: user.uid,
        teacher_name: user.fullName,
        status: 'waiting',
        duration: duration, // Thêm thời gian làm bài
        question_limit: questionLimit, // 💖 Thêm giới hạn câu hỏi 💖
        allow_review: allowReview, // Thêm tùy chọn xem lại
        course_id: selectedCourseId || null, // Lưu ID khóa học
        course_name: selectedCourse?.name || null, // Lưu tên khóa học
        created_at: serverTimestamp(),
      })

      console.log('Tạo phòng thi trên Firestore thành công! ID:', newRoomDoc.id)
      router.push(`/quan-ly/${newRoomDoc.id}`)

    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo phòng thi.')
      setIsCreating(false)
    }
  }

  // 6. GIAO DIỆN (Giữ nguyên)
  return (
    <div className={styles.formBox}>
      <h2 className={styles.formTitle}>
        Tạo Phòng Thi Mới
      </h2>
      <form onSubmit={handleCreateRoom} className={styles.form}>

        <div className={styles.formGroup}>
          <label htmlFor="roomName" className={styles.label}>
            Tên phòng thi (Ví dụ: "Thi thử M1 - Lần 1")
          </label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className={styles.input}
            placeholder="Gõ tên phòng thi..."
            required
          />
        </div>

        {/* Chọn Khóa học (MỚI) */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Chọn Khóa học (Lớp thi):</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Không thuộc khóa nào (Tự do) --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="license" className={styles.label}>
            Chọn Hạng Bằng:
          </label>
          {loadingLicenses ? (
            <p>Đang tải danh sách hạng bằng...</p>
          ) : (
            <select
              id="license"
              value={selectedLicenseId}
              onChange={(e) => setSelectedLicenseId(e.target.value)}
              className={styles.select}
              required
            >
              {licenses.map((license) => (
                <option key={license.id} value={license.id}>
                  {license.name} {license.description ? `(${license.description})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="duration" className={styles.label}>
            Thời gian làm bài (phút):
          </label>
          <input
            type="number"
            id="duration"
            min="1"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className={styles.input}
            placeholder="Ví dụ: 45"
            required
          />
        </div>

        {/* 💖 INPUT SỐ CÂU HỎI 💖 */}
        <div className={styles.formGroup}>
          <label htmlFor="questionLimit" className={styles.label}>
            Số lượng câu hỏi:
          </label>
          <input
            type="number"
            id="questionLimit"
            min="1"
            value={questionLimit}
            onChange={(e) => setQuestionLimit(parseInt(e.target.value))}
            className={styles.input}
            placeholder="Ví dụ: 30"
            required
          />
        </div>

        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="allowReview"
            checked={allowReview}
            onChange={(e) => setAllowReview(e.target.checked)}
            style={{ width: '20px', height: '20px' }}
          />
          <label htmlFor="allowReview" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>
            Cho phép xem lại bài sau khi thi xong?
          </label>
        </div>

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loadingLicenses || isCreating || licenses.length === 0}
          className={styles.button}
        >
          {isCreating ? 'Đang tạo...' : 'Tạo Phòng'}
        </button>
      </form>
    </div>
  )
}