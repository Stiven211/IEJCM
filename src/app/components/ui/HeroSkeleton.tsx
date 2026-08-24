import type { CSSProperties } from 'react'

interface HeroSkeletonProps {
  badge?: string
  badgeColor?: string
  visible?: boolean
  style?: CSSProperties
}

const shimmerBackground = `linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.10) 75%)`

export function HeroSkeleton({
  badge = 'Año Escolar 2026 — Inscripciones Abiertas',
  badgeColor = '#991B1B',
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

        <div style={{ marginBottom: '24px' }}>
          {[0.72, 0.48, 0.62].map((width, index) => (
            <div
              key={index}
              className="sk"
              style={{
                height: 'clamp(38px, 6.5vw, 76px)',
                width: `${Math.round(width * 100)}%`,
                maxWidth: index === 0 ? '740px' : '100%',
                borderRadius: 16,
                marginTop: index === 0 ? 0 : 4,
                backgroundImage: shimmerBackground,
                backgroundSize: '200% 100%',
                animationName: 'shimmer',
                animationDuration: '2s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${index * 0.12}s`,
              }}
            />
          ))}
        </div>

        <div
          className="sk"
          style={{
            height: 'clamp(15px, 1.8vw, 19px)',
            width: '72%',
            maxWidth: '560px',
            marginBottom: '44px',
            borderRadius: '999px',
            backgroundImage: shimmerBackground,
            backgroundSize: '200% 100%',
            animationName: 'shimmer',
            animationDuration: '2s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '0.25s',
          }}
        />

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