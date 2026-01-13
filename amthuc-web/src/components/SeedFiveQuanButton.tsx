// Component để seed data quán - data đã được thêm vào Firebase
// Xóa data cũ, thêm quán mới vào đây
import { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

// Thêm quán mới vào đây - format:
// { info: { name, phone, address, categories, description }, menu: [{ name, price, category, isPopular }] }
const ALL_RESTAURANTS: Array<{
    info: { name: string; phone: string; address: string; categories: string[]; description: string };
    menu: Array<{ name: string; price: number; category: string; isPopular: boolean }>;
}> = [
        // 1. Thạch Dừa Nguyễn Công Trứ
        {
            info: {
                name: 'Thạch Dừa Nguyễn Công Trứ',
                phone: '0987887666',
                address: '690 Nguyễn Công Trứ, TP. Ninh Bình',
                categories: ['Thạch dừa', 'Kem dừa', 'Đồ uống'],
                description: 'Mở 07:00 - 21:00. Nổi tiếng thạch dừa tươi ngon nhất Ninh Bình. Có ship.'
            },
            menu: [
                { name: 'Thạch dừa tươi', price: 15000, category: 'Thạch dừa', isPopular: true },
                { name: 'Thạch dừa đặc biệt', price: 25000, category: 'Thạch dừa', isPopular: true },
                { name: 'Kem dừa', price: 20000, category: 'Kem', isPopular: false },
                { name: 'Kem dừa đặc biệt', price: 30000, category: 'Kem', isPopular: false }
            ]
        },

        // 2. Kem Xôi Thanh Hằng
        {
            info: {
                name: 'Kem Xôi Thanh Hằng',
                phone: '',
                address: 'Phố 8, Lương Văn Tụy, P. Tân Thành, TP. Ninh Bình',
                categories: ['Kem xôi', 'Sữa chua', 'Chè'],
                description: 'Mở 09:00 - 22:00. Kem xôi nổi tiếng nhất Ninh Bình.'
            },
            menu: [
                { name: 'Kem xôi', price: 12000, category: 'Kem xôi', isPopular: true },
                { name: 'Sữa chua cốc', price: 8000, category: 'Sữa chua', isPopular: false },
                { name: 'Kem socola', price: 15000, category: 'Kem', isPopular: false },
                { name: 'Kem đặc biệt Thanh Hằng', price: 15000, category: 'Kem', isPopular: true },
                { name: 'Sinh tố yaourt', price: 20000, category: 'Sinh tố', isPopular: false },
                { name: 'Chè bưởi', price: 15000, category: 'Chè', isPopular: false }
            ]
        },

        // 3. Kem Băng Tuyết
        {
            info: {
                name: 'Kem Băng Tuyết',
                phone: '',
                address: '91 Cù Chính Lan, P. Tân Thành, TP. Ninh Bình',
                categories: ['Kem', 'Sữa chua', 'Sinh tố'],
                description: 'Mở 08:00 - 22:00. Kem trang trí đẹp, không gian check-in.'
            },
            menu: [
                { name: 'Kem đĩa (1 người)', price: 20000, category: 'Kem', isPopular: true },
                { name: 'Kem đĩa trái cây', price: 40000, category: 'Kem', isPopular: true },
                { name: 'Kem đặc biệt', price: 80000, category: 'Kem', isPopular: false },
                { name: 'Sữa chua', price: 15000, category: 'Sữa chua', isPopular: false },
                { name: 'Sinh tố', price: 25000, category: 'Sinh tố', isPopular: false }
            ]
        },

        // 4. Chè Thanh Thảo
        {
            info: {
                name: 'Chè Thanh Thảo',
                phone: '0916622225',
                address: '31 Cù Chính Lan, TP. Ninh Bình',
                categories: ['Chè', 'Sữa chua', 'Ăn vặt'],
                description: 'Mở 09:00 - 22:00. Không gian rộng rãi, trung tâm thành phố.'
            },
            menu: [
                { name: 'Sữa chua mít', price: 18000, category: 'Sữa chua', isPopular: true },
                { name: 'Sữa chua nếp cẩm', price: 18000, category: 'Sữa chua', isPopular: false },
                { name: 'Sữa chua đánh đá dâu', price: 18000, category: 'Sữa chua', isPopular: false },
                { name: 'Matcha', price: 20000, category: 'Đồ uống', isPopular: false },
                { name: 'Bò khô', price: 25000, category: 'Ăn vặt', isPopular: true },
                { name: 'Nem chua rán', price: 25000, category: 'Ăn vặt', isPopular: false },
                { name: 'Hoa quả dầm sữa chua', price: 25000, category: 'Hoa quả', isPopular: false },
                { name: 'Khoai tây chiên', price: 20000, category: 'Ăn vặt', isPopular: false }
            ]
        },

        // 5. Bánh Rán Mặn Ngọt Sài Gòn
        {
            info: {
                name: 'Bánh Rán Mặn Ngọt Sài Gòn',
                phone: '',
                address: 'Gần trường mầm non Nam Thành, đường Trần Phú, P. Phúc Thành',
                categories: ['Bánh rán', 'Ăn vặt'],
                description: 'Mở 14:00 - 21:00. Bánh làm tại chỗ, vỏ giòn thơm bơ. Ship từ 100k.'
            },
            menu: [
                { name: 'Bánh rán ngọt (nhân kem sữa)', price: 2000, category: 'Bánh rán', isPopular: true },
                { name: 'Bánh rán mặn (trứng cút, mộc nhĩ)', price: 3000, category: 'Bánh rán', isPopular: true },
                { name: 'Combo 5 bánh rán', price: 12000, category: 'Bánh rán', isPopular: false }
            ]
        },

        // 6. Chè 17 Phố Vịt
        {
            info: {
                name: 'Chè 17 Phố Vịt',
                phone: '',
                address: '17 Đinh Tiên Hoàng, P. Đông Thành, TP. Ninh Bình',
                categories: ['Chè', 'Ăn vặt'],
                description: 'Mở 08:00 - 22:00. Khu Phố Vịt nổi tiếng. Ship 5k trong TP từ 2 cốc.'
            },
            menu: [
                { name: 'Chè nếp cẩm mít', price: 15000, category: 'Chè', isPopular: true },
                { name: 'Chè sương sa hạt lựu', price: 15000, category: 'Chè', isPopular: false },
                { name: 'Chè caramen dâu', price: 20000, category: 'Chè', isPopular: true },
                { name: 'Chè mít', price: 12000, category: 'Chè', isPopular: false },
                { name: 'Chè bưởi', price: 12000, category: 'Chè', isPopular: false },
                { name: 'Chè thập cẩm', price: 15000, category: 'Chè', isPopular: false },
                { name: 'Chè khúc bạch', price: 20000, category: 'Chè', isPopular: false },
                { name: 'Bánh mì xúc xích', price: 15000, category: 'Ăn vặt', isPopular: false }
            ]
        },

        // 7. Chè Bống
        {
            info: {
                name: 'Chè Bống',
                phone: '0945959679',
                address: '79 Trương Định, P. Vân Gia, TP. Ninh Bình',
                categories: ['Chè', 'Kem', 'Sữa chua', 'Ăn vặt'],
                description: 'Mở 08:00 - 23:00. 2 tầng, có máy lạnh. Menu đa dạng mặn ngọt. Có combo sinh nhật.'
            },
            menu: [
                { name: 'Sữa chua nếp cẩm caramel', price: 18000, category: 'Sữa chua', isPopular: true },
                { name: 'Nem chua rán (5 chiếc)', price: 20000, category: 'Ăn vặt', isPopular: true },
                { name: 'Chè các loại', price: 15000, category: 'Chè', isPopular: false },
                { name: 'Kem các loại', price: 20000, category: 'Kem', isPopular: false },
                { name: 'Gà chiên', price: 40000, category: 'Ăn vặt', isPopular: false },
                { name: 'Mì xào', price: 35000, category: 'Mì', isPopular: false }
            ]
        },

        // 8. Bếp Nhà Hương Béo
        {
            info: {
                name: 'Bếp Nhà Hương Béo',
                phone: '0915803535',
                address: '65 Nguyễn Thái Học, Nhật Tân, Tân Thành, TP. Ninh Bình',
                categories: ['Bún đậu', 'Chè', 'Ăn vặt'],
                description: 'Mở 09:00 - 21:00. Không gian mát có cây sấu, chỗ đỗ xe rộng.'
            },
            menu: [
                { name: 'Bún đậu mắm tôm (đậu + chả cốm)', price: 20000, category: 'Bún đậu', isPopular: true },
                { name: 'Bún đậu đầy đủ', price: 40000, category: 'Bún đậu', isPopular: true },
                { name: 'Chân gà rút xương', price: 25000, category: 'Ăn vặt', isPopular: false },
                { name: 'Nộm bò khô', price: 20000, category: 'Ăn vặt', isPopular: false },
                { name: 'Chè hoa cau', price: 10000, category: 'Chè', isPopular: false },
                { name: 'Chè bưởi', price: 10000, category: 'Chè', isPopular: false },
                { name: 'Thạch dừa', price: 15000, category: 'Thạch', isPopular: false }
            ]
        },

        // 9. Nem Nướng - Tiệm Hoa
        {
            info: {
                name: 'Nem Nướng - Tiệm Hoa',
                phone: '',
                address: '3 Phúc Thành, Phúc Hưng, TP. Ninh Bình',
                categories: ['Nem nướng', 'Thịt nướng'],
                description: 'Mở 08:00 - 22:00. Nem nướng Nha Trang nổi tiếng. Buổi tối đông.'
            },
            menu: [
                { name: 'Nem nướng Nha Trang (1 người)', price: 40000, category: 'Nem nướng', isPopular: true },
                { name: 'Nem nướng đặc biệt', price: 55000, category: 'Nem nướng', isPopular: false },
                { name: 'Thịt nướng đặc biệt', price: 50000, category: 'Thịt nướng', isPopular: true }
            ]
        },

        // 10. Bánh Cuốn Chả Vân Giang
        {
            info: {
                name: 'Bánh Cuốn Chả Vân Giang',
                phone: '',
                address: '15 Vân Giang, TP. Ninh Bình',
                categories: ['Bánh cuốn', 'Ăn sáng'],
                description: 'Mở 09:00 - 22:00. Quán lâu đời, đông khách, chả thơm ngon.'
            },
            menu: [
                { name: 'Bánh cuốn không trứng', price: 15000, category: 'Bánh cuốn', isPopular: true },
                { name: 'Bánh cuốn có trứng', price: 20000, category: 'Bánh cuốn', isPopular: true },
                { name: 'Bánh cuốn đầy đủ (chả, giò, nem)', price: 30000, category: 'Bánh cuốn', isPopular: false },
                { name: 'Suất đặc biệt (2-3 người)', price: 100000, category: 'Bánh cuốn', isPopular: false }
            ]
        },

        // 11. T'Rang Tào Phớ Chè Hiện Đại
        {
            info: {
                name: "T'Rang Tào Phớ Chè Hiện Đại",
                phone: '',
                address: '42 Lương Văn Tụy, P. Phúc Thành, TP. Ninh Bình',
                categories: ['Tào phớ', 'Chè'],
                description: 'Mở 08:00 - 22:00. 12 loại tào phớ. Không gian hiện đại, check-in đẹp.'
            },
            menu: [
                { name: 'Tào phớ truyền thống', price: 14000, category: 'Tào phớ', isPopular: true },
                { name: 'Tào phớ + topping', price: 25000, category: 'Tào phớ', isPopular: true },
                { name: 'Tào phớ đặc biệt', price: 40000, category: 'Tào phớ', isPopular: false },
                { name: 'Chè xoài', price: 25000, category: 'Chè', isPopular: false },
                { name: 'Chè dừa non', price: 20000, category: 'Chè', isPopular: false },
                { name: 'Chè sầu riêng', price: 30000, category: 'Chè', isPopular: false },
                { name: 'Chè thốt nốt', price: 25000, category: 'Chè', isPopular: false }
            ]
        },

        // 12. Lẩu Ếch Thinh (QUYẾT TIGER CS2)
        {
            info: {
                name: 'Lẩu Ếch Thinh - QUYẾT TIGER CS2',
                phone: '0866969626',
                address: 'Số 8 Phạm Bạch Hổ, P. Hoa Lư, TP. Ninh Bình (đằng sau Yody Nguyễn Công Trứ, đối diện chợ Thanh Bình)',
                categories: ['Lẩu', 'Ếch', 'Nướng', 'Hải sản'],
                description: 'Chuyên Lẩu Ếch Măng Cay. Ship tận nhà 24h. Zalo: 0866969626'
            },
            menu: [
                { name: 'Lẩu Ếch Măng Cay', price: 200000, category: 'Lẩu', isPopular: true },
                { name: 'Sườn Nướng Tảng BBQ', price: 150000, category: 'Nướng', isPopular: true },
                { name: 'Gà Ủ Muối', price: 180000, category: 'Gà', isPopular: true },
                { name: 'Cá Quả Nướng Muối Ớt', price: 200000, category: 'Cá', isPopular: false },
                { name: 'Má Heo Nướng', price: 120000, category: 'Nướng', isPopular: false },
                { name: 'Râu Mực Nướng Muối Ớt', price: 150000, category: 'Hải sản', isPopular: false },
                { name: 'Ếch Chiên Mắm', price: 100000, category: 'Ếch', isPopular: false },
                { name: 'Ếch Rang Muối', price: 100000, category: 'Ếch', isPopular: true },
                { name: 'Chân Gà Rang Muối', price: 80000, category: 'Ăn vặt', isPopular: false },
                { name: 'Ếch Chiên Bơ', price: 100000, category: 'Ếch', isPopular: false },
                { name: 'Sụn Gà Rang Muối', price: 80000, category: 'Ăn vặt', isPopular: false }
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

    // Nếu không có quán mới
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
                Thêm Quán Mới
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
