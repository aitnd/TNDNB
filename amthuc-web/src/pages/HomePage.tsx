// Trang chủ - Hiển thị danh sách quán ăn và tìm kiếm
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, Utensils, TrendingUp, Clock } from 'lucide-react'
import { Restaurant, MenuItem } from '../types'
import RestaurantCard from '../components/RestaurantCard'
import './HomePage.css'

interface HomePageProps {
    restaurants: Restaurant[]
    menuItems: MenuItem[]
    loading: boolean
    searchQuery: string
}

// Các danh mục phổ biến
const CATEGORIES = [
    { id: 'all', label: 'Tất cả', emoji: '🍽️' },
    { id: 'do-an-vat', label: 'Đồ ăn vặt', emoji: '🍿' },
    { id: 'ga', label: 'Gà', emoji: '🍗' },
    { id: 'my-pho', label: 'Mỳ/Phở', emoji: '🍜' },
    { id: 'com', label: 'Cơm', emoji: '🍚' },
    { id: 'lau', label: 'Lẩu', emoji: '🍲' },
    { id: 'do-uong', label: 'Đồ uống', emoji: '🧋' },
]

// Khoảng giá
const PRICE_RANGES = [
    { id: 'all', label: 'Tất cả giá' },
    { id: 'under-30k', label: 'Dưới 30k', max: 30000 },
    { id: '30k-50k', label: '30k - 50k', min: 30000, max: 50000 },
    { id: 'over-50k', label: 'Trên 50k', min: 50000 },
]

function HomePage({ restaurants, menuItems, loading, searchQuery }: HomePageProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [activePriceRange, setActivePriceRange] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // Lọc và tìm kiếm quán ăn
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants]

        // Tìm kiếm theo tên quán hoặc món ăn
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()

            // Tìm trong tên quán
            const matchedByName = result.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.address?.toLowerCase().includes(query)
            )

            // Tìm quán có món ăn phù hợp
            const matchedByMenu = result.filter(r => {
                const restaurantMenu = menuItems.filter(m => m.restaurantId === r.id)
                return restaurantMenu.some(m => m.name.toLowerCase().includes(query))
            })

            // Kết hợp và loại bỏ trùng lặp
            const combined = new Map<string, Restaurant>()
            matchedByName.forEach(r => combined.set(r.id, r))
            matchedByMenu.forEach(r => combined.set(r.id, r))
            result = Array.from(combined.values())
        }

        // Lọc theo danh mục
        if (activeCategory !== 'all') {
            const categoryLabel = CATEGORIES.find(c => c.id === activeCategory)?.label
            if (categoryLabel) {
                result = result.filter(r =>
                    r.categories?.some(c => c.toLowerCase().includes(categoryLabel.toLowerCase()))
                )
            }
        }

        // Lọc theo khoảng giá
        if (activePriceRange !== 'all') {
            const priceRange = PRICE_RANGES.find(p => p.id === activePriceRange)
            if (priceRange) {
                result = result.filter(r => {
                    const restaurantMenu = menuItems.filter(m => m.restaurantId === r.id)
                    return restaurantMenu.some(m => {
                        if (priceRange.min && priceRange.max) {
                            return m.price >= priceRange.min && m.price <= priceRange.max
                        } else if (priceRange.min) {
                            return m.price >= priceRange.min
                        } else if (priceRange.max) {
                            return m.price <= priceRange.max
                        }
                        return true
                    })
                })
            }
        }

        return result
    }, [restaurants, menuItems, searchQuery, activeCategory, activePriceRange])

    // Đếm số món trong mỗi quán
    const getMenuCount = (restaurantId: string) => {
        return menuItems.filter(m => m.restaurantId === restaurantId).length
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-title">
                            <span className="gradient-text">Đói Ăn Gì?</span> 🍜
                        </h1>
                        <p className="hero-subtitle">
                            Khám phá ẩm thực Ninh Bình - Tìm quán ngon, xem menu, đặt món dễ dàng!
                        </p>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <Utensils size={20} />
                                <span><strong>{restaurants.length}</strong> quán ăn</span>
                            </div>
                            <div className="stat-item">
                                <TrendingUp size={20} />
                                <span><strong>{menuItems.length}</strong> món ăn</span>
                            </div>
                            <div className="stat-item">
                                <Clock size={20} />
                                <span>Cập nhật <strong>24/7</strong></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="categories-scroll">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="category-emoji">{cat.emoji}</span>
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filter toggle */}
                    <button
                        className={`filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} />
                        Bộ lọc
                    </button>

                    {/* Advanced filters */}
                    {showFilters && (
                        <motion.div
                            className="filters-panel"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="filter-group">
                                <label>Khoảng giá:</label>
                                <div className="filter-options">
                                    {PRICE_RANGES.map(range => (
                                        <button
                                            key={range.id}
                                            className={`filter-option ${activePriceRange === range.id ? 'active' : ''}`}
                                            onClick={() => setActivePriceRange(range.id)}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Restaurant List */}
            <section className="restaurants-section">
                <div className="container">
                    {/* Header */}
                    <div className="section-header">
                        <h2>
                            {searchQuery ? (
                                <>Kết quả cho "<span className="gradient-text">{searchQuery}</span>"</>
                            ) : (
                                <>🔥 Quán ăn <span className="gradient-text">nổi bật</span></>
                            )}
                        </h2>
                        <span className="result-count">{filteredRestaurants.length} quán</span>
                    </div>

                    {/* Loading state */}
                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton-card">
                                    <div className="skeleton skeleton-image" />
                                    <div className="skeleton-content">
                                        <div className="skeleton skeleton-title" />
                                        <div className="skeleton skeleton-text" />
                                        <div className="skeleton skeleton-text short" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRestaurants.length > 0 ? (
                        <motion.div
                            className="restaurants-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredRestaurants.map(restaurant => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    menuCount={getMenuCount(restaurant.id)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="empty-state">
                            <span className="empty-emoji">🍽️</span>
                            <h3>Không tìm thấy quán ăn</h3>
                            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setActiveCategory('all')
                                    setActivePriceRange('all')
                                }}
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default HomePage
