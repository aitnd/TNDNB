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
}

export default function CreateRoomForm() {
  const { user } = useAuth() 
  const router = useRouter() 

  // (Não trạng thái - Giữ nguyên)
  const [licenses, setLicenses] = useState<License[]>([]) 
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>('') 
  const [roomName, setRoomName] = useState('') 

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

  // 5. HÀM TẠO PHÒNG THI (Giữ nguyên)
  //    (Vì hàm này VỐN DĨ đã dùng Firestore, nên không cần sửa)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLicenseId || !roomName) {
      setError('Vui lòng điền "Tên phòng" và chọn "Hạng bằng".')
      return
    }

    setIsCreating(true)
    setError(null)
    console.log(`Đang tạo phòng thi [${roomName}]...`)

    const selectedLicense = licenses.find(l => l.id === selectedLicenseId);
    const licenseFullName = selectedLicense ? selectedLicense.name : selectedLicenseId;

    try {
      const roomCollection = collection(db, 'exam_rooms')
      const newRoomDoc = await addDoc(roomCollection, {
        license_id: selectedLicenseId, 
        license_name: licenseFullName, 
        room_name: roomName, 
        teacher_id: user.uid,
        teacher_name: user.fullName, 
        status: 'waiting', 
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
          />
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
            >
              {licenses.map((license) => (
                <option key={license.id} value={license.id}>
                  {license.name}
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