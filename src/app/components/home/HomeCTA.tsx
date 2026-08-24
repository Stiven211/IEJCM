import { memo } from 'react'

const TRANSITION = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'

interface HomeCTAProps {
  onContact: () => void
  onViewEvents: () => void
}

export const HomeCTA = memo(function HomeCTA({ onContact, onViewEvents }: HomeCTAProps) {
  return (
    <section className="fade-in-up" style={{ backgroundColor: '#006400', padding: 'clamp(64px, 9vw, 100px) 24px', textAlign: 'center', animationDelay: '250ms' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', color: '#FFFFFF' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: 1.18 }}>
          ¿Listo para unirte a nuestra<br />familia educativa?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '17px', lineHeight: 1.78, marginBottom: '40px' }}>
          Las inscripciones para el año escolar 2027 estarán abiertas en octubre de 2026. Contáctanos para más información sobre el proceso de matrícula.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onContact}
            style={{ backgroundColor: '#FFFFFF', color: '#006400', border: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', transition: TRANSITION }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'}
            onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Contáctanos
          </button>
          <button
            onClick={onViewEvents}
            style={{ backgroundColor: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: TRANSITION }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'}
            onMouseDown={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'scale(0.97)'; b.style.borderColor = 'rgba(255,255,255,1)' }}
            onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
          >
            Ver Eventos
          </button>
        </div>
      </div>
    </section>
  )
})
