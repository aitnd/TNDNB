// RestaurantCard - Card hiển thị quán ăn
import { motion } from 'framer-motion'
import { MapPin, Phone, ChefHat, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Restaurant } from '../types'
import './RestaurantCard.css'

interface RestaurantCardProps {
    restaurant: Restaurant
    menuCount: number
}

// Màu gradient ngẫu nhiên cho card không có ảnh
const GRADIENTS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]

function RestaurantCard({ restaurant, menuCount }: RestaurantCardProps) {
    // Chọn gradient dựa trên id của quán
    const gradientIndex = restaurant.id.charCodeAt(0) % GRADIENTS.length
    const gradient = GRADIENTS[gradientIndex]

    // Animation
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    }

    return (
        <motion.div
            className="restaurant-card glass-card"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link to={`/quan/${restaurant.id}`} className="card-link">
                {/* Image / Gradient background */}
                <div
                    className="card-image"
                    style={{
                        background: restaurant.imageUrl
                            ? `url(${restaurant.imageUrl}) center/cover`
                            : gradient
                    }}
                >
                    {/* Category tags */}
                    <div className="card-tags">
                        {restaurant.categories?.slice(0, 2).map((cat, i) => (
                            <span key={i} className="card-tag">{cat}</span>
                        ))}
                    </div>

                    {/* Menu count badge */}
                    <div className="menu-badge">
                        <ChefHat size={14} />
                        <span>{menuCount} món</span>
                    </div>
                </div>

                {/* Content */}
                <div className="card-content">
                    <h3 className="card-title">{restaurant.name}</h3>

                    {/* Address */}
                    <div className="card-info">
                        <MapPin size={14} />
                        <span>{restaurant.address || 'Chưa cập nhật địa chỉ'}</span>
                    </div>

                    {/* Phone */}
                    {restaurant.phone && (
                        <div className="card-info">
                            <Phone size={14} />
                            <span>{restaurant.phone}</span>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="card-cta">
                        <span>Xem menu</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default RestaurantCard
