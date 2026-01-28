'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function SetupPage() {
    const [status, setStatus] = useState('Đang xử lý...')

    useEffect(() => {
        const insertCategory = async () => {
            const { error } = await supabase
                .from('categories')
                .upsert({ id: 'gioi-thieu-viec-lam', name: 'Giới thiệu việc làm' })

            if (error) {
                setStatus('Lỗi: ' + error.message)
            } else {
                setStatus('Thành công! Đã thêm danh mục "Giới thiệu việc làm".')
            }
        }
        insertCategory()
    }, [])

    return (
        <div style={{ padding: 50 }}>
            <h1>Setup Database</h1>
            <p>{status}</p>
        </div>
    )
}
