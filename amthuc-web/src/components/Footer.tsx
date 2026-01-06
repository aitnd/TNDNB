// Footer component
import { Heart, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span>🍜</span>
                            <span className="gradient-text">Đói Ăn Gì?</span>
                        </Link>
                        <p className="footer-desc">
                            Khám phá ẩm thực Ninh Bình - Tìm quán ăn ngon, xem menu và đặt món dễ dàng!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4>Liên kết</h4>
                        <ul>
                            <li><Link to="/dashboard">🏠 Trang chủ</Link></li>
                            <li><Link to="/admin">⚙️ Quản lý quán</Link></li>
                            <li><a href="https://daotaothuyenvien.com">🌐 Trang chính</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact">
                        <h4>Liên hệ</h4>
                        <div className="contact-item">
                            <MapPin size={16} />
                            <span>TP.Hoa Lư, Ninh Bình</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={16} />
                            <span>Hotline hỗ trợ</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p>
                        Made with <Heart size={14} className="heart-icon" /> by{' '}
                        <a className="gradient-text">
                            <span>Horizon</span>
                        </a>
                    </p>
                    <p className="copyright">© {currentYear} BlueHorizon Studio - All rights reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
