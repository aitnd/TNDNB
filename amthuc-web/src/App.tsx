// App chính - Routing và Layout
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import AdminPage from './pages/AdminPage'
import { Restaurant, MenuItem } from './types'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

function App() {
    // State lưu trữ dữ liệu
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
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

            // Load restaurants - không dùng orderBy để tránh lỗi index
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

            setRestaurants(restaurantsData)
            setMenuItems(menuData)
        } catch (error) {
            console.error('Lỗi khi load dữ liệu:', error)
            // Vẫn setLoading(false) để hiển thị empty state thay vì loading mãi
        } finally {
            setLoading(false)
        }
    }

    // Hàm refresh dữ liệu (gọi sau khi thêm/sửa/xóa)
    const refreshData = () => {
        loadData()
    }

    return (
        <BrowserRouter basename="/amthuc">
            <div className="app">
                <Header
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <main className="main-content">
                    <Routes>
                        {/* Trang chính - Dashboard (danh sách quán) */}
                        <Route
                            path="/dashboard"
                            element={
                                <HomePage
                                    restaurants={restaurants}
                                    menuItems={menuItems}
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
                        {/* Trang Admin - Quản lý */}
                        <Route
                            path="/admin/*"
                            element={
                                <AdminPage
                                    restaurants={restaurants}
                                    menuItems={menuItems}
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
