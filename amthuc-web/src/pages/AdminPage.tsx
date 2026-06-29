// Trang Admin - Quản lý quán ăn và menu
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LogIn, LogOut, Plus, Edit, Trash2, Save, X, Store,
    UtensilsCrossed, ArrowLeft, AlertCircle, Grid3X3, List, Phone, MapPin,
    Search, Minus, PlusCircle
} from 'lucide-react'
import { Restaurant, MenuItem, Attraction } from '../types'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import SeedFiveQuanButton from '../components/SeedFiveQuanButton'
import SeedAttractionsButton from '../components/SeedAttractionsButton'
import './AdminPage.css'

interface AdminPageProps {
    restaurants: Restaurant[]
    menuItems: MenuItem[]
    attractions: Attraction[]
    onRefresh: () => void
}

function AdminPage({ restaurants, menuItems, attractions, onRefresh }: AdminPageProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Theo dõi trạng thái đăng nhập
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container">
                    <div className="loading-admin">Đang kiểm tra đăng nhập...</div>
                </div>
            </div>
        )
    }

    // Chưa đăng nhập
    if (!user) {
        return <LoginForm />
    }

    return (
        <div className="admin-page">
            <div className="container">
                {/* Admin Header */}
                <div className="admin-header">
                    <div className="admin-title">
                        <h1>🔧 Quản lý <span className="gradient-text">Khám Phá NB</span></h1>
                        <p>Xin chào, {user.email}</p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => signOut(auth)}
                    >
                        <LogOut size={18} />
                        Đăng xuất
                    </button>
                </div>

                {/* Admin Navigation */}
                <div className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">
                        <Store size={20} />
                        Quán ăn ({restaurants.length})
                    </Link>
                    <Link to="/admin/menu" className="admin-nav-item">
                        <UtensilsCrossed size={20} />
                        Món ăn ({menuItems.length})
                    </Link>
                    <Link to="/admin/dia-diem" className="admin-nav-item">
                        🏔️ Địa điểm ({attractions.length})
                    </Link>
                </div>

                {(() => {
                    const existingNames = restaurants.map(r => r.name)
                    return <SeedFiveQuanButton onComplete={onRefresh} existingRestaurants={existingNames} />
                })()}

                {/* Seed địa điểm du lịch */}
                <SeedAttractionsButton onComplete={onRefresh} />

                {/* Routes */}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <RestaurantManager
                                restaurants={restaurants}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                    <Route
                        path="/menu"
                        element={
                            <MenuManager
                                restaurants={restaurants}
                                menuItems={menuItems}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    )
}

// Form đăng nhập
function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err: any) {
            setError('Email hoặc mật khẩu không đúng!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <motion.div
                className="login-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="login-header">
                    <span className="login-emoji">🔐</span>
                    <h2>Đăng nhập Admin</h2>
                    <p>Nhập thông tin để quản lý quán ăn</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            className="input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        <LogIn size={18} />
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <Link to="/" className="login-back">
                    <ArrowLeft size={16} />
                    Về trang chủ
                </Link>
            </motion.div>
        </div>
    )
}

// Quản lý quán ăn
interface RestaurantManagerProps {
    restaurants: Restaurant[]
    onRefresh: () => void
}

function RestaurantManager({ restaurants, onRefresh }: RestaurantManagerProps) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // Mặc định grid
    const [cardSize, setCardSize] = useState<number>(3) // 2=lớn (2 cột), 3=trung bình (3 cột), 5=nhỏ (5 cột), 6=rất nhỏ
    const [searchQuery, setSearchQuery] = useState('') // Tìm kiếm nhanh
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        categories: '',
        imageUrl: '',
        description: ''
    })
    const [saving, setSaving] = useState(false)

    // Lọc quán theo search
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone?.includes(searchQuery)
    )

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', address: '', phone: '', categories: '', imageUrl: '', description: '' })
        setEditingId(null)
        setShowForm(false)
    }

    // Mở form sửa
    const handleEdit = (restaurant: Restaurant) => {
        setFormData({
            name: restaurant.name,
            address: restaurant.address || '',
            phone: restaurant.phone || '',
            categories: restaurant.categories?.join(', ') || '',
            imageUrl: restaurant.imageUrl || '',
            description: restaurant.description || ''
        })
        setEditingId(restaurant.id)
        setShowForm(true)
    }

    // Lưu quán
    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên quán!')
            return
        }

        setSaving(true)
        try {
            const data = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                phone: formData.phone.trim(),
                categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
                imageUrl: formData.imageUrl.trim(),
                description: formData.description.trim(),
                updatedAt: serverTimestamp()
            }

            if (editingId) {
                // Cập nhật
                await updateDoc(doc(db, 'restaurants', editingId), data)
            } else {
                // Thêm mới
                await addDoc(collection(db, 'restaurants'), {
                    ...data,
                    createdAt: serverTimestamp()
                })
            }

            onRefresh()
            resetForm()
        } catch (error) {
            console.error('Lỗi khi lưu:', error)
            alert('Có lỗi xảy ra, vui lòng thử lại!')
        } finally {
            setSaving(false)
        }
    }

    // Xóa quán
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc muốn xóa quán "${name}"?`)) return

        try {
            await deleteDoc(doc(db, 'restaurants', id))
            onRefresh()
        } catch (error) {
            console.error('Lỗi khi xóa:', error)
            alert('Có lỗi xảy ra!')
        }
    }

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>📍 Danh sách quán ăn ({filteredRestaurants.length}/{restaurants.length})</h2>
                <div className="section-actions">
                    {/* Nút chuyển đổi view */}
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Xem dạng lưới"
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Xem dạng danh sách"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    {/* Size controls - chỉ hiện khi grid mode */}
                    {viewMode === 'grid' && (
                        <div className="size-control">
                            <button
                                className="size-btn"
                                onClick={() => setCardSize(prev => Math.max(2, prev - 1))}
                                disabled={cardSize <= 2}
                                title="Phóng to"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="size-label">{cardSize} cột</span>
                            <button
                                className="size-btn"
                                onClick={() => setCardSize(prev => Math.min(6, prev + 1))}
                                disabled={cardSize >= 6}
                                title="Thu nhỏ"
                            >
                                <PlusCircle size={16} />
                            </button>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={18} />
                        Thêm quán
                    </button>
                </div>
            </div>

            {/* Thanh tìm kiếm nhanh */}
            <div className="search-bar glass-card">
                <Search size={18} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm nhanh quán theo tên, địa chỉ, SĐT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button className="clear-btn" onClick={() => setSearchQuery('')}>
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Form thêm/sửa */}
            {showForm && (
                <motion.div
                    className="admin-form glass-card"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <div className="form-header">
                        <h3>{editingId ? '✏️ Sửa quán ăn' : '➕ Thêm quán mới'}</h3>
                        <button className="btn-icon" onClick={resetForm}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên quán *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: Quán Chợ Bóp"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: 0356943456"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: sn 04 Ngõ 65 Trần Phú"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Danh mục (cách nhau bởi dấu phẩy)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: Đồ ăn vặt, Gà, Mỳ cay"
                                value={formData.categories}
                                onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>URL hình ảnh</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Mô tả</label>
                            <textarea
                                className="input textarea"
                                placeholder="Mô tả ngắn về quán..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={resetForm}>
                            Hủy
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? 'Đang lưu...' : 'Lưu quán'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Danh sách */}
            <div
                className={`admin-list ${viewMode === 'grid' ? 'admin-grid' : 'admin-rows'}`}
                style={viewMode === 'grid' ? {
                    gridTemplateColumns: `repeat(${cardSize}, 1fr)`
                } : undefined}
            >
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map(restaurant => (
                        <motion.div
                            key={restaurant.id}
                            className={`admin-item glass-card ${viewMode === 'grid' ? 'admin-card' : 'admin-row'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Ảnh quán (Grid mode) */}
                            {viewMode === 'grid' && (
                                <div
                                    className="card-image"
                                    style={{
                                        background: restaurant.imageUrl
                                            ? `url(${restaurant.imageUrl}) center/cover`
                                            : `linear-gradient(135deg, #FF6B6B 0%, #845EC2 100%)`
                                    }}
                                >
                                    <div className="card-overlay">
                                        <span className="card-emoji">🍜</span>
                                    </div>
                                </div>
                            )}

                            <div className="item-info">
                                <h4>{restaurant.name}</h4>
                                {restaurant.phone && (
                                    <p className="item-phone">
                                        <Phone size={14} />
                                        {restaurant.phone}
                                    </p>
                                )}
                                <p className="item-address">
                                    <MapPin size={14} />
                                    {restaurant.address || 'Chưa có địa chỉ'}
                                </p>
                                <div className="item-tags">
                                    {restaurant.categories?.slice(0, 3).map((cat, i) => (
                                        <span key={i} className="item-tag">{cat}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="item-actions">
                                <button
                                    className="btn-icon edit"
                                    onClick={() => handleEdit(restaurant)}
                                    title="Sửa"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    className="btn-icon delete"
                                    onClick={() => handleDelete(restaurant.id, restaurant.name)}
                                    title="Xóa"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="empty-admin">
                        <span>🏪</span>
                        <p>Chưa có quán ăn nào. Hãy thêm quán đầu tiên!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Quản lý menu
interface MenuManagerProps {
    restaurants: Restaurant[]
    menuItems: MenuItem[]
    onRefresh: () => void
}

function MenuManager({ restaurants, menuItems, onRefresh }: MenuManagerProps) {
    const [selectedRestaurant, setSelectedRestaurant] = useState<string>('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // Mặc định grid
    const [cardSize, setCardSize] = useState<number>(3) // 2=lớn, 3=vừa, 5=nhỏ, 6=rất nhỏ
    const [searchQuery, setSearchQuery] = useState('') // Tìm kiếm nhanh
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        imageUrl: '',
        isPopular: false,
        isAvailable: true
    })
    const [saving, setSaving] = useState(false)

    // Lọc menu theo quán và search
    const filteredMenu = menuItems.filter(m => {
        // Lọc theo quán
        if (selectedRestaurant && m.restaurantId !== selectedRestaurant) return false
        // Lọc theo search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            const restaurant = restaurants.find(r => r.id === m.restaurantId)
            return m.name.toLowerCase().includes(query) ||
                m.category?.toLowerCase().includes(query) ||
                restaurant?.name.toLowerCase().includes(query)
        }
        return true
    })

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', price: '', category: '', description: '', imageUrl: '', isPopular: false, isAvailable: true })
        setEditingId(null)
        setShowForm(false)
    }

    // Mở form sửa
    const handleEdit = (item: MenuItem) => {
        setFormData({
            name: item.name,
            price: item.price.toString(),
            category: item.category || '',
            description: item.description || '',
            imageUrl: item.imageUrl || '',
            isPopular: item.isPopular,
            isAvailable: item.isAvailable !== false
        })
        setSelectedRestaurant(item.restaurantId)
        setEditingId(item.id)
        setShowForm(true)
    }

    // Lưu món
    const handleSave = async () => {
        if (!formData.name.trim() || !formData.price || !selectedRestaurant) {
            alert('Vui lòng nhập đầy đủ: tên món, giá, và chọn quán!')
            return
        }

        setSaving(true)
        try {
            const data = {
                name: formData.name.trim(),
                price: parseInt(formData.price),
                category: formData.category.trim(),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim(),
                isPopular: formData.isPopular,
                isAvailable: formData.isAvailable,
                restaurantId: selectedRestaurant
            }

            if (editingId) {
                await updateDoc(doc(db, 'menuItems', editingId), data)
            } else {
                await addDoc(collection(db, 'menuItems'), {
                    ...data,
                    createdAt: serverTimestamp()
                })
            }

            onRefresh()
            resetForm()
        } catch (error) {
            console.error('Lỗi khi lưu:', error)
            alert('Có lỗi xảy ra!')
        } finally {
            setSaving(false)
        }
    }

    // Xóa món
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xóa món "${name}"?`)) return

        try {
            await deleteDoc(doc(db, 'menuItems', id))
            onRefresh()
        } catch (error) {
            console.error('Lỗi:', error)
        }
    }

    // Format giá
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
    }

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>🍽️ Danh sách món ăn ({filteredMenu.length}/{menuItems.length})</h2>
                <div className="section-actions">
                    {/* View toggle */}
                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Xem dạng lưới"
                        >
                            <Grid3X3 size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="Xem dạng danh sách"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    {/* Size controls - chỉ hiện khi grid mode */}
                    {viewMode === 'grid' && (
                        <div className="size-control">
                            <button
                                className="size-btn"
                                onClick={() => setCardSize(prev => Math.max(2, prev - 1))}
                                disabled={cardSize <= 2}
                                title="Phóng to"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="size-label">{cardSize} cột</span>
                            <button
                                className="size-btn"
                                onClick={() => setCardSize(prev => Math.min(6, prev + 1))}
                                disabled={cardSize >= 6}
                                title="Thu nhỏ"
                            >
                                <PlusCircle size={16} />
                            </button>
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={18} />
                        Thêm món
                    </button>
                </div>
            </div>

            {/* Thanh tìm kiếm và filter */}
            <div className="filter-row">
                {/* Search bar */}
                <div className="search-bar glass-card">
                    <Search size={18} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm nhanh món, loại, quán..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery('')}>
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter by restaurant */}
                <select
                    className="input filter-select"
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                >
                    <option value="">Tất cả quán</option>
                    {restaurants.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>

            {/* Form */}
            {showForm && (
                <motion.div
                    className="admin-form glass-card"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <div className="form-header">
                        <h3>{editingId ? '✏️ Sửa món' : '➕ Thêm món mới'}</h3>
                        <button className="btn-icon" onClick={resetForm}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Chọn quán *</label>
                            <select
                                className="input"
                                value={selectedRestaurant}
                                onChange={(e) => setSelectedRestaurant(e.target.value)}
                            >
                                <option value="">-- Chọn quán --</option>
                                {restaurants.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tên món *</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: Nem nướng Nha Trang"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Giá (VNĐ) *</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="VD: 35000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Loại món</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: Nem nướng"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mô tả</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Mô tả ngắn..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>URL ảnh món</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="VD: /food/assets/menu/mon-an.jpg"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                            {formData.imageUrl && (
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                />
                                ⭐ Món phổ biến
                            </label>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                />
                                ✅ Còn phục vụ
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-secondary" onClick={resetForm}>Hủy</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <Save size={18} />
                            {saving ? 'Đang lưu...' : 'Lưu món'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Danh sách */}
            <div
                className={`admin-list ${viewMode === 'grid' ? 'admin-grid' : 'admin-rows'}`}
                style={viewMode === 'grid' ? {
                    gridTemplateColumns: `repeat(${cardSize}, 1fr)`
                } : undefined}
            >
                {filteredMenu.length > 0 ? (
                    filteredMenu.map(item => {
                        const restaurant = restaurants.find(r => r.id === item.restaurantId)
                        return (
                            <motion.div
                                key={item.id}
                                className={`admin-item glass-card ${viewMode === 'grid' ? 'admin-card menu-card' : 'admin-row'}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Ảnh món (Grid mode) */}
                                {viewMode === 'grid' && (
                                    <div
                                        className="card-image"
                                        style={{
                                            background: item.imageUrl
                                                ? `url(${item.imageUrl}) center/cover`
                                                : `linear-gradient(135deg, #00F5D4 0%, #845EC2 100%)`
                                        }}
                                    >
                                        <div className="card-overlay">
                                            <span className="card-emoji">🍜</span>
                                        </div>
                                        {item.isPopular && (
                                            <span className="card-badge popular">⭐ Nổi bật</span>
                                        )}
                                        {!item.isAvailable && (
                                            <span className="card-badge unavailable">Hết</span>
                                        )}
                                    </div>
                                )}

                                <div className="item-info">
                                    <h4>
                                        {viewMode === 'list' && item.isPopular && '⭐ '}
                                        {item.name}
                                        {viewMode === 'list' && !item.isAvailable && <span className="unavailable"> (Hết)</span>}
                                    </h4>
                                    <p className="price">{formatPrice(item.price)}</p>
                                    <p className="item-restaurant">
                                        <Store size={14} />
                                        {restaurant?.name || 'Không xác định'}
                                    </p>
                                    {item.category && (
                                        <span className="item-tag">{item.category}</span>
                                    )}
                                </div>

                                <div className="item-actions">
                                    <button className="btn-icon edit" onClick={() => handleEdit(item)} title="Sửa">
                                        <Edit size={18} />
                                    </button>
                                    <button className="btn-icon delete" onClick={() => handleDelete(item.id, item.name)} title="Xóa">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="empty-admin">
                        <span>🍽️</span>
                        <p>
                            {selectedRestaurant
                                ? 'Quán này chưa có món nào. Hãy thêm món đầu tiên!'
                                : 'Chưa có món ăn nào. Hãy thêm món đầu tiên!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPage
