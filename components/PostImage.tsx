'use client'

import React, { useState } from 'react'

interface PostImageProps {
    src: string
    alt: string
    className?: string
    fallbackSrc?: string
    style?: React.CSSProperties
}

import Image from 'next/image'

export default function PostImage({
    src,
    alt,
    className,
    fallbackSrc = '/assets/img/logo.png',
    style
}: PostImageProps) {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <Image
            src={imgSrc}
            alt={alt}
            className={className}
            style={{ width: '100%', height: 'auto', ...style }}
            width={1200}
            height={800}
            onError={() => setImgSrc(fallbackSrc)}
            loading="lazy"
        />
    )
}
