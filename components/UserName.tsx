import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

interface UserNameProps {
    name: string
    role?: string
    courseId?: string
    className?: string
    showIcon?: boolean
    style?: React.CSSProperties
}

export default function UserName({ name, role, courseId, className = '', showIcon = true, style = {} }: UserNameProps) {
    const isManager = role && ['admin', 'quan_ly', 'lanh_dao'].includes(role)
    const isVerifiedStudent = role === 'hoc_vien' && courseId

    if (isManager) {
        return (
            <span className={`${className}`} style={{ color: '#d4b106', fontWeight: 600, ...style }}>
                {name}
            </span>
        )
    }

    if (isVerifiedStudent) {
        return (
            <span className={`${className}`} style={{ color: '#1890ff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', ...style }}>
                {name}
                {showIcon && <FaCheckCircle style={{ fontSize: '0.9em' }} />}
            </span>
        )
    }

    return <span className={className} style={style}>{name}</span>
}
