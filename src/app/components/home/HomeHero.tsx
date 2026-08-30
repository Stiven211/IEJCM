import { memo } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { HeroSkeleton } from '../ui/HeroSkeleton'
import { ResilientImage } from '../ui/ResilientImage'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeHeroProps {
  schoolName: string
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  heroBadge: string
  heroBadgeColor: string
  aboutText: string
  history: string
  heroLoaded: boolean
  showOverlay: boolean
  onViewEvents: () => void
  onScrollToAbout: () => void
}

export const HomeHero = memo(function HomeHero({
  schoolName,
  heroImage,
  heroTitle,
  heroSubtitle,
  heroBadge,
  heroBadgeColor,
   aboutText,
   history,
   heroLoaded,
  showOverlay,
  onViewEvents,
  onScrollToAbout,
}: HomeHeroProps) {
  const description = history || heroSubtitle || aboutText

  return (
    <section id="inicio" style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: '#002200' }}>
      <ResilientImage
        src={heroImage}
        alt={schoolName}
        fallbackLabel="Imagen principal no disponible"
        decoding="async"
        fetchPriority="high"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.32 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, rgba(0,30,0,0.96) 0%, rgba(0,80,0,0.72) 55%, rgba(0,40,0,0.88) 100%)' }} />

      <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(80px,10vw,120px) 24px clamp(60px,8vw,80px)', color: '#FFFFFF', opacity: heroLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <div className="fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '24px', padding: '8px 18px', marginBottom: '28px', backdropFilter: 'blur(6px)', animationDelay: '100ms' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', boxShadow: '0 0 8px ' + heroBadgeColor, backgroundColor: heroBadgeColor }} />
          <span style={{ fontSize: '13px', letterSpacing: '0.04em', color: '#FFFFFF' }}>{heroBadge}</span>
        </div>

        <h1 className="fade-in-up" style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, lineHeight: 1.06, maxWidth: '740px', marginBottom: '24px', letterSpacing: '-0.025em', animationDelay: '180ms' }}>
          {heroTitle || 'Educando para'}
          <br />
          <span style={{ color: '#86EFAC' }}>{heroSubtitle || 'Transformar'}</span>
          <br />
          el Futuro
        </h1>

         {description && (
        <p className="fade-in-up" style={{ fontSize: 'clamp(15px, 1.8vw, 19px)', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', marginBottom: '44px', lineHeight: 1.78, animationDelay: '240ms' }}>
          {description}
        </p>
         )}

        <div className="fade-in-up" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', animationDelay: '300ms' }}>
          <button
            onClick={onViewEvents}
            style={{ backgroundColor: '#FFFFFF', color: '#006400', border: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.01em', transition: TRANSITION, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Ver Eventos <ArrowRight size={16} />
          </button>
          <button
            onClick={onScrollToAbout}
            style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.01em', fontFamily: 'inherit', transition: TRANSITION }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.8)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseDown={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'scale(0.97)'; b.style.borderColor = 'rgba(255,255,255,1)' }}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Sobre el Colegio
          </button>
        </div>
      </div>

      <div
        onClick={onScrollToAbout}
        role="button"
        tabIndex={0}
        aria-label="Desplazar hacia abajo"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onScrollToAbout() } }}
        className="fade-in-up"
        style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', opacity: heroLoaded ? 1 : 0, transition: 'opacity 0.5s ease', animationDelay: '400ms', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.12em' }}>DESPLAZAR</span>
        <ChevronDown size={17} />
      </div>

      {showOverlay && (
         <HeroSkeleton
           badge={heroBadge}
           badgeColor={heroBadgeColor}
           visible={showOverlay}
         />
      )}
    </section>
  )
})
