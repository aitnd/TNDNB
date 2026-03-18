// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// 1. 💖 BỎ (import { supabase }) 💖
// import { supabase } from '../utils/supabaseClient' 

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
  const [allowReview, setAllowReview] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('') // Mật khẩu

  // 💖 STATE CHO KHÓA HỌC 💖
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')

  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 4. 💖 HÀM LẤY HẠNG BẰNG (ĐÃ "PHẪU THUẬT" 100%) 💖
  useEffect(() => {
    async function fetchLicenses() {
      console.log('[GV] Đang gọi "kho" Firestore để lấy Hạng Bằng...')

      try {
        // (Truy vấn collection 'licenses', sắp xếp theo 'display_order')
        const licensesRef = collection(db, 'licenses');
        const q = query(licensesRef, orderBy('display_order', 'asc'));
        const querySnapshot = await getDocs(q);

        const data: License[] = [];
        querySnapshot.forEach((doc) => {
          // (ID là 'doc.id', data là 'doc.data()')
          data.push({
            id: doc.id,
            ...doc.data()
          } as License);
        });

        setLicenses(data)
        if (data && data.length > 0) {
          setSelectedLicenseId(data[0].id) // (Chọn ID đầu tiên)
        }

      } catch (err: any) {
        console.error('Lỗi khi lấy Hạng Bằng (Firestore):', err)
        setError('Không thể tải danh sách hạng bằng từ Firestore.')
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
    if (!user || !selectedLicenseId || !roomName || !duration || duration <= 0) {
      setError('Vui lòng điền "Tên phòng", chọn "Hạng bằng" và nhập "Thời gian làm bài" hợp lệ.')
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
        allow_review: allowReview, // Thêm tùy chọn xem lại
        course_id: selectedCourseId || null, // Lưu ID khóa học
        course_name: selectedCourse?.name || null, // Lưu tên khóa học
        password: password || null, // Lưu mật khẩu (nếu có)
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
            {"Tên phòng thi (Ví dụ: \"Thi thử M1 - Lần 1\")"}
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

        {/* 💖 MẬT KHẨU PHÒNG (MỚI) 💖 */}
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Mật khẩu phòng (Tùy chọn):
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Để trống nếu không cần mật khẩu"
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
