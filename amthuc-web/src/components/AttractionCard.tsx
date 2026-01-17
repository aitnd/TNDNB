// Card hiển thị thông tin địa điểm du lịch
import { Attraction } from '../types'
import { MapPin, Ticket, ExternalLink } from 'lucide-react'
import './AttractionCard.css'

// Map loại hình sang tiếng Việt và màu sắc
const categoryMap: Record<string, { label: string; color: string }> = {
    nature: { label: 'Thiên nhiên', color: '#22c55e' },
    culture: { label: 'Văn hóa', color: '#f59e0b' },
    adventure: { label: 'Khám phá', color: '#3b82f6' },
    relax: { label: 'Nghỉ dưỡng', color: '#8b5cf6' }
}

interface AttractionCardProps {
    attraction: Attraction
    onClick?: () => void
}

function AttractionCard({ attraction, onClick }: AttractionCardProps) {
    // Tính giá vé thấp nhất và cao nhất
    const prices = attraction.ticketTypes.map(t => t.price).filter(p => p > 0)
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
    const hasFreeTicket = attraction.ticketTypes.some(t => t.price === 0)

    // Format giá tiền
    const formatPrice = (price: number) => {
        if (price === 0) return 'Miễn phí'
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)}tr`
        return `${(price / 1000).toFixed(0)}k`
    }

    // Hiển thị range giá
    const getPriceDisplay = () => {
        if (minPrice === 0 && maxPrice === 0) return 'Miễn phí'
        if (minPrice === maxPrice) return formatPrice(minPrice)
        if (hasFreeTicket) return `Miễn phí - ${formatPrice(maxPrice)}`
        return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
    }

    const category = categoryMap[attraction.category] || categoryMap.nature

    return (
        <div className="attraction-card" onClick={onClick}>
            {/* Ảnh địa điểm */}
            <div className="attraction-card__image">
                {attraction.imageUrl ? (
                    <img src={attraction.imageUrl} alt={attraction.name} />
                ) : (
                    <div className="attraction-card__image-placeholder">
                        <MapPin size={48} />
                    </div>
                )}
                {/* Badge khoảng cách */}
                <span className="attraction-card__distance">
                    <MapPin size={14} />
                    {attraction.distance}km
                </span>
                {/* Badge loại hình */}
                <span
                    className="attraction-card__category"
                    style={{ backgroundColor: category.color }}
                >
                    {category.label}
                </span>
            </div>

            {/* Thông tin */}
            <div className="attraction-card__content">
                <h3 className="attraction-card__name">{attraction.name}</h3>

                {/* Giá vé */}
                <div className="attraction-card__price">
                    <Ticket size={16} />
                    <span>{getPriceDisplay()}</span>
                </div>

                {/* Mô tả ngắn */}
                {attraction.description && (
                    <p className="attraction-card__description">
                        {attraction.description.length > 80
                            ? attraction.description.slice(0, 80) + '...'
                            : attraction.description
                        }
                    </p>
                )}

                {/* Nút mua vé online */}
                {attraction.purchaseMethod !== 'quay' && attraction.onlineUrl && (
                    <a
                        href={attraction.onlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="attraction-card__online-btn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={14} />
                        Mua vé online
                    </a>
                )}
            </div>
        </div>
    )
}

export default AttractionCard
