// App chính - Routing và Layout - "Khám Phá Ninh Bình"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import AttractionDetailPage from './pages/AttractionDetailPage'
import AdminPage from './pages/AdminPage'
import { Restaurant, MenuItem, Attraction } from './types'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

function App() {
    // State lưu trữ dữ liệu
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [attractions, setAttractions] = useState<Attraction[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Load dữ liệu từ Firebase khi mount
    useEffect(() => {
        loadData()
    }, [])

    // Hàm load dữ liệu từ Firestore
    const loadData = async () => {
        try {
            setLoading(true)

            // Load restaurants
            const restaurantsRef = collection(db, 'restaurants')
            const restaurantsSnap = await getDocs(restaurantsRef)
            const restaurantsData = restaurantsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Restaurant[]

            // Load menu items
            const menuRef = collection(db, 'menuItems')
            const menuSnap = await getDocs(menuRef)
            const menuData = menuSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as MenuItem[]

            // Load attractions (địa điểm du lịch)
            const attractionsRef = collection(db, 'attractions')
            const attractionsSnap = await getDocs(attractionsRef)
            const attractionsData = attractionsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Attraction[]

            setRestaurants(restaurantsData)
            setMenuItems(menuData)
            setAttractions(attractionsData)
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error)
        } finally {
            setLoading(false)
        }
    }

    // Hàm refresh dữ liệu
    const refreshData = () => {
        loadData()
    }

    return (
        <BrowserRouter basename="/food">
            <div className="app">
                <Header
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <main className="main-content">
                    <Routes>
                        {/* Trang chủ tổng hợp - Ẩm thực + Địa điểm */}
                        <Route
                            path="/dashboard"
                            element={
                                <HomePage
                                    restaurants={restaurants}
                                    menuItems={menuItems}
                                    attractions={attractions}
                                    loading={loading}
                                    searchQuery={searchQuery}
                                />
                            }
                        />
                        {/* Redirect / về /dashboard */}
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        {/* Chi tiết quán ăn */}
                        <Route
                            path="/quan/:id"
                            element={
                                <RestaurantPage
                                    restaurants={restaurants}
                                    menuItems={menuItems}
                                    loading={loading}
                                />
                            }
                        />
                        {/* Chi tiết địa điểm du lịch */}
                        <Route
                            path="/dia-diem/:id"
                            element={
                                <AttractionDetailPage
                                    attractions={attractions}
                                    loading={loading}
                                />
                            }
                        />
                        {/* Trang Admin - Quản lý */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminPage
                                    restaurants={restaurants}
                                    menuItems={menuItems}
                                    attractions={attractions}
                                    onRefresh={refreshData}
                                />
                            }
                        />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    )
}

export default App
