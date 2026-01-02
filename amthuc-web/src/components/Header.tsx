// Header component với logo và thanh tìm kiếm
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
    searchQuery: string
    onSearchChange: (query: string) => void
}

function Header({ searchQuery, onSearchChange }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-emoji">🍜</span>
                        <span className="logo-text gradient-text">Đói Ăn Gì?</span>
                    </Link>

                    {/* Search bar - Desktop */}
                    <div className="search-wrapper desktop-only">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm món ăn hoặc quán..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Navigation */}
                    <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
                        <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                            🏠 Trang chủ
                        </Link>
                        <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                            ⚙️ Quản lý
                        </Link>
                        <a
                            href="https://daotaothuyenvien.com"
                            className="nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            🌐 Về trang chính
                        </a>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Search bar - Mobile */}
                <div className="search-wrapper mobile-only">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm món ăn hoặc quán..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </header>
    )
}

export default Header
