// Trang chi tiết địa điểm du lịch
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Phone, ExternalLink, Ticket, Info, Navigation } from 'lucide-react'
import { Attraction } from '../types'
import './AttractionDetailPage.css'

// Map loại hình
const categoryMap: Record<string, { label: string; color: string; emoji: string }> = {
    nature: { label: 'Thiên nhiên', color: '#22c55e', emoji: '🌿' },
    culture: { label: 'Văn hóa', color: '#f59e0b', emoji: '🏛️' },
    adventure: { label: 'Khám phá', color: '#3b82f6', emoji: '⛰️' },
    relax: { label: 'Nghỉ dưỡng', color: '#8b5cf6', emoji: '💆' }
}

interface AttractionDetailPageProps {
    attractions: Attraction[]
    loading: boolean
}

function AttractionDetailPage({ attractions, loading }: AttractionDetailPageProps) {
    const { id } = useParams()
    const navigate = useNavigate()

    const attraction = attractions.find(a => a.id === id)

    // Format giá tiền
    const formatPrice = (price: number) => {
        if (price === 0) return 'Miễn phí'
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)} triệu`
        return `${price.toLocaleString()}đ`
    }

    // Loading state
    if (loading) {
        return (
            <div className="attraction-detail loading">
                <div className="container">
                    <div className="skeleton skeleton-hero" />
                    <div className="skeleton skeleton-title" />
                    <div className="skeleton skeleton-text" />
                </div>
            </div>
        )
    }

    // Không tìm thấy
    if (!attraction) {
        return (
            <div className="attraction-detail not-found">
                <div className="container">
                    <h2>Không tìm thấy địa điểm</h2>
                    <p>Địa điểm này không tồn tại hoặc đã bị xóa.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={18} />
                        Về trang chủ
                    </button>
                </div>
            </div>
        )
    }

    const category = categoryMap[attraction.category] || categoryMap.nature

    return (
        <div className="attraction-detail">
            {/* Header */}
            <div className="detail-header">
                <div className="container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                        Quay lại
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="detail-hero">
                {attraction.imageUrl ? (
                    <img src={attraction.imageUrl} alt={attraction.name} />
                ) : (
                    <div className="hero-placeholder">
                        <MapPin size={80} />
                    </div>
                )}
                <div className="hero-overlay">
                    <div className="container">
                        <motion.div
                            className="hero-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="category-badge" style={{ backgroundColor: category.color }}>
                                {category.emoji} {category.label}
                            </span>
                            <h1>{attraction.name}</h1>
                            <div className="hero-meta">
                                <span className="distance">
                                    <Navigation size={18} />
                                    {attraction.distance} km từ TP Ninh Bình
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="detail-content">
                <div className="container">
                    <div className="content-grid">
                        {/* Main Content */}
                        <div className="main-content">
                            {/* Mô tả */}
                            {attraction.description && (
                                <section className="detail-section">
                                    <h2><Info size={20} /> Giới thiệu</h2>
                                    <p>{attraction.description}</p>
                                </section>
                            )}

                            {/* Bảng giá vé */}
                            <section className="detail-section tickets-section">
                                <h2><Ticket size={20} /> Bảng giá vé</h2>
                                <div className="tickets-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Loại vé</th>
                                                <th>Điều kiện</th>
                                                <th>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attraction.ticketTypes.map((ticket, index) => (
                                                <tr key={index}>
                                                    <td className="ticket-name">{ticket.name}</td>
                                                    <td className="ticket-condition">{ticket.condition || '-'}</td>
                                                    <td className={`ticket-price ${ticket.price === 0 ? 'free' : ''}`}>
                                                        {formatPrice(ticket.price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="price-note">* Giá vé áp dụng từ tháng 6/2025, có thể thay đổi</p>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <aside className="detail-sidebar">
                            {/* Thông tin liên hệ */}
                            <div className="sidebar-card">
                                <h3>Thông tin</h3>

                                <div className="info-item">
                                    <MapPin size={18} />
                                    <span>{attraction.distance} km từ thành phố</span>
                                </div>

                                {attraction.openTime && (
                                    <div className="info-item">
                                        <Clock size={18} />
                                        <span>{attraction.openTime} - {attraction.closeTime}</span>
                                    </div>
                                )}

                                {attraction.phone && (
                                    <div className="info-item">
                                        <Phone size={18} />
                                        <a href={`tel:${attraction.phone}`}>{attraction.phone}</a>
                                    </div>
                                )}

                                {/* Cách mua vé */}
                                <div className="purchase-info">
                                    <span className="purchase-label">Mua vé:</span>
                                    <span className="purchase-method">
                                        {attraction.purchaseMethod === 'online' && '🌐 Online'}
                                        {attraction.purchaseMethod === 'quay' && '🎫 Tại quầy'}
                                        {attraction.purchaseMethod === 'both' && '🌐 Online / 🎫 Tại quầy'}
                                    </span>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="sidebar-actions">
                                {attraction.onlineUrl && attraction.purchaseMethod !== 'quay' && (
                                    <a
                                        href={attraction.onlineUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-lg"
                                    >
                                        <ExternalLink size={18} />
                                        Mua vé online
                                    </a>
                                )}

                                <a
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(attraction.name + ' Ninh Bình')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                >
                                    <Navigation size={18} />
                                    Chỉ đường
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttractionDetailPage
