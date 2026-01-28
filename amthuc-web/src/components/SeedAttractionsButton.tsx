// Component seed data cho 14 địa điểm du lịch Ninh Bình
// Dựa trên bảng giá vé tháng 6/2025

import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Attraction, TicketType } from '../types'
import { useState } from 'react'

// Dữ liệu 14 địa điểm từ bảng giá vé
const ATTRACTIONS_DATA: Omit<Attraction, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
        name: 'Phố Cổ Hoa Lư',
        distance: 0.3,
        description: 'Khu phố cổ với kiến trúc truyền thống, đi thuyền ngắm cảnh sông núi',
        category: 'culture',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Vé vào cổng', price: 0 },
            { name: 'Thuyền thường', condition: 'Thuyền ko có mái che, ko trà bính', price: 400000 },
            { name: 'Thuyền VIP', condition: 'Có mái che, có trà bánh, hoa đăng', price: 900000 }
        ]
    },
    {
        name: 'Tràng An',
        distance: 5.3,
        description: 'Di sản thế giới UNESCO, hệ thống hang động và thung lũng ngập nước',
        category: 'nature',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Trẻ em 1m-1.3m, người già trên 60', price: 120000 },
            { name: 'Người lớn cao trên 1.3m', price: 250000 },
            { name: 'Combo Tràng An + Đảo Khê Cốc', price: 300000 },
            { name: 'Combo Tràng An + Đảo Khê Cốc (trẻ em 1m-1.3m)', price: 150000 }
        ]
    },
    {
        name: 'Tam Cốc',
        distance: 8.5,
        description: 'Vịnh Hạ Long trên cạn với 3 hang động nổi tiếng',
        category: 'nature',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Trẻ em 1m-1.3m, người già trên 60', price: 120000 },
            { name: 'Người lớn cao trên 1.3m', price: 250000 }
        ]
    },
    {
        name: 'Bái Đính',
        distance: 19,
        description: 'Quần thể chùa lớn nhất Việt Nam với nhiều kỷ lục châu Á',
        category: 'culture',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Xe điện khứ hồi + bảo tháp', condition: 'Người lớn', price: 150000 },
            { name: 'Xe điện khứ hồi + bảo tháp', condition: 'Trẻ em', price: 100000 },
            { name: 'Xe điện trung chuyển toàn tuyến + bảo tháp + ngâm thảo dược', condition: 'Người lớn', price: 300000 },
            { name: 'Xe điện trung chuyển toàn tuyến + bảo tháp + ngâm thảo dược', condition: 'Trẻ em', price: 210000 }
        ]
    },
    {
        name: 'Hang Múa',
        distance: 6,
        description: '500 bậc thang đá lên đỉnh núi ngắm toàn cảnh Tam Cốc',
        category: 'nature',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Người lớn cao trên 1.3m', price: 100000 }
        ]
    },
    {
        name: 'Thung Nham',
        distance: 15,
        description: 'Khu sinh thái với vườn chim, hang động và suối nước nóng',
        category: 'nature',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Trẻ em cao từ 1m - 1.3m', price: 100000 },
            { name: 'Người lớn cao trên 1.3m', price: 150000 }
        ]
    },
    {
        name: 'Tuyệt Tình Cốc',
        distance: 9,
        description: 'Am Tiên cổ tự với phong cảnh núi non hùng vĩ',
        category: 'nature',
        purchaseMethod: 'quay',
        ticketTypes: [
            { name: 'Vé vào', price: 0 },
            { name: 'Trẻ em 1m-1.3m (đoàn học sinh)', price: 20000 },
            { name: 'Người lớn cao trên 1.3m', price: 50000 }
        ]
    },
    {
        name: 'Đầm Vân Long',
        distance: 17,
        description: 'Khu bảo tồn thiên nhiên ngập nước, nơi quay phim Kong',
        category: 'nature',
        purchaseMethod: 'quay',
        ticketTypes: [
            { name: 'Vé vào', price: 0 },
            { name: 'Trẻ em 1m-1.3m (người già trên 60)', price: 50000 },
            { name: 'Người lớn cao trên 1.3m', price: 100000 }
        ]
    },
    {
        name: 'Cố Đô Hoa Lư',
        distance: 11,
        description: 'Kinh đô cổ đầu tiên của Việt Nam với đền thờ vua Đinh, Lê',
        category: 'culture',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Người lớn cao trên 1.3m', price: 20000 },
            { name: 'Đoàn học sinh các cấp được giảm giá', price: 0, condition: 'Liên hệ: 0916910480' }
        ]
    },
    {
        name: 'Động Thiên Hà',
        distance: 23,
        description: 'Động khô đẹp nhất Ninh Bình với thạch nhũ lấp lánh như dải ngân hà',
        category: 'adventure',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Trẻ em cao từ 1m - 1.3m', price: 100000 },
            { name: 'Người lớn cao trên 1.3m', price: 200000 }
        ]
    },
    {
        name: 'Tắm khoáng Kênh Gà',
        distance: 23,
        description: 'Suối nước nóng tự nhiên, tắm khoáng thư giãn',
        category: 'relax',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Ngày thường (người lớn)', price: 350000 },
            { name: 'Ngày thường (trẻ em)', price: 175000 },
            { name: 'Ngày cuối tuần (người lớn)', price: 400000 },
            { name: 'Ngày cuối tuần (trẻ em)', price: 200000 }
        ]
    },
    {
        name: 'Hồ Đồng Chương',
        distance: 32,
        description: 'Hồ nước trong xanh giữa núi rừng, đạp xe và chèo thuyền',
        category: 'relax',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Vé vào + xe đạp', condition: 'Người lớn', price: 150000 },
            { name: 'Vé vào + xe đạp', condition: 'Trẻ em', price: 75000 },
            { name: 'Vé vào + xe điện', condition: 'Người lớn', price: 250000 },
            { name: 'Trẻ em dưới 1m', price: 0 }
        ]
    },
    {
        name: 'Bảo tồn gấu',
        distance: 34,
        description: 'Trung tâm cứu hộ gấu Four Paws, tham quan và tìm hiểu về gấu',
        category: 'nature',
        purchaseMethod: 'online',
        ticketTypes: [
            { name: 'Trẻ em dưới 1m', price: 0 },
            { name: 'Trẻ em cao từ 1m - 1.3m', price: 125000 },
            { name: 'Người lớn cao trên 1.3m', price: 250000 }
        ]
    },
    {
        name: 'Rừng Cúc Phương',
        distance: 39,
        description: 'Vườn quốc gia cổ nhất Việt Nam với hệ sinh thái đa dạng',
        category: 'nature',
        purchaseMethod: 'quay',
        ticketTypes: [
            { name: 'Người lớn cao trên 1.3m', price: 60000 },
            { name: 'Sinh viên', price: 20000 },
            { name: 'Học sinh và trẻ em cao từ 1m - 1.3m', price: 10000 }
        ]
    }
]

interface SeedAttractionsButtonProps {
    onComplete?: () => void
}

function SeedAttractionsButton({ onComplete }: SeedAttractionsButtonProps) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('')

    const seedData = async () => {
        // Tạm bỏ confirm để test
        // if (!confirm('Bạn có chắc muốn thêm 14 địa điểm du lịch vào database?')) return

        setLoading(true)
        setStatus('Đang thêm dữ liệu...')

        try {
            const attractionsRef = collection(db, 'attractions')
            let count = 0

            for (const attraction of ATTRACTIONS_DATA) {
                await addDoc(attractionsRef, {
                    ...attraction,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                count++
                setStatus(`Đã thêm ${count}/${ATTRACTIONS_DATA.length} địa điểm...`)
            }

            setStatus(`✅ Hoàn thành! Đã thêm ${count} địa điểm.`)
            onComplete?.()
        } catch (error) {
            console.error('Lỗi:', error)
            setStatus(`❌ Lỗi: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    const clearData = async () => {
        if (!confirm('Bạn có chắc muốn XÓA TẤT CẢ địa điểm?')) return

        setLoading(true)
        setStatus('Đang xóa dữ liệu...')

        try {
            const attractionsRef = collection(db, 'attractions')
            const snapshot = await getDocs(attractionsRef)

            let count = 0
            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, 'attractions', docSnap.id))
                count++
            }

            setStatus(`✅ Đã xóa ${count} địa điểm.`)
            onComplete?.()
        } catch (error) {
            console.error('Lỗi:', error)
            setStatus(`❌ Lỗi: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0' }}>🏔️ Seed Địa Điểm Du Lịch</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button
                    onClick={seedData}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        background: loading ? '#ccc' : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? '⏳ Đang xử lý...' : '➕ Thêm 14 địa điểm'}
                </button>
                <button
                    onClick={clearData}
                    disabled={loading}
                    style={{
                        padding: '8px 16px',
                        background: loading ? '#ccc' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    🗑️ Xóa tất cả
                </button>
            </div>
            {status && <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{status}</p>}
        </div>
    )
}

export default SeedAttractionsButton
