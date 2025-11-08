// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// "Tổng đài" Supabase (để ĐỌC danh sách hạng bằng)
import { supabase } from '@/utils/supabaseClient' 
// "Tổng đài" Firebase (để GHI phòng thi)
import { db } from '@/utils/firebaseClient' 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
// "Bộ não" Auth (để lấy tên giáo viên)
import { useAuth } from '@/context/AuthContext' 

// Định nghĩa "kiểu" của Hạng Bằng (từ Supabase)
type License = {
  id: string
  name: string
  display_order: number
}

export default function CreateRoomForm() {
  const { user } = useAuth() // Lấy thông tin giáo viên
  const router = useRouter() // "Điều hướng"

  // Các "não" trạng thái
  const [licenses, setLicenses] = useState<License[]>([]) // Danh sách hạng bằng
  const [selectedLicense, setSelectedLicense] = useState<string>('') // Hạng bằng đang chọn
  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [isCreating, setIsCreating] = useState(false) // Đang bấm nút "Tạo"
  const [error, setError] = useState<string | null>(null)

  // 1. "Phép thuật" tự chạy 1 lần: Lấy danh sách Hạng Bằng từ Supabase
  useEffect(() => {
    async function fetchLicenses() {
      console.log('Đang gọi "kho báu" Supabase để lấy Hạng Bằng...')
      
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('Lỗi khi lấy Hạng Bằng:', error)
        setError('Không thể tải danh sách hạng bằng từ Supabase.')
      } else {
        console.log('Lấy Hạng Bằng thành công:', data)
        setLicenses(data as License[])
        // Tự động chọn hạng bằng đầu tiên
        if (data && data.length > 0) {
          setSelectedLicense(data[0].id)
        }
      }
      setLoadingLicenses(false)
    }

    fetchLicenses()
  }, []) // Chạy 1 lần duy nhất

  // 2. HÀM XỬ LÝ "TẠO PHÒNG THI" (Nghiệp vụ chính)
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLicense) {
      setError('Bạn phải chọn một hạng bằng để tạo phòng.')
      return
    }

    setIsCreating(true)
    setError(null)
    console.log(`Đang tạo phòng thi cho [${selectedLicense}]...`)

    try {
      // 3. GHI VÀO "TỦ" FIRESTORE (Realtime)
      const roomCollection = collection(db, 'exam_rooms')
      const newRoomDoc = await addDoc(roomCollection, {
        license_id: selectedLicense, // Hạng bằng sẽ thi
        teacher_id: user.uid, // ID giáo viên
        teacher_name: user.email, // Tên giáo viên
        status: 'waiting', // Trạng thái "Đang chờ"
        created_at: serverTimestamp(),
        // exam_data: null (sẽ được cập nhật khi "Phát đề")
        // participants: [] (sẽ được cập nhật khi HV vào)
      })

      console.log('Tạo phòng thi trên Firestore thành công! ID:', newRoomDoc.id)
      
      // 4. "Đẩy" giáo viên vào phòng quản lý phòng thi đó
      // (Trang này CHƯA TỒN TẠI, nhưng chúng ta sẽ làm ở bước sau)
      router.push(`/quan-ly/${newRoomDoc.id}`)

    } catch (err: any) {
      console.error('Lỗi khi tạo phòng thi trên Firestore:', err)
      setError(err.message || 'Lỗi khi tạo phòng thi.')
      setIsCreating(false)
    }
  }

  // 3. GIAO DIỆN
  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md border border-blue-200">
      <h2 className="mb-4 text-2xl font-semibold text-blue-800">
        Tạo Phòng Thi Mới
      </h2>
      <form onSubmit={handleCreateRoom}>
        <div className="mb-4">
          <label 
            htmlFor="license" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chọn Hạng Bằng (Lấy từ Supabase):
          </label>
          {loadingLicenses ? (
            <p>Đang tải danh sách hạng bằng...</p>
          ) : (
            <select
              id="license"
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingLicenses || isCreating || licenses.length === 0}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
        >
          {isCreating ? 'Đang tạo...' : 'Tạo Phòng'}
        </button>
      </form>
    </div>
  )
}