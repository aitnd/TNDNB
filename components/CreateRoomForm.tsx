// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient' // (Sửa đường dẫn ../)
import { db } from '../utils/firebaseClient' // (Sửa đường dẫn ../)
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext' // (Sửa đường dẫn ../)

// (Import CSS Module)
import styles from '../app/admin/page.module.css' // (Dùng chung CSS với trang Admin)

// Định nghĩa "kiểu" của Hạng Bằng (từ Supabase)
type License = {
  id: string
  name: string
  display_order: number
}

export default function CreateRoomForm() {
  const { user } = useAuth() 
  const router = useRouter() 

  // "Não" trạng thái
  const [licenses, setLicenses] = useState<License[]>([]) 
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('') 
  
  // 💖 "NÃO" MỚI (Req 3.2) 💖
  const [roomName, setRoomName] = useState('') // Tên phòng (do GV gõ)

  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [isCreating, setIsCreating] = useState(false) 
  const [error, setError] = useState<string | null>(null)

  // 1. Lấy danh sách Hạng Bằng từ Supabase
  useEffect(() => {
    async function fetchLicenses() {
      console.log('Đang gọi Supabase để lấy Hạng Bằng...')
      
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        setError('Không thể tải danh sách hạng bằng từ Supabase.')
      } else {
        setLicenses(data as License[])
        if (data && data.length > 0) {
          setSelectedLicenseId(data[0].id) // (Chọn ID đầu tiên)
        }
      }
      setLoadingLicenses(false)
    }
    fetchLicenses()
  }, []) // Chạy 1 lần duy nhất

  // 2. HÀM XỬ LÝ "TẠO PHÒNG THI" (Nâng cấp)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLicenseId || !roomName) {
      setError('Vui lòng điền "Tên phòng" và chọn "Hạng bằng".')
      return
    }

    setIsCreating(true)
    setError(null)
    console.log(`Đang tạo phòng thi [${roomName}]...`)

    // (Tìm "Tên đầy đủ" của hạng bằng đã chọn)
    const selectedLicense = licenses.find(l => l.id === selectedLicenseId);
    const licenseFullName = selectedLicense ? selectedLicense.name : selectedLicenseId;

    try {
      // 3. GHI VÀO "TỦ" FIRESTORE
      const roomCollection = collection(db, 'exam_rooms')
      const newRoomDoc = await addDoc(roomCollection, {
        license_id: selectedLicenseId, // (ID để "trộn" đề)
        license_name: licenseFullName, // 💖 TÊN ĐẦY ĐỦ (Req 3.1) 💖
        room_name: roomName, // 💖 TÊN PHÒNG (Req 3.2) 💖
        teacher_id: user.uid,
        teacher_name: user.fullName, // 💖 LẤY TÊN GIÁO VIÊN 💖
        status: 'waiting', 
        created_at: serverTimestamp(),
      })

      console.log('Tạo phòng thi trên Firestore thành công! ID:', newRoomDoc.id)
      
      // 4. "Đẩy" giáo viên vào phòng quản lý
      router.push(`/quan-ly/${newRoomDoc.id}`)

    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo phòng thi.')
      setIsCreating(false)
    }
  }

  // 3. GIAO DIỆN (Đã cập nhật)
  return (
    <div className={styles.formBox}>
      <h2 className={styles.formTitle}>
        Tạo Phòng Thi Mới
      </h2>
      <form onSubmit={handleCreateRoom} className={styles.form}>
        
        {/* 💖 (Req 3.2) Thêm Ô "Tên Phòng Thi" 💖 */}
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
          />
        </div>

        <div className={styles.formGroup}>
          {/* 💖 (Req 1) Bỏ chữ "(Lấy từ Supabase)" 💖 */}
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
            >
              {licenses.map((license) => (
                <option key={license.id} value={license.id}>
                  {license.name} (ID: {license.id})
                </option>
              ))}
            </select>
          )}
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