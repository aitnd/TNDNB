// Trang chủ tổng hợp "Khám Phá Ninh Bình" - Ẩm thực + Địa điểm du lịch
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Utensils, TrendingUp, MapPin, Grid3X3, List, Minus, PlusCircle, Mountain, ChevronRight } from 'lucide-react'
import { Restaurant, MenuItem, Attraction } from '../types'
import RestaurantCard from '../components/RestaurantCard'
import AttractionCard from '../components/AttractionCard'
import './HomePage.css'

interface HomePageProps {
    restaurants: Restaurant[]
    menuItems: MenuItem[]
    attractions: Attraction[]
    loading: boolean
    searchQuery: string
}

// Các danh mục ẩm thực
const FOOD_CATEGORIES = [
    { id: 'all', label: 'Tất cả', emoji: '🍽️' },
    { id: 'do-an-vat', label: 'Đồ ăn vặt', emoji: '🍿' },
    { id: 'ga', label: 'Gà', emoji: '🍗' },
    { id: 'my-pho', label: 'Mỳ/Phở', emoji: '🍜' },
    { id: 'com', label: 'Cơm', emoji: '🍚' },
    { id: 'lau', label: 'Lẩu', emoji: '🍲' },
    { id: 'do-uong', label: 'Đồ uống', emoji: '🧋' },
]

// Các loại hình địa điểm
const ATTRACTION_CATEGORIES = [
    { id: 'all', label: 'Tất cả', emoji: '🗺️' },
    { id: 'nature', label: 'Thiên nhiên', emoji: '🌿' },
    { id: 'culture', label: 'Văn hóa', emoji: '🏛️' },
    { id: 'adventure', label: 'Khám phá', emoji: '⛰️' },
    { id: 'relax', label: 'Nghỉ dưỡng', emoji: '💆' },
]

// Khoảng giá ẩm thực
const PRICE_RANGES = [
    { id: 'all', label: 'Tất cả giá' },
    { id: 'under-30k', label: 'Dưới 30k', max: 30000 },
    { id: '30k-50k', label: '30k - 50k', min: 30000, max: 50000 },
    { id: 'over-50k', label: 'Trên 50k', min: 50000 },
]

// Tab chính
type ActiveTab = 'food' | 'attractions'

function HomePage({ restaurants, menuItems, attractions, loading, searchQuery }: HomePageProps) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<ActiveTab>('food')
    const [activeFoodCategory, setActiveFoodCategory] = useState('all')
    const [activeAttractionCategory, setActiveAttractionCategory] = useState('all')
    const [activePriceRange, setActivePriceRange] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [cardSize, setCardSize] = useState(3)

    // Lọc quán ăn
    const filteredRestaurants = useMemo(() => {
        let result = [...restaurants]

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            const matchedByName = result.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.address?.toLowerCase().includes(query)
            )
            const matchedByMenu = result.filter(r => {
                const restaurantMenu = menuItems.filter(m => m.restaurantId === r.id)
                return restaurantMenu.some(m => m.name.toLowerCase().includes(query))
            })
            const combined = new Map<string, Restaurant>()
            matchedByName.forEach(r => combined.set(r.id, r))
            matchedByMenu.forEach(r => combined.set(r.id, r))
            result = Array.from(combined.values())
        }

        if (activeFoodCategory !== 'all') {
            const categoryLabel = FOOD_CATEGORIES.find(c => c.id === activeFoodCategory)?.label
            if (categoryLabel) {
                result = result.filter(r =>
                    r.categories?.some(c => c.toLowerCase().includes(categoryLabel.toLowerCase()))
                )
            }
        }

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
    }, [restaurants, menuItems, searchQuery, activeFoodCategory, activePriceRange])

    // Lọc địa điểm du lịch
    const filteredAttractions = useMemo(() => {
        let result = [...attractions]

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(a =>
                a.name.toLowerCase().includes(query) ||
                a.description?.toLowerCase().includes(query)
            )
        }

        if (activeAttractionCategory !== 'all') {
            result = result.filter(a => a.category === activeAttractionCategory)
        }

        // Sắp xếp theo khoảng cách
        result.sort((a, b) => a.distance - b.distance)

        return result
    }, [attractions, searchQuery, activeAttractionCategory])

    const getMenuCount = (restaurantId: string) => {
        return menuItems.filter(m => m.restaurantId === restaurantId).length
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    }

    return (
        <div className="home-page">
            {/* Hero Section - Khám Phá Ninh Bình */}
            <section className="hero">
                <div className="container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hero-title">
                            <span className="gradient-text">Khám Phá Ninh Bình</span> 🏔️
                        </h1>
                        <p className="hero-subtitle">
                            Ăn gì? Chơi đâu? - Tất cả trong một!
                        </p>

                        {/* Stats */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <Utensils size={20} />
                                <span><strong>{restaurants.length}</strong> quán ăn</span>
                            </div>
                            <div className="stat-item">
                                <Mountain size={20} />
                                <span><strong>{attractions.length}</strong> địa điểm</span>
                            </div>
                            <div className="stat-item">
                                <TrendingUp size={20} />
                                <span><strong>{menuItems.length}</strong> món ăn</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tab Switcher - Ẩm thực / Địa điểm */}
            <section className="tab-switcher-section">
                <div className="container">
                    <div className="tab-switcher">
                        <button
                            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
                            onClick={() => setActiveTab('food')}
                        >
                            <Utensils size={20} />
                            <span>Ẩm thực</span>
                            <span className="tab-count">{restaurants.length}</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'attractions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attractions')}
                        >
                            <MapPin size={20} />
                            <span>Địa điểm</span>
                            <span className="tab-count">{attractions.length}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Nội dung theo Tab */}
            {activeTab === 'food' ? (
                <>
                    {/* Categories - Ẩm thực */}
                    <section className="categories-section">
                        <div className="container">
                            <div className="categories-scroll">
                                {FOOD_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`category-btn ${activeFoodCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setActiveFoodCategory(cat.id)}
                                    >
                                        <span className="category-emoji">{cat.emoji}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                className={`filter-toggle ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Bộ lọc
                            </button>

                            {showFilters && (
                                <motion.div
                                    className="filters-panel"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
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
                            <div className="section-header">
                                <h2>
                                    {searchQuery ? (
                                        <>Kết quả cho "<span className="gradient-text">{searchQuery}</span>"</>
                                    ) : (
                                        <>🔥 Quán ăn <span className="gradient-text">nổi bật</span></>
                                    )}
                                </h2>
                                <div className="view-controls">
                                    <div className="view-toggle">
                                        <button
                                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid3X3 size={18} />
                                        </button>
                                        <button
                                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>

                                    {viewMode === 'grid' && (
                                        <div className="size-control">
                                            <button
                                                className="size-btn"
                                                onClick={() => setCardSize(prev => Math.max(2, prev - 1))}
                                                disabled={cardSize <= 2}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="size-label">{cardSize} cột</span>
                                            <button
                                                className="size-btn"
                                                onClick={() => setCardSize(prev => Math.min(6, prev + 1))}
                                                disabled={cardSize >= 6}
                                            >
                                                <PlusCircle size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <span className="result-count">{filteredRestaurants.length} quán</span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-grid">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="skeleton-card">
                                            <div className="skeleton skeleton-image" />
                                            <div className="skeleton-content">
                                                <div className="skeleton skeleton-title" />
                                                <div className="skeleton skeleton-text" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredRestaurants.length > 0 ? (
                                <motion.div
                                    className={`restaurants-grid ${viewMode === 'list' ? 'list-view' : ''}`}
                                    style={viewMode === 'grid' ? { gridTemplateColumns: `repeat(${cardSize}, 1fr)` } : undefined}
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredRestaurants.map(restaurant => (
                                        <RestaurantCard
                                            key={restaurant.id}
                                            restaurant={restaurant}
                                            menuCount={getMenuCount(restaurant.id)}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-emoji">🍽️</span>
                                    <h3>Không tìm thấy quán ăn</h3>
                                    <p>Thử thay đổi bộ lọc nhé!</p>
                                    <button className="btn btn-primary" onClick={() => { setActiveFoodCategory('all'); setActivePriceRange('all') }}>
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* Categories - Địa điểm */}
                    <section className="categories-section">
                        <div className="container">
                            <div className="categories-scroll">
                                {ATTRACTION_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`category-btn ${activeAttractionCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => setActiveAttractionCategory(cat.id)}
                                    >
                                        <span className="category-emoji">{cat.emoji}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Attractions List */}
                    <section className="attractions-section">
                        <div className="container">
                            <div className="section-header">
                                <h2>
                                    {searchQuery ? (
                                        <>Kết quả cho "<span className="gradient-text">{searchQuery}</span>"</>
                                    ) : (
                                        <>🏔️ Địa điểm <span className="gradient-text">nổi bật</span></>
                                    )}
                                </h2>
                                <span className="result-count">{filteredAttractions.length} địa điểm</span>
                            </div>

                            {loading ? (
                                <div className="loading-grid attractions-grid">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="skeleton-card">
                                            <div className="skeleton skeleton-image" />
                                            <div className="skeleton-content">
                                                <div className="skeleton skeleton-title" />
                                                <div className="skeleton skeleton-text" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredAttractions.length > 0 ? (
                                <motion.div
                                    className="attractions-grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredAttractions.map(attraction => (
                                        <AttractionCard
                                            key={attraction.id}
                                            attraction={attraction}
                                            onClick={() => navigate(`/dia-diem/${attraction.id}`)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="empty-state">
                                    <span className="empty-emoji">🗺️</span>
                                    <h3>Không tìm thấy địa điểm</h3>
                                    <p>Thử thay đổi bộ lọc nhé!</p>
                                    <button className="btn btn-primary" onClick={() => setActiveAttractionCategory('all')}>
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}

export default HomePage
