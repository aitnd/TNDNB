// Trang chi tiết quán ăn - Hiển thị menu đầy đủ
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, ArrowLeft, Star, Clock } from 'lucide-react'
import { Restaurant, MenuItem } from '../types'
import './RestaurantPage.css'

interface RestaurantPageProps {
    restaurants: Restaurant[]
    menuItems: MenuItem[]
    loading: boolean
}

// Format giá tiền VNĐ
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price)
}

function RestaurantPage({ restaurants, menuItems, loading }: RestaurantPageProps) {
    const { id } = useParams<{ id: string }>()

    // Tìm quán ăn theo id
    const restaurant = restaurants.find(r => r.id === id)

    // Lấy menu của quán
    const menu = menuItems.filter(m => m.restaurantId === id)

    // Nhóm món theo category
    const menuByCategory = menu.reduce((acc, item) => {
        const category = item.category || 'Khác'
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
    }, {} as Record<string, MenuItem[]>)

    // Loading state
    if (loading) {
        return (
            <div className="restaurant-page">
                <div className="container">
                    <div className="loading-detail">
                        <div className="skeleton skeleton-header" />
                        <div className="skeleton skeleton-content" />
                    </div>
                </div>
            </div>
        )
    }

    // Không tìm thấy quán
    if (!restaurant) {
        return (
            <div className="restaurant-page">
                <div className="container">
                    <div className="not-found">
                        <span className="not-found-emoji">😢</span>
                        <h2>Không tìm thấy quán ăn</h2>
                        <p>Quán ăn này có thể đã bị xóa hoặc không tồn tại.</p>
                        <Link to="/" className="btn btn-primary">
                            <ArrowLeft size={18} />
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="restaurant-page">
            {/* Hero Banner */}
            <motion.div
                className="restaurant-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    background: restaurant.imageUrl
                        ? `linear-gradient(rgba(0,0,0,0.6), rgba(15,15,35,1)), url(${restaurant.imageUrl}) center/cover`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <div className="container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Quay lại</span>
                    </Link>

                    <motion.div
                        className="hero-info"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="hero-tags">
                            {restaurant.categories?.map((cat, i) => (
                                <span key={i} className="hero-tag">{cat}</span>
                            ))}
                        </div>

                        <h1 className="hero-title">{restaurant.name}</h1>

                        <div className="hero-meta">
                            <div className="meta-item">
                                <MapPin size={16} />
                                <span>{restaurant.address || 'Chưa cập nhật'}</span>
                            </div>
                            {restaurant.phone && (
                                <a href={`tel:${restaurant.phone}`} className="meta-item phone-link">
                                    <Phone size={16} />
                                    <span>{restaurant.phone}</span>
                                </a>
                            )}
                            <div className="meta-item">
                                <Clock size={16} />
                                <span>
                                    {restaurant.openTime && restaurant.closeTime
                                        ? `${restaurant.openTime} - ${restaurant.closeTime}`
                                        : 'Liên hệ để biết giờ mở cửa'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Menu Section */}
            <section className="menu-section">
                <div className="container">
                    <div className="menu-header">
                        <h2>🍽️ Menu <span className="gradient-text">{restaurant.name}</span></h2>
                        <span className="menu-count">{menu.length} món</span>
                    </div>

                    {Object.keys(menuByCategory).length > 0 ? (
                        Object.entries(menuByCategory).map(([category, items]) => (
                            <motion.div
                                key={category}
                                className="menu-category"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="category-title">{category}</h3>

                                <div className="menu-items">
                                    {items.map(item => (
                                        <div key={item.id} className="menu-item glass-card">
                                            {/* Image nếu có */}
                                            {item.imageUrl && (
                                                <div
                                                    className="item-image"
                                                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                                                />
                                            )}

                                            <div className="item-content">
                                                <div className="item-header">
                                                    <h4 className="item-name">
                                                        {item.isPopular && <Star size={14} className="popular-icon" />}
                                                        {item.name}
                                                    </h4>
                                                    <span className="item-price price">{formatPrice(item.price)}</span>
                                                </div>

                                                {item.description && (
                                                    <p className="item-desc">{item.description}</p>
                                                )}

                                                {!item.isAvailable && (
                                                    <span className="unavailable-badge">Hết món</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="empty-menu">
                            <span className="empty-emoji">📋</span>
                            <h3>Chưa có menu</h3>
                            <p>Menu của quán đang được cập nhật, vui lòng quay lại sau nhé!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default RestaurantPage
