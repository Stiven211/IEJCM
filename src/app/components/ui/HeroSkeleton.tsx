import type { CSSProperties } from 'react'

interface HeroSkeletonProps {
  badge?: string
  badgeColor?: string
  title?: string
  subtitle?: string
  description?: string
  visible?: boolean
  style?: CSSProperties
}

const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function HeroSkeleton({
  badge = 'Año Escolar 2026 — Inscripciones Abiertas',
  badgeColor = '#991B1B',
  title = 'Educando para',
  subtitle = 'Transformar',
  description = '',
  visible = true,
  style,
}: HeroSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        backgroundColor: '#002200',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        pointerEvents: 'none',
        visibility: visible ? 'visible' : 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(80px,10vw,120px) 24px clamp(60px,8vw,80px)',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            padding: '8px 18px',
            marginBottom: '28px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              boxShadow: `0 0 8px ${badgeColor}`,
              backgroundColor: badgeColor,
            }}
          />
          <span
            className="sk"
            style={{
              height: 14,
              width: Math.min(badge.length * 7.5, 220),
              maxWidth: '60vw',
              borderRadius: 12,
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              animationName: 'shimmer',
              animationDuration: '2s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
        </div>

        <h1
          aria-hidden="true"
          style={{
            fontSize: 'clamp(38px, 6.5vw, 76px)',
            fontWeight: 800,
            lineHeight: 1.06,
            maxWidth: '740px',
            margin: '0 0 24px',
            letterSpacing: '-0.025em',
            color: 'transparent',
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        >
          {title}
          <br />
          <span>{subtitle}</span>
          <br />
          el Futuro
        </h1>

        <p
          aria-hidden="true"
          style={{
            fontSize: 'clamp(15px, 1.8vw, 19px)',
            lineHeight: 1.78,
            maxWidth: '560px',
            marginBottom: '44px',
            minHeight: description ? '2em' : 0,
            color: 'transparent',
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            animation: 'shimmer 2s ease-in-out infinite 0.25s',
          }}
        >
          {description}
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div
            className="sk"
            style={{
              height: '52px',
              minWidth: '140px',
              borderRadius: '8px',
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              animationName: 'shimmer',
              animationDuration: '2s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '0.32s',
            }}
          />
          <div
            className="sk"
            style={{
              height: '52px',
              minWidth: '160px',
              borderRadius: '8px',
              backgroundImage: shimmerBackground,
              backgroundSize: '200% 100%',
              animationName: 'shimmer',
              animationDuration: '2s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '0.4s',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <div
          className="sk"
          style={{
            width: '64px',
            height: '10px',
            borderRadius: 20,
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            animationName: 'shimmer',
            animationDuration: '2s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '0.48s',
          }}
        />
        <div
          className="sk"
          style={{
            width: '17px',
            height: '17px',
            borderRadius: '50%',
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            animationName: 'shimmer',
            animationDuration: '2s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '0.55s',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}