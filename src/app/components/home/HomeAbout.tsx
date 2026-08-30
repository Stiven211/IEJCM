import { memo } from 'react'
import { BookOpen, Award, ArrowRight } from 'lucide-react'
import type { SchoolInfo } from '../../../services/schoolInfo.service'
import { ResilientImage } from '../ui/ResilientImage'

interface HomeAboutProps {
  schoolInfo: SchoolInfo | null
  onLearnMore?: () => void
}

export const HomeAbout = memo(function HomeAbout({ schoolInfo, onLearnMore }: HomeAboutProps) {
  const history = schoolInfo?.history || ''
  const mission = schoolInfo?.mission || ''
  const vision = schoolInfo?.vision || ''
  const hasContent = history || mission || vision

  return (
    <section id="sobre-nosotros" className="fade-in-up" style={{ padding: 'clamp(64px, 9vw, 108px) 24px', backgroundColor: '#FFFFFF', animationDelay: '100ms' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', backgroundColor: '#E8F5E9', color: '#006400', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px' }}>
            Sobre Nosotros
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#1A1A1A', marginBottom: '20px', lineHeight: 1.18, letterSpacing: '-0.02em' }}>
            Formando el talento<br />
            <span style={{ color: '#006400' }}>de la Amazonía</span>
          </h2>
          <p style={{ color: '#4A5E4A', lineHeight: 1.85, marginBottom: '18px', fontSize: '16px' }}>
            {history ? history.split('\n').slice(0, 2).join('\n') : ''}
          </p>

          {hasContent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(mission || vision ? [
                { icon: BookOpen, text: mission ? `Misión: ${mission.split('\n')[0]}` : '' },
                { icon: Award, text: vision ? `Visión: ${vision.split('\n')[0]}` : '' },
              ].filter(Boolean) : []).map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: 36, height: 36, backgroundColor: '#E8F5E9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} style={{ color: '#006400' }} />
                  </div>
                  <span style={{ color: '#3A4E3A', fontSize: '14px', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#5A7A5A', fontSize: '14px' }}>Información no disponible.</div>
          )}

          {onLearnMore && (
            <button
              onClick={onLearnMore}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)', marginTop: '8px' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
              onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
              onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
            >
              Conocer más <ArrowRight size={15} />
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#E8F5E9' }}>
            <ResilientImage
              src={schoolInfo?.hero_image_url || 'https://images.unsplash.com/photo-1727518493216-d75fcdb3f2b2?w=800&h=600&fit=crop&auto=format'}
              alt="Estudiantes del Colegio"
              fallbackLabel="Imagen institucional no disponible"
              loading="lazy"
              decoding="async"
              onLoad={e => (e.target as HTMLImageElement).style.opacity = '1'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/3', opacity: 0, transition: 'opacity 300ms ease' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: -20, left: -20, backgroundColor: '#006400', color: '#FFFFFF', borderRadius: '12px', padding: '16px 22px', boxShadow: '0 10px 32px rgba(0,100,0,0.35)' }}>
            <div style={{ fontSize: '30px', fontWeight: 800, lineHeight: 1 }}>48°</div>
            <div style={{ fontSize: '13px', opacity: 0.82, marginTop: '4px' }}>Aniversario 2026</div>
          </div>
        </div>
      </div>
    </section>
  )
})
