'use client'

import { useState } from 'react'
import { supabase } from '../../utils/supabaseClient'

export default function SeedPage() {
    const [status, setStatus] = useState('')

    const seedData = async () => {
        setStatus('Đang tạo dữ liệu...')
        try {
            // 1. Tạo Văn bản pháp quy
            const { error: postError } = await supabase.from('posts').insert([
                {
                    title: 'Quyết định về việc ban hành quy chế đào tạo',
                    category_id: 'van-ban-phap-quy',
                    content: 'Nội dung mẫu...',
                    author_id: 'admin', // Giả định
                    is_featured: false
                },
                {
                    title: 'Thông tư hướng dẫn thi thuyền viên',
                    category_id: 'van-ban-phap-quy',
                    content: 'Nội dung mẫu...',
                    author_id: 'admin',
                    is_featured: false
                }
            ])

            if (postError) throw postError

            // 2. Tạo Tài liệu mới (Media Library)
            const { error: fileError } = await supabase.from('media_library').insert([
                {
                    media_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    media_type: 'document',
                    file_name: 'Huong_dan_on_tap.pdf'
                },
                {
                    media_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    media_type: 'document',
                    file_name: 'Bo_de_thi_mau.pdf'
                }
            ])

            if (fileError) throw fileError

            setStatus('✅ Đã tạo dữ liệu mẫu thành công! Hãy quay lại trang chủ để kiểm tra.')
        } catch (error: any) {
            setStatus('❌ Lỗi: ' + error.message)
            console.error(error)
        }
    }

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Tạo Dữ Liệu Mẫu</h1>
            <button
                onClick={seedData}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#004a99',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Bấm vào đây để tạo dữ liệu mẫu
            </button>
            <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{status}</p>
        </div>
    )
}
