import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Calendar, Clock, MapPin, Tag, Share2 } from 'lucide-react'
import { EVENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/events'
import { EventCard } from './EventCard'

export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const event = EVENTS.find(e => e.id === id)

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', backgroundColor: '#F8F8F8', minHeight: '60vh' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>Evento no encontrado</div>
        <button
          onClick={() => navigate('/eventos')}
          style={{ color: '#006400', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px', fontWeight: 600 }}
        >
          ← Volver a Eventos
        </button>
      </div>
    )
  }

  const date = new Date(event.date + 'T00:00:00')
  const formattedDate = date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  const catColor = CATEGORY_COLORS[event.category]
  const catLabel = CATEGORY_LABELS[event.category]

  const relatedEvents = EVENTS.filter(e => e.id !== event.id && e.category === event.category).slice(0, 3)

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
      <div style={{ position: 'relative', height: 'clamp(300px, 48vh, 520px)', overflow: 'hidden', backgroundColor: '#002200' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,15,0,0.97) 0%, rgba(0,40,0,0.6) 45%, transparent 100%)' }} />

        <button
          onClick={() => navigate('/eventos')}
          style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.35)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.55)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(0,0,0,0.35)'}
        >
          <ArrowLeft size={15} /> Volver a Eventos
        </button>

        <div style={{ position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ backgroundColor: catColor.bg, color: catColor.text, display: 'inline-block', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
              {catLabel}
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(22px, 4.5vw, 46px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.12, maxWidth: '820px', margin: 0 }}>
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', alignItems: 'flex-start' }}>

          <div>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: 'clamp(24px, 3vw, 40px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 14px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '22px' }}>Sobre este evento</h2>
              {event.fullDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} style={{ color: '#3A4E3A', fontSize: '16px', lineHeight: 1.88, marginBottom: '18px' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#5A7A5A', fontSize: '14px' }}>Compartir:</span>
              <button
                onClick={handleShare}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', backgroundColor: '#E8F5E9', color: '#006400', border: 'none', padding: '8px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8E6C9'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E8F5E9'}
              >
                <Share2 size={14} /> Copiar enlace
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#1A1A1A', marginBottom: '22px' }}>Detalles del Evento</h3>

              {[
                { icon: Calendar, label: 'Fecha', value: displayDate },
                { icon: Clock, label: 'Hora', value: `${event.time}${event.endTime ? ` — ${event.endTime}` : ''}` },
                { icon: MapPin, label: 'Lugar', value: event.location },
                { icon: Tag, label: 'Categoría', value: catLabel },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '18px', alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, backgroundColor: '#E8F5E9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} style={{ color: '#006400' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#5A7A5A', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    <div style={{ fontSize: '14px', color: '#1A1A1A', fontWeight: 600, lineHeight: 1.55 }}>{value}</div>
                  </div>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '20px', marginTop: '6px' }}>
                <button
                  onClick={() => navigate('/#contacto')}
                  style={{ width: '100%', backgroundColor: '#006400', color: '#FFFFFF', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#228B22'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#006400'}
                >
                  Solicitar más información
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedEvents.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A1A', marginBottom: '24px', letterSpacing: '-0.01em' }}>
              Eventos relacionados
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {relatedEvents.map(e => (
                <EventCard key={e.id} event={e} onClick={() => { navigate(`/eventos/${e.id}`); window.scrollTo(0, 0) }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
