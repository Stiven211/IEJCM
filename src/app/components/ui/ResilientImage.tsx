import { useState } from 'react'
import type { CSSProperties, ImgHTMLAttributes } from 'react'

interface ResilientImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
    fallbackLabel?: string
    fallbackStyle?: CSSProperties
    onError?: () => void
}

export function ResilientImage({ src, alt, style, fallbackLabel = 'Imagen no disponible', fallbackStyle, onError, fetchPriority, ...props }: ResilientImageProps) {
    const [failed, setFailed] = useState(!src)

    if (failed) {
        return (
            <div
                role="img"
                aria-label={alt || fallbackLabel}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    minHeight: '80px',
                    backgroundColor: '#E8F5E9',
                    color: '#5A7A5A',
                    fontSize: '12px',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '12px',
                    boxSizing: 'border-box',
                    ...style,
                    opacity: 1,
                    ...fallbackStyle,
                }}
            >
                {fallbackLabel}
            </div>
        )
    }

    return (
        <img
            {...props}
            src={src}
            alt={alt}
            fetchpriority={fetchPriority}
            style={style}
            onError={() => {
                setFailed(true)
                onError?.()
            }}
        />
    )
}
