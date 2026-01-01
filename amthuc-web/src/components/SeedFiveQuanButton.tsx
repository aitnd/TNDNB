// Component tạm thời để seed 5 quán từ ảnh - xóa sau khi dùng xong
import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

// 5 quán từ ảnh
const ALL_RESTAURANTS = [
    // 1. Menu Nhà Em
    {
        info: {
            name: 'Menu Nhà Em',
            phone: '0982307002',
            address: 'Không có địa chỉ cụ thể',
            categories: ['Gà', 'Ếch', 'Mì xào', 'Xôi'],
            description: 'Ship ngày & đêm - 0982307002 (ngày) / 0986376661 (đêm)'
        },
        menu: [
            { name: 'Gà hun khói, gà ủ muối', price: 125000, category: 'Gà', isPopular: true },
            { name: 'Chân gà sả tắc, sốt thái', price: 50000, category: 'Gà', isPopular: false },
            { name: 'Gân bò muối rau tiên vua', price: 100000, category: 'Đặc sản', isPopular: false },
            { name: 'Đùi ếch chiên giòn', price: 100000, category: 'Ếch', isPopular: true },
            { name: 'Đùi ếch rang muối', price: 110000, category: 'Ếch', isPopular: false },
            { name: 'Nộm chân gà rút xương', price: 85000, category: 'Gà', isPopular: false },
            { name: 'Nộm tai heo', price: 85000, category: 'Đặc sản', isPopular: false },
            { name: 'Cá trứng chiên giòn', price: 100000, category: 'Cá', isPopular: false },
            { name: 'Chân gà luộc', price: 90000, category: 'Gà', isPopular: false },
            { name: 'Chân gà rang muối', price: 100000, category: 'Gà', isPopular: false },
            { name: 'Cánh gà rang muối', price: 100000, category: 'Gà', isPopular: false },
            { name: 'Gà rang muối', price: 110000, category: 'Gà', isPopular: false },
            { name: 'Dồi sụn', price: 10000, category: 'Đặc sản', isPopular: false },
            { name: 'Xôi chim chiên', price: 60000, category: 'Xôi', isPopular: false },
            { name: 'Óc nhồi ống nứa hấp', price: 80000, category: 'Đặc sản', isPopular: false },
            { name: 'Mì xào bò', price: 40000, category: 'Mì xào', isPopular: true },
            { name: 'Mì xào xúc xích viên chiên', price: 35000, category: 'Mì xào', isPopular: false },
            { name: 'Mì xào Hải sản', price: 40000, category: 'Mì xào', isPopular: false },
            { name: 'Mì xào thập Cẩm', price: 45000, category: 'Mì xào', isPopular: false },
            { name: 'Xôi ruốc, xôi trứng', price: 25000, category: 'Xôi', isPopular: false },
            { name: 'Xôi trắng', price: 20000, category: 'Xôi', isPopular: false },
            { name: 'Xôi lạp xưởng', price: 30000, category: 'Xôi', isPopular: false },
            { name: 'Xôi xúc xích viên chiên', price: 30000, category: 'Xôi', isPopular: false },
            { name: 'Xôi thập cẩm', price: 45000, category: 'Xôi', isPopular: false }
        ]
    },

    // 2. Quán 824 Nguyễn Công Trứ
    {
        info: {
            name: 'Quán 824 Nguyễn Công Trứ',
            phone: '0912912082',
            address: '824 Nguyễn Công Trứ, TP Hoa Lư, Ninh Bình',
            categories: ['Gà', 'Xôi', 'Đặc sản'],
            description: 'Không rõ giờ, có ship buổi chiều'
        },
        menu: [
            { name: 'Gà Luộc', price: 230000, category: 'Gà', isPopular: true },
            { name: 'Gà ủ muối', price: 140000, category: 'Gà', isPopular: true },
            { name: 'Xôi chim chiên', price: 65000, category: 'Xôi', isPopular: false },
            { name: 'Chân Gà Luộc', price: 90000, category: 'Gà', isPopular: false },
            { name: 'Chân gà xả tắc / sốt thái', price: 80000, category: 'Gà', isPopular: false },
            { name: 'Nhông ong xào lá chanh', price: 200000, category: 'Đặc sản', isPopular: true },
            { name: 'Trứng Vịt lộn luộc', price: 80000, category: 'Trứng', isPopular: false },
            { name: 'Dồi sụn chiên', price: 10000, category: 'Đặc sản', isPopular: false },
            { name: 'Lạp xưởng chiên', price: 15000, category: 'Đặc sản', isPopular: false },
            { name: 'Hoa Quả Tổng Hợp', price: 50000, category: 'Đồ uống', isPopular: false }
        ]
    },

    // 3. Ship Đồ Ăn Đêm (Mì Cay, Lẩu Ly)
    {
        info: {
            name: 'Ship Đồ Ăn Đêm (Mì Cay, Lẩu Ly)',
            phone: '0986288397',
            address: 'Không có địa chỉ cụ thể',
            categories: ['Mì cay', 'Lẩu', 'Ăn vặt'],
            description: 'Ship 15:00 - 03:00 sáng - Zalo: 0344851998'
        },
        menu: [
            { name: 'Mì cay (bò, sụn, hải sản)', price: 47500, category: 'Mì cay', isPopular: true },
            { name: 'Mì trộn (trứng ốp, sủi cảo)', price: 35000, category: 'Mì trộn', isPopular: false },
            { name: 'Lẩu ly (bò, sụn, thập cẩm)', price: 40000, category: 'Lẩu', isPopular: true },
            { name: 'Viên chiên', price: 25000, category: 'Ăn vặt', isPopular: false },
            { name: 'Sủi cảo', price: 25000, category: 'Ăn vặt', isPopular: false },
            { name: 'Gà xiên que', price: 25000, category: 'Ăn vặt', isPopular: false },
            { name: 'Xúc xích', price: 25000, category: 'Ăn vặt', isPopular: false },
            { name: 'Lạp xưởng', price: 25000, category: 'Ăn vặt', isPopular: false },
            { name: 'Nem chua rán', price: 25000, category: 'Ăn vặt', isPopular: false }
        ]
    },

    // 4. Quán Ăn Vặt Trần Phú
    {
        info: {
            name: 'Quán Ăn Vặt Trần Phú',
            phone: '0356943456',
            address: 'Số 04 Ngõ 65 Trần Phú (gần Chợ Bóp)',
            categories: ['Nem nướng', 'Bún', 'Mỳ', 'Tokboki', 'Kimbap'],
            description: 'Giờ không rõ'
        },
        menu: [
            { name: 'Nem nướng Nha Trang', price: 35000, category: 'Nem nướng', isPopular: true },
            { name: 'Bún Trộn Nem Nướng', price: 35000, category: 'Bún', isPopular: false },
            { name: 'Bún trộn Bò', price: 39000, category: 'Bún', isPopular: false },
            { name: 'Mỳ trộn', price: 40000, category: 'Mỳ', isPopular: false },
            { name: 'Gà Ủ Muối', price: 149000, category: 'Gà', isPopular: true },
            { name: 'Chân gà sốt thái', price: 50000, category: 'Gà', isPopular: false },
            { name: 'Cơm gà', price: 49000, category: 'Cơm', isPopular: false },
            { name: 'Cơm trộn Hàn Quốc', price: 39000, category: 'Cơm', isPopular: false },
            { name: 'Mỳ Ý', price: 35000, category: 'Mỳ', isPopular: false },
            { name: 'Mỳ cay kim chi (có viên, xúc xích, bò, hải sản)', price: 47000, category: 'Mỳ cay', isPopular: true },
            { name: 'Tokbokki (Gốc phô mai, sốt truyền thống)', price: 37500, category: 'Tokboki', isPopular: false },
            { name: 'Pizza chicago', price: 50000, category: 'Pizza', isPopular: false },
            { name: 'Kimbap (Chiên, Thường, Bò)', price: 35000, category: 'Kimbap', isPopular: false },
            { name: 'Đồ chiên (Nem chua, xúc xích, khoai tây, khoai lang)', price: 30000, category: 'Ăn vặt', isPopular: false }
        ]
    },

    // 5. Quán Ăn Đêm Xuân Thành
    {
        info: {
            name: 'Quán Ăn Đêm Xuân Thành',
            phone: '0368730876',
            address: '516 đường Xuân Thành, TP. Ninh Bình',
            categories: ['Gà', 'Nướng', 'Đặc sản'],
            description: 'Mở 17:00 - Sáng - SĐT: 0342299012'
        },
        menu: [
            { name: 'Chân gà nướng', price: 12000, category: 'Gà', isPopular: true },
            { name: 'Chân gà luộc', price: 12000, category: 'Gà', isPopular: false },
            { name: 'Hàu nướng', price: 6000, category: 'Hải sản', isPopular: false },
            { name: 'Trứng vịt lộn', price: 8000, category: 'Trứng', isPopular: false },
            { name: 'Trứng gà', price: 6000, category: 'Trứng', isPopular: false },
            { name: 'Xiên nướng', price: 12000, category: 'Nướng', isPopular: true },
            { name: 'Mỳ tôm xào (trứng, xúc xích)', price: 35000, category: 'Mì xào', isPopular: false },
            { name: 'Cơm rang (trứng, xúc xích, thập cẩm)', price: 42500, category: 'Cơm', isPopular: false },
            { name: 'Tiết canh', price: 40000, category: 'Đặc sản', isPopular: false }
        ]
    },

    // 6. Bếp Quyết Tiger - Lẩu Ếch Măng Cay
    {
        info: {
            name: 'Bếp Quyết Tiger - Lẩu Ếch Măng Cay',
            phone: '0866969626',
            address: '526 Ngô Gia Tự, P. Nam Bình, TP. Hoa Lư',
            categories: ['Lẩu', 'Ếch', 'Nướng', 'Gà'],
            description: 'Ship đến 24h - Zalo: 0866.969.626'
        },
        menu: [
            { name: 'Lẩu Ếch Măng Cay (nồi 2-3 người)', price: 300000, category: 'Lẩu', isPopular: true },
            { name: 'Lẩu Ếch Măng Cay (nồi 3-4 người)', price: 400000, category: 'Lẩu', isPopular: false },
            { name: 'Lẩu Ếch Măng Cay (nồi 4-5 người)', price: 500000, category: 'Lẩu', isPopular: false },
            { name: 'Lẩu Ếch Măng Cay (nồi 5-6 người)', price: 600000, category: 'Lẩu', isPopular: false },
            { name: 'Sườn Nướng Tảng BBQ (600g)', price: 250000, category: 'Nướng', isPopular: true },
            { name: 'Cá Nướng Muối Ớt (1.3-1.5kg)', price: 250000, category: 'Nướng', isPopular: false },
            { name: 'Gà Ủ Muối (1 con)', price: 290000, category: 'Gà', isPopular: true },
            { name: 'Gà Ủ Muối (nửa con)', price: 150000, category: 'Gà', isPopular: false },
            { name: 'Sụn Gà Rang Muối (1 suất)', price: 120000, category: 'Gà', isPopular: false },
            { name: 'Ếch Chiên Mắm (1 suất)', price: 150000, category: 'Ếch', isPopular: false },
            { name: 'Má Heo Nướng (1 suất)', price: 150000, category: 'Nướng', isPopular: false },
            { name: 'Râu Mực Nướng Muối Ớt (1 suất)', price: 200000, category: 'Nướng', isPopular: false },
            { name: 'Ếch Xào Măng Cay/Rang Muối (1 suất)', price: 150000, category: 'Ếch', isPopular: false }
        ]
    },

    // 7. Ship Đặc Sản Các Vùng Miền
    {
        info: {
            name: 'Ship Đặc Sản Các Vùng Miền',
            phone: '0389363897',
            address: 'Ship full map Ninh Bình',
            categories: ['Đặc sản', 'Bánh'],
            description: 'Zalo/iMessage: 0389363897 - Đặc sản các vùng miền'
        },
        menu: [
            { name: 'Bánh mì cay Hải Phòng', price: 45000, category: 'Bánh', isPopular: true },
            { name: 'Bánh bột lọc Phan Thiết (hộp 500gr)', price: 100000, category: 'Bánh', isPopular: false },
            { name: 'Bánh nậm Huế', price: 48000, category: 'Bánh', isPopular: false },
            { name: 'Bánh ít Huế', price: 47000, category: 'Bánh', isPopular: false },
            { name: 'Bánh tráng mắm ruốc Đà Lạt (bịch 5c)', price: 38000, category: 'Bánh', isPopular: false },
            { name: 'Bánh tráng nướng sate bò (bịch 10c)', price: 40000, category: 'Bánh', isPopular: true },
            { name: 'Khoai lang sấy mật Đà Lạt (gói 500gr)', price: 80000, category: 'Đặc sản', isPopular: false }
        ]
    }
];

interface SeedButtonProps {
    onComplete: () => void
    existingRestaurants: string[]
}

function SeedFiveQuanButton({ onComplete, existingRestaurants }: SeedButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [progress, setProgress] = useState(0)

    // Lọc ra quán chưa tồn tại
    const newRestaurants = ALL_RESTAURANTS.filter(
        r => !existingRestaurants.includes(r.info.name)
    )

    // Nếu tất cả đã tồn tại
    if (newRestaurants.length === 0) {
        return null
    }

    const handleSeed = async () => {
        setStatus('loading')
        setMessage('Đang thêm các quán...')

        try {
            let added = 0
            for (const restaurant of newRestaurants) {
                // Thêm quán
                setMessage(`Đang thêm ${restaurant.info.name}...`)
                const restaurantRef = await addDoc(collection(db, 'restaurants'), {
                    ...restaurant.info,
                    createdAt: serverTimestamp()
                })

                // Thêm menu
                for (const item of restaurant.menu) {
                    await addDoc(collection(db, 'menuItems'), {
                        ...item,
                        restaurantId: restaurantRef.id,
                        isAvailable: true,
                        createdAt: serverTimestamp()
                    })
                }
                added++
                setProgress(Math.round((added / newRestaurants.length) * 100))
            }

            const totalItems = newRestaurants.reduce((sum, r) => sum + r.menu.length, 0)
            setStatus('success')
            setMessage(`✅ Đã thêm ${newRestaurants.length} quán với ${totalItems} món!`)

            setTimeout(() => {
                onComplete()
            }, 1500)

        } catch (error: any) {
            setStatus('error')
            setMessage(`Lỗi: ${error.message}`)
            console.error('Seed error:', error)
        }
    }

    const totalItems = newRestaurants.reduce((sum, r) => sum + r.menu.length, 0)

    return (
        <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            marginBottom: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} />
                Thêm 5 Quán Từ Ảnh
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px' }}>
                {newRestaurants.length} quán mới - {totalItems} món
            </p>
            <ul style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '16px', paddingLeft: '20px' }}>
                {newRestaurants.map((r, i) => (
                    <li key={i}>{r.info.name} ({r.menu.length} món)</li>
                ))}
            </ul>

            <button
                onClick={handleSeed}
                disabled={status === 'loading' || status === 'success'}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: status === 'success' ? '#00F5D4' : 'linear-gradient(135deg, #FF6B6B 0%, #845EC2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    cursor: status === 'loading' || status === 'success' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1
                }}
            >
                {status === 'loading' && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                {status === 'success' && <CheckCircle size={18} />}
                {status === 'error' && <AlertCircle size={18} />}
                {status === 'idle' && `📷 Thêm ${newRestaurants.length} quán`}
                {status === 'loading' && `${progress}%`}
                {status === 'success' && 'Hoàn thành!'}
                {status === 'error' && 'Thử lại'}
            </button>

            {message && (
                <p style={{
                    marginTop: '12px',
                    fontSize: '14px',
                    color: status === 'error' ? '#ff6b6b' : status === 'success' ? '#00F5D4' : 'rgba(255,255,255,0.7)'
                }}>
                    {message}
                </p>
            )}
        </div>
    )
}

export default SeedFiveQuanButton
