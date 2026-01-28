'use client'

import React, { useState } from 'react'

interface PostImageProps {
    src: string
    alt: string
    className?: string
    fallbackSrc?: string
    style?: React.CSSProperties
}

export default function PostImage({
    src,
    alt,
    className,
    fallbackSrc = '/assets/img/logo.png',
    style
}: PostImageProps) {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
            onError={() => setImgSrc(fallbackSrc)}
        />
    )
}
