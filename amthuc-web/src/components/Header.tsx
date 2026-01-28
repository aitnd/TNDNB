// Header component với logo và thanh tìm kiếm
import { Search, Menu, X, ChevronDown, Link2, Newspaper, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
    searchQuery: string
    onSearchChange: (query: string) => void
}

function Header({ searchQuery, onSearchChange }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showLinksDropdown, setShowLinksDropdown] = useState(false)

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <span className="logo-emoji">🏔️</span>
                        <span className="logo-text gradient-text">Khám Phá Ninh Bình</span>
                    </Link>

                    {/* Search bar - Desktop */}
                    <div className="search-wrapper desktop-only">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm quán ăn, địa điểm..."
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

                        {/* Dropdown Liên kết */}
                        <div className="nav-dropdown">
                            <button
                                className="nav-link nav-dropdown-btn"
                                onClick={() => setShowLinksDropdown(!showLinksDropdown)}
                                onBlur={() => setTimeout(() => setShowLinksDropdown(false), 200)}
                            >
                                <Link2 size={16} />
                                Liên kết
                                <ChevronDown size={14} className={`dropdown-arrow ${showLinksDropdown ? 'rotate' : ''}`} />
                            </button>

                            {showLinksDropdown && (
                                <div className="dropdown-menu">
                                    <a href="/" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        <Newspaper size={16} />
                                        Tin tức
                                    </a>
                                    <a href="/ontap" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                                        <BookOpen size={16} />
                                        Ôn tập
                                    </a>
                                </div>
                            )}
                        </div>
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
                        placeholder="Tìm quán ăn, địa điểm..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </header>
    )
}

export default Header
