'use client'

import { useTheme } from '../context/ThemeContext'

export default function ThemeEffects() {
    const { theme } = useTheme()

    if (theme !== 'noel') return null

    return (
        <div className="snowflakes" aria-hidden="true">
            {/* Bông tuyết trắng (Tăng số lượng lên 30 bông) */}
            {Array.from({ length: 100 }).map((_, i) => (
                <div key={`snow-${i}`} className="snowflake">
                    {['❅', '❆', '❄'][i % 3]} {/* Chọn ngẫu nhiên ký tự tuyết */}
                </div>
            ))}

            {/* Ảnh quả châu và kẹo rơi cùng (Thêm 8 hình ảnh) */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={`img-${i}`} className="snowflake snowflake-img">
                    {/* Chọn ngẫu nhiên ảnh từ icon-1 đến icon-4 */}
                    <img
                        src={`/assets/img/icon-${(i % 4) + 1}.png`}
                        alt=""
                        style={{ width: '25px', height: 'auto' }}
                    />
                </div>
            ))}
        </div>
    )
}
