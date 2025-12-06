'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTheme, ThemeMode } from '../context/ThemeContext'
import { FaPalette } from 'react-icons/fa'
import styles from './ThemeSwitcher.module.css'

const themes: { name: ThemeMode; label: string; color: string }[] = [
    { name: 'light', label: 'Sáng', color: '#ffffff' },
    { name: 'dark', label: 'Tối', color: '#0f172a' },
    { name: 'noel', label: 'Giáng Sinh', color: '#8B0000' },
    { name: 'modern', label: 'Hiện Đại', color: '#4f46e5' },
    { name: 'classic', label: 'Cổ Điển', color: '#6F6049' },
    { name: 'sunrise', label: 'Bình Minh', color: '#f97316' },
    { name: 'tri-an', label: 'Tri Ân', color: '#f87171' },
]

export default function ThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleThemeChange = (newTheme: ThemeMode) => {
        setTheme(newTheme)
        setIsOpen(false)
    }

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.triggerBtn}
                title="Đổi giao diện"
            >
                <FaPalette className={styles.icon} />
                <span className={styles.text}>Giao diện</span>
                {/* Chỉ thị màu theme hiện tại */}
                <span
                    className={styles.indicator}
                    style={{ backgroundColor: themes.find(t => t.name === theme)?.color || 'transparent' }}
                ></span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => handleThemeChange(t.name)}
                            className={`${styles.dropdownItem} ${theme === t.name ? styles.activeItem : ''}`}
                        >
                            <span
                                className={styles.colorDot}
                                style={{ backgroundColor: t.color }}
                            ></span>
                            {t.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
