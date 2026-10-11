import { memo } from 'react'
import { Award, ArrowRight } from 'lucide-react'

interface HomeIcfesNoticeProps {
  onViewMore: () => void
}

/**
 * Aviso pequeno en la portada que anuncia que la seccion de ICFES ya esta
 * disponible.
 *
 * El componente padre decide si se renderiza: si la seccion esta apagada, este
 * componente ni siquiera aparece en el arbol. Asi no queda un hueco vacio ni
 * un borde que se ve raro.
 */
export const HomeIcfesNotice = memo(function HomeIcfesNotice({ onViewMore }: HomeIcfesNoticeProps) {
  return (
    <section id="icfes" style={{ padding: 'clamp(28px, 4vw, 48px) clamp(20px, 4vw, 32px)' }}>
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          background: '#FFFFFF',
          border: '1px solid rgba(0,80,0,0.16)',
          borderLeft: '4px solid #006400',
          borderRadius: '12px',
          padding: 'clamp(20px, 3vw, 30px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 2.5vw, 26px)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '12px',
            background: '#E8F5E9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Award size={26} color="#006400" />
        </div>

        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: '#1A1A1A', marginBottom: '4px' }}>
            Ya está disponible la sección de ICFES
          </div>
          <div style={{ fontSize: '14px', color: '#3A4E3A', lineHeight: 1.55 }}>
            Consulta las fechas y toda la información de la temporada, y conoce a los mejores
            resultados del colegio.
          </div>
        </div>

        <button
          type="button"
          onClick={onViewMore}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '8px',
            background: '#006400',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          Ver más
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
})
